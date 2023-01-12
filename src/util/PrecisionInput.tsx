import React, { useEffect, useRef, WheelEvent } from "react"
import { InputNumber } from "antd"

/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

type PrecisionInputProps = {
    value: number
    onChange: (value: number) => void
    precision: number
}
export const PrecisionInput = ({ value, onChange, precision }: PrecisionInputProps) => {
    const [valueString, setValueStringInternal] = React.useState(value.toFixed(precision))
    const valueRef = useRef(value) // initial value

    useEffect(() => {
        if (valueRef.current !== value) {
            valueRef.current = value
            setValueStringInternal(value.toFixed(precision))
        }
    }, [value])

    useEffect(() => {
        if (isNaN(valueString)) {
            // don't apply precision change if mid-edit
            return
        }
        if (valueRef.current === value) {
            setValueStringInternal(value.toFixed(precision))
        } else {
            const new_value = Number(valueString)
            setValueStringInternal(new_value.toFixed(precision))
            valueRef.current = new_value
        }
    }, [precision])

    function update_value(v) {
        setValueStringInternal(v)
        if (!isNaN(v)) {
            onChange(Number(v))
        }
    }

    function handle_wheel(e: WheelEvent<HTMLInputElement>) {
        if (isNaN(valueString)) {
            // don't try to update if mid-edit
            return
        }
        const new_value = Number(valueString) - Math.sign(e.deltaY) / Math.pow(10, precision)
        update_value(new_value.toFixed(precision))
    }

    return (
        <InputNumber
            value={valueString}
            size="small"
            step={1 / Math.pow(10, precision)}
            onWheel={handle_wheel}
            onChange={update_value}
        />
    )
}
