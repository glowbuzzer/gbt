/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { describe, it, assert, expect, test } from "vitest"

import * as THREE from "three"
import * as NMATH from "../NMATH"
import { computeForwardJacobian } from "../ForwardJacobian"
import { staubliTx40Modified } from "../ExampleMachines/StaubliTx40Modified"
import { staubliTx40Classic } from "../ExampleMachines/StaubliTx40Classic"
import { adeptCobra600Classic } from "../ExampleMachines/AdeptCobra600Classic"
import { computeForwardJacobianAlternative } from "../ForwardJacobianAlternative"

describe("ForwardJacobian", () => {
    test("ForwardJacobian TX40 - basic", () => {
        const res = computeForwardJacobian(staubliTx40Classic.links, 6)
        console.log("res", res)
        console.log("res.Jfwd.el", res.Jfwd.el)

        expect(1).toBe(0)
    })

    test("ForwardJacobian TX40 - medium - classic", () => {
        const genser = staubliTx40Classic
        const joints = [
            0,
            (2 * Math.PI) / 180,
            (2 * Math.PI) / 180,
            (2 * Math.PI) / 180,
            (2 * Math.PI) / 180,
            0
        ]

        const linkout: NMATH.KinematicsLink[] = []

        for (let i = 0; i < genser.link_num; i++) {
            linkout[i] = new NMATH.KinematicsLink()
        }

        for (let link = 0; link < genser.link_num; link++) {
            linkout[link] = genser.links[link].jointSet(joints[link], true)
            // weights[link] =
            //     IK.LinkQuantities.GO_QUANTITY_LENGTH == genser.links[link].quantity
            //         ? genser.links[link].body.mass
            //         : IK.LinkQuantities.QUANTITY_ANGLE == genser.links[link].quantity
            //         ? genser.links[link].body.inertia[2][2]
            //         : 1
        }

        const { Jfwd: Jfwd, T_L_0: T_L_0 } = computeForwardJacobian(linkout, genser.link_num)

        console.log("Jfwd", Jfwd)
        console.log("T_L_0", T_L_0)
        expect(1).toBe(0)
    })

    test("ForwardJacobian TX40 - 3 joint", () => {
        const threeRlink1: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, -Math.PI / 2, 3, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const threeRlink2: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, -Math.PI / 2, 0, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const threeRlink3: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, 0, 0, 5, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )

        const links = [threeRlink1, threeRlink2, threeRlink3]

        const { Jfwd: Jfwd, T_L_0: T_L_0 } = computeForwardJacobian(links, 3)

        console.log("Jfwd", Jfwd)
        console.log("T_L_0", T_L_0)

        expect(1).toBe(0)
    })
    //works
    test("ForwardJacobian - 2 joint", () => {
        const l1 = 3
        const l2 = 4
        const theta1 = 0
        const theta2 = 0

        const twoRlink1: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(l1, 0, 0, 0, theta1, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const twoRlink2: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(l2, 0, 0, 0, theta2, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )

        const links = [twoRlink1, twoRlink2]

        const x = l1 * Math.cos(theta1) + l2 * Math.cos(theta1 + theta2)
        const y = l1 * Math.sin(theta1) + l2 * Math.sin(theta1 + theta2)

        console.log("x", x)
        console.log("y", y)

        const JfwdRes = [
            [
                -l1 * Math.sin(theta1) - l2 * Math.sin(theta1 + theta2),
                -l2 * Math.sin(theta1 + theta2)
            ],
            [
                l1 * Math.cos(theta1) + l2 * Math.cos(theta1 + theta2),
                l2 * Math.cos(theta1 + theta2)
            ],
            [0, 0],
            [0, 0],

            [0, 0],
            [1, 1]
        ]

        // const
        console.log("JfwdRes", JfwdRes)

        const { Jfwd: Jfwd, T_L_0: T_L_0 } = computeForwardJacobian(links, 2)

        console.log("Jfwd", Jfwd)
        console.log("T_L_0", T_L_0)

        // expect(Jfwd.el).toEqual(JfwdRes)

        Jfwd.el
            .flatMap(e => e)
            .forEach((e, i) => {
                expect(e).toBeCloseTo(JfwdRes.flat()[i])
            })
    })

    //works
    test("ForwardJacobian - 6 R IRB 140 - classic dh parameters - 0 0 0 0 0 ", () => {
        //from peter corke
        const sixRlink1: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(70, -Math.PI / 2, 352, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink2: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(360, 0, 0, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink3: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, Math.PI / 2, 0, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink4: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, -Math.PI / 2, 380, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink5: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, Math.PI / 2, 0, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink6: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, Math.PI / 2, 65, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )

        const joints = [Math.PI / 2, 0, -Math.PI / 2, 0, 0, 0]

        const sixRlinks: NMATH.KinematicsLink[] = [
            sixRlink1,
            sixRlink2,
            sixRlink3,
            sixRlink4,
            sixRlink5,
            sixRlink6
        ]

        const JfwdRes = [
            [0, 445, 445, 0, 65, 0],
            [0.0, -360, 0, 0, 0, 0],
            [-430, -0.0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [1.0, 0.0, 0.0, 1.0, 0.0, 1.0],
            [0.0, -1.0, -1.0, 0.0, -1.0, 0.0]
        ]

        const { Jfwd: Jfwd, T_L_0: T_L_0 } = computeForwardJacobian(sixRlinks, 6)

        console.log("Jfwd", Jfwd)
        console.log("T_L_0", T_L_0)

        // expect(Jfwd.el).toEqual(JfwdRes)

        Jfwd.el
            .flatMap(e => e)
            .forEach((e, i) => {
                expect(e).toBeCloseTo(JfwdRes.flat()[i])
            })

        // at 0,0,0,0,0 angle is [ 0.7071068, 0, 0, 0.7071068 ]  q = -q in quaternion-land.
        //at 0,0,0,0,0 position is  { x: 430, y: 0, z: 797 }

        // from matlab
        // 1         0         0      0.43
        // 0         0        -1         0
        // 0         1         0     0.797
        // 0         0         0         1
        //which is 0.7071068, 0, 0, 0.7071068
        const position = new THREE.Vector3().setFromMatrixPosition(T_L_0)
        const orientation = new THREE.Quaternion().setFromRotationMatrix(T_L_0)

        expect(position.x).toEqual(430)
        expect(position.y).toEqual(0)
        expect(position.z).toEqual(797)
        expect(orientation.x).toBeCloseTo(0.7071068)
        expect(orientation.y).toBeCloseTo(0)
        expect(orientation.z).toBeCloseTo(0)
        expect(orientation.w).toBeCloseTo(0.7071068)
    })

    //works
    test("ForwardJacobian - 6 R IRB 140 - classic dh parameters - Math.PI/2, Math.PI/2 Math.PI/2 Math.PI/2 Math.PI/2 ", () => {
        //from peter corke
        const sixRlink1: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(70, -Math.PI / 2, 352, 0, Math.PI / 2, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink2: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(360, 0, 0, 0, Math.PI / 2, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink3: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, Math.PI / 2, 0, 0, Math.PI / 2, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink4: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, -Math.PI / 2, 380, 0, Math.PI / 2, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink5: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, Math.PI / 2, 0, 0, Math.PI / 2, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink6: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, Math.PI / 2, 65, 0, Math.PI / 2, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )

        const joints = [Math.PI / 2, 0, -Math.PI / 2, 0, 0, 0]

        const sixRlinks: NMATH.KinematicsLink[] = [
            sixRlink1,
            sixRlink2,
            sixRlink3,
            sixRlink4,
            sixRlink5,
            sixRlink6
        ]

        const JfwdRes = [
            [-65.0, -740, -380, 65.0, 0, 0],
            [70.0000000000001, 0, 0, -0, 0, 0],
            [0, 0.0, 0, 0, 65, 0],
            [0, 0, 0, 0, 1, 0],
            [0, 1, 1, 0, 0.0, 1.0],
            [1, 0, 0, -1, 0, 0.0]
        ]

        const { Jfwd: Jfwd, T_L_0: T_L_0 } = computeForwardJacobian(sixRlinks, 6)

        console.log("Jfwd", Jfwd)
        console.log("T_L_0", T_L_0)

        Jfwd.el
            .flatMap(e => e)
            .forEach((e, i) => {
                expect(e).toBeCloseTo(JfwdRes.flat()[i])
            })

        // matlab
        // -0.0650   -0.7400   -0.3800    0.0650   -0.0000         0
        // 0.0700   -0.0000   -0.0000   -0.0000   -0.0000         0
        // -0.0000   -0.0000   -0.0000    0.0000    0.0650         0
        // -0.0000   -0.0000   -0.0000    0.0000    1.0000         0
        // 0.0000    1.0000    1.0000   -0.0000    0.0000    1.0000
        // 1.0000   -0.0000   -0.0000   -1.0000    0.0000    0.0000

        const position = new THREE.Vector3().setFromMatrixPosition(T_L_0)
        const orientation = new THREE.Quaternion().setFromRotationMatrix(T_L_0)

        expect(position.x).toBeCloseTo(-65)
        expect(position.y).toBeCloseTo(70)
        expect(position.z).toBeCloseTo(-388)
        expect(orientation.x).toBeCloseTo(0)
        expect(orientation.y).toBeCloseTo(0)
        expect(orientation.z).toBeCloseTo(0.7071067811865475)
        expect(orientation.w).toBeCloseTo(0.7071067811865475)
    })
    //works
    test("ForwardJacobian - 6 R IRB 140 - modified dh params", () => {
        const sixRlink1: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, 0, 352, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink2: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(70, Math.PI / 2, 0, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink3: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(360, 0, 0, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink4: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, Math.PI / 2, 380, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink5: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, -Math.PI / 2, 0, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        //65 missing for d?
        const sixRlink6: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, Math.PI / 2, 0, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )

        const joints = [Math.PI / 2, 0, -Math.PI / 2, 0, 0, 0]

        const sixRlinks: NMATH.KinematicsLink[] = [
            sixRlink1,
            sixRlink2,
            sixRlink3,
            sixRlink4,
            sixRlink5,
            sixRlink6
        ]

        // console.log("sixRlinks", sixRlinks)

        const { Jfwd: Jfwd, T_L_0: T_L_0 } = computeForwardJacobian(sixRlinks, 6)

        console.log("Jfwd", Jfwd)
        console.log("T_L_0", T_L_0)

        //from peter corke
        // 0.0000    0.3800    0.3800         0         0         0
        // -0.4300    0.0000         0         0         0         0
        // -0.0000   -0.3600         0         0         0         0
        // 0         0         0         0         0         0
        // 0.0000    1.0000    1.0000         0    1.0000         0
        // -1.0000    0.0000    0.0000    1.0000    0.0000    1.0000

        // 1         0         0      0.43
        // 0        -1         0         0
        // 0         0        -1    -0.028
        // 0         0         0         1
        const JfwdRes = [
            [0, 380, 380, 0, 0, 0],
            [-430, 0, 0, 0, 0, 0],
            [0, -360, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 1, 0],
            [-1, 0, 0, 1, 0, 1]
        ]

        Jfwd.el
            .flatMap(e => e)
            .forEach((e, i) => {
                expect(e).toBeCloseTo(JfwdRes.flat()[i])
            })
    })
    //no workie
    test("ForwardJacobian - 6 R IRB 140 - modified dh params - alternative", () => {
        const sixRlink1: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, 0, 352, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink2: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(70, Math.PI / 2, 0, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink3: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(360, 0, 0, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink4: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, Math.PI / 2, 380, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        const sixRlink5: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, -Math.PI / 2, 0, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )
        //65 missing for d?
        const sixRlink6: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
            NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            new NMATH.DhParams(0, Math.PI / 2, 0, 0, 0, 0),
            new NMATH.Body(),
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD,
            "red"
        )

        const joints = [Math.PI / 2, 0, -Math.PI / 2, 0, 0, 0]

        const sixRlinks: NMATH.KinematicsLink[] = [
            sixRlink1,
            sixRlink2,
            sixRlink3,
            sixRlink4,
            sixRlink5,
            sixRlink6
        ]

        // console.log("sixRlinks", sixRlinks)

        const { Jfwd: Jfwd, T_L_0: T_L_0 } = computeForwardJacobianAlternative(sixRlinks, 6)

        console.log("Jfwd", Jfwd)
        console.log("T_L_0", T_L_0)

        //from peter corke
        // 0.0000    0.3800    0.3800         0         0         0
        // -0.4300    0.0000         0         0         0         0
        // -0.0000   -0.3600         0         0         0         0
        // 0         0         0         0         0         0
        // 0.0000    1.0000    1.0000         0    1.0000         0
        // -1.0000    0.0000    0.0000    1.0000    0.0000    1.0000

        // 1         0         0      0.43
        // 0        -1         0         0
        // 0         0        -1    -0.028
        // 0         0         0         1
        const JfwdRes = [
            [0, 380, 380, 0, 0, 0],
            [-430, 0, 0, 0, 0, 0],
            [0, -360, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 1, 0],
            [-1, 0, 0, 1, 0, 1]
        ]

        Jfwd.el
            .flatMap(e => e)
            .forEach((e, i) => {
                expect(e).toBeCloseTo(JfwdRes.flat()[i])
            })
    })
    test("adeptCobra600 0,0,0,0", () => {
        // console.log("adeptCobra600Classic.links", adeptCobra600Classic.links)

        const res = computeForwardJacobian(adeptCobra600Classic.links, 4)

        // from matlab
        // 0         0         0         0
        // -0.6000   -0.2750         0         0
        // -0.0000   -0.0000    1.0000         0
        // 0         0         0         0
        // 0.0000    0.0000         0         0
        // -1.0000   -1.0000         0    1.0000

        expect(res.Jfwd.el[0][0]).toBeCloseTo(0)
        expect(res.Jfwd.el[0][1]).toBeCloseTo(0)
        expect(res.Jfwd.el[0][2]).toBeCloseTo(0)
        expect(res.Jfwd.el[0][3]).toBeCloseTo(0)
        expect(res.Jfwd.el[1][0]).toBeCloseTo(-0.6)
        expect(res.Jfwd.el[1][1]).toBeCloseTo(-0.275)
        expect(res.Jfwd.el[1][2]).toBeCloseTo(0)
        expect(res.Jfwd.el[1][3]).toBeCloseTo(0)
        expect(res.Jfwd.el[2][0]).toBeCloseTo(0)
        expect(res.Jfwd.el[2][1]).toBeCloseTo(0)
        expect(res.Jfwd.el[2][2]).toBeCloseTo(1)
        expect(res.Jfwd.el[2][3]).toBeCloseTo(0)
        expect(res.Jfwd.el[3][0]).toBeCloseTo(0)
        expect(res.Jfwd.el[3][1]).toBeCloseTo(0)
        expect(res.Jfwd.el[3][2]).toBeCloseTo(0)
        expect(res.Jfwd.el[3][3]).toBeCloseTo(0)
        expect(res.Jfwd.el[4][0]).toBeCloseTo(0)
        expect(res.Jfwd.el[4][1]).toBeCloseTo(0)
        expect(res.Jfwd.el[4][2]).toBeCloseTo(0)
        expect(res.Jfwd.el[4][3]).toBeCloseTo(0)
        expect(res.Jfwd.el[5][0]).toBeCloseTo(-1)
        expect(res.Jfwd.el[5][1]).toBeCloseTo(-1)
        expect(res.Jfwd.el[5][2]).toBeCloseTo(0)
        expect(res.Jfwd.el[5][3]).toBeCloseTo(1)

        console.log("res.Jwf.el", res.Jfwd.el)
    })
})
