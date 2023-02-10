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
import * as THREE from "three"
import { round } from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements"
import { AngularUnits, LinearUnits } from "../../types"

function RenderMatrix({ matrix }) {
    const { precision } = useTileContext()

    const position = new THREE.Vector3().setFromMatrixPosition(matrix)
    const orientation = new THREE.Euler().setFromRotationMatrix(matrix)

    //     \begin{bmatrix}
    //     x\\
    // y\\
    // z\\
    // R_{x}\\
    // R_{x}\\
    // R_{z}
    // \end{bmatrix}

    //todo add offset orinetation etc.

    const combinedMatrix = new NMATH.MatrixN(6, 1, [
        [position.x],
        [position.y],
        [position.z],
        [orientation.x],
        [orientation.y],
        [orientation.z]
    ])

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

    return (
        <MatrixTypeset
            mat={combinedMatrix}
            name={
                "\\begin{bmatrix}\n" +
                "x\\\\ \n" +
                "y\\\\ \n" +
                "z\\\\ \n" +
                "R_{x}\\\\ \n" +
                "R_{x}\\\\ \n" +
                "R_{z}\n" +
                "\\end{bmatrix}"
            }
            prec={precision}
        />
    )
}

export const ForwardKinematicsTile = () => {
    const { dataSource, setDataSource, robotInScene, setRobotInScene } = useKinViz()

    const linkout: NMATH.KinematicsLink[] = []

    const thetasAndDs = []
    for (let link = 0; link < dataSource.length; link++) {
        if (dataSource[link].quantity == NMATH.LinkQuantities.QUANTITY_ANGLE) {
            thetasAndDs[link] = (dataSource[link].params as NMATH.DhParams).theta
        } else if (dataSource[link].quantity == NMATH.LinkQuantities.QUANTITY_LENGTH) {
            thetasAndDs[link] = (dataSource[link].params as NMATH.DhParams).d
        } else {
            //wwhat to do with fixed
        }
    }

    // const tempDataSource: NMATH.KinematicsLink[] = [...dataSource]

    for (let link = 0; link < dataSource.length; link++) {
        linkout[link] = dataSource[link].jointSet(thetasAndDs[link], false)
    }

    const joints = []

    const fwd = NMATH.PoseBuild(linkout, dataSource.length)

    var isError = false
    var jacobian
    var errorString
    // var fwd
    //
    // fwd = KIN.forwardKinematics(genser, joints)
    // try {
    //     // jacobian = KIN.computeForwardJacobian(dataSource, dataSource.length)
    //
    //     isError = false
    // } catch (e) {
    //     console.log("error", e)
    //     isError = true
    //     errorString = e
    // }
    // const Jfwd = jacobian.Jfwd

    const { angularUnits, precision, linearUnits, setLinearUnits, setAngularUnits } =
        useTileContext()

    const matrixWithOffset = new THREE.Matrix4()
    const robotRotQ = new THREE.Quaternion().setFromEuler(robotInScene.rotation)
    matrixWithOffset.compose(robotInScene.position, robotRotQ, new THREE.Vector3(1, 1, 1))

    matrixWithOffset.multiply(fwd.pose)

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
                        Forward kinematics is the process of calculating the position and
                        orientation of the end-effector of a robot, given the current set of joint
                        angles. It is calculated from the forward-transformation matrices which are
                        themselves calculated from the DH parameters. For the current robot
                        definition, end-effector position and orientation are:
                        {isError ? (
                            <div style={{ paddingTop: 5, paddingBottom: 5, color: "red" }}>
                                Error: can't calculate Jacobian{" "}
                            </div>
                        ) : (
                            <RenderMatrix matrix={matrixWithOffset} />
                        )}
                        This takes into account the robot's placement in the world (offsets in
                        position and orirnetation).
                        {/*<MatrixTypeset mat={testMatrix} name={"test"} />*/}
                    </div>
                </MathJaxContext>
            </StyledTile>
        </>
    )
}
