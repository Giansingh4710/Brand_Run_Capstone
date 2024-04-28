// import { Environment } from "@react-three/drei";
// const Background = () => {
//   return (
//     <>
//       <Environment
//         background
//         files="/hdr/nebula.hdr"
//         backgroundRotation={[Math.PI / 2, 0, 0]}
//       />
//       <ambientLight intensity={1} />
//       <directionalLight intensity={1} position={[5, 10, 7.5]} />
//     </>
//   );
// };
// export default Background;

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const Background = () => {
  const { scene } = useThree();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "/jpg/nebula.jpg",
      function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = texture;
        scene.environment = texture;
      },
      undefined,
      function (error) {
        console.error("An error occurred loading the texture:", error);
      },
    );
  }, []);

  return null;
};

export default Background;
