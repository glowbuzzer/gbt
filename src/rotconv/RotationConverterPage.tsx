import { IJsonModel, Layout, Model, Node } from "flexlayout-react"
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
import { ExportTile } from "./tiles/ExportTile"
import { Helmet } from "react-helmet"
import { EditorTile } from "./tiles/EditorTile"
import { useLocalStorage } from "../util/LocalStorageHook"
import { ROTCONV_LAYOUT } from "./layout"
import { AxisAngleTile } from "./tiles/AxisAngleTile"
import { InfoTile } from "./tiles/InfoTile"
import introJs from "intro.js"

import "intro.js/introjs.css"
import { useEffect } from "react"

const APP_KEY = "rotations"

const countTabs = (node: Node): number => {
    if (node.getType() === "tab") {
        return 1
    } else {
        return node.getChildren().reduce((sum, child) => sum + countTabs(child), 0)
    }
}

function marshall(layout: IJsonModel): Model {
    // check that the layout is valid and contains the number of tiles we expect
    // if we add/remove tiles, we will reload the default layout
    const defaultModel = Model.fromJson(ROTCONV_LAYOUT)
    const defaultTabCount = countTabs(defaultModel.getRoot())
    try {
        const model = Model.fromJson(layout)
        const tabCount = countTabs(model.getRoot())
        if (tabCount !== defaultTabCount) {
            return defaultModel
        }
        return model
    } catch (e) {
        return defaultModel
    }
}

export const RotationConverterPage = () => {
    const [storedLayout, setStoredLayout] = useLocalStorage(APP_KEY, ROTCONV_LAYOUT)
    const [model] = React.useState<Model>(marshall(storedLayout))

    useEffect(() => {
        setTimeout(() => {
            introJs()
                .setOption("dontShowAgain", true)
                .setOption("dontShowAgainCookie", "rotconv-dontShowAgain")
                .start()
        }, 500)
    }, [])

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
            case "axis-angle":
                return (
                    <TileContextProvider appKey={APP_KEY} tileKey={"axis-angle"}>
                        <AxisAngleTile />
                    </TileContextProvider>
                )
            case "scene":
                return <ThreeTransformationViewTile />
            case "info":
                return <InfoTile />
            case "editor":
                return (
                    <TileContextProvider appKey={APP_KEY} tileKey={"editor"}>
                        <EditorTile />
                    </TileContextProvider>
                )
            case "export":
                return (
                    <TileContextProvider appKey={APP_KEY} tileKey={"export"}>
                        <ExportTile />
                    </TileContextProvider>
                )
        }
        return <div>UNKNOWN TILE</div>
    }

    function update_model(model: Model) {
        setStoredLayout(model.toJson())
    }

    return (
        <TransformationProvider>
            <Helmet>
                <title>3D Rotation Converter - by glowbuzzer</title>
                <meta
                    name="description"
                    content="Convert between Euler angles, quaternions, matrices, axis angle and more with glowbuzzer's rotation converter"
                />
            </Helmet>
            <GlobalBanner title={"3D Rotation Converter"} id="rotationconverter" />
            <Layout
                model={model}
                factory={factory}
                onModelChange={update_model}
                realtimeResize
                font={{ size: "14px" }}
            />
        </TransformationProvider>
    )
}
