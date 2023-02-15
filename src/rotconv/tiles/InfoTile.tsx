import React from "react"
import { StyledTile } from "./styles"
import styled from "styled-components"

const StyledDiv = styled.div`
    p {
        line-height: 1.6em;
    }
`

export const InfoTile = () => {
    return (
        <StyledTile>
            <StyledDiv>
                <h2>Welcome to the 3D converter from glowbuzzer</h2>
                <p>
                    This page allows you to import, edit, convert and export 3D rotations. It
                    supports several different representations of rotations, including Euler angles,
                    axis-angle, quaternions, rotation matrices (matrix4 and matrix3) and
                    translations.
                </p>
                <p>
                    The page is split into several tiles. Each tile can be moved and resized. The
                    tiles can be re-arranged by dragging them around.
                </p>
                <p>
                    As you adjust the values in a tile, the other tiles will update to reflect the
                    changes. You can also use the pivot control in the 3D Visualization tile to
                    adjust the rotation and translation.
                </p>
                <p>
                    Quickly perform raw edits or paste values from the clipboard using the Edit
                    tile. We will do our best to parse the value and update the current rotation
                    accordingly. If the type is ambiguous, you can use the type dropdown to specify
                    the type.
                </p>
                <p>
                    You can export the current rotation in various types and formats. The auto
                    setting will use the tile you last edited to dictate the type, or you can
                    specify the type explicitly.
                </p>
                <p>
                    Almost all conversions are carried out using the Three.js library. The source
                    code for this page can be found on Github (link in the header). We welcome new
                    issues for any bugs you find and feature requests.
                </p>
            </StyledDiv>
        </StyledTile>
    )
}
