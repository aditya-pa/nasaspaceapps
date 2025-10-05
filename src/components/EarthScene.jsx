import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Sphere, Text } from '@react-three/drei'
import { motion } from 'framer-motion'
import { TextureLoader } from 'three'
import { EARTH_THEMES } from '../data/asteroidSkins'

function Earth({ shield, theme = 'DEFAULT' }) {
  const meshRef = useRef()
  const cloudsRef = useRef()
  
  // Load Earth textures
  const earthAlbedo = useLoader(TextureLoader, '/59-earth/textures/earth albedo.jpg')
  const earthBump = useLoader(TextureLoader, '/59-earth/textures/earth bump.jpg')
  const earthClouds = useLoader(TextureLoader, '/59-earth/textures/clouds earth.png')
  const earthNightLights = useLoader(TextureLoader, '/59-earth/textures/earth night_lights_modified.png')
  
  useFrame((state) => {
    if (meshRef.current) {
      // Continuous slow rotation
      meshRef.current.rotation.y += 0.005
    }
    if (cloudsRef.current) {
      // Clouds rotate slightly faster for realism
      cloudsRef.current.rotation.y += 0.007
    }
  })

  // Get current Earth theme
  const currentTheme = EARTH_THEMES[theme] || EARTH_THEMES.DEFAULT
  
  // Earth color tint based on shield level
  const getShieldTint = () => {
    if (shield > 70) return 0xffffff      // Normal white tint
    if (shield > 40) return 0xffddaa      // Slight orange tint  
    if (shield > 20) return 0xffaaaa      // Pink tint
    return 0xff6666                       // Red tint for critical
  }

  return (
    <group>
      {/* Earth sphere with realistic textures */}
      <Sphere ref={meshRef} args={[2, 64, 64]} position={[0, -3, 0]}>
        <meshStandardMaterial
          map={earthAlbedo}
          bumpMap={earthBump}
          bumpScale={0.1}
          emissiveMap={earthNightLights}
          emissiveIntensity={shield < 50 ? 0.3 : 0.1}
          color={getShieldTint()}
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>
      
      {/* Cloud layer */}
      <Sphere ref={cloudsRef} args={[2.05, 64, 64]} position={[0, -3, 0]}>
        <meshStandardMaterial
          map={earthClouds}
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </Sphere>
      
      {/* Atmosphere glow */}
      <Sphere args={[2.2, 32, 32]} position={[0, -3, 0]}>
        <meshBasicMaterial
          color={shield > 50 ? 0x87CEEB : 0xff6b6b}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </Sphere>
      
      {/* Shield indicator */}
      {shield > 0 && (
        <Sphere args={[2.5, 32, 32]} position={[0, -3, 0]}>
          <meshBasicMaterial
            color="#00f5ff"
            transparent
            opacity={shield / 400} // Max 0.25 opacity
            wireframe
          />
        </Sphere>
      )}
    </group>
  )
}

function SpaceBackground() {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.4} />
      
      {/* Directional light (sun) */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        color="#ffffff"
      />
      
      {/* Point light for dramatic effect */}
      <pointLight
        position={[-5, -5, 5]}
        intensity={0.5}
        color="#4fc3f7"
      />
    </>
  )
}

function EarthScene({ shield = 100, asteroids = [], onAsteroidClick, timeFreeze = false }) {

  
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
      >
        <SpaceBackground />
        <Earth shield={shield} />
      </Canvas>
      
      {/* Earth label */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="text-white text-sm font-bold">EARTH</div>
        <div className="text-xs text-gray-300">
          Shield: {shield}%
        </div>
      </motion.div>
    </div>
  )
}

export default EarthScene