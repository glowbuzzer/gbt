import * as React from "react"
import { useEffect, useState } from "react"
import { DockToolbar, DockToolbarButtonGroup } from "../../util/DockToolbar"
import { StyledTile } from "./styles"
import { PrecisionInput } from "../../util/PrecisionInput"
import { Button } from "antd"
import { TransformationInput, useTransformation } from "../TransformationProvider"
import { Matrix3, Matrix4, Quaternion, Vector3 } from "three"
import { useTileContext } from "../../util/TileContextProvider"
import { ToolbarButtonsPrecision } from "../../util/ToolbarButtonsPrecision"
import { ToolbarButtonTranspose } from "../../util/ToolbarButtonTranspose"
import { ToolbarButtonNormalize } from "../../util/ToolbarButtonNormalize"

const to_row_major = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15]

export const Matrix4Tile = () => {
    const { input, matrix4, setMatrix4 } = useTransformation()
    const { precision } = useTileContext()

    const [edited, setEdited] = useState(matrix4.elements)

    useEffect(() => {
        if (input !== TransformationInput.VECTOR3) {
            setEdited(matrix4.elements)
        }
    }, [matrix4, input])

    function set_all(update: number[]) {
        setEdited(update)
        setMatrix4(new Matrix4().fromArray(update))
    }

    function set(value, axis) {
        const update = [...edited]
        update[axis] = value
        set_all(update)
    }

    function transpose() {
        const matrix4 = new Matrix4().fromArray(edited)
        matrix4.transpose()
        set_all(matrix4.elements)
    }

    function normalize() {
        const q = new Quaternion()
        const v = new Vector3()
        const s = new Vector3()
        matrix4.decompose(v, q, s)

        q.normalize()

        const m = new Matrix4().compose(v, q, s)
        set_all(m.elements)
    }

    return (
        <div>
            <DockToolbar>
                <DockToolbarButtonGroup>
                    <span
                        data-title="Transpose Matrix"
                        data-intro="Click this button to transpose the matrix"
                    >
                        <ToolbarButtonTranspose onClick={transpose} />
                    </span>
                    <ToolbarButtonNormalize onClick={normalize} />
                </DockToolbarButtonGroup>
                <ToolbarButtonsPrecision />
            </DockToolbar>
            <StyledTile>
                <div className="input-wrapper">
                    <div className="grid">
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
