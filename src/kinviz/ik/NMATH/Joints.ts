/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as NMATH from "./index"
import { LinkQuantities } from "./index"

export function jointsSetInitialOffset(joint: number[], genser: NMATH.GenericSerial): number[] {
    const adjustedJoint: number[] = []
    for (let link = 0; link < genser.link_num; link++) {
        if (
            genser.links[link].type == NMATH.LinkParamRepresentation.LINK_DH ||
            genser.links[link].type == NMATH.LinkParamRepresentation.LINK_MODIFIED_DH
        ) {
            if (genser.links[link].quantity == LinkQuantities.QUANTITY_LENGTH) {
                //prismatic
            } else if (genser.links[link].quantity == LinkQuantities.QUANTITY_ANGLE) {
                //revolute
                adjustedJoint[link] =
                    joint[link] + (genser.links[link].params as NMATH.DhParams).thetaInitialOffset
            } else if (genser.links[link].quantity == LinkQuantities.QUANTITY_NONE) {
                //fixed
            } else {
                //undefined
                throw new Error("setJointInitialOffset: undefined link quantity")
            }
        } else if (genser.links[link].type == NMATH.LinkParamRepresentation.LINK_PP) {
            if (genser.links[link].quantity == LinkQuantities.QUANTITY_LENGTH) {
                //prismatic
            } else if (genser.links[link].quantity == LinkQuantities.QUANTITY_ANGLE) {
                //revolute
                adjustedJoint[link] =
                    joint[link] + (genser.links[link].params as NMATH.DhParams).thetaInitialOffset
            } else if (genser.links[link].quantity == LinkQuantities.QUANTITY_NONE) {
                //fixed
            } else {
                //undefined
                throw new Error("setJointInitialOffset: undefined link quantity")
            }
        } else if (genser.links[link].type == NMATH.LinkParamRepresentation.LINK_URDF) {
            if (genser.links[link].quantity == LinkQuantities.QUANTITY_LENGTH) {
                //prismatic
            } else if (genser.links[link].quantity == LinkQuantities.QUANTITY_ANGLE) {
                //revolute
                adjustedJoint[link] =
                    joint[link] + (genser.links[link].params as NMATH.DhParams).thetaInitialOffset
            } else if (genser.links[link].quantity == LinkQuantities.QUANTITY_NONE) {
                //fixed
            } else {
                //undefined
                throw new Error("setJointInitialOffset: undefined link quantity")
            }
        } else {
            throw new Error("setJointInitialOffset: undefined link type")
        }
    }

    return adjustedJoint
}

export function jointsRemoveInitialOffset(joint: number[], genser: NMATH.GenericSerial): number[] {
    const adjustedJoint: number[] = []
    for (let link = 0; link < genser.link_num; link++) {
        if (
            genser.links[link].type == NMATH.LinkParamRepresentation.LINK_DH ||
            genser.links[link].type == NMATH.LinkParamRepresentation.LINK_MODIFIED_DH
        ) {
            if (genser.links[link].quantity == LinkQuantities.QUANTITY_LENGTH) {
                //prismatic
            } else if (genser.links[link].quantity == LinkQuantities.QUANTITY_ANGLE) {
                //revolute
                adjustedJoint[link] =
                    joint[link] - (genser.links[link].params as NMATH.DhParams).thetaInitialOffset
            } else if (genser.links[link].quantity == LinkQuantities.QUANTITY_NONE) {
                //fixed
            } else {
                //undefined
                throw new Error("setJointInitialOffset: undefined link quantity")
            }
        } else if (genser.links[link].type == NMATH.LinkParamRepresentation.LINK_PP) {
            if (genser.links[link].quantity == LinkQuantities.QUANTITY_LENGTH) {
                //prismatic
            } else if (genser.links[link].quantity == LinkQuantities.QUANTITY_ANGLE) {
                //revolute
                adjustedJoint[link] =
                    joint[link] + (genser.links[link].params as NMATH.DhParams).thetaInitialOffset
            } else if (genser.links[link].quantity == LinkQuantities.QUANTITY_NONE) {
                //fixed
            } else {
                //undefined
                throw new Error("setJointInitialOffset: undefined link quantity")
            }
        } else if (genser.links[link].type == NMATH.LinkParamRepresentation.LINK_URDF) {
            if (genser.links[link].quantity == LinkQuantities.QUANTITY_LENGTH) {
                //prismatic
            } else if (genser.links[link].quantity == LinkQuantities.QUANTITY_ANGLE) {
                //revolute
                adjustedJoint[link] =
                    joint[link] + (genser.links[link].params as NMATH.DhParams).thetaInitialOffset
            } else if (genser.links[link].quantity == LinkQuantities.QUANTITY_NONE) {
                //fixed
            } else {
                //undefined
                throw new Error("setJointInitialOffset: undefined link quantity")
            }
        } else {
            throw new Error("setJointInitialOffset: undefined link type")
        }
    }

    return adjustedJoint
}
