import * as React from "react"
import { useKinViz } from "../../KinVizProvider"
import { Select } from "antd"
import { DockToolbarButtonGroup } from "../../../util/DockToolbar"
import { ExtentValues } from "../types"

export const ToolbarSelectExtents = () => {
    // const { linearUnits, setLinearUnits } = useTileContext()

    const { extents, setExtents } = useKinViz()

    function update_extents(e) {
        setExtents(e)
        console.log("e", e)
    }

    // <Select
    //     value={extents}
    //     onSelect={e => handleExtentsChange(e)}
    //     options={[
    //         { value: 0, label: "200mm" },
    //         { value: 1, label: "500mm" },
    //         { value: 2, label: "2m" }
    //     ]}
    //     style={{ width: 100 }}
    // />

    // const handleExtentsChange = e => {
    //     setExtents(e)
    // }

    //convert enum LinearUnits to array of value/label pairs
    const options = Object.keys(ExtentValues).map(key => ({
        value: key,
        label: ExtentValues[key]
    }))

    console.log("options", options)

    return (
        <DockToolbarButtonGroup>
            <Select value={extents} onChange={update_extents} options={options} />
        </DockToolbarButtonGroup>
    )
}
