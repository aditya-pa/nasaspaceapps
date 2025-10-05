import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function IntroPage({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const introSteps = [
    {
      title: "ASTRODEFENDERS",
      subtitle: "NASA Cadet Training Program",
      content: "The Earth is in danger — asteroids are approaching fast!",
      background: "🌍💥"
    },
    {
      title: "MISSION BRIEFING",
      subtitle: "AstroDefense Command Center",
      content: "You are a NASA Cadet assigned to the AstroDefense Command Center.",
      background: "🚀👨‍🚀"
    },
    {
      title: "YOUR MISSION",
      subtitle: "Defend Our Planet",
      content: "Learn, Answer, and Protect 🌍",
      background: "⚡🛡️"
    }
  ]

  const currentStepData = introSteps[currentStep]

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < introSteps.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        // Auto-advance to game after showing all steps
        setTimeout(() => {
          handleComplete()
        }, 3000)
      }
    }, 3500)

    return () => clearTimeout(timer)
  }, [currentStep])

  const handleComplete = () => {
    setIsVisible(false)
    setTimeout(() => onComplete(), 500)
  }

  const handleSkip = () => {
    handleComplete()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated starfield background */}
          <div className="absolute inset-0">
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-70"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          {/* Earth in background */}
          <motion.div
            className="absolute right-10 top-10 text-8xl"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            🌍
          </motion.div>

          {/* Asteroids flying across */}
          <motion.div
            className="absolute text-4xl"
            initial={{ x: -100, y: Math.random() * 400 + 100 }}
            animate={{ x: window.innerWidth + 100 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          >
            ☄️
          </motion.div>
          <motion.div
            className="absolute text-3xl"
            initial={{ x: -100, y: Math.random() * 400 + 200 }}
            animate={{ x: window.innerWidth + 100 }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          >
            🌑
          </motion.div>

          {/* Main content */}
          <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 1.1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* Background emoji */}
                <motion.div
                  className="text-6xl mb-6"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {currentStepData.background}
                </motion.div>

                {/* Title */}
                <motion.h1
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-orange-500 mb-4 px-4 leading-tight"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  {currentStepData.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  className="text-xl md:text-2xl text-blue-300 font-semibold tracking-wider uppercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentStepData.subtitle}
                </motion.p>

                {/* Content */}
                <motion.p
                  className="text-2xl md:text-4xl text-white font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {currentStepData.content}
                </motion.p>

                {/* Progress indicator */}
                <motion.div
                  className="flex justify-center space-x-2 mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {introSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentStep 
                          ? 'bg-orange-500 shadow-lg shadow-orange-500/50' 
                          : index < currentStep 
                          ? 'bg-green-500' 
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </motion.div>

                {/* Action buttons - only show on last step */}
                {currentStep === introSteps.length - 1 && (
                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <motion.button
                      className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xl rounded-lg shadow-2xl transform transition-all hover:scale-105 hover:shadow-orange-500/25"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleComplete}
                    >
                      🚀 BEGIN MISSION
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Skip button */}
          <motion.button
            className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors text-lg font-semibold"
            onClick={handleSkip}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Skip Intro →
          </motion.button>

          {/* Click anywhere to continue hint */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {currentStep < introSteps.length - 1 ? (
              "Click anywhere or wait to continue..."
            ) : (
              "Ready to defend Earth, Cadet?"
            )}
          </motion.div>

          {/* Click handler for manual advance */}
          <div 
            className="absolute inset-0 cursor-pointer z-0"
            onClick={() => {
              if (currentStep < introSteps.length - 1) {
                setCurrentStep(prev => prev + 1)
              } else {
                handleComplete()
              }
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default IntroPage