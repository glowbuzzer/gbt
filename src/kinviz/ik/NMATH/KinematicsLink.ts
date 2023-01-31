/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    DhParams,
    PkParams,
    PpParams,
    Body,
    LinkParamRepresentation,
    LinkQuantities
} from "./index"

export default class KinematicsLink {
    params: DhParams | PkParams | PpParams
    // dh: DhParams /*!< if you have DH params and don't want to convert to PP */
    // pk: PkParams /*!< if you have a parallel machine, e.g., hexapod or robot crane */
    // pp: PpParams /*!< if you have a serial machine, e.g., an industrial robot  */
    body: Body /*!< the link's rigid body parameters */
    type: LinkParamRepresentation /*!< one of GO_LINK_DH,PK,PP  */
    quantity: LinkQuantities /*!< one of GO_QUANTITY_LENGTH,ANGLE */
    unrotate: number /*!< the unrotate for this link */
    constructor(
        params: DhParams | PkParams | PpParams = new DhParams(0, 0, 0, 0, 0, 0),
        // dh: DhParams = new DhParams(0, 0, 0, 0, 0, 0, false),
        // pk: PkParams = new PkParams(),
        // pp: PpParams = new PpParams(),
        body: Body = new Body(),
        type: LinkParamRepresentation = LinkParamRepresentation.LINK_DH,
        quantity: LinkQuantities = LinkQuantities.GO_QUANTITY_LENGTH,
        unrotate: number = 0
    ) {
        this.type = type
        this.quantity = quantity
        if (type == LinkParamRepresentation.LINK_DH) {
            this.params = params as DhParams
        }
        if (type == LinkParamRepresentation.LINK_MODIFIED_DH) {
            this.params = params as DhParams
        }
        if (type == LinkParamRepresentation.LINK_PK) {
            this.params = params as PkParams
        }
        if (type == LinkParamRepresentation.LINK_PP) {
            this.params = params as PpParams
        }
        // this.dh = dh
        // this.pk = pk
        // this.pp = pp
        this.body = body
        this.unrotate = unrotate
    }
    set(
        type: LinkParamRepresentation,
        quantity: LinkQuantities,
        params: DhParams | PkParams | PpParams,
        // dh?: DhParams,
        // pk?: PkParams,
        // pp?: PpParams,
        body?: Body,
        unrotate?: number
    ) {
        if (
            type == LinkParamRepresentation.LINK_DH ||
            type == LinkParamRepresentation.LINK_MODIFIED_DH
        ) {
            this.params = params as DhParams
        }
        if (type == LinkParamRepresentation.LINK_PK) {
            this.params = params as PkParams
        }
        if (type == LinkParamRepresentation.LINK_PP) {
            this.params = params as PpParams
        }
        // this.dh = dh
        // this.pk = pk
        // this.pp = pp
        this.body = body
        this.type = type
        this.quantity = quantity
        this.unrotate = unrotate

        return this
    }

    jointSet(joint: number): KinematicsLink {
        const linkout: KinematicsLink = new KinematicsLink()
        linkout.type = this.type
        linkout.quantity = this.quantity
        linkout.body = this.body
        linkout.unrotate = this.unrotate

        if (
            this.type == LinkParamRepresentation.LINK_DH ||
            this.type == LinkParamRepresentation.LINK_MODIFIED_DH
        ) {
            const linkoutDh = linkout.params as DhParams
            const thisDh = this.params as DhParams
            linkoutDh.a = thisDh.a
            linkoutDh.alpha = thisDh.alpha
            linkoutDh.dInitialOffset = thisDh.dInitialOffset
            linkoutDh.thetaInitialOffset = thisDh.thetaInitialOffset

            if (this.quantity == LinkQuantities.GO_QUANTITY_LENGTH) {
                linkoutDh.d = joint //+ thisDh.dInitialOffset
                linkoutDh.theta = thisDh.theta
            } else {
                linkoutDh.d = thisDh.d
                linkoutDh.theta = joint // + thisDh.thetaInitialOffset
            }

            return linkout
        }

        //todo handle pk and pp
        // if (this.type == LinkParamRepresentation.GO_LINK_PP) {
        //     if (this.quantity == LinkQuantities.GO_QUANTITY_LENGTH) {
        //         pose.tran.z = joint
        //
        //         var ret1
        //         ;({ ret: ret1, pout: linkout.pp.pose } = go_pose_pose_mult(link.pp.pose, pose))
        //
        //         return { ret: ret1, linkout }
        //     }
        // }
        // const rvec: go_rvec = new go_rvec()
        // rvec.x = 0
        // rvec.y = 0
        // rvec.z = joint
        // //     retval = go_rvec_quat_convert(&rvec, &pose.rot);
        // //     if (GO_RESULT_OK != retval) return retval;
        // //     return go_pose_pose_mult(&link->u.pp.pose, &pose, &linkout->u.pp.pose);
        // // }
        //
        // var ret2
        // ;({ ret: ret2, q: pose.rot } = go_rvec_quat_convert(rvec))
        //
        // if (ret2 != retval.GO_RESULT_OK) {
        //     return { ret: ret2, linkout: linkout }
        // }
        // // return {ret: go_pose_pose_mult(link.pp.pose, pose2, linkout.pp.pose), linkout: linkout};
        //
        // if (link.type == LinkParamRepresentation.GO_LINK_PK) {
        //     if (link.quantity != LinkQuantities.GO_QUANTITY_LENGTH) {
        //         return { ret: retval.GO_RESULT_IMPL_ERROR, linkout: linkout }
        //     }
        //     linkout.pk.base = link.pk.base
        //     linkout.pk.platform = link.pk.platform
        //     linkout.pk.d = joint
        //     return { ret: retval.GO_RESULT_OK, linkout: linkout }
        // }
    }
}
