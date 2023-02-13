/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as NMATH from "../NMATH"
import niceColors from "nice-color-palettes"
import { color } from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements"
/*limits
-160, 160
-225, 45
-45, 225
-110, 110
-100, 100
-266, 266
*/
const puma560link1Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, Math.PI / 2, 0, 0, 0, 0, (160 * Math.PI) / 180, (-60 * Math.PI) / 180),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[0][0]
)
const puma560link2Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(431.8, 0, 0, 0, 0, 0, (45 * Math.PI) / 180, (-225 * Math.PI) / 180),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[0][1]
)
const puma560link3Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(
        20.3,
        -Math.PI / 2,
        150.05,
        0,
        0,
        0,
        (225 * Math.PI) / 180,
        (-45 * Math.PI) / 180
    ),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[0][2]
)
const puma560link4Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(
        0,
        Math.PI / 2,
        431.8,
        0,
        0,
        0,
        (110 * Math.PI) / 180,
        (-110 * Math.PI) / 180
    ),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[0][3]
)
const puma560link5Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, -Math.PI / 2, 0, 0, 0, 0, (100 * Math.PI) / 180, (-100 * Math.PI) / 180),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[0][4]
)
const puma560link6Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, 0, 0, 0, 0, 0, (266 * Math.PI) / 180, (-266 * Math.PI) / 180),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[1][0]
)

const pum560linksClassic: NMATH.KinematicsLink[] = [
    puma560link1Classic,
    puma560link2Classic,
    puma560link3Classic,
    puma560link4Classic,
    puma560link5Classic,
    puma560link6Classic
]

export const puma560Classic = new NMATH.GenericSerial(
    "Puma 560 Classic DH",
    pum560linksClassic,
    6,
    0,
    100
)
