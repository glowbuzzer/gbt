import * as React from "react"
import { useEffect, useState } from "react"
import { Button, Select, Space, Tag } from "antd"
import { TransformationInput, useTransformation } from "../TransformationProvider"
import TextArea from "antd/es/input/TextArea"
import { CopyPasteFormat, format_labels, StyledCopyPasteDiv, type_labels_factory } from "./util"
import { export_matrix4 } from "../export"
import { DockToolbar } from "../../util/DockToolbar"
import { ToolbarButtonsPrecision } from "../../util/ToolbarButtonsPrecision"
import { useTileContext } from "../../util/TileContextProvider"
import { ToolbarRadioAngularUnits } from "../../util/ToolbarRadioAngularUnits"
import { useLocalStorage } from "../../util/LocalStorageHook"

function valuesOf(obj: any): number[] {
    const all = Object.values(obj)
    return all.slice(all.length / 2).map(Number)
}

export const ExportTile = () => {
    const [type, setType] = useLocalStorage("rotations.export.type", TransformationInput.NONE)
    const [format, setFormat] = useLocalStorage("rotations.export.format", CopyPasteFormat.CSV)
    const [copy, setCopy] = useState("")
    const { matrix4, input } = useTransformation()
    const { precision } = useTileContext()
    const { angularUnits } = useTileContext()

    const type_labels = type_labels_factory("Auto")
    const type_options = valuesOf(TransformationInput).map(key => ({
        value: key,
        label: type_labels[key],
        key
    }))

    const format_options = valuesOf(CopyPasteFormat)
        .map(key => ({
            value: key,
            label: format_labels[key],
            key
        }))
        .slice(1)

    useEffect(() => {
        if (matrix4) {
            const text = export_matrix4(matrix4, format, type || input, precision, angularUnits)
            setCopy(text)
        }
    }, [matrix4, type, input, format, precision, angularUnits])

    return (
        <StyledCopyPasteDiv>
            <DockToolbar>
                <ToolbarRadioAngularUnits
                    disabled={(type || input) !== TransformationInput.EULER}
                />
                <ToolbarButtonsPrecision />
            </DockToolbar>

            <div className="inner">
                <div className="textarea">
                    <TextArea value={copy} />
                </div>

                <Space>
                    <Select
                        dropdownMatchSelectWidth={false}
                        size="small"
                        options={format_options}
                        value={format}
                        onChange={setFormat}
                    />
                    <Select
                        dropdownMatchSelectWidth={false}
                        size="small"
                        options={type_options}
                        value={type}
                        onChange={setType}
                    />
                    {type === TransformationInput.NONE && <Tag>{TransformationInput[input]}</Tag>}
                </Space>
                <Button size="small">Copy</Button>
            </div>
        </StyledCopyPasteDiv>
    )
}
