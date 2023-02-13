/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 *
 */

import React, { createContext, FC, useContext, useEffect, useState } from "react"
import { KinVizContextType, RobotInScene } from "./tiles/types"
import * as THREE from "three"
import * as NMATH from "./ik/NMATH"
import { AngularUnits, LinearUnits } from "../types"

const kinVizContext = createContext<KinVizContextType | null>(null)

export const KinVizProvider: FC<{ children }> = ({ children }) => {
    //this is the default data source shown on first load
    const [dataSource, setDataSource] = useState<NMATH.KinematicsLink[]>([
        new NMATH.KinematicsLink(
            new NMATH.DhParams(40, 0, 0, 0, 0, 0, Math.PI, -Math.PI),
            new NMATH.Body(),
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD
        ),
        new NMATH.KinematicsLink(
            new NMATH.DhParams(40, 0, 0, 0, 0, 0, Math.PI, -Math.PI),
            new NMATH.Body(),
            NMATH.LinkParamRepresentation.LINK_DH,
            NMATH.LinkQuantities.QUANTITY_ANGLE,
            NMATH.LinearUnits.UNITS_MM,
            NMATH.AngularUnits.UNITS_RAD
        )
    ])

    const defaultRobotInScene: RobotInScene = {
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Euler(0, 0, 0),
        angularUnits: AngularUnits.RAD,
        linearUnits: LinearUnits.MM
    }

    const [robotInScene, setRobotInScene] = useState<RobotInScene>(defaultRobotInScene)

    const [editing, setEditing] = useState(false)

    const [newDataLoaded, setNewDataLoaded] = useState(false)

    const context: KinVizContextType = {
        dataSource,
        setDataSource,
        robotInScene,
        setRobotInScene,
        editing,
        setEditing,
        newDataLoaded,
        setNewDataLoaded
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
