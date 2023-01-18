import * as React from "react"
import { useTileContext } from "./TileContextProvider"
import { Radio } from "antd"
import { DockToolbarButtonGroup } from "./DockToolbar"
import { GlowbuzzerIcon } from "./GlowbuzzerIcon"
import { AngularUnits } from "../types"

const DegreesIcon = () => {
    return (
        <svg viewBox="0 0 202.133 202.133">
            <path
                d="M181.154,26.653c-11.568,0-20.979,9.411-20.979,20.979s9.411,20.979,20.979,20.979c11.567,0,20.979-9.411,20.979-20.979
		S192.722,26.653,181.154,26.653z M181.154,54.611c-3.849,0-6.979-3.131-6.979-6.979s3.131-6.979,6.979-6.979
		c3.848,0,6.979,3.131,6.979,6.979S185.002,54.611,181.154,54.611z"
            />
            <path
                d="M116.027,26.653c-19.276,0-34.958,15.682-34.958,34.958v55.917c0,19.276,15.682,34.958,34.958,34.958
		s34.959-15.682,34.959-34.958V61.611C150.986,42.335,135.304,26.653,116.027,26.653z M136.986,117.528
		c0,11.556-9.402,20.958-20.959,20.958s-20.958-9.402-20.958-20.958V61.611c0-11.556,9.401-20.958,20.958-20.958
		s20.959,9.402,20.959,20.958V117.528z"
            />
            <path
                d="M19,96.569h36.917v48.917c0,3.866,3.134,7,7,7s7-3.134,7-7V45.653c0-10.477-8.523-19-19-19H19c-10.477,0-19,8.523-19,19
		v31.917C0,88.046,8.523,96.569,19,96.569z M14,45.653c0-2.757,2.243-5,5-5h31.917c2.757,0,5,2.243,5,5v36.917H19
		c-2.757,0-5-2.243-5-5V45.653z"
            />
            {/*
            <path d="M142.671,161.48H9.315c-3.866,0-7,3.134-7,7s3.134,7,7,7h133.355c3.866,0,7-3.134,7-7S146.537,161.48,142.671,161.48z" />
*/}
        </svg>
    )
}

const RadiansIcon = () => {
    return (
        <svg viewBox="0 0 24 24">
            <path
                d="M7 8H17"
                stroke="#292929"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9 8L9 16"
                stroke="#292929"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M15 8L15 14.03C15 15.118 15.882 16 16.97 16L17 16"
                stroke="#292929"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/*
            <defs>
                <clipPath id="clip0_429_10977">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
*/}
        </svg>
    )
}

export const ToolbarRadioAngularUnits = () => {
    const { angularUnits, setAngularUnits } = useTileContext()

    function update_units(e) {
        setAngularUnits(e.target.value)
    }

    return (
        <DockToolbarButtonGroup>
            <GlowbuzzerIcon
                Icon={DegreesIcon}
                button
                checked={angularUnits === AngularUnits.DEG}
                onClick={() => setAngularUnits(AngularUnits.DEG)}
                title="Use Degrees"
            />
            <GlowbuzzerIcon
                Icon={RadiansIcon}
                button
                checked={angularUnits === AngularUnits.RAD}
                onClick={() => setAngularUnits(AngularUnits.RAD)}
                title="Use Radians"
            />
            {/*
            <Radio.Group size="small" onChange={update_units} value={angularUnits}>
                <Radio.Button value="deg">deg</Radio.Button>
                <Radio.Button value="rad">rad</Radio.Button>
            </Radio.Group>
*/}
        </DockToolbarButtonGroup>
    )
}
