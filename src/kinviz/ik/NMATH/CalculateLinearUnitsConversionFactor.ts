/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as NMATH from "./index"

export default function calculateLinearUnitsConversionFactor(
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
