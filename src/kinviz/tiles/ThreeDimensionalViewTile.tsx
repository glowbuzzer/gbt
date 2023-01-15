/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useState, useMemo, useRef } from "react"
import { PrecisionInput } from "../../util/PrecisionInput"
import { StyledTile } from "./styles"
import * as THREE from "three"
import { UnitsEnum, LinkTypeEnum, DhMatrixTypeEnum, ExtentValues } from "./types"
import { useKinViz } from "../KinVizProvider"
import { DrawCylinder } from "./draw/DrawCylinder"
import { DrawHollowCylinder } from "./draw/DrawHollowCylinder"
import { DrawBox } from "./draw/DrawBox"
import { DrawHollowBox } from "./draw/DrawHollowBox"
import {
    Sphere,
    PivotControls,
    Html,
    OrbitControls,
    PerspectiveCamera,
    useGLTF,
    useContextBridge,
    Environment,
    Cylinder,
    GizmoHelper,
    GizmoViewcube
} from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { DockToolbar } from "../../util/DockToolbar"
import { ToolbarRadioAngularUnits } from "../../util/ToolbarRadioAngularUnits"
import { ToolbarButtonsPrecision } from "../../util/ToolbarButtonsPrecision"
import { ToolbarSelectLinearUnits } from "../../util/ToolbarSelectLinearUnits"
import { ToolbarSelectExtents } from "./matrix/ToolbarSelectExtents"

export const ThreeDimensionalViewTile = () => {
    const {
        dataSource,
        setDataSource,
        activeDhMatrixType,
        setActiveDhMatrixType,
        robotPos,
        setRobotPos,
        robotRotE,
        setRobotRotE,
        units,
        setUnits,
        extents,
        setExtents
    } = useKinViz()

    const cameraRef = useRef<THREE.PerspectiveCamera>(null)
    const controlsRef = useRef(null)

    const gridSize = useMemo(() => {
        switch (String(extents)) {
            case "MM200": {
                return 200
            }
            case "MM500": {
                return 500
            }
            case "M2": {
                return 2000
            }
        }
    }, [extents])

    const cameraPosition = useMemo(() => {
        switch (String(extents)) {
            case "MM200": {
                return new THREE.Vector3(0, 0, 200)
            }
            case "MM500": {
                return new THREE.Vector3(0, 0, 500)
            }
            case "M2": {
                return new THREE.Vector3(0, 0, 2000)
            }
        }
    }, [extents])

    return (
        <StyledTile>
            <DockToolbar>
                <ToolbarSelectExtents />
            </DockToolbar>
            <div style={{ width: "800px", height: "500px" }}>
                <Canvas>
                    <PerspectiveCamera
                        ref={cameraRef}
                        makeDefault
                        position={cameraPosition}
                        far={10000}
                        near={1}
                        up={[0, 0, 1]}
                    />
                    <OrbitControls ref={controlsRef} enableDamping={false} makeDefault={true} />

                    <pointLight
                        position={[0, 0, 1000]}
                        color={"white"}
                        castShadow={true}
                        distance={1000 * 2}
                        shadow-mapSize-height={512}
                        shadow-mapSize-width={512}
                        shadow-radius={10}
                        shadow-bias={-0.0001}
                    />
                    <axesHelper args={[10]} />
                    <gridHelper
                        args={[gridSize, 10]} //10 is number of divisions
                        rotation={new THREE.Euler(Math.PI / 2)}
                    />
                    {/*<color attach="background" args={['black']} />*/}
                    <ambientLight color={"grey"} />

                    <group
                        position={[robotPos.x, robotPos.y, robotPos.z]}
                        rotation={[robotRotE.x, robotRotE.y, robotRotE.z]}
                    >
                        <LinkModel />
                    </group>
                    <GizmoHelper alignment="bottom-right" margin={[80, 80]} renderPriority={0}>
                        <GizmoViewcube
                            {...{
                                faces: ["Right", "Left", "Back", "Front", "Top", "Bottom"]
                            }}
                        />
                    </GizmoHelper>
                    <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr" />
                </Canvas>
            </div>
        </StyledTile>
    )
}

