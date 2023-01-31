import * as React from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PivotControls, TrackballControls } from "@react-three/drei"
import { GizmoHelper, GizmoViewcube } from "@react-three/drei"
import * as THREE from "three"
import { useTransformation } from "../TransformationProvider"

export const ThreeTransformationViewTile = () => {
    const { matrix4, setMatrix4 } = useTransformation()

    function pivot_drag(
        l: THREE.Matrix4,
        deltaL: THREE.Matrix4,
        w: THREE.Matrix4,
        deltaW: THREE.Matrix4
    ) {
        setMatrix4(l.clone())
    }

    return (
        <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <PivotControls
                depthTest={false}
                anchor={[0, 0, 0]}
                scale={1}
                matrix={matrix4}
                onDrag={pivot_drag}
            >
                <mesh>
                    <boxBufferGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="white" />
                </mesh>
            </PivotControls>
            <axesHelper args={[3]} />
            <GizmoHelper>
                <GizmoViewcube />
            </GizmoHelper>
            <TrackballControls makeDefault rotateSpeed={10} />
        </Canvas>
    )
}
