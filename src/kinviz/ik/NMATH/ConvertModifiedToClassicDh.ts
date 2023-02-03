/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import KinematicsLink from "./KinematicsLink"
import { LinkParamRepresentation } from "./LinkParamRepresentation"
import { LinkQuantities } from "./LinkQuantities"
import DhParams from "./DhParams"

export default function convertModifiedToClassicDh(links: KinematicsLink[]): KinematicsLink[] {
    const numberOfLinks = links.length
    const newLinks: KinematicsLink[] = []

    //First link
    //   base = r.base * SE3(r.links(1).a, 0, 0) * SE3.Rx(r.links(1).alpha);

    // if (
    //     links[0].type == LinkParamRepresentation.LINK_DH ||
    //     links[0].type == LinkParamRepresentation.LINK_MODIFIED_DH
    // ) {
    //     newLinks[0] = new KinematicsLink()
    //     const dhNew = newLinks[0].params as DhParams
    //     const dhCurrent = links[0].params as DhParams
    //     newLinks[0].type = LinkParamRepresentation.LINK_MODIFIED_DH
    //     newLinks[0].quantity = LinkQuantities.QUANTITY_ANGLE
    //     newLinks[0].body.copy(links[0].body)
    //     dhNew.thetaInitialOffset = dhCurrent.thetaInitialOffset
    //     dhNew.theta = dhCurrent.theta
    //     dhNew.positiveLimit = dhCurrent.positiveLimit
    //     dhNew.negativeLimit = dhCurrent.negativeLimit
    //     if (links[0].quantity == LinkQuantities.QUANTITY_ANGLE) {
    //         dhNew.a = dhCurrent.a
    //         dhNew.alpha = 0
    //         dhNew.d = dhCurrent.d
    //         //theta is variable and d is fixed
    //         dhNew.theta = dhCurrent.theta
    //     } else if (links[0].quantity == LinkQuantities.QUANTITY_LENGTH) {
    //     } else if (links[0].quantity == LinkQuantities.QUANTITY_NONE) {
    //         // ?
    //     } else {
    //         throw new Error(
    //             "convertClassicToModifiedDhParams: link quantity is not ANGLE or LENGTH or NONE"
    //         )
    //     }
    // } else {
    //     throw new Error("convertClassicToModifiedDhParams: link type is not DH or MODIFIED_DH")
    // }

    //Middle links
    for (let i = 0; i < numberOfLinks - 1; i++) {
        if (
            links[i].type == LinkParamRepresentation.LINK_DH ||
            links[i].type == LinkParamRepresentation.LINK_MODIFIED_DH
        ) {
            newLinks[i] = new KinematicsLink()
            const dhNew = newLinks[i].params as DhParams
            const dhCurrent = links[i].params as DhParams
            const dhNext = links[i + 1].params as DhParams
            newLinks[i].type = LinkParamRepresentation.LINK_MODIFIED_DH
            newLinks[i].quantity = LinkQuantities.QUANTITY_ANGLE
            newLinks[i].body.copy(links[i].body)
            dhNew.thetaInitialOffset = dhCurrent.thetaInitialOffset
            dhNew.theta = dhCurrent.theta
            dhNew.positiveLimit = dhCurrent.positiveLimit
            dhNew.negativeLimit = dhCurrent.negativeLimit

            if (links[i].quantity == LinkQuantities.QUANTITY_ANGLE) {
                dhNew.a = dhNext.a
                dhNew.alpha = dhNext.alpha
                dhNew.d = dhCurrent.d

                // link(i) = Link('standard', 'revolute', ...
                //   'a', r.links(i+1).a, ...
                //   'alpha', r.links(i+1).alpha, ...
                //   'd', r.links(i).d, ...
                //   'offset', r.links(i).offset, ...
                //   'qlim', r.links(i).qlim );
            } else if (links[i].quantity == LinkQuantities.QUANTITY_LENGTH) {
                dhNew.a = dhNext.a
                dhNew.alpha = dhNext.alpha
                dhNew.theta = dhCurrent.theta

                // link(i) = Link('standard', 'prismatic', ...
                //   'a', r.links(i+1).a, ...
                //   'alpha', r.links(i+1).alpha, ...
                //   'theta', r.links(i).theta, ...
                //   'offset', r.links(i).offset, ...
                //   'qlim', r.links(i).qlim );
            } else if (links[i].quantity == LinkQuantities.QUANTITY_NONE) {
            } else {
                throw new Error(
                    "convertClassicToModifiedDhParams: link quantity is not ANGLE or LENGTH or NONE"
                )
            }
        } else {
            throw new Error("convertClassicToModifiedDhParams: link type is not DH or MODIFIED_DH")
        }
    }

    if (
        links[numberOfLinks - 1].type == LinkParamRepresentation.LINK_DH ||
        links[numberOfLinks - 1].type == LinkParamRepresentation.LINK_MODIFIED_DH
    ) {
        newLinks[numberOfLinks - 1] = new KinematicsLink()
        const dhNew = newLinks[numberOfLinks - 1].params as DhParams
        const dhCurrent = links[numberOfLinks - 1].params as DhParams
        newLinks[numberOfLinks - 1].type = LinkParamRepresentation.LINK_MODIFIED_DH
        newLinks[numberOfLinks - 1].quantity = LinkQuantities.QUANTITY_ANGLE
        newLinks[numberOfLinks - 1].body.copy(links[numberOfLinks - 1].body)
        dhNew.thetaInitialOffset = dhCurrent.thetaInitialOffset
        dhNew.theta = dhCurrent.theta
        dhNew.positiveLimit = dhCurrent.positiveLimit
        dhNew.negativeLimit = dhCurrent.negativeLimit
        if (links[numberOfLinks - 1].quantity == LinkQuantities.QUANTITY_ANGLE) {
            dhNew.a = dhCurrent.a
            dhNew.alpha = 0
            dhNew.d = dhCurrent.d
            //theta is variable and d is fixed
            dhNew.theta = dhCurrent.theta
        } else if (links[numberOfLinks - 1].quantity == LinkQuantities.QUANTITY_LENGTH) {
        } else if (links[numberOfLinks - 1].quantity == LinkQuantities.QUANTITY_NONE) {
            // ?
        } else {
            throw new Error(
                "convertClassicToModifiedDhParams: link quantity is not ANGLE or LENGTH or NONE"
            )
        }
    } else {
        throw new Error("convertClassicToModifiedDhParams: link type is not DH or MODIFIED_DH")
    }

    return newLinks
}

//Last link

// if (links[numberOfLinks].type==LinkParamRepresentation.LINK_DH || links[numberOfLinks].type==LinkParamRepresentation.LINK_MODIFIED_DH) {
//
//   if(links[numberOfLinks].quantity == LinkQuantities.QUANTITY_ANGLE){
//     link(r.n) = Link('standard', 'revolute', ...
//       'd', r.links(r.n).d, ...
//       'offset', r.links(r.n).offset, ...
//       'qlim', r.links(r.n).qlim );
//
//   }else if(links[numberOfLinks].quantity == LinkQuantities.QUANTITY_LENGTH){
//     link(r.n) = Link('standard', 'prismatic', ...
//       'theta', r.links(r.n).theta, ...
//       'offset', r.links(r.n).offset, ...
//       'qlim', r.links(r.n).qlim );
//
//   }else if(links[numberOfLinks].quantity == LinkQuantities.QUANTITY_NONE){
//
//   }else{
//     throw new Error("convertClassicToModifiedDhParams: link quantity is not ANGLE or LENGTH or NONE")
//   }

// }
