/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as NMATH from "./index"
import { DhParams } from "./index"

function calculateLinearUnitsConversionFactor(
    fromUnits: NMATH.LinearUnits,
    toUnits: NMATH.LinearUnits
): number {
    if (fromUnits == toUnits) {
        return 1
    }
    if (fromUnits == NMATH.LinearUnits.UNITS_MM && toUnits == NMATH.LinearUnits.UNITS_M) {
        return 0.001
    }
    if (fromUnits == NMATH.LinearUnits.UNITS_MM && toUnits == NMATH.LinearUnits.UNITS_IN) {
        return 0.0393701
    }
    if (fromUnits == NMATH.LinearUnits.UNITS_MM && toUnits == NMATH.LinearUnits.UNITS_CM) {
        return 0.1
    }
    if (fromUnits == NMATH.LinearUnits.UNITS_M && toUnits == NMATH.LinearUnits.UNITS_MM) {
        return 1000
    }
    if (fromUnits == NMATH.LinearUnits.UNITS_M && toUnits == NMATH.LinearUnits.UNITS_CM) {
        return 100
    }
    if (fromUnits == NMATH.LinearUnits.UNITS_M && toUnits == NMATH.LinearUnits.UNITS_IN) {
        return 39.3701
    }
    if (fromUnits == NMATH.LinearUnits.UNITS_IN && toUnits == NMATH.LinearUnits.UNITS_M) {
        return 0.0254
    }
    if (fromUnits == NMATH.LinearUnits.UNITS_IN && toUnits == NMATH.LinearUnits.UNITS_CM) {
        return 2.54
    }
    if (fromUnits == NMATH.LinearUnits.UNITS_IN && toUnits == NMATH.LinearUnits.UNITS_MM) {
        return 25.4
    }
    if (fromUnits == NMATH.LinearUnits.UNITS_CM && toUnits == NMATH.LinearUnits.UNITS_M) {
        return 0.01
    }
    if (fromUnits == NMATH.LinearUnits.UNITS_CM && toUnits == NMATH.LinearUnits.UNITS_IN) {
        return 0.393701
    }
    if (fromUnits == NMATH.LinearUnits.UNITS_CM && toUnits == NMATH.LinearUnits.UNITS_MM) {
        return 10
    }
}

export const convertLinearUnitsPrismatic = (
    item: NMATH.KinematicsLink,
    fromUnits: NMATH.LinearUnits,
    toUnits: NMATH.LinearUnits
) => {
    const factor = calculateLinearUnitsConversionFactor(fromUnits, toUnits)

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
    const factor = calculateLinearUnitsConversionFactor(fromUnits, toUnits)
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
    const factor = calculateLinearUnitsConversionFactor(fromUnits, toUnits)

    const paramsAsDh = item.params as DhParams
    //fixed
    //fixed joints dont have a d offset or limits
    paramsAsDh.d *= factor
    item.linearUnits = toUnits
}
