import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'

// ─── Individual floating node ─────────────────────────────────────────────────
const NetworkNode = ({ position, color, size = 0.06 }) => {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle breathing pulse
      const t = state.clock.elapsedTime
      meshRef.current.scale.setScalar(1 + Math.sin(t * 1.5 + position[0]) * 0.12)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} />
    </mesh>
  )
}

// ─── Connection line between two points ──────────────────────────────────────
const ConnectionLine = ({ start, end, opacity = 0.18 }) => {
  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end),
  ], [start, end])

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points)
    return g
  }, [points])

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#3b82f6" transparent opacity={opacity} linewidth={1} />
    </line>
  )
}

// ─── The full network scene ───────────────────────────────────────────────────
const NODE_CONFIGS = [
  { pos: [0, 0, 0],      color: '#3b82f6', size: 0.12 },   // Center hub (FIR)
  { pos: [1.4, 0.6, 0.3], color: '#ef4444', size: 0.08 },  // Suspect
  { pos: [-1.2, 0.8, -0.4], color: '#f59e0b', size: 0.07 },// Victim
  { pos: [0.8, -1.1, 0.6], color: '#8b5cf6', size: 0.07 }, // Evidence
  { pos: [-0.9, -0.9, 0.5], color: '#10b981', size: 0.07 },// Location
  { pos: [1.1, -0.4, -1.0], color: '#ef4444', size: 0.06 },// Suspect 2
  { pos: [-1.5, -0.2, 0.8], color: '#8b5cf6', size: 0.06 },// Evidence 2
  { pos: [0.3, 1.4, -0.8], color: '#6366f1', size: 0.06 }, // Officer
]

const EDGES = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 5], [3, 6], [0, 7], [4, 6],
]

const NetworkScene = () => {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      // Slow auto-rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.12
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.06) * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      {EDGES.map(([a, b], i) => (
        <ConnectionLine
          key={i}
          start={NODE_CONFIGS[a].pos}
          end={NODE_CONFIGS[b].pos}
        />
      ))}

      {/* Nodes */}
      {NODE_CONFIGS.map((node, i) => (
        <NetworkNode
          key={i}
          position={node.pos}
          color={node.color}
          size={node.size}
        />
      ))}
    </group>
  )
}

// ─── Exported component ───────────────────────────────────────────────────────
export const IntelligenceSphere = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#3b82f6" />
      <NetworkScene />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  )
}
