import { Euler, Matrix3, Matrix4, Quaternion, Vector3 } from "three"
import { CopyPasteFormat } from "./tiles/util"
import { TransformationInput } from "./TransformationProvider"
import { AngularUnits } from "../types"
import { quaternion_to_axis_angle } from "./math"

export function export_matrix4(
    matrix4: Matrix4,
    format: CopyPasteFormat,
    type: TransformationInput,
    precision: number,
    angularUnits: AngularUnits
): any {
    const fixed = value => (isNaN(Number(value)) ? value : value.toFixed(precision))
    const arr = (o: Matrix4 | Matrix3 | Quaternion | Euler | Vector3) => {
        if (o["isMatrix4"] || o["isMatrix3"]) {
            // transpose to row major for export
            return (o.clone() as Matrix3 | Matrix4).transpose().toArray().map(fixed)
        }
        return o.toArray().map(fixed)
    }
    const units = value =>
        isNaN(Number(value)) || angularUnits === AngularUnits.RAD ? value : value * (180 / Math.PI)

    const matrix4_arr = arr(matrix4).map(Number)

    const matrix3 = new Matrix3().setFromMatrix4(matrix4)
    const matrix3_arr = arr(matrix3).map(Number)

    const quaternion = new Quaternion().setFromRotationMatrix(matrix4)
    const quaternion_arr = arr(quaternion).map(Number)
    const [qx, qy, qz, w] = quaternion_arr

    const euler = new Euler().setFromQuaternion(quaternion)
    const euler_arr = euler.toArray().map(units).map(fixed).map(Number)
    const [ex, ey, ez, order] = euler_arr

    const vector3 = new Vector3().setFromMatrixPosition(matrix4)
    const vector3_arr = arr(vector3).map(Number)
    const [vx, vy, vz] = vector3_arr

    const axis_angle = quaternion_to_axis_angle(quaternion, units)
    const axis_angle_arr = axis_angle.map(fixed).map(Number)
    const [ax, ay, az, angle] = axis_angle_arr

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
        [CopyPasteFormat.THREEJS_INTERNAL, TransformationInput.VECTOR3, () => JSON.stringify(vector3, null, 2)],

        ///// Axis Angle
        // prettier-ignore
        [CopyPasteFormat.CSV, TransformationInput.AXIS_ANGLE, () => axis_angle_arr.join(",")],
        // prettier-ignore
        [CopyPasteFormat.JSON_ARRAY, TransformationInput.AXIS_ANGLE, () => JSON.stringify(axis_angle, null, 2)],
        // prettier-ignore
        [CopyPasteFormat.JSON_OBJECT, TransformationInput.AXIS_ANGLE, () => JSON.stringify({
            x: ax,
            y: ay,
            z: az,
            angle
        }, null, 2)],
        // prettier-ignore
        [CopyPasteFormat.THREEJS_OBJECT, TransformationInput.AXIS_ANGLE, () => `No equivalent in Three.js`],
        // prettier-ignore
        [CopyPasteFormat.THREEJS_INTERNAL, TransformationInput.AXIS_ANGLE, () => `No equivalent in Three.js`]
    ]

    const conversion = conversions.find(([f, t]) => f === format && t === type)
    if (conversion) {
        const [, , fn] = conversion
        return (fn as Function)()
    }
}
