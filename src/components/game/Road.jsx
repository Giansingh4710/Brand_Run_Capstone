import React, { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Box3 } from 'three'
import { Barrier } from '../obstacles/Barrier'
import { Hurdle, TallHurdle } from '../obstacles/Hurdle'
import { Wall } from '../obstacles/Wall'
import { Canister } from '../models/Canister.jsx'
import { getRandomItemAndPop, randomItemFromArr } from '../../utils/helpers.js'
import { useStore } from '../../store.js'
import { ModelHandler } from '../models/ModelHandler.jsx'
import { startRunner } from '../../utils/helpers.js'

const obstEvery = 50

function TheRoad({
  runnerRef,
  runnerZpos,
  apiZ,
  cameraZpos,
  actionsRef,
  powerupTextRef,
  outlineColorRef,
  superJumpEnabledRef,
}) {
  const [playerZ, setPlayerZ] = useState(0)
  const gameEnded = useStore((state) => state.gameEnded)

  const can = getRandomCanisterData(playerZ, gameEnded)
  const canRef = useRef() //powerup

  const barrierRef = useRef()
  const tallHurdleRef = useRef()
  const hurdleRef = useRef()
  const wallRef = useRef()
  const { barrierData, tallData, hurdleData, wallData } = getObstaclesData(
    playerZ,
    gameEnded,
  )
  const obstRefsLst = [barrierRef, tallHurdleRef, hurdleRef, wallRef]

  const setInvinciblePowerUp = useStore((state) => state.setInvinciblePowerUp)
  const invinciblePowerUpRef = useRef(false) // if u get from store, will rerender this causing all obstacles to rerender

  const incrementScorePowerUpHits = useStore(
    (state) => state.incrementScorePowerUpHits,
  )

  let superjumpTimeoutId = null
  let invincibleTimeoutId = null

  function checkCanisterCollision() {
    const collision = checkCollision(runnerRef.current, canRef.current)
    if (collision) {
      powerupTextRef.current.text = can.text
      switch (can.type) {
        case 'brand-racing-point-increase':
          incrementScorePowerUpHits()
          break
        case 'brand-pop-invicibility':
          if (invincibleTimeoutId) clearTimeout(invincibleTimeoutId)
          invinciblePowerUpRef.current = true
          setInvinciblePowerUp(true)
          invincibleTimeoutId = setTimeout(() => {
            invinciblePowerUpRef.current = false
            setInvinciblePowerUp(false)
          }, 5000)
          break
        case 'brand-bonk-superjump':
          if (superjumpTimeoutId) clearTimeout(superjumpTimeoutId)
          superJumpEnabledRef.current = true
          superjumpTimeoutId = setTimeout(
            () => (superJumpEnabledRef.current = false),
            10000,
          )
          break
      }

      outlineColorRef.current = canRef.current.color
      setTimeout(() => {
        powerupTextRef.current.fillOpacity = 1
      }, 50)
    }
  }

  function checkObstacleCollision() {
    if (invinciblePowerUpRef.current) return

    for (let i = 0; i < obstRefsLst.length; i++) {
      if (!obstRefsLst[i].current) continue

      const collided = checkCollision(runnerRef.current, obstRefsLst[i].current)
      if (!collided) continue
      const theHitObst = obstRefsLst[i].current.objName

      if (actionsRef.current.slide.isRunning()) {
        if (theHitObst === 'tallData' || theHitObst === 'hurdleData') {
          continue
        }
      }
      const action = actionsRef.current.stumble
      if (action && !action.isRunning()) {
        actionsRef.current?.run.fadeOut(0.1).fadeIn(2.5)
        action.reset().setLoop(THREE.LoopOnce).play()
      }
      apiZ.start({
        runnerZ: runnerZpos.get() + 5,
        cameraZ: cameraZpos.get() - 5,
        config: { duration: 1000 },
        onRest: () =>
          apiZ.start(startRunner(runnerZpos.get(), cameraZpos.get())),
      })
    }
  }

  useFrame(() => {
    const playerPos = parseInt(runnerZpos.get())
    if (playerPos % obstEvery === 0 && playerPos !== playerZ) {
      setPlayerZ(playerPos) //will cause whole component to rerender
      return
    }

    checkCanisterCollision()
    checkObstacleCollision()

    if (powerupTextRef.current.fillOpacity > 0) {
      powerupTextRef.current.fillOpacity -= 0.004
    }
  })

  return (
    <group>
      <group>
        <Barrier
          objName={barrierData.objName}
          innerRef={barrierRef}
          position={barrierData.position}
        />
        <TallHurdle
          objName={tallData.objName}
          innerRef={tallHurdleRef}
          position={tallData.position}
        />
        <Hurdle
          objName={hurdleData.objName}
          innerRef={hurdleRef}
          position={hurdleData.position}
        />
        <Wall
          objName={wallData.objName}
          innerRef={wallRef}
          position={wallData.position}
        />
      </group>

      <Canister
        key='canister'
        innerRef={canRef}
        url={can.url}
        imageScale={can.imageScale}
        color={can.color}
        objName={can.url}
        position={can.position}
        type={can.type}
        text={can.text}
      />
      <ModelHandler />
    </group>
  )
}