const LinkModel = () => {
    // const { input, euler, setEuler } = useRotations()
    // const [edited, setEdited] = React.useState([euler.x, euler.y, euler.z])
    //
    // useEffect(() => {
    //     const [x, y, z] = edited
    //     setEuler(new Euler(x, y, z))
    // }, [edited])
    //
    // useEffect(() => {
    //     if (input !== RotationInput.EULER) {
    //         setEdited([euler.x, euler.y, euler.z])
    //     }
    // }, [euler, input])
    //
    // function set(value, axis) {
    //     const update = [...edited]
    //     update[axis] = value
    //     setEdited(update)
    // }

    const {
        dataSource,
        setDataSource,
        activeDhMatrixType,
        setActiveDhMatrixType,
        robotPos,
        setRobotPos,
        robotRotE,
        setRobotRotE,
        units,
        setUnits,
        extents,
        setExtents
    } = useKinViz()

    const [thetas, setThetas] = useState([0])

    // const links: linkProps[] = [];

    const transformationMatrices: THREE.Matrix4[] = []

    // const dhType = DhMatrixTypeEnum.DH_CLASSIC;

    for (let i = 0; i < dataSource.length; i++) {
        const temp = new THREE.Matrix4()

        dataSource[i].jointType == LinkTypeEnum.REVOLUTE
            ? console.log("revolute")
            : console.log("prismatic")

        const theta =
            dataSource[i].jointType == LinkTypeEnum.REVOLUTE
                ? (dataSource[i].theta * Math.PI) / 180 +
                  (dataSource[i].initialOffset * Math.PI) / 180
                : (dataSource[i].theta * Math.PI) / 180
        const ctheta = Math.cos(theta)
        const stheta = Math.sin(theta)
        const salpha = Math.sin((dataSource[i].alpha * Math.PI) / 180)
        const calpha = Math.cos((dataSource[i].alpha * Math.PI) / 180)

        // switch (dataSource[i].jointType) {
        // case 0 || 1: {
        //revolute
        if (activeDhMatrixType == DhMatrixTypeEnum.DH_CLASSIC) {
            //classic dh
            temp.set(
                ctheta,
                -stheta * calpha,
                stheta * salpha,
                dataSource[i].a * ctheta,
                stheta,
                ctheta * calpha,
                -ctheta * salpha,
                dataSource[i].a * stheta,
                0,
                salpha,
                calpha,
                dataSource[i].jointType == LinkTypeEnum.REVOLUTE
                    ? dataSource[i].d
                    : dataSource[i].d + dataSource[i].initialOffset,
                0,
                0,
                0,
                1
            )
        } else {
            //modified
            temp.set(
                ctheta,
                -stheta,
                0,
                dataSource[i].a,
                stheta * calpha,
                ctheta * calpha,
                -salpha,
                -(dataSource[i].jointType == LinkTypeEnum.REVOLUTE
                    ? dataSource[i].d
                    : dataSource[i].d + dataSource[i].initialOffset) * salpha,
                stheta * salpha,
                ctheta * salpha,
                calpha,
                (dataSource[i].jointType == LinkTypeEnum.REVOLUTE
                    ? dataSource[i].d
                    : dataSource[i].d + dataSource[i].initialOffset) * calpha,
                0,
                0,
                0,
                1
            )
        }
        //
        //   break;
        // }
        // case 1: {
        //   //prismatic
        //   if (activeDhMatrixType == DhMatrixTypeEnum.DH_CLASSIC) {
        //   } else {
        //     //modified
        //   }
        //
        //   break;
        // }
        // case 2: {
        //   // fixed
        //   if (activeDhMatrixType == DhMatrixTypeEnum.DH_CLASSIC) {
        //   } else {
        //     //modified
        //   }
        //   break;
        // }
        // }
        console.log("temp", temp)
        transformationMatrices.push(temp)
    }
    console.log("TM", transformationMatrices)

    const linkPos = new THREE.Vector3()
    const linkScale = new THREE.Vector3()
    const linkRot = new THREE.Quaternion()

    transformationMatrices[0].decompose(linkPos, linkRot, linkScale)
    console.log("linkPos", linkPos)

    type linkProps = {
        vStart: THREE.Vector3
        vEnd: THREE.Vector3
        vMid: THREE.Vector3
        vStartPrismaticTravel: THREE.Vector3
        vEndPrismaticTravel: THREE.Vector3
        eRot: THREE.Euler
        color: string
        type: LinkTypeEnum
    }

    const linkCoords: linkProps[] = []

    const transformationMatricesMultiplied: THREE.Matrix4[] = []

    for (let i = 0; i < transformationMatrices.length; i++) {
        console.log("mulitiply matrices", i)
        if (i == 0) {
            transformationMatricesMultiplied.push(transformationMatrices[i])
        } else {
            const tempm = new THREE.Matrix4()
            tempm.multiplyMatrices(
                transformationMatricesMultiplied[i - 1],
                transformationMatrices[i]
            )
            transformationMatricesMultiplied.push(tempm)
        }
    }
    console.log("TM-mult", transformationMatricesMultiplied)

    for (let i = 0; i < transformationMatricesMultiplied.length; i++) {
        const vEndTemp = new THREE.Vector3(0, 0, 0)
        const vScaleTemp = new THREE.Vector3(0, 0, 0)
        const qRotTemp = new THREE.Quaternion()
        const eRotTemp = new THREE.Euler()

        transformationMatricesMultiplied[i].decompose(vEndTemp, qRotTemp, vScaleTemp)

        eRotTemp.setFromQuaternion(qRotTemp)

        //if we are in m scale vEndTemp
        if (units != 0) {
            vEndTemp.multiplyScalar(1000)
        }
        const vOriginTemp = new THREE.Vector3(0, 0, 0)
        const vTranslateTempDz = new THREE.Vector3()

        if (units == 0) {
            if (dataSource[i].jointType == LinkTypeEnum.REVOLUTE) {
                vTranslateTempDz.set(0, 0, dataSource[i].d)
            } else {
                vTranslateTempDz.set(0, 0, dataSource[i].d + dataSource[i].initialOffset)
            }
        } else {
            if (dataSource[i].jointType == LinkTypeEnum.REVOLUTE) {
                vTranslateTempDz.set(0, 0, 1000 * dataSource[i].d)
            } else {
                vTranslateTempDz.set(0, 0, 1000 * (dataSource[i].d + dataSource[i].initialOffset))
            }
        }
        const vTranslateTempAx =
            units == 0
                ? new THREE.Vector3(dataSource[i].a, 0, 0)
                : new THREE.Vector3(1000 * dataSource[i].a, 0, 0)
        vTranslateTempAx.applyEuler(eRotTemp)

        console.log("vEndTemp", vEndTemp, i)

        //calculate where end of prismatic first joint is

        if (i == 0) {
            linkCoords.push({
                vStart: vOriginTemp,
                vEnd: vEndTemp,
                vMid: vOriginTemp.clone().add(vTranslateTempDz),
                vStartPrismaticTravel: vOriginTemp
                    .clone()
                    .add(new THREE.Vector3(0, 0, 1))
                    .multiplyScalar(
                        units == UnitsEnum.UNITS_MM ? dataSource[i].min : dataSource[i].min * 1000
                    ),
                vEndPrismaticTravel: vOriginTemp
                    .clone()
                    .add(new THREE.Vector3(0, 0, 1))
                    .multiplyScalar(
                        units == UnitsEnum.UNITS_MM ? dataSource[i].max : dataSource[i].max * 1000
                    ),
                eRot: eRotTemp,
                color: dataSource[i].color,
                type: dataSource[i].jointType
            })
        } else {
            const vEndAxTemp = vEndTemp.clone().sub(vTranslateTempAx)
            linkCoords.push({
                vStart: linkCoords[i - 1].vEnd,
                vEnd: vEndTemp,
                vMid: vEndAxTemp,
                vStartPrismaticTravel: linkCoords[i - 1].vEnd.clone().add(
                    linkCoords[i - 1].vEnd
                        .clone()
                        .sub(vEndAxTemp)
                        .normalize()
                        .multiplyScalar(
                            units == UnitsEnum.UNITS_MM
                                ? dataSource[i].min
                                : dataSource[i].min * 1000
                        )
                ),
                vEndPrismaticTravel: linkCoords[i - 1].vEnd.clone().add(
                    linkCoords[i - 1].vEnd
                        .clone()
                        .sub(vEndAxTemp)
                        .normalize()
                        .multiplyScalar(
                            units == UnitsEnum.UNITS_MM
                                ? dataSource[i].max
                                : dataSource[i].max * 1000
                        )
                ),
                eRot: eRotTemp,
                color: dataSource[i].color,
                type: dataSource[i].jointType
            })
        }
    }

    console.log("linkCoords", linkCoords)

    const robotPosM4: THREE.Matrix4 = new THREE.Matrix4().compose(
        robotPos,
        new THREE.Quaternion().setFromEuler(robotRotE),
        new THREE.Vector3(1, 1, 1)
    )
    //todo check mult order
    const eeM4: THREE.Matrix4 = robotPosM4.multiplyMatrices(
        robotPosM4,
        transformationMatricesMultiplied[transformationMatricesMultiplied.length - 1]
    )

    const eePv = new THREE.Vector3()
    const eeRq = new THREE.Quaternion()
    const eeRe = new THREE.Euler()
    const eeSv = new THREE.Vector3()

    eeM4.decompose(eePv, eeRq, eeSv)
    eeRe.setFromQuaternion(eeRq)

    const linkDim = useMemo(() => {
        switch (String(extents)) {
            case "MM200": {
                return 200 / 200
            }
            case "MM500": {
                return 500 / 200
            }
            case "M2": {
                return 2000 / 200
            }
        }
    }, [extents])

    function strip(x) {
        return Number.parseFloat(x).toFixed(2)
    }

    return (
        <>
            <Html
                position={[
                    linkCoords[linkCoords.length - 1].vEnd.x,
                    linkCoords[linkCoords.length - 1].vEnd.y,
                    linkCoords[linkCoords.length - 1].vEnd.z - 10
                ]}
            >
                x:{eePv.x.toFixed(2)}, y:
                {eePv.y.toFixed(2)}, z:
                {eePv.z.toFixed(2)}R<sub>x</sub>:{strip(eeRe.x * (180 / Math.PI))}, R<sub>y</sub>:
                {strip(eeRe.y * (180 / Math.PI))}, R<sub>z</sub>:{strip(eeRe.z * (180 / Math.PI))},
            </Html>
            {linkCoords.map((row, index) => (
                <React.Fragment key={index}>
                    {/*<DrawCylinder*/}
                    {/*  vStart={linkCoords[index].vStart}*/}
                    {/*  vEnd={linkCoords[index].vEnd}*/}
                    {/*/>*/}

                    <RenderLink row={row} linkDim={linkDim} />

                    <axesHelper
                        args={[linkDim * 10]}
                        position={[row.vEnd.x, row.vEnd.y, row.vEnd.z]}
                        rotation={[row.eRot.x, row.eRot.y, row.eRot.z]}
                    />
                </React.Fragment>
            ))}
            <Sphere
                args={[5, 64, 32]}
                position={[
                    linkCoords[linkCoords.length - 1].vEnd.x,
                    linkCoords[linkCoords.length - 1].vEnd.y,
                    linkCoords[linkCoords.length - 1].vEnd.z
                ]}
            >
                <meshStandardMaterial color="black" />
            </Sphere>
        </>
    )
}

