import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function DefenseBeam({ id, startX, startY, endX, endY, onComplete }) {
  useEffect(() => {
    // Auto-remove beam after animation
    const timer = setTimeout(() => {
      onComplete(id)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [id, onComplete])

  // Calculate beam angle and length
  const dx = endX - startX
  const dy = endY - startY
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)
  const length = Math.sqrt(dx * dx + dy * dy)

  return (
    <motion.div
      className="absolute pointer-events-none z-30"
      style={{
        left: startX,
        top: startY,
        transformOrigin: '0 50%',
        transform: `rotate(${angle}deg)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Main laser beam */}
      <motion.div
        className="absolute bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400"
        style={{
          height: '4px',
          boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
          filter: 'blur(1px)'
        }}
        initial={{ width: 0 }}
        animate={{ width: length }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
      
      {/* Core beam (brighter) */}
      <motion.div
        className="absolute bg-white"
        style={{
          height: '2px',
          top: '1px'
        }}
        initial={{ width: 0 }}
        animate={{ width: length }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-50"
        style={{
          height: '8px',
          top: '-2px',
          filter: 'blur(2px)'
        }}
        initial={{ width: 0 }}
        animate={{ width: length }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
      
      {/* Particle effects at beam end */}
      <motion.div
        className="absolute"
        style={{ left: length - 10, top: -5 }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 0] }}
        transition={{ duration: 0.4, times: [0, 0.3, 1] }}
      >
        <div className="w-3 h-3 bg-cyan-400 rounded-full blur-sm"></div>
        <div className="absolute top-0 left-0 w-3 h-3 bg-white rounded-full blur-none opacity-80"></div>
      </motion.div>
    </motion.div>
  )
}

function DefenseBeamManager({ beams, onBeamComplete }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <AnimatePresence>
        {beams.map(beam => (
          <DefenseBeam
            key={beam.id}
            id={beam.id}
            startX={beam.startX}
            startY={beam.startY}
            endX={beam.endX}
            endY={beam.endY}
            onComplete={onBeamComplete}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default DefenseBeamManager