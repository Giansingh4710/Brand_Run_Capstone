import Road from './Road'
import { useEffect, useRef, useState } from 'react'
import { a, useSpring } from '@react-spring/three'
import * as THREE from 'three'
import Overlay from '../overlays/Overlay'
import Runner from '../models/Runner'
import { NeonRoad } from '../models/NeonRoad'
import { useStore } from '../../store.js'
import { startRunner } from '../../utils/helpers.js'

function Game() {
  const runnerRef = useRef()
  const lightRef = useRef()
  const powerupTextRef = useRef()
  const actionsRef = useRef()
  const outlineColorRef = useRef()
  const touchStartXRef = useRef(null)
  const touchStartYRef = useRef(null)
  const superJumpEnabledRef = useRef(false)

  const gameEnded = useStore((state) => state.gameEnded)

  const lightPosition = new THREE.Vector3(25, 25, 25)
  let paused = false

  const [springZ, apiZ] = useSpring(() => startRunner())
  const [springX, apiX] = useSpring(() => ({ x: 0 }))

  const initialRunnerY = 1
  const [springY, apiY] = useSpring(() => ({ y: initialRunnerY }))

  let laneIndex = 0 // -1, 0, 1
  function moveLeftRight(direction) {
    const distance = 0.8
    if (direction === 'left' && laneIndex !== -1) {
      laneIndex--
    } else if (direction === 'right' && laneIndex !== 1) {
      laneIndex++
    }

    let new_x = 0
    if (laneIndex === -1) {
      new_x = -distance
    } else if (laneIndex === 0) {
      new_x = 0
    } else if (laneIndex === 1) {
      new_x = distance
    }

    apiX.start({ x: new_x, config: { duration: 100 } })
  }

  function jump() {
    if (springY.y.get() === initialRunnerY) {
      if (superJumpEnabledRef.current) {
        apiY.start({
          y: initialRunnerY + 3,
          reverse: false,
          reset: true,
          config: { mass: 3, tension: 170, friction: 26, duration: 500 },
          onRest: () => apiY.start({ y: initialRunnerY }),
        })
      } else {
        apiY.start({
          y: initialRunnerY + 1.5,
          reverse: false,
          reset: true,
          config: { mass: 3, tension: 170, friction: 26, duration: 250 },
          onRest: () => apiY.start({ y: initialRunnerY }),
        })
      }
    }
  }

  function handleGameKeyDown(event) {
    if (gameEnded) return

    if (event.key === 'ArrowUp' || event.key === 'w') {
      jump()
    } else if (event.key === 'ArrowDown' || event.key === 's') {
      const action = actionsRef.current?.slide
      if (action && !action.isRunning()) {
        actionsRef.current?.run.fadeOut(0.1).fadeIn(2.5)
        action.reset().setLoop(THREE.LoopOnce).play()
      }
    } else if (event.key === 'ArrowLeft' || event.key === 'a') {
      moveLeftRight('left')
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
      moveLeftRight('right')
    } else if (event.key === 'p') {
      if (paused) {
        apiX.resume()
        apiY.resume()
        apiZ.resume()
      } else {
        apiX.pause()
        apiY.pause()
        apiZ.pause()
      }
      paused = !paused
    }
  }

  function handleTouchStart(event) {
    touchStartXRef.current = event.touches[0].clientX
    touchStartYRef.current = event.touches[0].clientY
  }

  function handleTouchEnd(event) {
    if (gameEnded) return

    const touchEndX = event.changedTouches[0].clientX
    const touchEndY = event.changedTouches[0].clientY
    const touchDistanceX = touchEndX - touchStartXRef.current
    const touchDistanceY = touchStartYRef.current - touchEndY

    if (touchDistanceX > 50) {
      moveLeftRight('right')
    } else if (touchDistanceX < -50) {
      moveLeftRight('left')
    }

    if (touchDistanceY > 50) {
      jump()
    } else if (touchDistanceY < -50) {
      const action = actionsRef.current?.slide
      if (action && !action.isRunning()) {
        actionsRef.current?.run.fadeOut(0.1).fadeIn(2.5)
        action.reset().setLoop(THREE.LoopOnce).play()
      }
    }
  }

  useEffect(() => {
    if (gameEnded) {
      apiX.stop()
      apiY.stop()
      apiZ.stop()
      actionsRef.current?.run.stop()
      actionsRef.current?.roll.stop()
    }
  }, [gameEnded])

  useEffect(() => {
    actionsRef.current?.run.play() // actions = [run, roll, jump, slide, stumble]
    actionsRef.current?.run.warp(1, 1.5, 0) // adjusts the "run" animation speed to 1.5

    document.addEventListener('keydown', handleGameKeyDown)
    document.addEventListener('touchstart', handleTouchStart, false)
    document.addEventListener('touchend', handleTouchEnd, false)

    return () => {
      document.removeEventListener('keydown', handleGameKeyDown)
      document.removeEventListener('touchstart', handleTouchStart, false)
      document.removeEventListener('touchend', handleTouchEnd, false)
    }
  }, [])


  return (
    <group>
      <a.perspectiveCamera
        position-x={0}
        position-y={-2}
        position-z={springZ.cameraZ}
      >
        <a.group position-z={springZ.runnerZ}>
          <Overlay
            springRunnerZ={springZ.runnerZ}
            powerupTextRef={powerupTextRef}
          />
          {/* <NeonRoad startPosZ={-50}/> */}
        </a.group>
        <a.group
          position-x={springX.x}
          position-y={springY.y}
          position-z={springZ.runnerZ}
          rotation={[0, Math.PI, 0]}
          scale={0.5}
          dispose={null}
        >
          <Runner
            innerRef={runnerRef}
            actionsRef={actionsRef}
            outlineColorRef={outlineColorRef}
          />
        </a.group>
        <Road
          runnerRef={runnerRef}
          runnerZpos={springZ.runnerZ}
          cameraZpos={springZ.cameraZ}
          apiZ={apiZ}
          actionsRef={actionsRef}
          powerupTextRef={powerupTextRef}
          superJumpEnabledRef={superJumpEnabledRef}
          outlineColorRef={outlineColorRef}
        />
        <directionalLight
          castShadow
          ref={lightRef}
          position={lightPosition}
          target={runnerRef.current}
          intensity={1.5}
          shadow-mapSize-width={512}
          shadow-mapSize-height={70}
          shadow-camera-near={0.1}
          shadow-camera-far={70}
          shadow-camera-left={-70}
          shadow-camera-right={70}
          shadow-camera-top={-70}
          shadow-camera-bottom={70}
          shadow-bias={-0.00001}
          visible={true}
        />
      </a.perspectiveCamera>
    </group>
  )
}

export default Game
