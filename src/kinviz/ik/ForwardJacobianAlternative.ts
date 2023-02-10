/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as NMATH from "./NMATH"
import * as THREE from "three"

export function computeForwardJacobianAlternative(
    link_params: NMATH.KinematicsLink[],
    link_number: number
): { Jfwd: NMATH.MatrixN; T_L_0: THREE.Matrix4 } {
    //think this only works for modified DH
    const pose: THREE.Matrix4 = new THREE.Matrix4()

    const Jv = new NMATH.MatrixN(3, link_number)
    const Jw = new NMATH.MatrixN(3, link_number)

    Jv.el[0][0] = 0
    Jv.el[1][0] = 0
    Jv.el[2][0] = NMATH.LinkQuantities.QUANTITY_LENGTH == link_params[0].quantity ? 1 : 0
    Jw.el[0][0] = 0
    Jw.el[1][0] = 0
    Jw.el[2][0] = NMATH.LinkQuantities.QUANTITY_ANGLE == link_params[0].quantity ? 1 : 0

    if (NMATH.LinkParamRepresentation.LINK_DH == link_params[0].type) {
        pose.copy(
            (link_params[0].params as NMATH.DhParams).toPose(false, link_params[0].angularUnits)
        )
    } else if (NMATH.LinkParamRepresentation.LINK_MODIFIED_DH == link_params[0].type) {
        pose.copy(
            (link_params[0].params as NMATH.DhParams).toPose(true, link_params[0].angularUnits)
        )
    } else if (NMATH.LinkParamRepresentation.LINK_PP == link_params[0].type) {
        pose.copy((link_params[0].params as NMATH.PpParams).pose)
    } else {
        console.log("Error: unknown link type")
    }

    const T_L_0 = new THREE.Matrix4().copy(pose)

    for (let col = 1; col < link_number; col++) {
        /* T_ip1_i */
        if (NMATH.LinkParamRepresentation.LINK_DH == link_params[col].type) {
            pose.copy(
                (link_params[col].params as NMATH.DhParams).toPose(
                    false,
                    link_params[col].angularUnits
                )
            )
        } else if (NMATH.LinkParamRepresentation.LINK_MODIFIED_DH == link_params[col].type) {
            pose.copy(
                (link_params[col].params as NMATH.DhParams).toPose(
                    true,
                    link_params[col].angularUnits
                )
            )
        } else if (NMATH.LinkParamRepresentation.LINK_PP == link_params[col].type) {
            pose.copy((link_params[col].params as NMATH.PpParams).pose)
        } else {
            console.log(Error("Errror: unknown link type"))
        }

        // T_L_0_matrix4.multiply(poseMatrix4)
        T_L_0.multiply(pose)

        const P_ip1_i = new THREE.Vector3().setFromMatrixPosition(pose)

        const poseM3 = new THREE.Matrix3().setFromMatrix4(pose)

        const R_i_ip1 = new THREE.Matrix3().copy(poseM3)

        R_i_ip1.invert()

        const R_i_ip1_nm = new NMATH.MatrixN(3, 3).setFromMatrix3(R_i_ip1)

        const scratch = new NMATH.MatrixN(3, link_number).copy(Jw)

        scratch.crossVector(P_ip1_i)

        scratch.addMatrices(Jv, scratch)

        const Jvtemp1 = new NMATH.MatrixN(3, link_number)

        Jvtemp1.multiplyMatrices(R_i_ip1_nm, scratch)

        Jv.copy(Jvtemp1)

        Jv.el[0][col] = 0
        Jv.el[1][col] = 0
        Jv.el[2][col] = NMATH.LinkQuantities.QUANTITY_LENGTH == link_params[col].quantity ? 1 : 0

        const Jwtemp1 = new NMATH.MatrixN(3, link_number)
        Jwtemp1.multiplyMatrices(R_i_ip1_nm, Jw)
        Jw.copy(Jwtemp1)
        Jw.el[0][col] = 0
        Jw.el[1][col] = 0
        Jw.el[2][col] = NMATH.LinkQuantities.QUANTITY_ANGLE == link_params[col].quantity ? 1 : 0
    }

    const T_L_0_m3 = new THREE.Matrix3().setFromMatrix4(T_L_0)

    const R_inv = new NMATH.MatrixN(3, 3).setFromMatrix3(T_L_0_m3)

    const Jvtemp2 = new NMATH.MatrixN(3, link_number)
    Jvtemp2.multiplyMatrices(R_inv, Jv)
    Jv.copy(Jvtemp2)
    const Jwtemp2 = new NMATH.MatrixN(3, link_number)

    Jwtemp2.multiplyMatrices(R_inv, Jw)
    Jw.copy(Jwtemp2)

    const Jfwd = new NMATH.MatrixN(6, link_number)

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < link_number; col++) {
            if (row < 3) {
                Jfwd.el[row][col] = Jv.el[row][col]
            } else {
                Jfwd.el[row][col] = Jw.el[row - 3][col]
            }
        }
    }

    return { Jfwd: Jfwd, T_L_0: T_L_0 }
}
