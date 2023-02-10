/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { describe, it, assert, expect, test } from "vitest"
import * as THREE from "three"
import * as NMATH from "../NMATH/index"

test("KinematicsLink constructor 1", () => {
    const link = new NMATH.KinematicsLink()
    expect(link).toBeInstanceOf(NMATH.KinematicsLink)
    console.log(link)
})

test("KinematicsLink constructor 2", () => {
    const link = new NMATH.KinematicsLink(
        new NMATH.DhParams(1, 2, 3, 4, 5, 6, 7, 8),
        new NMATH.Body(),
        NMATH.LinkParamRepresentation.LINK_DH,
        NMATH.LinkQuantities.QUANTITY_ANGLE,
        NMATH.LinearUnits.UNITS_IN,
        NMATH.AngularUnits.UNITS_RAD
    )
    expect(link).toBeInstanceOf(NMATH.KinematicsLink)
    console.log(link)
})

test("KinematicsLink jointSet", () => {
    const link = new NMATH.KinematicsLink()
    link.quantity = NMATH.LinkQuantities.QUANTITY_ANGLE
    link.type = NMATH.LinkParamRepresentation.LINK_DH

    const linkout = link.jointSet(99, false)

    expect((linkout.params as NMATH.DhParams).theta).toBe(99)
})
