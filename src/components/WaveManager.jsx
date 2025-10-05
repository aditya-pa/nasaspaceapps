import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getWaveConfig, GAME_PHASES, SPECIAL_EVENTS } from '../data/gameProgression'
import { playSound } from '../services/soundManager'

function WaveManager({ 
  gameState, 
  level, 
  setLevel,
  asteroids,
  onWaveComplete,
  onBossSpawn,
  onSpecialEvent,
  onGameFreeze 
}) {
  const [gamePhase, setGamePhase] = useState(GAME_PHASES.WAVE_PREP)
  const [waveConfig, setWaveConfig] = useState(null)
  const [waveProgress, setWaveProgress] = useState({ destroyed: 0, spawned: 0 })
  const [activeEvent, setActiveEvent] = useState(null)
  const [countdownTimer, setCountdownTimer] = useState(null)
  
  // Initialize wave configuration
  useEffect(() => {
    if (gameState === 'playing') {
      const config = getWaveConfig(level)
      setWaveConfig(config)
      setGamePhase(GAME_PHASES.WAVE_PREP)
      setWaveProgress({ destroyed: 0, spawned: 0 })
    }
  }, [level, gameState])

  // Wave preparation countdown
  useEffect(() => {
    if (gamePhase === GAME_PHASES.WAVE_PREP && waveConfig) {
      setCountdownTimer(3)
      playSound('waveStart')
      
      const countdown = setInterval(() => {
        setCountdownTimer(prev => {
          if (prev <= 1) {
            clearInterval(countdown)
            setGamePhase(GAME_PHASES.WAVE_ACTIVE)
            
            // Trigger special event if configured
            if (waveConfig.specialEvents.length > 0) {
              const randomEvent = waveConfig.specialEvents[Math.floor(Math.random() * waveConfig.specialEvents.length)]
              setTimeout(() => triggerSpecialEvent(randomEvent), 5000)
            }
            
            return null
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(countdown)
    }
  }, [gamePhase, waveConfig])

  // Check wave completion
  useEffect(() => {
    if (gamePhase === GAME_PHASES.WAVE_ACTIVE && waveConfig) {
      if (waveProgress.destroyed >= waveConfig.asteroidCount) {
        // Wave completed!
        setGamePhase(GAME_PHASES.WAVE_COMPLETE)
        playSound('waveComplete')
        
        setTimeout(() => {
          if (waveConfig.hasBoss) {
            setGamePhase(GAME_PHASES.BOSS_PREP)
          } else {
            // Move to next wave
            setLevel(prev => prev + 1)
            onWaveComplete(waveConfig, waveProgress)
          }
        }, 2000)
      }
    }
  }, [waveProgress, gamePhase, waveConfig, setLevel, onWaveComplete])

  // Boss fight handling
  useEffect(() => {
    if (gamePhase === GAME_PHASES.BOSS_PREP && waveConfig?.hasBoss) {
      setCountdownTimer(3)
      
      const countdown = setInterval(() => {
        setCountdownTimer(prev => {
          if (prev <= 1) {
            clearInterval(countdown)
            setGamePhase(GAME_PHASES.BOSS_FIGHT)
            onBossSpawn(waveConfig.bossType)
            playSound('bossAppear')
            return null
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(countdown)
    }
  }, [gamePhase, waveConfig, onBossSpawn])

  // Special event system
  const triggerSpecialEvent = useCallback((eventType) => {
    const event = SPECIAL_EVENTS[eventType]
    if (!event) return

    setActiveEvent({ ...event, type: eventType })
    onSpecialEvent(event)
    playSound('specialEvent')
    
    // End event after duration
    setTimeout(() => {
      setActiveEvent(null)
      onSpecialEvent(null)
    }, event.duration)
  }, [onSpecialEvent])

  // Update wave progress when asteroids are destroyed
  const updateProgress = useCallback((action, count = 1) => {
    setWaveProgress(prev => ({
      ...prev,
      [action]: prev[action] + count
    }))
  }, [])

  // Expose progress updater
  useEffect(() => {
    window.updateWaveProgress = updateProgress
  }, [updateProgress])

  // Freeze game during wave preparation and boss preparation
  useEffect(() => {
    if (onGameFreeze) {
      const shouldFreeze = gamePhase === GAME_PHASES.WAVE_PREP || gamePhase === GAME_PHASES.BOSS_PREP
      onGameFreeze(shouldFreeze)
    }
  }, [gamePhase, onGameFreeze])

  return (
    <AnimatePresence>
      {/* Wave Preparation Screen */}
      {gamePhase === GAME_PHASES.WAVE_PREP && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center glassmorphic p-8 max-w-md">
            <motion.h1 
              className="text-4xl font-bold text-neon-blue mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              WAVE {level}
            </motion.h1>
            
            {waveConfig && (
              <div className="text-white space-y-2">
                <p>🎯 Asteroids to Destroy: {waveConfig.asteroidCount}</p>
                <p>⚡ Max Simultaneous: {waveConfig.maxSimultaneous}</p>
                <p>⏱️ Question Time Limit: {waveConfig.timeLimit}s</p>
                <p>💰 Point Multiplier: {waveConfig.pointMultiplier.toFixed(1)}x</p>
                
                {waveConfig.hasBoss && (
                  <p className="text-neon-red animate-pulse">
                    👑 BOSS WAVE - {waveConfig.bossType.name}
                  </p>
                )}
                
                {waveConfig.specialEvents.length > 0 && (
                  <p className="text-neon-purple">
                    ⚠️ Special Events Possible
                  </p>
                )}
              </div>
            )}
            
            {countdownTimer && (
              <motion.div
                className="text-6xl font-bold text-neon-green mt-6"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
              >
                {countdownTimer}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Boss Preparation Screen */}
      {gamePhase === GAME_PHASES.BOSS_PREP && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-red-900/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center glassmorphic p-8 max-w-lg border-2 border-red-500">
            <motion.h1 
              className="text-5xl font-bold text-neon-red mb-4"
              animate={{ scale: [1, 1.1, 1], textShadow: ['0 0 10px #ff0000', '0 0 30px #ff0000', '0 0 10px #ff0000'] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              BOSS INCOMING
            </motion.h1>
            
            {waveConfig?.bossType && (
              <div className="text-white space-y-3">
                <h2 className="text-2xl text-neon-red">{waveConfig.bossType.name}</h2>
                <p className="text-gray-300">{waveConfig.bossType.description}</p>
                <p className="text-neon-purple">❤️ Health: {waveConfig.bossType.health} hits</p>
                <p className="text-neon-blue">⭐ Special: {waveConfig.bossType.special}</p>
              </div>
            )}
            
            {countdownTimer && (
              <motion.div
                className="text-6xl font-bold text-neon-red mt-6"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.3 }}
              >
                {countdownTimer}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Wave Complete Screen */}
      {gamePhase === GAME_PHASES.WAVE_COMPLETE && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/80"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="text-center glassmorphic p-8 max-w-md border-2 border-green-500">
            <motion.h1 
              className="text-4xl font-bold text-neon-green mb-4"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 1 }}
            >
              WAVE COMPLETE!
            </motion.h1>
            
            <div className="text-white space-y-2">
              <p>🎯 Asteroids Destroyed: {waveProgress.destroyed}</p>
              <p>⚡ Perfect Accuracy: {((waveProgress.destroyed / waveProgress.spawned) * 100).toFixed(1)}%</p>
              <p className="text-neon-green">+{Math.floor(500 * (waveConfig?.pointMultiplier || 1))} Bonus Points!</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Special Event Notification */}
      {activeEvent && (
        <motion.div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 glassmorphic p-4 border-2 border-neon-purple"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
        >
          <div className="text-center">
            <h3 className="text-xl font-bold text-neon-purple mb-2">
              ⚠️ {activeEvent.name} ⚠️
            </h3>
            <p className="text-white text-sm">{activeEvent.description}</p>
          </div>
        </motion.div>
      )}

      {/* Wave Progress HUD */}
      {gamePhase === GAME_PHASES.WAVE_ACTIVE && waveConfig && (
        <div className="fixed top-24 right-4 z-30 glassmorphic p-3 text-white text-sm">
          <div className="space-y-1">
            <div>Wave {level}</div>
            <div>Progress: {waveProgress.destroyed}/{waveConfig.asteroidCount}</div>
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-neon-blue h-2 rounded-full transition-all duration-500"
                style={{ width: `${(waveProgress.destroyed / waveConfig.asteroidCount) * 100}%` }}
              />
            </div>
            {activeEvent && (
              <div className="text-neon-purple text-xs animate-pulse">
                {activeEvent.name} Active
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default WaveManager