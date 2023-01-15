/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */
import * as React from "react"
import { useEffect, useState } from "react"
import { PrecisionInput } from "../../util/PrecisionInput"
// import { RotationInput, useRotations } from "../RotationsProvider"
import { Euler } from "three"
import { StyledTile } from "./styles"
import { useKinViz } from "../KinVizProvider"
import { sampleDhMatrices } from "./matrix/SampleDhMatrices"
import { Button, Form, InputNumber, Popconfirm, Select, Slider, Table, Tooltip } from "antd"

export const LoadSaveTile = () => {
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

    const [selectedPrecanned, setSelectedPrecanned] = useState(0)

    const handleLoadPrecanned = () => {
        setDataSource(sampleDhMatrices[selectedPrecanned].matrix)
        setUnits(sampleDhMatrices[selectedPrecanned].units)
        setActiveDhMatrixType(sampleDhMatrices[selectedPrecanned].matrixType)
    }

    type SelectProps = {
        value: number
        label: string
    }
    const precannedOptions: SelectProps[] = []

    sampleDhMatrices.forEach((row, i) => {
        precannedOptions.push({
            value: i,
            label: row.name
        })
    })

    return (
        <StyledTile>
            <div>
                <h4>You can load a pre-canned DH matrix from a set of common industrial robots</h4>
                <Select
                    value={selectedPrecanned}
                    onSelect={setSelectedPrecanned}
                    options={precannedOptions}
                />
                <Button type="primary" onClick={handleLoadPrecanned} style={{ marginBottom: 16 }}>
                    Load pre-canned robot DH matrix
                </Button>
            </div>
            <div>
                <h4>You can save the current robot DH matrix to local storage</h4>
                <Button type="primary" style={{ marginBottom: 16 }}>
                    Save current robot DH matrix
                </Button>
                <Select value={0} />
            </div>
            <div>
                <h4>You can load previously saved DH matrices from local storage</h4>
                <Button type="primary" style={{ marginBottom: 16 }}>
                    Load saved robot parameters
                </Button>
            </div>
        </StyledTile>
    )
}
