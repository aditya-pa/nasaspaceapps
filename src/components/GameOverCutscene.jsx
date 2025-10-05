import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function GameOverCutscene({ onCutsceneComplete, score, highScore }) {
  const [showSkip, setShowSkip] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const videoRef = useRef()

  useEffect(() => {
    // Show skip button after 3 seconds
    const skipTimer = setTimeout(() => {
      setShowSkip(true)
    }, 3000)

    // Countdown for skip button
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearTimeout(skipTimer)
      clearInterval(countdownInterval)
    }
  }, [])

  const handleVideoEnd = () => {
    onCutsceneComplete()
  }

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    onCutsceneComplete()
  }

  const [videoError, setVideoError] = useState(false)

  const handleVideoError = (error) => {
    console.warn('Cutscene video failed to load:', error)
    console.log('Trying to load from:', window.location.origin + '/finalcutscene.mp4')
    setVideoError(true)
    
    // Auto-complete after 3 seconds if video fails
    setTimeout(() => {
      onCutsceneComplete()
    }, 3000)
  }

  const handleVideoLoad = () => {
    console.log('Cutscene video loaded successfully')
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Video Container or Fallback */}
      <div className="relative w-full h-full">
        {!videoError ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            onError={handleVideoError}
            onLoadedData={handleVideoLoad}
            preload="auto"
          >
            <source src="/finalcutscene.mp4" type="video/mp4" />
            <source src="/large-assets/finalcutscene.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          // Fallback animation when video fails
          <div className="w-full h-full bg-gradient-to-b from-red-900 via-black to-orange-900 relative overflow-hidden">
            {/* Animated Earth destruction effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 50% 75%, 
                    rgba(255, 69, 0, 0.8) 0%, 
                    rgba(255, 0, 0, 0.6) 30%, 
                    rgba(139, 0, 0, 0.4) 60%, 
                    transparent 100%
                  )
                `
              }}
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.8, 1, 0.3]
              }}
              transition={{
                duration: 3,
                ease: "easeOut"
              }}
            />
            
            {/* Explosion particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-orange-500 rounded-full"
                style={{
                  left: '50%',
                  top: '75%',
                  transform: 'translate(-50%, -50%)'
                }}
                animate={{
                  x: Math.cos(i * 30 * Math.PI / 180) * 300,
                  y: Math.sin(i * 30 * Math.PI / 180) * 300,
                  scale: [1, 0.5, 0],
                  opacity: [1, 0.8, 0]
                }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}

            {/* Shockwave effect */}
            <motion.div
              className="absolute border-4 border-red-500 rounded-full"
              style={{
                left: '50%',
                top: '75%',
                transform: 'translate(-50%, -50%)'
              }}
              animate={{
                width: [0, 800],
                height: [0, 800],
                opacity: [1, 0],
                borderWidth: [4, 1]
              }}
              transition={{
                duration: 2,
                ease: "easeOut"
              }}
            />
          </div>
        )}

        {/* Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Mission Failed Text Overlay */}
          <motion.div
            className="absolute top-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="text-center">
              <h1 className="text-6xl font-bold text-red-500 mb-2 text-shadow-glow">
                MISSION FAILED
              </h1>
              <div className="text-xl text-red-300">
                Earth's defenses have been breached
              </div>
            </div>
          </motion.div>

          {/* Score Display */}
          <motion.div
            className="absolute bottom-32 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <div className="glassmorphic p-6 text-center">
              <div className="text-2xl text-neon-blue mb-2">
                Final Score: {score?.toLocaleString() || 0}
              </div>
              {score > highScore && (
                <div className="text-neon-green text-lg">
                  🏆 New High Score!
                </div>
              )}
            </div>
          </motion.div>

          {/* Skip Button */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                className="absolute top-8 right-8 pointer-events-auto bg-black/70 hover:bg-black/90 text-white px-6 py-3 rounded-lg border border-gray-500 hover:border-gray-300 transition-all duration-300 font-semibold"
                onClick={handleSkip}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <span>⏭️ SKIP CUTSCENE</span>
                </div>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Skip Countdown */}
          {!showSkip && countdown > 0 && (
            <motion.div
              className="absolute top-8 right-8 text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Skip available in {countdown}s
            </motion.div>
          )}

          {/* Cinematic Bars */}
          <div className="absolute top-0 left-0 w-full h-16 bg-black"></div>
          <div className="absolute bottom-0 left-0 w-full h-16 bg-black"></div>
        </div>
      </div>

      {/* Fallback if video fails */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/50 via-black to-red-900/50 opacity-30"></div>
    </motion.div>
  )
}

export default GameOverCutscene