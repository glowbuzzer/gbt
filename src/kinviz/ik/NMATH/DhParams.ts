/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"
import KinematicsLink from "./KinematicsLink"
import { LinkParamRepresentation } from "./LinkParamRepresentation"
import { LinkQuantities } from "./LinkQuantities"

// standard DH parameters, this is from the previous frame to the current.
// modified DH parameters, this is from the current frame to the next

export default class DhParams {
    a: number
    alpha: number
    d: number
    dInitialOffset: number
    theta: number
    thetaInitialOffset: number
    positiveLimit: number
    negativeLimit: number
    constructor(
        a: number,
        alpha: number,
        d: number,
        dinitialOffset: number,
        theta: number,
        thetaInitialOffset: number,
        positiveLimit: number = 0,
        negativeLimit: number = 0
    ) {
        this.a = a
        this.alpha = alpha
        this.d = d
        this.dInitialOffset = dinitialOffset
        this.theta = theta
        this.thetaInitialOffset = thetaInitialOffset
        this.positiveLimit = positiveLimit
        this.negativeLimit = negativeLimit
    }

    set(
        a: number,
        alpha: number,
        d: number,
        dInitialOffset: number,
        theta: number,
        thetaInitialOffset: number,
        positiveLimit: number,
        negativeLimit: number
    ) {
        this.a = a
        this.alpha = alpha
        this.d = d
        this.dInitialOffset = d
        this.theta = theta
        this.thetaInitialOffset = thetaInitialOffset
        this.positiveLimit = positiveLimit
        this.negativeLimit = negativeLimit
    }

    toPose(modified: boolean) {
        const pose = new THREE.Matrix4()

        const sth = Math.sin(this.theta)
        const cth = Math.cos(this.theta)

        const sal = Math.sin(this.alpha)
        const cal = Math.cos(this.alpha)

        //FOR CLASSIC
        if (!modified) {
            pose.set(
                cth,
                -sth * cal,
                sth * sal,
                this.a * cth,
                sth,
                cth * cal,
                -cth * sal,
                this.a * sth,
                0,
                sal,
                cal,
                this.d,
                0,
                0,
                0,
                1
            )
        } else {
            //FOR MODIFIED
            pose.set(
                cth,
                -sth,
                0,
                this.a,
                sth * cal,
                cth * cal,
                -sal,
                -sal * this.d,
                sth * sal,
                cth * sal,
                cal,
                cal * this.d,

                0,
                0,
                0,
                1
            )
        }

        // h.decompose(pose.tran, pose.rot, new THREE.Vector3())

        // const toEuler = new THREE.Euler().setFromQuaternion(pose.rot)
        // pose.rot.setFromEuler(toEuler)

        return pose
    }
}
