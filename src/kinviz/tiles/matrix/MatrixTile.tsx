/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useContext, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { StyledTile } from "../styles"
import { DockToolbar } from "../../../util/DockToolbar"
import { ToolbarRadioAngularUnits } from "../../../util/ToolbarRadioAngularUnits"
import { ToolbarButtonsPrecision } from "../../../util/ToolbarButtonsPrecision"
import { ToolbarSelectLinearUnits } from "../../../util/ToolbarSelectLinearUnits"
import { ToolbarSelectDhFormat } from "../../../util/ToolbarSelectDhFormat"
import useOnclickOutside from "react-cool-onclickoutside"
import { useTileContext } from "../../../util/TileContextProvider"
import { AngularUnits, DhType, LinearUnits } from "../../../types"
import { Button, Form, InputNumber, Popconfirm, Select, Table, Tooltip, Row, Col } from "antd"
import { SketchPicker } from "react-color"
import type { FormInstance } from "antd/es/form"
import { TableDataType } from "../types"
import * as THREE from "three"
import { useKinViz } from "../../KinVizProvider"
import * as NMATH from "../../ik/NMATH"
import { DhParams } from "../../ik/NMATH"

export const MatrixTile = () => {
    const { dataSource, setDataSource, robotInScene, setRobotInScene, editing, setEditing } =
        useKinViz()

    return (
        <>
            <DockToolbar>
                <ToolbarRadioAngularUnits disabled={editing} />
                <ToolbarButtonsPrecision disabled={editing} />
                <ToolbarSelectLinearUnits disabled={editing} />
                <ToolbarSelectDhFormat disabled={editing} />
            </DockToolbar>
            <StyledTile>
                <TableApp />
            </StyledTile>
        </>
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
    const { dataSource, setDataSource, robotInScene, setRobotInScene, editing, setEditing } =
        useKinViz()

    const [editingCell, setEditingCell] = useState(false)
    const inputNumberRef = useRef<HTMLInputElement>(null)
    const selectRef = useRef<any>(null)
    const form = useContext(EditableContext)!

    useEffect(() => {
        if (editingCell) {
            if (inputNumberRef.current) {
                inputNumberRef.current!.focus()
            }
            if (selectRef.current) {
                selectRef.current!.focus()
            }
        }
    }, [editingCell])

    const toggleEdit = () => {
        setEditingCell(!editingCell)
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

    if (editable) {
        childNode = editingCell ? (
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
                        onBlur={save}
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

export const PopoverPicker = ({ color, onChange, index }) => {
    const popoverRef = useRef()
    // const [listening, setListening] = useState(false)

    const {
        dataSource,
        setDataSource,
        robotInScene,
        setRobotInScene,
        newDataLoaded,
        setNewDataLoaded,
        editing,
        setEditing
    } = useKinViz()

    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(!isOpen)

    // const close = useCallback(() => toggle(false), [])

    // useClickOutside(popover, close)
    // useEffect(listenForOutsideClicks(listening, setListening, popoverRef, setIsOpen))

    const ref = useOnclickOutside(() => {
        setIsOpen(false)
    })

    // const openBox = () => {
    //     setopen(!open)
    // }

    // const [open, setopen] = useState(false)
    const [pickColor, setPickColor] = useState("#ffffff") // define a state for the color prop
    const handleChange = (color: any) => {
        setPickColor(color.hex)
    }

    const handleChangeComplete = (color: any) => {
        const newData = [...dataSource]

        newData[index].color = color.hex
        setDataSource(newData)
    }

    return (
        <div className="picker">
            <div
                className="swatch"
                style={{ backgroundColor: color, width: 20, height: 20, borderRadius: 8 }}
                onClick={toggle}
            />

            {isOpen && (
                // <div
                //     className="popover"
                //     ref={popover}
                //     style={{ position: `fixed`, overlay: { background: "black" } }}
                // >
                //     <HexColorPicker color={color} onChange={onChange} />
                // </div>
                <div
                    ref={ref}
                    style={{ position: "fixed", left: "100px", top: "500px", zIndex: "2" }}
                >
                    <div
                        ref={ref}
                        style={{
                            position: "fixed"
                        }}
                        // onClick={this.handleClose}
                        // onKeyDown={this.handleClick}
                        // role="button"
                        // tabIndex="0"
                        aria-label="Save"
                    />
                    <SketchPicker
                        color={pickColor}
                        onChange={handleChange}
                        onChangeComplete={handleChangeComplete}
                        // color={this.state.background}
                        // onChange={this.handleChange2}
                        // onChangeComplete={this.handleChangeComplete}
                    />
                </div>
            )}
        </div>
    )
}

export const TableApp = () => {
    const {
        angularUnits,
        setAngularUnits,
        precision,
        setLinearUnits,
        linearUnits,
        dhType,
        setDhType
    } = useTileContext()
    const {
        dataSource,
        setDataSource,
        robotInScene,
        setRobotInScene,
        newDataLoaded,
        setNewDataLoaded,
        editing,
        setEditing
    } = useKinViz()
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

    useEffect(() => {
        if (dhType == "DH format classic") handleDhTypeChange(NMATH.LinkParamRepresentation.LINK_DH)
        else if (dhType == "DH format modified")
            handleDhTypeChange(NMATH.LinkParamRepresentation.LINK_MODIFIED_DH)
    }, [dhType])

    useEffect(() => {
        //set dh type based on first link in dataSource
        if (newDataLoaded == true) {
            if (dataSource[0].type == NMATH.LinkParamRepresentation.LINK_DH) {
                setDhType(DhType.CLASSIC)
            } else {
                setDhType(DhType.MODIFIED)
            }

            if (dataSource[0].linearUnits == NMATH.LinearUnits.UNITS_MM) {
                setLinearUnits(LinearUnits.MM)
            } else if (dataSource[0].linearUnits == NMATH.LinearUnits.UNITS_CM) {
                setLinearUnits(LinearUnits.CM)
            } else if (dataSource[0].linearUnits == NMATH.LinearUnits.UNITS_M) {
                setLinearUnits(LinearUnits.M)
            } else if (dataSource[0].linearUnits == NMATH.LinearUnits.UNITS_IN) {
                setLinearUnits(LinearUnits.IN)
            }

            if (dataSource[0].angularUnits == NMATH.AngularUnits.UNITS_DEG) {
                setAngularUnits(AngularUnits.DEG)
            } else {
                setAngularUnits(AngularUnits.RAD)
            }

            setNewDataLoaded(false)
        }
    }, [newDataLoaded])

    //todo not sure about this
    const [count, setCount] = useState(dataSource.length - 1)
    console.log("DS", dataSource)

    const dataSourceReformatted = dataSource.map((row, index) => {
        return mapKinematicsLinkToTable(row, index)
    })

    const handleDelete = (key: React.Key) => {
        if (dataSource.length == 1) {
            console.log("cant delete last link")
            return
        }

        const newData = dataSource.filter((item, index) => index !== Number(key))

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
                if (dhType == "DH format classic") {
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
                if (dhType == "DH format classic") {
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
                    <PopoverPicker
                        color={dataSource[record.key].color}
                        onChange={setColor}
                        index={record.key}
                    />
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

        // const newData: DataType =
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

        const newrow: NMATH.KinematicsLink = mapTableToKinematicsLink(row, 0)

        const newData = [...dataSource]

        // const index = newData.findIndex(item => row.key === item.key)
        const index = Number(row.key)
        const item = newData[index]
        // newData.splice(index, 1, {
        //     ...item,
        //     ...newrow
        // })
        newData[index] = newrow

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
        const newPos = robotInScene.position.clone().setComponent(component, value)

        setRobotInScene({ ...robotInScene, position: newPos })
        // setRobotInScene(() => {
        //
        //     const newRobotInScene: RobotInScene = {
        //         position: newPos,
        //         rotation: robotInScene.rotation,
        //         linearUnits: robotInScene.linearUnits,
        //         angularUnits: robotInScene.angularUnits
        //     }
        //     return newRobotInScene
        // })
    }
    const onChangeRobotRotation = (component: number, value: any) => {
        setEditing(false)
        switch (component) {
            case 0: {
                //x
                const newRot = robotInScene.rotation
                    .clone()
                    .set(value, robotInScene.rotation.y, robotInScene.rotation.z)
                setRobotInScene({ ...robotInScene, rotation: newRot })

                break
            }
            case 1: {
                //y
                const newRot = robotInScene.rotation
                    .clone()
                    .set(robotInScene.rotation.x, value, robotInScene.rotation.z)

                setRobotInScene({ ...robotInScene, rotation: newRot })
                break
            }
            case 2: {
                //z
                const newRot = robotInScene.rotation
                    .clone()
                    .set(robotInScene.rotation.x, robotInScene.rotation.y, value)

                setRobotInScene({ ...robotInScene, rotation: newRot })
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

    const handleDhTypeChange = e => {
        if (
            e == NMATH.LinkParamRepresentation.LINK_DH &&
            dataSource[0].type == NMATH.LinkParamRepresentation.LINK_DH
        ) {
            //do nothing
        }
        if (
            e == NMATH.LinkParamRepresentation.LINK_DH &&
            dataSource[0].type == NMATH.LinkParamRepresentation.LINK_MODIFIED_DH
        ) {
            //change classic dh to modified dh
            const newData = NMATH.convertModifiedToClassicDh(dataSource)
            // newData.forEach((row, index) => {
            //     row.type = NMATH.LinkParamRepresentation.LINK_MODIFIED_DH
            // })
            setDataSource(newData)
            return
        }

        if (
            e == NMATH.LinkParamRepresentation.LINK_MODIFIED_DH &&
            dataSource[0].type == NMATH.LinkParamRepresentation.LINK_MODIFIED_DH
        ) {
            //do nothing
        }

        if (
            e == NMATH.LinkParamRepresentation.LINK_MODIFIED_DH &&
            dataSource[0].type == NMATH.LinkParamRepresentation.LINK_DH
        ) {
            //change  modified to classic dh
            const newData = NMATH.convertClassicToModifiedDh(dataSource)
            // newData.forEach((row, index) => {
            //     row.type = NMATH.LinkParamRepresentation.LINK_DH
            // })

            setDataSource(newData)
        }
    }

    const handleAngularUnitsChange = e => {
        //convert robotInScene to new units
        var unitsConvert
        if (e == NMATH.AngularUnits.UNITS_DEG) {
            unitsConvert = "deg"
        }
        if (e == NMATH.AngularUnits.UNITS_RAD) {
            unitsConvert = "rad"
        }

        if (robotInScene.angularUnits != unitsConvert) {
            if (unitsConvert == "deg") {
                //we are converting to degrees from radians

                const newRot: THREE.Euler = new THREE.Euler(
                    (robotInScene.rotation.x *= 180 / Math.PI),
                    (robotInScene.rotation.y *= 180 / Math.PI),
                    (robotInScene.rotation.z *= 180 / Math.PI)
                )
                setRobotInScene({
                    ...robotInScene,
                    rotation: newRot,
                    angularUnits: AngularUnits.DEG
                })
            } else {
                //we are converting to radians from degrees

                const newRot: THREE.Euler = new THREE.Euler(
                    (robotInScene.rotation.x *= Math.PI / 180),
                    (robotInScene.rotation.y *= Math.PI / 180),
                    (robotInScene.rotation.z *= Math.PI / 180)
                )
                setRobotInScene({
                    ...robotInScene,
                    rotation: newRot,
                    angularUnits: AngularUnits.RAD
                })
            }
        }

        //convert kinematicsLink to new units
        const newData = [...dataSource]
        newData.forEach((row, index) => {
            const paramsAsDh = row.params as DhParams
            if (
                e == NMATH.AngularUnits.UNITS_DEG &&
                row.angularUnits != NMATH.AngularUnits.UNITS_DEG
            ) {
                //we are converting to degrees from radians
                if (row.quantity == NMATH.LinkQuantities.QUANTITY_ANGLE) {
                    //revolute
                    paramsAsDh.alpha *= 180 / Math.PI
                    paramsAsDh.theta *= 180 / Math.PI
                    paramsAsDh.thetaInitialOffset *= 180 / Math.PI
                    paramsAsDh.positiveLimit *= 180 / Math.PI
                    paramsAsDh.negativeLimit *= 180 / Math.PI
                    row.angularUnits = NMATH.AngularUnits.UNITS_DEG
                } else if (row.quantity == NMATH.LinkQuantities.QUANTITY_LENGTH) {
                    //prismatic
                    //prismatic joints dont have a theta or theta offset
                    paramsAsDh.alpha *= 180 / Math.PI
                    row.angularUnits = NMATH.AngularUnits.UNITS_DEG
                } else {
                    //fixed
                    //fixed joints dont have initial offset or limits
                    paramsAsDh.alpha *= 180 / Math.PI
                    paramsAsDh.theta *= 180 / Math.PI
                    row.angularUnits = NMATH.AngularUnits.UNITS_DEG
                }
            } else if (
                e == NMATH.AngularUnits.UNITS_RAD &&
                row.angularUnits != NMATH.AngularUnits.UNITS_RAD
            ) {
                //we are converting to radians from degrees
                if (row.quantity == NMATH.LinkQuantities.QUANTITY_ANGLE) {
                    //revolute

                    paramsAsDh.alpha *= Math.PI / 180
                    paramsAsDh.theta *= Math.PI / 180
                    paramsAsDh.thetaInitialOffset *= Math.PI / 180
                    paramsAsDh.positiveLimit *= Math.PI / 180
                    paramsAsDh.negativeLimit *= Math.PI / 180
                    row.angularUnits = NMATH.AngularUnits.UNITS_RAD
                } else if (row.quantity == NMATH.LinkQuantities.QUANTITY_LENGTH) {
                    //prismatic
                    //prismatic joints dont have a theta or theta offset
                    paramsAsDh.alpha *= Math.PI / 180
                    row.angularUnits = NMATH.AngularUnits.UNITS_RAD
                } else {
                    //fixed
                    paramsAsDh.alpha *= Math.PI / 180
                    paramsAsDh.theta *= Math.PI / 180
                    row.angularUnits = NMATH.AngularUnits.UNITS_RAD
                }
            }
        })

        setDataSource(newData)
    }

    const handleLinearUnitsChange = e => {
        const newData = [...dataSource]

        var unitsConvert
        if (robotInScene.linearUnits == "m") {
            unitsConvert = NMATH.LinearUnits.UNITS_M
        } else if (robotInScene.linearUnits == "mm") {
            unitsConvert = NMATH.LinearUnits.UNITS_MM
        } else if (robotInScene.linearUnits == "cm") {
            unitsConvert = NMATH.LinearUnits.UNITS_CM
        } else if (robotInScene.linearUnits == "in") {
            unitsConvert = NMATH.LinearUnits.UNITS_IN
        }

        var unitsConvert2
        if (e == NMATH.LinearUnits.UNITS_M) {
            unitsConvert2 = "m"
        } else if (e == NMATH.LinearUnits.UNITS_MM) {
            unitsConvert2 = "mm"
        } else if (e == NMATH.LinearUnits.UNITS_CM) {
            unitsConvert2 = "cm"
        } else if (e == NMATH.LinearUnits.UNITS_IN) {
            unitsConvert2 = "in"
        }

        const factor = NMATH.calculateLinearUnitsConversionFactor(unitsConvert, e)

        const newPos: THREE.Vector3 = new THREE.Vector3(
            (robotInScene.position.x *= factor),
            (robotInScene.position.y *= factor),
            (robotInScene.position.z *= factor)
        )
        setRobotInScene({
            ...robotInScene,
            position: newPos,
            linearUnits: unitsConvert2
        })

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

            // newData.splice(index, 1, {
            //     ...item
            // })
        })
        setDataSource(newData)
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

            <Row align="middle" gutter={[16, 16]}>
                <Col xs={2} lg={2}>
                    x
                </Col>
                <Col xs={22} lg={6}>
                    <InputNumber
                        value={robotInScene.position.x.toFixed(precision)}
                        onChange={e => onChangeRobotPosition(0, e)}
                        onFocus={e => setEditing(true)}
                        onBlur={e => setEditing(false)}
                    ></InputNumber>
                </Col>
                <Col xs={2} lg={2}>
                    y
                </Col>
                <Col xs={22} lg={6}>
                    <InputNumber
                        value={robotInScene.position.y.toFixed(precision)}
                        onChange={e => onChangeRobotPosition(1, e)}
                        onFocus={e => setEditing(true)}
                        onBlur={e => setEditing(false)}
                    ></InputNumber>
                </Col>
                <Col xs={2} lg={2}>
                    z
                </Col>
                <Col sm={22} lg={6}>
                    <InputNumber
                        value={robotInScene.position.z.toFixed(precision)}
                        onChange={e => onChangeRobotPosition(2, e)}
                        onFocus={e => setEditing(true)}
                        onBlur={e => setEditing(false)}
                    ></InputNumber>
                </Col>
            </Row>
            <Row align="middle" gutter={[16, 16]}>
                <Col xs={2} lg={2}>
                    R<sub>x</sub>
                </Col>
                <Col sm={22} lg={6}>
                    <InputNumber
                        value={robotInScene.rotation.x.toFixed(precision)}
                        onChange={e => onChangeRobotRotation(0, e)}
                        onFocus={e => setEditing(true)}
                        onBlur={e => setEditing(false)}
                    ></InputNumber>
                </Col>
                <Col xs={2} lg={2}>
                    R<sub>y</sub>
                </Col>
                <Col sm={22} lg={6}>
                    <InputNumber
                        value={robotInScene.rotation.y.toFixed(precision)}
                        onChange={e => onChangeRobotRotation(1, e)}
                        onFocus={e => setEditing(true)}
                        onBlur={e => setEditing(false)}
                    ></InputNumber>
                </Col>
                <Col xs={2} lg={2}>
                    R<sub>z</sub>
                </Col>
                <Col sm={22} lg={6}>
                    <InputNumber
                        value={robotInScene.rotation.z.toFixed(precision)}
                        onChange={e => onChangeRobotRotation(2, e)}
                        onFocus={e => setEditing(true)}
                        onBlur={e => setEditing(false)}
                    ></InputNumber>
                </Col>
            </Row>

            {/*<LabelSpan>x</LabelSpan>*/}
            {/*<InputNumber*/}
            {/*    value={robotInScene.position.x.toFixed(precision)}*/}
            {/*    onChange={e => onChangeRobotPosition(0, e)}*/}
            {/*    onFocus={e => setEditing(true)}*/}
            {/*    onBlur={e => setEditing(false)}*/}
            {/*></InputNumber>*/}
            {/*<LabelSpan>y</LabelSpan>*/}
            {/*<InputNumber*/}
            {/*    value={robotInScene.position.y.toFixed(precision)}*/}
            {/*    onChange={e => onChangeRobotPosition(1, e)}*/}
            {/*    onFocus={e => setEditing(true)}*/}
            {/*    onBlur={e => setEditing(false)}*/}
            {/*></InputNumber>*/}
            {/*<LabelSpan>z</LabelSpan>*/}
            {/*<InputNumber*/}
            {/*    value={robotInScene.position.z.toFixed(precision)}*/}
            {/*    onChange={e => onChangeRobotPosition(2, e)}*/}
            {/*    onFocus={e => setEditing(true)}*/}
            {/*    onBlur={e => setEditing(false)}*/}
            {/*></InputNumber>*/}
            {/*<LabelSpan>*/}
            {/*    R<sub>x</sub>*/}
            {/*</LabelSpan>*/}
            {/*<InputNumber*/}
            {/*    value={robotInScene.rotation.x.toFixed(precision)}*/}
            {/*    onChange={e => onChangeRobotRotation(0, e)}*/}
            {/*    onFocus={e => setEditing(true)}*/}
            {/*    onBlur={e => setEditing(false)}*/}
            {/*></InputNumber>*/}
            {/*<LabelSpan>*/}
            {/*    R<sub>y</sub>*/}
            {/*</LabelSpan>*/}
            {/*<InputNumber*/}
            {/*    value={robotInScene.rotation.y.toFixed(precision)}*/}
            {/*    onChange={e => onChangeRobotRotation(1, e)}*/}
            {/*    onFocus={e => setEditing(true)}*/}
            {/*    onBlur={e => setEditing(false)}*/}
            {/*></InputNumber>*/}
            {/*<LabelSpan>*/}
            {/*    R<sub>z</sub>*/}
            {/*</LabelSpan>*/}
            {/*<InputNumber*/}
            {/*    value={robotInScene.rotation.z.toFixed(precision)}*/}
            {/*    onChange={e => onChangeRobotRotation(2, e)}*/}
            {/*    onFocus={e => setEditing(true)}*/}
            {/*    onBlur={e => setEditing(false)}*/}
            {/*></InputNumber>*/}

            <Table
                title={() => (
                    <>
                        <h2>Denavit–Hartenberg (DH) matrix</h2>
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
                        ></div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end"
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
