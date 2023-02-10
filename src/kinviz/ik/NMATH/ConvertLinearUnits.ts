/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as NMATH from "./index"
import { DhParams } from "./index"

export const convertLinearUnitsPrismatic = (
    item: NMATH.KinematicsLink,
    fromUnits: NMATH.LinearUnits,
    toUnits: NMATH.LinearUnits
) => {
    const factor = NMATH.calculateLinearUnitsConversionFactor(fromUnits, toUnits)

    const paramsAsDh = item.params as DhParams
    paramsAsDh.d *= factor
    paramsAsDh.negativeLimit *= factor
    paramsAsDh.positiveLimit *= factor
    paramsAsDh.dInitialOffset *= factor

    item.linearUnits = toUnits
}
export const convertLinearUnitsRevolute = (
    item: NMATH.KinematicsLink,
    fromUnits: NMATH.LinearUnits,
    toUnits: NMATH.LinearUnits
) => {
    const factor = NMATH.calculateLinearUnitsConversionFactor(fromUnits, toUnits)
    const paramsAsDh = item.params as DhParams
    //revolute
    //revolute joints dont have a d offset
    paramsAsDh.d *= factor
    paramsAsDh.a *= factor
    item.linearUnits = toUnits
}

export const convertLinearUnitsFixed = (
    item: NMATH.KinematicsLink,
    fromUnits: NMATH.LinearUnits,
    toUnits: NMATH.LinearUnits
) => {
    const factor = NMATH.calculateLinearUnitsConversionFactor(fromUnits, toUnits)

    const paramsAsDh = item.params as DhParams
    //fixed
    //fixed joints dont have a d offset or limits
    paramsAsDh.d *= factor
    item.linearUnits = toUnits
}
