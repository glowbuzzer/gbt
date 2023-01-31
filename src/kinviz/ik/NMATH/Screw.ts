/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"

export default class Screw {
    v: THREE.Vector3
    w: THREE.Vector3

    constructor(v: THREE.Vector3 = new THREE.Vector3(), w: THREE.Vector3 = new THREE.Vector3()) {
        this.v = v
        this.w = w
    }
}
