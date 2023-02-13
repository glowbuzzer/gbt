/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useState, useMemo, useRef } from "react"
import { PrecisionInput } from "../../util/PrecisionInput"
import { StyledTile } from "./styles"
import * as THREE from "three"

import { useKinViz } from "../KinVizProvider"
import { DrawCylinder } from "./draw/DrawCylinder"
import { DrawHollowCylinder } from "./draw/DrawHollowCylinder"
import { DrawBox } from "./draw/DrawBox"
import { DrawHollowBox } from "./draw/DrawHollowBox"
import * as NMATH from "../ik/NMATH"
import {
    Sphere,
    Html,
    OrbitControls,
    PerspectiveCamera,
    Environment,
    GizmoHelper,
    GizmoViewcube
} from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { DockToolbar } from "../../util/DockToolbar"
import { ToolbarSelectExtents } from "../../util/ToolbarSelectExtents"
import { useTileContext } from "../../util/TileContextProvider"
import { calculateLinearUnitsConversionFactor } from "../ik/NMATH"
import { ExtentValues } from "../../types"

export const ThreeDimensionalViewTile = () => {
    const { dataSource, setDataSource, robotInScene, setRobotInScene } = useKinViz()
    const { angularUnits, precision, linearUnits, dhType, extents } = useTileContext()

    const cameraRef = useRef<THREE.PerspectiveCamera>(null)
    const controlsRef = useRef(null)

    const gridSize = useMemo(() => {
        switch (String(extents)) {
            case "200mm": {
                return 200
            }
            case "500mm": {
                return 500
            }
            case "2m": {
                return 2000
            }
        }
    }, [extents])

    const cameraPosition = useMemo(() => {
        switch (String(extents)) {
            case "200mm": {
                return new THREE.Vector3(0, 0, 200)
            }
            case "500mm": {
                return new THREE.Vector3(0, 0, 500)
            }
            case "2m": {
                return new THREE.Vector3(0, 0, 2000)
            }
        }
    }, [extents])

    var adjustedRotX
    var adjustedRotY
    var adjustedRotZ
    var adjustedPosX
    var adjustedPosY
    var adjustedPosZ

    const factor = calculateLinearUnitsConversionFactor(
        dataSource[0].linearUnits,
        NMATH.LinearUnits.UNITS_MM
    )

    adjustedPosX = robotInScene.position.x * factor
    adjustedPosY = robotInScene.position.y * factor
    adjustedPosZ = robotInScene.position.z * factor

    if (dataSource[0].angularUnits == NMATH.AngularUnits.UNITS_DEG) {
        adjustedRotX = (robotInScene.rotation.x * Math.PI) / 180
        adjustedRotY = (robotInScene.rotation.y * Math.PI) / 180
        adjustedRotZ = (robotInScene.rotation.z * Math.PI) / 180
    } else {
        adjustedRotX = robotInScene.rotation.x
        adjustedRotY = robotInScene.rotation.y
        adjustedRotZ = robotInScene.rotation.z
    }

    // }, [robotInScene])

    return (
        <StyledTile>
            <DockToolbar>
                <span>Size of 3D canvas: {extents} </span>
            </DockToolbar>
            <div style={{ height: "38vh" }}>
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
                        args={[gridSize * 2, 10]} //10 is number of divisions
                        rotation={new THREE.Euler(Math.PI / 2)}
                    />
                    {/*<color attach="background" args={['black']} />*/}
                    <ambientLight color={"grey"} />

                    <group
                        position={[adjustedPosX || 0, adjustedPosY || 0, adjustedPosZ || 0]}
                        rotation={[adjustedRotX || 0, adjustedRotY || 0, adjustedRotZ || 0]}
                    >
                        <LinkModel />
                    </group>
                    <GizmoHelper alignment="bottom-right" margin={[80, 80]} renderPriority={1}>
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
    const {
        dataSource,
        setDataSource,
        setNewDataLoaded,
        newDataLoaded,
        robotInScene,
        setRobotInScene
    } = useKinViz()

    const [totalLengthOfLinks, setTotalLengthOfLinks] = useState(0)

    useEffect(() => {
        //set dh type based on first link in dataSource
        const factor = NMATH.calculateLinearUnitsConversionFactor(
            dataSource[0].linearUnits,
            NMATH.LinearUnits.UNITS_MM
        )
        var totalLengthOfLinks = 0

        dataSource.forEach(link => {
            totalLengthOfLinks += (link.params as NMATH.DhParams).a * factor
            totalLengthOfLinks += (link.params as NMATH.DhParams).d * factor
        })

        //1.2 factor to allow someone to move primsatic joints and not trigger a re-scale
        if (totalLengthOfLinks * 1.2 > 1000) {
            setExtents(ExtentValues.M2)
        } else if (totalLengthOfLinks * 1.2 > 500) {
            setExtents(ExtentValues.MM500)
        } else {
            setExtents(ExtentValues.MM200)
        }
    }, [dataSource])

    const { angularUnits, precision, linearUnits, dhType, extents, setExtents } = useTileContext()

    const transformationMatrices: THREE.Matrix4[] = []

    for (let i = 0; i < dataSource.length; i++) {
        const temp = new THREE.Matrix4()
        const factor = calculateLinearUnitsConversionFactor(
            dataSource[i].linearUnits,
            NMATH.LinearUnits.UNITS_MM
        )
        const dhItem = dataSource[i].params as NMATH.DhParams

        let theta = dhItem.theta
        let alpha = dhItem.alpha
        let a = dhItem.a
        let d = dhItem.d
        let dInitialOffset = dhItem.dInitialOffset
        let thetaInitialOffset = dhItem.thetaInitialOffset
        let positiveLimit = dhItem.positiveLimit
        let negativeLimit = dhItem.negativeLimit

        //apply initial offsets to theta and d
        if (dataSource[i].quantity == NMATH.LinkQuantities.QUANTITY_ANGLE) {
            theta += thetaInitialOffset
        } else {
            d += dInitialOffset
        }

        //convert angular units
        if (dataSource[i].angularUnits == NMATH.AngularUnits.UNITS_DEG) {
            theta *= Math.PI / 180
            alpha *= Math.PI / 180
            if (dataSource[i].quantity == NMATH.LinkQuantities.QUANTITY_ANGLE) {
                positiveLimit *= Math.PI / 180
                negativeLimit *= Math.PI / 180
            }
        }

        //convert linear units
        d *= factor
        a *= factor

        if (dataSource[i].quantity == NMATH.LinkQuantities.QUANTITY_ANGLE) {
            //do nothing
        } else {
            //prismatic
            positiveLimit *= factor
            negativeLimit *= factor
        }

        const ctheta = Math.cos(theta)
        const stheta = Math.sin(theta)
        const salpha = Math.sin(alpha)
        const calpha = Math.cos(alpha)

        if (dataSource[i].type == NMATH.LinkParamRepresentation.LINK_DH) {
            //classic dh
            temp.set(
                ctheta,
                -stheta * calpha,
                stheta * salpha,
                a * ctheta,
                stheta,
                ctheta * calpha,
                -ctheta * salpha,
                a * stheta,
                0,
                salpha,
                calpha,
                d,
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
                a,
                stheta * calpha,
                ctheta * calpha,
                -salpha,
                -salpha * d,
                stheta * salpha,
                ctheta * salpha,
                calpha,
                d * calpha,
                0,
                0,
                0,
                1
            )
        }

        //todo other link types
        transformationMatrices.push(temp)
    }

    const linkPos = new THREE.Vector3()
    const linkScale = new THREE.Vector3()
    const linkRot = new THREE.Quaternion()

    transformationMatrices[0].decompose(linkPos, linkRot, linkScale)

    type linkProps = {
        vStart: THREE.Vector3
        vEnd: THREE.Vector3
        vMid: THREE.Vector3
        vStartPrismaticTravel: THREE.Vector3
        vEndPrismaticTravel: THREE.Vector3
        eRot: THREE.Euler
        color: string
        quantity: NMATH.LinkQuantities
    }

    const linkCoords: linkProps[] = []

    const transformationMatricesMultiplied: THREE.Matrix4[] = []

    for (let i = 0; i < transformationMatrices.length; i++) {
        if (i == 0) {
            transformationMatricesMultiplied.push(transformationMatrices[0])
        } else {
            const tempm = new THREE.Matrix4()
            tempm.multiplyMatrices(
                transformationMatricesMultiplied[i - 1],
                transformationMatrices[i]
            )
            transformationMatricesMultiplied.push(tempm)
        }
    }

    console.log("TMM", transformationMatricesMultiplied)

    for (let i = 0; i < transformationMatricesMultiplied.length; i++) {
        const vEndTemp = new THREE.Vector3(0, 0, 0)
        const vScaleTemp = new THREE.Vector3(0, 0, 0)
        const qRotTemp = new THREE.Quaternion()
        const eRotTemp = new THREE.Euler()

        transformationMatricesMultiplied[i].decompose(vEndTemp, qRotTemp, vScaleTemp)

        eRotTemp.setFromQuaternion(qRotTemp)

        const factor = calculateLinearUnitsConversionFactor(
            dataSource[i].linearUnits,
            NMATH.LinearUnits.UNITS_MM
        )

        const dhItem = dataSource[i].params as NMATH.DhParams
        let theta = dhItem.theta
        let alpha = dhItem.alpha
        let a = dhItem.a
        let d = dhItem.d
        let dInitialOffset = dhItem.dInitialOffset
        let thetaInitialOffset = dhItem.thetaInitialOffset
        let positiveLimit = dhItem.positiveLimit
        let negativeLimit = dhItem.negativeLimit

        //apply initial offsets to theta and d
        if (dataSource[i].quantity == NMATH.LinkQuantities.QUANTITY_ANGLE) {
            theta += thetaInitialOffset
        } else {
            d += dInitialOffset
        }

        //convert angular units
        if (dataSource[i].angularUnits == NMATH.AngularUnits.UNITS_DEG) {
            theta *= Math.PI / 180
            alpha *= Math.PI / 180
            if (dataSource[i].quantity == NMATH.LinkQuantities.QUANTITY_ANGLE) {
                positiveLimit *= Math.PI / 180
                negativeLimit *= Math.PI / 180
            } else {
                //do nothing
            }
        }

        //convert linear units
        d *= factor
        a *= factor
        if (dataSource[i].quantity == NMATH.LinkQuantities.QUANTITY_ANGLE) {
        } else {
            positiveLimit *= factor
            negativeLimit *= factor
        }

        const vOriginTemp = new THREE.Vector3(0, 0, 0)
        const vTranslateTempDz = new THREE.Vector3()

        if (dataSource[i].quantity == NMATH.LinkQuantities.QUANTITY_ANGLE) {
            vTranslateTempDz.set(0, 0, d)
        } else {
            vTranslateTempDz.set(0, 0, d)
        }

        const vTranslateTempAx = new THREE.Vector3(a, 0, 0)
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
                    .multiplyScalar(negativeLimit),
                vEndPrismaticTravel: vOriginTemp
                    .clone()
                    .add(new THREE.Vector3(0, 0, 1))
                    .multiplyScalar(positiveLimit),
                eRot: eRotTemp,
                color: dataSource[i].color,
                quantity: dataSource[i].quantity
            })
        } else {
            const vEndAxTemp = vEndTemp.clone().sub(vTranslateTempAx)
            linkCoords.push({
                vStart: linkCoords[i - 1].vEnd,
                vEnd: vEndTemp,
                vMid: vEndAxTemp,
                vStartPrismaticTravel: linkCoords[i - 1].vEnd
                    .clone()
                    .add(
                        linkCoords[i - 1].vEnd
                            .clone()
                            .sub(vEndAxTemp)
                            .normalize()
                            .multiplyScalar(negativeLimit)
                    ),
                vEndPrismaticTravel: linkCoords[i - 1].vEnd
                    .clone()
                    .add(
                        linkCoords[i - 1].vEnd
                            .clone()
                            .sub(vEndAxTemp)
                            .normalize()
                            .multiplyScalar(positiveLimit)
                    ),
                eRot: eRotTemp,
                color: dataSource[i].color,
                //todo this is wrong
                quantity: dataSource[i].quantity
            })
        }
    }

    console.log("linkCoords", linkCoords)

    // console.log("robotInScene.position", robotInScene.position)
    // console.log("robotInScene.rotation", robotInScene.rotation)
    const robotPosM4: THREE.Matrix4 = new THREE.Matrix4().compose(
        robotInScene.position,
        new THREE.Quaternion().setFromEuler(robotInScene.rotation),
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

    const linkDim: number = useMemo(() => {
        switch (String(extents)) {
            case "200mm": {
                return 200 / 200
            }
            case "500mm": {
                return 500 / 200
            }
            case "2m": {
                return 2000 / 200
            }
        }
    }, [extents])

    console.log("linkDim", linkDim)

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

            <Sphere
                args={[linkDim * 2, 64, 32]}
                position={[linkCoords[0].vStart.x, linkCoords[0].vStart.y, linkCoords[0].vStart.z]}
            >
                <meshStandardMaterial color={"black"} />
            </Sphere>

            {linkCoords.map((row, index) => (
                <React.Fragment key={index}>
                    {/*<DrawCylinder vStart={linkCoords[index].vStart} vEnd={linkCoords[index].vEnd} />*/}

                    {/*<RenderLink row={row} linkDim={linkDim} />*/}

                    <RenderLink2 row={row} linkDim={linkDim} color={row.color} />
                    {/*<DrawCylinder*/}
                    {/*    vStart={row.vStart}*/}
                    {/*    vEnd={row.vEnd}*/}
                    {/*    radius={10}*/}
                    {/*    color={row.color}*/}
                    {/*/>*/}

                    <Sphere
                        args={[linkDim * 2, 64, 32]}
                        position={[row.vEnd.x, row.vEnd.y, row.vEnd.z]}
                    >
                        <meshStandardMaterial color={row.color} />
                    </Sphere>
                    <axesHelper
                        args={[linkDim * 15]}
                        position={[row.vEnd.x, row.vEnd.y, row.vEnd.z]}
                        rotation={[row.eRot.x, row.eRot.y, row.eRot.z]}
                    />
                </React.Fragment>
            ))}
            <Sphere
                args={[linkDim * 2, 64, 32]}
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
    switch (row.quantity) {
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

const RenderLink2 = ({ row, linkDim, color }) => {
    switch (row.quantity) {
        case NMATH.LinkQuantities.QUANTITY_ANGLE: {
            //revolute
            return (
                <>
                    <DrawCylinder
                        vStart={row.vStart}
                        vEnd={row.vEnd}
                        radius={linkDim}
                        color={color}
                    />
                </>
            )
        }
        //todo this will need to factor in joint limits for d
        case NMATH.LinkQuantities.QUANTITY_LENGTH: {
            //prismatic
            return (
                <>
                    <DrawBox vStart={row.vStart} vEnd={row.vEnd} side={linkDim} color={color} />
                </>
            )
        }
        case NMATH.LinkQuantities.QUANTITY_NONE: {
            //fixed
            //todo
            return null
        }
        default: {
            return null
        }
    }
}
