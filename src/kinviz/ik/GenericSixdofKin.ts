/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

/*

int compute_jfwd(go_link * link_params,int link_number,go_matrix * Jfwd,go_pose * T_L_0)

int compute_jinv(go_matrix * Jfwd, go_matrix * Jinv)


int genser_kin_jac_inv(void *kins,const go_pose * pos,const go_screw * vel, const go_real * joints, go_real * jointvels)
calls jointSet, genser_kin_compute_jfwd, genser_kin_compute_jinv
>>not sure what calls this


int genserKinematicsInverse(const EmcPose * world,double *joints,const KINEMATICS_INVERSE_FLAGS * iflags,KINEMATICS_FORWARD_FLAGS * fflags)
calls compute_jwd compute_jinv and genser_kin_fwd

int genser_kin_jac_fwd(void *kins,const go_real * joints,const go_real * jointvels, const go_pose * pos, go_screw * vel)
??not sure what calls this

int genserKinematicsForward(const double *joint, EmcPose * world, const KINEMATICS_FORWARD_FLAGS * fflags,KINEMATICS_INVERSE_FLAGS * iflags)
calls genser_kin_fwd

int genser_kin_fwd(void *kins, const go_real * joints, go_pose * pos)
calls jointSet and poseBuild

 */

import {
    go_cart,
    go_cart_vector_convert,
    go_dh_pose_convert,
    KinematicsLink,
    MatrixN,
    Pose,
    go_matrix_inv,
    go_matrix_matrix_add,
    go_matrix_matrix_copy,
    go_matrix_matrix_mult,
    go_matrix_transpose,
    go_matrix_vector_cross,
    go_pose_pose_mult,
    go_quat,
    go_quat_inv,
    go_quat_matrix_convert,
    go_rpy,
    go_rpy_quat_convert,
    go_rvec,
    go_screw,
    go_vector,
    LinkParamRepresentation,
    LinkQuantities,
    retval
} from "./IkMath"

// #define DEFAULT_A1 0
// #define DEFAULT_ALPHA1 0
// #define DEFAULT_D1 0
//
// #define DEFAULT_A2 0
// #define DEFAULT_ALPHA2 -PI_2
// #define DEFAULT_D2 0
//
// #define DEFAULT_A3 300
// #define DEFAULT_ALPHA3 0
// #define DEFAULT_D3 70
//
// #define DEFAULT_A4 50
// #define DEFAULT_ALPHA4 -PI_2
// #define DEFAULT_D4 400
//
// #define DEFAULT_A5 0
// #define DEFAULT_ALPHA5 PI_2
// #define DEFAULT_D5 0
//
// #define DEFAULT_A6 0
// #define DEFAULT_ALPHA6 -PI_2
// #define DEFAULT_D6 0

const machine_data = {
    max_iterations: 1000,
    lastIterations: 0,
    a: [0, 0, 300, 50, 0, 0],
    alpha: [0, -Math.PI / 2, 0, -Math.PI / 2, Math.PI / 2, -Math.PI / 2],
    d: [0, 0, 70, 400, 0, 0],
    unrotate: [0, 0, 0, 0, 0, 0]
}

// static struct haldata {
//     hal_u32_t     *max_iterations;
//     hal_u32_t     *last_iterations;
//     hal_float_t   *a[GENSER_MAX_JOINTS];
//     hal_float_t   *alpha[GENSER_MAX_JOINTS];
//     hal_float_t   *d[GENSER_MAX_JOINTS];
//     hal_s32_t     *unrotate[GENSER_MAX_JOINTS];
//     genser_struct *kins;
//     go_pose *pos; // used in various functions, we malloc it
//                   // only once in genserKinematicsSetup()
// } *haldata = 0;

const total_joints = 6

// const j: number[]

// #define A(i) (*(haldata->a[i]))
// #define ALPHA(i) (*(haldata->alpha[i]))
// #define D(i) (*(haldata->d[i]))

