/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { describe, it, assert, expect, test } from "vitest"
import * as THREE from "three"
import * as NMATH from "../NMATH/index"
import { staubliTx40Classic } from "../GenericSerialConfigs"

describe("ConvertClassicToModifiedDh", () => {
    test("ConvertClassicToModifiedDh - 1", () => {
        const res = NMATH.convertClassicToModifiedDh(staubliTx40Classic.links)

        for (let i = 0; i < staubliTx40Classic.link_num; i++) {
            console.log(
                "a",
                (res[i].params as NMATH.DhParams).a,
                "alpha",
                (res[i].params as NMATH.DhParams).alpha,
                "d",
                (res[i].params as NMATH.DhParams).d
            )
        }

        expect((res[0].params as NMATH.DhParams).a).toBe(0)
        expect((res[0].params as NMATH.DhParams).alpha).toBe(0)
        expect((res[0].params as NMATH.DhParams).d).toBe(0)

        expect((res[1].params as NMATH.DhParams).a).toBe(0)
        expect((res[1].params as NMATH.DhParams).alpha).toBe(-1.5707963267948966)
        expect((res[1].params as NMATH.DhParams).d).toBe(0)

        expect((res[2].params as NMATH.DhParams).a).toBe(225)
        expect((res[2].params as NMATH.DhParams).alpha).toBe(0)
        expect((res[2].params as NMATH.DhParams).d).toBe(35)

        expect((res[3].params as NMATH.DhParams).a).toBe(0)
        expect((res[3].params as NMATH.DhParams).alpha).toBe(1.5707963267948966)
        expect((res[3].params as NMATH.DhParams).d).toBe(225)

        expect((res[4].params as NMATH.DhParams).a).toBe(0)
        expect((res[4].params as NMATH.DhParams).alpha).toBe(-1.5707963267948966)
        expect((res[4].params as NMATH.DhParams).d).toBe(0)

        expect((res[5].params as NMATH.DhParams).a).toBe(0)
        expect((res[5].params as NMATH.DhParams).alpha).toBe(1.5707963267948966)
        expect((res[5].params as NMATH.DhParams).d).toBe(65)

        expect((res[1].params as NMATH.DhParams).thetaInitialOffset).toBe(-1.5707963267948966)

        // a 0 alpha 0 d 0
        // a 0 alpha -1.5707963267948966 d 0
        // a 225 alpha 0 d 35
        // a 0 alpha 1.5707963267948966 d 225
        // a 0 alpha -1.5707963267948966 d 0
        // a 0 alpha 1.5707963267948966 d 65
    })
})
