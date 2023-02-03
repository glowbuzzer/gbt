/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

/*!
  PP parameters represent the pose of the link with respect to the
  previous link. Revolute joints rotate about the Z axis, prismatic
  joints slide along the Z axis.
 */

import * as THREE from "three"

export default class PpParams {
    pose: THREE.Matrix4 /*!< the pose of the link wrt to the previous link */
    posLimit: number
    negLimit: number
    initialOffset: number
    constructor(
        pose: THREE.Matrix4 = new THREE.Matrix4(),
        posLimit: number = 0,
        negLimit: number = 0,
        initialOffset: number = 0
    ) {
        this.pose = pose
        this.posLimit = posLimit
        this.negLimit = negLimit
        this.initialOffset = initialOffset
    }
}
