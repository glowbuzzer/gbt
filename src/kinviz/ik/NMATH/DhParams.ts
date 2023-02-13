/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"
import KinematicsLink from "./KinematicsLink"
import { LinkParamRepresentation } from "./LinkParamRepresentation"
import { LinkQuantities } from "./LinkQuantities"
import { AngularUnits } from "./AngularUnits"
import { LinearUnits } from "./LinearUnits"

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

    toPose(modified: boolean, angularUnits: AngularUnits) {
        const pose = new THREE.Matrix4()
        var adjustedTheta: number = 0
        var adjustedAlpha: number = 0
        var adjustedD: number = 0
        var adjustedA: number = 0
        //if prismatic then theta offset should be zero
        if (angularUnits == AngularUnits.UNITS_DEG) {
            //todo FIX THIS
            adjustedTheta = this.theta * (Math.PI / 180) + this.thetaInitialOffset * (Math.PI / 180)
            adjustedAlpha = this.alpha * (Math.PI / 180)
            // adjustedTheta = this.theta + this.thetaInitialOffset
            // adjustedAlpha = this.alpha
        } else {
            adjustedTheta = this.theta + this.thetaInitialOffset
            adjustedAlpha = this.alpha
        }
        //todo if not revolute, then this should be zero
        adjustedD = this.d + this.dInitialOffset

        const sth = Math.sin(adjustedTheta)
        const cth = Math.cos(adjustedTheta)

        const sal = Math.sin(adjustedAlpha)
        const cal = Math.cos(adjustedAlpha)

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
                adjustedD,
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
                -sal * adjustedD,
                sth * sal,
                cth * sal,
                cal,
                cal * adjustedD,

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
