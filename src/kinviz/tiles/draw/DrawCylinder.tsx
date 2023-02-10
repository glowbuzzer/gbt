/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"
import * as React from "react"

export const DrawCylinder = ({
    radius = 0.05,
    radialSegments = 100,
    vStart,
    vEnd,
    color = "red",
    lengthScale = 1,
    ...props
}: {
    radius?: number
    radialSegments?: number
    vStart: THREE.Vector3
    vEnd: THREE.Vector3
    color?: string
    lengthScale?: number
}) => {
    const vDir = new THREE.Vector3()

    var distance = vStart.distanceTo(vEnd) + radius * 3
    const position = vEnd.clone().add(vStart).divideScalar(2)

    if (distance <= radius * 2) {
        distance += radius * 2
    }

    const material = new THREE.MeshLambertMaterial({ color: color })
    const cylinder = new THREE.CylinderGeometry(
        radius,
        radius,
        distance,
        radialSegments,
        radialSegments,
        false
    )

    const orientation = new THREE.Matrix4() //a new orientation matrix to offset pivot
    const offsetRotation = new THREE.Matrix4() //a matrix to fix pivot rotation
    const offsetPosition = new THREE.Matrix4() //a matrix to fix pivot position
    orientation.lookAt(vStart, vEnd, new THREE.Vector3(0, 1, 0)) //look at destination
    offsetRotation.makeRotationX(Math.PI / 2) //rotate 90 degs on X
    orientation.multiply(offsetRotation) //combine orientation with rotation transformations

    cylinder.applyMatrix4(orientation)

    // const mesh = new THREE.Mesh(cylinder, material);
    // mesh.position.set(position.x, position.y, position.z);

    // return <primitive scale={[1, 1, 1]} object={mesh} />;

    return (
        <mesh
            material={material}
            geometry={cylinder}
            position={[position.x, position.y, position.z]}
        />
    )
}
