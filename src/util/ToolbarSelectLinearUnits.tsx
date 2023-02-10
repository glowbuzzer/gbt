import * as React from "react"
import { useTileContext } from "./TileContextProvider"
import { Select } from "antd"
import { DockToolbarButtonGroup } from "./DockToolbar"
import { LinearUnits } from "../types"

export const ToolbarSelectLinearUnits = ({ disabled = false }) => {
    const { linearUnits, setLinearUnits } = useTileContext()

    function update_units(e) {
        setLinearUnits(e)
    }

    //convert enum LinearUnits to array of value/label pairs
    const options = Object.keys(LinearUnits).map(key => ({
        value: LinearUnits[key],
        label: LinearUnits[key]
    }))

    return (
        <DockToolbarButtonGroup>
            <Select
                disabled={disabled}
                value={linearUnits}
                onChange={update_units}
                options={options}
            />
        </DockToolbarButtonGroup>
    )
}
