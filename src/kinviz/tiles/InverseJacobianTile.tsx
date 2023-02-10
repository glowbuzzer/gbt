/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import * as React from "react"
import { useEffect } from "react"
import { useKinViz } from "../KinVizProvider"
import { StyledTile } from "./styles"
import * as NMATH from "../ik/NMATH"
import * as KIN from "../ik"
import { TileContextProvider, useTileContext } from "../../util/TileContextProvider"
import { DockToolbar } from "../../util/DockToolbar"
import { ToolbarRadioAngularUnits } from "../../util/ToolbarRadioAngularUnits"
import { ToolbarButtonsPrecision } from "../../util/ToolbarButtonsPrecision"
import { ToolbarSelectLinearUnits } from "../../util/ToolbarSelectLinearUnits"
import { MatrixTypeset } from "./mathTypesetting/MatrixTypeset"
import { MathJax, MathJaxContext } from "better-react-mathjax"
import { computeInverseJacobian } from "../ik"
import { inverse, Matrix } from "ml-matrix"
import { AngularUnits, LinearUnits } from "../../types"

const APP_KEY = "kinviz"

function RenderMatrix({ matrix }) {
    const { precision } = useTileContext()
    // return (
    //     <div>
    //         [
    //         {matrix.el.map((row, i) => (
    //             <div key={i}>
    //                 [
    //                 {row.map((col, j) => (
    //                     <span key={j}>{col.toFixed(precision)} </span>
    //                 ))}
    //                 ]
    //             </div>
    //         ))}
    //         ]
    //     </div>
    // )

    return <MatrixTypeset mat={matrix} name={"J^{-1}"} prec={precision} />
}

export const InverseJacobianTile = () => {
    const { dataSource, setDataSource, robotInScene, setRobotInScene } = useKinViz()

    var isError = false
    var jacobian
    var errorString
    try {
        jacobian = KIN.computeForwardJacobian(dataSource, dataSource.length)
        isError = false
    } catch (e) {
        isError = true
        errorString = e
    }

    // const Jfwd = jacobian.Jfwd
    // console.log("dataSource", dataSource)

    var jinv
    try {
        jinv = computeInverseJacobian(jacobian.Jfwd)
    } catch (e) {
        console.log("error", e)
        isError = true
        errorString = e
    }
    const { angularUnits, precision, linearUnits, setLinearUnits, setAngularUnits } =
        useTileContext()

    var inverseMl = inverse(jacobian.Jfwd.el, true)

    const mlMatrixN = new NMATH.MatrixN(inverseMl.rows, inverseMl.columns, inverseMl.to2DArray())

    useEffect(() => {
        if (dataSource[0].linearUnits == NMATH.LinearUnits.UNITS_IN) {
            setLinearUnits(LinearUnits.IN)
        } else if (dataSource[0].linearUnits == NMATH.LinearUnits.UNITS_MM) {
            setLinearUnits(LinearUnits.MM)
        } else if (dataSource[0].linearUnits == NMATH.LinearUnits.UNITS_CM) {
            setLinearUnits(LinearUnits.CM)
        } else if (dataSource[0].linearUnits == NMATH.LinearUnits.UNITS_M) {
            setLinearUnits(LinearUnits.M)
        }

        if (dataSource[0].angularUnits == NMATH.AngularUnits.UNITS_DEG) {
            setAngularUnits(AngularUnits.DEG)
        } else if (dataSource[0].angularUnits == NMATH.AngularUnits.UNITS_RAD) {
            setAngularUnits(AngularUnits.RAD)
        }
    }, [dataSource])

    return (
        <>
            <DockToolbar>
                <ToolbarButtonsPrecision />
                <ToolbarSelectLinearUnits disabled={true} />
                <ToolbarRadioAngularUnits disabled={true} />
            </DockToolbar>
            <StyledTile>
                <MathJaxContext>
                    <div>
                        If <MathJax inline>{"\\(\\textbf{x}\\)"}</MathJax> is the end-effector
                        position and <MathJax inline>{"\\(\\textbf{q}\\)"}</MathJax> is the joint
                        angles, then the inverse of the Jacobian is the matrix that relates the
                        joint angles to the end-effector position.
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: 5,
                                paddingBottom: 5
                            }}
                        >
                            <MathJax>
                                {
                                    "\\(\\dot{\\textbf{q}} = \\textbf{J}^{-1} \\; \\dot{\\textbf{x}}\\)"
                                }
                            </MathJax>
                        </div>
                        It is calculated by inverting the Jacobina. If the Jacobian is a square
                        matrix this is straight forward. For non square matrices, the pseudo-inverse
                        is used. As we approach singularities the inverse Jacobian values tend to
                        infinity. For the current robot definition, the inverse Jacobian, at the
                        current set of joint angles is:
                        {isError ? (
                            <div style={{ paddingTop: 5, paddingBottom: 5, color: "red" }}>
                                Error: can't calculate Jacobian{" "}
                            </div>
                        ) : (
                            <RenderMatrix matrix={jinv} />
                        )}
                        <RenderMatrix matrix={mlMatrixN} />
                        {/*<MatrixTypeset mat={testMatrix} name={"test"} />*/}
                    </div>
                    <div></div>
                </MathJaxContext>
            </StyledTile>
        </>
    )
}
