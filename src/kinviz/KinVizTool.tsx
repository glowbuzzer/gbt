/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { IJsonModel, Layout, Model, Node } from "flexlayout-react"
import { KinVizProvider } from "./KinVizProvider"
import * as React from "react"
import { MatrixTile } from "./tiles/matrix/MatrixTile"

import { LoadSaveTile } from "./tiles/LoadSaveTile"
import { JacobianTile } from "./tiles/JacobianTile"
import { GlobalBanner } from "../GlobalBanner"
import { TileContextProvider } from "../util/TileContextProvider"
import { ControlsTile } from "./tiles/ControlsTile"

import { ThreeDimensionalViewTile } from "./tiles/ThreeDimensionalViewTile"

import * as IK from "./ik/IkMath"

import { Helmet } from "react-helmet"
import { computeForwardJacobian } from "./ik/ForwardJacobian"

export const KinVizTool = () => {
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
                    weight: 50,
                    children: [
                        {
                            type: "tabset",
                            id: "left1",
                            enableDeleteWhenEmpty: false,
                            children: [
                                {
                                    type: "tab",
                                    id: "loadSave",
                                    name: "Load and save"
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "row",
                    children: [
                        {
                            type: "tabset",
                            id: "middle1",
                            children: [
                                {
                                    type: "tabs",
                                    id: "threeDimensionalView",
                                    name: "Three-dimensional view"
                                }
                            ]
                        },
                        {
                            type: "tabset",
                            id: "middle2",
                            children: [
                                {
                                    type: "tabs",
                                    id: "matrix",
                                    name: "Matrix"
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "tabset",
                    id: "right1",
                    weight: 30,
                    children: [
                        {
                            type: "tab",
                            id: "controls",
                            name: "Controls"
                        },
                        {
                            type: "tab",
                            id: "jacobian",
                            name: "Jacobian"
                        }
                    ]
                }
            ]
        }
    }

    function factory(node: Node) {
        switch (node.getId()) {
            case "matrix":
                return (
                    <TileContextProvider appKey={"kinviz"} tileKey={"matrix"}>
                        <MatrixTile />
                    </TileContextProvider>
                )
            case "loadSave":
                return (
                    <TileContextProvider appKey={"kinviz"} tileKey={"loadSave"}>
                        <LoadSaveTile />
                    </TileContextProvider>
                )
            case "threeDimensionalView":
                return (
                    <TileContextProvider appKey={"kinviz"} tileKey={"threeDimensionalView"}>
                        {/*<ThreeDimensionalViewTile />*/}
                    </TileContextProvider>
                )
            case "controls":
                return (
                    <TileContextProvider appKey={"kinviz"} tileKey={"controls"}>
                        {/*<ControlsTile />*/}
                    </TileContextProvider>
                )
            case "jacobian":
                return (
                    <TileContextProvider appKey={"kinviz"} tileKey={"jacobian"}>
                        <JacobianTile />
                    </TileContextProvider>
                )
        }
        return <div>hello</div>
    }

    return (
        <KinVizProvider>
            <Helmet>
                <title>Kinematics Visualizer - by glowbuzzer</title>
                <meta
                    name="description"
                    content="A tool to visualize kinematics chains. Supports DH matrices"
                />
            </Helmet>
            <GlobalBanner title={"Kinematics Visualization Tool"} id="kinviz" />
            <Layout
                model={Model.fromJson(model)}
                factory={factory}
                realtimeResize
                font={{ size: "14px" }}
            />
        </KinVizProvider>
    )
}
