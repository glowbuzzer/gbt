/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

/*!
    PK parameters are used for parallel kinematic mechanisms, and
represent the Cartesian positions of the ends of the link in the
stationary base frame and the moving platform frame. Currently this
only supports prismatic links.
*/

import * as THREE from "three"

export default class PkParams {
    base: THREE.Vector3 /*!< position of fixed end in base frame */
    platform: THREE.Vector3 /*!< position of moving end in platform frame  */
    d: number /*!< the length of the link */
    constructor(
        base: THREE.Vector3 = new THREE.Vector3(),
        platform: THREE.Vector3 = new THREE.Vector3(),
        d: number = 0
    ) {
        this.base = base
        this.platform = platform
        this.d = d
    }
}
