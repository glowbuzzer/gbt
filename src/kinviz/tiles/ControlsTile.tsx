/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { LinkTypeEnum, UnitsEnum } from "./types"
import { useKinViz } from "../KinVizProvider"
import { Button, Form, InputNumber, Popconfirm, Select, Slider, Table, Tooltip } from "antd"
import { StyledTile } from "./styles"

export const ControlsTile = () => {
    const {
        dataSource,
        setDataSource,
        activeDhMatrixType,
        setActiveDhMatrixType,
        robotPos,
        setRobotPos,
        robotRotE,
        setRobotRotE,
        extents,
        setExtents
    } = useKinViz()

    const onChangeSlider = (newValue: number, selectId) => {
        const newData = [...dataSource]

        const item = newData[selectId]
        // console.log("item", item);
        switch (item.jointType) {
            case 0: {
                item.theta = newValue

                break
            }
            case 1: {
                item.d = newValue

                break
            }
            case 2: {
                //fixed can't vary
                break
            }
        }

        newData.splice(selectId, 1, {
            ...item
        })
        setDataSource(newData)
    }

    return (
        <StyledTile>
            {dataSource.map((row, index) => {
                if (row.jointType == LinkTypeEnum.REVOLUTE)
                    return (
                        <div key={index}>
                            Joint {index} is revolute, &theta; is varied
                            <Slider
                                // id={index}
                                min={row.min}
                                value={row.theta}
                                max={row.max}
                                onChange={value => onChangeSlider(value, index)}
                            />
                        </div>
                    )
                if (row.jointType == LinkTypeEnum.PRISMATIC)
                    return (
                        <div key={index}>
                            Joint {index} is prismatic, d is varied
                            <Slider
                                min={row.min}
                                value={row.d}
                                max={row.max}
                                onChange={value => onChangeSlider(value, index)}
                                step={units == UnitsEnum.UNITS_MM ? 1 : 0.01}
                            />
                        </div>
                    )
                if (row.jointType == LinkTypeEnum.FIXED)
                    return (
                        <div key={index}>
                            Joint {index} is fixed, neither d nor &theta; can be varied
                        </div>
                    )
            })}
        </StyledTile>
    )
}
