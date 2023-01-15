/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as THREE from "three"
import * as React from "react"
import { useRef, useMemo, useLayoutEffect } from "react"

export function DrawHollowBox({
    innerSide = 0.05,
    outerSide = 0.1,
    radialSegments = 100,
    vStart,
    vMid,
    vEnd,
    color = "red",
    lengthScale = 1,
    partial = false,
    partialLength = 0.08,
    ...props
}: {
    innerSide?: number
    outerSide?: number
    radialSegments?: number
    vStart: THREE.Vector3
    vMid: THREE.Vector3
    vEnd: THREE.Vector3
    color?: string
    lengthScale?: number
    partial?: boolean
    partialLength?: number
}) {
    const vDir = new THREE.Vector3()

    if (partial) {
        vDir.subVectors(vEnd, vStart)
            .normalize()
            .multiplyScalar(partialLength / 2)
        vStart.copy(vMid)
        vStart.add(vDir)

        vEnd.copy(vMid)
        vEnd.sub(vDir)
    }
    console.log(vStart, vEnd)
    // if (partial) {
    //   vDir.subVectors(vEnd, vStart);
    //   //0.9 is nearly at vend 0.1 is nearly at vstart
    //   vStart.add(vDir.multiplyScalar(0.9));
    // }

    var distance = vStart.distanceTo(vEnd) * lengthScale
    distance += innerSide * 2

    const position = vEnd.clone().add(vStart).divideScalar(2)

    // const { squareShape, options } = useMemo(() => {
    const squareShape = new THREE.Shape()
    squareShape.moveTo(-outerSide / 2, outerSide / 2)
    squareShape.lineTo(outerSide / 2, outerSide / 2)
    squareShape.lineTo(outerSide / 2, -outerSide / 2)
    squareShape.lineTo(-outerSide / 2, -outerSide / 2)
    squareShape.lineTo(-outerSide / 2, outerSide / 2)

    const holePath = new THREE.Path()
    holePath.lineTo(-innerSide / 2, innerSide / 2)
    holePath.lineTo(innerSide / 2, innerSide / 2)
    holePath.lineTo(innerSide / 2, -innerSide / 2)
    holePath.lineTo(-innerSide / 2, -innerSide / 2)
    holePath.lineTo(-innerSide / 2, innerSide / 2)

    squareShape.holes.push(holePath)
    const options = {
        depth: distance,
        bevelEnabled: false,
        steps: 1,
        curveSegments: radialSegments / 2
    }
    // return { squareShape, options };
    // }, []);

    const orientation = new THREE.Matrix4() //a new orientation matrix to offset pivot
    const offsetRotation = new THREE.Matrix4() //a matrix to fix pivot rotation
    const offsetPosition = new THREE.Matrix4() //a matrix to fix pivot position
    orientation.lookAt(vStart, vEnd, new THREE.Vector3(0, 1, 0)) //look at destination
    // offsetRotation.makeRotationX(Math.PI / 2); //rotate 90 degs on X
    orientation.multiply(offsetRotation) //combine orientation with rotation transformations

    const material = new THREE.MeshLambertMaterial({ color: color })
    const hollowBox = new THREE.ExtrudeGeometry(squareShape, options)

    hollowBox.center()
    hollowBox.applyMatrix4(orientation)

    return (
        <mesh
            material={material}
            geometry={hollowBox}
            position={[position.x, position.y, position.z]}
        />
    )
}
