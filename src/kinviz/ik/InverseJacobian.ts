/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import * as THREE from "three"
import * as NMATH from "./NMATH"

// Columns of the Jacobian matrix are associated with joints of the robot.
// Rows of the Jacobian matrix are associated with the Cartesian coordinates of the end-effector and the orientation of the end-effector.
// The Jacobian matrix is a 6x6 matrix for a 6-DOF robot.
// The Jacobian matrix is a 6x3 matrix for a 3-DOF robot.

export function computeInverseJacobian(Jfwd: NMATH.MatrixN): NMATH.MatrixN {
    const Jinv: NMATH.MatrixN = new NMATH.MatrixN(Jfwd.cols, Jfwd.rows)

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
        // const JT: NMATH.MatrixN = new NMATH.MatrixN(Jfwd.rows, Jfwd.rows)
        const JTJ: NMATH.MatrixN = new NMATH.MatrixN(Jfwd.cols, Jfwd.cols)

        const JT: NMATH.MatrixN = new NMATH.MatrixN(Jfwd.cols, Jfwd.rows).transposeMatrix(Jfwd)

        JTJ.multiplyMatrices(JT, Jfwd)
        JTJ.invert()

        Jinv.multiplyMatrices(JTJ, JT)

        // GO_MATRIX_DECLARE(JTJ, JTJstg, GENSER_MAX_JOINTS, GENSER_MAX_JOINTS);
        //
        // go_matrix_init(JT, JTstg, Jfwd->cols, Jfwd->rows);
        // go_matrix_init(JTJ, JTJstg, Jfwd->cols, Jfwd->cols);
        // go_matrix_transpose(Jfwd, &JT);
        // go_matrix_matrix_mult(&JT, Jfwd, &JTJ);
        // retval = go_matrix_inv(&JTJ, &JTJ);
        // if (GO_RESULT_OK != retval)
        //     return retval;
        // go_matrix_matrix_mult(&JTJ, &JT, Jinv);
    }

    return Jinv
}
