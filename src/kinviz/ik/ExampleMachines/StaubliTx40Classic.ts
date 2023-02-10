/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as NMATH from "../NMATH"
import niceColors from "nice-color-palettes"

/*limits
-173, 180
-125, 125
-138, 138
-270, 270
-120, 133.5
-270, 270
*/
const staubliTx40link1Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, -Math.PI / 2, 0, 0, 0, 0, (180 * Math.PI) / 180, (-173 * Math.PI) / 180),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[3][0]
)
const staubliTx40link2Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(
        225,
        0,
        0,
        0,
        0,
        -Math.PI / 2,
        (125 * Math.PI) / 180,
        (-125 * Math.PI) / 180
    ),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[3][1]
)
const staubliTx40link3Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(
        0,
        Math.PI / 2,
        35,
        0,
        0,
        Math.PI / 2,
        (138 * Math.PI) / 180,
        (-138 * Math.PI) / 180
    ),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[3][2]
)
const staubliTx40link4Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(
        0,
        -Math.PI / 2,
        225,
        0,
        0,
        0,
        (270 * Math.PI) / 180,
        (-270 * Math.PI) / 180
    ),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[3][3]
)
const staubliTx40link5Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, Math.PI / 2, 0, 0, 0, 0, (133.5 * Math.PI) / 180, (-120 * Math.PI) / 180),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[3][4]
)
const staubliTx40link6Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, 0, 65, 0, 0, 0, (270 * Math.PI) / 180, (-270 * Math.PI) / 180),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[4][0]
)

const staubliTx40linksClassic: NMATH.KinematicsLink[] = [
    staubliTx40link1Classic,
    staubliTx40link2Classic,
    staubliTx40link3Classic,
    staubliTx40link4Classic,
    staubliTx40link5Classic,
    staubliTx40link6Classic
]
export const staubliTx40Classic = new NMATH.GenericSerial(
    "Staubli TX40 Classic DH",
    staubliTx40linksClassic,
    6,
    0,
    100
)