// interface Igenser {
//     links: KinematicsLink[] /*!< The link description of the device. */
//     link_num: number /*!< How many are actually present. */
//     iterations: number /*!< How many iterations were actually used to compute the inverse kinematics. */
//     max_iterations: number /*!< Number of iterations after which to give up and report an error. */
// }

const GENSER_MAX_JOINTS = 6

function genser_kin_init() {
    var t = 0
    var tst = 0
    tst = Math.sqrt(tst)
    /* FIXME: should allow LINEAR joints based on HAL param too */

    const gens = new genser()

    for (let t = 0; t < GENSER_MAX_JOINTS; t++) {
        gens.links[t].dh.a = machine_data.a[t]
        gens.links[t].dh.alpha = machine_data.alpha[t]
        gens.links[t].dh.d = machine_data.d[t]
        gens.links[t].dh.theta = 0
        gens.links[t].type = LinkParamRepresentation.LINK_DH
        gens.links[t].unrotate = 0
    }

    gens.link_num = total_joints
}

/* compute the forward jacobian function:
   the jacobian is a linear approximation of the kinematics function.
   It is calculated using derivation of the position transformation matrix,
   and usually used for feeding velocities through it.
   It is analytically possible to calculate the inverse of the jacobian
   (sometimes only the pseudoinverse) and to use that for the inverse kinematics.
*/
function compute_jfwd(
    link_params: KinematicsLink[],
    link_number: number,
    Jfwd: MatrixN,
    T_L_0: Pose
): number {
    var Jv = new MatrixN(3, link_number)
    var Jw = new MatrixN(3, link_number)
    const R_i_ip1 = new MatrixN(3, 3)
    const scratch = new MatrixN(3, link_number)
    // const R_inv = new go_matrix(3, 3)

    var pose: Pose
    var quat: go_quat

    const P_ip1_i = new go_vector(3)
    Jv.el[0][0] = 0
    Jv.el[1][0] = 0
    Jv.el[2][0] = LinkQuantities.GO_QUANTITY_LENGTH == link_params[0].quantity ? 1 : 0
    Jw.el[0][0] = 0
    Jw.el[1][0] = 0
    Jw.el[2][0] = LinkQuantities.QUANTITY_ANGLE == link_params[0].quantity ? 1 : 0

    //     /* initialize inverse rotational transform */
    if (LinkParamRepresentation.LINK_DH == link_params[0].type) {
        const { ret, pout: pose } = go_dh_pose_convert(link_params[0].dh)
    } else if (LinkParamRepresentation.LINK_PP == link_params[0].type) {
        const pose = link_params[0].pp.pose
    } else {
        return retval.GO_RESULT_IMPL_ERROR
    }

    // *T_L_0 = pose;
    //     for (col = 1; col < link_number; col++) {
    //         /* T_ip1_i */
    //         if (GO_LINK_DH == link_params[col].type) {
    //             go_dh_pose_convert(&link_params[col].u.dh, &pose);
    //         } else if (GO_LINK_PP == link_params[col].type) {
    //             pose = link_params[col].u.pp.pose;
    //         } else {
    //             return GO_RESULT_IMPL_ERROR;
    //         }

    var ret1
    for (let col = 1; col < link_number; col++) {
        /* T_ip1_i */
        if (LinkParamRepresentation.LINK_DH == link_params[col].type) {
            ;({ ret: ret1, pout: pose } = go_dh_pose_convert(link_params[col].dh))
        } else if (LinkParamRepresentation.LINK_PP == link_params[col].type) {
            pose = link_params[col].pp.pose
        } else {
            return retval.GO_RESULT_IMPL_ERROR
        }

        const vec = go_cart_vector_convert(pose.tran)

        P_ip1_i[0] = vec[0]
        P_ip1_i[1] = vec[1]
        P_ip1_i[2] = vec[2](({ qout: quat } = go_quat_inv(pose.rot)))

        const { matrix: R_i_ip1 } = go_quat_matrix_convert(quat)

        //         /* Jv */
        const { axv: scratch1 } = go_matrix_vector_cross(Jw, P_ip1_i)
        const { apb: scratch2 } = go_matrix_matrix_add(Jv, scratch1)
        const { ab: scratch3 } = go_matrix_matrix_mult(R_i_ip1, scratch2)

        go_matrix_matrix_copy(Jv, scratch3)

        Jv.el[0][col] = 0
        Jv.el[1][col] = 0
        Jv.el[2][col] = LinkQuantities.GO_QUANTITY_LENGTH == link_params[col].quantity ? 1 : 0

        //         /* Jw */

        const { ab: scratch4 } = go_matrix_matrix_mult(R_i_ip1, Jw)
        go_matrix_matrix_copy(Jw, scratch4)

        Jw.el[0][col] = 0
        Jw.el[1][col] = 0
        Jw.el[2][col] = LinkQuantities.QUANTITY_ANGLE == link_params[col].quantity ? 1 : 0

        if (LinkParamRepresentation.LINK_DH == link_params[col].type) {
            ;({ pout: pose } = go_dh_pose_convert(link_params[col].dh))
        } else if (LinkParamRepresentation.LINK_PP == link_params[col].type) {
            pose = link_params[col].pp.pose
        } else {
            return retval.GO_RESULT_IMPL_ERROR
        }

        ;({ pout: T_L_0 } = go_pose_pose_mult(T_L_0, pose))
    }

    /* rotate back into {0} frame */
    const { matrix: R_inv } = go_quat_matrix_convert(T_L_0.rot)

    ;({ ab: Jv } = go_matrix_matrix_mult(R_inv, Jv))
    ;({ ab: Jw } = go_matrix_matrix_mult(R_inv, Jw))

    /* put Jv atop Jw in J */
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < link_number; col++) {
            if (row < 3) {
                Jfwd.el[row][col] = Jv.el[row][col]
            } else {
                Jfwd.el[row][col] = Jw.el[row - 3][col]
            }
        }
    }

    return retval.GO_RESULT_OK
}

