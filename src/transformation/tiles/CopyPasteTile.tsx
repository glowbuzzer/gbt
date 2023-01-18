import * as React from "react"
import { DockToolbar } from "../../util/DockToolbar"
import { ToolbarButtonsPrecision } from "../../util/ToolbarButtonsPrecision"
import { StyledTile } from "./styles"

export const CopyPasteTile = () => {
    return (
        <div>
            <DockToolbar>
                <ToolbarButtonsPrecision />
            </DockToolbar>
            <StyledTile>HELLO</StyledTile>
        </div>
    )
}
