import * as React from "react"
import { useEffect, useState } from "react"
import { DockToolbar, DockToolbarButtonGroup } from "../../util/DockToolbar"
import { StyledTile } from "./styles"
import { PrecisionInput } from "../../util/PrecisionInput"
import { TransformationInput, useTransformation } from "../TransformationProvider"
import { Matrix3, Matrix4, Quaternion } from "three"
import { useTileContext } from "../../util/TileContextProvider"
import { ToolbarButtonsPrecision } from "../../util/ToolbarButtonsPrecision"
import { ToolbarButtonTranspose } from "../../util/ToolbarButtonTranspose"
import { ToolbarButtonNormalize } from "../../util/ToolbarButtonNormalize"

const to_row_major = [0, 3, 6, 1, 4, 7, 2, 5, 8]

export const Matrix3Tile = () => {
    const { input, matrix3, setMatrix3 } = useTransformation()
    const { precision } = useTileContext()

    // input is column-major, displayed in row-major
    const [edited, setEdited] = useState(matrix3.elements)

    useEffect(() => {
        if (input !== TransformationInput.VECTOR3) {
            setEdited(matrix3.elements)
        }
    }, [matrix3, input])

    function set_all(update: number[]) {
        setEdited(update)
        setMatrix3(new Matrix3().fromArray(update))
    }

    function set(value, axis) {
        const update = [...edited]
        update[axis] = value
        set_all(update)
    }

    function transpose() {
        const matrix3 = new Matrix3().fromArray(edited)
        matrix3.transpose()
        set_all(matrix3.elements)
    }

    function normalize() {
        const matrix4 = new Matrix4().setFromMatrix3(matrix3)
        const q = new Quaternion().setFromRotationMatrix(matrix4).normalize()
        const m = new Matrix3().setFromMatrix4(new Matrix4().makeRotationFromQuaternion(q))
        set_all(m.elements)
    }

    return (
        <div>
            <DockToolbar>
                <DockToolbarButtonGroup>
                    <ToolbarButtonTranspose onClick={transpose} />
                    <ToolbarButtonNormalize onClick={normalize} />
                </DockToolbarButtonGroup>
                <ToolbarButtonsPrecision />
            </DockToolbar>
            <StyledTile>
                <div className="input-wrapper">
                    <div className="grid col3">
                        {to_row_major.map((row_major_index, col_major_index) => (
                            <div className="input" key={"v-" + col_major_index}>
                                <PrecisionInput
                                    value={edited[row_major_index]}
                                    onChange={value => set(value, row_major_index)}
                                    precision={precision}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </StyledTile>
        </div>
    )
}
