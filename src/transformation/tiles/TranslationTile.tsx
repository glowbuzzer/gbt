import * as React from "react"
import { DockToolbar } from "../../util/DockToolbar"
import { StyledTile } from "./styles"
import { PrecisionInput } from "../../util/PrecisionInput"
import { Button } from "antd"
import { TransformationInput, useTransformation } from "../TransformationProvider"
import { useEffect, useState } from "react"
import { Quaternion, Vector3 } from "three"
import { useTileContext } from "../../util/TileContextProvider"
import { ToolbarButtonsPrecision } from "../../util/ToolbarButtonsPrecision"

export const TranslationTile = () => {
    const { input, translation, setTranslation } = useTransformation()
    const { precision } = useTileContext()

    const [edited, setEdited] = useState([translation.x, translation.y, translation.z])

    const cols = ["x", "y", "z"]

    useEffect(() => {
        if (input !== TransformationInput.VECTOR3) {
            setEdited([translation.x, translation.y, translation.z])
        }
    }, [translation, input])

    function set_all(update: number[]) {
        const [x, y, z] = update
        setEdited(update)
        setTranslation(new Vector3(x, y, z))
    }

    function set(value, axis) {
        const update = [...edited]
        update[axis] = value
        set_all(update)
    }

    return (
        <div>
            <DockToolbar>
                <ToolbarButtonsPrecision />
            </DockToolbar>
            <StyledTile>
                <div className="input-wrapper">
                    <div className="grid col3">
                        {cols.map(axis => (
                            <div className="label" key={axis}>
                                {axis.toUpperCase()}
                            </div>
                        ))}
                        {cols.map((axis, index) => (
                            <div className="input" key={"v-" + axis}>
                                <PrecisionInput
                                    value={edited[index]}
                                    onChange={value => set(value, index)}
                                    precision={precision}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <Button size="small" onClick={() => set_all([0, 0, 0])}>
                    Reset
                </Button>
            </StyledTile>
        </div>
    )
}
