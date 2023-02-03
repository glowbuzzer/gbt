/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import styled from "styled-components"
import { PrecisionInput } from "../../../util/PrecisionInput"
// import { useRotations } from "../RotationsProvider"
import { Quaternion } from "three"
import { useEffect, useState, useRef, useContext, useCallback } from "react"
import { StyledTile } from "../styles"
import { DockToolbar, DockToolbarButtonGroup } from "../../../util/DockToolbar"
import { ReactComponent as CopyIcon } from "@material-symbols/svg-400/outlined/content_copy.svg"

import { ToolbarRadioAngularUnits } from "../../../util/ToolbarRadioAngularUnits"
import { ToolbarButtonsPrecision } from "../../../util/ToolbarButtonsPrecision"
import { ToolbarSelectLinearUnits } from "../../../util/ToolbarSelectLinearUnits"
import { TileContextProvider, useTileContext } from "../../../util/TileContextProvider"
import { LinearUnits } from "../../../types"

import { Button, Form, InputNumber, Popconfirm, Select, Slider, Table, Tooltip } from "antd"
import { HexColorPicker } from "react-colorful"

// import "antd/dist/antd.css"
import type { FormInstance } from "antd/es/form"
import niceColors from "nice-color-palettes"
import { sampleDhMatrices } from "./SampleDhMatrices"
import { DhMatrixTypeEnum, TableDataType } from "../types"
import * as THREE from "three"
import { useKinViz } from "../../KinVizProvider"

import * as NMATH from "../../ik/NMATH"
import { DhParams } from "../../ik/NMATH"

const StyledMenuItem = styled.div`
    padding: 0 0 4px 0;

    .title {
        font-size: 0.9em;
        color: rgba(0, 0, 0, 0.8);
    }

    .content {
        font-family: monospace;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.7);
        padding: 4px 8px;
        color: rgba(255, 255, 255, 0.7);
    }
`
const APP_KEY = "kinviz"

export const MatrixTile = () => {
    return (
        <TileContextProvider appKey={APP_KEY} tileKey={"matrix"}>
            <DockToolbar>
                <ToolbarRadioAngularUnits />
                <ToolbarButtonsPrecision />
                <ToolbarSelectLinearUnits />
            </DockToolbar>
            <StyledTile>
                <TableApp />
            </StyledTile>
            {/*    <div className="grid">*/}
            {/*        {cols.map(axis => (*/}
            {/*            <div className="label" key={axis}>*/}
            {/*                {axis.toUpperCase()}*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*        {cols.map((axis, index) => (*/}
            {/*            <div className="input" key={"t-" + axis}>*/}
            {/*                <PrecisionInput*/}
            {/*                    value={edited[index]}*/}
            {/*                    onChange={value => set(value, index)}*/}
            {/*                    precision={2}*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*        {cols.map((axis, index) => (*/}
            {/*            <div className="shadow" key={"s-" + axis}>*/}
            {/*                {shadow[index] ? shadow[index] : ""}*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*    <Button size="small" onClick={normalize}>*/}
            {/*        Normalize*/}
            {/*    </Button>*/}
            {/*</StyledTile>*/}
        </TileContextProvider>
    )
}

interface EditableCellProps {
    title: React.ReactNode
    editable: boolean
    children: React.ReactNode
    dataIndex: keyof Item
    record: Item
    handleSave: (record: Item) => void
    fieldType: number
}

//
// export interface DataType {
//     key: React.Key
//     alpha: number
//     theta: number
//     initialOffset: number
//     a: number
//     d: number
//     jointType: NMATH.LinkQuantities
//     min: number
//     max: number
//     color: string
// }

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>

interface Item {
    key: string
    alpha: number
    theta: number
    initialOffset: number
    a: number
    d: number
    quantity: number
    negativeLimit: number
    positiveLimit: number
    color: string
}

interface EditableRowProps {
    index: number
}

type EditableTableProps = Parameters<typeof Table>[0]

const LabelSpan = styled.span`
    padding-right: 20px;
`