export function compute_jinv(Jfwd: MatrixN): { res: number; Jinv: MatrixN } {
    var Jinv: MatrixN
    var res1: number
    // console.log("m2", Jfwd)
    // const JJT= new go_matrix(6, 6)
    // const JT = new go_matrix(6, 6)
    //     /* compute inverse, or pseudo-inverse */
    if (Jfwd.rows == Jfwd.cols) {
        ;({ ret: res1, minv: Jinv } = go_matrix_inv(Jfwd))
        if (res1 != retval.GO_RESULT_OK) {
            return { res: res1, Jinv: Jfwd }
        }
    } else if (Jfwd.rows < Jfwd.cols) {
        /* underdetermined, optimize on smallest sum of square of speeds */
        /* JT(JJT)inv */

        const { at: JT } = go_matrix_transpose(Jfwd)

        const { ab: JJT } = go_matrix_matrix_mult(Jfwd, JT)

        const { ret: res4, minv: scratch } = go_matrix_inv(JJT)

        go_matrix_matrix_copy(scratch, JJT)

        if (retval.GO_RESULT_OK != res4) return { res: res4, Jinv: Jfwd }

        const { ret: res5, ab: scratch2 } = go_matrix_matrix_mult(JT, JJT)
        go_matrix_matrix_copy(scratch2, Jinv)
    } else {
        /* overdetermined, do least-squares best fit */
        /* (JTJ)invJT */

        // const JTJ = new go_matrix(6, 6)
        // const JT = new go_matrix(6, 6)

        const { ret: res6, at: JT } = go_matrix_transpose(Jfwd)

        const { ret: res7, ab: JTJ } = go_matrix_matrix_mult(JT, Jfwd)
        const { ret: res8, minv: scratch } = go_matrix_inv(JTJ)

        if (retval.GO_RESULT_OK != res8) return { res: res8, Jinv: Jfwd }

        const { ret: res9, ab: scratch5 } = go_matrix_matrix_mult(JTJ, JT)

        go_matrix_matrix_copy(scratch5, Jinv)
    }

    return { res: retval.GO_RESULT_OK, Jinv }
}

