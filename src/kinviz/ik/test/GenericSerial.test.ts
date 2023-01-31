/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { describe, it, assert, expect, test } from "vitest"
import * as THREE from "three"
import * as NMATH from "../NMATH/index"

const testLink1: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, 0, 0, 0, 0, 0, true),
    new NMATH.Body(),
    0
)
const testLink2: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(1, -Math.PI / 2, 2, 3, 4, -Math.PI / 2, true),
    new NMATH.Body(),
    0
)

const testLinks: NMATH.KinematicsLink[] = [testLink1, testLink2]

test("Generic Serial constructor no params", () => {
    const robot = new NMATH.GenericSerial()
    expect(robot).toBeInstanceOf(NMATH.GenericSerial)
    console.log(robot)
})

test("Generic Serial constructor with params", () => {
    const robot = new NMATH.GenericSerial("Test Robot", testLinks, 2, 0, 100)
    expect(robot).toBeInstanceOf(NMATH.GenericSerial)

    console.log(robot.links)
})
