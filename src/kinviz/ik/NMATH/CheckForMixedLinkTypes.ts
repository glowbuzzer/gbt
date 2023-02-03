/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { KinematicsLink, LinkParamRepresentation } from "./index"

export default function checkForMixedLinkTypes(links: KinematicsLink[]): boolean {
    const numberOfLinks = links.length

    let dhCount = 0
    let modifiedDhCount = 0
    let ppCount = 0
    let urdfCount = 0

    for (let i = 0; i < numberOfLinks; i++) {
        if (links[i].type == LinkParamRepresentation.LINK_DH) {
            dhCount++
        } else if (links[i].type == LinkParamRepresentation.LINK_MODIFIED_DH) {
            modifiedDhCount++
        } else if (links[i].type == LinkParamRepresentation.LINK_PP) {
            ppCount++
        } else if (links[i].type == LinkParamRepresentation.LINK_URDF) {
            urdfCount++
        }
    }

    if (dhCount == numberOfLinks) {
        return false
    } else if (modifiedDhCount == numberOfLinks) {
        return false
    } else if (ppCount == numberOfLinks) {
        return false
    } else if (urdfCount == numberOfLinks) {
        return false
    } else {
        return true
    }
}
