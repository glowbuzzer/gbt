/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

// Lower Upper Back Substitution
export default function Lubksb(lu, update, b) {
    // solves the set of n linear equations A*x = b.
    // lu is the object containing A, idx and d as determined by the routine ludcmp.
    var A = lu.A
    var idx = lu.idx
    var n = idx.length

    // console.log(A, idx, n, b)

    if (!update) {
        // make a copy of b
        var bcpy = new Array(n)
        for (let i = 0; i < b.length; i += 1) bcpy[i] = b[i]
        b = bcpy
    }

    for (let ii = -1, i = 0; i < n; i++) {
        var ix = idx[i]
        let sum = b[ix]
        b[ix] = b[i]
        if (ii > -1) for (var j = ii; j < i; j++) sum -= A[i][j] * b[j]
        else if (sum) ii = i
        b[i] = sum
    }
    for (var i = n - 1; i >= 0; i--) {
        let sum = b[i]
        for (let j = i + 1; j < n; j++) sum -= A[i][j] * b[j]
        b[i] = sum / A[i][i]
    }
    // console.log("b", b)
    return b // solution vector x
}