function genser_kin_jac_inv(pos: Pose, vel: go_screw, joints: number[], jointvels: number[]) {
    const Jfwd = new MatrixN(6, 6)
    const Jinv = new MatrixN(6, 6)
    const T_L_0 = new Pose()
    const linkout: KinematicsLink[] = []

    // const vw: number[]
    // for (let link = 0; link < genser.link_num; link++) {
    //
    //
    // }

    //     for (link = 0; link < genser->link_num; link++) {
    //     retval =
    //         go_link_joint_set(&genser->links[link], joints[link],
    // &linkout[link]);
    //     if (GO_RESULT_OK != retval)
    //         return retval;
    // }
    //     retval = compute_jfwd(linkout, genser->link_num, &Jfwd, &T_L_0);
    //     if (GO_RESULT_OK != retval)
    //         return retval;
    //     retval = compute_jinv(&Jfwd, &Jinv);
    //     if (GO_RESULT_OK != retval)
    //         return retval;
    //
    //     vw[0] = vel->v.x;
    //     vw[1] = vel->v.y;
    //     vw[2] = vel->v.z;
    //     vw[3] = vel->w.x;
    //     vw[4] = vel->w.y;
    //     vw[5] = vel->w.z;
    //
    //     return go_matrix_vector_mult(&Jinv, vw, jointvels);
    // }
    //
    // int genser_kin_jac_fwd(void *kins,
    // const go_real * joints,
    // const go_real * jointvels, const go_pose * pos, go_screw * vel)
    // {
    //     genser_struct *genser = (genser_struct *) kins;
    //     GO_MATRIX_DECLARE(Jfwd, Jfwd_stg, 6, GENSER_MAX_JOINTS);
    //     go_pose T_L_0;
    //     go_link linkout[GENSER_MAX_JOINTS];
    //     go_real vw[6];
    //     int link;
    //     int retval;
    //
    //     go_matrix_init(Jfwd, Jfwd_stg, 6, genser->link_num);
    //
    //     for (link = 0; link < genser->link_num; link++) {
    //     retval =
    //         go_link_joint_set(&genser->links[link], joints[link],
    // &linkout[link]);
    //     if (GO_RESULT_OK != retval)
    //         return retval;
    // }
    //
    //     retval = compute_jfwd(linkout, genser->link_num, &Jfwd, &T_L_0);
    //     if (GO_RESULT_OK != retval)
    //         return retval;
    //
    //     go_matrix_vector_mult(&Jfwd, jointvels, vw);
    //     vel->v.x = vw[0];
    //     vel->v.y = vw[1];
    //     vel->v.z = vw[2];
    //     vel->w.x = vw[3];
    //     vel->w.y = vw[4];
    //     vel->w.z = vw[5];
    //
    //     return GO_RESULT_OK;
    // }
    //
    // /* main function called by emc2 for forward Kins */
    // int genserKinematicsForward(const double *joint,
    // EmcPose * world,
    // const KINEMATICS_FORWARD_FLAGS * fflags,
    // KINEMATICS_INVERSE_FLAGS * iflags) {
    //
    //     go_pose *pos;
    //     go_rpy rpy;
    //     go_real jcopy[GENSER_MAX_JOINTS]; // will hold the radian conversion of joints
    //     int ret = 0;
    //     int i, changed=0;
    //     if (!genser_hal_inited) {
    //         rtapi_print_msg(RTAPI_MSG_ERR,
    //             "genserKinematicsForward: not initialized\n");
    //         return -1;
    //     }
    //
    //     for (i=0; i< 6; i++)  {
    //         // FIXME - debug hack
    //         if (!GO_ROT_CLOSE(j[i],joint[i])) changed = 1;
    //         // convert to radians to pass to genser_kin_fwd
    //         jcopy[i] = joint[i] * PM_PI / 180;
    //         if ((i) && *(haldata->unrotate[i]))
    //             jcopy[i] -= *(haldata->unrotate[i])*jcopy[i-1];
    //     }
    //
    //     if (changed) {
    //         for (i=0; i< 6; i++)
    //             j[i] = joint[i];
    //         // rtapi_print("genserKinematicsForward(joints: %f %f %f %f %f %f)\n",
    //         //joint[0],joint[1],joint[2],joint[3],joint[4],joint[5]);
    //     }
    //     // AJ: convert from emc2 coords (XYZABC - which are actually rpy euler
    //     // angles)
    //     // to go angles (quaternions)
    //     pos = haldata->pos;
    //     rpy.y = world->c * PM_PI / 180;
    //     rpy.p = world->b * PM_PI / 180;
    //     rpy.r = world->a * PM_PI / 180;
    //
    //     go_rpy_quat_convert(&rpy, &pos->rot);
    //     pos->tran.x = world->tran.x;
    //     pos->tran.y = world->tran.y;
    //     pos->tran.z = world->tran.z;
    //
    //     //pass through unused 678 as uvw
    //     if (total_joints > 6) world->u = joint[6];
    //     if (total_joints > 7) world->v = joint[7];
    //     if (total_joints > 8) world->w = joint[8];
    //
    //     // pos will be the world location
    //     // jcopy: joitn position in radians
    //     ret = genser_kin_fwd(KINS_PTR, jcopy, pos);
    //     if (ret < 0)
    //         return ret;
    //
    //     // AJ: convert back to emc2 coords
    //     ret = go_quat_rpy_convert(&pos->rot, &rpy);
    //     if (ret < 0)
    //         return ret;
    //     world->tran.x = pos->tran.x;
    //     world->tran.y = pos->tran.y;
    //     world->tran.z = pos->tran.z;
    //     world->a = rpy.r * 180 / PM_PI;
    //     world->b = rpy.p * 180 / PM_PI;
    //     world->c = rpy.y * 180 / PM_PI;
    //
    //     if (changed) {
    // // rtapi_print("genserKinematicsForward(world: %f %f %f %f %f %f)\n", world->tran.x, world->tran.y, world->tran.z, world->a, world->b, world->c);
    //     }
    //     return 0;
    // }
    //
    // int genser_kin_fwd(void *kins, const go_real * joints, go_pose * pos)
    // {
    //     genser_struct *genser = kins;
    //     go_link linkout[GENSER_MAX_JOINTS];
    //
    //     int link;
    //     int retval;
    //
    //     genser_kin_init();
    //
    //     for (link = 0; link < genser->link_num; link++) {
    //     retval = go_link_joint_set(&genser->links[link], joints[link], &linkout[link]);
    //     if (GO_RESULT_OK != retval)
    //         return retval;
    // }
    //
    //     retval = go_link_pose_build(linkout, genser->link_num, pos);
    //     if (GO_RESULT_OK != retval)
    //         return retval;
    //
    //     return GO_RESULT_OK;
    // }
    //

    // typedef struct {
    //     double x, y, z;     /* this.x, etc. */
    // } PmCartesian;
    // typedef struct EmcPose {
    //     PmCartesian tran;
    //     double a, b, c;
    //     double u, v, w;
    // } EmcPose;

    type PmCartesian = {
        x: number
        y: number
        z: number
    }
    type EmcPose = {
        tran: PmCartesian
        a: number
        b: number
        c: number
        u: number
        v: number
        w: number
    }

    function genserKinematicsInverse(world: EmcPose, joints: number[]) {
        const Jfwd = new MatrixN(6, 6)
        const Jinv = new MatrixN(6, 6)
        const T_L_0 = new Pose()
        const vw: number[] = []
        const jest: number[] = []
        const dj: number[] = []
        const pest = new Pose()
        const pestinv = new Pose()
        const Tdelta = new Pose()
        const rpy = new go_rpy()
        const rvec = new go_rvec()
        const cart = new go_cart()
        // const linkout: go_link[]
        var link: number
        var smalls: number
        var retval: number

        console.log("joints", joints[0], joints[1], joints[2], joints[3], joints[4], joints[5])

        console.log("world", world.tran.x, world.tran.y, world.tran.z, world.a, world.b, world.c)

        //     // FIXME-AJ: rpy or zyx ?

        rpy.y = (world.c * Math.PI) / 180
        rpy.p = (world.b * Math.PI) / 180
        rpy.r = (world.a * Math.PI) / 180

        go_rpy_quat_convert(rpy)
    }
}

