/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useMemo, useEffect, useRef } from "react"
// import { LinkTypeEnum, UnitsEnum } from "./types"
import * as NMATH from "../ik/NMATH"
import { useKinViz } from "../KinVizProvider"
import { Slider } from "antd"
import { StyledTile } from "./styles"
import { TileContextProvider, useTileContext } from "../../util/TileContextProvider"
import { AngularUnits, DhType, ExtentValues, LinearUnits } from "../../types"
import { DockToolbar } from "../../util/DockToolbar"
import { ToolbarRadioAngularUnits } from "../../util/ToolbarRadioAngularUnits"
import { ToolbarButtonsPrecision } from "../../util/ToolbarButtonsPrecision"
import { ToolbarSelectLinearUnits } from "../../util/ToolbarSelectLinearUnits"
import { ToolbarSelectDhFormat } from "../../util/ToolbarSelectDhFormat"
import KinVizGenericSerial from "./KinVizGenericSerial"

const APP_KEY = "kinviz"

const JointSliders = () => {
    const { dataSource, setDataSource, robotInScene, setRobotInScene } = useKinViz()

    const test: KinVizGenericSerial = new KinVizGenericSerial(["a", "b", "c"])

    function getSliderLinearStep(
        linearUnits: NMATH.LinearUnits,
        positiveLimit: number,
        negativeLimit: number
    ): number {
        switch (linearUnits) {
            case NMATH.LinearUnits.UNITS_MM: {
                return 1
            }
            case NMATH.LinearUnits.UNITS_M: {
                return 0.001
            }
            case NMATH.LinearUnits.UNITS_CM: {
                return 0.1
            }
            case NMATH.LinearUnits.UNITS_IN: {
                return 0.0393701
            }
            default: {
                return 1
            }
        }
    }

    function getSliderAngularRange(angularUnits: NMATH.AngularUnits, limit: number): number {
        switch (angularUnits) {
            case NMATH.AngularUnits.UNITS_DEG: {
                return Math.round(limit / 1) * 1
            }
            case NMATH.AngularUnits.UNITS_RAD: {
                // return 0.0174533
                return Math.round(limit / 0.02) * 0.02
            }
            default: {
                return 1
            }
        }
    }

    function getSliderLinearRange(linearUnits: NMATH.LinearUnits, limit: number): number {
        switch (linearUnits) {
            case NMATH.LinearUnits.UNITS_MM: {
                return Math.round(limit / 1) * 1
            }
            case NMATH.LinearUnits.UNITS_M: {
                return Math.round(limit / 0.001) * 0.001
            }
            case NMATH.LinearUnits.UNITS_CM: {
                return Math.round(limit / 0.1) * 0.1
            }
            case NMATH.LinearUnits.UNITS_IN: {
                return Math.round(limit / 0.04) * 0.04
            }
            default: {
                return 1
            }
        }
    }

    function getSliderAngularStep(
        angularUnits: NMATH.AngularUnits,
        positiveLimit: number,
        negativeLimit: number
    ): number {
        switch (angularUnits) {
            case NMATH.AngularUnits.UNITS_DEG: {
                return 1
            }
            case NMATH.AngularUnits.UNITS_RAD: {
                // return 0.0174533
                return 0.02
            }
            default: {
                return 1
            }
        }
    }

    const onChangeSlider = (newValue: number, selectId) => {
        const newData = [...dataSource]

        const item: NMATH.KinematicsLink = newData[selectId]

        const itemDhParams: NMATH.DhParams = item.params as NMATH.DhParams

        switch (item.quantity) {
            case NMATH.LinkQuantities.QUANTITY_ANGLE: {
                itemDhParams.theta = newValue
                break
            }
            case NMATH.LinkQuantities.QUANTITY_LENGTH: {
                itemDhParams.d = newValue

                break
            }
            case NMATH.LinkQuantities.QUANTITY_NONE: {
                //fixed can't vary
                break
            }
            default: {
                throw new Error("ControlTile: Unknown quantity")
            }
        }

        setDataSource(newData)
    }

    const NoLimitsErrorMessage = ({ positiveLimit, negativeLimit }) => {
        if (positiveLimit == 0 && negativeLimit == 0) {
            return (
                <div style={{ color: "red" }}>
                    <p>The joint can't be varied as no miniumum or maxium travel is set</p>
                </div>
            )
        }
    }

    return (
        <>
            {dataSource.map((row, index) => {
                if (row.quantity == NMATH.LinkQuantities.QUANTITY_ANGLE)
                    return (
                        <div key={index}>
                            Joint {index} is revolute, &theta; is varied
                            <Slider
                                // id={index}
                                min={getSliderAngularRange(
                                    row.angularUnits,
                                    (row.params as NMATH.DhParams).negativeLimit
                                )}
                                value={(row.params as NMATH.DhParams).theta}
                                max={getSliderAngularRange(
                                    row.angularUnits,
                                    (row.params as NMATH.DhParams).positiveLimit
                                )}
                                onChange={value => onChangeSlider(value, index)}
                                step={getSliderAngularStep(
                                    row.angularUnits,
                                    (row.params as NMATH.DhParams).positiveLimit,
                                    (row.params as NMATH.DhParams).negativeLimit
                                )}
                            />
                            <NoLimitsErrorMessage
                                positiveLimit={(row.params as NMATH.DhParams).positiveLimit}
                                negativeLimit={(row.params as NMATH.DhParams).negativeLimit}
                            />
                        </div>
                    )
                if (row.quantity == NMATH.LinkQuantities.QUANTITY_LENGTH)
                    return (
                        <div key={index}>
                            Joint {index} is prismatic, d is varied
                            <Slider
                                min={getSliderLinearRange(
                                    row.linearUnits,
                                    (row.params as NMATH.DhParams).negativeLimit
                                )}
                                value={(row.params as NMATH.DhParams).d}
                                max={getSliderLinearRange(
                                    row.linearUnits,
                                    (row.params as NMATH.DhParams).positiveLimit
                                )}
                                onChange={value => onChangeSlider(value, index)}
                                step={getSliderLinearStep(
                                    row.linearUnits,
                                    (row.params as NMATH.DhParams).positiveLimit,
                                    (row.params as NMATH.DhParams).negativeLimit
                                )}
                            />
                            <NoLimitsErrorMessage
                                positiveLimit={(row.params as NMATH.DhParams).positiveLimit}
                                negativeLimit={(row.params as NMATH.DhParams).negativeLimit}
                            />
                        </div>
                    )
                if (row.quantity == NMATH.LinkQuantities.QUANTITY_NONE)
                    return (
                        <div key={index}>
                            Joint {index} is fixed, neither d nor &theta; can be varied
                        </div>
                    )
            })}
        </>
    )
}