const RenderLink = ({ row, linkDim }) => {
    switch (row.type) {
        case 0: {
            //revolute
            return (
                <>
                    <DrawCylinder
                        vStart={row.vStart}
                        vEnd={row.vMid}
                        color={"grey"}
                        lengthScale={1.2}
                        radius={linkDim}
                    />
                    <DrawHollowCylinder
                        vStart={row.vStart}
                        vEnd={row.vMid}
                        color={row.color}
                        lengthScale={1.1}
                        innerRadius={linkDim}
                        outerRadius={linkDim * 2}
                    />
                    <DrawCylinder
                        vStart={row.vMid}
                        vEnd={row.vEnd}
                        color={row.color}
                        radius={linkDim}
                    />
                </>
            )
        }
        //todo this will need to factor in joint limits for d
        case 1: {
            //prismatic
            return (
                <>
                    <DrawBox
                        vStart={row.vStartPrismaticTravel}
                        vEnd={row.vEndPrismaticTravel}
                        color={"grey"}
                        lengthScale={1}
                        side={linkDim}
                    />
                    <DrawHollowBox
                        vStart={row.vStartPrismaticTravel}
                        vMid={row.vMid}
                        vEnd={row.vEndPrismaticTravel}
                        color={row.color}
                        lengthScale={1}
                        partial={true}
                        innerSide={linkDim}
                        outerSide={linkDim * 2}
                    />
                    <DrawBox vStart={row.vMid} vEnd={row.vEnd} color={row.color} side={linkDim} />
                </>
            )
        }
        case 3: {
            //fixed
            //todo
            return null
        }
        default: {
            return null
        }
    }
}
