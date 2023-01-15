import * as React from "react"
import { createContext, FC } from "react"
import styled from "styled-components"
import { useLocalStorage } from "./LocalStorageHook"
import { AngularUnits, LinearUnits } from "../types"

type TileContextType = {
    angularUnits: AngularUnits
    linearUnits: LinearUnits
    precision: number
    setPrecision: (precision: number) => void
    setLinearUnits: (units: LinearUnits) => void
    setAngularUnits: (units: AngularUnits) => void
    toLocalAngularUnits: (value: number) => number
    toStandardAngularUnits: (value: number) => number
    toLocalLinearUnits: (value: number) => number
    toStandardLinearUnits: (value: number) => number
}

export const tileContext = createContext<TileContextType>()

const StyledDiv = styled.div`
    .ant-radio-button-checked {
        background: rgba(0, 0, 0, 0.05);
    }
`

type TiledContextProviderProps = {
    children: React.ReactNode
    appKey: string
    tileKey: string
}

export const TileContextProvider: FC<TiledContextProviderProps> = ({
    appKey,
    tileKey,
    children
}: TiledContextProviderProps) => {
    function make_key(key) {
        return `${appKey}-${tileKey}-${key}`
    }

    const [linearUnits, setLinearUnits] = useLocalStorage<LinearUnits>(
        make_key("linearUnits"),
        LinearUnits.M
    )
    const [angularUnits, setAngularUnits] = useLocalStorage<AngularUnits>(
        make_key("angularUnits"),
        AngularUnits.DEG
    )
    const [precision, setPrecision] = useLocalStorage(make_key("precision"), 2)

    const context: TileContextType = {
        linearUnits,
        angularUnits,
        precision,
        setPrecision,
        setLinearUnits,
        setAngularUnits,
        toLocalAngularUnits(value: number) {
            if (angularUnits === "deg") {
                return (value * 180) / Math.PI
            }
            return value
        },
        toStandardAngularUnits(value: number) {
            if (angularUnits === "deg") {
                return (value * Math.PI) / 180
            }
            return value
        },
        toLocalLinearUnits(value: number) {
            if (linearUnits === "m") {
                return value * 1000
            } else if (linearUnits === "cm") {
                return value * 10
            } else if (linearUnits === "in") {
                return value * 25.4
            }
            return value
        },
        toStandardLinearUnits(value: number) {
            if (linearUnits === "m") {
                return value / 1000
            } else if (linearUnits === "cm") {
                return value / 10
            } else if (linearUnits === "in") {
                return value / 25.4
            }
            return value
        }
    }

    return (
        <StyledDiv>
            <tileContext.Provider value={context}>{children}</tileContext.Provider>
        </StyledDiv>
    )
}

export function useTileContext() {
    const context: TileContextType = React.useContext(tileContext)
    if (context === undefined) {
        throw new Error("useTileContext must be used within a TileContextProvider")
    }
    return context
}
