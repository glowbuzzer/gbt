import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {RotationsTool} from "./rotations/RotationsTool";

export const AppRouter=() => {
    // add react router 6 code to switch between the different apps
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RotationsTool />} />
            </Routes>
        </BrowserRouter>
    )
}