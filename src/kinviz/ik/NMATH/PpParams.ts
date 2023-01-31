/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

/*!
  PP parameters represent the pose of the link with respect to the
  previous link. Revolute joints rotate about the Z axis, prismatic
  joints slide along the Z axis.
 */

import { Pose } from "./index"
import * as THREE from "three"

export default class PpParams {
    pose: THREE.Matrix4 /*!< the pose of the link wrt to the previous link */
    constructor(pose: THREE.Matrix4 = new THREE.Matrix4()) {
        this.pose = pose
    }
}
