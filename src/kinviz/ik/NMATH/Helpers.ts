/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

export enum retval {
    GO_RESULT_OK = 0,
    GO_RESULT_IGNORED = 1,
    GO_RESULT_BAD_ARGS = 2,
    GO_RESULT_RANGE_ERROR = 3,
    GO_RESULT_DOMAIN_ERROR = 4 /* resulting domain out of bounds */,
    GO_RESULT_ERROR = 5 /* action can't be done, a problem */,
    GO_RESULT_IMPL_ERROR = 6 /* function not implemented */,
    GO_RESULT_NORM_ERROR = 7 /* a value is expected to be normalized */,
    GO_RESULT_DIV_ERROR = 8 /* divide by zero */,
    GO_RESULT_SINGULAR = 10 /* a matrix is singular */,
    GO_RESULT_NO_SPACE = 11 /* no space for append operation */,
    GO_RESULT_EMPTY = 12 /* data structure is empty */,
    GO_RESULT_BUG = 13 /* a bug in Go, e.g., unknown case */
}

import * as THREE from "three"

export const REAL_EPSILON = 1e-6

/* How close translational quantities must be to be equal. */
export function TRAN_CLOSE(x, y) {
    return Math.abs(x - y) < REAL_EPSILON
}
/*! How small a translational quantity must be to be zero. */
// #define TRAN_SMALL(x) (fabs(x) < GO_REAL_EPSILON)
export function TRAN_SMALL(x) {
    return Math.abs(x) < REAL_EPSILON
}
/*! How close rotational quantities must be to be equal. */
// #define ROT_CLOSE(x,y) (fabs((x)-(y)) < GO_REAL_EPSILON)
export function ROT_CLOSE(x, y) {
    return Math.abs(x - y) < REAL_EPSILON
}

/*! How small a rotational quantity must be to be zero. */
// #define ROT_SMALL(x) (fabs(x) < GO_REAL_EPSILON)
export function ROT_SMALL(x) {
    return Math.abs(x) < REAL_EPSILON
}
/*! How close general quantities must be to be equal. Use this when
  you have something other than translational or rotational quantities,
  otherwise use one of \a GO_TRAN,ROT_CLOSE. */
// #define CLOSE(x,y) (fabs((x)-(y)) < GO_REAL_EPSILON)
export function CLOSE(x, y) {
    return Math.abs(x - y) < REAL_EPSILON
}
/*! How small a general quantity must be to be zero. Use this when
  you have something other than a translational or rotational quantity,
  otherwise use one of \a GO_TRAN,ROT_SMALL. */
// #define SMALL(x) (fabs(x) < GO_REAL_EPSILON)
export function SMALL(x) {
    return Math.abs(x) < REAL_EPSILON
}
