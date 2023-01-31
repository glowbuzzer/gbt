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
}
