import { Euler, Matrix3, Matrix4, Quaternion, Vector3 } from "three"
import { CopyPasteFormat } from "./tiles/util"
import { TransformationInput } from "./TransformationProvider"
import { AngularUnits } from "../types"

export function export_matrix4(
    matrix4: Matrix4,
    format: CopyPasteFormat,
    type: TransformationInput,
    precision: number,
    angularUnits: AngularUnits
): any {
    const fixed = value => (isNaN(Number(value)) ? value : value.toFixed(precision))
    const arr = (o: Matrix4 | Matrix3 | Quaternion | Euler | Vector3) => o.toArray().map(fixed)
    const units = value =>
        isNaN(Number(value)) || angularUnits === AngularUnits.RAD ? value : value * (180 / Math.PI)

    const matrix4_arr = arr(matrix4)

    const matrix3 = new Matrix3().setFromMatrix4(matrix4)
    const matrix3_arr = arr(matrix3)

    const quaternion = new Quaternion().setFromRotationMatrix(matrix4)
    const quaternion_arr = arr(quaternion)
    const [qx, qy, qz, w] = quaternion_arr

    const euler = new Euler().setFromQuaternion(quaternion)
    const euler_arr = euler.toArray().map(units).map(fixed)
    const [ex, ey, ez, order] = euler_arr

    const vector3 = new Vector3().setFromMatrixPosition(matrix4)
    const vector3_arr = arr(vector3)
    const [vx, vy, vz] = vector3_arr

    const conversions = [
        ///// Matrix4
        // prettier-ignore
        [CopyPasteFormat.CSV, TransformationInput.MATRIX4, () => matrix4_arr.join(",")],
        // prettier-ignore
        [CopyPasteFormat.JSON_ARRAY, TransformationInput.MATRIX4, () => JSON.stringify(matrix4_arr, null, 2)],
        // prettier-ignore
        [CopyPasteFormat.JSON_OBJECT, TransformationInput.MATRIX4, () => JSON.stringify(matrix4_arr, null, 2)],
        // prettier-ignore
        [CopyPasteFormat.THREEJS_OBJECT, TransformationInput.MATRIX4, () => `new Matrix4(${JSON.stringify(matrix4_arr)})`],
        // prettier-ignore
        [CopyPasteFormat.THREEJS_INTERNAL, TransformationInput.MATRIX4, () => JSON.stringify(matrix4, null, 2)],

        ///// Matrix3
        // prettier-ignore
        [CopyPasteFormat.CSV, TransformationInput.MATRIX3, () => matrix3_arr.join(",")],
        // prettier-ignore
        [CopyPasteFormat.JSON_ARRAY, TransformationInput.MATRIX3, () => JSON.stringify(matrix3_arr, null, 2)],
        // prettier-ignore
        [CopyPasteFormat.JSON_OBJECT, TransformationInput.MATRIX3, () => JSON.stringify(matrix3_arr, null, 2)],
        // prettier-ignore
        [CopyPasteFormat.THREEJS_OBJECT, TransformationInput.MATRIX3, () => `new Matrix3(${JSON.stringify(matrix3_arr)})`],
        // prettier-ignore
        [CopyPasteFormat.THREEJS_INTERNAL, TransformationInput.MATRIX3, () => JSON.stringify(matrix3, null, 2)],

        ///// Quaternion
        // prettier-ignore
        [CopyPasteFormat.CSV, TransformationInput.QUATERNION, () => quaternion_arr.join(",")],
        // prettier-ignore
        [CopyPasteFormat.JSON_ARRAY, TransformationInput.QUATERNION, () => JSON.stringify(quaternion_arr, null, 2)],
        // prettier-ignore
        [CopyPasteFormat.JSON_OBJECT, TransformationInput.QUATERNION, () => JSON.stringify({
            x: qx,
            y: qy,
            z: qz,
            w: w
        }, null, 2)],
        // prettier-ignore
        [CopyPasteFormat.THREEJS_OBJECT, TransformationInput.QUATERNION, () => `new Quaternion(${qx}, ${qy}, ${qz}, ${w})`],
        // prettier-ignore
        [CopyPasteFormat.THREEJS_INTERNAL, TransformationInput.QUATERNION, () => JSON.stringify(quaternion, null, 2)],

        ///// Euler
        // prettier-ignore
        [CopyPasteFormat.CSV, TransformationInput.EULER, () => euler_arr.join(",")],
        // prettier-ignore
        [CopyPasteFormat.JSON_ARRAY, TransformationInput.EULER, () => JSON.stringify(euler_arr, null, 2)],
        // prettier-ignore
        [CopyPasteFormat.JSON_OBJECT, TransformationInput.EULER, () => JSON.stringify({
            x: ex,
            y: ey,
            z: ez,
            order
        }, null, 2)],
        // prettier-ignore
        [CopyPasteFormat.THREEJS_OBJECT, TransformationInput.EULER, () => `new Euler(${ex}, ${ey}, ${ez}, "${order}")`],
        // prettier-ignore
        [CopyPasteFormat.THREEJS_INTERNAL, TransformationInput.EULER, () => JSON.stringify(euler, null, 2)],

        ///// Vector3
        // prettier-ignore
        [CopyPasteFormat.CSV, TransformationInput.VECTOR3, () => vector3_arr.join(",")],
        // prettier-ignore
        [CopyPasteFormat.JSON_ARRAY, TransformationInput.VECTOR3, () => JSON.stringify(vector3_arr, null, 2)],
        // prettier-ignore
        [CopyPasteFormat.JSON_OBJECT, TransformationInput.VECTOR3, () => JSON.stringify({
            x: vx,
            y: vy,
            z: vz
        }, null, 2)],
        // prettier-ignore
        [CopyPasteFormat.THREEJS_OBJECT, TransformationInput.VECTOR3, () => `new Vector3(${vx}, ${vy}, ${vz})`],
        // prettier-ignore
        [CopyPasteFormat.THREEJS_INTERNAL, TransformationInput.VECTOR3, () => JSON.stringify(vector3, null, 2)]
    ]

    const conversion = conversions.find(([f, t]) => f === format && t === type)
    if (conversion) {
        const [, , fn] = conversion
        return (fn as Function)()
    }
}
