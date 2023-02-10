/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as NMATH from "../NMATH"
import niceColors from "nice-color-palettes"

const adeptCobra600Link1Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0.325, 0, 0.387, 0, 0, 0, Math.PI, -Math.PI),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_M,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[8][0]
)
const adeptCobra600Link2Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0.275, Math.PI, 0, 0, 0, 0, Math.PI, -Math.PI),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_M,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[8][1]
)
const adeptCobra600Link3Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_LENGTH,
    new NMATH.DhParams(0, 0, 0, 0, 0, 0, 0.1, -0.1),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_M,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[8][2]
)

const adeptCobra600Link4Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, 0, 0, 0, 0, 0, Math.PI, -Math.PI),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_M,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[8][3]
)

const adeptCobra600LinksClassic = [
    adeptCobra600Link1Classic,
    adeptCobra600Link2Classic,
    adeptCobra600Link3Classic,
    adeptCobra600Link4Classic
]
export const adeptCobra600Classic = new NMATH.GenericSerial(
    "Adept Cobra 600 Classic DH",
    adeptCobra600LinksClassic,
    4,
    100
)
