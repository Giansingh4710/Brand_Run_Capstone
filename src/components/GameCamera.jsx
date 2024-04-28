import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

const GameCamera = () => {
  const { size } = useThree();

  return (
    <PerspectiveCamera
      makeDefault
      fov={75}
      near={0.1}
      far={1000}
      position={[0, 0, 5]}
      aspect={size.width / size.height}
    />
  );
};

export default GameCamera;
