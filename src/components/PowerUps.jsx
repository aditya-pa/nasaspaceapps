import React, { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playSound } from '../services/soundManager'
import '../styles/asteroidEffects.css'

const POWER_UP_TYPES = {
  SHIELD_BOOST: {
    id: 'shield_boost',
    icon: '🛡️',
    name: 'Shield Boost',
    color: 'neon-purple',
    duration: 0, // Instant effect
    effect: '+20% Shield'
  },
  TIME_FREEZE: {
    id: 'time_freeze', 
    icon: '⏳',
    name: 'Time Freeze',
    color: 'neon-blue',
    duration: 5000, // 5 seconds
    effect: 'Slow Asteroids'
  },
  DOUBLE_POINTS: {
    id: 'double_points',
    icon: '🔥', 
    name: 'Double Points',
    color: 'neon-green',
    duration: 15000, // 15 seconds
    effect: '2x Score'
  }
}

function PowerUp({ powerUp, onCollect }) {
  const powerUpType = POWER_UP_TYPES[powerUp.type]
  const [isCollecting, setIsCollecting] = useState(false)
  
  const handleClick = () => {
    setIsCollecting(true)
    // Play power-up collection sound
    playSound('powerUp')
    // Add collection particles
    createCollectionParticles(powerUp.x, powerUp.y)
    // Call original collect after brief delay for effect
    setTimeout(() => onCollect(powerUp), 500)
  }
  
  const createCollectionParticles = (x, y) => {
    // Create multiple particle elements
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = x + 'px'
      particle.style.top = y + 'px'
      particle.style.setProperty('--random-x', (Math.random() - 0.5) * 200 + 'px')
      particle.style.setProperty('--random-y', -(Math.random() * 150 + 50) + 'px')
      document.body.appendChild(particle)
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      }, 2000)
    }
  }
  
  if (isCollecting) {
    return (
      <motion.div
        className="absolute power-up-collect-effect"
        style={{
          left: powerUp.x,
          top: powerUp.y,
          zIndex: 20
        }}
      >
        <div className="text-4xl">✨</div>
      </motion.div>
    )
  }
  
  return (
    <motion.div
      className="absolute pointer-events-auto cursor-pointer"
      style={{
        left: powerUp.x,
        top: powerUp.y,
        zIndex: 20
      }}
      initial={{ 
        scale: 0,
        opacity: 0,
        y: powerUp.y - 50
      }}
      animate={{ 
        scale: 1,
        opacity: 1,
        y: powerUp.y,
        rotate: [0, 360]
      }}
      exit={{
        scale: 0,
        opacity: 0,
        y: powerUp.y + 50
      }}
      transition={{
        rotate: {
          repeat: Infinity,
          duration: 3,
          ease: "linear"
        }
      }}
      onClick={handleClick}
    >
      {/* Power-up container */}
      <div className={`relative w-16 h-16 rounded-full border-2 border-${powerUpType.color} 
                      bg-gradient-to-br from-${powerUpType.color}/20 to-transparent
                      animate-pulse-neon flex items-center justify-center group
                      hover:scale-110 transition-transform duration-200`}>
        
        {/* Icon */}
        <span className="text-2xl">{powerUpType.icon}</span>
        
        {/* Glow effect */}
        <div className={`absolute -inset-2 bg-${powerUpType.color} rounded-full opacity-30 blur-md -z-10`} />
        
        {/* Tooltip */}
        <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 
                        glassmorphic px-2 py-1 text-xs text-white whitespace-nowrap
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
          <div className="font-bold">{powerUpType.name}</div>
          <div className="text-gray-300">{powerUpType.effect}</div>
        </div>
      </div>
    </motion.div>
  )
}

function PowerUps({
  powerUps,
  setPowerUps,
  setActiveShieldBoost,
  setActiveTimeFreeze, 
  setActiveDoublePoints,
  setShield
}) {
  
  // Spawn random power-ups
  const spawnPowerUp = useCallback(() => {
    const types = Object.keys(POWER_UP_TYPES)
    const randomType = types[Math.floor(Math.random() * types.length)]
    
    const newPowerUp = {
      id: `powerup_${Date.now()}_${Math.random()}`,
      type: randomType,
      x: Math.random() * (window.innerWidth - 100) + 50,
      y: Math.random() * (window.innerHeight - 200) + 100,
      spawnTime: Date.now()
    }
    
    setPowerUps(prev => [...prev, newPowerUp])
    
    // Auto-remove after 10 seconds if not collected
    setTimeout(() => {
      setPowerUps(prev => prev.filter(p => p.id !== newPowerUp.id))
    }, 10000)
    
  }, [setPowerUps])

  // Spawn power-ups periodically - more frequent spawning
  useEffect(() => {
    const interval = setInterval(() => {
      // 40% chance every 8 seconds to spawn a power-up (increased from 20% every 15s)
      if (Math.random() < 0.4 && powerUps.length < 3) {
        spawnPowerUp()
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [powerUps.length, spawnPowerUp])

  // Handle power-up collection
  const handleCollect = useCallback((powerUp) => {
    // Remove the collected power-up
    setPowerUps(prev => prev.filter(p => p.id !== powerUp.id))
    
    // Apply power-up effect
    const powerUpType = POWER_UP_TYPES[powerUp.type]
    
    switch (powerUp.type) {
      case 'SHIELD_BOOST':
        setShield(prev => Math.min(100, prev + 20))
        setActiveShieldBoost(true)
        setTimeout(() => setActiveShieldBoost(false), 2000) // Visual feedback
        break
        
      case 'TIME_FREEZE':
        setActiveTimeFreeze(true)
        playSound('timeFreeze') // Special time freeze sound
        setTimeout(() => setActiveTimeFreeze(false), powerUpType.duration)
        break
        
      case 'DOUBLE_POINTS':
        setActiveDoublePoints(true)
        setTimeout(() => setActiveDoublePoints(false), powerUpType.duration)
        break
    }
    
    // Play sound effect (would be handled by sound manager)
    console.log(`Collected ${powerUpType.name} power-up!`)
    
  }, [setPowerUps, setShield, setActiveShieldBoost, setActiveTimeFreeze, setActiveDoublePoints])

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {powerUps.map(powerUp => (
          <PowerUp
            key={powerUp.id}
            powerUp={powerUp}
            onCollect={handleCollect}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default PowerUps