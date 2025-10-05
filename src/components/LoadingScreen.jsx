import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(5)
  const [loadingText, setLoadingText] = useState('Starting AstroDefenders...')

  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: 'Loading NASA API...' },
      { progress: 40, text: 'Initializing Game Engine...' },
      { progress: 60, text: 'Loading Assets...' },
      { progress: 80, text: 'Setting up UI...' },
      { progress: 100, text: 'Ready to Launch!' }
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setProgress(loadingSteps[currentStep].progress)
        setLoadingText(loadingSteps[currentStep].text)
        currentStep++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          onLoadingComplete()
        }, 500)
      }
    }, 600)

    return () => clearInterval(interval)
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      {/* Simple Background Stars */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-40"
            style={{
              width: 2,
              height: 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <h1 className="text-5xl font-bold text-neon-blue mb-8">
          AstroDefenders
        </h1>
        
        {/* Loading Text */}
        <div className="text-white text-lg mb-8">
          {loadingText}
        </div>

        {/* Progress Bar */}
        <div className="w-80 h-2 bg-gray-800 rounded-full mb-4">
          <motion.div
            className="h-full bg-neon-blue rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Progress Percentage */}
        <div className="text-neon-blue text-sm mb-6">
          {progress}%
        </div>

        {/* Simple Loading Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-neon-blue rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen