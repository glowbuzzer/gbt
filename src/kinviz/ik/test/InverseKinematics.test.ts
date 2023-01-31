/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import { describe, it, assert, expect, test } from "vitest"
import * as THREE from "three"
import { computeForwardJacobian } from "../ForwardJacobian"
import { computeInverseJacobian } from "../InverseJacobian"
import { staubliTx40Modified, staubliTx40Classic } from "../GenericSerialConfigs"
import { forwardKinematics } from "../ForwardKinematics"
import { inverseKinematics } from "../InverseKinematics"
import * as NMATH from "../NMATH/index"

test("InverseKinematics TX40 - Classic", () => {
    // original
    // const worldV3 = new THREE.Vector3(315.87, 66.3, 244.02)
    // const worldQ = new THREE.Quaternion(0.0311703, 0.6474601, 0.0119963, 0.7613671)

    const worldV3 = new THREE.Vector3(314.87, 66.3, 244.02)
    const worldQ = new THREE.Quaternion(0.0311703, 0.6474601, 0.0119963, 0.7613671)

    //[11.31, 80.63, -7.8] = [ 0.0311703, 0.6474601, 0.0119963, 0.7613671 ]

    const world = new THREE.Matrix4().compose(worldV3, worldQ, new THREE.Vector3(1, 1, 1))

    //one of 8 configs
    const joints = [
        7.485 * (Math.PI / 180),
        (8.6341 * Math.PI) / 180 - Math.PI / 2,
        (78.5145 * Math.PI) / 180 + Math.PI / 2,
        (235.2817 * Math.PI) / 180,
        (11.2378 * Math.PI) / 180,
        // 127.39 * (Math.PI / 180) //original
        127.3943 * (Math.PI / 180) //mod
    ]

    // const joints = [
    //     6.91 * (Math.PI / 180),
    //     (8.2 * Math.PI) / 180 - Math.PI / 2,
    //     (75 * Math.PI) / 180 + Math.PI / 2,
    //     (127 * Math.PI) / 180,
    //     (-9 * Math.PI) / 180,
    //     -128 * (Math.PI / 180)
    // ]
    // 11.31,88.63-11.80
    inverseKinematics(staubliTx40Classic, world, joints)

    console.log(joints.map(j => j * (180 / Math.PI)))
})

test("InverseKinematics TX40 - Modified", () => {
    // original
    // const worldV3 = new THREE.Vector3(315.87, 66.3, 244.02)
    // const worldQ = new THREE.Quaternion(0.0311703, 0.6474601, 0.0119963, 0.7613671)

    const worldV3 = new THREE.Vector3(243.93, 360.56, 126.6)
    const worldQ = new THREE.Quaternion(0.1315, 0.856, 0.4999, -0.00875)

    //[11.31, 80.63, -7.8] = [ 0.0311703, 0.6474601, 0.0119963, 0.7613671 ]

    const world = new THREE.Matrix4().compose(worldV3, worldQ, new THREE.Vector3(1, 1, 1))

    //one of 8 configs
    const joints = [
        45 * (Math.PI / 180),
        (45 * Math.PI) / 180 - Math.PI / 2,
        (45 * Math.PI) / 180 + Math.PI / 2,
        (45 * Math.PI) / 180,
        (45 * Math.PI) / 180,
        // 127.39 * (Math.PI / 180) //original
        45 * (Math.PI / 180) //mod
    ]

    // const joints = [
    //     6.91 * (Math.PI / 180),
    //     (8.2 * Math.PI) / 180 - Math.PI / 2,
    //     (75 * Math.PI) / 180 + Math.PI / 2,
    //     (127 * Math.PI) / 180,
    //     (-9 * Math.PI) / 180,
    //     -128 * (Math.PI / 180)
    // ]
    // 11.31,88.63-11.80
    inverseKinematics(staubliTx40Modified, world, joints)

    const fwdCheck = forwardKinematics(staubliTx40Modified, joints)
    const position = new THREE.Vector3().setFromMatrixPosition(fwdCheck.pose)
    const orientation = new THREE.Quaternion().setFromRotationMatrix(fwdCheck.pose)

    console.log("position - check from running fwdkin", position)
    console.log("orientation - check from running fwdkin", orientation)
    joints[1] = joints[1] + Math.PI / 2
    joints[2] = joints[2] - Math.PI / 2
    console.log(
        "joints (adjusted)",
        joints.map(j => j * (180 / Math.PI))
    )
})