function getObstaclesData(playerZ, gameEnded = false) {
  const numOfObstacles = randomItemFromArr([1, 2])
  const lanes = [-1, 0, 1]
  const obstacleDistances = [obstEvery * 0.5, obstEvery * 0.7, obstEvery * 0.9]

  const beginPos = [10, 10, 10]
  const obstData = {
    barrierData: { position: beginPos },
    tallData: { position: beginPos },
    hurdleData: { position: beginPos },
    wallData: { position: beginPos },
  }
  if (gameEnded) return obstData

  const obstOpts = Object.keys(obstData)

  for (let i = 0; i < numOfObstacles; i++) {
    const randDistZ = randomItemFromArr(obstacleDistances)
    const randLane = getRandomItemAndPop(lanes)
    const obstName = getRandomItemAndPop(obstOpts)
    obstData[obstName].objName = obstName
    obstData[obstName].position = [randLane, 1, playerZ - randDistZ]
  }

  return obstData
}

function getRandomCanisterData(playerZ, gameEnded = false) {
  const canisterDistances = [obstEvery * 0.65, obstEvery * 0.75]
  const randDistZCanister = randomItemFromArr(canisterDistances)
  const canisters = [
    {
      position: [0, 1.5, playerZ - randDistZCanister],
      color: '#a884f3',
      url: '/png/icon-tire.png',
      imageScale: 1.5,
      type: 'brand-racing-point-increase',
      text: 'Brand Racing\n+100 points!',
    },
    {
      position: [-1, 1.5, playerZ - randDistZCanister],
      color: '#fbff86',
      url: '/png/icon-hammer.png',
      imageScale: 1.2,
      type: 'brand-bonk-superjump',
      text: 'Brand Bonk\nSuper Jump!',
    },
    {
      position: [1, 1.5, playerZ - randDistZCanister],
      color: '#8ff8e2',
      url: '/png/icon-balloon.png',
      imageScale: 1.25,
      type: 'brand-pop-invicibility',
      text: 'Brand Pop\nInvincibility!',
    },
  ]

  const randomCanister = randomItemFromArr(canisters)
  randomCanister.position[0] = randomItemFromArr([-1, 0, 1])

  if (gameEnded || Math.random() < 0.4) {
    // hide canister if game ended or 40% chance so 60% chance spawn rate
    randomCanister.position = [10, 10, 10]
  }

  return randomCanister
}

function checkCollision(runner, obstacle) {
  const runnerBox = new Box3().setFromObject(
    // For some reason, the runner's powerup effects expand the hitbox too much
    // This sets the hitbox to and only to the "Alpha_Joints" descendant of Runner.jsx
    // There is probably a better way to do this
    runner.children[0].children[1],
  )
  const obstacleBox = createBoundingBox(obstacle)
  return runnerBox.intersectsBox(obstacleBox)
}

function createBoundingBox(objectRef) {
  const boundingBox = new Box3().setFromObject(objectRef)
  const size = new THREE.Vector3()
  boundingBox.getSize(size)

  const type = objectRef.objName
  let addSizeY = 0
  let addSizeZ = 0

  switch (type) {
    case '/png/icon-balloon.png':
    case '/png/icon-tire.png':
    case '/png/icon-hammer.png':
      addSizeY = 1.5
      addSizeZ = 0.5
      break
    case 'barrierData':
    case 'hurdleData':
      addSizeY = 0
      addSizeZ = 0.25
      break
    case 'wallData':
    case 'tallData':
      addSizeY = 0
      addSizeZ = 1
      break
  }

  const geometry = new THREE.BoxGeometry(
    size.x,
    size.y + addSizeY,
    size.z + addSizeZ,
  )
  const material = new THREE.MeshBasicMaterial({
    color: 0xff000,
    transparent: true,
    opacity: 0.0,
    // wireframe: true,
  })

  const boundingBoxMesh = new THREE.Mesh(geometry, material)
  boundingBoxMesh.position.copy(objectRef.position)
  boundingBoxMesh.position.y = (size.y + addSizeY) / 2 + 1
  objectRef.parent.add(boundingBoxMesh)
  const newBox = new Box3().setFromObject(boundingBoxMesh)
  return newBox
}
export default TheRoad
