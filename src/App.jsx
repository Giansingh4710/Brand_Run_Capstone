import { Canvas } from '@react-three/fiber'
import { OrbitControls, StatsGl } from '@react-three/drei'
import Background from './components/Background'
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import Game from './components/game/Index';
import RoadPlatform from './components/models/RoadPlatform';

import './styles/App.css'
import TunnelAds from './components/models/Space-ad';

function App() {
  return (
    <div className='app-container'>
      <Canvas>
        <StatsGl />
        {/* <OrbitControls /> */}

        <Game />
        <Background />
        <RoadPlatform />
        <TunnelAds position={[-20, 0, -15]} />

        <EffectComposer>
          <Bloom luminanceThreshold={0.7} intensity={0.1}/>
          <Vignette />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default App
