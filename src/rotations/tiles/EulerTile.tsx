import * as React from "react"
import { useEffect, useRef } from "react"
import { PrecisionInput } from "../../util/PrecisionInput"
import { RotationInput, useRotations } from "../RotationsProvider"
import { Euler } from "three"
import { StyledTile } from "./styles"
import { DockToolbar } from "../../util/DockToolbar"
import { ToolbarRadioAngularUnits } from "../../util/ToolbarRadioAngularUnits"
import { useTileContext } from "../../util/TileContextProvider"
import { ToolbarButtonsPrecision } from "../../util/ToolbarButtonsPrecision"

export const EulerTile = () => {
    const { toLocalAngularUnits, toStandardAngularUnits, angularUnits, precision } =
        useTileContext()
    const { input, euler, setEuler } = useRotations()
    // local edit state of each input field, can be strings or numbers
    const [edited, setEdited] = React.useState([euler.x, euler.y, euler.z].map(toLocalAngularUnits))
    // take a ref copy of the incoming units, so we can detect when they change
    const unitsRef = useRef(angularUnits)

    // detect when the euler changes from outside this tile
    useEffect(() => {
        // don't process update if we're the ones who changed it
        if (input !== RotationInput.EULER) {
            setEdited([euler.x, euler.y, euler.z].map(toLocalAngularUnits))
        }
    }, [euler, input])

    // detect when the units change
    useEffect(() => {
        if (unitsRef.current !== angularUnits) {
            // convert the current euler to the new units
            setEdited([euler.x, euler.y, euler.z].map(toLocalAngularUnits))
            // and update the ref
            unitsRef.current = angularUnits
        }
    }, [angularUnits])

    function set_all(update: number[]) {
        // update our local edit state
        setEdited(update)
        // and notify the provider of the new euler, converting to standard units
        const [x, y, z] = update.map(toStandardAngularUnits)
        setEuler(new Euler(x, y, z, "XYZ"))
    }

    function set(value, axis) {
        // update the local edit state for the given axis
        const update = [...edited]
        update[axis] = value
        set_all(update)
    }

    const AXES = ["x", "y", "z"]
    return (
        <>
            <DockToolbar>
                <ToolbarRadioAngularUnits />
                <ToolbarButtonsPrecision />
            </DockToolbar>
            <StyledTile>
                <div className="grid col3">
                    {AXES.map((axis, i) => (
                        <div key={"label-" + axis}>{axis.toUpperCase()}</div>
                    ))}
                    {AXES.map((axis, index) => (
                        <div className="input" key={"input-" + axis}>
                            <PrecisionInput
                                value={edited[index]}
                                onChange={value => set(value, index)}
                                precision={precision}
                            />
                        </div>
                    ))}
                </div>
            </StyledTile>
        </>
    )
}
