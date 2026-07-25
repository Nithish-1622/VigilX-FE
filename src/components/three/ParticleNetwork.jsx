import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { InstancedMesh, Object3D, Vector3, Color, FogExp2 } from 'three'
import * as THREE from 'three'

const PARTICLE_COUNT = 320
const CONNECTION_DIST = 0.38
const REPULSION_DIST = 0.55
const SPEED = 0.00018

function createSimplex() {
  // Minimal 3D value noise via hash
  const hash = (n) => {
    let x = Math.sin(n) * 43758.5453123
    return x - Math.floor(x)
  }
  return (x, y, z) => {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z)
    const xf = x - xi, yf = y - yi, zf = z - zi
    const u = xf * xf * (3 - 2 * xf)
    const v = yf * yf * (3 - 2 * yf)
    const w = zf * zf * (3 - 2 * zf)
    const a = hash(xi + yi * 57 + zi * 113)
    const b = hash(xi + 1 + yi * 57 + zi * 113)
    const c = hash(xi + (yi + 1) * 57 + zi * 113)
    const d = hash(xi + 1 + (yi + 1) * 57 + zi * 113)
    const e = hash(xi + yi * 57 + (zi + 1) * 113)
    const f = hash(xi + 1 + yi * 57 + (zi + 1) * 113)
    const g = hash(xi + (yi + 1) * 57 + (zi + 1) * 113)
    const h = hash(xi + 1 + (yi + 1) * 57 + (zi + 1) * 113)
    return a + (b - a) * u + (c - a) * v + (d - b - c + a) * u * v +
      ((e - a) + (a - b - e + f) * u + (a - c - e + g) * v +
        (b + c + e - a - d - f - g + h) * u * v) * w
  }
}

const noise = createSimplex()

function Particles({ mouse }) {
  const meshRef = useRef()
  const linesRef = useRef()
  const { scene } = useThree()
  const dummy = useMemo(() => new Object3D(), [])
  const colorObj = useMemo(() => new Color(), [])
  const t = useRef(0)

  // Particle state
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      pos: new Vector3(
        (Math.random() - 0.5) * 4.2,
        (Math.random() - 0.5) * 2.8,
        (Math.random() - 0.5) * 1.4
      ),
      vel: new Vector3(
        (Math.random() - 0.5) * SPEED * 2,
        (Math.random() - 0.5) * SPEED * 2,
        (Math.random() - 0.5) * SPEED * 0.5
      ),
      noiseOffset: Math.random() * 100,
      baseSize: 0.003 + Math.random() * 0.006,
    }))
  }, [])

  // Lines geometry
  const lineGeom = useMemo(() => new THREE.BufferGeometry(), [])
  const lineMat = useMemo(() => new THREE.LineBasicMaterial({
    color: 0x00c8f0,
    transparent: true,
    opacity: 0.12,
    vertexColors: false,
  }), [])

  const maxLines = PARTICLE_COUNT * 4
  const linePositions = useMemo(() => new Float32Array(maxLines * 2 * 3), [])

  useEffect(() => {
    if (scene) {
      scene.fog = new FogExp2(0x080a0e, 0.28)
    }
  }, [scene])

  useFrame((state) => {
    if (!meshRef.current) return
    t.current += 0.001
    const time = t.current
    const mx = mouse.current.x * 1.2
    const my = mouse.current.y * 0.8

    let lineIdx = 0

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i]

      // Noise drift
      const nx = noise(p.pos.x * 0.4 + time * 0.3 + p.noiseOffset, p.pos.y * 0.4, p.pos.z * 0.4)
      const ny = noise(p.pos.x * 0.4, p.pos.y * 0.4 + time * 0.3 + p.noiseOffset + 10, p.pos.z * 0.4)
      p.vel.x += (nx - 0.5) * SPEED * 0.4
      p.vel.y += (ny - 0.5) * SPEED * 0.4
      p.vel.multiplyScalar(0.985)

      // Mouse repulsion
      const dx = p.pos.x - mx, dy = p.pos.y - my
      const md = Math.sqrt(dx * dx + dy * dy)
      if (md < REPULSION_DIST && md > 0.001) {
        const force = (REPULSION_DIST - md) / REPULSION_DIST * 0.0008
        p.vel.x += (dx / md) * force
        p.vel.y += (dy / md) * force
      }

      p.pos.addScaledVector(p.vel, 1)

      // Wrap
      if (p.pos.x > 2.2) p.pos.x = -2.2
      if (p.pos.x < -2.2) p.pos.x = 2.2
      if (p.pos.y > 1.5) p.pos.y = -1.5
      if (p.pos.y < -1.5) p.pos.y = 1.5

      dummy.position.copy(p.pos)
      const s = p.baseSize * (1 + Math.sin(time * 1.8 + p.noiseOffset) * 0.15)
      dummy.scale.setScalar(s * 180)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)

      // Connections
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        if (lineIdx >= maxLines - 2) break
        const q = particles[j]
        const dist = p.pos.distanceTo(q.pos)
        if (dist < CONNECTION_DIST) {
          linePositions[lineIdx * 6]     = p.pos.x
          linePositions[lineIdx * 6 + 1] = p.pos.y
          linePositions[lineIdx * 6 + 2] = p.pos.z
          linePositions[lineIdx * 6 + 3] = q.pos.x
          linePositions[lineIdx * 6 + 4] = q.pos.y
          linePositions[lineIdx * 6 + 5] = q.pos.z
          lineIdx++
        }
      }
    }

    // Zero out remaining line positions
    for (let i = lineIdx * 6; i < linePositions.length; i++) linePositions[i] = 0

    lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0, Math.max(lineIdx * 6, 6)), 3))
    lineGeom.attributes.position.needsUpdate = true
    if (linesRef.current) linesRef.current.geometry = lineGeom

    meshRef.current.instanceMatrix.needsUpdate = true
    // Tint active nodes cyan, idle nodes dim blue-grey
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const bright = Math.random() < 0.003
      colorObj.set(bright ? '#00c8f0' : '#1a2a3a')
      meshRef.current.setColorAt(i, colorObj)
    }
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={meshRef} args={[null, null, PARTICLE_COUNT]} frustumCulled={false}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial vertexColors />
      </instancedMesh>
      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry ref={lineGeom} />
        <lineBasicMaterial color="#00c8f0" transparent opacity={0.1} />
      </lineSegments>
    </>
  )
}

export default function ParticleNetwork({ style }) {
  const mouse = useRef({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 4.4
    mouse.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 3.0
  }

  return (
    <div
      style={{ position: 'absolute', inset: 0, ...style }}
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ position: [0, 0, 2.4], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <Particles mouse={mouse} />
      </Canvas>
    </div>
  )
}
