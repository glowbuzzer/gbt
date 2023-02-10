/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { describe, it, assert, expect, test } from "vitest"
import * as THREE from "three"
import * as NMATH from "../NMATH/index"
import { staubliTx40Classic } from "../ExampleMachines/StaubliTx40Classic"

describe("CheckForMixedLinkTypes", () => {
    test("CheckForMixedLinkTypes - 1", () => {
        const res = NMATH.checkForMixedLinkTypes(staubliTx40Classic.links)

        expect(res).toBe(false)
    })
})
