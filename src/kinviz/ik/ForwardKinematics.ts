/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"
import * as NMATH from "./NMATH/index"

export function forwardKinematics(
    genser: NMATH.GenericSerial,
    joints: number[]
): { pose: THREE.Matrix4 } {
    const linkout: NMATH.KinematicsLink[] = []

    for (let link = 0; link < genser.link_num; link++) {
        linkout[link] = genser.links[link].jointSet(joints[link], true)
    }

    // console.log("linkout: ", linkout)
    const fwd = NMATH.PoseBuild(linkout, genser.link_num)
    // console.log("fwd: ", fwd)

    return fwd
}
