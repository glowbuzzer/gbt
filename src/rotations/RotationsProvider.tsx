import React, { createContext, FC, useContext, useEffect, useState } from "react"
import { Euler, Quaternion } from "three"

export enum RotationInput {
    NONE,
    EULER,
    QUATERNION
}

type RotationValues = {
    input: RotationInput
    euler: Euler
    quaternion: Quaternion
}

type RotationsContextType = {
    input: RotationInput
    euler: Euler
    quaternion: Quaternion
    setEuler: (euler: Euler) => void
    setQuaternion: (quaternion: Quaternion) => void
}

const rotationsContext = createContext<RotationsContextType | null>(null)

export const RotationsProvider: FC<{ children }> = ({ children }) => {
    const [value, setValue] = useState<RotationValues>({
        input: RotationInput.NONE,
        euler: new Euler(0, 0, 0, "XYZ"),
        quaternion: new Quaternion(0, 0, 0, 1)
    })

    useEffect(() => {
        function paste(event: ClipboardEvent) {
            console.log("PASTE", event)
        }
        document.addEventListener("paste", paste)
        return () => document.removeEventListener("paste", paste)
    }, [])

    const conversions: [RotationInput, (value: any) => any][] = [
        [RotationInput.EULER, euler => ({ euler })],
        [
            RotationInput.EULER,
            (euler: Euler) => ({ quaternion: new Quaternion().setFromEuler(euler) })
        ],
        [RotationInput.QUATERNION, quaternion => ({ quaternion })],
        [
            RotationInput.QUATERNION,
            (quaternion: Quaternion) => ({ euler: new Euler().setFromQuaternion(quaternion) })
        ]
    ]

    function set(value, type: RotationInput) {
        const update = conversions.reduce((acc, [from, fn]) => {
            if (from === type) {
                return { ...acc, ...fn(value) }
            }
            return acc
        }, {})

        setValue({
            input: type,
            ...update
        })
    }

    const context: RotationsContextType = {
        input: value.input,
        euler: value.euler,
        quaternion: value.quaternion,
        setEuler: (euler: Euler) => {
            set(euler, RotationInput.EULER)
        },
        setQuaternion: (quaternion: Quaternion) => {
            set(quaternion, RotationInput.QUATERNION)
        }
    }

    return <rotationsContext.Provider value={context}>{children}</rotationsContext.Provider>
}

export const useRotations = () => {
    const context: RotationsContextType = useContext(rotationsContext)
    if (context === undefined) {
        throw new Error("useRotations must be used within a RotationsProvider")
    }
    return context
}