//
//     go_rpy_quat_convert(&rpy, &haldata->pos->rot);
//     haldata->pos->tran.x = world->tran.x;
//     haldata->pos->tran.y = world->tran.y;
//     haldata->pos->tran.z = world->tran.z;
//
//     go_matrix_init(Jfwd, Jfwd_stg, 6, genser->link_num);
//     go_matrix_init(Jinv, Jinv_stg, genser->link_num, 6);
//
//     /* jest[] is a copy of joints[], which is the joint estimate */
//     for (link = 0; link < genser->link_num; link++) {
//     // jest, and the rest of joint related calcs are in radians
//     jest[link] = joints[link] * (PM_PI / 180);
// }
//
//     for (genser->iterations = 0;
//          genser->iterations < *haldata->max_iterations;
//     genser->iterations++) {
// *(haldata->last_iterations) = genser->iterations;
//     /* update the Jacobians */
//     for (link = 0; link < genser->link_num; link++) {
//         go_link_joint_set(&genser->links[link], jest[link], &linkout[link]);
//     }
//     retval = compute_jfwd(linkout, genser->link_num, &Jfwd, &T_L_0);
//     if (GO_RESULT_OK != retval) {
//         rtapi_print("ERR kI - compute_jfwd (joints: %f %f %f %f %f %f), (iterations=%d)\n",
//             joints[0],joints[1],joints[2],joints[3],joints[4],joints[5], genser->iterations);
//         return retval;
//     }
//     retval = compute_jinv(&Jfwd, &Jinv);
//     if (GO_RESULT_OK != retval) {
//         rtapi_print("ERR kI - compute_jinv (joints: %f %f %f %f %f %f), (iterations=%d)\n",
//             joints[0],joints[1],joints[2],joints[3],joints[4],joints[5], genser->iterations);
//         return retval;
//     }
//
//     /* pest is the resulting pose estimate given joint estimate */
//     genser_kin_fwd(KINS_PTR, jest, &pest);
//     //printf("jest: %f %f %f %f %f %f\n",jest[0],jest[1],jest[2],jest[3],jest[4],jest[5]);
//     /* pestinv is its inverse */
//     go_pose_inv(&pest, &pestinv);
//     /*
//         Tdelta is the incremental pose from pest to pos, such that
//
//         0        L         0
//         . pest *  Tdelta =  pos, or
//         L        L         L
//
//         L         L          0
//         .Tdelta =  pestinv *  pos
//         L         0          L
//     */
//     go_pose_pose_mult(&pestinv, haldata->pos, &Tdelta);
//
//     /*
//         We need Tdelta in 0 frame, not pest frame, so rotate it
//         back. Since it's effectively a velocity, we just rotate it, and
//         don't translate it.
//     */
//
//     /* first rotate the translation differential */
//     go_quat_cart_mult(&pest.rot, &Tdelta.tran, &cart);
//     dvw[0] = cart.x;
//     dvw[1] = cart.y;
//     dvw[2] = cart.z;
//
//     /* to rotate the rotation differential, convert it to a
//        velocity screw and rotate that */
//     go_quat_rvec_convert(&Tdelta.rot, &rvec);
//     cart.x = rvec.x;
//     cart.y = rvec.y;
//     cart.z = rvec.z;
//     go_quat_cart_mult(&pest.rot, &cart, &cart);
//     dvw[3] = cart.x;
//     dvw[4] = cart.y;
//     dvw[5] = cart.z;
//
//     /* push the Cartesian velocity vector through the inverse Jacobian */
//     go_matrix_vector_mult(&Jinv, dvw, dj);
//
//     //pass through 678 as uvw
//     if (total_joints > 6) joints[6] = world->u;
//     if (total_joints > 7) joints[7] = world->v;
//     if (total_joints > 8) joints[8] = world->w;
//
//     /* check for small joint increments, if so we're done */
//     for (link = 0, smalls = 0; link < genser->link_num; link++) {
//         if (GO_QUANTITY_LENGTH == linkout[link].quantity) {
//             if (GO_TRAN_SMALL(dj[link]))
//                 smalls++;
//         } else {
//             if (GO_ROT_SMALL(dj[link]))
//                 smalls++;
//         }
//     }
//     if (smalls == genser->link_num) {
//         /* converged, copy jest[] out */
//         for (link = 0; link < genser->link_num; link++) {
//             // convert from radians back to angles
//             joints[link] = jest[link] * 180 / PM_PI;
//             if ((link) && *(haldata->unrotate[link]))
//                 joints[link] += *(haldata->unrotate[link]) * joints[link-1];
//         }
//         //rtapi_print("DONEkineInverse(joints: %f %f %f %f %f %f), (iterations=%d)\n",
//         //     joints[0],joints[1],joints[2],joints[3],joints[4],joints[5], genser->iterations);
//         //rtapi_print("OKkineInverse: %.2f %.2f %.2f %.2f %.2f %.2f)\n",
//         //     world->tran.x, world->tran.y, world->tran.z, world->a, world->b, world->c);
//         return GO_RESULT_OK;
//     }
//     /* else keep iterating */
//     for (link = 0; link < genser->link_num; link++) {
//         jest[link] += dj[link]; //still in radians
//     }
// } /* for (iterations) */
//
//     rtapi_print("ERRkineInverse(joints: %f %f %f %f %f %f), (iterations=%d)\n",
//         joints[0],joints[1],joints[2],joints[3],joints[4],joints[5], genser->iterations);
//     return GO_RESULT_ERROR;
// }

