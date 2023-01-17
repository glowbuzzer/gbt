/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { IJsonModel, Layout, Model, Node } from "flexlayout-react"
import { GlobalLayout } from "../styles"
import { KinVizProvider } from "./KinVizProvider"
import * as React from "react"
import { MatrixTile } from "./tiles/matrix/MatrixTile"

import { LoadSaveTile } from "./tiles/LoadSaveTile"

import { GlobalBanner } from "../GlobalBanner"
import { TileContextProvider } from "../util/TileContextProvider"
import { QuaternionTile } from "../transformation/tiles/QuaternionTile"
import { EulerTile } from "../transformation/tiles/EulerTile"
import { ControlsTile } from "./tiles/ControlsTile"

import { ThreeDimensionalViewTile } from "./tiles/ThreeDimensionalViewTile"

import { go_matrix } from "./ik/IkMath"
import { compute_jinv } from "./ik/GenericSixdofKin"

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
                                    type: "tabset",
                                    id: "matrix",
                                    name: "Matrix"
                                },
                                {
                                    type: "tabset",
                                    id: "threeDimensionalView",
                                    name: "Three-dimensional view"
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
                        <ThreeDimensionalViewTile />
                    </TileContextProvider>
                )
            case "controls":
                return (
                    <TileContextProvider appKey={"kinviz"} tileKey={"controls"}>
                        <ControlsTile />
                    </TileContextProvider>
                )
        }
        return <div>hello</div>
    }

    // 4 5 −8 −5 −6 9 −2 −2 3

    const testm: go_matrix = new go_matrix(3, 3, [
        [0, -3, -2],
        [1, -4, -2],
        [-3, 4, 1]
    ])
    console.log("testm", testm)
    const res = compute_jinv(testm)
    console.log(res)

    return (
        <KinVizProvider>
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
