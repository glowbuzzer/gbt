import * as React from "react"
import styled from "styled-components"
import { PrecisionInput } from "../../util/PrecisionInput"
import { useRotations } from "../RotationsProvider"
import { Quaternion } from "three"
import { useEffect } from "react"
import { StyledTile } from "./styles"
import { DockToolbar, DockToolbarButtonGroup } from "../../util/DockToolbar"
import { ReactComponent as CopyIcon } from "@material-symbols/svg-400/outlined/content_copy.svg"
import { Button, Dropdown } from "antd"

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

export const QuaternionTile = () => {
    const { quaternion, setQuaternion } = useRotations()
    const [edited, setEdited] = React.useState([
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w
    ])

    useEffect(() => {
        const [x, y, z, w] = edited
        setQuaternion(new Quaternion(x, y, z, w).normalize())
    }, [edited])

    function set(value, axis) {
        const update = [...edited]
        update[axis] = value
        setEdited(update)
    }

    const { x, y, z, w } = quaternion
    const shadow = [x, y, z, w].map((v, index) =>
        v.toFixed(5) === edited[index].toFixed(5) ? false : v.toFixed(5)
    )

    function normalize() {
        setEdited([x, y, z, w])
    }

    const cols = ["x", "y", "z", "w"]

    const items = [
        {
            key: "1",
            label: (
                <StyledMenuItem>
                    <div className="title">New THREE object</div>
                    <div className="content">new THREE.Quaternion(0, 0, 0, 0, 1)</div>
                </StyledMenuItem>
            )
        },
        {
            key: "2",
            label: (
                <StyledMenuItem>
                    <div className="title">Javascript array (x, y, z, w)</div>
                    <div className="content">[0, 0, 0, 0]</div>
                </StyledMenuItem>
            )
        },
        {
            key: "3",
            label: (
                <StyledMenuItem>
                    <div className="title">Javascript object</div>
                    <div className="content">{`{x: 0, y: 0, z: 0, w: 0}`}</div>
                </StyledMenuItem>
            )
        }
    ]

    return (
        <div>
            <DockToolbar>
                <DockToolbarButtonGroup>
                    <Dropdown menu={{ items }}>
                        <CopyIcon width={18} height={18} viewBox="0 0 48 48" />
                    </Dropdown>
                </DockToolbarButtonGroup>
            </DockToolbar>
            <StyledTile>
                <div className="grid">
                    {cols.map(axis => (
                        <div className="label" key={axis}>
                            {axis.toUpperCase()}
                        </div>
                    ))}
                    {cols.map((axis, index) => (
                        <div className="input" key={"t-" + axis}>
                            <PrecisionInput
                                value={edited[index]}
                                onChange={value => set(value, index)}
                                precision={2}
                            />
                        </div>
                    ))}
                    {cols.map((axis, index) => (
                        <div className="shadow" key={"s-" + axis}>
                            {shadow[index] ? shadow[index] : ""}
                        </div>
                    ))}
                </div>
                <Button size="small" onClick={normalize}>
                    Normalize
                </Button>
            </StyledTile>
        </div>
    )
}
