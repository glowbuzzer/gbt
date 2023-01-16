import React, { createContext, FC, useContext, useEffect, useMemo, useState } from "react"
import { Euler, Matrix3, Matrix4, Quaternion, Vector3 } from "three"

export enum TransformationInput {
    NONE,
    EULER,
    QUATERNION,
    MATRIX3,
    VECTOR3,
    MATRIX4
}

type TransformationValues = {
    input: TransformationInput
    matrix4: Matrix4
    euler: Euler // we need to maintain the Euler separately from the Matrix4, because the Matrix4 can't represent all Euler orders
}

type TransformationContextType = TransformationValues & {
    quaternion: Quaternion
    matrix3: Matrix3
    translation: Vector3
    setEuler: (euler: Euler) => void
    setQuaternion: (quaternion: Quaternion) => void
    setMatrix3: (matrix3: Matrix3) => void
    setTranslation: (translation: Vector3) => void
    setMatrix4: (matrix4: Matrix4) => void
}

const transformationContext = createContext<TransformationContextType | null>(null)

export const TransformationProvider: FC<{ children }> = ({ children }) => {
    // TODO: put this in local storage (but issue with THREE instance serialization)
    const [value, setValue] = useState<TransformationValues>({
        input: TransformationInput.NONE,
        matrix4: new Matrix4(),
        euler: new Euler()
    })

    useEffect(() => {
        function paste(event: ClipboardEvent) {
            console.log("PASTE", event)
        }

        document.addEventListener("paste", paste)
        return () => document.removeEventListener("paste", paste)
    }, [])

    function set_rotation(quaternion: Quaternion, euler: Euler, type: TransformationInput) {
        const current = value.matrix4 as Matrix4

        // decompose
        const q = new Quaternion()
        const v = new Vector3()
        const s = new Vector3()
        current.decompose(v, q, s)

        // compose and set
        const matrix4 = new Matrix4().compose(v, quaternion, s)
        setValue({ input: type, matrix4, euler })
    }

    const context: TransformationContextType = {
        input: value.input,
        matrix4: value.matrix4,
        euler: value.euler,
        get quaternion() {
            return useMemo(
                () => new Quaternion().setFromRotationMatrix(value.matrix4),
                [value.matrix4]
            )
        },
        get matrix3() {
            return useMemo(() => new Matrix3().setFromMatrix4(value.matrix4), [value.matrix4])
        },
        get translation() {
            return useMemo(
                () => new Vector3().setFromMatrixPosition(value.matrix4),
                [value.matrix4]
            )
        },
        setEuler: (euler: Euler) => {
            set_rotation(new Quaternion().setFromEuler(euler), euler, TransformationInput.EULER)
        },
        setQuaternion: (quaternion: Quaternion) => {
            set_rotation(
                quaternion,
                new Euler().setFromQuaternion(quaternion, value.euler.order),
                TransformationInput.QUATERNION
            )
        },
        setMatrix3: (matrix3: Matrix3) => {
            const matrix4 = new Matrix4().copy(value.matrix4).setFromMatrix3(matrix3)
            setValue({
                input: TransformationInput.MATRIX3,
                matrix4,
                euler: new Euler().setFromRotationMatrix(matrix4, value.euler.order)
            })
        },
        setTranslation: (translation: Vector3) => {
            const matrix4 = new Matrix4().copy(value.matrix4)
            matrix4.setPosition(translation)
            setValue({ input: TransformationInput.VECTOR3, matrix4, euler: value.euler })
        },
        setMatrix4: (matrix4: Matrix4) => {
            setValue({
                input: TransformationInput.MATRIX4,
                matrix4,
                euler: new Euler().setFromRotationMatrix(matrix4, value.euler.order)
            })
        }
    }

    return (
        <transformationContext.Provider value={context}>{children}</transformationContext.Provider>
    )
}

export const useTransformation = () => {
    const context: TransformationContextType = useContext(transformationContext)
    if (context === undefined) {
        throw new Error("useRotations must be used within a RotationsProvider")
    }
    return context
}
