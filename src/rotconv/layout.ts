import { IJsonModel } from "flexlayout-react"

export const ROTCONV_LAYOUT: IJsonModel = {
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
                                id: "axis-angle",
                                name: "Axis + Angle"
                            },
                            {
                                type: "tab",
                                id: "translation",
                                name: "Translation"
                            }
                        ]
                    },
                    {
                        type: "row",
                        id: "editor-export",
                        children: [
                            {
                                type: "tabset",
                                id: "left6",
                                children: [
                                    {
                                        type: "tab",
                                        id: "editor",
                                        name: "Edit"
                                    }
                                ]
                            },
                            {
                                type: "tabset",
                                id: "left7",
                                children: [
                                    {
                                        type: "tab",
                                        id: "export",
                                        name: "Export"
                                    }
                                ]
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
