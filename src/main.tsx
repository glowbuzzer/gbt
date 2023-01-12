import React from "react";
import {createRoot} from "react-dom/client";
import {AppRouter} from "./AppRouter";

import "antd/dist/reset.css"
import "flexlayout-react/style/light.css"

const root = createRoot(document.getElementById("root"))
root.render(<AppRouter/>)
