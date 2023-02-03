/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import KinematicsLink from "./KinematicsLink"
import { LinkParamRepresentation } from "./LinkParamRepresentation"
import { LinkQuantities } from "./LinkQuantities"
import DhParams from "./DhParams"
import * as NMATH from "./index"

export default function convertClassicToModifiedDh(links: KinematicsLink[]): KinematicsLink[] {
    const numberOfLinks = links.length
    const newLinks: KinematicsLink[] = []

    //First link
    if (
        links[0].type == LinkParamRepresentation.LINK_DH ||
        links[0].type == LinkParamRepresentation.LINK_MODIFIED_DH
    ) {
        newLinks[0] = new KinematicsLink()
        const dhNew = newLinks[0].params as DhParams
        const dhCurrent = links[0].params as DhParams
        newLinks[0].type = LinkParamRepresentation.LINK_MODIFIED_DH
        newLinks[0].quantity = LinkQuantities.QUANTITY_ANGLE
        newLinks[0].body.copy(links[0].body)
        dhNew.thetaInitialOffset = dhCurrent.thetaInitialOffset
        dhNew.theta = dhCurrent.theta
        dhNew.positiveLimit = dhCurrent.positiveLimit
        dhNew.negativeLimit = dhCurrent.negativeLimit
        if (links[0].quantity == LinkQuantities.QUANTITY_ANGLE) {
            dhNew.a = dhCurrent.a
            dhNew.alpha = 0
            dhNew.d = dhCurrent.d
            //theta is variable and d is fixed
            dhNew.theta = dhCurrent.theta
            // link(1) = Link('modified', 'revolute', ...
            //   'd', r.links(1).d, ...
            //   'offset', r.links(1).offset, ...
            //   'qlim', r.links(1).qlim );
        } else if (links[0].quantity == LinkQuantities.QUANTITY_LENGTH) {
            dhNew.a = dhCurrent.a
            dhNew.alpha = dhCurrent.alpha
            dhNew.d = dhCurrent.d
            dhNew.theta = dhCurrent.theta

            // link(1) = Link('modified', 'prismatic', ...
            //   'theta', r.links(1).theta, ...
            //   'offset', r.links(1).offset, ...
            //   'qlim', r.links(1).qlim );
        } else if (links[0].quantity == LinkQuantities.QUANTITY_NONE) {
            // ?
        } else {
            throw new Error(
                "convertClassicToModifiedDhParams: link quantity is not ANGLE or LENGTH or NONE"
            )
        }
    } else {
        throw new Error("convertClassicToModifiedDhParams: link type is not DH or MODIFIED_DH")
    }

    //Middle links
    for (let i = 1; i < numberOfLinks; i++) {
        if (
            links[i].type == LinkParamRepresentation.LINK_DH ||
            links[i].type == LinkParamRepresentation.LINK_MODIFIED_DH
        ) {
            newLinks[i] = new KinematicsLink()
            const dhNew = newLinks[i].params as DhParams
            const dhPrevious = links[i - 1].params as DhParams
            const dhCurrent = links[i].params as DhParams

            newLinks[i].type = LinkParamRepresentation.LINK_MODIFIED_DH
            newLinks[i].quantity = LinkQuantities.QUANTITY_ANGLE
            newLinks[i].body.copy(links[0].body)
            dhNew.thetaInitialOffset = dhCurrent.thetaInitialOffset
            dhNew.theta = dhCurrent.theta
            dhNew.positiveLimit = dhCurrent.positiveLimit
            dhNew.negativeLimit = dhCurrent.negativeLimit

            if (links[i].quantity == LinkQuantities.QUANTITY_ANGLE) {
                dhNew.a = dhPrevious.a
                dhNew.alpha = dhPrevious.alpha
                dhNew.d = dhCurrent.d

                // link(i) = Link('modified', 'revolute', ...
                //   'a', r.links(i-1).a, ...
                //   'alpha', r.links(i-1).alpha, ...
                //   'd', r.links(i).d, ...
                //   'offset', r.links(i).offset, ...
                //   'qlim', r.links(i).qlim )
            } else if (links[i].quantity == LinkQuantities.QUANTITY_LENGTH) {
                // link(i) = Link('modified', 'prismatic', ...
                //   'a', r.links(i-1).a, ...
                //   'alpha', r.links(i-1).alpha, ...
                //   'theta', r.links(i).theta, ...
                //   'offset', r.links(i).offset, ...
                //   'qlim', r.links(i).qlim );
                dhNew.a = dhPrevious.a
                dhNew.alpha = dhPrevious.alpha
                dhNew.theta = dhCurrent.theta
                //d is variable
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
    return newLinks

    //
    // //Last link
    // tool = SE3(r.links(r.n).a, 0, 0) * SE3.Rx(r.links(r.n).alpha) * r.tool
    //
    // rmdh = SerialLink(link, "base", r.base, "tool", tool)
    //
    // if (
    //     links[numberOfLinks].type == LinkParamRepresentation.LINK_DH ||
    //     links[numberOfLinks].type == LinkParamRepresentation.LINK_MODIFIED_DH
    // ) {
    //     if (links[numberOfLinks].quantity == LinkQuantities.QUANTITY_ANGLE) {
    //     } else if (links[numberOfLinks].quantity == LinkQuantities.QUANTITY_LENGTH) {
    //     } else if (links[numberOfLinks].quantity == LinkQuantities.QUANTITY_NONE) {
    //     } else {
    //         throw new Error(
    //             "convertClassicToModifiedDhParams: link quantity is not ANGLE or LENGTH or NONE"
    //         )
    //     }
    // } else {
    //     throw new Error("convertClassicToModifiedDhParams: link type is not DH or MODIFIED_DH")
    // }
}
/*
 %SerialLink.MDH  Convert standard DH model to modified
        %
        % rmdh = R.MDH() is a SerialLink object that represents the same kinematics
        % as R but expressed using modified DH parameters.
        %
        % Notes::
        % - can only be applied to a model expressed with standard DH parameters.
        %
        % See also:  DH

            assert(isdh(r), 'RTB:SerialLink:badmodel', 'this method can only be applied to a model with standard DH parameters');

            % first joint
            switch r.config(1)
                case 'R'
                    link(1) = Link('modified', 'revolute', ...
                        'd', r.links(1).d, ...
                        'offset', r.links(1).offset, ...
                        'qlim', r.links(1).qlim );
                case 'P'
                    link(1) = Link('modified', 'prismatic', ...
                        'theta', r.links(1).theta, ...
                        'offset', r.links(1).offset, ...
                        'qlim', r.links(1).qlim );
            end

            % middle joints
            for i=2:r.n
                switch r.config(i)
                    case 'R'
                        link(i) = Link('modified', 'revolute', ...
                            'a', r.links(i-1).a, ...
                            'alpha', r.links(i-1).alpha, ...
                            'd', r.links(i).d, ...
                            'offset', r.links(i).offset, ...
                            'qlim', r.links(i).qlim );
                    case 'P'
                        link(i) = Link('modified', 'prismatic', ...
                            'a', r.links(i-1).a, ...
                            'alpha', r.links(i-1).alpha, ...
                            'theta', r.links(i).theta, ...
                            'offset', r.links(i).offset, ...
                            'qlim', r.links(i).qlim );
                end
            end

            % last joint
            tool = SE3(r.links(r.n).a, 0, 0) * SE3.Rx(r.links(r.n).alpha) * r.tool;

            rmdh = SerialLink(link, 'base', r.base, 'tool', tool);
        end

        function rdh = DH(r)
        %SerialLink.DH  Convert modified DH model to standard
        %
        % rmdh = R.DH() is a SerialLink object that represents the same kinematics
        % as R but expressed using standard DH parameters.
        %
        % Notes::
        % - can only be applied to a model expressed with modified DH parameters.
        %
        % See also:  MDH

            assert(ismdh(r), 'RTB:SerialLink:badmodel', 'this method can only be applied to a model with modified DH parameters');

            base = r.base * SE3(r.links(1).a, 0, 0) * SE3.Rx(r.links(1).alpha);

            % middle joints
            for i=1:r.n-1
                switch r.config(i)
                    case 'R'
                        link(i) = Link('standard', 'revolute', ...
                            'a', r.links(i+1).a, ...
                            'alpha', r.links(i+1).alpha, ...
                            'd', r.links(i).d, ...
                            'offset', r.links(i).offset, ...
                            'qlim', r.links(i).qlim );
                    case 'P'
                        link(i) = Link('standard', 'prismatic', ...
                            'a', r.links(i+1).a, ...
                            'alpha', r.links(i+1).alpha, ...
                            'theta', r.links(i).theta, ...
                            'offset', r.links(i).offset, ...
                            'qlim', r.links(i).qlim );
                end
            end

            % last joint
            switch r.config(r.n)
                case 'R'
                    link(r.n) = Link('standard', 'revolute', ...
                        'd', r.links(r.n).d, ...
                        'offset', r.links(r.n).offset, ...
                        'qlim', r.links(r.n).qlim );
                case 'P'
                    link(r.n) = Link('standard', 'prismatic', ...
                        'theta', r.links(r.n).theta, ...
                        'offset', r.links(r.n).offset, ...
                        'qlim', r.links(r.n).qlim );
            end

            rdh = SerialLink(link, 'base', base, 'tool', r.tool);
        end


 */