const EditableContext = React.createContext<FormInstance<any> | null>(null)

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    )
}

const RenderEditCell = () => {
    // switch (fieldType) {
    //   case 0:
    // }
    // {fieldType == 0 ? (
    //     <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
    // ) : (
    //     <Select
    //         ref={inputRef}
    //         options={[
    //           { value: 0, label: "revolute" },
    //           { value: 1, label: "prismatic" },
    //         ]}
    //         onChange={save}
    //     />
    // )}
}

const RenderDisplayCell = ({ fieldType, children, quantity }) => {
    // console.log("fieldType", fieldType);
    switch (fieldType) {
        case 0: {
            return children
        }
        case 1: {
            if (quantity == NMATH.LinkQuantities.QUANTITY_ANGLE) {
                return "revolute"
            } else if (quantity == NMATH.LinkQuantities.QUANTITY_LENGTH) {
                return "prismatic"
            } else {
                return "fixed"
            }
        }
    }
    // {
    //   fieldType == 0 ? children : record.jointType == 0 ? "rev" : "prism";
    // }
}

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    fieldType,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false)
    const inputNumberRef = useRef<HTMLInputElement>(null)
    const selectRef = useRef<any>(null)
    const form = useContext(EditableContext)!

    useEffect(() => {
        if (editing) {
            if (inputNumberRef.current) {
                inputNumberRef.current!.focus()
            }
            if (selectRef.current) {
                selectRef.current!.focus()
            }
        }
    }, [editing])

    const toggleEdit = () => {
        setEditing(!editing)
        form.setFieldsValue({ [dataIndex]: record[dataIndex] })
    }

    const save = async () => {
        try {
            const values = await form.validateFields()

            toggleEdit()
            handleSave({ ...record, ...values })
        } catch (errInfo) {
            console.log("Save failed:", errInfo)
        }
    }

    let childNode = children

    //todo make:
    //prism - edit d not theta
    //rev - edit thet
    //fixed

    // if (editable || ) {
    if (editable) {
        // if (fieldType == 0) {
        //   console.log("got an 0 (number");
        // }
        // if (fieldType == 1) {
        //   console.log("got an 1 (drop down");
        // }

        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`
                    }
                ]}
            >
                {/*<RenderEditCell/>*/}
                {fieldType == 0 ? (
                    <InputNumber ref={inputNumberRef} onPressEnter={save} onBlur={save} />
                ) : (
                    <Select
                        ref={selectRef}
                        options={[
                            {
                                key: 0,
                                value: NMATH.LinkQuantities.QUANTITY_ANGLE,
                                label: "revolute"
                            },
                            {
                                key: 1,
                                value: NMATH.LinkQuantities.QUANTITY_LENGTH,
                                label: "prismatic"
                            },
                            { key: 2, value: NMATH.LinkQuantities.QUANTITY_NONE, label: "fixed" }
                        ]}
                        onChange={save}
                    />
                )}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24 }}
                onClick={toggleEdit}
            >
                <RenderDisplayCell
                    fieldType={fieldType}
                    children={children}
                    quantity={record.quantity}
                />
            </div>
        )
    }

    return <td {...restProps}>{childNode}</td>
}

function mapKinematicsLinkToTable(link: NMATH.KinematicsLink, index: number): TableDataType {
    return {
        key: index.toString(),
        alpha: (link.params as NMATH.DhParams).alpha,
        a: (link.params as NMATH.DhParams).a,
        d: (link.params as NMATH.DhParams).d,
        theta: (link.params as NMATH.DhParams).theta,
        quantity: link.quantity,
        color: "2",
        negativeLimit: (link.params as NMATH.DhParams).negativeLimit,
        positiveLimit: (link.params as NMATH.DhParams).positiveLimit,
        thetaInitialOffset: (link.params as NMATH.DhParams).thetaInitialOffset,
        dInitialOffset: (link.params as NMATH.DhParams).dInitialOffset
    }
}

function mapTableToKinematicsLink(row: TableDataType, index: number): NMATH.KinematicsLink {
    const newLink = new NMATH.KinematicsLink()
    //todo handle d and theta offset
    newLink.params = new NMATH.DhParams(
        row.a,
        row.alpha,
        row.d,
        row.dInitialOffset,
        row.theta,
        row.thetaInitialOffset,
        row.positiveLimit,
        row.negativeLimit
    )
    newLink.quantity = row.quantity
    //todo switch mod dh
    newLink.type = NMATH.LinkParamRepresentation.LINK_DH

    return newLink
}

export const PopoverPicker = ({ color, onChange }) => {
    const popover = useRef()
    const [isOpen, toggle] = useState(false)

    const close = useCallback(() => toggle(false), [])
    // useClickOutside(popover, close)

    return (
        <div className="picker">
            <div
                className="swatch"
                style={{ backgroundColor: color, width: 20, height: 20, borderRadius: 8 }}
                onClick={() => toggle(true)}
            />

            {isOpen && (
                <div
                    className="popover"
                    ref={popover}
                    style={{ position: `fixed`, backgroundColor: "white" }}
                >
                    <HexColorPicker color={color} onChange={onChange} />
                </div>
            )}
        </div>
    )
}

export const TableApp = () => {
    const [count, setCount] = useState(sampleDhMatrices.length - 1)

    const { angularUnits, precision, linearUnits } = useTileContext()
    console.log("precision", precision)
    console.log("angularUnits", angularUnits)
    console.log("linearUnits", linearUnits)

    //usEffect to update units when they change
    useEffect(() => {
        if (linearUnits == "mm") handleLinearUnitsChange(NMATH.LinearUnits.UNITS_MM)
        else if (linearUnits == "cm") handleLinearUnitsChange(NMATH.LinearUnits.UNITS_CM)
        else if (linearUnits == "m") handleLinearUnitsChange(NMATH.LinearUnits.UNITS_M)
        else if (linearUnits == "in") handleLinearUnitsChange(NMATH.LinearUnits.UNITS_IN)
    }, [linearUnits])

    useEffect(() => {
        if (angularUnits == "deg") handleAngularUnitsChange(NMATH.AngularUnits.UNITS_DEG)
        else if (angularUnits == "rad") handleAngularUnitsChange(NMATH.AngularUnits.UNITS_RAD)
    }, [angularUnits])

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

    console.log("DS", dataSource)

    const dataSourceReformatted = dataSource.map((row, index) => {
        return mapKinematicsLinkToTable(row, index)
    })
    console.log(dataSourceReformatted)
    const handleDelete = (key: React.Key) => {
        const newData = dataSource.filter((item, index) => index !== Number(key))

        // newData.forEach((row, index) => {
        //     row.key = index.toString()
        // })

        setDataSource(newData)
    }
    const [color, setColor] = useState("#aabbcc")

    const defaultColumns: (ColumnTypes[number] & {
        editable?: boolean
        dataIndex: string
        fieldType?: number
    })[] = [
        {
            title: "Link",
            dataIndex: "key"
        },
        {
            title: () => {
                if (activeDhMatrixType == DhMatrixTypeEnum.DH_CLASSIC) {
                    return (
                        <div>
                            <Tooltip
                                placement="topLeft"
                                title="Angle about common normal, from old z axis to new z axis."
                            >
                                &alpha;<sub>i</sub>
                            </Tooltip>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <Tooltip
                                placement="topLeft"
                                title="Link twist or offset angle (measured from Z<sub>i−1</sub> axis to Zi about the Xi axis, again using a right-hand rule"
                            >
                                &alpha;<sub>i-1</sub>
                            </Tooltip>
                        </div>
                    )
                }
            },
            dataIndex: "alpha",
            editable: true,
            fieldType: 0,
            ellipsis: true,
            width: "5%",
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <div>{(record as TableDataType).alpha.toFixed(precision)}</div>
                ) : null
        },
        {
            title: () => {
                return (
                    <div>
                        <Tooltip
                            placement="topLeft"
                            title="The angle of the joint. This can be set with siders or in the DH matrix iteself. Ignored for prismatic joints."
                        >
                            &theta;<sub>i</sub>
                        </Tooltip>
                    </div>
                )
            },
            dataIndex: "theta",
            editable: true,
            fieldType: 0,
            ellipsis: true,
            width: "5%",
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <div>{(record as TableDataType).theta.toFixed(precision)}</div>
                ) : null
        },
        {
            title: () => {
                return (
                    <div>
                        <Tooltip
                            placement="topLeft"
                            title="Any offset applied to the joint - this applies to revolute joints only. Ignored for prismatic joints."
                        >
                            &theta; offset
                        </Tooltip>
                    </div>
                )
            },
            dataIndex: "thetaInitialOffset",
            editable: true,
            fieldType: 0,
            ellipsis: true,
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <div>{(record as TableDataType).thetaInitialOffset.toFixed(precision)}</div>
                ) : null
        },
        {
            title: () => {
                if (activeDhMatrixType == DhMatrixTypeEnum.DH_CLASSIC) {
                    return (
                        <div>
                            <Tooltip placement="topLeft" title="Length of the common normal.">
                                a<sub>i</sub>
                            </Tooltip>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <Tooltip
                                placement="topLeft"
                                title="Link length (the shortest distance between Zi−1 and Zi axes. It is measured as the distance along the direction of Xi coordinate frame. For intersecting joint axes the value of Ai is zero. It has no meaning for prismatic joints and is set to zero in this case)."
                            >
                                a<sub>i-1</sub>
                            </Tooltip>
                        </div>
                    )
                }
            },
            dataIndex: "a",
            editable: true,
            fieldType: 0,
            ellipsis: true,
            width: "5%",
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <div>{(record as TableDataType).a.toFixed(precision)}</div>
                ) : null
        },
        {
            title: () => {
                return (
                    <div>
                        <Tooltip
                            placement="topLeft"
                            title="Offset along previous Z to the common normal."
                        >
                            d<sub>i</sub>
                        </Tooltip>
                    </div>
                )
            },
            dataIndex: "d",
            editable: true,
            fieldType: 0,
            ellipsis: true,
            width: "5%",
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <div>{(record as TableDataType).d.toFixed(precision)}</div>
                ) : null
        },
        {
            title: () => {
                return (
                    <div>
                        <Tooltip
                            placement="topLeft"
                            title="Any offset applied to the joint - this applies to revolute joints only. Ignored for prismatic joints."
                        >
                            d offset
                        </Tooltip>
                    </div>
                )
            },
            dataIndex: "dInitialOffset",
            editable: true,
            fieldType: 0,
            ellipsis: true,
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <div>
                        {(record as TableDataType).quantity == NMATH.LinkQuantities.QUANTITY_LENGTH
                            ? (record as TableDataType).dInitialOffset.toFixed(precision)
                            : ""}
                    </div>
                ) : null
        },
        {
            title: () => {
                return (
                    <div>
                        <Tooltip
                            placement="topLeft"
                            title="Type of joint - revolute (circular motion) or prismatic (linear motion) or fixed (no motion)."
                        >
                            Joint Type
                        </Tooltip>
                    </div>
                )
            },
            dataIndex: "quantity",
            fieldType: 1,
            editable: true,
            ellipsis: true
        },
        {
            title: () => {
                return (
                    <div>
                        <Tooltip
                            placement="topLeft"
                            title="Minimum travel of the joint (in degrees for revolute and m/mm for prismatic joints)"
                        >
                            Min. travel
                        </Tooltip>
                    </div>
                )
            },
            dataIndex: "negativeLimit",
            editable: true,
            fieldType: 0,
            ellipsis: true,
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <div>{(record as TableDataType).negativeLimit.toFixed(precision)}</div>
                ) : null
        },
        {
            title: () => {
                return (
                    <div>
                        <Tooltip
                            placement="topLeft"
                            title="Maximum travel of the joint (in degrees for revolute and m/mm for prismatic joints)"
                        >
                            Max. travel
                        </Tooltip>
                    </div>
                )
            },
            dataIndex: "positiveLimit",
            editable: true,
            fieldType: 0,
            ellipsis: true,
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <div>{(record as TableDataType).positiveLimit.toFixed(precision)}</div>
                ) : null
        },

        {
            title: () => {
                return (
                    <div>
                        <Tooltip
                            placement="topLeft"
                            title="Color used to render the link in the 3D view"
                        >
                            Color
                        </Tooltip>
                    </div>
                )
            },
            dataIndex: "color",
            editable: false,
            fieldType: 2,
            ellipsis: true,
            render: (_, record: { key: React.Key }) =>
                dataSource.length >= 1 ? (
                    // <div onClick={() => toggleColorPicker(true)}>
                    //     <svg xmlns="http://www.w3.org/2000/svg" height="10" width="10">
                    //         <circle cx="5" cy="5" r="5" strokeWidth={0} fill={record.color} />
                    //     </svg>
                    // </div>
                    <PopoverPicker color={color} onChange={setColor} />
                ) : null
        },

        {
            title: "Operation",
            dataIndex: "operation",
            ellipsis: true,
            render: (_, record: { key: React.Key }) =>
                dataSource.length >= 1 ? (
                    <div>
                        <Popconfirm
                            title="Confirm delete?"
                            onConfirm={() => handleDelete(record.key)}
                        >
                            <a>Delete row</a>
                        </Popconfirm>
                    </div>
                ) : null
        }
    ]

    const handleAdd = () => {
        setCount(prev => prev + 1)
        // var newCount = dataSource.length
        // for (let i = 0; i < dataSource.length; i++) {
        //     if (dataSource[i].key < count) {
        //         newCount = count
        //     }
        // }

        // const newData: DataType = {
        //     key: 9999,
        //     alpha: 0,
        //     theta: 0,
        //     initialOffset: 0,
        //     a: 0,
        //     d: 0,
        //     jointType: 0,
        //     min: -180,
        //     max: 180,
        //     color: niceColors.flat()[count]
        // }

        const newData: NMATH.KinematicsLink = new NMATH.KinematicsLink()

        // >>>> // setDataSource([...dataSource, newData]) this triggers render

        const reindexedData = [...dataSource, newData]

        // reindexedData.push(newData)

        // reindexedData.forEach((row, index) => {
        //     row.key = index.toString()
        // })

        setDataSource(reindexedData)
    }

    const handleSave = (row: TableDataType) => {
        //row contains table formatted data with change in it
        console.log("row", row)
        const newrow: NMATH.KinematicsLink = mapTableToKinematicsLink(row, 0)
        console.log("newrow", newrow)
        const newData = [...dataSource]

        // const index = newData.findIndex(item => row.key === item.key)
        const index = Number(row.key)
        const item = newData[index]
        newData.splice(index, 1, {
            ...item,
            ...newrow
        })
        setDataSource(newData)
    }

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell
        }
    }

    // const mapColumns = col => {
    //     if (!col.editable) {
    //         return col
    //     }
    //     const newCol = {
    //         ...col,
    //         onCell: record => ({
    //             record,
    //             editable: col.editable,
    //             dataIndex: col.dataIndex,
    //             title: col.title,
    //             handleSave,
    //             fieldType: col.fieldType
    //         })
    //     }
    //     if (col.children) {
    //         newCol.children = col.children.map(mapColumns)
    //     }
    //     return newCol
    // }
    //
    // const columns = defaultColumns.map(mapColumns)

    const columns = defaultColumns.map(col => {
        if (!col.editable) {
            return col
        }
        return {
            ...col,
            onCell: (record: TableDataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
                fieldType: col.fieldType
            })
        }
    })

    const onChangeRobotPosition = (component: number, value: any) => {
        setRobotPos(() => {
            return robotPos.clone().setComponent(component, value)
        })
    }
    const onChangeRobotRotation = (component: number, value: any) => {
        switch (component) {
            case 0: {
                //x
                setRobotRotE(() => {
                    return robotRotE.clone().set(value, robotRotE.y, robotRotE.z)
                })
                break
            }
            case 1: {
                //y
                setRobotRotE(() => {
                    return robotRotE.clone().set(robotRotE.x, value, robotRotE.z)
                })
                break
            }
            case 2: {
                //z
                setRobotRotE(() => {
                    return robotRotE.clone().set(robotRotE.x, robotRotE.y, value)
                })
                break
            }
        }
    }

    // value: sampleDhMatrices.map((row, index) => {
    //       index;
    //     }),
    //     label: sampleDhMatrices.map((row) => {
    //       row.name;
    //     }),
    //   },
    // ];

    const handleAngularUnitsChange = e => {
        const newData = [...dataSource]

        newData.forEach((row, index) => {
            const item = newData[index]

            const paramsAsDh = item.params as DhParams
            if (
                e == NMATH.AngularUnits.UNITS_DEG &&
                item.angularUnits != NMATH.AngularUnits.UNITS_DEG
            ) {
                //we are converting to degrees from radians
                if (item.quantity == NMATH.LinkQuantities.QUANTITY_ANGLE) {
                    //revolute
                    paramsAsDh.alpha *= 180 / Math.PI
                    paramsAsDh.theta *= 180 / Math.PI
                    paramsAsDh.thetaInitialOffset *= 180 / Math.PI
                    paramsAsDh.positiveLimit *= 180 / Math.PI
                    paramsAsDh.negativeLimit *= 180 / Math.PI
                    item.angularUnits = NMATH.AngularUnits.UNITS_DEG
                } else if (item.quantity == NMATH.LinkQuantities.QUANTITY_LENGTH) {
                    //prismatic
                    //prismatic joints dont have a theta or theta offset
                    paramsAsDh.alpha *= 180 / Math.PI
                    item.angularUnits = NMATH.AngularUnits.UNITS_DEG
                } else {
                    //fixed
                    //fixed joints dont have initial offset or limits
                    paramsAsDh.alpha *= 180 / Math.PI
                    paramsAsDh.theta *= 180 / Math.PI
                    item.angularUnits = NMATH.AngularUnits.UNITS_DEG
                }
            } else if (
                e == NMATH.AngularUnits.UNITS_RAD &&
                item.angularUnits != NMATH.AngularUnits.UNITS_RAD
            ) {
                //we are converting to radians from degrees
                if (item.quantity == NMATH.LinkQuantities.QUANTITY_ANGLE) {
                    //revolute

                    paramsAsDh.alpha *= Math.PI / 180
                    paramsAsDh.theta *= Math.PI / 180
                    paramsAsDh.thetaInitialOffset *= Math.PI / 180
                    paramsAsDh.positiveLimit *= Math.PI / 180
                    paramsAsDh.negativeLimit *= Math.PI / 180
                    item.angularUnits = NMATH.AngularUnits.UNITS_RAD
                } else if (item.quantity == NMATH.LinkQuantities.QUANTITY_LENGTH) {
                    //prismatic
                    //prismatic joints dont have a theta or theta offset
                    paramsAsDh.alpha *= Math.PI / 180
                    item.angularUnits = NMATH.AngularUnits.UNITS_DEG
                } else {
                    //fixed
                    paramsAsDh.alpha *= Math.PI / 180
                    paramsAsDh.theta *= Math.PI / 180
                    item.angularUnits = NMATH.AngularUnits.UNITS_DEG
                }
            }
        })

        setDataSource(newData)
    }

    const handleLinearUnitsChange = e => {
        const newData = [...dataSource]

        newData.forEach((row, index) => {
            const item = newData[index]
            if (e != item.linearUnits) {
                if (item.quantity == NMATH.LinkQuantities.QUANTITY_LENGTH) {
                    NMATH.convertLinearUnitsPrismatic(item, item.linearUnits, e)
                } else if (item.quantity == NMATH.LinkQuantities.QUANTITY_ANGLE) {
                    NMATH.convertLinearUnitsRevolute(item, item.linearUnits, e)
                } else if (item.quantity == NMATH.LinkQuantities.QUANTITY_NONE) {
                    NMATH.convertLinearUnitsFixed(item, item.linearUnits, e)
                } else {
                    throw new Error("MatrixTile: handleLinearUnitsChange: unknown units")
                }
            } else {
                //no units change
            }

            newData.splice(index, 1, {
                ...item
            })
            setDataSource(newData)
        })
    }

    // const handleExtentsChange = e => {
    //     setExtents(e)
    // }

    return (
        <div style={{ padding: "10px" }}>
            {/*<h4>Set extents for 3d robot view (size of viewport)</h4>*/}
            {/*<Select*/}
            {/*    value={extents}*/}
            {/*    onSelect={e => handleExtentsChange(e)}*/}
            {/*    options={[*/}
            {/*        { value: 0, label: "200mm" },*/}
            {/*        { value: 1, label: "500mm" },*/}
            {/*        { value: 2, label: "2m" }*/}
            {/*    ]}*/}
            {/*    style={{ width: 100 }}*/}
            {/*/>*/}

            <h4>
                Set robot placement in the scene with translation [x y z] & rotation [R
                <sub>x</sub>, R<sub>y</sub>,R<sub>z</sub>]
            </h4>

            <LabelSpan>x</LabelSpan>
            <InputNumber
                value={robotPos.x}
                onChange={e => onChangeRobotPosition(0, e)}
            ></InputNumber>
            <LabelSpan>y</LabelSpan>
            <InputNumber
                value={robotPos.y}
                onChange={e => onChangeRobotPosition(1, e)}
            ></InputNumber>
            <LabelSpan>z</LabelSpan>
            <InputNumber
                value={robotPos.z}
                onChange={e => onChangeRobotPosition(2, e)}
            ></InputNumber>
            <LabelSpan>
                R<sub>x</sub>
            </LabelSpan>
            <InputNumber
                value={robotRotE.x}
                onChange={e => onChangeRobotRotation(0, e)}
            ></InputNumber>
            <LabelSpan>
                R<sub>y</sub>
            </LabelSpan>
            <InputNumber
                value={robotRotE.y}
                onChange={e => onChangeRobotRotation(1, e)}
            ></InputNumber>
            <LabelSpan>
                R<sub>z</sub>
            </LabelSpan>
            <InputNumber
                value={robotRotE.z}
                onChange={e => onChangeRobotRotation(2, e)}
            ></InputNumber>

            <Table
                title={() => (
                    <>
                        <h2>Denavit–Hartenberg (DH) matrix</h2>

                        <LabelSpan> Format for the DH matrix</LabelSpan>
                        <Select
                            options={[
                                { value: 0, label: "Standard DH parameters" },
                                { value: 1, label: "Modified DH parameters" }
                            ]}
                            value={activeDhMatrixType}
                            onChange={setActiveDhMatrixType}
                            style={{ width: 200 }}
                        />
                    </>
                )}
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={dataSourceReformatted}
                columns={columns as ColumnTypes}
                footer={() => (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between"
                            // flexDirection: "column",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-start"
                                // alignItems: "flex-start",
                                // float: "left",
                            }}
                        >
                            {/*<Tooltip placement="topLeft" title="Copy DH matrix to clipboard">*/}
                            {/*    <Button*/}
                            {/*        type="primary"*/}
                            {/*        shape="circle"*/}
                            {/*        icon={<PaperClipOutlined />}*/}
                            {/*        onClick={() => {*/}
                            {/*            navigator.clipboard.writeText(JSON.stringify(dataSource))*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*</Tooltip>*/}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end"
                                // alignItems: "flex-end",
                                // float: "right",
                            }}
                        >
                            <Button onClick={handleAdd} type="primary">
                                Add a row to table
                            </Button>
                        </div>
                    </div>
                )}
            />
        </div>
    )
}
