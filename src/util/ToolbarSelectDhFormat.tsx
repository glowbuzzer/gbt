import * as React from "react"
import { useTileContext } from "./TileContextProvider"
import { Select } from "antd"
import { DockToolbarButtonGroup } from "./DockToolbar"
import { DhType } from "../types"

export const ToolbarSelectDhFormat = ({ disabled = false }) => {
    const { dhType, setDhType } = useTileContext()

    function update_DhType(e) {
        setDhType(e)
    }

    //convert enum DhType to array of value/label pairs
    const options = Object.keys(DhType).map(key => ({
        value: DhType[key],
        label: DhType[key]
    }))

    return (
        <DockToolbarButtonGroup>
            <Select disabled={disabled} value={dhType} onChange={update_DhType} options={options} />
        </DockToolbarButtonGroup>
    )
}
