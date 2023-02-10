import * as React from "react"
import { useTileContext } from "./TileContextProvider"
import { Select } from "antd"
import { DockToolbarButtonGroup } from "./DockToolbar"
import { ExtentValues } from "../types"

export const ToolbarSelectExtents = ({ disabled = false }) => {
    const { extents, setExtents } = useTileContext()

    function update_DhType(e) {
        setExtents(e)
    }

    //convert enum DhType to array of value/label pairs
    const options = Object.keys(ExtentValues).map(key => ({
        value: ExtentValues[key],
        label: ExtentValues[key]
    }))

    return (
        <DockToolbarButtonGroup>
            <Select
                disabled={disabled}
                value={extents}
                onChange={update_DhType}
                options={options}
            />
        </DockToolbarButtonGroup>
    )
}
