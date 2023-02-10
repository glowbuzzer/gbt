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
import {
    Button,
    Form,
    Input,
    InputNumber,
    Popconfirm,
    Select,
    Slider,
    Table,
    Tooltip,
    Upload,
    message
} from "antd"
import type { UploadProps } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { ExampleMachineSet } from "../ik/ExampleMachines/ExampleMachineSet"
import { GenericSerial } from "../ik/NMATH"
import * as NMATH from "../ik/NMATH"
import { DhType } from "../../types"
import { useTileContext } from "../../util/TileContextProvider"

const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
        onSuccess("ok")
    }, 0)
}

export const LoadSaveTile = () => {
    const {
        dataSource,
        setDataSource,
        robotInScene,
        setRobotInScene,
        newDataLoaded,
        setNewDataLoaded
    } = useKinViz()
    const [selectedPrecanned, setSelectedPrecanned] = useState(0)

    const handleLoadPrecanned = () => {
        setDataSource(ExampleMachineSet[selectedPrecanned].links)
        setNewDataLoaded(true)
    }

    type SelectProps = {
        value: number
        label: string
    }
    const precannedOptions: SelectProps[] = []

    ExampleMachineSet.forEach((row, i) => {
        precannedOptions.push({
            value: i,
            label: row.name
        })
    })

    const jsonFileDownload = () => {
        const fileName = "finename.json"
        const data = new Blob([JSON.stringify(dataSource)], { type: "text/json" })
        const jsonURL = window.URL.createObjectURL(data)
        const link = document.createElement("a")
        document.body.appendChild(link)
        link.href = jsonURL
        link.setAttribute("download", fileName)
        link.click()
        document.body.removeChild(link)
    }

    const jsonFileUpload = e => {
        const fileReader = new FileReader()

        if (!e.target.files[0]) {
            return
        }

        fileReader.readAsText(e.target.files[0], "UTF-8")
        fileReader.onload = e => {
            const data = JSON.parse(e.target.result as string)
            console.log("Data", data)
            setDataSource(data)
            setNewDataLoaded(true)
        }
    }

    return (
        <StyledTile>
            <div>
                <h4>You can load a pre-canned DH matrix from a set of common industrial robots:</h4>
                <Select
                    value={selectedPrecanned}
                    onSelect={setSelectedPrecanned}
                    options={precannedOptions}
                />
                <Button type="primary" onClick={handleLoadPrecanned} style={{ marginBottom: 16 }}>
                    Load
                </Button>
            </div>

            <div>
                <>
                    <h4>You can download a DH matrix you have entered to your PC:</h4>
                    <Button onClick={jsonFileDownload} type="primary" style={{ marginBottom: 16 }}>
                        Download File
                    </Button>
                </>

                <h4>You can upload a DH matrix data from your PC:</h4>

                <Input
                    type="file"
                    onChange={jsonFileUpload}
                    style={{ borderRadius: "8px", background: "#1677ff", color: "white" }}
                />
            </div>
        </StyledTile>
    )
}
