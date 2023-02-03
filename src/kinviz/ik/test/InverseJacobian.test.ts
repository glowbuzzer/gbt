/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import { describe, it, assert, expect, test } from "vitest"

import * as THREE from "three"
import * as NMATH from "../NMATH/index"
import { computeInverseJacobian } from "../InverseJacobian"

test("inverseJacobian 6x6", () => {
    const forwardJacobian = new NMATH.MatrixN(6, 6, [
        [0.103, 0.5049, 0.4343, 0.0006, 0.0647, 0],
        [0.005, -0.3151, 0.0377, 0.0, -0.0, 0],
        [-0.5126, 0.0989, 0.0882, -0.0065, 0.0065, 0],
        [-0.2911, 0.1982, 0.1982, -0.0993, 0.0998, 0],
        [0.9554, 0.01, 0.01, 0.995, 0.0, 1.0],
        [-0.0491, -0.9801, -0.9801, -0.01, -0.995, 0.0]
    ])

    const res = new NMATH.MatrixN(6, 6, [
        [0.3934, 0.0198, -1.9458, 0.1265, -0.0, 0.0256],
        [0.2773, -2.7778, 0.0278, -0.0018, 0.0, 0.018],
        [2.2626, 3.3019, 0.4911, -0.0319, 0.0, 0.1471],
        [1.3665, 0.4631, 6.257, -10.3734, 0.0, -0.9112],
        [-2.535, -0.5219, -0.4777, 0.1309, 0.0, -1.1598],
        [-1.7608, -0.4849, -4.3718, 10.201, 1.0, 0.8805]
    ])

    const det = forwardJacobian.determinant()
    //0.0068
    console.log("det", det)

    expect(det).toBeCloseTo(0.0068)

    const resInv = computeInverseJacobian(forwardJacobian)
    console.log(resInv)
    console.log(resInv.el)

    resInv.el
        .flatMap(e => e)
        .forEach((e, i) => {
            expect(e).toBeCloseTo(res.el.flat()[i], 1)
        })
})

test("inverseJacobian 4x6", () => {
    const forwardJacobian = new NMATH.MatrixN(6, 4, [
        [0, 0, 0, 0],
        [-0.6, -0.275, 0, 0],
        [-0.0, -0.0, 1.0, 0],
        [0, 0, 0, 0],
        [0.0, 0.0, 0, 0],
        [-1.0, -1.0, 0, 1.0]
    ])

    const res = new NMATH.MatrixN(4, 6, [
        [-0.0, -1.709, -0.0, 0, 0.0, 0.1651],
        [0.0, 0.0924, 0.0, 0, -0.0, -0.3603],
        [0.0, -0.0, 1.0, 0, 0.0, -0.0],
        [-0.0, -1.6166, -0.0, 0, 0.0, 0.8048]
    ])

    // const det = forwardJacobian.determinant()
    // //0.0068
    // console.log("det", det)

    // expect(det).toBeCloseTo(0.0068)

    const resInv = computeInverseJacobian(forwardJacobian)
    console.log(resInv)
    console.log(resInv.el)

    resInv.el
        .flatMap(e => e)
        .forEach((e, i) => {
            expect(e).toBeCloseTo(res.el.flat()[i], 1)
        })
})

test("inverseJacobian 4x6 - 2", () => {
    const forwardJacobian = new NMATH.MatrixN(6, 4, [
        [0.325, 0.0, 0, 0],
        [-0.2753, -0.275, 0, 0],
        [-0.0, -0.0, 1.0, 0],
        [0, 0, 0, 0],
        [0.0, 0.0, 0, 0],
        [-1.0, -1.0, 0, 1.0]
    ])

    const res = new NMATH.MatrixN(4, 6, [
        [3.0769, 0.0, 0.0, 0, -0.0, 0.0],
        [-3.0798, -3.6364, -0.0, 0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0, -0.0, -0.0],
        [-0.0029, -3.6364, -0.0, 0, 0.0, 1.0]
    ])

    const resInv = computeInverseJacobian(forwardJacobian)
    console.log(resInv)
    console.log(resInv.el)

    resInv.el
        .flatMap(e => e)
        .forEach((e, i) => {
            expect(e).toBeCloseTo(res.el.flat()[i], 1)
        })
})