//
// /*
//
//
// int genserKinematicsSetup(const int comp_id,
// const char* coordinates,
// kparms*     kp)
// {
//     int i,res=0;
//     haldata = hal_malloc(sizeof(struct haldata));
//     if (!haldata) {goto error;}
//
//     // allow for pass through joints 6,7,8 u,v,w
//     total_joints = kp->max_joints;
//
//     // only the first 6 joints have A,ALPHA,D,unrotate pins
//     for (i = 0; i < 6; i++) {
//         res += hal_pin_float_newf(HAL_IN, &(haldata->a[i]), comp_id,
//             "%s.A-%d", kp->halprefix, i);
//     *(haldata->a[i])=0;
//         res += hal_pin_float_newf(HAL_IN, &(haldata->alpha[i]), comp_id,
//             "%s.ALPHA-%d", kp->halprefix, i);
//     *(haldata->alpha[i])=0;
//         res += hal_pin_float_newf(HAL_IN, &(haldata->d[i]), comp_id,
//             "%s.D-%d", kp->halprefix, i);
//     *(haldata->d[i])=0;
//         res += hal_pin_s32_newf(HAL_IN, &(haldata->unrotate[i]), comp_id,
//             "%s.unrotate-%d", kp->halprefix, i);
//     *haldata->unrotate[i]=0;
//     }
//     res += hal_pin_u32_newf(HAL_OUT, &(haldata->last_iterations), comp_id,
//         "%s.last-iterations",kp->halprefix);
//
//     KINS_PTR = hal_malloc(sizeof(genser_struct));
//     haldata->pos = (go_pose *) hal_malloc(sizeof(go_pose));
//     if (KINS_PTR     == NULL) {goto error;}
//     if (haldata->pos == NULL) {goto error;}
//     res += hal_pin_u32_newf(HAL_IN, &haldata->max_iterations, comp_id,
//     "%s.max-iterations",kp->halprefix);
//
//     if (res) {goto error;}
//
