import * as React from "react"
import { DockToolbarButtonGroup } from "./DockToolbar"
import { ReactComponent as ColMajorIcon } from "@material-symbols/svg-400/sharp/view_column.svg"
import { ReactComponent as RowMajorIcon } from "@material-symbols/svg-400/sharp/table_rows.svg"
import { MatrixOrder } from "../types"
import { GlowbuzzerIcon } from "./GlowbuzzerIcon"
import { useState } from "react"

export const ToolbarRadioMatrixOrder = () => {
    const { matrixOrder, setMatrixOrder } = useState(MatrixOrder.ROW_MAJOR)

    return (
        <DockToolbarButtonGroup>
            <GlowbuzzerIcon
                Icon={RowMajorIcon}
                button
                checked={matrixOrder === MatrixOrder.ROW_MAJOR}
                onClick={() => setMatrixOrder(MatrixOrder.ROW_MAJOR)}
                title="Row Major Order"
            />
            <GlowbuzzerIcon
                Icon={ColMajorIcon}
                button
                checked={matrixOrder === MatrixOrder.COLUMN_MAJOR}
                onClick={() => setMatrixOrder(MatrixOrder.COLUMN_MAJOR)}
                title="Column Major Order"
            />
        </DockToolbarButtonGroup>
    )
}
