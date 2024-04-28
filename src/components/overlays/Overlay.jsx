import { Text } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBoxShape } from '../../utils/RoundedBoxShape'
import { RoundedBorderShape } from '../../utils/RoundedBorderShape'
import { PowerupText } from './PowerupText'
import { useStore } from '../../store.js'

function Overlay({ springRunnerZ, powerupTextRef }) {
  const [timeLeft, setTimeLeft] = useState(59)
  const [score, setScore] = useState(0)
  const scrorePowerUpHits = useStore((state) => state.scrorePowerUpHits)

  const gameEnded = useStore((state) => state.gameEnded)
  const setGameEnded = useStore((state) => state.setGameEnded)
  const borderThickness = 0.05
  const originalShape = RoundedBoxShape(1.95, 0.9, 0.1)
  const borderShape = RoundedBorderShape(1.9, 0.85, 0.1, borderThickness)

  const buttonShape = RoundedBoxShape(1.175, 0.25, 0.1)
  const buttonBorderShape = RoundedBorderShape(1.15, 0.225, 0.1, 0.015)
  const [buttonHovered, setButtonHovered] = useState(false)

  useEffect(() => {
    if (timeLeft === 0) {
      setGameEnded(true)
      return
    }
    const intervalId = setInterval(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearInterval(intervalId)
  }, [timeLeft, setGameEnded])

  useEffect(() => {
    document.body.style.cursor = buttonHovered ? 'pointer' : 'default'
  }, [buttonHovered])

  const handleButtonClick = () => {
    window.location.reload()
  }

  useFrame((state, delta) => {
    if (gameEnded) return
    setScore(-springRunnerZ.get() + 100 * scrorePowerUpHits)
  })

  const formattedTime = `0:${timeLeft.toString().padStart(2, '0')}`
  return (
    <group>
      <Text
        color='white'
        anchorX='center'
        anchorY='middle'
        position={[2.8, 3.8, -1.5]}
        fontSize={0.25}
        letterSpacing={0.05}
        textAlign='center'
        fontWeight='bold'
        fontStyle='italic'
        outlineColor={'black'}
        outlineWidth={0.01}
      >
        {`Score: ${Math.round(score)}`}
      </Text>
      <Text
        color='white'
        anchorX='center'
        anchorY='middle'
        position={[2.8, 4.15, -1.5]}
        fontSize={0.25}
        letterSpacing={0.05}
        textAlign='center'
        fontWeight='bold'
        fontStyle='italic'
        outlineColor={'black'}
        outlineWidth={0.01}
      >
        {`Timer: ${formattedTime}`}
      </Text>
      <mesh position={[2.9, 4.025, -1.6]}>
        <shapeGeometry args={[originalShape]} />
        <meshStandardMaterial color={0x4d9be6} opacity={0.2} transparent />
      </mesh>
      {/* Border Mesh */}
      <mesh position={[2.9, 4.025, -1.6]}>
        <shapeGeometry args={[borderShape]} />
        <meshStandardMaterial color={0x4d9be6} /> {/* Adjust color as needed */}
      </mesh>
      {gameEnded && (
        <group>
          <Text
            color='red'
            anchorX='center'
            anchorY='middle'
            position={[0, 3, -1.5]}
            fontSize={0.6}
            letterSpacing={0.1}
            textAlign='center'
            fontWeight='bold'
            fontStyle='italic'
            outlineColor={'black'}
            outlineWidth={0.05}
          >
            Game Over
          </Text>
          <group
            name='closeButton'
            onClick={handleButtonClick}
            onPointerOver={() => setButtonHovered(true)}
            onPointerOut={() => setButtonHovered(false)}
          >
            <mesh position={[0, 2.15, 0]}>
              <shapeGeometry args={[buttonShape]} />
              <meshStandardMaterial
                color={0x4d9be6}
                opacity={0.8}
                transparent
              />
            </mesh>
            <mesh position={[0, 2.15, 0.025]}>
              <shapeGeometry args={[buttonBorderShape]} />
              <meshStandardMaterial color={'black'} />{' '}
              {/* Adjust color as needed */}
            </mesh>
            <Text
              color='white'
              anchorX='center'
              anchorY='middle'
              position={[0, 2.15, 0]}
              fontSize={0.125}
              letterSpacing={0.05}
              textAlign='center'
              fontWeight='bold'
              fontStyle='italic'
            >
              Play Again!
            </Text>
          </group>
        </group>
      )}
      <PowerupText powerupTextRref={powerupTextRef} />
    </group>
  )
}

export default Overlay
