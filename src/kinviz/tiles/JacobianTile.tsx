/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import * as React from "react"
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

const APP_KEY = "kinviz"

function RenderMatrix({ matrix }) {
    const { precision } = useTileContext()
    console.log("matrix.el", matrix.el)
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

    return <MatrixTypeset mat={matrix} name={"J"} prec={precision} />
}

export const JacobianTile = () => {
    const {
        dataSource,
        setDataSource,
        activeDhMatrixType,
        setActiveDhMatrixType,
        robotPos,
        setRobotPos,
        robotRotE,
        setRobotRotE,
        extents,
        setExtents
    } = useKinViz()

    var isError = false
    var jacobian
    var errorString
    try {
        jacobian = KIN.computeForwardJacobian(dataSource, dataSource.length)
        isError = false
    } catch (e) {
        console.log("error", e)
        isError = true
        errorString = e
    }
    console.log("jacobian", jacobian)
    // const Jfwd = jacobian.Jfwd
    // console.log("dataSource", dataSource)

    const { angularUnits, precision, linearUnits } = useTileContext()

    const testMatrix = new NMATH.MatrixN(3, 3, [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ])

    return (
        <TileContextProvider appKey={APP_KEY} tileKey={"jacobian"}>
            <DockToolbar>
                <ToolbarButtonsPrecision />
            </DockToolbar>
            <StyledTile>
                <MathJaxContext>
                    <div>
                        If <MathJax inline>{"\\(\\textbf{x}\\)"}</MathJax> is the end-effector and{" "}
                        <MathJax inline>{"\\(\\textbf{q}\\)"}</MathJax> is the joint angles, then
                        the Jacobian is the matrix that relates the end-effector position and
                        orientation to the joint angles. The Jacobian is just a set of partial
                        differential equations:
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
                                    "\\(\\textbf{J} = \\frac{\\partial \\textbf{x}}{\\partial \\textbf{q}}\\)"
                                }
                            </MathJax>
                        </div>
                        It is calculated from the forward-transformation matrices which are
                        themselves calculated from the DH parameters. For the current robot
                        definition, the Jacobian, at the current set of joint angles is:
                        {isError ? (
                            <div style={{ paddingTop: 5, paddingBottom: 5, color: "red" }}>
                                Error: can't calculate Jacobian{" "}
                            </div>
                        ) : (
                            <RenderMatrix matrix={jacobian.Jfwd} />
                        )}
                        {/*<MatrixTypeset mat={testMatrix} name={"test"} />*/}
                    </div>
                    <div>
                        Remember the basics:
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: 5,
                                paddingBottom: 5
                            }}
                        >
                            <MathJax>
                                {"\\(\\dot{\\textbf{x}} = \\textbf{J} \\; \\dot{\\textbf{q}}\\)"}
                            </MathJax>
                        </div>
                        This tells us that the end-effector velocity (in cartesian space) is equal
                        to the Jacobian,
                        <MathJax inline>{"\\(\\textbf{J}\\)"}</MathJax>, multiplied by the joint
                        angle velocities.
                    </div>
                </MathJaxContext>
            </StyledTile>
        </TileContextProvider>
    )
}
