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
import { CopyPasteTile } from "./tiles/CopyPasteTile"
import { Helmet } from "react-helmet"

const APP_KEY = "rotations"

export const RotationConverterPage = () => {
    const model: IJsonModel = {
        global: {
            tabSetEnableMaximize: false,
            borderBarSize: 1,
            borderSize: 1,
            tabBorderWidth: 1,
            splitterSize: 5,
            tabEnableClose: false
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
                                },
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
                        },
                        {
                            type: "tabset",
                            id: "left6",
                            children: [
                                {
                                    type: "tab",
                                    id: "clipboard",
                                    name: "Copy and Paste"
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
                    <TileContextProvider appKey={APP_KEY} tileKey={"quaternion"}>
                        <QuaternionTile />
                    </TileContextProvider>
                )
            case "euler":
                return (
                    <TileContextProvider appKey={APP_KEY} tileKey={"euler"}>
                        <EulerTile />
                    </TileContextProvider>
                )
            case "matrix4":
                return (
                    <TileContextProvider appKey={APP_KEY} tileKey={"matrix4"}>
                        <Matrix4Tile />
                    </TileContextProvider>
                )
            case "matrix3":
                return (
                    <TileContextProvider appKey={APP_KEY} tileKey={"matrix3"}>
                        <Matrix3Tile />
                    </TileContextProvider>
                )
            case "translation":
                return (
                    <TileContextProvider appKey={APP_KEY} tileKey={"translation"}>
                        <TranslationTile />
                    </TileContextProvider>
                )
            case "scene":
                return <ThreeTransformationViewTile />
            case "clipboard":
                return (
                    <TileContextProvider appKey={APP_KEY} tileKey={"clipboard"}>
                        <CopyPasteTile />
                    </TileContextProvider>
                )
        }
        return <div>UNKNOWN TILE</div>
    }

    return (
        <TransformationProvider>
            <Helmet>
                <title>3D Rotation Converter - by glowbuzzer</title>
                <meta
                    name="description"
                    content="A tool to convert between different representations of 3D rotations"
                />
            </Helmet>
            <GlobalBanner title={"3D Rotation Converter"} id="rotationconverter" />
            <Layout
                model={Model.fromJson(model)}
                factory={factory}
                realtimeResize
                font={{ size: "14px" }}
            />
        </TransformationProvider>
    )
}
