/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { describe, it, assert, expect, test } from "vitest"
import * as THREE from "three"
import * as NMATH from "../NMATH/index"

describe("dhParams", () => {
    test("toPose - classic dh", () => {
        const dh = new NMATH.DhParams(5, Math.PI / 2, 5, 0, 0, 0)

        const pose = dh.toPose(false, NMATH.AngularUnits.UNITS_RAD)

        const position = new THREE.Vector3().setFromMatrixPosition(pose)
        const orientationQ = new THREE.Quaternion().setFromRotationMatrix(pose)
        const orientationE = new THREE.Euler().setFromRotationMatrix(pose)
        console.log(position)
        console.log(orientationQ)
        console.log(orientationE)

        expect(position.x).toBeCloseTo(5)
        expect(position.y).toBeCloseTo(0)
        expect(position.z).toBeCloseTo(5)

        expect(orientationQ.x).toBeCloseTo(0.7071067811865475)
        expect(orientationQ.y).toBeCloseTo(0)
        expect(orientationQ.z).toBeCloseTo(0)
        expect(orientationQ.w).toBeCloseTo(0.7071067811865475)
    })
    test("toPose - modified dh", () => {
        const dh = new NMATH.DhParams(5, Math.PI / 2, 5, 0, 0, 0)

        const pose = dh.toPose(true, NMATH.AngularUnits.UNITS_RAD)

        const position = new THREE.Vector3().setFromMatrixPosition(pose)
        const orientationQ = new THREE.Quaternion().setFromRotationMatrix(pose)
        const orientationE = new THREE.Euler().setFromRotationMatrix(pose)
        console.log(position)
        console.log(orientationQ)
        console.log(orientationE)

        expect(position.x).toBeCloseTo(5)
        expect(position.y).toBeCloseTo(-5)
        expect(position.z).toBeCloseTo(0)

        expect(orientationQ.x).toBeCloseTo(0.7071067811865475)
        expect(orientationQ.y).toBeCloseTo(0)
        expect(orientationQ.z).toBeCloseTo(0)
        expect(orientationQ.w).toBeCloseTo(0.7071067811865475)
    })
})
