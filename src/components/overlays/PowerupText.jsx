import { Text } from "@react-three/drei";

export function PowerupText({ powerupTextRref }){
  return(
      <group>
        <Text
            ref={powerupTextRref}
            color='white'
            anchorX='center'
            anchorY='middle'
            position={[0, 3.5, -1.5]}
            fontSize={0.35}
            letterSpacing={0.1}
            textAlign='center'
            fontWeight='bold'
            fontStyle='italic'
        >
            {""}
        </Text>
      </group>      
  )
};
