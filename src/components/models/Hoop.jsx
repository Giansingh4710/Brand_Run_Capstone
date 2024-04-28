/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 -T ring.glb 
Files: ring.glb [23.77KB] > ring-transformed.glb [2.39KB] (90%)
*/

import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { Clone, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'

function Hoops(props) {
  const { nodes, materials } = useGLTF('/gltf/ring-transformed.glb')
  const clones = []
  const pieces = 24
  const width = 200

  const { posZ, rot } = useSpring({
    from: {
      posZ: [0, 0, -width],
      rot: [0, 0, 0]
    },
    to: {
      posZ: [0, 0, 0],
      rot: [0, 0, Math.PI]
    },
    config: {
      duration: 1000 * 6
    },
    loop: true
  })

  for (let i = 0; i < pieces; i++) {
    clones.push(
      <Clone
        key={i}
        object={nodes.Circle}
        position={[0, 0, -i * width]}
        inject={
          <meshStandardMaterial 
            metalness={0.2}
            roughness={0.2}
          />
        }
      />
    )
  }

  return (
    <animated.group rotation={rot}>
      {clones}
    </animated.group>
  )
}

export default Hoops

useGLTF.preload('/gltf/ring-transformed.glb')