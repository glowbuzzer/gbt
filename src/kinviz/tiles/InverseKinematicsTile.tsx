/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import * as React from "react"
import { useState, useEffect } from "react"
import { useKinViz } from "../KinVizProvider"
import { StyledTile } from "./styles"
import * as NMATH from "../ik/NMATH"
import * as KIN from "../ik"
import { useTileContext } from "../../util/TileContextProvider"
import { DockToolbar } from "../../util/DockToolbar"
import { ToolbarRadioAngularUnits } from "../../util/ToolbarRadioAngularUnits"
import { ToolbarButtonsPrecision } from "../../util/ToolbarButtonsPrecision"
import { ToolbarSelectLinearUnits } from "../../util/ToolbarSelectLinearUnits"

import { MatrixTypeset } from "./mathTypesetting/MatrixTypeset"
import { MathJax, MathJaxContext } from "better-react-mathjax"
import * as THREE from "three"
import { Button, InputNumber, Row, Col } from "antd"
import styled from "styled-components"
import { AngularUnits, LinearUnits } from "../../types"

const LabelSpan = styled.span`
    padding-right: 20px;
    padding-left: 5px;
    vertical-align: middle;
`

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

export const InverseKinematicsTile = () => {
    const { dataSource, setDataSource, robotInScene, setRobotInScene } = useKinViz()

    const joints: number[] = []

    dataSource.forEach((row, i) => {
        joints[i] = (row.params as NMATH.DhParams).theta
    })

    const genser = new NMATH.GenericSerial()
    genser.links = dataSource

    genser.max_iterations = 100
    genser.link_num = dataSource.length
    type posRot = {
        position: THREE.Vector3
        rotation: THREE.Euler
    }

    const defaultTcpPosRot: posRot = {
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Euler(0, 0, 0)
    }

    const [tcpPosRot, setTcpPosRot] = useState<posRot>(defaultTcpPosRot)

    const tcpPosRotMatrix4 = new THREE.Matrix4().compose(
        tcpPosRot.position,
        new THREE.Quaternion().setFromEuler(tcpPosRot.rotation),
        new THREE.Vector3(1, 1, 1)
    )

    var isError = false
    var jacobian
    var errorString
    var ik

    const { angularUnits, precision, linearUnits, setLinearUnits, setAngularUnits } =
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

    const newData = [...dataSource]

    const handleMoveToPosition = () => {
        try {
            // jacobian = KIN.computeForwardJacobian(dataSource, dataSource.length)
            KIN.inverseKinematics(genser, tcpPosRotMatrix4, joints)
            newData.forEach((row, i) => {
                ;(row.params as NMATH.DhParams).theta = joints[i] = joints[i]
            })

            setDataSource(newData)

            isError = false
        } catch (e) {
            console.log("error", e)
            isError = true
            errorString = e
        }
    }

    const onChangeTcpPosition = (component: number, value: any) => {
        if (value == null) value = 0

        const newPos = tcpPosRot.position.clone().setComponent(component, value)

        setTcpPosRot({ ...tcpPosRot, position: newPos })
    }
    const onChangeTcpRotation = (component: number, value: any) => {
        switch (component) {
            case 0: {
                //x
                if (value == null) value = 0
                const newRot = tcpPosRot.rotation
                    .clone()
                    .set(value, tcpPosRot.rotation.y, tcpPosRot.rotation.z)
                setTcpPosRot({ ...tcpPosRot, rotation: newRot })

                break
            }
            case 1: {
                //y
                if (value == null) value = 0

                const newRot = tcpPosRot.rotation
                    .clone()
                    .set(tcpPosRot.rotation.x, value, tcpPosRot.rotation.z)

                setTcpPosRot({ ...tcpPosRot, rotation: newRot })
                break
            }
            case 2: {
                //z
                if (value == null) value = 0

                const newRot = tcpPosRot.rotation
                    .clone()
                    .set(tcpPosRot.rotation.x, tcpPosRot.rotation.y, value)

                setTcpPosRot({ ...tcpPosRot, rotation: newRot })
                break
            }
        }
    }

    return (
        <>
            <DockToolbar>
                <ToolbarButtonsPrecision />
                <ToolbarSelectLinearUnits disabled={true} />
                <ToolbarRadioAngularUnits disabled={true} />
            </DockToolbar>
            <StyledTile>
                <p>
                    Inverse kinematics is the process of calculating the joint angles of a robot
                    given a desired position and orientation of the end effector. Inverse kinematics
                    is a non-linear problem, and there are many different methods used to solve it.
                    Here we are using the Jacobian Inverse method. Even though the Jacobian relates
                    joint and end-effector velocities, it can be used to calculate joint angles by
                    considering it to be a linear approximation for small changes in joint angles.
                    We iterate over the joint angles until the end-effector position and orientation
                    are close enough to the
                </p>
                <p>Test it out by entering a cartesian position and orientation to move to:</p>
                <Row align="middle" gutter={[16, 16]}>
                    <Col xs={2} lg={2}>
                        x
                    </Col>
                    <Col xs={22} lg={6}>
                        <InputNumber
                            value={tcpPosRot.position.x.toFixed(precision)}
                            onChange={e => onChangeTcpPosition(0, e)}
                        ></InputNumber>
                    </Col>
                    <Col xs={2} lg={2}>
                        y
                    </Col>
                    <Col xs={22} lg={6}>
                        <InputNumber
                            value={tcpPosRot.position.y.toFixed(precision)}
                            onChange={e => onChangeTcpPosition(1, e)}
                        ></InputNumber>
                    </Col>
                    <Col xs={2} lg={2}>
                        z
                    </Col>
                    <Col sm={22} lg={6}>
                        <InputNumber
                            value={tcpPosRot.position.z.toFixed(precision)}
                            onChange={e => onChangeTcpPosition(2, e)}
                        ></InputNumber>
                    </Col>
                </Row>
                <Row align="middle" gutter={[16, 16]}>
                    <Col xs={2} lg={2}>
                        R<sub>x</sub>
                    </Col>
                    <Col sm={22} lg={6}>
                        <InputNumber
                            value={tcpPosRot.rotation.x.toFixed(precision)}
                            onChange={e => onChangeTcpRotation(0, e)}
                        ></InputNumber>
                    </Col>
                    <Col xs={2} lg={2}>
                        R<sub>y</sub>
                    </Col>
                    <Col sm={22} lg={6}>
                        <InputNumber
                            value={tcpPosRot.rotation.y.toFixed(precision)}
                            onChange={e => onChangeTcpRotation(1, e)}
                        ></InputNumber>
                    </Col>
                    <Col xs={2} lg={2}>
                        R<sub>z</sub>
                    </Col>
                    <Col sm={22} lg={6}>
                        <InputNumber
                            value={tcpPosRot.rotation.z.toFixed(precision)}
                            onChange={e => onChangeTcpRotation(2, e)}
                        ></InputNumber>
                    </Col>
                </Row>
                <div style={{ paddingBottom: "5px", paddingTop: "15px" }}>
                    You can move the joints to the position and orientation entered above by
                    clicking this button:
                </div>
                <div style={{ paddingBottom: "5px", paddingTop: "15px" }}>
                    <Button
                        type="primary"
                        onClick={handleMoveToPosition}
                        style={{ marginBottom: 16 }}
                    >
                        Move to position
                    </Button>
                </div>
            </StyledTile>
        </>
    )
}
