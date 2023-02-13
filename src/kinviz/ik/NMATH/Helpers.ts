/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

export const REAL_EPSILON = 1e-6

/* How close translational quantities must be to be equal. */
export function TRAN_CLOSE(x, y) {
    return Math.abs(x - y) < REAL_EPSILON
}
/*! How small a translational quantity must be to be zero. */
export function TRAN_SMALL(x) {
    return Math.abs(x) < REAL_EPSILON
}
/*! How close rotational quantities must be to be equal. */
export function ROT_CLOSE(x, y) {
    return Math.abs(x - y) < REAL_EPSILON
}

/*! How small a rotational quantity must be to be zero. */
export function ROT_SMALL(x) {
    return Math.abs(x) < REAL_EPSILON
}
/*! How close general quantities must be to be equal. Use this when
  you have something other than translational or rotational quantities,
  otherwise use one of \a GO_TRAN,ROT_CLOSE. */

export function CLOSE(x, y) {
    return Math.abs(x - y) < REAL_EPSILON
}
/*! How small a general quantity must be to be zero. Use this when
  you have something other than a translational or rotational quantity,
  otherwise use one of \a TRAN,ROT_SMALL. */

export function SMALL(x) {
    return Math.abs(x) < REAL_EPSILON
}
