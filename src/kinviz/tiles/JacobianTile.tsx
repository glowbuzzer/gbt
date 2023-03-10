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
import { Matrix, inverse } from "ml-matrix"
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

    return <MatrixTypeset mat={matrix} name={"J"} prec={precision} />
}

export const JacobianTile = () => {
    const { dataSource, setDataSource, robotInScene, setRobotInScene } = useKinViz()

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

    // const Jfwd = jacobian.Jfwd
    // console.log("dataSource", dataSource)

    const { angularUnits, precision, linearUnits, setAngularUnits, setLinearUnits } =
        useTileContext()

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
        </>
    )
}
