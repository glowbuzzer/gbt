/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import { describe, it, assert, expect, test } from "vitest"
import * as THREE from "three"
import * as NAMTH from "../NMATH/index"
import { computeForwardJacobian } from "../ForwardJacobian"
import { staubliTx40Classic, staubliTx40Modified } from "../GenericSerialConfigs"
import { forwardKinematics } from "../ForwardKinematics"
import { computeForwardJacobianAlternative } from "../ForwardJacobianAlternative"

describe("ForwardKinematics", () => {
    test("ForwardKinematics TX40 Modfified random joints", () => {
        const res = forwardKinematics(staubliTx40Modified, [
            (-79.04036297267955 * Math.PI) / 180,
            (-90.44381812369944 * Math.PI) / 180,
            (107.90708526322177 * Math.PI) / 180,
            (80.50891975261167 * Math.PI) / 180,
            (77.40907321667963 * Math.PI) / 180,
            (-13.788589025002363 * Math.PI) / 180
        ])

        const tcpEuler = new THREE.Euler().setFromRotationMatrix(res.pose)
        console.log(
            "tcpEuler",
            (tcpEuler.x * 180) / Math.PI,
            (tcpEuler.y * 180) / Math.PI,
            (tcpEuler.z * 180) / Math.PI
        )

        console.log(res)
    })

    test("ForwardKinematics TX40 Classic 0 joints", () => {
        // console.log(staubliTx40.links[1].dh)

        const res = forwardKinematics(staubliTx40Classic, [0, -Math.PI / 2, Math.PI / 2, 0, 0, 0])

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

    test("ForwardKinematics TX40 Modified 0 joints", () => {
        // console.log(staubliTx40.links[1].dh)

        const res = forwardKinematics(staubliTx40Modified, [0, -Math.PI / 2, Math.PI / 2, 0, 0, 0])

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

    test("ForwardKinematics TX40 - modified - orientated joints 1", () => {
        // console.log(staubliTx40.links[1].dh)

        const res = forwardKinematics(staubliTx40Modified, [
            (7.05 * Math.PI) / 180,
            ((8.47 - 90) * Math.PI) / 180,
            ((76.05 + 90) * Math.PI) / 180,
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

    test("ForwardKinematics TX40 - modified - orientated joints 2", () => {
        // console.log(staubliTx40.links[1].dh)

        const res = forwardKinematics(staubliTx40Modified, [
            (-45 * Math.PI) / 180,
            ((-7 - 90) * Math.PI) / 180,
            ((76.05 + 90) * Math.PI) / 180,
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

        const position = new THREE.Vector3().setFromMatrixPosition(res.pose)
        const orientation = new THREE.Quaternion().setFromRotationMatrix(res.pose)
        expect(position.x).toBeCloseTo(202.22)

        expect(position.y).toBeCloseTo(-133.89)
        expect(position.z).toBeCloseTo(335.82)
        //0,90,0 = 0, 0.7071068, 0, 0.7071068
        expect(orientation.x).toBeCloseTo(0.30585)
        expect(orientation.y).toBeCloseTo(-0.4)
        expect(orientation.z).toBeCloseTo(0.805)
        expect(orientation.w).toBeCloseTo(-0.313)

        //0,35,515
        //-225,35,290
    })

    test("ForwardKinematics TX40 - classic - orientated joints 2", () => {
        // console.log(staubliTx40.links[1].dh)

        const res = forwardKinematics(staubliTx40Classic, [
            (-45 * Math.PI) / 180,
            ((-7 - 90) * Math.PI) / 180,
            ((76.05 + 90) * Math.PI) / 180,
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
})
