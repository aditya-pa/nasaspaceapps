import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getEarthScreenPosition, SHIELD_RADIUS } from '../utils/earthPosition'

function ShieldImpactEffect({ id, x, y, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(id)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [id, onComplete])

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x - 25,
        top: y - 25,
        width: 50,
        height: 50
      }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ 
        scale: [0, 1.5, 2],
        opacity: [1, 0.7, 0]
      }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {/* Main impact flash */}
      <div className="absolute inset-0 rounded-full bg-gradient-radial from-orange-400 via-red-500 to-transparent animate-pulse" />
      
      {/* Energy rings */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-cyan-400"
        initial={{ scale: 0.5, opacity: 1 }}
        animate={{ 
          scale: [0.5, 2, 3],
          opacity: [1, 0.5, 0]
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          boxShadow: '0 0 20px #00ffff, inset 0 0 20px #00ffff'
        }}
      />
      
      {/* Secondary ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-blue-300"
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{ 
          scale: [1, 2.5, 4],
          opacity: [0.8, 0.3, 0]
        }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
      />
      
      {/* Sparks effect */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-6 bg-gradient-to-t from-yellow-400 to-transparent"
          style={{
            left: '50%',
            top: '50%',
            transformOrigin: '0 0',
            transform: `rotate(${i * 45}deg)`
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ 
            scale: [0, 1, 0],
            opacity: [1, 0.8, 0],
            y: [-10, -30]
          }}
          transition={{ 
            duration: 0.6, 
            ease: 'easeOut',
            delay: i * 0.05
          }}
        />
      ))}
    </motion.div>
  )
}

function ShieldBoundary({ shield, impacts, onImpactComplete }) {
  const earthPos = getEarthScreenPosition()
  const shieldRadius = SHIELD_RADIUS

  // Shield opacity based on shield strength
  const shieldOpacity = Math.max(0.1, shield / 100) * 0.3
  
  // Shield color based on shield strength  
  const getShieldColor = () => {
    if (shield > 70) return 'from-cyan-400/40 via-blue-500/20 to-cyan-400/40'
    if (shield > 40) return 'from-yellow-400/40 via-orange-500/20 to-yellow-400/40'
    if (shield > 20) return 'from-orange-400/40 via-red-500/20 to-orange-400/40'
    return 'from-red-400/40 via-red-600/20 to-red-400/40'
  }

  const getBorderColor = () => {
    if (shield > 70) return '#00ffff'
    if (shield > 40) return '#ffaa00'  
    if (shield > 20) return '#ff6600'
    return '#ff0000'
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Shield Boundary Circle */}
      <motion.div
        className={`absolute rounded-full border-2 bg-gradient-radial ${getShieldColor()}`}
        style={{
          left: earthPos.x - shieldRadius,
          top: earthPos.y - shieldRadius,
          width: shieldRadius * 2,
          height: shieldRadius * 2,
          borderColor: getBorderColor(),
          opacity: shieldOpacity,
          boxShadow: `0 0 20px ${getBorderColor()}, inset 0 0 20px ${getBorderColor()}`
        }}
        animate={{
          opacity: [shieldOpacity, shieldOpacity * 1.5, shieldOpacity],
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      {/* Hexagonal Shield Pattern Overlay */}
      <div
        className="absolute"
        style={{
          left: earthPos.x - shieldRadius,
          top: earthPos.y - shieldRadius,
          width: shieldRadius * 2,
          height: shieldRadius * 2,
          background: `
            radial-gradient(circle at 50% 50%, transparent 30%, ${getBorderColor()}22 31%, transparent 32%),
            conic-gradient(from 0deg, transparent, ${getBorderColor()}11, transparent 60deg),
            linear-gradient(45deg, transparent 49%, ${getBorderColor()}11 50%, transparent 51%)
          `,
          borderRadius: '50%',
          opacity: shieldOpacity * 0.7
        }}
      />

      {/* Impact Effects */}
      <AnimatePresence>
        {impacts.map(impact => (
          <ShieldImpactEffect
            key={impact.id}
            id={impact.id}
            x={impact.x}
            y={impact.y}
            onComplete={onImpactComplete}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ShieldBoundary