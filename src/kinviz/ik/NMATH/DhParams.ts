/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"

// standard DH parameters, this is from the previous frame to the current.
// modified DH parameters, this is from the current frame to the next

export default class DhParams {
    a: number
    alpha: number
    d: number
    dInitialOffset: number
    theta: number
    thetaInitialOffset: number
    // modified: boolean
    constructor(
        a: number,
        alpha: number,
        d: number,
        dinitialOffset: number,
        theta: number,
        thetaInitialOffset: number
        // modified: boolean
    ) {
        this.a = a
        this.alpha = alpha
        this.d = d
        this.dInitialOffset = dinitialOffset
        this.theta = theta
        this.thetaInitialOffset = thetaInitialOffset
        // this.modified = modified
    }

    set(
        a: number,
        alpha: number,
        d: number,
        dInitialOffset: number,
        theta: number,
        thetaInitialOffset: number
        // modified: boolean
    ) {
        this.a = a
        this.alpha = alpha
        this.d = d
        this.dInitialOffset = d
        this.theta = theta
        this.thetaInitialOffset = thetaInitialOffset
        // this.modified = modified
    }

    // toPoseMatrxi4(modified: boolean): THREE.Matrix4 {
    //     const sth = Math.sin(this.theta)
    //     const cth = Math.cos(this.theta)
    //
    //     const sal = Math.sin(this.alpha)
    //     const cal = Math.cos(this.alpha)
    //     var h: THREE.Matrix4 = new THREE.Matrix4()
    //     //FOR CLASSIC
    //     if (!modified) {
    //         h = new THREE.Matrix4().set(
    //             cth,
    //             -sth * cal,
    //             sth * sal,
    //             this.a * cth,
    //             sth,
    //             cth * cal,
    //             -cth * sal,
    //             this.a * sth,
    //             0,
    //             sal,
    //             cal,
    //             this.d,
    //             0,
    //             0,
    //             0,
    //             1
    //         )
    //     } else {
    //         //FOR MODIFIED
    //         h = new THREE.Matrix4().set(
    //             cth,
    //             -sth,
    //             0,
    //             this.a,
    //             sth * cal,
    //             cth * cal,
    //             -sal,
    //             -sal * this.d,
    //             sth * sal,
    //             cth * sal,
    //             cal,
    //             cal * this.d,
    //
    //             0,
    //             0,
    //             0,
    //             1
    //         )
    //     }
    //
    //     return h
    // }
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

        //
        //
        // h.rot.x.x = cth
        // h.rot.y.x = -sth
        // h.rot.z.x = 0.0
        // h.rot.x.y = sth * cal
        // h.rot.y.y = cth * cal
        // h.rot.z.y = -sal
        // h.rot.x.z = sth * sal
        // h.rot.y.z = cth * sal
        // h.rot.z.z = cal
        //
        // h.tran.x = dh.a
        // h.tran.y = -sal * dh.d
        //
        // h.tran.z = cal * dh.d
        // return go_hom_pose_convert(h)
    }
}
