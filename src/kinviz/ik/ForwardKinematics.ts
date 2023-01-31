/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"
import * as NMATH from "./NMATH/index"

// go_result genser_kin_fwd(void * kins,
// const go_real *joints,
// go_pose * pos)
// {
//   genser_struct * genser = (genser_struct *) kins;
//   go_link linkout[GENSER_MAX_JOINTS];
//   go_integer link;
//   go_result retval;
//
//   for (link = 0; link < genser->link_num; link++) {
//   retval = go_link_joint_set(&genser->links[link], joints[link], &linkout[link]);
//   if (GO_RESULT_OK != retval) return retval;
// }
//
//   retval = go_link_pose_build(linkout, genser->link_num, pos);
//   if (GO_RESULT_OK != retval) return retval;
//
//   return GO_RESULT_OK;
// }

export function forwardKinematics(
    genser: NMATH.GenericSerial,
    joints: number[]
): { pose: THREE.Matrix4 } {
    const linkout: NMATH.KinematicsLink[] = []

    for (let link = 0; link < genser.link_num; link++) {
        linkout[link] = genser.links[link].jointSet(joints[link])
    }

    // console.log("linkout: ", linkout)
    const fwd = NMATH.PoseBuild(linkout, genser.link_num)
    // console.log("fwd: ", fwd)

    return fwd
}

/*
orginal emc functions did:
set changed flag
convert rpy to radians
convert to quat
call forwardKinematics function
convert quat to rpy


 */
// function forwardKinematicsWrapper(
//     genser: IK.GenericSerial,
//     joints: number[],
//     lastJoints: number[]
// ): { world: IK.Pose; fflags: number; iflags: number } {
//     //int genserKinematicsForward(const double *joint,
//     //                            EmcPose * world,
//     //                            const KINEMATICS_FORWARD_FLAGS * fflags,
//     //                            KINEMATICS_INVERSE_FLAGS * iflags) {
//     //
//     //   const pos:IK.Pose = new IK.Pose()
//     // go_pose *pos;
//     // go_rpy rpy;
//     // go_real jcopy[GENSER_MAX_JOINTS]; // will hold the radian conversion of joints
//     // int ret = 0;
//     // int i, changed=0;
//     // if (!genser_hal_inited) {
//     //     printf("genserKinematicsForward: not initialized\n");
//     //     return -1;
//     // }
//     var changed: boolean = false
//     for (let i = 0; i < 6; i++) {
//         // FIXME - debug hack
//         if (!IK.ROT_CLOSE(lastJoints[i], joints[i])) {
//             changed = true
//         }
//
//         // Add "unrotate" parameter for each joint
//         // This parameter is used to accomodate serial joints which do
//         //   not rotate with the previous joint.  This type of linkage is
//         // common in some robot types (notably silicon wafer handlers).
//         //
//         // In general, the parameter will be 0 (no compensation), 1 (add
//         // prior joint position), or -1 (sibtract prior joint position).
//         // It is possible to set it to any integer value, and other values may
//         // make sense (if there is gearing, for example)
//
//         // if (!GO_ROT_CLOSE(j[i],joint[i])) changed = 1;
//         // // convert to radians to pass to genser_kin_fwd
//         // jcopy[i] = joint[i] * M_PI / 180;
//         // if ((i) && *(haldata->unrotate[i]))
//         //     jcopy[i] -= *(haldata->unrotate[i])*jcopy[i-1];
//     }
//
//     if (changed) {
//         for (let i = 0; i < 6; i++)
//             //todo do we pass in last joints?
//             lastJoints[i] = joints[i]
//         // rtapi_print("genserKinematicsForward(joints: %f %f %f %f %f %f)\n",
//         //joint[0],joint[1],joint[2],joint[3],joint[4],joint[5]);
//     }
//     // AJ: convert from emc2 coords (XYZABC - which are actually rpy euler
//     // angles)
//     // to go angles (quaternions)
//     // pos = haldata->pos;
//     // rpy.y = world->c * M_PI / 180;
//     // rpy.p = world->b * M_PI / 180;
//     // rpy.r = world->a * M_PI / 180;
//     //
//     // go_rpy_quat_convert(&rpy, &pos->rot);
//     // pos->tran.x = world->tran.x;
//     // pos->tran.y = world->tran.y;
//     // pos->tran.z = world->tran.z;
//     //
//     // //pass through unused 678 as uvw
//     // if (total_joints > 6) world->u = joint[6];
//     // if (total_joints > 7) world->v = joint[7];
//     // if (total_joints > 8) world->w = joint[8];
//
//     // pos will be the world location
//     // jcopy: joitn position in radians
//
//     const pos = forwardKinematics(genser, joints)
//
//     // ret = genser_kin_fwd(KINS_PTR, jcopy, pos);
//     // if (ret < 0)
//     //     return ret;
//     //
//     // // AJ: convert back to emc2 coords
//     // ret = go_quat_rpy_convert(&pos->rot, &rpy);
//     // if (ret < 0)
//     //     return ret;
//     // world->tran.x = pos->tran.x;
//     // world->tran.y = pos->tran.y;
//     // world->tran.z = pos->tran.z;
//     // world->a = rpy.r * 180 / M_PI;
//     // world->b = rpy.p * 180 / M_PI;
//     // world->c = rpy.y * 180 / M_PI;
//
//     if (changed) {
//         // rtapi_print("genserKinematicsForward(world: %f %f %f %f %f %f)\n", world->tran.x, world->tran.y, world->tran.z, world->a, world->b, world->c);
//     }
//     // return 0;
// }
