/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"
import niceColors from "nice-color-palettes"

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

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
}

export default class KinematicsLink {
    params: DhParams | PpParams | UrdfParams /*!< the link's parameters */
    // dh: DhParams /*!< if you have DH params and don't want to convert to PP */
    // pp: PpParams /*!< if you have a serial machine, e.g., an industrial robot  */
    //urdf: UrdfParams /*!< if you have urdf serial machine */
    body: Body /*!< the link's rigid body parameters */
    type: LinkParamRepresentation /*!< one of LINK_DH etc.  */
    quantity: LinkQuantities /*!< one of LENGTH,ANGLE */
    linearUnits: LinearUnits
    angularUnits: AngularUnits
    color: string
    constructor(
        params: DhParams | PpParams | UrdfParams = new DhParams(0, 0, 0, 0, 0, 0),
        body: Body = new Body(),
        type: LinkParamRepresentation = LinkParamRepresentation.LINK_DH,
        quantity: LinkQuantities = LinkQuantities.QUANTITY_LENGTH,
        linearUnits: LinearUnits = LinearUnits.UNITS_MM,
        anglularUnits: AngularUnits = AngularUnits.UNITS_RAD,
        color: string = niceColors.flat()[getRandomIntInclusive(0, niceColors.flat().length - 1)]
        // color: string = "red"
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

        this.color = color
        this.body = body
        this.linearUnits = linearUnits
        this.angularUnits = anglularUnits
    }
    set(
        type: LinkParamRepresentation,
        quantity: LinkQuantities,
        params: DhParams | PpParams | UrdfParams,
        body: Body,
        linearUnits: LinearUnits,
        angularUnits: AngularUnits,
        color: string
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

        this.body = body
        this.type = type
        this.quantity = quantity
        this.linearUnits = linearUnits
        this.angularUnits = angularUnits
        this.color = color
        return this
    }

    copy(link: KinematicsLink) {
        this.type = link.type
        this.quantity = link.quantity
        if (
            this.type == LinkParamRepresentation.LINK_DH ||
            this.type == LinkParamRepresentation.LINK_MODIFIED_DH
        ) {
            this.params = link.params as DhParams
        }
        if (this.type == LinkParamRepresentation.LINK_PP) {
            this.params = link.params as PpParams
        }
        if (this.type == LinkParamRepresentation.LINK_URDF) {
            this.params = link.params as UrdfParams
        }
        this.body = link.body
        this.linearUnits = link.linearUnits
        this.angularUnits = link.angularUnits
        this.color = link.color
    }
    jointApplyOffset() {
        if (
            this.type == LinkParamRepresentation.LINK_DH ||
            this.type == LinkParamRepresentation.LINK_MODIFIED_DH
        ) {
            const thisDh = this.params as DhParams
            if (this.quantity == LinkQuantities.QUANTITY_LENGTH) {
                thisDh.d = thisDh.d + thisDh.dInitialOffset
            } else if (this.quantity == LinkQuantities.QUANTITY_ANGLE) {
                thisDh.theta = thisDh.theta + thisDh.thetaInitialOffset
            } else if (this.quantity == LinkQuantities.QUANTITY_NONE) {
                //do nothing
            } else {
                throw new Error("KinematicsLink.jointSet: Invalid quantity")
            }
        } else if (this.type == LinkParamRepresentation.LINK_PP) {
            const thisPp = this.params as PpParams
            if (this.quantity == LinkQuantities.QUANTITY_LENGTH) {
            } else if (this.quantity == LinkQuantities.QUANTITY_ANGLE) {
            } else if (this.quantity == LinkQuantities.QUANTITY_NONE) {
                //fixed joint
            } else {
                throw new Error("KinematicsLink.jointSet: Invalid quantity")
            }
        } else if (this.type == LinkParamRepresentation.LINK_URDF) {
            if (this.quantity == LinkQuantities.QUANTITY_LENGTH) {
            } else if (this.quantity == LinkQuantities.QUANTITY_ANGLE) {
            } else if (this.quantity == LinkQuantities.QUANTITY_NONE) {
                //fixed joint
            } else {
                throw new Error("KinematicsLink.jointSet: Invalid quantity")
            }
        } else {
            throw new Error("KinematicsLink.jointSet: Invalid type")
        }
    }
    jointSet(joint: number, applyOffset: boolean): KinematicsLink {
        const linkout: KinematicsLink = new KinematicsLink()
        linkout.type = this.type
        linkout.quantity = this.quantity
        linkout.body = Object.assign({}, this.body)
        linkout.linearUnits = this.linearUnits
        linkout.angularUnits = this.angularUnits
        linkout.color = this.color
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
                if (applyOffset) {
                    linkoutDh.d = joint + thisDh.dInitialOffset
                } else {
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

    jointConvertToRads(): KinematicsLink {
        const linkout: KinematicsLink = new KinematicsLink()
        linkout.type = this.type
        linkout.quantity = this.quantity
        linkout.body = this.body
        linkout.linearUnits = this.linearUnits
        linkout.angularUnits = AngularUnits.UNITS_RAD
        linkout.color = this.color
        if (
            this.type == LinkParamRepresentation.LINK_DH ||
            this.type == LinkParamRepresentation.LINK_MODIFIED_DH
        ) {
            const linkoutDh = linkout.params as DhParams
            const thisDh = this.params as DhParams
            linkoutDh.a = thisDh.a
            linkoutDh.alpha = (thisDh.alpha * Math.PI) / 180
            linkoutDh.dInitialOffset = thisDh.dInitialOffset
            linkoutDh.thetaInitialOffset = (thisDh.thetaInitialOffset * Math.PI) / 180
            linkoutDh.theta = (thisDh.theta * Math.PI) / 180
            if (this.quantity == LinkQuantities.QUANTITY_LENGTH) {
            } else if (this.quantity == LinkQuantities.QUANTITY_ANGLE) {
                linkoutDh.positiveLimit = (thisDh.positiveLimit * Math.PI) / 180
                linkoutDh.negativeLimit = (thisDh.negativeLimit * Math.PI) / 180
            } else if (this.quantity == LinkQuantities.QUANTITY_NONE) {
            } else {
                throw new Error("KinematicsLink.jointSet: Invalid quantity")
            }

            return linkout
        } else if (this.type == LinkParamRepresentation.LINK_PP) {
            const linkoutPp = linkout.params as PpParams
            const thisPp = this.params as PpParams
            if (this.quantity == LinkQuantities.QUANTITY_LENGTH) {
            } else if (this.quantity == LinkQuantities.QUANTITY_ANGLE) {
                const pose = new THREE.Matrix4()
            } else if (this.quantity == LinkQuantities.QUANTITY_NONE) {
                //fixed joint
            } else {
                throw new Error("KinematicsLink.jointSet: Invalid quantity")
            }
            linkoutPp.pose.copy(thisPp.pose)
        } else if (this.type == LinkParamRepresentation.LINK_URDF) {
            const linkoutUrdf = linkout.params as UrdfParams
            const thisUrdf = this.params as UrdfParams

            if (this.quantity == LinkQuantities.QUANTITY_LENGTH) {
                throw new Error("KinematicsLink.jointSet: QUANTITY_LENGTH not implemented for URDF")
                // go_cart_scale_mult(&link->u.urdf.axis, joint, &pose.tran);
                // return go_pose_pose_mult(&link->u.urdf.pose, &pose, &linkout->u.urdf.pose);
            } else if (this.quantity == LinkQuantities.QUANTITY_ANGLE) {
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
