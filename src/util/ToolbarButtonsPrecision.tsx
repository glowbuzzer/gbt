import * as React from "react"
import { DockToolbarButtonGroup } from "./DockToolbar"
import { GlowbuzzerIcon } from "./GlowbuzzerIcon"
import { ReactComponent as DecimalIncrease } from "@material-symbols/svg-400/outlined/decimal_increase.svg"
import { ReactComponent as DecimalDecrease } from "@material-symbols/svg-400/outlined/decimal_decrease.svg"
import { useTileContext } from "./TileContextProvider"
// = ({ disabled = false })
export const ToolbarButtonsPrecision = ({ disabled = false }) => {
    const { precision, setPrecision } = useTileContext()

    function decrease() {
        setPrecision(Math.max(0, precision - 1))
    }

    function increase() {
        setPrecision(Math.min(10, precision + 1))
    }

    return (
        <DockToolbarButtonGroup>
            <GlowbuzzerIcon
                Icon={DecimalDecrease}
                title="Decrease Decimal Places"
                button
                disabled={disabled}
                onClick={decrease}
            />
            <GlowbuzzerIcon
                Icon={DecimalIncrease}
                title="Increase Decimal Places"
                button
                disabled={disabled}
                onClick={increase}
            />
        </DockToolbarButtonGroup>
    )
}
