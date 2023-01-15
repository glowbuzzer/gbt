/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"
import * as React from "react"
import { useRef, useMemo, useLayoutEffect } from "react"
export function DrawHollowCylinder({
    innerRadius = 0.05,
    outerRadius = 0.1,
    radialSegments = 100,
    height = 1,
    vStart,
    vEnd,
    color = "red",
    lengthScale = 1,
    ...props
}: {
    innerRadius?: number
    outerRadius?: number
    radialSegments?: number
    height?: number
    vStart: THREE.Vector3
    vEnd: THREE.Vector3
    color?: string
    lengthScale?: number
}) {
    // const vDir = new THREE.Vector3()
    //   .subVectors(vEnd, vStart)
    //   .normalize()
    //   .multiplyScalar(innerRadius * 2);
    //
    var distance = vStart.distanceTo(vEnd)

    // const vEndNew = vEnd.clone();

    // if (distance <= innerRadius * 2) {
    //   console.log("very short");
    distance += innerRadius * 2
    // } else {
    // vEndNew.add(vDir);
    // }

    const position = vEnd.clone().add(vStart).divideScalar(2)

    // distance = vStart.distanceTo(vEnd);
    // const { arcShape, options } = useMemo(() => {
    const arcShape = new THREE.Shape()
    arcShape.moveTo(outerRadius * 2, outerRadius)
    arcShape.absarc(outerRadius, outerRadius, outerRadius, 0, Math.PI * 2, false)
    const holePath = new THREE.Path()
    holePath.moveTo(outerRadius + innerRadius, outerRadius)
    holePath.absarc(outerRadius, outerRadius, innerRadius, 0, Math.PI * 2, true)
    arcShape.holes.push(holePath)
    const options = {
        depth: distance,
        bevelEnabled: false,
        steps: 1,
        curveSegments: radialSegments / 2
    }

    const orientation = new THREE.Matrix4() //a new orientation matrix to offset pivot
    const offsetRotation = new THREE.Matrix4() //a matrix to fix pivot rotation
    const offsetPosition = new THREE.Matrix4() //a matrix to fix pivot position
    orientation.lookAt(vStart, vEnd, new THREE.Vector3(0, 1, 0)) //look at destination
    // offsetRotation.makeRotationX(Math.PI / 2); //rotate 90 degs on X
    orientation.multiply(offsetRotation) //combine orientation with rotation transformations

    const material = new THREE.MeshLambertMaterial({ color: color })
    const hollowCylinder = new THREE.ExtrudeGeometry(arcShape, options)

    hollowCylinder.center()
    hollowCylinder.applyMatrix4(orientation)

    return (
        <mesh
            material={material}
            geometry={hollowCylinder}
            position={[position.x, position.y, position.z]}
        />
    )
}
