/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as NMATH from "./NMATH"
// import * as IK from "./IkMath"
import * as THREE from "three"
import { computeForwardJacobian } from "./ForwardJacobian"
import { computeInverseJacobian } from "./InverseJacobian"
import { forwardKinematics } from "./ForwardKinematics"
import { computeForwardJacobianAlternative } from "./ForwardJacobianAlternative"
import { jointsRemoveInitialOffset, jointsSetInitialOffset } from "./NMATH"
import { inverse } from "ml-matrix"

/*
  Set ROTATE_JACOBIANS_BACK if you want the Jacobian matrix to be
  expressed in the {0} frame. This means Cartesian velocities will be
  assumed relative to the {0} frame. If this is not defined, then the
  Jacobian will be relative to the final frame, and Cartesian speeds
  are assumed to be in the final frame.
  Normally, things are expressed in the {0} frame, so rotating
  Jacobians back is consistent with this.
*/

const ROTATE_JACOBIANS_BACK = true
export function inverseKinematics(
    genser: NMATH.GenericSerial,
    world: THREE.Matrix4,
    joints: number[]
) {
    // const jest: number[] = []

    var smalls: number

    const weights: number[] = []

    const worldV3 = new THREE.Vector3()
    const worldQ = new THREE.Quaternion()
    world.decompose(worldV3, worldQ, new THREE.Vector3())

    var jest: number[] = []
    /* jest[] is a copy of joints[], which is the joint estimate */
    for (let link = 0; link < genser.link_num; link++) {
        // jest, and the rest of joint related calcs are in radians
        jest[link] = joints[link]
    }

    // const jest = jointsSetInitialOffset(joints, genser)

    for (genser.iterations = 0; genser.iterations < genser.max_iterations; genser.iterations++) {
        const dvw: number[][] = []
        const linkout: NMATH.KinematicsLink[] = []

        /* update the Jacobians */

        for (let link = 0; link < genser.link_num; link++) {
            linkout[link] = genser.links[link].jointSet(jest[link], false)
            // weights[link] =
            //     IK.LinkQuantities.GO_QUANTITY_LENGTH == genser.links[link].quantity
            //         ? genser.links[link].body.mass
            //         : IK.LinkQuantities.QUANTITY_ANGLE == genser.links[link].quantity
            //         ? genser.links[link].body.inertia[2][2]
            //         : 1
        }

        const { Jfwd: Jfwd, T_L_0: T_L_0 } = computeForwardJacobian(linkout, genser.link_num)

        const Jinv = new NMATH.MatrixN(genser.link_num, 6)

        // try {
        //     Jinv.copy(computeInverseJacobian(Jfwd))
        // } catch (e) {
        //     console.error(
        //         "computeInverseJacobian: error encountered calculating inverse Jacobian: ",
        //         e
        //     )
        //     throw e
        // }

        var inverseMl = inverse(Jfwd.el, true)

        const mlMatrixN = new NMATH.MatrixN(
            inverseMl.rows,
            inverseMl.columns,
            inverseMl.to2DArray()
        )

        Jinv.copy(mlMatrixN)

        /* pest is the resulting pose estimate given joint estimate */
        // const { pose: pest } = forwardKinematics(genser, jest)

        // todo to need to call forwardKinematics??
        const pest = new THREE.Matrix4().copy(T_L_0)

        const pestV3 = new THREE.Vector3()
        const pestQ = new THREE.Quaternion()
        pest.decompose(pestV3, pestQ, new THREE.Vector3())

        /* pestinv is its inverse */
        const pestinv = new THREE.Matrix4()
        // pestinv.inversePose(pest)
        pestinv.copy(pest.clone().invert())

        // go_pose_inv(&pest, &pestinv);
        /*
          Tdelta is the incremental pose from pest to pos, such that
          0        L         0
          . pest *  Tdelta =  pos, or
          L        L         L
          L         L          0
          .Tdelta =  pestinv *  pos
          L         0          L
        */

        const Tdelta = new THREE.Matrix4()
        Tdelta.multiplyMatrices(pestinv, world)

        const check = new THREE.Matrix4()
        check.multiplyMatrices(pest, Tdelta)

        const checkV3 = new THREE.Vector3()
        const checkQ = new THREE.Quaternion()
        check.decompose(checkV3, checkQ, new THREE.Vector3())
        // console.log(
        //     "check",
        //     checkV3.x,
        //     checkV3.y,
        //     checkV3.z,
        //     checkQ.x,
        //     checkQ.y,
        //     checkQ.z,
        //     checkQ.w
        // )

        // go_pose_pose_mult(&pestinv, pos, &Tdelta);

        const TdeltaV3 = new THREE.Vector3()
        const TdeltaQ = new THREE.Quaternion()
        Tdelta.decompose(TdeltaV3, TdeltaQ, new THREE.Vector3())
        // console.log(
        //     "Tdelta",
        //     TdeltaV3.x,
        //     TdeltaV3.y,
        //     TdeltaV3.z,
        //     TdeltaQ.x,
        //     TdeltaQ.y,
        //     TdeltaQ.z,
        //     TdeltaQ.w
        // )
        const tCart = new THREE.Vector3()
        Tdelta.decompose(tCart, new THREE.Quaternion(), new THREE.Vector3())
        const pestM3 = new THREE.Matrix3().setFromMatrix4(pest)

        // console.log("tCart before rot back", tCart.x, tCart.y, tCart.z)
        // pestM3.invert()
        if (ROTATE_JACOBIANS_BACK) {
            // cart.copy(Tdelta.tran.clone().applyQuaternion(pest.rot))
            // tCart.applyMatrix3(pestM3)
            // go_quat_cart_mult(&pest.rot, &Tdelta.tran, &cart);
        } else {
            // cart = Tdelta.tran;
        }
        // console.log("tCart after rot back", tCart.x, tCart.y, tCart.z)

        dvw[0] = []
        dvw[1] = []
        dvw[2] = []
        dvw[0][0] = tCart.x
        dvw[1][0] = tCart.y
        dvw[2][0] = tCart.z

        // console.log("dvw", dvw)

        /* to rotate the rotation differential, convert it to a
           velocity and rotate that */

        // go_quat_rvec_convert(&Tdelta.rot, &rvec);

        const rCart = new THREE.Vector3()
        const rvec = new THREE.Vector3()
        // const qFromRot = new THREE.Quaternion().copy(Tdelta.rot)
        const qFromRot = new THREE.Quaternion().setFromRotationMatrix(Tdelta)

        // this works the same as teh code beelow - quat to rodrigues
        //
        // const halfAngle = Math.acos(qFromRot.w)
        // // double halfAngle = std::acos(q[3]);
        // // double sinHalfAngle = std::sin(halfAngle);
        // const sinHalfAngle = Math.sin(halfAngle)
        // // double angle = halfAngle * 2.0;
        // const angle = halfAngle * 2.0
        // // double factor = angle / sinHalfAngle;
        // const factor = angle / sinHalfAngle
        // console.log("factor", factor)
        // rvec.set(factor * qFromRot.x, factor * qFromRot.y, factor * qFromRot.z)

        // const revEuler = new THREE.Euler().setFromQuaternion(qFromRot)

        // console.log("invertq", qFromRot.clone().invert())
        //
        var mag

        const sh = Math.sqrt(
            Math.pow(qFromRot.x, 2) + Math.pow(qFromRot.y, 2) + Math.pow(qFromRot.z, 2)
        )

        if (NMATH.ROT_SMALL(sh)) {
            rvec.set(0, 0, 0)
            // console.log("rot small")
        } else {
            mag = (2 * Math.atan2(sh, qFromRot.w)) / sh
            // console.log("mag", mag)
            rvec.set(mag * qFromRot.x, mag * qFromRot.y, mag * qFromRot.z)
        }
        rCart.set(rvec.x, rvec.y, rvec.z)

        // console.log("rCart before rot back", rCart.x, rCart.y, rCart.z)
        if (ROTATE_JACOBIANS_BACK) {
            // rCart.applyMatrix3(pestM3)
            // go_quat_cart_mult(&pest.rot, &cart, &cart);
        }
        // console.log("rCart after rot back", rCart.x, rCart.y, rCart.z)

        dvw[3] = []
        dvw[4] = []
        dvw[5] = []
        dvw[3][0] = rCart.x
        dvw[4][0] = rCart.y
        dvw[5][0] = rCart.z

        // console.log("rcart", rCart.x, rCart.y, rCart.z)
        // console.log("dvw", dvw)
        /* push the Cartesian velocity vector through the inverse Jacobian */
        // go_matrix_vector_mult(&Jinv, dvw, dj);

        const dvwRow = [[dvw[0][0], dvw[1][0], dvw[2][0], dvw[3][0], dvw[4][0], dvw[5][0]]]

        const dvwColumn = [
            [dvw[0][0]],
            [dvw[1][0]],
            [dvw[2][0]],
            [dvw[3][0]],
            [dvw[4][0]],
            [dvw[5][0]]
        ]

        const nmDvwColumn = new NMATH.MatrixN(6, 1, dvwColumn)

        // console.log("Jinv", Jinv)

        //when dj is a row this should error
        // const dj = Jinv.multiplyMatrixVector(dvw)

        // const dj = Jinv.multiplyMatrixVector(dvwColumn)

        const dj = []
        for (let row = 0; row < Jinv.rows; row++) {
            dj[row] = 0
            for (let i = 0; i < Jinv.cols; i++) {
                dj[row] += Jinv.el[row][i] * dvw[i][0] //original
            }
        }

        // const nmDj = new NMATH.MatrixN(6, 1).multiplyMatrices(Jinv, nmDvwColumn)
        //
        // const dj = nmDj.el

        console.log(
            "dj (degrees)",
            (dj[0] * 180) / Math.PI,
            (dj[1] * 180) / Math.PI,
            (dj[2] * 180) / Math.PI,
            (dj[3] * 180) / Math.PI,
            (dj[4] * 180) / Math.PI,
            (dj[5] * 180) / Math.PI
        )

        // const dvwTran = [[dvw[0][0], dvw[1][0], dvw[2][0], 0, 0, 0]]
        // const dvwRot = [[0, 0, 0, dvw[3][0], dvw[4][0], dvw[5][0]]]

        // const djTran = Jinv.transpose().multiplyMatrixVector(dvwTran)
        // const djRot = Jinv.transpose().multiplyMatrixVector(dvwRot)

        // const djTran = Jinv.multiplyMatrixVector(dvwTran)
        // const djRot = Jinv.multiplyMatrixVector(dvwRot)

        // console.log("djTran", djTran)
        // console.log("djRot", djRot)

        // const dj = [
        //     [
        //         djTran[0][0] + djRot[0][0],
        //         djTran[0][1] + djRot[0][1],
        //         djTran[0][2] + djRot[0][2],
        //         djTran[0][3] + djRot[0][3],
        //         djTran[0][4] + djRot[0][4],
        //         djTran[0][5] + djRot[0][5]
        //     ]
        // ]
        // console.log("dj", dj)
        smalls = 0
        /* check for small joint increments, if so we're done */
        for (let link = 0; link < genser.link_num; link++) {
            if (NMATH.LinkQuantities.QUANTITY_LENGTH == linkout[link].quantity) {
                // if (NMATH.TRAN_SMALL(dj[0][link])) {
                // if (NMATH.TRAN_SMALL(dj[link][0])) {
                if (NMATH.TRAN_SMALL(dj[link])) {
                    smalls++
                    console.log("tran converged. Number:", smalls)
                }
            } else {
                // if (NMATH.ROT_SMALL(dj[0][link])) {
                // if (NMATH.ROT_SMALL(dj[link][0])) {
                if (NMATH.ROT_SMALL(dj[link])) {
                    smalls++
                    console.log("rot converged. Number:", smalls)
                }
            }
        }
        if (smalls == genser.link_num) {
            /* converged, copy jest[] out */
            console.log(
                "jest",
                jest.map(j => (j * 180) / Math.PI)
            )
            // const adjustedKoints = jointsRemoveInitialOffset(jest, genser)
            // adjustedKoints.forEach((j, index) => {
            //     joints[index] = j
            // })
            // console.log(
            //     "joints",
            //     joints.map(j => (j * 180) / Math.PI)
            // )
            for (let link = 0; link < genser.link_num; link++) {
                joints[link] = jest[link]
                console.log("jest", (jest[link] * 180) / Math.PI)
            }
            console.log("Converged [iterations]", genser.iterations)
            return
        }
        console.log("iterations", genser.iterations)
        /* else keep iterating */
        for (let link = 0; link < genser.link_num; link++) {
            // jest[link] += dj[0][link]
            // jest[link] += dj[link][0]
            jest[link] += dj[link]

            if (NMATH.LinkQuantities.QUANTITY_ANGLE == linkout[link].quantity) {
                if (jest[link] > Math.PI) {
                    console.log("adjusting jest")
                    jest[link] -= Math.PI * 2
                } else if (jest[link] < -Math.PI) {
                    jest[link] += Math.PI * 2
                }
            }
        }
    } /* for (iterations) */

    console.log("failed to converge [iterations]", genser.iterations)
}

// Jinv=a,dvw=v, dj=avx
// int go_matrix_vector_mult(const go_matrix * a,
// const go_vector * v,
// go_vector * axv)
// {
//     go_vector * ptrin;
//     go_vector * ptrout;
//     go_integer row, i;
//
//         ptrin = axv;
//         ptrout = NULL;
//     }
//
//     for (row = 0; row < a->rows; row++) {
//     dj[row] = 0;
//     for (i = 0; i < a->cols; i++) {
//         dj[row] += Jinv[row][i] * dvw[i];
//     }
// }
//
