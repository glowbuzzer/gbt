/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import * as NMATH from "../ik/NMATH"

export default class KinVizGenericSerial extends NMATH.GenericSerial {
    linkColors: string[]
    constructor(linkColors: string[]) {
        super()
        this.linkColors = linkColors
    }
}
