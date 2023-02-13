// import { MatrixN, Pose, LinkQuantities, LinkParamRepresentation, KinematicsLink } from "./ikmath"

// import * as IK from "./IkMath"
import * as THREE from "three"
import * as NMATH from "./NMATH"

/* compute the forward jacobian function:
   the jacobian is a linear approximation of the kinematics function.
   It is calculated using derivation of the position transformation matrix,
   and usually used for feeding velocities through it.
   It is analytically possible to calculate the inverse of the jacobian
   (sometimes only the pseudoinverse) and to use that for the inverse kinematics.
*/
export function computeForwardJacobian(
    link_params: NMATH.KinematicsLink[],
    link_number: number
): { Jfwd: NMATH.MatrixN; T_L_0: THREE.Matrix4 } {
    const pose: THREE.Matrix4 = new THREE.Matrix4()

    //missing angularunits conversion
    //missing joint offset conversion

    if (link_number < 1) {
        throw new Error("ComputeForwardJacobian: link number must be at least 1")
    }

    //topose converts degrees to radians and adjust the joint offset
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
    } else if (NMATH.LinkParamRepresentation.LINK_URDF == link_params[0].type) {
        pose.copy((link_params[0].params as NMATH.UrdfParams).pose)
    } else {
        throw new Error("ComputeForwardJacobian: unknown link type")
    }

    const T_L_0 = new THREE.Matrix4().copy(pose)

    const zi: THREE.Vector3[] = []
    const ti: THREE.Vector3[] = []
    // const A0 = new THREE.Matrix4().compose(T_L_0.tran, T_L_0.rot, new THREE.Vector3(1, 1, 1))
    // console.log(
    //     "A0",
    //     "\n",
    //     A0.clone().transpose().elements[0],
    //     A0.clone().transpose().elements[1],
    //     A0.clone().transpose().elements[2],
    //     A0.clone().transpose().elements[3],
    //     "\n",
    //     A0.clone().transpose().elements[4],
    //     A0.clone().transpose().elements[5],
    //     A0.clone().transpose().elements[6],
    //     A0.clone().transpose().elements[7],
    //     "\n",
    //     A0.clone().transpose().elements[8],
    //     A0.clone().transpose().elements[9],
    //     A0.clone().transpose().elements[10],
    //     A0.clone().transpose().elements[11],
    //     "\n",
    //     A0.clone().transpose().elements[12],
    //     A0.clone().transpose().elements[13],
    //     A0.clone().transpose().elements[14],
    //     A0.clone().transpose().elements[15]
    // )

    const A0 = new THREE.Matrix4().copy(pose)
    // console.log(
    //     "A0",
    //     "\n",
    //     A0.clone().transpose().elements[0],
    //     A0.clone().transpose().elements[1],
    //     A0.clone().transpose().elements[2],
    //     A0.clone().transpose().elements[3],
    //     "\n",
    //     A0.clone().transpose().elements[4],
    //     A0.clone().transpose().elements[5],
    //     A0.clone().transpose().elements[6],
    //     A0.clone().transpose().elements[7],
    //     "\n",
    //     A0.clone().transpose().elements[8],
    //     A0.clone().transpose().elements[9],
    //     A0.clone().transpose().elements[10],
    //     A0.clone().transpose().elements[11],
    //     "\n",
    //     A0.clone().transpose().elements[12],
    //     A0.clone().transpose().elements[13],
    //     A0.clone().transpose().elements[14],
    //     A0.clone().transpose().elements[15]
    // )

    zi[0] = new THREE.Vector3()
    A0.extractBasis(new THREE.Vector3(), new THREE.Vector3(), zi[0])

    ti[0] = new THREE.Vector3().setFromMatrixPosition(T_L_0)

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

        // const Ai = new THREE.Matrix4().compose(T_L_0.tran, T_L_0.rot, new THREE.Vector3(1, 1, 1))
        const Ai = new THREE.Matrix4().copy(T_L_0)

        // console.log(
        //     "Ai",
        //     "\n",
        //     Ai.clone().transpose().elements[0],
        //     Ai.clone().transpose().elements[1],
        //     Ai.clone().transpose().elements[2],
        //     Ai.clone().transpose().elements[3],
        //     "\n",
        //     Ai.clone().transpose().elements[4],
        //     Ai.clone().transpose().elements[5],
        //     Ai.clone().transpose().elements[6],
        //     Ai.clone().transpose().elements[7],
        //     "\n",
        //     Ai.clone().transpose().elements[8],
        //     Ai.clone().transpose().elements[9],
        //     Ai.clone().transpose().elements[10],
        //     Ai.clone().transpose().elements[11],
        //     "\n",
        //     Ai.clone().transpose().elements[12],
        //     Ai.clone().transpose().elements[13],
        //     Ai.clone().transpose().elements[14],
        //     Ai.clone().transpose().elements[15]
        // )

        // const Zi_vec = new THREE.Vector3()
        zi[col] = new THREE.Vector3()
        Ai.extractBasis(new THREE.Vector3(), new THREE.Vector3(), zi[col])
        // zi[col] = new THREE.Vector3(Ai.elements[8], Ai.elements[9], Ai.elements[10])

        // const m3 = new THREE.Matrix3().setFromMatrix4(Ai)

        // ti[col] = new THREE.Vector3().copy(T_L_0.tran)
        ti[col] = new THREE.Vector3().setFromMatrixPosition(T_L_0)

        // const Zi = new NMATH.MatrixN(3, 1, [[0], [0], [1]])
        // const ti = new NMATH.MatrixN(3, 1)
    }

    // console.log("Zi", zi)
    // console.log("Ti", ti)

    const Jvi: THREE.Vector3[] = []
    const Jwi: THREE.Vector3[] = []

    // Jvi[0] = new THREE.Vector3().crossVectors(ti[link_number - 1], new THREE.Vector3(0, 0, 1))
    Jvi[0] = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 0, 1), ti[link_number - 1])

    // Jwi[0] = new THREE.Vector3(0, 0, 1).applyQuaternion(T_L_0.rot.invert())
    Jwi[0] = new THREE.Vector3(0, 0, 1)

    for (let i = 0; i < link_number; i++) {
        if (NMATH.LinkParamRepresentation.LINK_DH == link_params[i].type && i == 0) {
            continue
        }

        if (NMATH.LinkParamRepresentation.LINK_DH == link_params[i].type) {
            if (NMATH.LinkQuantities.QUANTITY_ANGLE == link_params[i].quantity) {
                Jvi[i] = new THREE.Vector3().crossVectors(
                    zi[i - 1],
                    new THREE.Vector3().subVectors(ti[link_number - 1], ti[i - 1])
                )
                Jwi[i] = new THREE.Vector3().copy(zi[i - 1])
            } else if (NMATH.LinkQuantities.QUANTITY_LENGTH == link_params[i].quantity) {
                Jvi[i] = zi[i - 1]
                Jwi[i] = new THREE.Vector3(0, 0, 0)
            } else if (NMATH.LinkQuantities.QUANTITY_NONE == link_params[i].quantity) {
                // todo fill this
            } else {
                throw new Error("Unknown link quantity")
            }
        } else {
            //MODIFIED DH
            if (NMATH.LinkQuantities.QUANTITY_ANGLE == link_params[i].quantity) {
                Jvi[i] = new THREE.Vector3().crossVectors(
                    zi[i],
                    new THREE.Vector3().subVectors(ti[link_number - 1], ti[i])
                )
                Jwi[i] = new THREE.Vector3().copy(zi[i])
            } else if (NMATH.LinkQuantities.QUANTITY_LENGTH == link_params[i].quantity) {
                //todo check this
                Jvi[i] = zi[i]
                Jwi[i] = new THREE.Vector3(0, 0, 0)
            } else if (NMATH.LinkQuantities.QUANTITY_NONE == link_params[i].quantity) {
                //todo fill this
            } else {
                throw new Error("Unknown link quantity")
            }
        }
    }

    // if (!modified) {
    //     for (let i = 1; i < link_number; i++) {
    //         Jvi[i] = new THREE.Vector3().crossVectors(
    //             zi[i - 1],
    //             new THREE.Vector3().subVectors(ti[link_number - 1], ti[i - 1])
    //         )
    //         Jwi[i] = new THREE.Vector3().copy(zi[i - 1])
    //     }
    // } else {
    //     for (let i = 0; i < link_number; i++) {
    //         Jvi[i] = new THREE.Vector3().crossVectors(
    //             zi[i],
    //             new THREE.Vector3().subVectors(ti[link_number - 1], ti[i])
    //         )
    //         Jwi[i] = new THREE.Vector3().copy(zi[i])
    //     }
    // }

    // for (let i = 0; i < link_number; i++) {
    //     console.log("i", i)
    //     console.log("zi", zi[i])
    //     console.log("ti", ti[i])
    //     console.log("Jvi", Jvi[i])
    // }

    // const toEuler = new THREE.Euler().setFromQuaternion(T_L_0.rot)
    // T_L_0.rot.setFromEuler(toEuler)

    // const R_inv = new NMATH.MatrixN(3, 3).setFromQuaternion(T_L_0.rot.clone().invert())

    const temp = new THREE.Matrix3().setFromMatrix4(T_L_0.clone().invert())
    const R_inv = new NMATH.MatrixN(3, 3).setFromMatrix3(temp)

    const Jv_temp = new NMATH.MatrixN(3, link_number)
    const Jw_temp = new NMATH.MatrixN(3, link_number)
    for (let col = 0; col < link_number; col++) {
        Jv_temp.el[0][col] = Jvi[col].x
        Jv_temp.el[1][col] = Jvi[col].y
        Jv_temp.el[2][col] = Jvi[col].z
        Jw_temp.el[0][col] = Jwi[col].x
        Jw_temp.el[1][col] = Jwi[col].y
        Jw_temp.el[2][col] = Jwi[col].z
    }
    const Jv_temp_rot = new NMATH.MatrixN(3, link_number)
    const Jw_temp_rot = new NMATH.MatrixN(3, link_number)

    // console.log("Jv_temp", Jv_temp)
    Jv_temp_rot.multiplyMatrices(R_inv, Jv_temp)
    Jw_temp_rot.multiplyMatrices(R_inv, Jw_temp)
    // console.log("Jv_temp_rot", Jv_temp_rot)

    const Jfwd = new NMATH.MatrixN(6, link_number)

    const ROTATE_JACOBIANS_BACK = true
    if (ROTATE_JACOBIANS_BACK) {
        for (let col = 0; col < link_number; col++) {
            Jfwd.el[0][col] = Jv_temp_rot.el[0][col]
            Jfwd.el[1][col] = Jv_temp_rot.el[1][col]
            Jfwd.el[2][col] = Jv_temp_rot.el[2][col]
            Jfwd.el[3][col] = Jw_temp_rot.el[0][col]
            Jfwd.el[4][col] = Jw_temp_rot.el[1][col]
            Jfwd.el[5][col] = Jw_temp_rot.el[2][col]
        }
    } else {
        for (let col = 0; col < link_number; col++) {
            Jfwd.el[0][col] = Jvi[col].x
            Jfwd.el[1][col] = Jvi[col].y
            Jfwd.el[2][col] = Jvi[col].z
            Jfwd.el[3][col] = Jwi[col].x
            Jfwd.el[4][col] = Jwi[col].y
            Jfwd.el[5][col] = Jwi[col].z
        }
    }

    // T_L_0_matrix4.decompose(T_L_0.tran, T_L_0.rot, new THREE.Vector3())

    // const toEuler2 = new THREE.Euler().setFromQuaternion(T_L_0.rot)
    // T_L_0.rot.setFromEuler(toEuler2)

    return { Jfwd: Jfwd, T_L_0: T_L_0 }
}
