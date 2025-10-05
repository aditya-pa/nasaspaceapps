import React from 'react'
import { motion } from 'framer-motion'

function HUD({ 
  score = 0, 
  shield = 100, 
  level = 1, 
  streak = 0, 
  highScore = 0,
  activeDoublePoints = false,
  activeTimeFreeze = false,
  activeShieldBoost = false,
  questionTimer = null,
  questionFreeze = false
}) {
  
  const getShieldColor = () => {
    if (shield > 70) return 'text-neon-blue'
    if (shield > 40) return 'text-yellow-400'
    if (shield > 20) return 'text-orange-500'
    return 'text-red-500'
  }

  const getShieldBgColor = () => {
    if (shield > 70) return 'bg-neon-blue'
    if (shield > 40) return 'bg-yellow-400'
    if (shield > 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
      {/* Top HUD Bar */}
      <div className="glassmorphic m-4 p-4 rounded-xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {/* Score */}
          <div>
            <div className="text-neon-blue text-sm font-bold">SCORE</div>
            <div className="text-2xl text-white font-mono">
              {score.toLocaleString()}
            </div>
          </div>

          {/* Shield */}
          <div>
            <div className={`text-sm font-bold ${getShieldColor()}`}>
              EARTH SHIELD
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                <motion.div
                  className={`h-full ${getShieldBgColor()} transition-all duration-500`}
                  initial={{ width: `${shield}%` }}
                  animate={{ width: `${shield}%` }}
                />
              </div>
              <span className={`text-lg font-mono ${getShieldColor()}`}>
                {shield}%
              </span>
            </div>
          </div>

          {/* Level */}
          <div>
            <div className="text-neon-purple text-sm font-bold">LEVEL</div>
            <div className="text-2xl text-white font-mono">{level}</div>
          </div>

          {/* Streak */}
          <div>
            <div className="text-neon-green text-sm font-bold">STREAK</div>
            <div className="text-2xl text-white font-mono">
              {streak}
              {streak > 0 && (
                <span className="text-xs text-neon-green ml-1">
                  🔥
                </span>
              )}
            </div>
          </div>

          {/* High Score */}
          <div>
            <div className="text-yellow-400 text-sm font-bold">HIGH SCORE</div>
            <div className="text-xl text-white font-mono">
              {highScore.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Question Timer */}
      {questionTimer !== null && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="glassmorphic p-6 rounded-xl border-2 border-yellow-400"
            animate={{
              scale: questionTimer <= 5 ? [1, 1.1, 1] : 1,
              borderColor: questionTimer <= 5 ? ['#fbbf24', '#ef4444', '#fbbf24'] : '#fbbf24'
            }}
            transition={{ 
              repeat: questionTimer <= 5 ? Infinity : 0, 
              duration: 0.5 
            }}
          >
            <div className="text-center">
              <div className="text-yellow-400 text-sm mb-2">TIME REMAINING</div>
              <motion.div 
                className="text-4xl font-bold text-blue-400"
                animate={{
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5 
                }}
              >
                ∞
              </motion.div>
              <div className="text-sm text-blue-300 mt-2">
                Take Your Time
              </div>
              {questionFreeze && (
                <div className="text-blue-400 text-xs mt-2 flex items-center justify-center gap-1">
                  <span>❄️</span>
                  <span>ASTEROIDS FROZEN</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Active Power-ups */}
      {(activeDoublePoints || activeTimeFreeze || activeShieldBoost) && (
        <div className="absolute top-24 right-4">
          <div className="glassmorphic p-3 rounded-lg">
            <div className="text-xs text-gray-300 mb-2">ACTIVE POWER-UPS</div>
            <div className="space-y-1">
              {activeDoublePoints && (
                <motion.div
                  className="flex items-center gap-2 text-neon-green text-sm"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <span>🔥</span>
                  <span>Double Points</span>
                </motion.div>
              )}
              {activeTimeFreeze && (
                <motion.div
                  className="flex items-center gap-2 text-neon-blue text-sm"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <span>⏳</span>
                  <span>Time Freeze</span>
                </motion.div>
              )}
              {activeShieldBoost && (
                <motion.div
                  className="flex items-center gap-2 text-neon-purple text-sm"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <span>🛡️</span>
                  <span>Shield Boost</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Low shield warning */}
      {shield <= 20 && (
        <motion.div
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1
          }}
        >
          <div className="glassmorphic bg-red-900/50 border-red-500 border-2 p-4 rounded-lg text-center">
            <div className="text-red-500 text-xl font-bold">⚠️ CRITICAL SHIELD LEVEL</div>
            <div className="text-red-300">Earth defenses failing!</div>
          </div>
        </motion.div>
      )}

      {/* Instructions (longer visibility) */}
      <motion.div
        className="fixed top-1/2 left-8 transform -translate-y-1/2 text-left z-50"
        initial={{ opacity: 1, x: -20 }}
        animate={{ opacity: 0, x: -40 }}
        transition={{ delay: 8, duration: 4 }}
      >
        <motion.div 
          className="glassmorphic px-6 py-4 rounded-xl border-2 border-neon-blue"
          animate={{ 
            borderColor: ['#00f5ff', '#bf00ff', '#00f5ff'],
            boxShadow: [
              '0 0 20px rgba(0, 245, 255, 0.5)',
              '0 0 20px rgba(191, 0, 255, 0.5)', 
              '0 0 20px rgba(0, 245, 255, 0.5)'
            ]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="text-white text-lg font-bold mb-2">
            🎯 HOW TO PLAY
          </div>
          <div className="text-neon-blue text-sm">
            👆 <strong>CLICK FALLING ASTEROIDS</strong> to answer questions!<br/>
            🎓 Correct answers = Laser destruction + Points<br/>
            💥 Wrong answers = Earth takes damage<br/>
            🚀 Defend Earth and collect asteroid cards!
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HUD