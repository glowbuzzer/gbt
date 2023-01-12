import * as React from "react"
import { useEffect } from "react"
import { PrecisionInput } from "../../util/PrecisionInput"
import { RotationInput, useRotations } from "../RotationsProvider"
import { Euler } from "three"
import { StyledTile } from "./styles"

export const EulerTile = () => {
    const { input, euler, setEuler } = useRotations()
    const [edited, setEdited] = React.useState([euler.x, euler.y, euler.z])

    useEffect(() => {
        const [x, y, z] = edited
        setEuler(new Euler(x, y, z))
    }, [edited])

    useEffect(() => {
        if (input !== RotationInput.EULER) {
            setEdited([euler.x, euler.y, euler.z])
        }
    }, [euler, input])

    function set(value, axis) {
        const update = [...edited]
        update[axis] = value
        setEdited(update)
    }

    return (
        <StyledTile>
            <div className="grid">
                {["x", "y", "z"].map((axis, index) => (
                    <div className="input" key={"t-" + axis}>
                        {axis.toUpperCase()}{" "}
                        <PrecisionInput
                            value={edited[index]}
                            onChange={value => set(value, index)}
                            precision={2}
                        />
                    </div>
                ))}
            </div>

            <div>
                Derived Euler: {euler.x}, {euler.y}, {euler.z}
            </div>
        </StyledTile>
    )
}
