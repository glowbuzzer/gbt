/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"

import { Lubksb, Ludcmp } from "./index"

export default class MatrixN {
    rows: number
    cols: number
    el: number[][]

    constructor(rows, cols, el: number[][] = []) {
        this.rows = rows
        this.cols = cols
        this.el = el
        if (this.el.length == 0) {
            for (let i = 0; i < this.rows; i++) {
                this.el[i] = []
                for (let j = 0; j < this.cols; j++) {
                    this.el[i][j] = 0
                }
            }
        }
    }

    identity() {
        for (let i = 0; i < this.rows; i++) {
            this.el[i] = []
            for (let j = 0; j < this.cols; j++) {
                if (i == j) {
                    this.el[i][j] = 1
                } else {
                    this.el[i][j] = 0
                }
            }
        }
        return this
    }

    zero() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.el[i][j] = 0
            }
        }
        return this
    }
    multiplyMatrices(m1: MatrixN, m2: MatrixN) {
        if (m1.cols != m2.rows) {
            throw new Error("MatrixN.multiplyMatrices() - m1.cols != m2.rows")
        }

        //this must have the same number of rows as m1 and the same number of columns as m2
        if (this.rows != m1.rows || this.cols != m2.cols) {
            throw new Error(
                "MatrixN.multiplyMatrices() - this.rows != m1.rows || this.cols != m2.cols"
            )
        }
        const m1e = m1.el
        const m2e = m2.el
        this.zero()
        // const te = this.el
        for (let i = 0; i < m1.rows; i++) {
            for (let j = 0; j < m2.cols; j++) {
                for (let k = 0; k < m1.cols; k++) {
                    this.el[i][j] += m1e[i][k] * m2e[k][j]
                }
            }
        }
        return this
    }

    multiply(m: MatrixN) {
        //if number of columns of the first matrix is not equal to the number of rows of the second matrix, error

        if (this.cols != m.rows) {
            throw new Error("MatrixN.multiply() - this.cols != m.rows")
        }
        //the product of an m x n matrix and an n x p matrix is an m x p matrix
        //so this.cols must be equal to m.cols
        if (this.cols != m.cols) {
            throw new Error("MatrixN.multiply() - this.cols != m.cols")
        }

        const thisClone = this.clone()
        this.zero()
        return this.multiplyMatrices(thisClone, m)
    }

    preMultiply(m: MatrixN) {
        return this.multiplyMatrices(m, this)
    }

    multiplyScalar(s: number) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.el[i][j] *= s
            }
        }
        return this
    }

    fill(n: number) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.el[i][j] = n
            }
        }
        return this
    }

    transpose() {
        // // if (this.rows != this.cols) {
        // //     throw new Error("MatrixN.transpose() - rows != cols")
        // // }
        const thisClone = this.clone()

        const te = this.el

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                te[j][i] = thisClone.el[i][j]
            }
        }
        return this
    }

    transposeMatrix(m: MatrixN) {
        const me = m.el
        const te = this.el
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                te[j][i] = me[i][j]
            }
        }
        return this
    }

    toArray(array: number[] = [], offset: number = 0) {
        const te = this.el
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                array[offset + i * this.cols + j] = te[i][j]
            }
        }
        return array
    }

    fromArray(array: number[], offset: number = 0) {
        const te = this.el
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                te[i][j] = array[offset + i * this.cols + j]
            }
        }
        return this
    }

    equals(m: MatrixN) {
        const te = this.el
        const me = m.el
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (te[i][j] !== me[i][j]) return false
            }
        }
        return true
    }

    determinant() {
        const te = this.el
        let n = this.rows
        var a = 0
        var b = 0
        var c = 0
        var d = 0
        var det = 0
        if (this.rows != this.cols) {
            throw new Error("MatrixN.determinant() - rows != cols")
        }
        switch (n) {
            case 0: {
                return 0
            }
            case 1: {
                return te[0][0]
            }
            case 2: {
                return te[0][0] * te[1][1] - te[0][1] * te[1][0]
            }
            case 3: {
                a = te[0][0]
                b = te[0][1]
                c = te[0][2]
                d = te[1][0]
                let e = te[1][1]
                let f = te[1][2]
                let g = te[2][0]
                let h = te[2][1]
                let i = te[2][2]
                det = a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g
                return det
            }
            default: {
                // const determinantCalc = m =>
                //     m[0].reduce(
                //         (r, e, i) =>
                //             r +
                //             (-1) ** (i + 2) *
                //                 e *
                //                 determinantCalc(m.slice(1).map(c => c.filter((_, j) => i != j))),
                //         0
                //     )
                const A = te
                let N = A.length,
                    B = [],
                    denom = 1,
                    exchanges = 0
                for (let i = 0; i < N; ++i) {
                    B[i] = []
                    for (let j = 0; j < N; ++j) B[i][j] = A[i][j]
                }
                for (let i = 0; i < N - 1; ++i) {
                    let maxN = i,
                        maxValue = Math.abs(B[i][i])
                    for (let j = i + 1; j < N; ++j) {
                        let value = Math.abs(B[j][i])
                        if (value > maxValue) {
                            maxN = j
                            maxValue = value
                        }
                    }
                    if (maxN > i) {
                        let temp = B[i]
                        B[i] = B[maxN]
                        B[maxN] = temp
                        ++exchanges
                    } else if (maxValue === 0) return maxValue

                    let value1 = B[i][i]
                    for (let j = i + 1; j < N; ++j) {
                        let value2 = B[j][i]
                        B[j][i] = 0
                        for (var k = i + 1; k < N; ++k)
                            B[j][k] = (B[j][k] * value1 - B[i][k] * value2) / denom
                    }
                    denom = value1
                }
                if (exchanges % 2) return -B[N - 1][N - 1]
                return B[N - 1][N - 1]
            }
        }
    }

    isZero() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.el[i][j] != 0) {
                    return false
                }
            }
        }
        return true
    }

    isIdentity() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (i == j) {
                    if (this.el[i][j] != 1) {
                        return false
                    }
                } else {
                    if (this.el[i][j] != 0) {
                        return false
                    }
                }
            }
        }
        return true
    }

    hasNaN() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (isNaN(this.el[i][j])) {
                    return true
                }
            }
        }
        return false
    }

    isVector() {
        return this.rows == 1 || this.cols == 1
    }

    addMatrices(m1: MatrixN, m2: MatrixN) {
        if (m1.rows != m2.rows || m1.cols != m2.cols) {
            throw new Error("MatrixN.addMatrices() - rows != cols")
        }
        if (m2.rows != this.rows || m2.cols != this.cols) {
            throw new Error("MatrixN.addMatrices() - rows != cols")
        }

        const ae = m1.el
        const be = m2.el
        const te = this.el
        for (let i = 0; i < m1.rows; i++) {
            for (let j = 0; j < m1.cols; j++) {
                te[i][j] = ae[i][j] + be[i][j]
            }
        }
        return this
    }

    add(m: MatrixN) {
        const thisClone = this.clone()
        return this.addMatrices(thisClone, m)
    }

    /*
  The matrix-vector cross product is a matrix of the same dimension,
  whose columns are the column-wise cross products of the matrix
  and the vector. The matrices must be 3xN, the vector 3x1.
*/
    crossVector(v: THREE.Vector3) {
        const axv = new MatrixN(3, this.cols)

        if (this.rows != 3) {
            throw new Error("MatrixN.crossVector() - rows != 3")
        }

        for (let col = 0; col < this.cols; col++) {
            const ac = new THREE.Vector3(this.el[0][col], this.el[1][col], this.el[2][col])
            const vout = new THREE.Vector3().crossVectors(ac, v)
            // console.log(ac, v, vout)
            // const vout = new THREE.Vector3(
            //     ac.y * v.z - ac.z * v.y,
            //     ac.z * v.x - ac.x * v.z,
            //     ac.x * v.y - ac.y * v.x
            // )

            axv.el[0][col] = vout.x
            axv.el[1][col] = vout.y
            axv.el[2][col] = vout.z
        }
        // console.log(axv)

        return this.copy(axv)
    }

    // multiplyVector(v: number[][]) {
    //     return this.multiplyMatrixVector(this, v)
    // }
    multiplyMatrixVector(v: number[][]): number[][] {
        const dimensions = [v.length, v[0].length]
        // console.log(dimensions)
        if (dimensions[0] == 1) {
            //row vector
            const m1 = new MatrixN(1, v[0].length, v)
            const m2 = new MatrixN(1, this.cols).multiplyMatrices(m1, this)
            return m2.el
        } else if (dimensions[1] == 1) {
            //column vector
            const m1 = new MatrixN(v.length, 1, v)
            const m2 = new MatrixN(this.rows, 1).multiplyMatrices(this, m1)
            return m2.el
        } else {
            throw new Error(
                "MatrixN.multiplyMatrixVector() - vector must be a row or column vector"
            )
        }
    }
    setFromMatrix3(m: THREE.Matrix3) {
        if (this.rows != 3 || this.cols != 3) {
            throw new Error("MatrixN.setFromMatrix3() - rows != 3 || cols != 3")
        }

        this.el[0][0] = m.elements[0]
        this.el[0][1] = m.elements[3]
        this.el[0][2] = m.elements[6]

        this.el[1][0] = m.elements[1]
        this.el[1][1] = m.elements[4]
        this.el[1][2] = m.elements[7]

        this.el[2][0] = m.elements[2]
        this.el[2][1] = m.elements[5]
        this.el[2][2] = m.elements[8]

        return this
    }

    setFromMatrix4(m: THREE.Matrix4) {
        if (this.rows != 4 || this.cols != 4) {
            throw new Error("MatrixN.setFromMatrix4() - rows != 4 || cols != 4")
        }

        this.el[0][0] = m.elements[0]
        this.el[0][1] = m.elements[4]
        this.el[0][2] = m.elements[8]
        this.el[0][3] = m.elements[12]

        this.el[1][0] = m.elements[1]
        this.el[1][1] = m.elements[5]
        this.el[1][2] = m.elements[9]
        this.el[1][3] = m.elements[13]

        this.el[2][0] = m.elements[2]
        this.el[2][1] = m.elements[6]
        this.el[2][2] = m.elements[10]
        this.el[2][3] = m.elements[14]

        this.el[3][0] = m.elements[3]
        this.el[3][1] = m.elements[7]
        this.el[3][2] = m.elements[11]
        this.el[3][3] = m.elements[15]

        return this
    }

    setFromQuaternion(q: THREE.Quaternion) {
        if (this.rows != 3 || this.cols != 3) {
            throw new Error("MatrixN.setFromQuaternion() - rows != 3 || cols != 3")
        }
        const x = q.x,
            y = q.y,
            z = q.z,
            w = q.w
        const x2 = x + x,
            y2 = y + y,
            z2 = z + z
        const xx = x * x2,
            xy = x * y2,
            xz = x * z2
        const yy = y * y2,
            yz = y * z2,
            zz = z * z2
        const wx = w * x2,
            wy = w * y2,
            wz = w * z2

        this.el[0][0] = 1 - (yy + zz)
        this.el[0][1] = xy - wz
        this.el[0][2] = xz + wy

        this.el[1][0] = xy + wz
        this.el[1][1] = 1 - (xx + zz)
        this.el[1][2] = yz - wx

        this.el[2][0] = xz - wy
        this.el[2][1] = yz + wx
        this.el[2][2] = 1 - (xx + yy)

        return this
    }
    copy(m: MatrixN) {
        if (this.rows != m.rows || this.cols != m.cols) {
            throw new Error("MatrixN.copy() - Matrices must be the same size")
        }
        const te = this.el
        const me = m.el
        for (let i = 0; i < this.rows; i++) {
            te[i] = []
            for (let j = 0; j < this.cols; j++) {
                te[i][j] = me[i][j]
            }
        }
        return this
    }

    clone() {
        const m = new MatrixN(this.rows, this.cols)
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                m.el[i][j] = this.el[i][j]
            }
        }
        return m
    }
    invert() {
        return this.invertMatrix(this)
    }

    invertMatrix(m: MatrixN) {
        const mCopy = m.clone()

        // const v: MatrixN = new MatrixN(mCopy.cols, mCopy.rows)
        const N: number = this.rows

        var d

        // try {
        d = Ludcmp(mCopy.el, false)
        // } catch (e) {
        //     console.log("e", e)
        // }

        var vec = []

        for (let col: number = 0; col < N; col++) {
            for (let row: number = 0; row < N; row++) {
                vec[row] = 0.0
            }
            vec[col] = 1.0

            const b = Lubksb(d, false, vec)

            // console.log("retval", retval)

            for (let row = 0; row < N; row++) {
                this.el[row][col] = b[row]
            }
        }
        return this
    }
}
