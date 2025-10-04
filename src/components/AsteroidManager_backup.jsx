import React, { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchAsteroidData } from '../services/nasaApi'
import { getRandomQuestion } from '../services/quizData'
import { playSound } from '../services/soundManager'
import { getRandomAsteroidSkin, getTexturePattern, getRotationSpeed } from '../data/asteroidSkins'
import '../styles/asteroidEffects.css'

function Asteroid({ asteroid, onReachEarth, onQuestionTrigger, timeFreeze, isDeflected, isColliding }) {
  const earthSurfaceY = window.innerHeight * 0.75

  return (
    <motion.div
      className="absolute pointer-events-auto"
      initial={{
        x: asteroid.startX,
        y: -100,
        scale: 0.3,
        opacity: 0,
        rotate: 0
      }}
      animate={
        timeFreeze && !isDeflected && !isColliding
          ? false 
          : isDeflected 
          ? {
              x: asteroid.startX + (Math.random() - 0.5) * 800,
              y: -200,
              scale: 0.5,
              opacity: 0,
              rotate: 720
            }
          : isColliding
          ? {
              x: asteroid.endX,
              y: earthSurfaceY,
              scale: 1.5,
              opacity: 1,
              rotate: 180
            }
          : {
              x: asteroid.endX,
              y: earthSurfaceY + 50,
              scale: 1,
              opacity: 1,
              rotate: 360
            }
      }
      transition={{
        duration: timeFreeze ? 0 : asteroid.fallDuration / 1000,
        ease: "linear"
      }}
      onUpdate={(latest) => {
        asteroid.x = latest.x
        asteroid.y = latest.y
        
        if (latest.y > earthSurfaceY) {
          if (onReachEarth) {
            onReachEarth(asteroid)
          }
        }
      }}
      onClick={() => {
        if (!asteroid.questionTriggered && onQuestionTrigger) {
          onQuestionTrigger(asteroid)
        }
      }}
    >
      <motion.div
        animate={{
          rotate: timeFreeze ? 0 : 360
        }}
        transition={{
          duration: timeFreeze ? 0 : asteroid.rotationSpeed || 15,
          repeat: timeFreeze ? 0 : Infinity,
          ease: "linear"
        }}
        style={{
          width: `${asteroid.size}px`,
          height: `${asteroid.size}px`,
          background: isDeflected 
            ? 'radial-gradient(circle at 30% 30%, #00FF00, #00AA00, #006600)'
            : isColliding
            ? 'radial-gradient(circle at 30% 30%, #FF4500, #FF0000, #8B0000)'
            : timeFreeze
            ? 'radial-gradient(circle at 30% 30%, #87CEEB, #4682B4, #2F4F4F)'
            : asteroid.skin?.type === 'GOLD'
            ? 'radial-gradient(circle at 25% 25%, #FFD700, #FFA500, #FF8C00, #B8860B)'
            : asteroid.skin?.type === 'CRYSTAL'
            ? 'radial-gradient(circle at 30% 30%, #E0FFFF, #00CED1, #008B8B, #004D4D)'
            : 'radial-gradient(circle at 35% 25%, #A0522D, #8B4513, #654321, #3E2723)',
          borderRadius: '50%',
          border: `3px solid ${
            isDeflected ? '#00FF00' 
            : isColliding ? '#FF4500'
            : timeFreeze ? '#87CEEB'
            : asteroid.isPotentiallyHazardous ? '#FF0000' 
            : '#FFA726'
          }`,
          boxShadow: `0 0 ${asteroid.size/3}px ${
            isDeflected ? 'rgba(0, 255, 0, 0.8)' 
            : isColliding ? 'rgba(255, 69, 0, 0.9)'
            : timeFreeze ? 'rgba(135, 206, 235, 0.7)'
            : asteroid.isPotentiallyHazardous ? 'rgba(255, 0, 0, 0.8)' 
            : 'rgba(255, 167, 38, 0.6)'
          }`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
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
        
        <div style={{ 
          fontSize: asteroid.size > 100 ? '12px' : '10px', 
          color: '#FFE0B2', 
          fontWeight: 'bold', 
          textAlign: 'center',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
        }}>
          {asteroid.name?.slice(0, asteroid.size > 100 ? 15 : 12)}
        </div>
      </motion.div>
    </motion.div>
  )
}

function AsteroidManager({
  asteroids,
  setAsteroids,
  setActiveQuestion,
  timeFreeze = false,
  level = 1,
  onDeflection,
  onCollision,
  gameState
}) {
  const [deflectedAsteroids, setDeflectedAsteroids] = useState(new Set())
  const [collidingAsteroids, setCollidingAsteroids] = useState(new Set())

  const handleAsteroidReachEarth = useCallback((asteroid) => {
    if (!asteroid.questionTriggered) {
      setCollidingAsteroids(prev => new Set([...prev, asteroid.id]))
      
      setTimeout(() => {
        setAsteroids(prev => prev.filter(a => a.id !== asteroid.id))
        setCollidingAsteroids(prev => {
          const newSet = new Set(prev)
          newSet.delete(asteroid.id)
          return newSet
        })
      }, 1000)

      if (onCollision) {
        onCollision(asteroid)
      }
    }
  }, [setAsteroids, onCollision])

  const handleQuestionTrigger = useCallback((asteroid) => {
    if (asteroid && !asteroid.questionTriggered) {
      const updatedAsteroid = { ...asteroid, questionTriggered: true }
      setAsteroids(prev => prev.map(a => a.id === asteroid.id ? updatedAsteroid : a))
      
      if (asteroid.question) {
        setActiveQuestion({
          question: asteroid.question,
          asteroid: updatedAsteroid
        })
        playSound('newAsteroid')
      }
    }
  }, [setAsteroids, setActiveQuestion])

  const spawnAsteroid = useCallback(async () => {
    try {
      const asteroidData = await fetchAsteroidData()
      const question = await getRandomQuestion()
      const asteroidSkin = getRandomAsteroidSkin()
      
      const visualSize = Math.max(60, Math.min(150, asteroidData.estimated_diameter.kilometers.estimated_diameter_max * 1000 * 10))
      
      const margin = 50
      const startX = margin + Math.random() * (window.innerWidth - 2 * margin)
      const drift = (Math.random() - 0.5) * 300
      const endX = Math.max(margin, Math.min(window.innerWidth - margin, startX + drift))
      
      const fallDuration = Math.max(3000, 8000 - (level * 200))

      const newAsteroid = {
        id: `${asteroidData.id}_${Date.now()}`,
        name: asteroidData.name,
        size: visualSize,
        startX: startX,
        endX: endX,
        x: startX,
        y: -100,
        isPotentiallyHazardous: asteroidData.is_potentially_hazardous_asteroid,
        diameter: asteroidData.estimated_diameter.kilometers.estimated_diameter_max * 1000,
        velocity: asteroidData.close_approach_data[0].relative_velocity.kilometers_per_hour,
        fallDuration: fallDuration,
        questionTriggered: false,
        question: question,
        threatLevel: visualSize > 120 ? 'HIGH' : visualSize > 80 ? 'MEDIUM' : 'LOW',
        skin: asteroidSkin,
        rotationSpeed: getRotationSpeed(asteroidSkin)
      }
      
      setAsteroids(prev => [...prev, newAsteroid])
    } catch (error) {
      console.error('Error spawning asteroid:', error)
    }
  }, [level, setAsteroids])

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        if (asteroids.length < 3) {
          spawnAsteroid()
        }
      }, 2000 + Math.random() * 3000)

      return () => clearInterval(interval)
    }
  }, [gameState, asteroids.length, spawnAsteroid])

  return (
    <AnimatePresence>
      {asteroids.map(asteroid => (
        <Asteroid
          key={asteroid.id}
          asteroid={asteroid}
          onReachEarth={handleAsteroidReachEarth}
          onQuestionTrigger={handleQuestionTrigger}
          timeFreeze={timeFreeze}
          isDeflected={deflectedAsteroids.has(asteroid.id)}
          isColliding={collidingAsteroids.has(asteroid.id)}
        />
      ))}
    </AnimatePresence>
  )
}

export default AsteroidManager