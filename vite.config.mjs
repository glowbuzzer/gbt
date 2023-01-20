/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */


import {defineConfig} from "vite"
import react from "@vitejs/plugin-react";
import svgr from "@svgr/rollup"

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig(() => ({
    plugins: [react(), svgr()],
}))
