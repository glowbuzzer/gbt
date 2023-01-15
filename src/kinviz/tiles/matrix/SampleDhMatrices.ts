/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import niceColors from "nice-color-palettes"
import { LinkTypeEnum, UnitsEnum, SampleDhProps, DataType } from "../types"

export const defaultDhMatrix: DataType[] = [
    {
        key: "0",
        alpha: 45,
        theta: 0,
        initialOffset: 0,
        a: 150,
        d: 100,
        jointType: 0,
        min: -170,
        max: 170,
        color: niceColors.flat()[0]
    },
    {
        key: "1",
        alpha: 45,
        theta: 0,
        initialOffset: 0,
        a: 100,
        d: 100,
        jointType: 0,
        min: -180,
        max: 180,
        color: niceColors.flat()[1]
    }
]

export const sampleDhMatrices: SampleDhProps[] = [
    {
        name: "Staubli TX40",
        matrixType: 0,
        units: UnitsEnum.UNITS_MM,
        matrix: [
            {
                key: "0",
                alpha: 45,
                theta: 0,
                initialOffset: 0,
                a: 1.5,
                d: 1,
                jointType: 0,
                min: -170,
                max: 170,
                color: niceColors.flat()[9]
            },
            {
                key: "1",
                alpha: 45,
                theta: 0,
                initialOffset: 0,
                a: 1,
                d: 1,
                jointType: 0,
                min: -180,
                max: 180,
                color: niceColors.flat()[10]
            }
        ]
    },
    {
        name: "Puma",
        units: UnitsEnum.UNITS_M,
        matrixType: 0,
        matrix: [
            {
                key: "0",
                alpha: -90,
                theta: 0,
                initialOffset: 0,
                a: 0,
                d: 0.77421,
                jointType: 0,
                min: -170,
                max: 170,
                color: niceColors.flat()[0]
            },
            {
                key: "1",
                alpha: 180,
                theta: 0,
                initialOffset: 0,
                a: 0.506628,
                d: 0.101592,
                jointType: 0,
                min: -180,
                max: 180,
                color: niceColors.flat()[1]
            },
            {
                key: "2",
                alpha: -90,
                theta: 0,
                initialOffset: 0,
                a: 0.02,
                d: -0.0381,
                jointType: 0,
                min: -180,
                max: 180,
                color: niceColors.flat()[2]
            },
            {
                key: "3",
                alpha: 90,
                theta: 0,
                initialOffset: 0,
                a: 0,
                d: 0.267969,
                jointType: 0,
                min: -180,
                max: 180,
                color: niceColors.flat()[3]
            },
            {
                key: "4",
                alpha: -90,
                theta: 0,
                initialOffset: 0,
                a: 0,
                d: 0,
                jointType: 0,
                min: -180,
                max: 180,
                color: niceColors.flat()[4]
            },
            {
                key: "5",
                alpha: 0,
                theta: 0,
                initialOffset: 0,
                a: 0,
                d: 0.05842,
                jointType: 0,
                min: -180,
                max: 180,
                color: niceColors.flat()[5]
            }
        ]
    },
    {
        name: "Scara",
        matrixType: 0,
        units: UnitsEnum.UNITS_M,
        matrix: [
            {
                key: "0",
                alpha: 0,
                theta: 0,
                initialOffset: 0,
                a: 0.2,
                d: 0.3,
                jointType: 0,
                min: -170,
                max: 170,
                color: niceColors.flat()[0]
            },
            {
                key: "1",
                alpha: 180,
                theta: 0,
                initialOffset: 0,
                a: 0.15,
                d: 0.1,
                jointType: 0,
                min: -180,
                max: 180,
                color: niceColors.flat()[1]
            },
            {
                key: "2",
                alpha: 0,
                theta: 0,
                initialOffset: 0.1,
                a: 0,
                d: 0,
                jointType: 1,
                min: -0.3,
                max: 0,
                color: niceColors.flat()[2]
            },
            {
                key: "3",
                alpha: 0,
                theta: 0,
                initialOffset: 0,
                a: 0,
                d: 0,
                jointType: 0,
                min: -180,
                max: 180,
                color: niceColors.flat()[3]
            }
        ]
    }
]

// export const SampleDhSelect: SampleDhSelectProps[] = [
//   { value: 0, label: staubliTx40.name },
//   { value: 1, label: "Modified DH parameters" },
// ];

/*
puma
0.77421


 */
