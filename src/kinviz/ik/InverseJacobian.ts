/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import * as THREE from "three"
import * as NMATH from "./NMATH"

// Columns of the Jacobian matrix are associated with joints of the robot.
// Rows of the Jacobian matrix are associated with the Cartesian coordinates of the end-effector and the orientation of the end-effector.
// The Jacobian matrix is a 6x6 matrix for a 6-DOF robot.
// The Jacobian matrix is a 6x3 matrix for a 3-DOF robot.

export function computeInverseJacobian(Jfwd: NMATH.MatrixN): { Jinv: NMATH.MatrixN } {
    const Jinv: NMATH.MatrixN = new NMATH.MatrixN(Jfwd.rows, Jfwd.cols)

    if (Jfwd.rows == Jfwd.cols) {
        /* square matrix */
        Jinv.invertMatrix(Jfwd)
    } else if (Jfwd.rows < Jfwd.cols) {
        /* underdetermined, optimize on smallest sum of square of speeds */

        const JT: NMATH.MatrixN = new NMATH.MatrixN(Jfwd.cols, Jfwd.rows)
        const JJT: NMATH.MatrixN = new NMATH.MatrixN(Jfwd.rows, Jfwd.rows)
        JT.copy(Jfwd).transpose()
        JJT.multiplyMatrices(Jfwd, JT)
        JJT.invert()
        Jinv.multiplyMatrices(JJT, JT)
    } else {
        /* overdetermined, do least-squares best fit */
        const JT: NMATH.MatrixN = new NMATH.MatrixN(Jfwd.cols, Jfwd.rows)
        const JTJ: NMATH.MatrixN = new NMATH.MatrixN(Jfwd.rows, Jfwd.rows)
        JT.copy(Jfwd).transpose()
        JTJ.multiplyMatrices(JT, Jfwd)
        JTJ.invert()
        Jinv.multiplyMatrices(JT, JTJ)
    }
    //todo added this transpose
    // return { Jinv: Jinv.transpose() }
    //
    return { Jinv: Jinv }
}

// function inverseJacobian(
//     genser: IK.GenericSerial,
//     pos: IK.Pose,
//     vel: IK.Screw,
//     joints: number[]
// ): IK.MatrixN {
//int genser_kin_jac_inv(void *kins,
//                       const go_pose * pos,
//                       const go_screw * vel, const go_real * joints, go_real * jointvels)
//{
//    genser_struct *genser = (genser_struct *) kins;
//    GO_MATRIX_DECLARE(Jfwd, Jfwd_stg, 6, GENSER_MAX_JOINTS);
//    GO_MATRIX_DECLARE(Jinv, Jinv_stg, GENSER_MAX_JOINTS, 6);
//    go_pose T_L_0;
//    go_link linkout[GENSER_MAX_JOINTS];
//    go_real vw[6];
//    int link;
//    int retval;
//
//    go_matrix_init(Jfwd, Jfwd_stg, 6, genser->link_num);
//    go_matrix_init(Jinv, Jinv_stg, GENSER_MAX_JOINTS, 6);
//
//    for (link = 0; link < genser->link_num; link++) {
//        retval =
//                go_link_joint_set(&genser->links[link], joints[link],
//                                  &linkout[link]);
//        if (GO_RESULT_OK != retval)
//            return retval;
//    }
//    retval = compute_jfwd(linkout, genser->link_num, &Jfwd, &T_L_0);
//    if (GO_RESULT_OK != retval)
//        return retval;
//    retval = compute_jinv(&Jfwd, &Jinv);
//    if (GO_RESULT_OK != retval)
//        return retval;
//
//    vw[0] = vel->v.x;
//    vw[1] = vel->v.y;
//    vw[2] = vel->v.z;
//    vw[3] = vel->w.x;
//    vw[4] = vel->w.y;
//    vw[5] = vel->w.z;
//
//    return go_matrix_vector_mult(&Jinv, vw, jointvels);
// }
