import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ACHIEVEMENTS } from '../data/gameProgression'
import { playSound } from '../services/soundManager'

function AchievementManager({ 
  gameStats, 
  onAchievementUnlocked,
  unlockedAchievements = [],
  setUnlockedAchievements 
}) {
  const [recentAchievements, setRecentAchievements] = useState([])
  const [achievementProgress, setAchievementProgress] = useState({})

  // Check for achievement unlocks
  useEffect(() => {
    checkAchievements()
  }, [gameStats])

  const checkAchievements = useCallback(() => {
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      if (unlockedAchievements.includes(achievement.id)) return

      let unlocked = false

      switch (achievement.id) {
        case 'first_wave':
          unlocked = gameStats.wavesCompleted >= 1
          break
          
        case 'perfect_wave':
          unlocked = gameStats.perfectWaves >= 1
          break
          
        case 'speed_demon':
          unlocked = gameStats.fastAnswers >= 5
          break
          
        case 'boss_slayer':
          unlocked = gameStats.bossesDefeated >= 1
          break
          
        case 'collector':
          unlocked = (gameStats.cardsCollected?.length || 0) >= 25
          break
          
        case 'survivor':
          unlocked = gameStats.maxWaveReached >= 10
          break
          
        case 'power_user':
          unlocked = gameStats.powerUpsUsedInWave >= 3
          break
      }

      if (unlocked) {
        unlockAchievement(achievement)
      } else {
        updateAchievementProgress(achievement)
      }
    })
  }, [gameStats, unlockedAchievements])

  const unlockAchievement = useCallback((achievement) => {
    console.log('🏆 Achievement unlocked:', achievement.name)
    
    // Add to unlocked list
    setUnlockedAchievements(prev => [...prev, achievement.id])
    
    // Show notification
    setRecentAchievements(prev => [...prev, achievement])
    
    // Play achievement sound
    playSound('achievement')
    
    // Apply reward
    if (onAchievementUnlocked) {
      onAchievementUnlocked(achievement)
    }
    
    // Remove notification after delay
    setTimeout(() => {
      setRecentAchievements(prev => prev.filter(a => a.id !== achievement.id))
    }, 5000)
  }, [setUnlockedAchievements, onAchievementUnlocked])

  const updateAchievementProgress = useCallback((achievement) => {
    let progress = 0

    switch (achievement.id) {
      case 'first_wave':
        progress = Math.min(gameStats.wavesCompleted / 1, 1)
        break
      case 'perfect_wave':
        progress = Math.min(gameStats.perfectWaves / 1, 1)
        break
      case 'speed_demon':
        progress = Math.min(gameStats.fastAnswers / 5, 1)
        break
      case 'boss_slayer':
        progress = Math.min(gameStats.bossesDefeated / 1, 1)
        break
      case 'collector':
        progress = Math.min((gameStats.cardsCollected?.length || 0) / 25, 1)
        break
      case 'survivor':
        progress = Math.min(gameStats.maxWaveReached / 10, 1)
        break
      case 'power_user':
        progress = Math.min(gameStats.powerUpsUsedInWave / 3, 1)
        break
    }

    setAchievementProgress(prev => ({
      ...prev,
      [achievement.id]: progress
    }))
  }, [gameStats])

  return (
    <>
      {/* Achievement Notifications */}
      <AnimatePresence>
        {recentAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            className="fixed top-20 right-4 z-50 glassmorphic p-4 border-2 border-neon-gold w-80"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            style={{ top: `${80 + index * 140}px` }}
          >
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{achievement.icon}</div>
              <div>
                <div className="text-yellow-400 font-bold text-lg">Achievement Unlocked!</div>
                <div className="text-white font-semibold text-lg">{achievement.name}</div>
                <div className="text-gray-100 text-sm">{achievement.description}</div>
                {achievement.reward && (
                  <div className="text-green-400 text-sm mt-1 font-medium">
                    Reward: {achievement.reward.type === 'points' ? `+${achievement.reward.value} points` :
                             achievement.reward.type === 'powerup' ? `Free ${achievement.reward.value}` :
                             achievement.reward.type === 'permanent' ? achievement.reward.value :
                             'Special unlock'}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Achievement Progress Tracker (can be toggled) */}
      <div className="fixed bottom-4 left-4 z-30 space-y-2">
        {Object.values(ACHIEVEMENTS)
          .filter(achievement => !unlockedAchievements.includes(achievement.id))
          .slice(0, 3) // Show only top 3 in progress
          .map(achievement => {
            const progress = achievementProgress[achievement.id] || 0
            
            return (
              <motion.div
                key={achievement.id}
                className="glassmorphic p-2 text-xs text-white opacity-80 hover:opacity-100 transition-opacity w-44"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-2">
                  <span>{achievement.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{achievement.name}</div>
                    <div className="w-24 bg-gray-700 rounded-full h-1">
                      <div 
                        className="bg-neon-blue h-1 rounded-full transition-all duration-500"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs">{Math.floor(progress * 100)}%</div>
                </div>
              </motion.div>
            )
          })
        }
      </div>
    </>
  )
}

export default AchievementManager