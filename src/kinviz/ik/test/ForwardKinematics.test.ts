/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import { describe, it, assert, expect, test } from "vitest"
import * as THREE from "three"
import * as NAMTH from "../NMATH/index"
import { computeForwardJacobian } from "../ForwardJacobian"
import { staubliTx40Modified } from "../ExampleMachines/StaubliTx40Modified"
import { staubliTx40Classic } from "../ExampleMachines/StaubliTx40Classic"
import { adeptCobra600Classic } from "../ExampleMachines/AdeptCobra600Classic"

import { forwardKinematics } from "../ForwardKinematics"
import { computeForwardJacobianAlternative } from "../ForwardJacobianAlternative"

describe("ForwardKinematics", () => {
    // works
    test("ForwardKinematics TX40 Modfified random joints", () => {
        const res = forwardKinematics(staubliTx40Modified, [
            (41.56 * Math.PI) / 180,
            (39.0 * Math.PI) / 180,
            (84.37 * Math.PI) / 180,
            (84.29 * Math.PI) / 180,
            (34.59 * Math.PI) / 180,
            (-6.613 * Math.PI) / 180
        ])

        const tcpEuler = new THREE.Euler().setFromRotationMatrix(res.pose)
        const tcpQuat = new THREE.Quaternion().setFromRotationMatrix(res.pose)
        const tcpPosition = new THREE.Vector3().setFromMatrixPosition(res.pose)
        console.log(
            "tcpEuler",
            (tcpEuler.x * 180) / Math.PI,
            (tcpEuler.y * 180) / Math.PI,
            (tcpEuler.z * 180) / Math.PI
        )
        console.log("tcpQuat", tcpQuat.x, tcpQuat.y, tcpQuat.z, tcpQuat.w)
        console.log("tcpPosition", tcpPosition.x, tcpPosition.y, tcpPosition.z)

        expect(tcpPosition.x).toBeCloseTo(230.90407443520849)
        expect(tcpPosition.y).toBeCloseTo(300.5635353927738)
        expect(tcpPosition.z).toBeCloseTo(18.598964746484604)

        //here the euler angles are not correct but the quaternion is - this is caused by Euler angles not being unique
        // expect((tcpEuler.x * 180) / Math.PI).toBeCloseTo(59.77)
        // expect((tcpEuler.y * 180) / Math.PI).toBeCloseTo(173.31)
        // expect((tcpEuler.z * 180) / Math.PI).toBeCloseTo(13.62)

        expect(tcpQuat.x).toBeCloseTo(0.1315095878295303)
        expect(tcpQuat.y).toBeCloseTo(0.8559778929247291)
        expect(tcpQuat.z).toBeCloseTo(0.4999298490080868)
        expect(tcpQuat.w).toBeCloseTo(-0.008787559604329169)
    })

    //works
    test("ForwardKinematics TX40 Classic 0 joints", () => {
        // console.log(staubliTx40.links[1].dh)

        const res = forwardKinematics(staubliTx40Classic, [0, 0, 0, 0, 0, 0])

        console.log(res)
        const tcpEuler = new THREE.Euler().setFromRotationMatrix(res.pose)
        console.log(
            "tcpEuler",
            (tcpEuler.x * 180) / Math.PI,
            (tcpEuler.y * 180) / Math.PI,
            (tcpEuler.z * 180) / Math.PI
        )

        const position = new THREE.Vector3().setFromMatrixPosition(res.pose)
        const orientation = new THREE.Quaternion().setFromRotationMatrix(res.pose)

        expect(position.x).toBeCloseTo(0)

        expect(position.y).toBeCloseTo(35)
        expect(position.z).toBeCloseTo(515)

        expect(orientation.x).toBeCloseTo(0)
        expect(orientation.y).toBeCloseTo(0)
        expect(orientation.z).toBeCloseTo(0)
        expect(orientation.w).toBeCloseTo(1)

        //0,35,515
        //-225,35,290
    })

    //works
    test("ForwardKinematics TX40 Modified 0 joints", () => {
        // console.log(staubliTx40.links[1].dh)

        const res = forwardKinematics(staubliTx40Modified, [0, 0, 0, 0, 0, 0])

        console.log(res)
        const tcpEuler = new THREE.Euler().setFromRotationMatrix(res.pose)
        console.log(
            "tcpEuler",
            (tcpEuler.x * 180) / Math.PI,
            (tcpEuler.y * 180) / Math.PI,
            (tcpEuler.z * 180) / Math.PI
        )

        const position = new THREE.Vector3().setFromMatrixPosition(res.pose)
        const orientation = new THREE.Quaternion().setFromRotationMatrix(res.pose)
        //0,35,515
        //-225,35,290

        expect(position.x).toBeCloseTo(0)

        expect(position.y).toBeCloseTo(35)
        expect(position.z).toBeCloseTo(515)

        expect(position.x).toBeCloseTo(0)
        expect(orientation.y).toBeCloseTo(0)
        expect(orientation.z).toBeCloseTo(0)
        expect(orientation.w).toBeCloseTo(1)
    })

    //works
    test("ForwardKinematics TX40 - modified - orientated joints 1", () => {
        // console.log(staubliTx40.links[1].dh)

        const res = forwardKinematics(staubliTx40Modified, [
            (7.05 * Math.PI) / 180,
            (8.47 * Math.PI) / 180,
            (76.05 * Math.PI) / 180,
            (127.66 * Math.PI) / 180,
            (-8.92 * Math.PI) / 180,
            (232 * Math.PI) / 180
        ])
        //from staubli euler is 18.83, 90.00,-18.83 = ?? gimbal lock
        //[0.23,0.67,0.23,0.67] possibly[0.23,0.67,-0.23,0.67]

        console.log(res)
        const tcpEuler = new THREE.Euler().setFromRotationMatrix(res.pose)
        console.log(
            "tcpEuler",
            (tcpEuler.x * 180) / Math.PI,
            (tcpEuler.y * 180) / Math.PI,
            (tcpEuler.z * 180) / Math.PI
        )

        const position = new THREE.Vector3().setFromMatrixPosition(res.pose)
        console.log("position", position.x, position.y, position.z)
        const orientation = new THREE.Quaternion().setFromRotationMatrix(res.pose)

        expect(position.x).toBeCloseTo(315.87)

        expect(position.y).toBeCloseTo(66.29)
        expect(position.z).toBeCloseTo(244.035)
        //0,90,0 = 0, 0.7071068, 0, 0.7071068
        expect(orientation.x).toBeCloseTo(0)
        expect(orientation.y).toBeCloseTo(0.7071068)
        expect(orientation.z).toBeCloseTo(0)
        expect(orientation.w).toBeCloseTo(0.7071068)

        //0,35,515
        //-225,35,290
    })

    //works
    test("ForwardKinematics TX40 - modified - orientated joints 2", () => {
        // console.log(staubliTx40.links[1].dh)

        const res = forwardKinematics(staubliTx40Modified, [
            (-45 * Math.PI) / 180,
            (-70 * Math.PI) / 180,
            (76.05 * Math.PI) / 180,
            (127.66 * Math.PI) / 180,
            (15 * Math.PI) / 180,
            (132.0 * Math.PI) / 180
        ])

        const tcpPosition = new THREE.Vector3().setFromMatrixPosition(res.pose)
        const tcpEuler = new THREE.Euler().setFromRotationMatrix(res.pose)
        const tcpQuat = new THREE.Quaternion().setFromRotationMatrix(res.pose)
        console.log(
            "tcpEuler",
            (tcpEuler.x * 180) / Math.PI,
            (tcpEuler.y * 180) / Math.PI,
            (tcpEuler.z * 180) / Math.PI
        )
        console.log("tcpQuat", tcpQuat.x, tcpQuat.y, tcpQuat.z, tcpQuat.w)
        console.log("tcpPosition", tcpPosition.x, tcpPosition.y, tcpPosition.z)
        expect(tcpPosition.x).toBeCloseTo(-101.1180691201187)

        expect(tcpPosition.y).toBeCloseTo(169.45)
        expect(tcpPosition.z).toBeCloseTo(364.22)
        //0,90,0 = 0, 0.7071068, 0, 0.7071068
        expect(tcpQuat.x).toBeCloseTo(0.07874)
        expect(tcpQuat.y).toBeCloseTo(0.0721)
        expect(tcpQuat.z).toBeCloseTo(0.9475)
        expect(tcpQuat.w).toBeCloseTo(-0.30141)

        //0,35,515
        //-225,35,290
    })

    //works
    test("ForwardKinematics TX40 - classic - orientated joints 2", () => {
        // console.log(staubliTx40.links[1].dh)

        const res = forwardKinematics(staubliTx40Classic, [
            (-45 * Math.PI) / 180,
            (-7 * Math.PI) / 180,
            (76.05 * Math.PI) / 180,
            (127.66 * Math.PI) / 180,
            (15 * Math.PI) / 180,
            (132.0 * Math.PI) / 180
        ])
        /*from staubli
        202.22
        -133.89
        335.82
        42.58
        47.97
        -157.24

        q = 0.31 -0.40 0.81 -0.31

         */
        console.log(res)
        const tcpEuler = new THREE.Euler().setFromRotationMatrix(res.pose)
        console.log(
            "tcpEuler",
            (tcpEuler.x * 180) / Math.PI,
            (tcpEuler.y * 180) / Math.PI,
            (tcpEuler.z * 180) / Math.PI
        )

        const fromEulerQ = new THREE.Quaternion().setFromEuler(tcpEuler)
        console.log("fromEulerQ", fromEulerQ)

        const position = new THREE.Vector3().setFromMatrixPosition(res.pose)
        const orientation = new THREE.Quaternion().setFromRotationMatrix(res.pose)

        expect(position.x).toBeCloseTo(202.22)

        expect(position.y).toBeCloseTo(-133.89)
        expect(position.z).toBeCloseTo(335.82)
        //0,90,0 = 0, 0.7071068, 0, 0.7071068
        expect(orientation.x).toBeCloseTo(0.30585)
        expect(orientation.y).toBeCloseTo(-0.4)
        expect(orientation.z).toBeCloseTo(0.805)
        expect(orientation.w).toBeCloseTo(-0.3126826896)

        //0,35,515
        //-225,35,290
    })

    //works
    test("ForwardKinematics adeptCobra600 - classic - all zeros", () => {
        // console.log(staubliTx40.links[1].dh)

        const res = forwardKinematics(adeptCobra600Classic, [
            (0 * Math.PI) / 180,
            (0 * Math.PI) / 180,
            (0 * Math.PI) / 180,
            (0 * Math.PI) / 180,
            (0 * Math.PI) / 180,
            (0 * Math.PI) / 180
        ])

        // from matlab
        // 1         0         0       0.6
        // 0        -1         0         0
        // 0         0        -1     0.387
        // 0         0         0         1

        console.log(res)
        const tcpEuler = new THREE.Euler().setFromRotationMatrix(res.pose)
        console.log(
            "tcpEuler",
            (tcpEuler.x * 180) / Math.PI,
            (tcpEuler.y * 180) / Math.PI,
            (tcpEuler.z * 180) / Math.PI
        )

        const fromEulerQ = new THREE.Quaternion().setFromEuler(tcpEuler)
        console.log("fromEulerQ", fromEulerQ)

        const position = new THREE.Vector3().setFromMatrixPosition(res.pose)
        const orientation = new THREE.Quaternion().setFromRotationMatrix(res.pose)

        expect(position.x).toBeCloseTo(0.6)

        expect(position.y).toBeCloseTo(0)
        expect(position.z).toBeCloseTo(0.387)
        expect(orientation.x).toBeCloseTo(1)
        expect(orientation.y).toBeCloseTo(0)
        expect(orientation.z).toBeCloseTo(0)
        expect(orientation.w).toBeCloseTo(0)
    })
})
