import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { Button, Select, Spin, Tag } from "antd"
import TextArea from "antd/es/input/TextArea"
import { TransformationInput, useTransformation } from "../TransformationProvider"
import { ConversionsType, parse } from "../parse"
import { format_labels, StyledCopyPasteDiv, type_labels_factory } from "./util"
import { DockToolbar } from "../../util/DockToolbar"
import { ToolbarButtonsPrecision } from "../../util/ToolbarButtonsPrecision"
import { ToolbarRadioAngularUnits } from "../../util/ToolbarRadioAngularUnits"
import { useTileContext } from "../../util/TileContextProvider"

function valuesOf(obj: any): number[] {
    const all = Object.values(obj)
    return all.slice(all.length / 2).map(Number)
}

function keysOf(obj: any): number[] {
    return Object.keys(obj).map(Number)
}

export const EditorTile = () => {
    const { setMatrix4 } = useTransformation()
    const { angularUnits } = useTileContext()
    const [type, setType] = useState()
    const [edit, setEdit] = useState("")
    const [format, setFormat] = useState()
    const [validTypes, setValidTypes] = useState([TransformationInput.NONE])
    const [loading, setLoading] = useState(false)
    const [conversions, setConversions] = useState<ConversionsType>({})
    const timerRef = useRef()

    useEffect(() => {
        setLoading(true)
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(() => {
            setLoading(false)

            const { format, conversions } = parse(edit, angularUnits)
            setFormat(format)
            setConversions(conversions)
            const valid = keysOf(conversions)
            setValidTypes(valid)
            if (!valid.includes(type)) {
                setType(valid[0])
            }
        }, 300)
    }, [edit])

    const conversion = conversions[type]

    function set() {
        if (conversion) {
            setMatrix4(conversion())
        }
    }

    const type_labels = type_labels_factory("Not recognised")

    const type_options = valuesOf(TransformationInput)
        .map(key => ({
            value: key,
            label: type_labels[key],
            key
        }))
        .filter(({ value }) => validTypes.includes(value))

    return (
        <StyledCopyPasteDiv>
            <DockToolbar>
                <ToolbarRadioAngularUnits
                    disabled={
                        ![TransformationInput.EULER, TransformationInput.AXIS_ANGLE].includes(type)
                    }
                />
            </DockToolbar>

            <div className="inner">
                <div className="textarea">
                    <TextArea value={edit} onChange={e => setEdit(e.target.value)} />
                </div>
                {loading ? (
                    <Spin size="small" />
                ) : (
                    <div>
                        {format !== undefined && <Tag>{format_labels[format]}</Tag>}
                        {type_options.length > 1 ? (
                            <Select
                                dropdownMatchSelectWidth={false}
                                size="small"
                                options={type_options}
                                value={type}
                                onChange={setType}
                            />
                        ) : (
                            <Tag>{type_labels[type]}</Tag>
                        )}
                    </div>
                )}
                <Button
                    size="small"
                    disabled={loading || !conversion || type === TransformationInput.NONE}
                    onClick={set}
                >
                    Set
                </Button>
            </div>
        </StyledCopyPasteDiv>
    )
}
