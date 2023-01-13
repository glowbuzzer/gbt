import { IJsonModel, Layout, Model, Node } from "flexlayout-react"
import { StyledDockLayout } from "../styles"
import { RotationsProvider } from "./RotationsProvider"
import { QuaternionTile } from "./tiles/QuaternionTile"
import * as React from "react"
import { EulerTile } from "./tiles/EulerTile"
import { TileContextProvider } from "../util/TileContextProvider"

export const RotationsTool = () => {
    const model: IJsonModel = {
        global: {
            tabSetEnableMaximize: false,
            borderBarSize: 1,
            borderSize: 1,
            tabBorderWidth: 1,
            splitterSize: 5
        },
        layout: {
            type: "row",
            id: "root",
            children: [
                {
                    type: "row",
                    weight: 25,
                    children: [
                        {
                            type: "tabset",
                            id: "left1",
                            enableDeleteWhenEmpty: false,
                            children: [
                                {
                                    type: "tab",
                                    id: "quaternion",
                                    name: "Quaternion"
                                }
                            ]
                        },
                        {
                            type: "tabset",
                            id: "left2",
                            children: [
                                {
                                    type: "tab",
                                    id: "euler",
                                    name: "Euler"
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "row",
                    weight: 50,
                    children: [
                        {
                            type: "tabset",
                            id: "wide-tabset",
                            enableDeleteWhenEmpty: false,
                            children: []
                        }
                    ]
                }
            ]
        }
    }

    function factory(node: Node) {
        switch (node.getId()) {
            case "quaternion":
                return (
                    <TileContextProvider appKey={"rotations"} tileKey={"quaternion"}>
                        <QuaternionTile />
                    </TileContextProvider>
                )
            case "euler":
                return (
                    <TileContextProvider appKey={"rotations"} tileKey={"euler"}>
                        <EulerTile />
                    </TileContextProvider>
                )
        }
        return <div>hello</div>
    }

    return (
        <RotationsProvider>
            <StyledDockLayout>
                <h1>Rotations Tool</h1>
                <Layout
                    model={Model.fromJson(model)}
                    factory={factory}
                    realtimeResize
                    font={{ size: "14px" }}
                />
            </StyledDockLayout>
        </RotationsProvider>
    )
}
