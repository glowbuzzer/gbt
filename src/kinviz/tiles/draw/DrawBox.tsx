/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"
import * as React from "react"

export const DrawBox = ({
    side = 0.05,
    radialSegments = 100,
    vStart,
    vEnd,
    color = "yellow",
    lengthScale = 1
}: {
    side?: number
    radialSegments?: number
    vStart: THREE.Vector3
    vEnd: THREE.Vector3
    color?: string
    lengthScale?: number
}) => {
    const distance = vStart.distanceTo(vEnd) * lengthScale
    const position = vEnd.clone().add(vStart).divideScalar(2)

    const material = new THREE.MeshLambertMaterial({ color: color })
    const box = new THREE.BoxGeometry(side, distance, side, 10, 10)

    const orientation = new THREE.Matrix4() //a new orientation matrix to offset pivot
    const offsetRotation = new THREE.Matrix4() //a matrix to fix pivot rotation
    const offsetPosition = new THREE.Matrix4() //a matrix to fix pivot position
    orientation.lookAt(vStart, vEnd, new THREE.Vector3(0, 1, 0)) //look at destination
    offsetRotation.makeRotationX(Math.PI / 2) //rotate 90 degs on X
    orientation.multiply(offsetRotation) //combine orientation with rotation transformations

    box.applyMatrix4(orientation)

    // var mesh = new THREE.Mesh(box, material);
    // mesh.position.set(position.x, position.y, position.z);
    //
    // return <primitive scale={[1, 1, 1]} object={mesh} />;

    return (
        <mesh material={material} geometry={box} position={[position.x, position.y, position.z]} />
    )
}
