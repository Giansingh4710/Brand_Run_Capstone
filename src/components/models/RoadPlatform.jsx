import { Box, Clone, useGLTF } from '@react-three/drei'
import { MeshBasicMaterial } from 'three'

export default function RoadPlatform() {
  const roadModel = useGLTF('/gltf/road.glb')

  const innerBorderMaterial = new MeshBasicMaterial({
    color: "#4d9be6"
  })

  const outerBorderMaterial = new MeshBasicMaterial({
    color: "#8fd3ff"
  })

  return (
    <group>
        <Clone
          object={roadModel.scene}
          position={[0, -1, -30]}
          scale={[1.5, 1, 40]}
          inject={() => (
            <meshStandardMaterial
              color={'#4d9be6'}
              transparent={true}
              opacity={0.5}
            />
          )}
        />
        <Box 
          position={[-0.5, -1, 0]} 
          scale={[0.05, 0.05, 100]} 
          material={innerBorderMaterial}
        />
        <Box 
          position={[0.5, -1, 0]} 
          scale={[0.05, 0.05, 100]} 
          material={innerBorderMaterial}
        />
        <Box 
          position={[1.5, -1, 0]} 
          scale={[0.05, 0.05, 100]} 
          material={outerBorderMaterial}
        />
        <Box 
          position={[-1.5, -1, 0]} 
          scale={[0.05, 0.05, 100]} 
          material={outerBorderMaterial}
        />
    </group>
  )
}