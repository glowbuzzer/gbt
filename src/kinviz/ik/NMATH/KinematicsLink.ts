/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"
import {
    AngularUnits,
    Body,
    DhParams,
    LinearUnits,
    LinkParamRepresentation,
    LinkQuantities,
    PpParams,
    UrdfParams
} from "./index"

export default class KinematicsLink {
    params: DhParams | PpParams | UrdfParams /*!< the link's parameters */
    // dh: DhParams /*!< if you have DH params and don't want to convert to PP */
    // pp: PpParams /*!< if you have a serial machine, e.g., an industrial robot  */
    //urdf: UrdfParams /*!< if you have urdf serial machine */
    body: Body /*!< the link's rigid body parameters */
    type: LinkParamRepresentation /*!< one of LINK_DH,PK,PP etc.  */
    quantity: LinkQuantities /*!< one of LENGTH,ANGLE */
    linearUnits: LinearUnits
    angularUnits: AngularUnits
    constructor(
        params: DhParams | PpParams | UrdfParams = new DhParams(0, 0, 0, 0, 0, 0),
        body: Body = new Body(),
        type: LinkParamRepresentation = LinkParamRepresentation.LINK_DH,
        quantity: LinkQuantities = LinkQuantities.QUANTITY_LENGTH,
        linearUnits: LinearUnits = LinearUnits.UNITS_MM,
        anglularUnits: AngularUnits = AngularUnits.UNITS_RAD
    ) {
        this.type = type
        this.quantity = quantity
        if (type == LinkParamRepresentation.LINK_DH) {
            this.params = params as DhParams
        }
        if (type == LinkParamRepresentation.LINK_MODIFIED_DH) {
            this.params = params as DhParams
        }
        if (type == LinkParamRepresentation.LINK_PP) {
            this.params = params as PpParams
        }
        if (type == LinkParamRepresentation.LINK_URDF) {
            this.params = params as UrdfParams
        }

        // this.dh = dh
        // this.pk = pk
        // this.pp = pp
        this.body = body
        this.linearUnits = linearUnits
        this.angularUnits = anglularUnits
    }
    set(
        type: LinkParamRepresentation,
        quantity: LinkQuantities,
        params: DhParams | PpParams | UrdfParams,
        // dh?: DhParams,
        // pk?: PkParams,
        // pp?: PpParams,
        body?: Body,
        linearUnits?: LinearUnits,
        angularUnits?: AngularUnits
    ) {
        if (
            type == LinkParamRepresentation.LINK_DH ||
            type == LinkParamRepresentation.LINK_MODIFIED_DH
        ) {
            this.params = params as DhParams
        }
        if (type == LinkParamRepresentation.LINK_PP) {
            this.params = params as PpParams
        }
        if (type == LinkParamRepresentation.LINK_URDF) {
            this.params = params as UrdfParams
        }

        // this.dh = dh
        // this.pk = pk
        // this.pp = pp
        this.body = body
        this.type = type
        this.quantity = quantity
        this.linearUnits = linearUnits
        this.angularUnits = angularUnits

        return this
    }

    jointSet(joint: number, applyOffset: boolean = false): KinematicsLink {
        const linkout: KinematicsLink = new KinematicsLink()
        linkout.type = this.type
        linkout.quantity = this.quantity
        linkout.body = this.body
        linkout.linearUnits = this.linearUnits
        linkout.angularUnits = this.angularUnits

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
            linkoutDh.positiveLimit = thisDh.positiveLimit
            linkoutDh.negativeLimit = thisDh.negativeLimit

            if (this.quantity == LinkQuantities.QUANTITY_LENGTH) {
                if (applyOffset) linkoutDh.d = joint + thisDh.dInitialOffset
                else {
                    linkoutDh.d = joint
                }
                linkoutDh.theta = thisDh.theta
            } else if (this.quantity == LinkQuantities.QUANTITY_ANGLE) {
                linkoutDh.d = thisDh.d
                if (applyOffset) {
                    linkoutDh.theta = joint + thisDh.thetaInitialOffset
                } else {
                    linkoutDh.theta = joint
                }
            } else if (this.quantity == LinkQuantities.QUANTITY_NONE) {
                linkoutDh.d = thisDh.d
                linkoutDh.theta = thisDh.theta
            } else {
                throw new Error("KinematicsLink.jointSet: Invalid quantity")
            }

            return linkout
        } else if (this.type == LinkParamRepresentation.LINK_PP) {
            const linkoutPp = linkout.params as PpParams
            const thisPp = this.params as PpParams
            //todo test me
            if (this.quantity == LinkQuantities.QUANTITY_LENGTH) {
                const pose = new THREE.Matrix4().identity()
                const posePosition = new THREE.Vector3()
                if (applyOffset) {
                    posePosition.set(0, 0, joint + thisPp.initialOffset)
                } else {
                    posePosition.set(0, 0, joint)
                }
                pose.setPosition(posePosition)
                linkoutPp.pose.multiplyMatrices(thisPp.pose, pose)
            } else if (this.quantity == LinkQuantities.QUANTITY_ANGLE) {
                const pose = new THREE.Matrix4()
                if (applyOffset) {
                    pose.compose(
                        new THREE.Vector3(),
                        new THREE.Quaternion().setFromAxisAngle(
                            new THREE.Vector3(0, 0, 1),
                            joint + thisPp.initialOffset
                        ),
                        new THREE.Vector3(1, 1, 1)
                    )
                } else {
                    pose.compose(
                        new THREE.Vector3(),
                        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), joint),
                        new THREE.Vector3(1, 1, 1)
                    )
                }
                linkoutPp.pose.multiplyMatrices(thisPp.pose, pose)
            } else if (this.quantity == LinkQuantities.QUANTITY_NONE) {
                //fixed joint
                linkoutPp.pose.copy(thisPp.pose)
            } else {
                throw new Error("KinematicsLink.jointSet: Invalid quantity")
            }
        } else if (this.type == LinkParamRepresentation.LINK_URDF) {
            const linkoutUrdf = linkout.params as UrdfParams
            const thisUrdf = this.params as UrdfParams
            const pose = new THREE.Matrix4().identity()

            if (this.quantity == LinkQuantities.QUANTITY_LENGTH) {
                if (applyOffset) {
                } else {
                }
                throw new Error("KinematicsLink.jointSet: QUANTITY_LENGTH not implemented for URDF")
                // go_cart_scale_mult(&link->u.urdf.axis, joint, &pose.tran);
                // return go_pose_pose_mult(&link->u.urdf.pose, &pose, &linkout->u.urdf.pose);
            } else if (this.quantity == LinkQuantities.QUANTITY_ANGLE) {
                if (applyOffset) {
                } else {
                }
                throw new Error("KinematicsLink.jointSet: QUANTITY_ANGLE not implemented for URDF")
                // go_cart_scale_mult(&link->u.urdf.axis, joint, &cart);
                // go_cart_rvec_convert(&cart, &rvec);
                // retval = go_rvec_quat_convert(&rvec, &pose.rot);
                // if (GO_RESULT_OK != retval) return retval;
                // return go_pose_pose_mult(&link->u.urdf.pose, &pose, &linkout->u.urdf.pose)
            } else if (this.quantity == LinkQuantities.QUANTITY_NONE) {
                //fixed joint
                linkoutUrdf.pose.copy(thisUrdf.pose)
            } else {
                throw new Error("KinematicsLink.jointSet: Invalid quantity")
            }
        } else {
            throw new Error("KinematicsLink.jointSet: Invalid type")
        }
    }
}
