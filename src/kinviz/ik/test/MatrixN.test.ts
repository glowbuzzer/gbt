/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import { describe, it, assert, expect, test } from "vitest"

import * as THREE from "three"
import { Ludcmp, MatrixN } from "../NMATH"
// Edit an assertion and save to see HMR in action

describe("MatrixN", () => {
    test("copy", () => {
        const m1 = new MatrixN(3, 3, [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ])
        const m2 = new MatrixN(3, 3, [
            [9, 8, 7],
            [6, 5, 4],
            [3, 2, 1]
        ])

        expect(m1.copy(m2)).toEqual(m2)
    })
    test("copy wrong size", () => {
        const m1 = new MatrixN(3, 3, [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ])
        const m2 = new MatrixN(2, 2, [
            [9, 8],
            [6, 5]
        ])
        expect(() => m1.copy(m2)).toThrow(
            new Error("MatrixN.copy() - Matrices must be the same size")
        )
    })

    test("identity matrix", () => {
        const m1 = new MatrixN(3, 3, [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ])
        const m2 = new MatrixN(3, 3).identity()

        expect(m1.equals(m2)).toEqual(true)
    })

    test("zero matrix", () => {
        const m1 = new MatrixN(3, 3, [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ])
        const m2 = new MatrixN(3, 3, [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]).zero()

        expect(m1.equals(m2)).toEqual(true)
    })

    describe("determinant", () => {
        test("determinant 1x1", () => {
            const m1 = new MatrixN(1, 1, [[1]])
            expect(m1.determinant()).toEqual(1)
        })

        test("determinant 2x2", () => {
            const m1 = new MatrixN(2, 2, [
                [1, 2],
                [3, 4]
            ])
            expect(m1.determinant()).toEqual(-2)
        })

        test("determinant 3x3-1", () => {
            const m1 = new MatrixN(3, 3, [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ])
            expect(m1.determinant()).toEqual(0)
        })
        test("determinant 3x3-2", () => {
            const m1 = new MatrixN(3, 3, [
                [42, 97, 23],
                [51, 30, 77],
                [33, 7, 66]
            ])
            expect(m1.determinant()).toEqual(-34062)
        })
        test("determinant 4x4", () => {
            const m1 = new MatrixN(4, 4, [
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12],
                [13, 14, 15, 16]
            ])
            expect(m1.determinant()).toEqual(0)
        })
        test("det 5x5", () => {
            const m1 = new MatrixN(5, 5, [
                [1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10],
                [11, 12, 13, 14, 15],
                [16, 17, 18, 19, 20],
                [21, 22, 23, 24, 25]
            ])
            expect(m1.determinant()).toEqual(0)
        })
        test("det 6x6", () => {
            const m1 = new MatrixN(6, 6, [
                [0, -0.5963, -0.291, 0, 0, 0],
                [0.5963, 0, 0, 0, 0, 0],
                [0.15, 0.0144, 0.3197, 0, 0, 0],
                [-1, 0, 0, 0.7071, 0, 0],
                [0, -1, -1, 0, -1, 0],
                [0, 0, 0, 0.7071, 0, 1.0]
            ])
            expect(m1.determinant()).toBeCloseTo(-0.0786)
        })
    })
    describe("add", () => {
        test("addMatrices", () => {
            const a: MatrixN = new MatrixN(3, 3, [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ])
            const b: MatrixN = new MatrixN(3, 3, [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ])
            const c: MatrixN = new MatrixN(3, 3, [
                [2, 4, 6],
                [8, 10, 12],
                [14, 16, 18]
            ])
            const d: MatrixN = new MatrixN(3, 3)

            expect(d.addMatrices(a, b)).toEqual(c)
        })
        test("add 3x3 and 2x2", () => {
            const a: MatrixN = new MatrixN(3, 3, [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ])
            const b: MatrixN = new MatrixN(3, 3, [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ])
            const c: MatrixN = new MatrixN(3, 3, [
                [2, 4, 6],
                [8, 10, 12],
                [14, 16, 18]
            ])

            expect(a.add(b)).toEqual(c)
        })
    })

    describe("transposeMatrix", () => {
        test("transposeMatrix 3x3", () => {
            const a: MatrixN = new MatrixN(3, 3, [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ])
            const b: MatrixN = new MatrixN(3, 3, [
                [1, 4, 7],
                [2, 5, 8],
                [3, 6, 9]
            ])
            const c: MatrixN = new MatrixN(3, 3)
            expect(c.transposeMatrix(a)).toEqual(b)
        })

        test("transposeMatrix 4x2", () => {
            const a: MatrixN = new MatrixN(4, 2, [
                [5, 4],
                [4, 0],
                [7, 10],
                [-1, 8]
            ])

            const b: MatrixN = new MatrixN(2, 4, [
                [5, 4, 7, -1],
                [4, 0, 10, 8]
            ])

            const c: MatrixN = new MatrixN(2, 4)
            expect(c.transposeMatrix(a)).toEqual(b)
        })

        test("transposeMatrix 6x4", () => {
            const a: MatrixN = new MatrixN(6, 4, [
                [0, 0, 0, 0],
                [-0.6, -0.275, 0, 0],
                [-0.0, -0.0, 1.0, 0],
                [0, 0, 0, 0],
                [0.0, 0.0, 0, 0],
                [-1.0, -1.0, 0, 1.0]
            ])

            const b: MatrixN = new MatrixN(4, 6, [
                [0, -0.6, -0.0, 0, 0.0, -1.0],
                [0, -0.275, -0.0, 0, 0.0, -1.0],
                [0, 0, 1.0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1.0]
            ])
            const c: MatrixN = new MatrixN(4, 6)
            expect(c.transposeMatrix(a)).toEqual(b)
        })
    })

    describe("transpose", () => {
        test("transpose single row", () => {
            const m1 = new MatrixN(1, 3, [[1, 2, 3]])

            const m2 = new MatrixN(3, 1, [[1], [2], [3]])

            expect(() => {
                m1.transpose()
            }).toThrow(new Error("MatrixN.transpose() - rows != cols"))
        })

        test("transposeMatrix single row", () => {
            const m1 = new MatrixN(1, 3, [[1, 2, 3]])
            const m2 = new MatrixN(3, 1).transposeMatrix(m1)
            const m3 = new MatrixN(3, 1, [[1], [2], [3]])
            expect(m2).toEqual(m3)
        })

        test("transpose single column", () => {
            const m1 = new MatrixN(3, 1, [[1], [2], [3]])
            const m2 = new MatrixN(1, 3).transposeMatrix(m1)
            const m3 = new MatrixN(1, 3, [[1, 2, 3]])
            expect(m2).toEqual(m3)
        })

        test("transposes rectangular", () => {
            const m1 = new MatrixN(4, 3, [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
                [1, 2, 3]
            ])

            const m2 = new MatrixN(3, 4).transposeMatrix(m1)

            const m3 = new MatrixN(3, 4, [
                [1, 4, 7, 1],
                [2, 5, 8, 2],
                [3, 6, 9, 3]
            ])
            expect(m2).toEqual(m3)
        })

        test("transposes square", () => {
            const m1 = new MatrixN(3, 3, [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ]).transpose()

            const m2 = new MatrixN(3, 3, [
                [1, 4, 7],
                [2, 5, 8],
                [3, 6, 9]
            ])
            expect(m1).toEqual(m2)
        })
    })

    describe("multiplyMatrices", () => {
        test("multiplyMatrices 1x2 - 2x2", () => {
            const m1 = new MatrixN(1, 2, [[1, 2]])
            const m2 = new MatrixN(2, 2, [
                [3, 1],
                [0, 1]
            ])
            const m3 = new MatrixN(1, 2, [[3, 3]])
            const m4 = new MatrixN(1, 2).multiplyMatrices(m1, m2)
            expect(m4).toEqual(m3)
        })

        test("multiplyMatrices non-square - 1", () => {
            const m1 = new MatrixN(3, 2, [
                [1, 0],
                [0, 2],
                [3, 3]
            ])
            const m2 = new MatrixN(2, 3, [
                [1, 2, 3],
                [4, 5, 6]
            ])

            const m3 = new MatrixN(3, 3, [
                [1, 2, 3],
                [8, 10, 12],
                [15, 21, 27]
            ])

            const m4 = new MatrixN(3, 3).multiplyMatrices(m1, m2)

            expect(m4).toEqual(m3)
        })

        test("multiplyMatrices non-square - 2", () => {
            const m2: MatrixN = new MatrixN(2, 3, [
                [1, 2, 3],
                [4, 5, 6]
            ])

            const m1: MatrixN = new MatrixN(2, 2, [
                [1, 2],
                [3, 4]
            ])

            const m3: MatrixN = new MatrixN(2, 3, [
                [9, 12, 15],
                [19, 26, 33]
            ])
            const m4 = new MatrixN(2, 3).multiplyMatrices(m1, m2)

            expect(m4).toEqual(m3)
        })

        test("multiplyMatrices square", () => {
            const a: MatrixN = new MatrixN(3, 3, [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ])
            const b: MatrixN = new MatrixN(3, 3, [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ])
            const c: MatrixN = new MatrixN(3, 3, [
                [30, 36, 42],
                [66, 81, 96],
                [102, 126, 150]
            ])
            const d: MatrixN = new MatrixN(3, 3)

            expect(d.multiplyMatrices(a, b)).toEqual(c)
        })
        test("multiplyMatrices non-commutativity 1", () => {
            const m1 = new MatrixN(2, 2, [
                [0, 1],
                [0, 0]
            ])
            const m2 = new MatrixN(2, 2, [
                [0, 0],
                [1, 0]
            ])

            const m3 = new MatrixN(2, 2, [
                [1, 0],
                [0, 0]
            ])

            const m4 = new MatrixN(2, 2).multiplyMatrices(m1, m2)

            expect(m4).toEqual(m3)
        })

        test("multiplyMatrices non-commutativity 2", () => {
            const m1 = new MatrixN(2, 2, [
                [0, 0],
                [1, 0]
            ])
            const m2 = new MatrixN(2, 2, [
                [0, 1],
                [0, 0]
            ])

            const m3 = new MatrixN(2, 2, [
                [0, 0],
                [0, 1]
            ])

            const m4 = new MatrixN(2, 2).multiplyMatrices(m1, m2)

            expect(m4).toEqual(m3)
        })

        test("multiply 3x3 by 3x6", () => {
            const b: MatrixN = new MatrixN(3, 3, [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ])

            const a: MatrixN = new MatrixN(3, 6, [
                [1, 2, 3, 4, 5, 6],
                [7, 8, 9, 10, 11, 12],
                [13, 14, 15, 16, 17, 18]
            ])

            const c: MatrixN = new MatrixN(3, 6)

            const d: MatrixN = new MatrixN(3, 6, [
                [54, 60, 66, 72, 78, 84],
                [117, 132, 147, 162, 177, 192],
                [180, 204, 228, 252, 276, 300]
            ])

            c.multiplyMatrices(b, a)

            expect(c).toEqual(d)

            console.log(c)
        })

        test("multiplyMatrices wrong input dimensions", () => {
            const m1 = new MatrixN(2, 2, [
                [1, 2],
                [3, 4]
            ])
            const m2 = new MatrixN(3, 2, [
                [1, 2],
                [3, 4],
                [5, 6]
            ])

            const m3 = new MatrixN(2, 3)
            expect(() => {
                m3.multiplyMatrices(m1, m2)
            }).toThrow(new Error("MatrixN.multiplyMatrices() - m1.cols != m2.rows"))
        })

        test("multiplyMatrices wrong output dimensions", () => {
            const m1 = new MatrixN(2, 2, [
                [1, 2],
                [3, 4]
            ])
            const m2 = new MatrixN(2, 2, [
                [1, 2],
                [3, 4]
            ])

            const m3 = new MatrixN(2, 3)
            expect(() => {
                m3.multiplyMatrices(m1, m2)
            }).toThrow(
                new Error(
                    "MatrixN.multiplyMatrices() - this.rows != m1.rows || this.cols != m2.cols"
                )
            )
        })
    })

    describe("multiply", () => {
        test("multiply square", () => {
            const b: MatrixN = new MatrixN(3, 3, [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ])

            const a: MatrixN = new MatrixN(3, 3, [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ]).multiply(b)

            const c: MatrixN = new MatrixN(3, 3, [
                [30, 36, 42],
                [66, 81, 96],
                [102, 126, 150]
            ])

            expect(a).toEqual(c)
        })

        test("multiply non-square - error 1", () => {
            const b: MatrixN = new MatrixN(3, 2, [
                [1, 2],
                [3, 4],
                [5, 6]
            ])

            const a: MatrixN = new MatrixN(2, 2, [
                [1, 2],
                [3, 4]
            ])
            expect(() => {
                a.multiply(b)
            }).toThrow(new Error("MatrixN.multiplyMatrices() - m1.cols != m2.rows"))
        })
        test("multiply non-square - error 2", () => {
            const b: MatrixN = new MatrixN(2, 3, [
                [1, 2, 3],
                [4, 5, 6]
            ])

            const a: MatrixN = new MatrixN(2, 2, [
                [1, 2],
                [3, 4]
            ])
            expect(() => {
                a.multiply(b)
            }).toThrow(
                new Error(
                    "MatrixN.multiplyMatrices() - this.rows != m1.rows || this.cols != m2.cols"
                )
            )
        })
    })
    test("determinant", () => {
        const a: MatrixN = new MatrixN(3, 3, [
            [4, -3, 5],
            [1, 0, 3],
            [-1, 5, 2]
        ])

        expect(a.determinant() == -20).toBe(true)
    })
    test("setFromMatrix3", () => {
        const a: THREE.Matrix3 = new THREE.Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9)

        const b: MatrixN = new MatrixN(3, 3).setFromMatrix3(a)
        const c: MatrixN = new MatrixN(3, 3, [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ])

        expect(b).toEqual(c)
    })
    test("setFromMatrix4", () => {
        const a: THREE.Matrix4 = new THREE.Matrix4().set(
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16
        )

        const b: MatrixN = new MatrixN(4, 4).setFromMatrix4(a)
        const c: MatrixN = new MatrixN(4, 4, [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 16]
        ])

        expect(b).toEqual(c)
    })

    test("invertMatrix 3x3", () => {
        const a: MatrixN = new MatrixN(3, 3, [
            [1, 0, 5],
            [2, 1, 6],
            [3, 4, 0]
        ])

        const b: MatrixN = new MatrixN(3, 3, [
            [-24, 20, -5],
            [18, -15, 4],
            [5, -4, 1]
        ])

        const c: MatrixN = new MatrixN(3, 3)

        c.invertMatrix(a)
        console.log("c", c)

        c.el
            .flatMap(e => e)
            .forEach((e, i) => {
                expect(e).toBeCloseTo(b.el.flat()[i])
            })
        // expect(c.invertMatrix(a)).t(b)
    })

    test("isIdentity", () => {
        const a: MatrixN = new MatrixN(3, 3, [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ])

        expect(a.isIdentity()).toBe(true)

        const b: MatrixN = new MatrixN(3, 3, [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 0]
        ])

        expect(b.isIdentity()).toBe(false)
    })

    test("isZero", () => {
        const a: MatrixN = new MatrixN(3, 3, [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ])

        expect(a.isZero()).toBe(true)

        const b: MatrixN = new MatrixN(3, 3, [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 0]
        ])

        expect(b.isZero()).toBe(false)
    })

    test("equals", () => {
        const a: MatrixN = new MatrixN(3, 3, [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ])

        const b: MatrixN = new MatrixN(3, 3, [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ])

        expect(a.equals(b)).toBe(true)

        const c: MatrixN = new MatrixN(3, 3, [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 0]
        ])

        expect(a.equals(c)).toBe(false)
    })

    test("multiplyScalar", () => {
        const a: MatrixN = new MatrixN(3, 3, [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ])

        const b: MatrixN = new MatrixN(3, 3, [
            [2, 0, 0],
            [0, 2, 0],
            [0, 0, 2]
        ])

        expect(a.multiplyScalar(2)).toEqual(b)
    })

    describe("fill", () => {
        test("fill 3x3", () => {
            const a: MatrixN = new MatrixN(3, 3).fill(1)

            const b: MatrixN = new MatrixN(3, 3, [
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1]
            ])

            expect(a).toEqual(b)
        })
        test("fill 1x4", () => {
            const a: MatrixN = new MatrixN(1, 4).fill(1)

            const b: MatrixN = new MatrixN(1, 4, [[1, 1, 1, 1]])

            expect(a).toEqual(b)
        })
        test("fill 4x1", () => {
            const a: MatrixN = new MatrixN(4, 1).fill(1)

            const b: MatrixN = new MatrixN(4, 1, [[1], [1], [1], [1]])

            expect(a).toEqual(b)
        })
    })

    describe("fromArray", () => {
        test("fromArray 3x3", () => {
            const a: MatrixN = new MatrixN(3, 3, [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ])

            const b: MatrixN = new MatrixN(3, 3)

            b.fromArray(a.el.flat())

            expect(a.equals(b)).toBe(true)
        })
        test("fromArray 1x4", () => {
            const a: MatrixN = new MatrixN(1, 4, [[1, 2, 3, 4]])

            const b: MatrixN = new MatrixN(1, 4)

            b.fromArray(a.el.flat())

            expect(a.equals(b)).toBe(true)
        })
    })
    test("toArray", () => {
        const a: MatrixN = new MatrixN(3, 3, [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ])

        const b: number[] = a.toArray()

        expect(b).toEqual(a.el.flat())
    })

    test("ludcmp", () => {
        const a: MatrixN = new MatrixN(4, 4, [
            [5.0, 7.0, 4.0, 11.0],
            [1.0, 6.0, -19.0, 1.0],
            [17.0, -3.0, 9.1, 21.0],
            [19.0, -6.0, 10.5, 32.0]
        ])

        const aRes: MatrixN = new MatrixN(4, 4, [
            [17.0, -3.0, 9.1, 21.0],
            [0.29411764705882354, 7.882352941176471, 1.3235, 4.823529411764706],
            [0.058823529411764705, 0.7835821, -20.5723888, -4.014],
            [1.1176470588235294, -0.3358209, -0.0376, 9.998]
        ])

        const res = Ludcmp(a.el, 0)

        console.log("res", res)

        res.A.flatMap(e => e).forEach((e, i) => {
            expect(e).toBeCloseTo(aRes.el.flat()[i])
        })
    })

    describe("multiplyMatrixVector", () => {
        test("Vector Matrix Multiplication 3x3", () => {
            const a: MatrixN = new MatrixN(3, 3, [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ])

            const b: number[][] = [[2], [1], [3]]

            const c: number[][] = [[13], [31], [49]]

            const d: number[][] = a.multiplyMatrixVector(b)
            expect(d).toEqual(c)
        })

        test("Vector Matrix Multiplication 2x3", () => {
            const a: MatrixN = new MatrixN(2, 3, [
                [1, -1, 2],
                [0, -3, 1]
            ])

            const b: number[][] = [[2], [1], [0]]

            const c: number[][] = [[1], [-3]]

            const d: number[][] = a.multiplyMatrixVector(b)
            expect(d).toEqual(c)
        })

        test("Vector Matrix Multiplication 3x2", () => {
            const a: MatrixN = new MatrixN(3, 2, [
                [1, -1],
                [0, -3],
                [2, 1]
            ])

            const b: number[][] = [[2], [1]]

            const c: number[][] = [[1], [-3], [5]]

            const d: number[][] = a.multiplyMatrixVector(b)
            expect(d).toEqual(c)
        })

        test("Vector Matrix Multiplication 1x3", () => {
            const a: MatrixN = new MatrixN(1, 3, [[1, -1, 2]])

            const b: number[][] = [[2], [1], [0]]

            const c: number[][] = [[1]]

            const d: number[][] = a.multiplyMatrixVector(b)
            expect(d).toEqual(c)
        })

        test("Vector Matrix Multiplication 6x1 x 6x6", () => {
            const a: MatrixN = new MatrixN(6, 6, [
                [0.3934, 0.0198, -1.9458, 0.1265, -0.0, 0.0256],
                [0.2773, -2.7778, 0.0278, -0.0018, 0.0, 0.018],
                [2.2626, 3.3019, 0.4911, -0.0319, 0.0, 0.1471],
                [1.3665, 0.4631, 6.257, -10.3734, 0.0, -0.9112],
                [-2.535, -0.5219, -0.4777, 0.1309, 0.0, -1.1598],
                [-1.7608, -0.4849, -4.3718, 10.201, 1.0, 0.8805]
            ])

            // 0.3934, 0.0198, -1.9458, 0.1265, -0.0000, 0.0256
            // 0.2773,   -2.7778,    0.0278,   -0.0018,    0.0000,    0.0180
            //   2.2626,    3.3019,    0.4911,   -0.0319,    0.0000,    0.1471
            //   1.3665,    0.4631,    6.2570,  -10.3734,    0.0000,   -0.9112
            //   -2.5350,   -0.5219,   -0.4777,    0.1309,    0.0000,   -1.1598
            //   -1.7608,   -0.4849,   -4.3718,   10.2010,    1.0000,    0.8805

            const b = [[1.4466], [1.119], [-6.8457], [-2.1138], [-5.7706], [-1.1798]]

            const c = a.multiplyMatrixVector(b)

            //matlab
            const d = [[13.614], [-2.9148], [3.4998], [-17.336], [0.1107], [-1.5342]]

            console.log("c", c)
            c.flatMap(e => e).forEach((e, i) => {
                expect(e).toBeCloseTo(d.flat()[i])
            })
        })
    })
    test("Set matrix from quaternion", () => {
        const quat = new THREE.Quaternion(0.4619398, 0.1913417, 0.4619398, 0.7325378)
        const mat = new MatrixN(3, 3)
        mat.setFromQuaternion(quat)
        const resMat = [
            [0.5, -0.5, 0.7071068],
            [0.8535534, 0.1464465, -0.5],
            [0.1464467, 0.8535534, 0.5]
        ]

        mat.el
            .flatMap(e => e)
            .forEach((e, i) => {
                expect(e).toBeCloseTo(resMat.flat()[i])
            })
    })

    test("Set matrix from quaternion", () => {
        const quat = new THREE.Quaternion(0.03117, 0.64746, 0.012, 0.76137)
        const mat = new MatrixN(3, 3)
        mat.setFromQuaternion(quat)
        const resMat = [
            [0.16, 0.02, 0.99],
            [0.06, 1, -0.03],
            [-0.99, 0.06, 0.16]
        ]

        mat.el
            .flatMap(e => e)
            .forEach((e, i) => {
                expect(e).toBeCloseTo(resMat.flat()[i])
            })
    })

    test("crossVector 3x1", () => {
        const mat = new MatrixN(3, 1, [[3], [-3], [1]])
        const vec = new THREE.Vector3(4, 9, 2)
        const res = mat.crossVector(vec)
        console.log("res", res)
        expect(res.el).toEqual([[-15], [-2], [39]])
    })

    test("crossVector 3x3", () => {
        const mat = new MatrixN(3, 3, [
            [2, 3, -4],
            [11, 8, 7],
            [2, 5, 3]
        ])
        const vec = new THREE.Vector3(3, 7, 5)
        const res = mat.crossVector(vec)
        console.log("res", res)

        expect(res.el).toEqual([
            [-15, -6, -3],
            [-2, 3, 6],
            [39, 18, 9]
        ])
    })
    test("setFromMatrix3", () => {
        const mat = new THREE.Matrix3()
        mat.set(1, 2, 3, 4, 5, 6, 7, 8, 9)
        const matN = new MatrixN(3, 3).setFromMatrix3(mat)

        const res = mat.clone().transpose().elements

        expect(matN.el.flat()).toEqual(res)
    })

    test("setFromMatrix4", () => {
        const mat = new THREE.Matrix4()
        mat.set(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
        const matN = new MatrixN(4, 4).setFromMatrix4(mat)

        const res = mat.clone().transpose().elements

        expect(matN.el.flat()).toEqual(res)
    })
})
