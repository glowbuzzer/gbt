/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"
import { Dispatch, SetStateAction } from "react"
import * as NMATH from "../ik/NMATH"

export enum ExtentValues {
    MM200 = "200mm",
    MM500 = "500mm",
    M2 = "2m"
}

export interface TableDataType {
    key: React.Key
    alpha: number
    theta: number
    dInitialOffset: number
    thetaInitialOffset: number
    a: number
    d: number
    quantity: NMATH.LinkQuantities
    negativeLimit: number
    positiveLimit: number
    color: string
}

export enum DhMatrixTypeEnum {
    DH_CLASSIC,
    DH_MODIFIED
}

// export enum LinkTypeEnum {
//     REVOLUTE,
//     PRISMATIC,
//     FIXED
// }
export enum UnitsEnum {
    UNITS_MM,
    UNITS_M
}

// export enum ExtentsEnum {
//     EXTENTS_200MM,
//     EXTENTS_500MM,
//     EXTENTS_2000MM
// }

export type SampleDhProps = {
    name: string
    matrixType: DhMatrixTypeEnum
    units: UnitsEnum
    matrix: TableDataType[]
}

export type SampleDhSelectProps = {
    value: number
    label: string
}

//Joint angle (the angle from the xi−1 to the xi axis measured about zi−1 axis. This is defined using a right-hand rule since both xi−1 and xi are perpendicular to zi−1. The direction of rotation is positive if the cross product of xi−1 and xi defines the zi−1 axis. θi is the joint variable if the joint i is revolute. In the case of a prismatic joint it is a constant or zero)
type modifiedDh = {
    alphaIminus1: number //Link twist or offset angle (measured from zi−1 axis to zi about the xi axis, again using a right-hand rule.
    aIminus1: number //Link length (the shortest distance between zi−1 and zi axes. It is measured as the distance along the direction of xi coordinate frame. For intersecting joint axes the value of ai is zero. It has no meaning for prismatic joints and is set to zero in this case)
    di: number //Link offset (distance from the xi−1 to the xi axis measured along the zi−1 axis. If the joint is prismatic, di is the joint variable. In the case of a revolute joint, it is a constant or zero)
    min: number
    max: number
}

export type KinVizContextType = {
    dataSource: NMATH.KinematicsLink[]
    setDataSource: Dispatch<SetStateAction<TableDataType[]>>
    activeDhMatrixType: DhMatrixTypeEnum
    setActiveDhMatrixType: Dispatch<SetStateAction<DhMatrixTypeEnum>>
    robotPos: THREE.Vector3
    setRobotPos: Dispatch<SetStateAction<THREE.Vector3>>
    robotRotE: THREE.Euler
    setRobotRotE: Dispatch<SetStateAction<THREE.Euler>>
    extents: ExtentValues
    setExtents: Dispatch<SetStateAction<ExtentValues>>
}
