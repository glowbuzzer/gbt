/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as NMATH from "../NMATH"
import niceColors from "nice-color-palettes"

const twoLinkPlanarLink1Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(50, 0, 0, 0, 0, 0, Math.PI, -Math.PI),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[8][0]
)
const twoLinkPlanarLink2Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(40, 0, 0, 0, 0, 0, Math.PI, -Math.PI),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[8][1]
)

const twoLinksPlanarLinksClassic = [twoLinkPlanarLink1Classic, twoLinkPlanarLink2Classic]
export const twoLinksPlanarClassic = new NMATH.GenericSerial(
    "Two Links Planar Classic",
    twoLinksPlanarLinksClassic,
    2,
    100
)
