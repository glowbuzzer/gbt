import React, { useEffect, useRef, useState } from "react"
import { DockToolbar, DockToolbarButtonGroup } from "../../util/DockToolbar"
import { ToolbarRadioAngularUnits } from "../../util/ToolbarRadioAngularUnits"
import { ToolbarButtonsPrecision } from "../../util/ToolbarButtonsPrecision"
import { StyledTile } from "./styles"
import { PrecisionInput } from "../../util/PrecisionInput"
import { TransformationInput, useTransformation } from "../TransformationProvider"
import { useTileContext } from "../../util/TileContextProvider"
import { quaternion_to_axis_angle } from "../math"
import { Quaternion, Vector3 } from "three"
import { ToolbarButtonNormalize } from "../../util/ToolbarButtonNormalize"

const AXES = ["x", "y", "z"]

export const AxisAngleTile = () => {
    const { toLocalAngularUnits, toStandardAngularUnits, angularUnits, precision } =
        useTileContext()
    const { input, quaternion, setAxisAngle } = useTransformation()
    const [edited, setEdited] = useState(quaternion_to_axis_angle(quaternion, toLocalAngularUnits))

    const unitsRef = useRef(angularUnits)

    // detect when the quaternion changes from outside this tile
    useEffect(() => {
        // don't process update if we're the ones who changed it
        if (input !== TransformationInput.AXIS_ANGLE) {
            setEdited(quaternion_to_axis_angle(quaternion, toLocalAngularUnits))
        }
    }, [quaternion, input])

    // detect when the units change
    useEffect(() => {
        if (unitsRef.current !== angularUnits) {
            // convert the current quaternion to the new units
            setEdited(quaternion_to_axis_angle(quaternion, toLocalAngularUnits))
            // and update the ref
            unitsRef.current = angularUnits
        }
    }, [angularUnits, toLocalAngularUnits, quaternion])

    function set_all(update: number[]) {
        // update our local edit state
        setEdited(update)
        // and notify the provider of the new axis angle, converting to standard units
        const [x, y, z, angle] = update
        setAxisAngle(x, y, z, toStandardAngularUnits(angle))
    }

    function set(value, axis) {
        // update the local edit state for the given axis
        const update = [...edited]
        update[axis] = value
        set_all(update)
    }

    function normalize() {
        const [x, y, z, angle] = edited
        const v = new Vector3(x, y, z).normalize()
        set_all([v.x, v.y, v.z, angle])
    }

    return (
        <>
            <DockToolbar>
                <DockToolbarButtonGroup>
                    <ToolbarButtonNormalize onClick={normalize} />
                </DockToolbarButtonGroup>
                <ToolbarRadioAngularUnits />
                <ToolbarButtonsPrecision />
            </DockToolbar>
            <StyledTile>
                <div className="input-wrapper">
                    <div className="grid col4">
                        {AXES.map(axis => (
                            <div key={"label-" + axis}>{axis.toUpperCase()}</div>
                        ))}
                        <div>Angle</div>
                        {AXES.map((axis, index) => (
                            <div className="input" key={"input-" + axis}>
                                <PrecisionInput
                                    value={edited[index]}
                                    onChange={value => set(value, index)}
                                    precision={precision}
                                />
                            </div>
                        ))}
                        <div className="input" key="input-angle">
                            <PrecisionInput
                                value={edited[3]}
                                onChange={value => set(value, 3)}
                                precision={precision}
                            />
                        </div>
                    </div>
                </div>
            </StyledTile>
        </>
    )
}
