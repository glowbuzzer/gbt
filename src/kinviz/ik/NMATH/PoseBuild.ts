/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { DhParams, PpParams, UrdfParams, KinematicsLink, LinkParamRepresentation } from "./index"
import * as THREE from "three"
export default function PoseBuild(
    link_params: KinematicsLink[],
    numberOfLinks: number
): { pose: THREE.Matrix4 } {
    const pose: THREE.Matrix4 = new THREE.Matrix4().identity()
    const p: THREE.Matrix4 = new THREE.Matrix4()
    for (let link = 0; link < numberOfLinks; link++) {
        if (LinkParamRepresentation.LINK_DH == link_params[link].type) {
            p.copy(
                (link_params[link].params as DhParams).toPose(false, link_params[link].angularUnits)
            )
            pose.multiply(p)
        } else if (LinkParamRepresentation.LINK_MODIFIED_DH == link_params[link].type) {
            p.copy(
                (link_params[link].params as DhParams).toPose(true, link_params[link].angularUnits)
            )

            pose.multiply(p)
        } else if (LinkParamRepresentation.LINK_PP == link_params[link].type) {
            p.copy((link_params[link].params as PpParams).pose)
            pose.multiply(p)
        } else if (LinkParamRepresentation.LINK_URDF == link_params[link].type) {
            p.copy((link_params[link].params as UrdfParams).pose)
            pose.multiply(p)
        } else {
            throw new Error("PoseBuild: unknown link type")
        }
    }
    return { pose: pose }
}