export const ControlsTile = () => {
    const { angularUnits, precision, linearUnits, setLinearUnits, setAngularUnits } =
        useTileContext()

    const { dataSource, setDataSource } = useKinViz()

    useEffect(() => {
        if (dataSource[0].linearUnits == NMATH.LinearUnits.UNITS_IN) {
            setLinearUnits(LinearUnits.IN)
        } else if (dataSource[0].linearUnits == NMATH.LinearUnits.UNITS_MM) {
            setLinearUnits(LinearUnits.MM)
        } else if (dataSource[0].linearUnits == NMATH.LinearUnits.UNITS_CM) {
            setLinearUnits(LinearUnits.CM)
        } else if (dataSource[0].linearUnits == NMATH.LinearUnits.UNITS_M) {
            setLinearUnits(LinearUnits.M)
        }

        if (dataSource[0].angularUnits == NMATH.AngularUnits.UNITS_DEG) {
            setAngularUnits(AngularUnits.DEG)
        } else if (dataSource[0].angularUnits == NMATH.AngularUnits.UNITS_RAD) {
            setAngularUnits(AngularUnits.RAD)
        }
    }, [dataSource])

    return (
        <>
            <DockToolbar>
                <ToolbarSelectLinearUnits disabled={true} />
                <ToolbarRadioAngularUnits disabled={true} />
            </DockToolbar>
            <StyledTile>
                <JointSliders />
            </StyledTile>
        </>
    )
}
