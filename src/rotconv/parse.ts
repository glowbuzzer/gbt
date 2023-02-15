import { Euler, Matrix3, Matrix4, Quaternion, Vector3 } from "three"
import { TransformationInput } from "./TransformationProvider"
import { CopyPasteFormat } from "./tiles/util"
import { AngularUnits } from "../types"

const three_specifiers = ["isQuaternion", "isVector3", "isMatrix3", "isMatrix4", "isEuler"]

export type ConversionsType = Partial<Record<TransformationInput, () => Matrix4>>

function object_to_conversions(value: any, angularUnits: AngularUnits): ConversionsType {
    // simple heuristic to try to determine the type of the object
    if (value.w) {
        // quaternion
        return {
            [TransformationInput.QUATERNION]: () =>
                new Matrix4().makeRotationFromQuaternion(
                    new Quaternion(value.x, value.y, value.z, value.w)
                )
        }
    }

    if (value.elements) {
        // matrix3 or matrix4
        if (value.elements.length === 9) {
            return {
                [TransformationInput.MATRIX3]: () =>
                    new Matrix4().setFromMatrix3(new Matrix3().fromArray(value.elements))
            }
        }
        if (value.elements.length === 16) {
            return {
                [TransformationInput.MATRIX4]: () => new Matrix4().fromArray(value.elements)
            }
        }
    }

    if (value.x) {
        // euler or vector3
        function rads(value: number): number {
            return angularUnits === AngularUnits.RAD ? value : value * (Math.PI / 180)
        }

        return {
            [TransformationInput.EULER]: () =>
                new Matrix4().makeRotationFromEuler(
                    new Euler(rads(value.x), rads(value.y), rads(value.z), "XYZ")
                ),
            [TransformationInput.VECTOR3]: () =>
                new Matrix4().makeTranslation(value.x, value.y, value.z)
        }
    }
    // we're run out of ideas
    return { [TransformationInput.NONE]: () => new Matrix4() }
}

function array_to_conversions(value: number[], angularUnits: AngularUnits): ConversionsType {
    function rads(value: number): number {
        return angularUnits === AngularUnits.RAD ? value : value * (Math.PI / 180)
    }

    switch (value.length) {
        case 3:
            return {
                [TransformationInput.EULER]: () =>
                    new Matrix4().makeRotationFromEuler(
                        new Euler(rads(value[0]), rads(value[1]), rads(value[2]), "XYZ")
                    ),
                [TransformationInput.VECTOR3]: () =>
                    new Matrix4().makeTranslation(value[0], value[1], value[2])
            }
        case 4:
            return {
                [TransformationInput.QUATERNION]: () =>
                    new Matrix4().makeRotationFromQuaternion(
                        new Quaternion(value[0], value[1], value[2], value[3])
                    ),
                [TransformationInput.AXIS_ANGLE]: () => {
                    const q = new Quaternion().setFromAxisAngle(
                        new Vector3(value[0], value[1], value[2]),
                        rads(value[3])
                    )
                    return new Matrix4().makeRotationFromQuaternion(q)
                }
            }
        case 9:
            return {
                [TransformationInput.MATRIX3]: () =>
                    new Matrix4().setFromMatrix3(new Matrix3().fromArray(value).transpose())
            }
        case 16:
            return {
                [TransformationInput.MATRIX4]: () => new Matrix4().fromArray(value).transpose()
            }
        default:
            return { [TransformationInput.NONE]: () => new Matrix4() }
    }
}

function three_to_conversions(value: any): ConversionsType {
    if (value.isEuler) {
        return {
            [TransformationInput.EULER]: () => new Matrix4().makeRotationFromEuler(value)
        }
    }
    if (value.isQuaternion) {
        return {
            [TransformationInput.QUATERNION]: () => new Matrix4().makeRotationFromQuaternion(value)
        }
    }
    if (value.isVector3) {
        return {
            [TransformationInput.VECTOR3]: () =>
                new Matrix4().makeTranslation(value.x, value.y, value.z)
        }
    }
    if (value.isMatrix3) {
        return {
            [TransformationInput.MATRIX3]: () => new Matrix4().setFromMatrix3(value)
        }
    }
    if (value.isMatrix4) {
        return {
            [TransformationInput.MATRIX4]: () => new Matrix4().copy(value)
        }
    }
    return { [TransformationInput.NONE]: () => new Matrix4() }
}

export function parse(
    value: string,
    angularUnits: AngularUnits
): {
    format: CopyPasteFormat
    conversions: ConversionsType
} {
    // try to parse as json
    try {
        const json = JSON.parse(value)
        if (Array.isArray(json)) {
            const conversions = array_to_conversions(json, angularUnits)
            return { format: CopyPasteFormat.JSON_ARRAY, conversions }
        }
        if (typeof json === "object") {
            if (three_specifiers.some(specifier => specifier in json)) {
                const conversions = three_to_conversions(json)
                return { format: CopyPasteFormat.THREEJS_INTERNAL, conversions }
            }

            const conversions = object_to_conversions(json, angularUnits)
            return { format: CopyPasteFormat.JSON_OBJECT, conversions }
        }
    } catch (e) {
        // ignore
    }

    // try to parse as csv
    const csv = value.split(",").map(v => Number(v))
    if (csv.length > 1 && csv.every(v => !isNaN(v))) {
        const conversions = array_to_conversions(csv, angularUnits)
        return { format: CopyPasteFormat.CSV, conversions }
    }

    return {
        format: CopyPasteFormat.AUTO,
        conversions: { [TransformationInput.NONE]: () => new Matrix4() }
    }
}
