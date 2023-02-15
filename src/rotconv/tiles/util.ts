import { TransformationInput } from "../TransformationProvider"
import { StyledTile } from "./styles"
import styled from "styled-components"

export enum CopyPasteFormat {
    AUTO,
    CSV,
    JSON_ARRAY,
    JSON_OBJECT,
    THREEJS_OBJECT,
    THREEJS_INTERNAL
}

export const format_labels = {
    [CopyPasteFormat.AUTO]: "Auto",
    [CopyPasteFormat.THREEJS_INTERNAL]: "THREE Internal",
    [CopyPasteFormat.THREEJS_OBJECT]: "New THREE Object",
    [CopyPasteFormat.CSV]: "Comma Separated",
    [CopyPasteFormat.JSON_ARRAY]: "JSON Array",
    [CopyPasteFormat.JSON_OBJECT]: "JSON Object"
}

export const type_labels_factory = (none: string) => ({
    [TransformationInput.NONE]: none,
    [TransformationInput.VECTOR3]: "Vector3",
    [TransformationInput.QUATERNION]: "Quaternion",
    [TransformationInput.MATRIX4]: "Matrix4",
    [TransformationInput.MATRIX3]: "Matrix3",
    [TransformationInput.EULER]: "Euler",
    [TransformationInput.AXIS_ANGLE]: "Axis Angle"
})

export const StyledCopyPasteDiv = styled(StyledTile)`
    height: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;

    .inner {
        padding: 10px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .textarea {
            flex-grow: 1;

            textarea {
                font-family: monospace !important;
                font-size: 12px;
                height: 100%;
            }
        }
    }
`
