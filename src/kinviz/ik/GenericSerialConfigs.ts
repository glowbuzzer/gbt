/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as NMATH from "./NMATH/index"

const staubliTx40link1Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, 0, 0, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD
)
const staubliTx40link2Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, -Math.PI / 2, 0, 0, 0, -Math.PI / 2),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD
)
const staubliTx40link3Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(225, 0, 35, 0, 0, Math.PI / 2),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD
)
const staubliTx40link4Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, Math.PI / 2, 225, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD
)
const staubliTx40link5Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, -Math.PI / 2, 0, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD
)
const staubliTx40link6Modified: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_MODIFIED_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, Math.PI / 2, 65, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD
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

const staubliTx40link1Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, -Math.PI / 2, 0, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD
)
const staubliTx40link2Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(225, 0, 0, 0, 0, -Math.PI / 2),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD
)
const staubliTx40link3Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, Math.PI / 2, 35, 0, 0, Math.PI / 2),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD
)
const staubliTx40link4Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, -Math.PI / 2, 225, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD
)
const staubliTx40link5Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, Math.PI / 2, 0, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD
)
const staubliTx40link6Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, 0, 65, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_MM,
    NMATH.AngularUnits.UNITS_RAD
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

const adeptCobra600Link1Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0.325, 0, 0.387, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_M,
    NMATH.AngularUnits.UNITS_RAD
)
const adeptCobra600Link2Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0.275, Math.PI, 0, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_M,
    NMATH.AngularUnits.UNITS_RAD
)
const adeptCobra600Link3Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_LENGTH,
    new NMATH.DhParams(0, 0, 0, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_M,
    NMATH.AngularUnits.UNITS_RAD
)

const adeptCobra600Link4Classic: NMATH.KinematicsLink = new NMATH.KinematicsLink().set(
    NMATH.LinkParamRepresentation.LINK_DH,
    NMATH.LinkQuantities.QUANTITY_ANGLE,
    new NMATH.DhParams(0, 0, 0, 0, 0, 0),
    new NMATH.Body(),
    NMATH.LinearUnits.UNITS_M,
    NMATH.AngularUnits.UNITS_RAD
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
