import React, { useEffect, useCallback, useState, forwardRef, useImperativeHandle } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchAsteroidData } from '../services/nasaApi'
import { getRandomQuestion } from '../services/quizData'
import { playSound } from '../services/soundManager'
import { getRandomAsteroidSkin, getTexturePattern, getRotationSpeed } from '../data/asteroidSkins'
import '../styles/asteroidEffects.css'

function Asteroid({ asteroid, onReachEarth, onQuestionTrigger, timeFreeze, questionFreeze, isDeflected, isColliding, isWrongAnswer }) {
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
        (timeFreeze || questionFreeze) && !isDeflected && !isColliding && !isWrongAnswer
          ? {
              x: asteroid.x || asteroid.startX,
              y: asteroid.y || -100,
              scale: 1,
              opacity: 1,
              rotate: asteroid.rotate || 0
            }
          : isDeflected 
          ? {
              x: asteroid.startX + (Math.random() - 0.5) * 800,
              y: -200,
              scale: 0.5,
              opacity: 0,
              rotate: 720
            }
          : isWrongAnswer
          ? {
              x: asteroid.endX,
              y: earthSurfaceY,
              scale: 1.2,
              opacity: 1,
              rotate: 180,
              filter: 'hue-rotate(0deg) saturate(2)'
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
        duration: (timeFreeze || questionFreeze) ? 0 : asteroid.fallDuration / 1000,
        ease: "linear"
      }}
      onUpdate={(latest) => {
        // Completely stop updating position during question freeze
        if (questionFreeze) {
          return
        }
        
        asteroid.x = latest.x
        asteroid.y = latest.y
        
        // Only check collision if not frozen by question or time freeze
        if (!timeFreeze && !questionFreeze && latest.y > earthSurfaceY) {
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
          rotate: (timeFreeze || questionFreeze) ? 0 : 360
        }}
        transition={{
          duration: (timeFreeze || questionFreeze) ? 0 : asteroid.rotationSpeed || 15,
          repeat: (timeFreeze || questionFreeze) ? 0 : Infinity,
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

const AsteroidManager = forwardRef(({
  asteroids,
  setAsteroids,
  setActiveQuestion,
  timeFreeze = false,
  questionFreeze = false,
  level = 1,
  onDeflection,
  onCollision,
  onAsteroidImpact, // Also support this prop name
  gameState
}, ref) => {
  const [deflectedAsteroids, setDeflectedAsteroids] = useState(new Set())
  const [collidingAsteroids, setCollidingAsteroids] = useState(new Set())
  const [wrongAnswerAsteroids, setWrongAnswerAsteroids] = useState(new Set())

  const handleAsteroidReachEarth = useCallback((asteroid) => {
    // COMPLETELY BLOCK collision during question freeze
    if (questionFreeze) {
      console.log('🛡️ DEBUG: Collision blocked due to question freeze')
      return
    }
    
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
      if (onAsteroidImpact) {
        onAsteroidImpact(20, asteroid) // Pass damage and asteroid
      }
    }
  }, [setAsteroids, onCollision, onAsteroidImpact, questionFreeze])

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

  const handleAnswerResult = useCallback((asteroid, isCorrect) => {
    if (isCorrect) {
      // Correct answer - deflect asteroid away from Earth
      setDeflectedAsteroids(prev => new Set([...prev, asteroid.id]))
      setTimeout(() => {
        setAsteroids(prev => prev.filter(a => a.id !== asteroid.id))
        setDeflectedAsteroids(prev => {
          const newSet = new Set(prev)
          newSet.delete(asteroid.id)
          return newSet
        })
      }, 1500)
    } else {
      // Wrong answer - show asteroid damaging Earth
      setWrongAnswerAsteroids(prev => new Set([...prev, asteroid.id]))
      setTimeout(() => {
        setCollidingAsteroids(prev => new Set([...prev, asteroid.id]))
        if (onAsteroidImpact) {
          onAsteroidImpact(30, asteroid) // Higher damage for wrong answer
        }
        setTimeout(() => {
          setAsteroids(prev => prev.filter(a => a.id !== asteroid.id))
          setWrongAnswerAsteroids(prev => {
            const newSet = new Set(prev)
            newSet.delete(asteroid.id)
            return newSet
          })
          setCollidingAsteroids(prev => {
            const newSet = new Set(prev)
            newSet.delete(asteroid.id)
            return newSet
          })
        }, 1000)
      }, 500)
    }
  }, [onAsteroidImpact, setAsteroids])

  const spawnAsteroid = useCallback(async () => {
    try {
      const question = await getRandomQuestion()
      const asteroidTypes = ['REGULAR', 'GOLD', 'CRYSTAL']
      const randomType = asteroidTypes[Math.floor(Math.random() * asteroidTypes.length)]
      
      const visualSize = 60 + Math.random() * 60 // 60-120px
      const startX = 50 + Math.random() * (window.innerWidth - 100)
      const endX = 50 + Math.random() * (window.innerWidth - 100)
      
      const newAsteroid = {
        id: `asteroid_${Date.now()}_${Math.random()}`,
        name: `Asteroid ${Math.floor(Math.random() * 1000)}`,
        size: visualSize,
        startX: startX,
        endX: endX,
        x: startX,
        y: -100,
        isPotentiallyHazardous: Math.random() < 0.3,
        diameter: visualSize,
        velocity: 25000,
        fallDuration: 8000,
        questionTriggered: false,
        question: question,
        threatLevel: visualSize > 100 ? 'HIGH' : 'MEDIUM',
        skin: { type: randomType },
        rotationSpeed: 15
      }
      
      console.log('✅ Spawning real asteroid:', newAsteroid.name, 'Type:', randomType)
      setAsteroids(prev => [...prev, newAsteroid])
    } catch (error) {
      console.error('Error spawning asteroid:', error)
    }
  }, [level, setAsteroids])

  // Add a simple test asteroid immediately 
  useEffect(() => {
    if (asteroids.length === 0) {
      const testAsteroid = {
        id: `test_${Date.now()}`,
        name: 'Test Asteroid',
        size: 80,
        startX: window.innerWidth / 2,
        endX: window.innerWidth / 2,
        x: window.innerWidth / 2,
        y: -100,
        isPotentiallyHazardous: false,
        diameter: 100,
        velocity: 25000,
        fallDuration: 8000,
        questionTriggered: false,
        question: {
          question: 'Test: What is 2+2?',
          answers: ['2', '4', '6', '8'],
          correctAnswer: 1,
          points: 10
        },
        threatLevel: 'MEDIUM',
        skin: { type: 'GOLD' },
        rotationSpeed: 15
      }
      setAsteroids([testAsteroid])
    }
  }, [])

  useEffect(() => {
    if (gameState === 'playing' && !questionFreeze) {
      const interval = setInterval(() => {
        if (asteroids.length < 5 && !questionFreeze) {
          spawnAsteroid()
        }
      }, 1000 + Math.random() * 2000) // Spawn every 1-3 seconds

      return () => clearInterval(interval)
    }
  }, [gameState, asteroids.length, spawnAsteroid, questionFreeze])

  useImperativeHandle(ref, () => ({
    handleAnswerResult
  }), [handleAnswerResult])

  return (
    <AnimatePresence>
      {asteroids.map(asteroid => (
        <Asteroid
          key={asteroid.id}
          asteroid={asteroid}
          onReachEarth={handleAsteroidReachEarth}
          onQuestionTrigger={handleQuestionTrigger}
          timeFreeze={timeFreeze}
          questionFreeze={questionFreeze}
          isDeflected={deflectedAsteroids.has(asteroid.id)}
          isColliding={collidingAsteroids.has(asteroid.id)}
          isWrongAnswer={wrongAnswerAsteroids.has(asteroid.id)}
        />
      ))}
    </AnimatePresence>
  )
})

AsteroidManager.displayName = 'AsteroidManager'

export default AsteroidManager