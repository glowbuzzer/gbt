/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { describe, it, assert, expect, test } from "vitest"
import * as THREE from "three"
import * as NMATH from "../NMATH/index"

describe("Body", () => {
    test("Body constructor no params", () => {
        const body = new NMATH.Body()
        expect(body).toBeInstanceOf(NMATH.Body)
    })

    test("Body constructor with params", () => {
        const body = new NMATH.Body(1, [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [10, 11, 12]
        ])

        expect(body.mass).toBe(1)
        expect(body.inertia).toEqual([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [10, 11, 12]
        ])
    })
})
