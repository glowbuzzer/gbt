/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as NMATH from "../NMATH"
import niceColors from "nice-color-palettes"

const threeLinkPlanarLink1Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(50, 0, 0, 0, 0, 0, Math.PI, -Math.PI),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[8][0]
)
const threeLinkPlanarLink2Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(40, 0, 0, 0, 0, 0, Math.PI, -Math.PI),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[8][1]
)

const threeLinkPlanarLink3Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(40, 0, 0, 0, 0, 0, Math.PI, -Math.PI),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[8][1]
)

const threeLinksPlanarLinksClassic = [
    threeLinkPlanarLink1Classic,
    threeLinkPlanarLink2Classic,
    threeLinkPlanarLink3Classic
]
export const threeLinksPlanarClassic = new NMATH.GenericSerial(
    "Three Links Planar Classic",
    threeLinksPlanarLinksClassic,
    3,
    100
)
