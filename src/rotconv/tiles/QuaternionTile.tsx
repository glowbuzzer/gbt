import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { PrecisionInput } from "../../util/PrecisionInput"
import { TransformationInput, useTransformation } from "../TransformationProvider"
import { Quaternion } from "three"
import { StyledTile } from "./styles"
import { DockToolbar, DockToolbarButtonGroup } from "../../util/DockToolbar"
import { ToolbarButtonsPrecision } from "../../util/ToolbarButtonsPrecision"
import { useTileContext } from "../../util/TileContextProvider"
import { ToolbarButtonNormalize } from "../../util/ToolbarButtonNormalize"
import { GlowbuzzerIcon } from "../../util/GlowbuzzerIcon"
import { ReactComponent as NegateIcon } from "@material-symbols/svg-400/rounded/swap_horiz.svg"

export const QuaternionTile = () => {
    const { input, quaternion, setQuaternion } = useTransformation()
    const { precision } = useTileContext()
    const [edited, setEdited] = useState([quaternion.x, quaternion.y, quaternion.z, quaternion.w])
    const [shadow, setShadow] = useState([])
    const timerRef = useRef(null)

    useEffect(() => {
        if (input !== TransformationInput.QUATERNION) {
            setEdited([quaternion.x, quaternion.y, quaternion.z, quaternion.w])
        }
    }, [quaternion, input])

    function set_all(update: number[]) {
        const [x, y, z, w] = update
        setEdited(update)
        setQuaternion(new Quaternion(x, y, z, w).normalize())
    }

    function set(value, axis) {
        const update = [...edited]
        update[axis] = value
        set_all(update)
    }

    const update_shadow = useCallback(() => {
        const { x, y, z, w } = quaternion
        const new_value = [x, y, z, w].map((v, index) =>
            v.toFixed(5) === edited[index].toFixed(5) ? null : v.toFixed(5)
        )
        setShadow(new_value)
    }, [quaternion, edited, precision])

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(update_shadow, 100)
    }, [update_shadow])

    function normalize() {
        const [_x, _y, _z, _w] = edited
        const normalized = new Quaternion(_x, _y, _z, _w).normalize()
        const { x, y, z, w } = normalized
        setEdited([x, y, z, w])
        setQuaternion(normalized)
    }

    function negate() {
        set_all(edited.map(v => -v))
    }

    const cols = ["x", "y", "z", "w"]

    return (
        <div
            data-title="Input Tiles"
            data-intro="Enter your values in each tile and other representations will update automatically"
        >
            <DockToolbar>
                <DockToolbarButtonGroup>
                    <span data-title="Normalize" data-intro="Click this button to normalize inputs">
                        <ToolbarButtonNormalize onClick={normalize} />
                    </span>
                    <GlowbuzzerIcon Icon={NegateIcon} button onClick={negate} title="Negate" />
                </DockToolbarButtonGroup>
                <span
                    data-title="Adjust Precision"
                    data-intro="Adjust the precision of your inputs and outputs in each tile"
                >
                    <ToolbarButtonsPrecision />
                </span>
            </DockToolbar>
            <StyledTile>
                <div className="input-wrapper">
                    <div className="grid">
                        {cols.map(axis => (
                            <div className="label" key={axis}>
                                {axis.toUpperCase()}
                            </div>
                        ))}
                        {cols.map((axis, index) => (
                            <div className="input" key={"t-" + axis}>
                                <PrecisionInput
                                    value={edited[index]}
                                    onChange={value => set(value, index)}
                                    precision={precision}
                                />
                            </div>
                        ))}
                        {cols.map((axis, index) => (
                            <div className="shadow" key={"s-" + axis}>
                                {shadow[index] ? shadow[index] : ""}
                            </div>
                        ))}
                    </div>
                </div>
            </StyledTile>
        </div>
    )
}
