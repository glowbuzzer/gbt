import * as React from "react"
import { GlowbuzzerIcon } from "./GlowbuzzerIcon"
import { ReactComponent as TransposeIcon } from "@material-symbols/svg-400/outlined/pivot_table_chart.svg"

const Icon = () => {
    return (
        <svg
            // fill="#000000"
            viewBox="0 0 32 32"
            id="icon"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M19,26H14V24h5a5.0055,5.0055,0,0,0,5-5V14h2v5A7.0078,7.0078,0,0,1,19,26Z" />
            <path d="M8,30H4a2.0023,2.0023,0,0,1-2-2V14a2.0023,2.0023,0,0,1,2-2H8a2.0023,2.0023,0,0,1,2,2V28A2.0023,2.0023,0,0,1,8,30ZM4,14V28H8V14Z" />
            <path d="M28,10H14a2.0023,2.0023,0,0,1-2-2V4a2.0023,2.0023,0,0,1,2-2H28a2.0023,2.0023,0,0,1,2,2V8A2.0023,2.0023,0,0,1,28,10ZM14,4V8H28V4Z" />
        </svg>
    )
}

export const ToolbarButtonTranspose = ({ onClick }) => {
    // return <GlowbuzzerIcon button Icon={TransposeIcon} title="Transpose" onClick={onClick} />
    return <GlowbuzzerIcon button Icon={Icon} title="Transpose" onClick={onClick} />
}
