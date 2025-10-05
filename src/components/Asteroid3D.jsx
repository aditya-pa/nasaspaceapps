import React, { useRef, useEffect, useState, Suspense } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function Asteroid3D({ 
  asteroid, 
  timeFreeze = false,
  onClick
}) {
  const meshRef = useRef()
  const [currentPos, setCurrentPos] = useState([
    (asteroid.startX / window.innerWidth) * 20 - 10, // Convert to 3D X
    7.5, // Start at top
    0
  ])
  
  // Determine model path based on asteroid properties
  let modelPath = '/asteroid_2d_game_model.glb' // default
  if (asteroid.skin?.type === 'GOLD') {
    modelPath = '/asteroid_1b_gold_free_game_model.glb'
  } else if (asteroid.skin?.type === 'CRYSTAL') {
    modelPath = '/asteroid_1d_crystal__free_game_model.glb'
  }
  

  
  const gltf = useLoader(GLTFLoader, modelPath)
  
  useFrame((state, delta) => {
    if (meshRef.current && !timeFreeze && !asteroid.isDeflected && !asteroid.isColliding) {
      // Move asteroid down
      const speed = delta * 2 // Adjust speed as needed
      setCurrentPos(prev => {
        const newY = prev[1] - speed
        meshRef.current.position.set(prev[0], newY, prev[2])
        
        // Update asteroid object for collision detection
        asteroid.x = (prev[0] + 10) / 20 * window.innerWidth
        asteroid.y = (7.5 - newY) / 15 * window.innerHeight
        
        return [prev[0], newY, prev[2]]
      })
    }
    
    // Rotation
    if (meshRef.current && !timeFreeze) {
      const speed = (asteroid.rotationSpeed || 0.01) * 0.5
      meshRef.current.rotation.x += speed
      meshRef.current.rotation.y += speed * 1.5
      meshRef.current.rotation.z += speed * 0.7
    }
  })
  
  // Calculate scale based on asteroid size (convert pixel size to 3D scale)
  const scale = asteroid.size * 0.01
  
  useEffect(() => {
    if (gltf && meshRef.current) {
      meshRef.current.scale.setScalar(scale)
    }
  }, [gltf, asteroid.size, scale])

  if (!gltf) return null

  if (!gltf || !gltf.scene) {
    console.warn('GLB model not loaded:', modelPath)
    return (
      <mesh ref={meshRef} position={position} onClick={onClick}>
        <sphereGeometry args={[scale * 2, 8, 8]} />
        <meshStandardMaterial 
          color={asteroid.isPotentiallyHazardous ? '#ff0000' : asteroid.skin?.type === 'GOLD' ? '#ffd700' : asteroid.skin?.type === 'CRYSTAL' ? '#00ffff' : '#888888'} 
        />
      </mesh>
    )
  }

  return (
    <group 
      ref={meshRef}
      position={position}
    >
      <mesh onClick={onClick}>
        {/* Invisible clickable sphere for better interaction */}
        <sphereGeometry args={[scale * 3, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      <primitive 
        object={gltf.scene.clone()} 
        scale={[scale * 2, scale * 2, scale * 2]}
      />
      
      {/* Add glow effect for special states */}
      {(isDeflected || isColliding) && (
        <mesh>
          <sphereGeometry args={[scale * 1.5, 16, 16]} />
          <meshBasicMaterial
            color={isDeflected ? '#00ff00' : '#ff4500'}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
      
      {/* Time freeze ice effect */}
      {timeFreeze && (
        <mesh>
          <sphereGeometry args={[scale * 1.3, 16, 16]} />
          <meshBasicMaterial
            color="#87ceeb"
            transparent
            opacity={0.4}
            wireframe
          />
        </mesh>
      )}
      
      {/* PHO warning glow */}
      {asteroid.isPotentiallyHazardous && (
        <pointLight
          color="#ff0000"
          intensity={0.5}
          distance={scale * 10}
          decay={2}
        />
      )}
    </group>
  )
}

export default Asteroid3D