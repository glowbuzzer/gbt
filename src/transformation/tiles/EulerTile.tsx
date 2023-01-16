import * as React from "react"
import { useEffect, useRef } from "react"
import { PrecisionInput } from "../../util/PrecisionInput"
import { TransformationInput, useTransformation } from "../TransformationProvider"
import { Euler, EulerOrder } from "three"
import { StyledTile } from "./styles"
import { DockToolbar } from "../../util/DockToolbar"
import { ToolbarRadioAngularUnits } from "../../util/ToolbarRadioAngularUnits"
import { useTileContext } from "../../util/TileContextProvider"
import { ToolbarButtonsPrecision } from "../../util/ToolbarButtonsPrecision"
import { ReactComponent as LockClosedIcon } from "@material-symbols/svg-400/outlined/lock.svg"
import { ReactComponent as LockOpenIcon } from "@material-symbols/svg-400/outlined/lock_open.svg"
import { Select, Space } from "antd"
import { GlowbuzzerIcon } from "../../util/GlowbuzzerIcon"
import { useLocalStorage } from "../../util/LocalStorageHook"

export const EulerTile = () => {
    const { toLocalAngularUnits, toStandardAngularUnits, angularUnits, precision } =
        useTileContext()
    const { input, euler, quaternion, setEuler } = useTransformation()
    // local edit state of each input field, can be strings or numbers
    const [edited, setEdited] = React.useState([euler.x, euler.y, euler.z].map(toLocalAngularUnits))
    const [orderLocked, setOrderLocked] = useLocalStorage("rotations.euler.locked", true)

    // take a ref copy of the incoming units, so we can detect when they change
    const unitsRef = useRef(angularUnits)

    // detect when the euler changes from outside this tile
    useEffect(() => {
        // don't process update if we're the ones who changed it
        if (input !== TransformationInput.EULER) {
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

    function set_all(update: number[], order: EulerOrder) {
        // update our local edit state
        setEdited(update)
        // and notify the provider of the new euler, converting to standard units
        const [x, y, z] = update.map(toStandardAngularUnits)
        setEuler(new Euler(x, y, z, order))
    }

    function set(value, axis) {
        // update the local edit state for the given axis
        const update = [...edited]
        update[axis] = value
        set_all(update, euler.order)
    }

    function update_euler_order(new_order) {
        // re-create the values and euler from quaternion but with new order
        const new_euler = new Euler().setFromQuaternion(quaternion, new_order)
        const update = [new_euler.x, new_euler.y, new_euler.z].map(toLocalAngularUnits)
        set_all(update, new_order)
    }

    const order_options = [
        { label: "XYZ", value: "XYZ" },
        { label: "XZY", value: "XZY" },
        { label: "YXZ", value: "YXZ" },
        { label: "YZX", value: "YZX" },
        { label: "ZXY", value: "ZXY" },
        { label: "ZYX", value: "ZYX" }
    ]

    const AXES = ["x", "y", "z"]

    function toggle_locked() {
        setOrderLocked(!orderLocked)
    }

    return (
        <>
            <DockToolbar>
                <ToolbarRadioAngularUnits />
                <ToolbarButtonsPrecision />
            </DockToolbar>
            <StyledTile>
                <div className="input-wrapper">
                    <div className="grid col4">
                        {AXES.map((axis, i) => (
                            <div key={"label-" + axis}>{axis.toUpperCase()}</div>
                        ))}
                        <div>Order</div>
                        {AXES.map((axis, index) => (
                            <div className="input" key={"input-" + axis}>
                                <PrecisionInput
                                    value={edited[index]}
                                    onChange={value => set(value, index)}
                                    precision={precision}
                                />
                            </div>
                        ))}
                        <div>
                            <Space>
                                <Select
                                    size="small"
                                    options={order_options}
                                    value={euler.order}
                                    onChange={update_euler_order}
                                />
                                <GlowbuzzerIcon
                                    Icon={orderLocked ? LockClosedIcon : LockOpenIcon}
                                    button
                                    size={"1.2em"}
                                    onClick={toggle_locked}
                                    title={
                                        orderLocked
                                            ? "Don't change axes with order"
                                            : "Change axes with order"
                                    }
                                />
                            </Space>
                        </div>
                    </div>
                </div>
            </StyledTile>
        </>
    )
}
