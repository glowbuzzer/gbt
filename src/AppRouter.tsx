import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { TransformationPage } from "./transformation/TransformationPage"
import { GlobalLayout } from "./styles"
import { KinVizTool } from "./kinviz/KinVizTool"

export const AppRouter = () => {
    // add react router 6 code to switch between the different apps
    return (
        <GlobalLayout>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<TransformationPage />} />
                    <Route path="/kinviz" element={<KinVizTool />} />
                    <Route path="/trconv" element={<TransformationPage />} />
                </Routes>
            </BrowserRouter>
        </GlobalLayout>
    )
}
