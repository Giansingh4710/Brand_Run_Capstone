import Couplings from './Coupling'
import Hoops from './Hoop'
import Tunnels from './Tunnel'
import TunnelAds from './Space-ad'
import RoadPlatform from './RoadPlatform'

export function ModelHandler(props) {
  return (
    <group>
      {/* <Couplings /> */}
      <Hoops />
      <Tunnels />
    </group>
  )
}
