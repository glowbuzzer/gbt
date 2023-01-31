/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

// /*!
//   URDF parameters represent the pose of the link with respect to the
//   previous link. Revolute joints rotate about the axis specified, prismatic
//   joints slide along the axis specified.
//  */
// interface Igo_urdf {
//     pose: go_pose /*!< the pose of the link wrt to the previous link */
//     axis: go_cart /*!< the axis of rotation or translation */
// }
//
// class go_urdf implements Igo_urdf {
//     pose: go_pose /*!< the pose of the link wrt to the previous link */
//     axis: go_cart /*!< the axis of rotation or translation */
//     constructor(
//         pose: go_pose = { tran: { x: 0, y: 0, z: 0 }, rot: { s: 1, x: 0, y: 0, z: 0 } },
//         axis: go_cart = {
//             x: 0,
//             y: 0,
//             z: 0
//         }
//     ) {
//         this.pose = pose
//         this.axis = axis
//     }
// }
/*!
  URDF parameters represent the pose of the link with respect to the
  previous link. Revolute joints rotate about the axis specified, prismatic
  joints slide along the axis specified.
 */

import * as THREE from "three"

class go_urdf {
    pose: THREE.Matrix4 /*!< the pose of the link wrt to the previous link */
    axis: THREE.Vector3 /*!< the axis of rotation or translation */
    constructor(
        pose: THREE.Matrix4 = new THREE.Matrix4(),
        axis: THREE.Vector3 = new THREE.Vector3()
    ) {
        this.pose = pose
        this.axis = axis
    }
}
