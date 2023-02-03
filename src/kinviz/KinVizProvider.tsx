/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 *
 */

import React, { createContext, FC, useContext, useEffect, useState } from "react"
import { Euler, Quaternion } from "three"
import niceColors from "nice-color-palettes"
import { DhMatrixTypeEnum, ExtentValues, KinVizContextType } from "./tiles/types"
import * as THREE from "three"
import { defaultDhMatrix } from "./tiles/matrix/SampleDhMatrices"
import * as NMATH from "./ik/nmath"

// export enum RotationInput {
//     NONE,
//     EULER,
//     QUATERNION
// }

// type RotationValues = {
//     input: RotationInput
//     euler: Euler
//     quaternion: Quaternion
// }

// type KinVizContextType = {
//     // input: RotationInput
//     euler: Euler
//     quaternion: Quaternion
//     setEuler: (euler: Euler) => void
//     setQuaternion: (quaternion: Quaternion) => void
// }

const kinVizContext = createContext<KinVizContextType | null>(null)

export const KinVizProvider: FC<{ children }> = ({ children }) => {
    // const [value, setValue] = useState<RotationValues>({
    //     input: RotationInput.NONE,
    //     euler: new Euler(0, 0, 0, "XYZ"),
    //     quaternion: new Quaternion(0, 0, 0, 1)
    // })
    //
    // useEffect(() => {
    //     function paste(event: ClipboardEvent) {
    //         console.log("PASTE", event)
    //     }
    //     document.addEventListener("paste", paste)
    //     return () => document.removeEventListener("paste", paste)
    // }, [])
    //
    // const conversions: [RotationInput, (value: any) => any][] = [
    //     [RotationInput.EULER, euler => ({ euler })],
    //     [
    //         RotationInput.EULER,
    //         (euler: Euler) => ({ quaternion: new Quaternion().setFromEuler(euler) })
    //     ],
    //     [RotationInput.QUATERNION, quaternion => ({ quaternion })],
    //     [
    //         RotationInput.QUATERNION,
    //         (quaternion: Quaternion) => ({ euler: new Euler().setFromQuaternion(quaternion) })
    //     ]
    // ]
    //
    // function set(value, type: RotationInput) {
    //     const update = conversions.reduce((acc, [from, fn]) => {
    //         if (from === type) {
    //             return { ...acc, ...fn(value) }
    //         }
    //         return acc
    //     }, {})
    //
    //     setValue({
    //         input: type,
    //         ...update
    //     })
    // }

    const [dataSource, setDataSource] = useState<NMATH.KinematicsLink[]>(
        NMATH.staubliTx40Classic.links
    )

    const [activeDhMatrixType, setActiveDhMatrixType] = useState<DhMatrixTypeEnum>(
        DhMatrixTypeEnum.DH_CLASSIC
    )

    const [robotPos, setRobotPos] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
    const [robotRotE, setRobotRotE] = useState<THREE.Euler>(new THREE.Euler(0, 0, 0))

    const [extents, setExtents] = useState(ExtentValues.MM500)

    const context: KinVizContextType = {
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
    }

    return <kinVizContext.Provider value={context}>{children}</kinVizContext.Provider>
}

export const useKinViz = () => {
    const context: KinVizContextType = useContext(kinVizContext)
    if (context === undefined) {
        throw new Error("useKinViz must be used within a KinVizProvider")
    }
    return context
}
