/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { KinematicsLink } from "./index"

export default class GenericSerial {
    name: string
    links: KinematicsLink[]
    link_num: number
    iterations: number
    max_iterations: number

    constructor(
        name: string = "",
        links: KinematicsLink[] = [new KinematicsLink()],
        link_num: number = 0,
        iterations: number = 0,
        max_iterations: number = 0
    ) {
        this.name = name
        this.links = links
        this.link_num = link_num
        this.iterations = iterations
        this.max_iterations = max_iterations
    }
}
