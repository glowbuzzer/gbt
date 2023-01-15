import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { RotationsTool } from "./rotations/RotationsTool"
import { GlobalLayout } from "./styles"
import { KinVizTool } from "./kinviz/KinVizTool"

export const AppRouter = () => {
    // add react router 6 code to switch between the different apps
    return (
        <GlobalLayout>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<RotationsTool />} />
                    <Route path="/kv" element={<KinVizTool />} />
                </Routes>
            </BrowserRouter>
        </GlobalLayout>
    )
}
