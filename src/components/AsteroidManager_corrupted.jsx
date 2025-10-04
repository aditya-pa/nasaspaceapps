import React, { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchAsteroidData } from '../services/nasaApi'
import { getRandomQuestion } from '../services/quizData'
import { createTestAsteroid, getTestQuestion } from '../services/testData'

function Asteroid({ asteroid, onReachEarth, onQuestionTrigger, timeFreeze }) {
  console.log('🌟 DEBUG: ===== INDIVIDUAL ASTEROID RENDER =====') 
  console.log('🌟 DEBUG: Asteroid component rendering:', asteroid.name)
  console.log('🌟 DEBUG: Asteroid full data:', asteroid)
  console.log('🌟 DEBUG: Asteroid position:', { startX: asteroid.startX, endX: asteroid.endX })
  console.log('🌟 DEBUG: Asteroid size:', asteroid.size)
  console.log('🌟 DEBUG: Window dimensions for reference:', { width: window.innerWidth, height: window.innerHeight })
  
  const speed = timeFreeze ? 0.2 : 1
  
  console.log('🌟 DEBUG: Animation speed:', speed)
  console.log('🌟 DEBUG: Fall duration:', asteroid.fallDuration)
        
        {/* MANUAL IMPACT TEST */}
        <button
          className="bg-red-600 text-white px-2 py-1 rounded mt-1 text-xs"
          onClick={() => {
            if (asteroids.length > 0) {
              console.log('💥 DEBUG: MANUAL IMPACT TEST!')
              const testAsteroid = asteroids[0]
              handleAsteroidReachEarth(testAsteroid)
            }
          }}
        >
          💥 Test Impact
        </button>
      </div>mponent rendering:', asteroid.name)
  console.log('🌟 DEBUG: Asteroid full data:', asteroid)
  console.log('🌟 DEBUG: Asteroid position:', { startX: asteroid.startX, endX: asteroid.endX })
  console.log('🌟 DEBUG: Asteroid size:', asteroid.size)
  console.log('🌟 DEBUG: Window dimensions for reference:', { width: window.innerWidth, height: window.innerHeight })
  
  const speed = timeFreeze ? 0.2 : 1
  
  console.log('🌟 DEBUG: Animation speed:', speed)
  console.log('🌟 DEBUG: Fall duration:', asteroid.fallDuration)

  const motionProps = {
    initial: {
      x: asteroid.startX,
      y: -100,
      scale: 0.5,
      opacity: 0
    },
    animate: {
      x: asteroid.endX,
      y: window.innerHeight + 100,
      scale: 1,
      opacity: 1
    },
    transition: {
      duration: asteroid.fallDuration / speed,
      ease: "linear"
    },
    style: {
      left: asteroid.startX,
      zIndex: 10
    }
  }
  
  console.log('🌟 DEBUG: Motion.div props:', motionProps)
  
  // RESTORED PROPER ANIMATION WITH MOVEMENT
  console.log('🎬 DEBUG: Creating motion animation for:', asteroid.name, {
    startX: asteroid.startX,
    endX: asteroid.endX,
    fallDuration: asteroid.fallDuration,
    size: asteroid.size
  })
  
  return (
    <motion.div
      className="absolute pointer-events-auto"
      initial={{
        x: asteroid.startX,
        y: -100, // Start above screen
        scale: 0.3,
        opacity: 0,
        rotate: 0
      }}
      animate={{
        x: asteroid.endX,
        y: window.innerHeight + 100, // Fall below screen
        scale: 1,
        opacity: 1,
        rotate: 360 // Spinning motion
      }}
      transition={{
        duration: asteroid.fallDuration / 1000, // Convert to seconds
        ease: "linear"
      }}
      style={{
        zIndex: 10
      }}
      onAnimationStart={() => {
        console.log('🎬 DEBUG: Asteroid animation STARTED for:', asteroid.name)
      }}
      onAnimationComplete={() => {
        console.log('🎬 DEBUG: ===== ASTEROID ANIMATION COMPLETE =====')
        console.log('🎬 DEBUG: Asteroid name:', asteroid.name)
        console.log('🎬 DEBUG: Question triggered?', asteroid.questionTriggered)
        console.log('🎬 DEBUG: onReachEarth callback exists?', typeof onReachEarth)
        
        if (!asteroid.questionTriggered) {
          console.log('💥 DEBUG: IMPACT! Calling onReachEarth for:', asteroid.name)
          if (onReachEarth) {
            onReachEarth(asteroid)
          } else {
            console.error('⚠️ DEBUG: onReachEarth callback is missing!')
          }
        } else {
          console.log('✅ DEBUG: Asteroid was answered, removing safely')
        }
        console.log('🎬 DEBUG: ===== END ANIMATION COMPLETE =====')
      }}
    >
      <div 
        className="relative cursor-pointer hover:scale-110 transition-transform duration-200"
        onClick={() => {
          console.log('🔄 DEBUG: Asteroid div clicked:', { name: asteroid.name, questionTriggered: asteroid.questionTriggered })
          if (!asteroid.questionTriggered) {
            onQuestionTrigger(asteroid)
          } else {
            console.log('⚠️ DEBUG: Asteroid already triggered, ignoring click')
          }
        }}
        title="Click to answer question and destroy asteroid!"
      >
        {/* THREAT-BASED REALISTIC ASTEROID DESIGN */}
        <div
          style={{
            width: `${asteroid.size}px`,
            height: `${asteroid.size}px`,
            background: asteroid.isPotentiallyHazardous 
              ? 'radial-gradient(circle at 30% 30%, #8B0000, #5D0000, #2F0000)' // Dark red for hazardous
              : asteroid.threatLevel === 'HIGH'
              ? 'radial-gradient(circle at 30% 30%, #8B4513, #5D2F00, #3E1F00)' // Dark orange for high threat
              : 'radial-gradient(circle at 30% 30%, #8B7355, #5D4E37, #3E2723)', // Normal brown
            border: `4px solid ${asteroid.isPotentiallyHazardous ? '#FF0000' : asteroid.threatLevel === 'HIGH' ? '#FF8C00' : '#FFA726'}`,
            borderRadius: asteroid.size > 100 ? '45% 55% 50% 60%' : '50%', // Irregular shape for big ones
            position: 'relative',
            cursor: 'pointer',
            boxShadow: `0 0 ${asteroid.size/3}px ${asteroid.isPotentiallyHazardous ? 'rgba(255, 0, 0, 0.8)' : 'rgba(255, 167, 38, 0.6)'}, inset -10px -10px 20px rgba(0,0,0,0.4)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            animation: asteroid.isPotentiallyHazardous ? 'pulse 1s infinite' : asteroid.threatLevel === 'HIGH' ? 'pulse 2s infinite' : 'none'
          }}
        >
          {/* Threat Level Warning */}
          {asteroid.isPotentiallyHazardous && (
            <div style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#FF0000',
              color: 'white',
              fontSize: '8px',
              padding: '2px 4px',
              borderRadius: '3px',
              fontWeight: 'bold'
            }}>
              ⚠️ PHO
            </div>
          )}
          
          {/* Asteroid name */}
          <div style={{ 
            fontSize: asteroid.size > 100 ? '12px' : '10px', 
            color: asteroid.isPotentiallyHazardous ? '#FFB6C1' : '#FFE0B2', 
            fontWeight: 'bold', 
            textAlign: 'center',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}>
            {asteroid.name?.slice(0, asteroid.size > 100 ? 15 : 12)}
          </div>
          
          {/* Size and threat info */}
          <div style={{ 
            fontSize: asteroid.size > 100 ? '10px' : '8px', 
            color: asteroid.threatLevel === 'HIGH' ? '#FF8C00' : '#FFCC02', 
            marginTop: '2px',
            textAlign: 'center',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}>
            {asteroid.diameter}m • {asteroid.threatLevel}
          </div>
          
          {/* Surface texture craters */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '15%',
            width: '8px',
            height: '8px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '25%',
            right: '20%',
            width: '6px',
            height: '6px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '50%'
          }}></div>
        </div>

        {/* Trail effect */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full 
                     w-1 bg-gradient-to-t from-orange-500 to-transparent"
          style={{ height: asteroid.size * 2 }}
        />

        {/* Enhanced click instruction with urgency */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: asteroid.isPotentiallyHazardous ? 'rgba(255, 0, 0, 0.95)' : asteroid.threatLevel === 'HIGH' ? 'rgba(255, 140, 0, 0.9)' : 'rgba(255, 0, 0, 0.85)',
          color: 'white',
          padding: asteroid.size > 100 ? '10px 16px' : '8px 12px',
          borderRadius: '20px',
          fontSize: asteroid.size > 100 ? '14px' : '12px',
          fontWeight: 'bold',
          textAlign: 'center',
          border: `2px solid ${asteroid.isPotentiallyHazardous ? '#FFFF00' : '#FFA500'}`,
          boxShadow: `0 0 ${asteroid.size/4}px ${asteroid.isPotentiallyHazardous ? 'rgba(255, 255, 0, 1)' : 'rgba(255, 165, 0, 0.8)'}`,
          animation: asteroid.isPotentiallyHazardous ? 'pulse 0.5s infinite' : asteroid.threatLevel === 'HIGH' ? 'pulse 1s infinite' : 'pulse 1.5s infinite'
        }}>
          {asteroid.isPotentiallyHazardous ? '🚨 URGENT! DEFEND NOW! 🚨' : '🎯 CLICK TO DEFEND! 🎯'}
          <br />
          <span style={{ fontSize: asteroid.size > 100 ? '12px' : '10px' }}>
            {asteroid.isPotentiallyHazardous ? 'Hazardous asteroid!' : `${asteroid.threatLevel} threat - Answer fast!`}
          </span>
        </div>

        {/* Click area indicator */}
        <motion.div
          className="absolute inset-0 border-2 border-neon-blue rounded-full opacity-50"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  )
}

function AsteroidManager({
  asteroids,
  setAsteroids,
  setActiveQuestion,
  timeFreeze = false,
  level = 1,
  onAsteroidImpact
}) {
  console.log('🎆 DEBUG: ===== ASTEROIDMANAGER RENDER =====') 
  console.log('🎆 DEBUG: AsteroidManager props:', {
    asteroidsCount: asteroids?.length || 0,
    asteroidsArray: asteroids,
    setAsteroids: typeof setAsteroids,
    setActiveQuestion: typeof setActiveQuestion,
    timeFreeze,
    level
  })
  
  // Check if position overlaps with existing asteroids
  const checkCollision = useCallback((newX, newSize, existingAsteroids) => {
    const minDistance = newSize + 50 // Minimum spacing between asteroids
    
    return existingAsteroids.some(existing => {
      const distance = Math.abs(newX - existing.startX)
      return distance < minDistance
    })
  }, [])
  
  // Generate safe position that doesn't overlap
  const generateSafePosition = useCallback((asteroids, asteroidSize) => {
    let attempts = 0
    let startX, endX
    
    do {
      // Random horizontal positions across screen width
      const margin = Math.max(100, asteroidSize)
      startX = margin + Math.random() * (window.innerWidth - 2 * margin)
      
      // End position with some horizontal drift
      const drift = (Math.random() - 0.5) * 200 // Max 200px drift
      endX = Math.max(margin, Math.min(window.innerWidth - margin, startX + drift))
      
      attempts++
    } while (checkCollision(startX, asteroidSize, asteroids) && attempts < 10)
    
    console.log('📍 DEBUG: Generated position after', attempts, 'attempts:', { startX, endX })
    return { startX, endX }
  }, [checkCollision])

  // Spawn new asteroids
  const spawnAsteroid = useCallback(async () => {
    console.log('🌌 DEBUG: ===== SPAWN ASTEROID CALLED =====')
    console.log('🌌 DEBUG: Window dimensions:', { width: window.innerWidth, height: window.innerHeight })
    console.log('🌌 DEBUG: Current asteroids count before spawn:', asteroids.length)
    try {
      // 🌌 USE REAL NASA DATA! 
      console.log('🌌 DEBUG: Fetching REAL NASA asteroid data...')
      const asteroidData = await fetchAsteroidData()
      console.log('🛰️ DEBUG: NASA asteroid data received:', asteroidData)
      
      const question = getRandomQuestion()
      console.log('❓ DEBUG: Real question selected:', question)
      
      // Calculate threat level and visual properties
      const diameter = asteroidData.diameter || 100
      const velocity = asteroidData.velocity || 25000
      const isPotentiallyHazardous = asteroidData.isPotentiallyHazardous || false
      
      // ENHANCED SIZE RANDOMIZATION - More variety!
      const baseSize = Math.max(40, Math.min(120, diameter / 8)) // Base from real diameter
      const randomFactor = 0.7 + Math.random() * 0.6 // Random 70%-130% of base
      let visualSize = Math.round(baseSize * randomFactor)
      
      // Threat bonuses
      if (isPotentiallyHazardous) visualSize = Math.round(visualSize * 1.4) // 40% bigger
      if (velocity > 60000) visualSize = Math.round(visualSize * 1.2) // 20% bigger  
      if (diameter > 1000) visualSize = Math.round(visualSize * 1.3) // 30% bigger for huge ones
      
      // Ensure variety: 25% chance for extra small/large
      const sizeVariant = Math.random()
      if (sizeVariant < 0.125) visualSize = Math.max(30, Math.round(visualSize * 0.6)) // Extra small
      else if (sizeVariant > 0.875) visualSize = Math.min(180, Math.round(visualSize * 1.5)) // Extra large
      
      // Generate safe positioning (no overlaps)
      const { startX, endX } = generateSafePosition(asteroids, visualSize)
      
      // SPEED CALCULATION - Bigger = More urgent but not too fast
      const baseSpeed = 8000 + Math.random() * 4000 // 8-12 seconds base
      const sizeSpeedPenalty = Math.max(0.5, 1 - (visualSize / 200)) // Bigger = slightly faster
      const levelSpeedUp = Math.max(0.7, 1 - (level * 0.1)) // Higher levels = faster
      const fallDuration = Math.round(baseSpeed * sizeSpeedPenalty * levelSpeedUp)
      
      console.log('⚡ DEBUG: Asteroid threat calculation:', {
        diameter,
        velocity,
        isPotentiallyHazardous,
        visualSize,
        fallDuration,
        speedMultiplier
      })
      
      const newAsteroid = {
        id: `real_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: asteroidData.name || 'Unknown Asteroid',
        diameter: diameter,
        velocity: velocity,
        isPotentiallyHazardous: isPotentiallyHazardous,
        fact: asteroidData.fact || 'Real asteroid from NASA database!',
        size: visualSize,
        startX: startX,
        endX: endX,
        fallDuration: fallDuration,
        questionTriggered: false,
        question: question,
        threatLevel: visualSize > 120 ? 'HIGH' : visualSize > 80 ? 'MEDIUM' : 'LOW'
      }
      
      console.log('✅ DEBUG: REAL asteroid created:', { 
        name: newAsteroid.name, 
        size: newAsteroid.size, 
        diameter: newAsteroid.diameter,
        startX: newAsteroid.startX,
        velocity: newAsteroid.velocity
      })
      
      setAsteroids(prev => {
        const newAsteroids = [...prev, newAsteroid]
        console.log('📊 DEBUG: Real asteroids array:', newAsteroids)
        return newAsteroids
      })
    } catch (error) {
      console.error('🚨 DEBUG: Failed to spawn asteroid:', error)
      console.error('🚨 DEBUG: Error stack:', error.stack)
      // Try spawning a simple mock asteroid as fallback
      const fallbackAsteroid = {
        id: `fallback_${Date.now()}`,
        name: 'Test Asteroid',
        diameter: 100,
        velocity: 25000,
        fact: 'This is a test asteroid',
        size: 50,
        startX: Math.random() * (window.innerWidth - 100),
        endX: Math.random() * (window.innerWidth - 100),
        fallDuration: 5000,
        questionTriggered: false,
        question: {
          question: 'Test question: What is 2 + 2?',
          answers: ['3', '4', '5', '6'],
          correctAnswer: 1,
          points: 10
        }
      }
      console.log('🔥 DEBUG: Using fallback asteroid:', fallbackAsteroid)
      setAsteroids(prev => [...prev, fallbackAsteroid])
    }
  }, [level, setAsteroids])

  // Spawn first asteroid immediately
  useEffect(() => {
    console.log('🔄 DEBUG: Asteroid count changed:', asteroids.length)
    if (asteroids.length === 0) {
      console.log('⚡ DEBUG: No asteroids, spawning first one immediately!')
      spawnAsteroid()
    }
  }, [asteroids.length, spawnAsteroid])

  // Spawn asteroids periodically with better spacing
  useEffect(() => {
    const spawnInterval = Math.max(2000, 4000 - (level * 300)) // More frequent at higher levels
    
    const interval = setInterval(() => {
      const maxAsteroids = Math.max(1, Math.min(3, level)) // 1-3 asteroids based on level
      if (asteroids.length < maxAsteroids) {
        console.log('⏰ DEBUG: Spawning new asteroid, current count:', asteroids.length, 'max:', maxAsteroids)
        spawnAsteroid()
      } else {
        console.log('⏸️ DEBUG: Max asteroids reached, waiting...', asteroids.length, '>=', maxAsteroids)
      }
    }, spawnInterval)

    return () => clearInterval(interval)
  }, [asteroids.length, level, spawnAsteroid])

  // Handle asteroid reaching Earth (missed) - CAUSE DAMAGE!
  const handleAsteroidReachEarth = useCallback((asteroid) => {
    console.log('💥 DEBUG: ===== ASTEROID HIT EARTH! =====') 
    console.log('💥 DEBUG: Asteroid that hit:', asteroid.name, 'Size:', asteroid.size, 'Diameter:', asteroid.diameter)
    
    // Calculate impact damage based on asteroid properties
    const baseDamage = 20
    const sizeDamage = Math.floor(asteroid.size / 10) // Bigger visual size = more damage
    const diameterDamage = Math.floor(asteroid.diameter / 100) // Real diameter damage
    const hazardBonus = asteroid.isPotentiallyHazardous ? 15 : 0
    const totalDamage = baseDamage + sizeDamage + diameterDamage + hazardBonus
    
    console.log('💥 DEBUG: Impact damage calculation:', {
      baseDamage,
      sizeDamage,
      diameterDamage, 
      hazardBonus,
      totalDamage
    })
    
    // Apply damage via callback to parent (App.jsx will handle shield reduction)
    // For now, we'll emit an event or use a damage callback
    if (window.gameState && window.gameState.takeDamage) {
      window.gameState.takeDamage(totalDamage, asteroid)
    }
    
    // Remove asteroid
    setAsteroids(prev => prev.filter(a => a.id !== asteroid.id))
  }, [setAsteroids])

  // Handle asteroid clicked (question triggered)
  const handleQuestionTrigger = useCallback((asteroid) => {
    console.log('💆 DEBUG: Asteroid clicked!', { name: asteroid.name, id: asteroid.id })
    // Mark asteroid as having question triggered
    setAsteroids(prev =>
      prev.map(a =>
        a.id === asteroid.id ? { ...a, questionTriggered: true } : a
      )
    )
    
    console.log('🧐 DEBUG: Showing question panel for:', asteroid.question.question)
    // Show question panel
    setActiveQuestion({
      question: asteroid.question,
      asteroid
    })
  }, [setAsteroids, setActiveQuestion])

  console.log('🎨 DEBUG: AsteroidManager rendering with', asteroids.length, 'asteroids:', asteroids.map(a => a.name))
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* DEBUG: Enhanced visual test */}
      <div className="absolute top-20 left-4 bg-yellow-500 text-black px-2 py-1 rounded z-50 text-xs">
        <div>🎯 Rendering {asteroids.length} asteroids</div>
        {asteroids.length > 0 && (
          <div>
            {asteroids.map((a, i) => (
              <div key={i} className="truncate">
                {i+1}. {a.name} ({a.id?.startsWith('real_') ? '🌌NASA' : a.id?.startsWith('test_') ? '🧪TEST' : '❓UNK'})
              </div>
            ))}
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {asteroids.map(asteroid => {
          console.log('🎨 DEBUG: Rendering asteroid:', asteroid.name, 'at position:', asteroid.startX)
          return (
            <Asteroid
              key={asteroid.id}
              asteroid={asteroid}
              onReachEarth={handleAsteroidReachEarth}
              onQuestionTrigger={handleQuestionTrigger}
              timeFreeze={timeFreeze}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default AsteroidManager