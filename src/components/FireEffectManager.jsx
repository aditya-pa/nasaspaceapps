import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './FireEffect.css'

function FireEffect({ id, x, y, angle = 0, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(id)
    }, 800) // Fire lasts 0.8 seconds for quick burst effect
    
    return () => clearTimeout(timer)
  }, [id, onComplete])

  return (
    <motion.div
      className="fire-container"
      style={{
        position: 'absolute',
        left: x - 15, // Center the even smaller fire effect
        top: y - 15,
        width: 30,
        height: 30,
        pointerEvents: 'none',
        zIndex: 35
        // Remove container rotation - we'll handle direction in CSS
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="fire"
        style={{
          '--fire-direction-x': Math.cos(angle * Math.PI / 180) * 25 + 'px',
          '--fire-direction-y': Math.sin(angle * Math.PI / 180) * 25 + 'px'
        }}
      >
        {/* Generate fire particles - smaller count for subtler effect */}
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className={`burn ${i < 6 ? 'heat' : ''}`}
            style={{
              '--particle-offset': (i % 3 - 1) * 3 + 'px'
            }}
          ></div>
        ))}
      </div>
    </motion.div>
  )
}

function FireEffectManager({ fires, onFireComplete }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-35">
      <AnimatePresence>
        {fires.map(fire => (
          <FireEffect
            key={fire.id}
            id={fire.id}
            x={fire.x}
            y={fire.y}
            angle={fire.angle}
            onComplete={onFireComplete}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default FireEffectManager