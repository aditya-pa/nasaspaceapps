import React, { useEffect, useCallback, useState, forwardRef, useImperativeHandle } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchAsteroidData } from '../services/nasaApi'
import { getRandomQuestion } from '../services/quizData'
import { playSound } from '../services/soundManager'
import { getRandomAsteroidSkin, getTexturePattern, getRotationSpeed } from '../data/asteroidSkins'
import '../styles/asteroidEffects.css'
import { getEarthScreenPosition, SHIELD_RADIUS, getEarthSurfaceY } from '../utils/earthPosition'

function Asteroid({ asteroid, onReachEarth, onQuestionTrigger, timeFreeze, questionFreeze, waveFreeze, isDeflected, isColliding, isWrongAnswer }) {
  const earthSurfaceY = getEarthSurfaceY()

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
        (timeFreeze || questionFreeze || waveFreeze) && !isDeflected && !isColliding && !isWrongAnswer
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
        
        // Check for shield boundary collision (before reaching Earth surface)
        if (!timeFreeze && !questionFreeze) {
          const earthPos = getEarthScreenPosition()
          
          // Calculate distance from asteroid to Earth center
          const distance = Math.sqrt(
            Math.pow(latest.x - earthPos.x, 2) + 
            Math.pow(latest.y - earthPos.y, 2)
          )
          
          // Trigger collision when asteroid hits shield boundary
          if (distance <= SHIELD_RADIUS && onReachEarth) {
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
  waveFreeze = false,
  level = 1,
  onDeflection,
  onCollision,
  onAsteroidImpact, // Also support this prop name
  gameState,
  answeredQuestions = new Set() // Track correctly answered questions
}, ref) => {
  const [deflectedAsteroids, setDeflectedAsteroids] = useState(new Set())
  const [collidingAsteroids, setCollidingAsteroids] = useState(new Set())
  const [wrongAnswerAsteroids, setWrongAnswerAsteroids] = useState(new Set())

  const handleAsteroidReachEarth = useCallback((asteroid) => {
    // COMPLETELY BLOCK collision during question freeze
    if (questionFreeze) {
      return
    }
    
    if (!asteroid.questionTriggered) {
      // PREVENT DUPLICATE DAMAGE - check if already processed
      if (window.processedAsteroids && window.processedAsteroids.has(asteroid.id)) {
        console.log('🚫 Duplicate asteroid impact blocked:', asteroid.id)
        return
      }
      
      // Mark as processed
      if (!window.processedAsteroids) window.processedAsteroids = new Set()
      window.processedAsteroids.add(asteroid.id)
      
      setCollidingAsteroids(prev => new Set([...prev, asteroid.id]))
      
      setTimeout(() => {
        setAsteroids(prev => prev.filter(a => a.id !== asteroid.id))
        setCollidingAsteroids(prev => {
          const newSet = new Set(prev)
          newSet.delete(asteroid.id)
          return newSet
        })
        // Clean up processed list
        if (window.processedAsteroids) {
          window.processedAsteroids.delete(asteroid.id)
        }
      }, 1000)

      if (onCollision) {
        onCollision(asteroid)
      }
      if (onAsteroidImpact) {
        console.log('🟡 MISSED ASTEROID - sending 15 damage for', asteroid.name)
        onAsteroidImpact(15, asteroid) // Pass damage and asteroid - reduced from 20
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
          console.log('🔴 WRONG ANSWER - sending 20 damage')
          onAsteroidImpact(20, asteroid) // Higher damage for wrong answer - reduced from 30
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
      const question = await getRandomQuestion(level, 0, answeredQuestions)
      const asteroidTypes = ['REGULAR', 'GOLD', 'CRYSTAL']
      const randomType = asteroidTypes[Math.floor(Math.random() * asteroidTypes.length)]
      
      // Fetch real NASA asteroid data for comprehensive information
      console.log('🚀 DEBUG: Fetching NASA asteroid data for game...')
      const nasaAsteroid = await fetchAsteroidData()
      console.log('📊 DEBUG: Received NASA asteroid:', nasaAsteroid.name)
      
      const visualSize = Math.min(Math.max(nasaAsteroid.diameter / 2, 60), 120) // Scale for game display
      const startX = 50 + Math.random() * (window.innerWidth - 100)
      // All asteroids target Earth's precise center position
      const earthPos = getEarthScreenPosition()
      const endX = earthPos.x + (Math.random() - 0.5) * 80 // Small random offset around Earth center
      
      // Create asteroid with comprehensive NASA data
      const newAsteroid = {
        // NASA Identity & Physical Data
        id: nasaAsteroid.id,
        name: nasaAsteroid.name,
        nameSimple: nasaAsteroid.nameSimple,
        diameter: nasaAsteroid.diameter,
        diameterMin: nasaAsteroid.diameterMin,
        diameterMax: nasaAsteroid.diameterMax,
        absoluteMagnitude: nasaAsteroid.absoluteMagnitude,
        
        // NASA Approach Data
        velocity: nasaAsteroid.velocity,
        velocityKmh: nasaAsteroid.velocityKmh,
        velocityKms: nasaAsteroid.velocityKms,
        missDistance: nasaAsteroid.missDistance,
        missDistanceAU: nasaAsteroid.missDistanceAU,
        missDistanceLunar: nasaAsteroid.missDistanceLunar,
        approachDate: nasaAsteroid.approachDate,
        approachDateFull: nasaAsteroid.approachDateFull,
        orbitingBody: nasaAsteroid.orbitingBody,
        
        // NASA Classifications
        isPotentiallyHazardous: nasaAsteroid.isPotentiallyHazardous,
        isSentryObject: nasaAsteroid.isSentryObject,
        
        // NASA Discovery & Observation Data
        firstObservationDate: nasaAsteroid.firstObservationDate,
        lastObservationDate: nasaAsteroid.lastObservationDate,
        dataArcInDays: nasaAsteroid.dataArcInDays,
        observationsUsed: nasaAsteroid.observationsUsed,
        orbitDeterminationDate: nasaAsteroid.orbitDeterminationDate,
        
        // NASA Orbital Elements
        orbitId: nasaAsteroid.orbitId,
        eccentricity: nasaAsteroid.eccentricity,
        semiMajorAxis: nasaAsteroid.semiMajorAxis,
        inclination: nasaAsteroid.inclination,
        orbitalPeriod: nasaAsteroid.orbitalPeriod,
        perihelionDistance: nasaAsteroid.perihelionDistance,
        aphelionDistance: nasaAsteroid.aphelionDistance,
        meanMotion: nasaAsteroid.meanMotion,
        meanAnomaly: nasaAsteroid.meanAnomaly,
        
        // NASA Orbit Classification
        orbitClass: nasaAsteroid.orbitClass,
        orbitClassDescription: nasaAsteroid.orbitClassDescription,
        orbitClassRange: nasaAsteroid.orbitClassRange,
        
        // NASA Tisserand Parameter
        jupiterTisserandInvariant: nasaAsteroid.jupiterTisserandInvariant,
        minimumOrbitIntersection: nasaAsteroid.minimumOrbitIntersection,
        
        // NASA JPL Reference
        nasaJplUrl: nasaAsteroid.nasaJplUrl,
        
        // NASA Fact
        fact: nasaAsteroid.fact,
        
        // Game Properties
        size: visualSize,
        startX: startX,
        endX: endX,
        x: startX,
        y: -100,
        fallDuration: 8000,
        questionTriggered: false,
        question: question,
        threatLevel: nasaAsteroid.isPotentiallyHazardous ? 'HIGH' : (nasaAsteroid.diameter > 100 ? 'MEDIUM' : 'LOW'),
        skin: { type: randomType },
        rotationSpeed: 15
      }
      

      setAsteroids(prev => [...prev, newAsteroid])
    } catch (error) {
      console.error('Error spawning asteroid:', error)
    }
  }, [level, setAsteroids, answeredQuestions])



  useEffect(() => {
    if (gameState === 'playing' && !questionFreeze && !waveFreeze) {
      const interval = setInterval(() => {
        if (asteroids.length < 2 && !questionFreeze && !waveFreeze) { // Reduced from 5 to 2
          spawnAsteroid()
        }
      }, 2000 + Math.random() * 3000) // Spawn every 2-5 seconds (slower)

      return () => clearInterval(interval)
    }
  }, [gameState, asteroids.length, spawnAsteroid, questionFreeze, waveFreeze])

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
          waveFreeze={waveFreeze}
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