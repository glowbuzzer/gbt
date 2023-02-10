/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as NMATH from "../NMATH"
import niceColors from "nice-color-palettes"
import { color } from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements"
/*limits
-173, 180
-125, 125
-138, 138
-270, 270
-120, 133.5
-270, 270
*/
const staubliTx40link1Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, 0, 0, 0, 0, 0, (180 * Math.PI) / 180, (-173 * Math.PI) / 180),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[0][0]
)
const staubliTx40link2Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(
        0,
        -Math.PI / 2,
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
    niceColors[0][1]
)
const staubliTx40link3Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(
        225,
        0,
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
    niceColors[0][2]
)
const staubliTx40link4Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, Math.PI / 2, 225, 0, 0, 0, (270 * Math.PI) / 180, (-270 * Math.PI) / 180),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[0][3]
)
const staubliTx40link5Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(
        0,
        -Math.PI / 2,
        0,
        0,
        0,
        0,
        (133.5 * Math.PI) / 180,
        (-120 * Math.PI) / 180
    ),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[0][4]
)
const staubliTx40link6Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, Math.PI / 2, 65, 0, 0, 0, (270 * Math.PI) / 180, (-270 * Math.PI) / 180),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD,
    niceColors[1][0]
)

const staubliTx40linksModified: NMATH.KinematicsLink[] = [
    staubliTx40link1Modified,
    staubliTx40link2Modified,
    staubliTx40link3Modified,
    staubliTx40link4Modified,
    staubliTx40link5Modified,
    staubliTx40link6Modified
]

export const staubliTx40Modified = new NMATH.GenericSerial(
    "Staubli TX40 Modified DH",
    staubliTx40linksModified,
    6,
    0,
    100
)
