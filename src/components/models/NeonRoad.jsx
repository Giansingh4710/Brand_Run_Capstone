import { composable, modules } from "material-composer-r3f"
import { Emitter, InstancedParticles, useParticleLifetime } from "vfx-composer-r3f"
import { AdditiveBlending, Vector3 } from 'three'

export function NeonRoad({ startPosZ }) {
  return (
    <group>
      <Border
        radius={1.5}
        rate={100}
        maxScale={0.1}
        positionZ={startPosZ}
      />
      <Border
        radius={0.5}
        rate={50}
        maxScale={0.05}
        positionZ={startPosZ}
      />
    </group>
  );
}

function Border({ radius, rate, maxScale, positionZ }) {
  const lifetime = useParticleLifetime();
  return (
    <InstancedParticles capacity={5000} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />

      <composable.MeshStandardMaterial
        depthWrite={false}
        blending={AdditiveBlending}
        color={"#4d9be6"}
      >
        <modules.Scale scale={1} />
        <modules.Velocity
          direction={new Vector3(0, 0, 1)}
          time={lifetime.age}
        />
        <modules.Lifetime {...lifetime} />
      </composable.MeshStandardMaterial>

      <Emitter
        rate={rate}
        setup={({ mesh, position, rotation, scale }) => {
          position.set(Math.random() > 0.5 ? radius : -radius, 1, positionZ)
          scale.set(Math.random() * maxScale, Math.random() * maxScale, 5)
          lifetime.write(mesh, Math.random() * 3 + 1)
        }}
      />
    </InstancedParticles>
  )
}