/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { describe, it, assert, expect, test } from "vitest"
import * as THREE from "three"
import * as NMATH from "../NMATH/index"

describe("dhParams", () => {
    test("toPose - classic dh", () => {
        const dh = new NMATH.DhParams(5, Math.PI / 2, 5, 0, 0, 0)

        const pose = dh.toPose(false)

        const position = new THREE.Vector3().setFromMatrixPosition(pose)
        const orientationQ = new THREE.Quaternion().setFromRotationMatrix(pose)
        const orientationE = new THREE.Euler().setFromRotationMatrix(pose)
        console.log(position)
        console.log(orientationQ)
        console.log(orientationE)
        expect(position.y).toBeCloseTo(5)
    })
    test("toPose - modified dh", () => {
        const dh = new NMATH.DhParams(5, Math.PI / 2, 5, 0, 99, 0)

        const pose = dh.toPose(true)

        const position = new THREE.Vector3().setFromMatrixPosition(pose)
        const orientationQ = new THREE.Quaternion().setFromRotationMatrix(pose)
        const orientationE = new THREE.Euler().setFromRotationMatrix(pose)
        console.log(position)
        console.log(orientationQ)
        console.log(orientationE)
        expect(position.y).toBeCloseTo(5)
    })
})
