/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as NMATH from "../NMATH"
import niceColors from "nice-color-palettes"

const abbIrb140link1Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, 0, 352, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[7][0]
)
const abbIrb140link2Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(70, Math.PI / 2, 0, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[7][1]
)
const abbIrb140link3Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(360, 0, 0, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[7][2]
)
const abbIrb140link4Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, Math.PI / 2, 380, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[7][3]
)
const abbIrb140link5Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, -Math.PI / 2, 0, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[7][4]
)
//65 missing for d?
const abbIrb140link6Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, Math.PI / 2, 0, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[8][0]
)

const abbIrb140linksModified: NMATH.KinematicsLink[] = [
    abbIrb140link1Modified,
    abbIrb140link2Modified,
    abbIrb140link3Modified,
    abbIrb140link4Modified,
    abbIrb140link5Modified,
    abbIrb140link6Modified
]

export const abbIrb140Modified = new NMATH.GenericSerial(
    "ABB IRB 140 Modified DH",
    abbIrb140linksModified,
    6,
    0,
    100
)
