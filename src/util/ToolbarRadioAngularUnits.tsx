import * as React from "react"
import { useTileContext } from "./TileContextProvider"
import { Radio } from "antd"
import { DockToolbarButtonGroup } from "./DockToolbar"

export const ToolbarRadioAngularUnits = () => {
    const { angularUnits, setAngularUnits } = useTileContext()

    function update_units(e) {
        setAngularUnits(e.target.value)
    }

    return (
        <DockToolbarButtonGroup>
            <Radio.Group size="small" onChange={update_units} value={angularUnits}>
                <Radio.Button value="deg">deg</Radio.Button>
                <Radio.Button value="rad">rad</Radio.Button>
            </Radio.Group>
        </DockToolbarButtonGroup>
    )
}
