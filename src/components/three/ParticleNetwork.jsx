import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function ParticleField() {
  const meshRef = useRef()
  const { mouse } = useThree()

  const { positions, colors } = useMemo(() => {
    const count = 2000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10

      // Cyan to blue gradient
      const t = Math.random()
      colors[i * 3] = t * 0.0
      colors[i * 3 + 1] = t * 0.94 + (1 - t) * 0.5
      colors[i * 3 + 2] = t * 1.0
    }
    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.03 + mouse.x * 0.1
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.01 + mouse.y * 0.05
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

function ConnectionLines() {
  const lineRef = useRef()

  const geometry = useMemo(() => {
    const points = []
    const nodeCount = 40
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: (Math.random() - 0.5) * 14,
      y: (Math.random() - 0.5) * 14,
      z: (Math.random() - 0.5) * 6,
    }))

    nodes.forEach((a, i) => {
      nodes.slice(i + 1).forEach((b) => {
        const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
        if (dist < 3.5) {
          points.push(new THREE.Vector3(a.x, a.y, a.z))
          points.push(new THREE.Vector3(b.x, b.y, b.z))
        }
      })
    })
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [])

  useFrame((state) => {
    if (!lineRef.current) return
    lineRef.current.rotation.y = state.clock.elapsedTime * 0.02
    lineRef.current.rotation.x = state.clock.elapsedTime * 0.01
  })

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#00F0FF" transparent opacity={0.15} />
    </lineSegments>
  )
}

export default function ParticleNetwork() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <ParticleField />
      <ConnectionLines />
    </Canvas>
  )
}
