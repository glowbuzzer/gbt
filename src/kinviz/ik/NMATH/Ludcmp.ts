/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

// An indicator of the number of row interchanges: even or odd. If the number of row interchanges is even, then the determinant is positive; if the number of row interchanges is odd, then the determinant is negative.
// Lower Upper Decomposition

export default function Ludcmp(A, update): { A: number[]; idx: number[]; d: number } {
    // A is a matrix that we want to decompose into Lower and Upper matrices.

    var d = 0
    const n = A.length
    const idx = new Array(n) // Output vector with row permutations from partial pivoting
    const vv = new Array(n) // Scaling information

    for (let i = 0; i < n; i++) {
        let max = 0
        for (let j = 0; j < n; j++) {
            const temp = Math.abs(A[i][j])
            if (temp > max) max = temp
        }
        if (max == 0) {
            throw new Error("Ludcmp: Singular Matrix")
            // return { A: null, idx: null, d: false }
        } // Singular Matrix!}

        vv[i] = 1 / max // Scaling
    }

    if (!update) {
        // make a copy of A
        const Acpy = new Array(n)
        for (let i = 0; i < n; i++) {
            var Ai = A[i]
            const Acpyi = new Array(Ai.length)
            for (let j = 0; j < Ai.length; j += 1) Acpyi[j] = Ai[j]
            Acpy[i] = Acpyi
        }
        A = Acpy
    }

    var tiny = 1e-20 // in case pivot element is zero
    for (let i = 0; ; i++) {
        for (let j = 0; j < i; j++) {
            let sum = A[j][i]
            for (let k = 0; k < j; k++) sum -= A[j][k] * A[k][i]
            A[j][i] = sum
        }
        let jmax = 0
        let max = 0
        for (let j = i; j < n; j++) {
            let sum = A[j][i]
            for (var k = 0; k < i; k++) sum -= A[j][k] * A[k][i]
            A[j][i] = sum
            let temp = vv[j] * Math.abs(sum)
            if (temp >= max) {
                max = temp
                jmax = j
            }
        }
        if (i <= jmax) {
            for (let j = 0; j < n; j++) {
                let temp = A[jmax][j]
                A[jmax][j] = A[i][j]
                A[i][j] = temp
            }
            d = -d
            vv[jmax] = vv[i]
        }
        idx[i] = jmax
        if (i == n - 1) break
        var temp = A[i][i] //
        if (temp == 0) A[i][i] = temp = tiny
        temp = 1 / temp
        for (var j = i + 1; j < n; j++) A[j][i] *= temp
    }
    return { A: A, idx: idx, d: d }
}
