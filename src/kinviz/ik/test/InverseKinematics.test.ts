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

    const worldV3 = new THREE.Vector3(111, -60, 450)
    const worldQ = new THREE.Quaternion(0.0311703, 0.6474601, 0.0119963, 0.7613671)

    //[11.31, 80.63, -7.8] = [ 0.0311703, 0.6474601, 0.0119963, 0.7613671 ]

    const world = new THREE.Matrix4().compose(worldV3, worldQ, new THREE.Vector3(1, 1, 1))

    //one of 8 configs
    const joints = [
        -50 * (Math.PI / 180),
        (0.6 * Math.PI) / 180 - Math.PI / 2,
        (30 * Math.PI) / 180 + Math.PI / 2,
        (-200 * Math.PI) / 180,
        (37.24 * Math.PI) / 180,
        // 127.39 * (Math.PI / 180) //original
        180.3 * (Math.PI / 180) //mod
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

    joints[1] = joints[1] + Math.PI / 2
    joints[2] = joints[2] - Math.PI / 2

    console.log(
        "joints (adjusted)",
        joints.map(j => j * (180 / Math.PI))
    )
})
