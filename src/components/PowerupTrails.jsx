import { Box, Trail } from "@react-three/drei"

export function Trails(props) {
    const clones = []
    const pieces = 8
    for (let i = 0; i < pieces; i++) {
      clones.push(
        <Trail
          key={i}
          color={props.color}
          width={props.width}
          attenuation={(width) => width * 0.99}
        >
          <Box
            position={[
              Math.random() * 2 - 1,
              Math.random() * 2 - 1,
              Math.random() * 2 - 1
            ]}
            visible={false}
          />
        </Trail>
      )
    }
    return (
      <group {...props}>
        {clones}
      </group>
    )
  }