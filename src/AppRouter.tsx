import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { RotationConverterPage } from "./rotconv/RotationConverterPage"
import { GlobalLayout } from "./styles"
import { KinVizTool } from "./kinviz/KinVizTool"
import { HomePage } from "./HomePage"

export const AppRouter = () => {
    // add react router 6 code to switch between the different apps
    return (
        <GlobalLayout>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/kinviz" element={<KinVizTool />} />
                    <Route path="/rotationconverter" element={<RotationConverterPage />} />
                </Routes>
            </BrowserRouter>
        </GlobalLayout>
    )
}
