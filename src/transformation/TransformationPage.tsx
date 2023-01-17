import { IJsonModel, Layout, Model, Node } from "flexlayout-react"
import { GlobalLayout } from "../styles"
import { TransformationProvider } from "./TransformationProvider"
import { QuaternionTile } from "./tiles/QuaternionTile"
import * as React from "react"
import { EulerTile } from "./tiles/EulerTile"
import { TileContextProvider } from "../util/TileContextProvider"
import { GlobalBanner } from "../GlobalBanner"
import { ThreeTransformationViewTile } from "./tiles/ThreeTransformationViewTile"
import { TranslationTile } from "./tiles/TranslationTile"
import { Matrix3Tile } from "./tiles/Matrix3Tile"
import { Matrix4Tile } from "./tiles/Matrix4Tile"

export const TransformationPage = () => {
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
                        },
                        {
                            type: "tabset",
                            id: "left3",
                            children: [
                                {
                                    type: "tab",
                                    id: "matrix4",
                                    name: "Matrix4"
                                }
                            ]
                        },
                        {
                            type: "tabset",
                            id: "left4",
                            children: [
                                {
                                    type: "tab",
                                    id: "matrix3",
                                    name: "Matrix3"
                                }
                            ]
                        },
                        {
                            type: "tabset",
                            id: "left5",
                            children: [
                                {
                                    type: "tab",
                                    id: "translation",
                                    name: "Translation"
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
                            children: [
                                {
                                    type: "tab",
                                    id: "scene",
                                    name: "Visualization"
                                }
                            ]
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
            case "matrix4":
                return (
                    <TileContextProvider appKey={"rotations"} tileKey={"matrix4"}>
                        <Matrix4Tile />
                    </TileContextProvider>
                )
            case "matrix3":
                return (
                    <TileContextProvider appKey={"rotations"} tileKey={"matrix3"}>
                        <Matrix3Tile />
                    </TileContextProvider>
                )
            case "translation":
                return (
                    <TileContextProvider appKey={"rotations"} tileKey={"translation"}>
                        <TranslationTile />
                    </TileContextProvider>
                )
            case "scene":
                return <ThreeTransformationViewTile />
        }
        return <div>hello</div>
    }

    return (
        <TransformationProvider>
            <GlobalBanner title={"3D Transformation Converter"} id="trconv" />
            <Layout
                model={Model.fromJson(model)}
                factory={factory}
                realtimeResize
                font={{ size: "14px" }}
            />
        </TransformationProvider>
    )
}
