/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import { describe, it, assert, expect, test } from "vitest"
import * as THREE from "three"
import { computeForwardJacobian } from "../ForwardJacobian"
import { computeInverseJacobian } from "../InverseJacobian"
import { staubliTx40Modified } from "../ExampleMachines/StaubliTx40Modified"
import { staubliTx40Classic } from "../ExampleMachines/StaubliTx40Classic"
import { forwardKinematics } from "../ForwardKinematics"
import { inverseKinematics } from "../InverseKinematics"
import * as NMATH from "../NMATH/index"

describe("InverseKinematics", () => {
    test("InverseKinematics TX40 - Classic - 230.93, 300.56, 18.60", () => {
        const worldV3 = new THREE.Vector3(230.93, 300.56, 18.6)
        const worldQ = new THREE.Quaternion(0.1315, 0.856, 0.4999, -0.00875)

        const world = new THREE.Matrix4().compose(worldV3, worldQ, new THREE.Vector3(1, 1, 1))

        // const joints = [
        //     40 * (Math.PI / 180),
        //     (38 * Math.PI) / 180 - Math.PI / 2,
        //     (80 * Math.PI) / 180 + Math.PI / 2,
        //     (78 * Math.PI) / 180,
        //     (23 * Math.PI) / 180,
        //     -0 * (Math.PI / 180) //mod
        // ]
        const joints = [
            40 * (Math.PI / 180),
            (38 * Math.PI) / 180,
            (80 * Math.PI) / 180,
            (78 * Math.PI) / 180,
            (23 * Math.PI) / 180,
            -0 * (Math.PI / 180) //mod
        ]

        inverseKinematics(staubliTx40Classic, world, joints)
        const fwdCheck = forwardKinematics(staubliTx40Classic, joints)
        const position = new THREE.Vector3().setFromMatrixPosition(fwdCheck.pose)
        const orientation = new THREE.Quaternion().setFromRotationMatrix(fwdCheck.pose)

        console.log("position - check from running fwdkin", position)
        console.log("orientation - check from running fwdkin", orientation)
        // joints[1] = joints[1] - Math.PI / 2
        // joints[2] = joints[2] + Math.PI / 2

        console.log(
            "joints (adjusted)",
            joints.map(j => j * (180 / Math.PI))
        )
        expect(joints[0]).toBeCloseTo(41.56 * (Math.PI / 180), 3)
        expect(joints[1]).toBeCloseTo(39 * (Math.PI / 180), 3)
        expect(joints[2]).toBeCloseTo(84.37 * (Math.PI / 180), 3)
        expect(joints[3]).toBeCloseTo(84.29 * (Math.PI / 180), 3)
        expect(joints[4]).toBeCloseTo(34.59 * (Math.PI / 180), 3)
        expect(joints[5]).toBeCloseTo(-6.61 * (Math.PI / 180), 3)
    })

    test("InverseKinematics TX40 - Classic - 243.93, 360.56, 126.6", () => {
        const worldV3 = new THREE.Vector3(243.93, 360.56, 126.6)
        const worldQ = new THREE.Quaternion(0.1315, 0.856, 0.4999, -0.00875)

        const world = new THREE.Matrix4().compose(worldV3, worldQ, new THREE.Vector3(1, 1, 1))

        const joints = [
            5 * (Math.PI / 180),
            (44 * Math.PI) / 180,
            (43 * Math.PI) / 180,
            (40 * Math.PI) / 180,
            (40 * Math.PI) / 180,
            10 * (Math.PI / 180) //mod
        ]

        inverseKinematics(staubliTx40Classic, world, joints)
        const fwdCheck = forwardKinematics(staubliTx40Classic, joints)
        const position = new THREE.Vector3().setFromMatrixPosition(fwdCheck.pose)
        const orientation = new THREE.Quaternion().setFromRotationMatrix(fwdCheck.pose)

        console.log("position - check from running fwdkin", position)
        console.log("orientation - check from running fwdkin", orientation)
        // joints[1] = joints[1] - Math.PI / 2
        // joints[2] = joints[2] + Math.PI / 2

        console.log(
            "joints (adjusted)",
            joints.map(j => j * (180 / Math.PI))
        )

        expect(joints[0]).toBeCloseTo(47 * (Math.PI / 180), 3)
        expect(joints[1]).toBeCloseTo(45 * (Math.PI / 180), 3)
        expect(joints[2]).toBeCloseTo(45 * (Math.PI / 180), 3)
        expect(joints[3]).toBeCloseTo(45 * (Math.PI / 180), 3)
        expect(joints[4]).toBeCloseTo(45 * (Math.PI / 180), 3)
        expect(joints[5]).toBeCloseTo(45 * (Math.PI / 180), 3)
    })

    test("InverseKinematics TX40 - Modified - 243.93, 360.56, 126.6", () => {
        const worldV3 = new THREE.Vector3(243.93, 360.56, 126.6)
        const worldQ = new THREE.Quaternion(0.1315, 0.856, 0.4999, -0.00875)

        const world = new THREE.Matrix4().compose(worldV3, worldQ, new THREE.Vector3(1, 1, 1))

        const joints = [
            5 * (Math.PI / 180),
            (44 * Math.PI) / 180,
            (43 * Math.PI) / 180,
            (40 * Math.PI) / 180,
            (40 * Math.PI) / 180,
            10 * (Math.PI / 180) //mod
        ]

        inverseKinematics(staubliTx40Modified, world, joints)

        const fwdCheck = forwardKinematics(staubliTx40Modified, joints)
        const position = new THREE.Vector3().setFromMatrixPosition(fwdCheck.pose)
        const orientation = new THREE.Quaternion().setFromRotationMatrix(fwdCheck.pose)

        console.log("position - check from running fwdkin", position)
        console.log("orientation - check from running fwdkin", orientation)
        // joints[1] = joints[1] - Math.PI / 2
        // joints[2] = joints[2] + Math.PI / 2
        console.log(
            "joints (adjusted)",
            joints.map(j => j * (180 / Math.PI))
        )

        expect(joints[0]).toBeCloseTo(47 * (Math.PI / 180), 3)
        expect(joints[1]).toBeCloseTo(45 * (Math.PI / 180), 3)
        expect(joints[2]).toBeCloseTo(45 * (Math.PI / 180), 3)
        expect(joints[3]).toBeCloseTo(45 * (Math.PI / 180), 3)
        expect(joints[4]).toBeCloseTo(45 * (Math.PI / 180), 3)
        expect(joints[5]).toBeCloseTo(45 * (Math.PI / 180), 3)
    })
})
