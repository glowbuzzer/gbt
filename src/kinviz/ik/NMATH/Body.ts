/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

export default class Body {
    mass: number /*!< total mass of the rigid body */
    /*!
      The \a inertia matrix is the 3x3 matrix of moments of inertia with
      respect to the body's origin.
   */
    inertia: number[][]

    constructor(
        mass: number = 0,
        inertia: number[][] = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ]
    ) {
        this.mass = mass
        this.inertia = inertia
    }

    copy(body: Body) {
        this.mass = body.mass
        this.inertia[0][0] = body.inertia[0][0]
        this.inertia[0][1] = body.inertia[0][1]
        this.inertia[0][2] = body.inertia[0][2]
        this.inertia[1][0] = body.inertia[1][0]
        this.inertia[1][1] = body.inertia[1][1]
        this.inertia[1][2] = body.inertia[1][2]
        this.inertia[2][0] = body.inertia[2][0]
        this.inertia[2][1] = body.inertia[2][1]
        this.inertia[2][2] = body.inertia[2][2]
        return this
    }
}
