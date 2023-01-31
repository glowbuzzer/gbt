/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { describe, it, assert, expect, test } from "vitest"
import * as THREE from "three"
import * as NMATH from "../NMATH/index"

test("KinematicsLink constructor", () => {
    const link = new NMATH.KinematicsLink()
    expect(link).toBeInstanceOf(NMATH.KinematicsLink)
    console.log(link)
})

test("KinematicsLink jointSet", () => {
    const link = new NMATH.KinematicsLink()
    link.quantity = NMATH.LinkQuantities.QUANTITY_ANGLE
    link.type = NMATH.LinkParamRepresentation.LINK_DH

    const linkout = link.jointSet(99)

    expect((linkout.params as NMATH.DhParams).theta).toBe(99)
})
