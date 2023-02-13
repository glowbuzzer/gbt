/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useState, useRef, useContext, useCallback } from "react"
import * as NMATH from "../../ik/NMATH"
import { MathJax } from "better-react-mathjax"

// Matrix function

export const range = _n => [...Array(_n).keys()]

// interface MatrixTypesetProps {
//     mat: NMATH.MatrixN
//     name: string
// }
export const MatrixTypeset = ({
    mat,
    name,
    prec
}: {
    mat: NMATH.MatrixN
    name: string
    prec: number
}) => {
    const _elem = (i, j) => mat.el.flat()[j + i * mat.cols].toFixed(prec)

    const _name = name
    const _texElems = "\\[".concat(
        (_name ? `${_name}=` : "matrix =").concat(
            `\\left[\\begin{array}{${Array(mat.cols).fill("c").join("")}}`.concat(
                range(mat.rows)
                    .map(i =>
                        range(mat.cols)
                            .map(j => _elem(i, j))
                            .join("&&")
                    )
                    .join("\\\\")
                    .concat("\\end{array}\\right]\\]")
            )
        )
    )
    return (
        <p>
            <MathJax>{_texElems}</MathJax>
        </p>
    )
}
