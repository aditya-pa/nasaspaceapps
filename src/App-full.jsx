import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EarthScene from './components/EarthScene'
import AsteroidManager from './components/AsteroidManager'
import QuestionPanel from './components/QuestionPanel'
import HUD from './components/HUD'
import PowerUps from './components/PowerUps'
import CardCollection from './components/CardCollection'
import WaveManager from './components/WaveManager'
import AchievementManager from './components/AchievementManager'
import IntroPage from './components/IntroPage'
import { initSounds, playSound, stopSound } from './services/soundManager'
import { loadGameData, saveGameData } from './services/storage'
import { fetchAsteroidData } from './services/nasaApi'
import { getWaveConfig, getDailyChallenge } from './data/gameProgression'

const GAME_STATES = {
  INTRO: 'intro',
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
  SPACEPEDIA: 'spacepedia'
}

function App() {
  // Game state
  const [gameState, setGameState] = useState(GAME_STATES.INTRO)
  const [score, setScore] = useState(0)
  const [shield, setShield] = useState(100)
  const [level, setLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [highScore, setHighScore] = useState(0)
  
  // Game entities
  const [asteroids, setAsteroids] = useState([])
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [questionTimer, setQuestionTimer] = useState(null) // Time left to answer
  const [powerUps, setPowerUps] = useState([])
  const [collectedCards, setCollectedCards] = useState([])
  
  // Refs for component methods
  const asteroidManagerRef = useRef()
  
  // Enhanced game progression state
  const [gameStats, setGameStats] = useState({
    wavesCompleted: 0,
    perfectWaves: 0,
    fastAnswers: 0,
    bossesDefeated: 0,
    cardsCollected: [],
    maxWaveReached: 0,
    powerUpsUsedInWave: 0,
    totalPlayTime: 0
  })
  const [unlockedAchievements, setUnlockedAchievements] = useState([])
  const [currentWaveConfig, setCurrentWaveConfig] = useState(null)
  const [specialEventActive, setSpecialEventActive] = useState(null)
  
  // Debug logging for asteroids state changes
  useEffect(() => {
    console.log('🚀 DEBUG: ===== ASTEROIDS STATE CHANGED IN APP.JSX =====')
    console.log('🚀 DEBUG: Asteroids count:', asteroids.length)
    console.log('🚀 DEBUG: Asteroids array:', asteroids)
    if (asteroids.length > 0) {
      asteroids.forEach((asteroid, index) => {
        console.log(`🚀 DEBUG: Asteroid ${index}:`, {
          id: asteroid.id,
          name: asteroid.name,
          size: asteroid.size,
          startX: asteroid.startX,
          endX: asteroid.endX
        })
      })
    }
    console.log('🚀 DEBUG: ===== END ASTEROIDS STATE DEBUG =====')
  }, [asteroids])
  
  // Debug logging for activeQuestion changes
  useEffect(() => {
    console.log('🎯 DEBUG: activeQuestion changed:', activeQuestion)
    if (activeQuestion) {
      console.log('📝 DEBUG: Question details:', {
        question: activeQuestion.question?.question,
        answers: activeQuestion.question?.answers,
        asteroidName: activeQuestion.asteroid?.name
      })
      
      // Start countdown timer based on level (30 seconds starting, reduces with level)
      const asteroid = activeQuestion.asteroid
      const baseTime = 30 // Start with 30 seconds
      const levelPenalty = (level - 1) * 2 // -2 seconds per level after level 1
      const timeLimit = Math.max(10, baseTime - levelPenalty) // Minimum 10 seconds
      
      console.log('⏰ DEBUG: Starting timer:', timeLimit, 'seconds for level:', level)
      setQuestionTimer(timeLimit)
      setQuestionFreeze(true) // Freeze all asteroids during question
      
      // DISABLE automatic timeout - let user answer at their own pace
      // No timer countdown that causes damage
      
      // No cleanup needed since no timer is running
    } else {
      // Clear timer when no active question
      setQuestionTimer(null)
      setQuestionFreeze(false) // Unfreeze asteroids
    }
  }, [activeQuestion])
  
  // Power-up states
  const [activeShieldBoost, setActiveShieldBoost] = useState(false)
  const [activeTimeFreeze, setActiveTimeFreeze] = useState(false)
  const [activeDoublePoints, setActiveDoublePoints] = useState(false)
  const [questionFreeze, setQuestionFreeze] = useState(false)

  // Initialize game
  useEffect(() => {
    const init = async () => {
      await initSounds()
      const savedData = loadGameData()
      setHighScore(savedData.highScore || 0)
      setCollectedCards(savedData.collectedCards || [])
    }
    init()
  }, [])

  // Start new game
  const startGame = useCallback(() => {
    console.log('🚀 DEBUG: Starting new game')
    setGameState(GAME_STATES.PLAYING)
    setScore(0)
    setShield(100)
    setLevel(1)
    setStreak(0)
    setAsteroids([])
    setActiveQuestion(null)
    setPowerUps([])
    console.log('🎵 DEBUG: Playing background music')
    playSound('backgroundMusic', { loop: true, volume: 0.3 })
  }, [])

  // Handle answer submission
  const handleAnswer = useCallback((isCorrect, asteroid) => {
    console.log('🎯 DEBUG: Answer submitted:', { isCorrect, asteroidName: asteroid.name })
    
    // Clear the timer since question was answered - prevent timeout damage
    setQuestionTimer(null)
    setQuestionFreeze(false) // Immediately unfreeze
    
    // Trigger visual effects through asteroid manager
    if (asteroidManagerRef.current) {
      asteroidManagerRef.current.handleAnswerResult(asteroid, isCorrect)
    }
    
    if (isCorrect) {
      // Correct answer - destroy asteroid with deflection animation
      const basePoints = 10
      const timeBonus = questionTimer > 0 ? Math.floor(questionTimer * 2) : 0 // Bonus for quick answers
      const sizeBonus = Math.floor(asteroid.diameter / 100) // Bonus for bigger asteroids
      const streakBonus = streak * 2
      const waveMultiplier = currentWaveConfig?.pointMultiplier || 1
      const specialMultiplier = specialEventActive?.effect?.pointMultiplier || 1
      const totalPoints = (basePoints + timeBonus + sizeBonus + streakBonus) * (activeDoublePoints ? 2 : 1) * waveMultiplier * specialMultiplier
      
      console.log('✅ DEBUG: Correct answer! Points breakdown:', {
        base: basePoints,
        timeBonus,
        sizeBonus, 
        streakBonus,
        waveMultiplier,
        specialMultiplier,
        doublePoints: activeDoublePoints ? 2 : 1,
        total: totalPoints
      })
      
      setScore(prev => prev + totalPoints)
      setStreak(prev => prev + 1)
      
      // Update game stats
      setGameStats(prev => ({
        ...prev,
        fastAnswers: questionTimer > 7 ? prev.fastAnswers + 1 : prev.fastAnswers,
        cardsCollected: prev.cardsCollected.includes(asteroid.id) ? prev.cardsCollected : [...prev.cardsCollected, asteroid.id]
      }))
      
      // Update wave progress
      if (window.updateWaveProgress) {
        window.updateWaveProgress('destroyed', 1)
      }
      
      // Asteroid removal handled by AsteroidManager
      
      // Play deflection sound and show card
      playSound('asteroidDeflect')
      showAsteroidCard(asteroid)
      
    } else {
      // Wrong answer - asteroid hits with collision animation
      console.log('❌ DEBUG: Wrong answer! Damage handled by AsteroidManager')
      
      setStreak(0)
      
      // Asteroid removal and damage handled by AsteroidManager
      
      // Play collision sound for wrong answers
      playSound('collision')
      
      // Show fact anyway for educational value
      showAsteroidCard(asteroid)
    }
    
    setActiveQuestion(null)
    setQuestionFreeze(false) // Unfreeze asteroids after answer
  }, [streak, activeDoublePoints, questionTimer])

  // Show asteroid fact card
  const showAsteroidCard = useCallback((asteroid) => {
    const card = {
      id: asteroid.id,
      name: asteroid.name,
      diameter: asteroid.diameter,
      velocity: asteroid.velocity,
      fact: asteroid.fact,
      timestamp: Date.now()
    }
    
    // Add to collection if not already there
    setCollectedCards(prev => {
      if (!prev.find(c => c.id === card.id)) {
        const newCards = [...prev, card]
        saveGameData({ collectedCards: newCards })
        return newCards
      }
      return prev
    })
  }, [])

  // Game over handler
  useEffect(() => {
    if (shield <= 0 && gameState === GAME_STATES.PLAYING) {
      setGameState(GAME_STATES.GAME_OVER)
      stopSound('backgroundMusic')
      playSound('gameOver')
      
      // Save high score
      if (score > highScore) {
        setHighScore(score)
        saveGameData({ highScore: score, collectedCards })
      }
    }
  }, [shield, gameState, score, highScore, collectedCards])

  return (
    <div className="w-full h-full bg-space-gradient overflow-hidden relative">
      {/* Background Video - Optional for web deployment */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        onError={(e) => {
          // Hide video if it fails to load (e.g., on Netlify due to large file size)
          e.target.style.display = 'none'
          console.log('Background video failed to load - using CSS gradient background')
        }}
      />
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Earth Scene with 3D Asteroids */}
      <EarthScene 
        shield={shield} 
        asteroids={asteroids}
        onAsteroidClick={(asteroid) => {
          // Handle 3D asteroid click - trigger question
          if (asteroid && !asteroid.questionTriggered) {
            const updatedAsteroid = { ...asteroid, questionTriggered: true }
            setAsteroids(prev => prev.map(a => a.id === asteroid.id ? updatedAsteroid : a))
            
            if (asteroid.question) {
              setActiveQuestion({
                question: asteroid.question,
                asteroid: updatedAsteroid
              })
              playSound('newAsteroid')
            }
          }
        }}
        timeFreeze={activeTimeFreeze}
      />

      {/* Game States */}
      <AnimatePresence mode="wait">
        {gameState === GAME_STATES.INTRO && (
          <IntroPage onComplete={() => setGameState(GAME_STATES.MENU)} />
        )}
        {gameState === GAME_STATES.MENU && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50"
          >
            <div className="text-center">
              <motion.h1
                className="text-6xl md:text-8xl font-bold text-gradient mb-8"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                AstroDefenders
              </motion.h1>
              <motion.p
                className="text-xl text-white mb-8 max-w-md mx-auto"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Defend Earth from real NASA asteroids by answering fun quiz questions!
              </motion.p>
              <motion.button
                className="btn-primary text-2xl px-8 py-4"
                onClick={startGame}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 Start Mission
              </motion.button>
              <motion.button
                className="btn-neon border-neon-purple text-neon-purple ml-4 px-6 py-3"
                onClick={() => setGameState(GAME_STATES.SPACEPEDIA)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                📚 Spacepedia
              </motion.button>
            </div>
          </motion.div>
        )}

        {gameState === GAME_STATES.PLAYING && (
          <>
            {/* DEBUG: Show asteroid count */}
            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded z-50">
              🌌 Asteroids: {asteroids.length}
              <br />
              🎮 Game State: {gameState}
              <br />
              <button 
                className="bg-blue-500 px-2 py-1 rounded mt-1 text-xs"
                onClick={() => {
                  console.log('🔥 DEBUG: Current asteroids:', asteroids)
                  console.log('🔥 DEBUG: Manually adding test asteroid...')
                  const testAsteroid = {
                    id: `manual_${Date.now()}`,
                    name: 'Manual Test',
                    size: 80,
                    startX: 200,
                    endX: 300,
                    fallDuration: 10000,
                    questionTriggered: false,
                    question: {
                      question: 'Manual test: What is 1+1?',
                      answers: ['1', '2', '3', '4'],
                      correctAnswer: 1,
                      points: 10
                    }
                  }
                  setAsteroids(prev => [...prev, testAsteroid])
                }}
              >
                Add Test Asteroid
              </button>
            </div>
            
            <HUD 
              score={score}
              shield={shield}
              level={level}
              streak={streak}
              highScore={highScore}
              activeDoublePoints={activeDoublePoints}
              activeTimeFreeze={activeTimeFreeze}
              activeShieldBoost={activeShieldBoost}
              questionTimer={questionTimer}
              questionFreeze={questionFreeze}
            />
            {/* DEBUG PANEL - App.jsx asteroids state */}
            <div className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded z-50 text-sm">
              <div>🚀 App.jsx Asteroids: {asteroids.length}</div>
              <div>Game State: {gameState}</div>
              <div>Active Question: {activeQuestion ? 'YES' : 'NO'}</div>
              {asteroids.length > 0 && (
                <div>IDs: {asteroids.map(a => a.id.slice(-4)).join(', ')}</div>
              )}
              <button 
                className="bg-blue-600 px-2 py-1 rounded mt-1 text-xs"
                onClick={async () => {
                  console.log('🔥 TESTING NASA API DIRECTLY...')
                  try {
                    const today = new Date().toISOString().split('T')[0]
                    const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=RkuqLf7O1I0V4kfLVH1feNAShVzdoMXlKq8Ermos`
                    console.log('📡 Testing URL:', apiUrl)
                    
                    const response = await fetch(apiUrl)
                    console.log('🌐 Response Status:', response.status)
                    
                    if (response.ok) {
                      const data = await response.json()
                      const todayAsteroids = data.near_earth_objects[today] || []
                      console.log('✅ NASA API SUCCESS! Asteroids found:', todayAsteroids.length)
                      console.log('🌌 Sample asteroid:', todayAsteroids[0]?.name)
                      alert(`✅ NASA API WORKING! Found ${todayAsteroids.length} real asteroids!`)
                    } else {
                      console.error('❌ NASA API FAILED:', response.status, response.statusText)
                      const errorText = await response.text()
                      console.error('Error details:', errorText)
                      alert(`❌ NASA API FAILED: ${response.status} - ${response.statusText}`)
                    }
                  } catch (error) {
                    console.error('❌ NASA API ERROR:', error)
                    alert(`❌ NASA API ERROR: ${error.message}`)
                  }
                }}
              >
                🔬 Test NASA API
              </button>
            </div>
            
            <AsteroidManager
              ref={asteroidManagerRef}
              asteroids={asteroids}
              setAsteroids={setAsteroids}
              setActiveQuestion={setActiveQuestion}
              timeFreeze={activeTimeFreeze}
              questionFreeze={questionFreeze}
              level={level}
              gameState={gameState}
              onAsteroidImpact={(damage, asteroid) => {
                console.log('💥 DEBUG: Asteroid impact damage received in App.jsx:', damage)
                setShield(prevShield => {
                  const newShield = Math.max(0, prevShield - damage)
                  console.log('🛡️ DEBUG: Shield reduced from', prevShield, 'to', newShield)
                  return newShield
                })
                setStreak(0) // Reset streak on impact
                playSound('impact') // Play impact sound
              }}
            />
            <PowerUps
              powerUps={powerUps}
              setPowerUps={setPowerUps}
              setActiveShieldBoost={setActiveShieldBoost}
              setActiveTimeFreeze={setActiveTimeFreeze}
              setActiveDoublePoints={setActiveDoublePoints}
              setShield={setShield}
            />
            
            {/* Wave Manager for progressive difficulty */}
            <WaveManager
              gameState={gameState}
              level={level}
              setLevel={setLevel}
              asteroids={asteroids}
              onWaveComplete={(waveConfig, progress) => {
                setGameStats(prev => ({
                  ...prev,
                  wavesCompleted: prev.wavesCompleted + 1,
                  maxWaveReached: Math.max(prev.maxWaveReached, level),
                  perfectWaves: progress.destroyed === waveConfig.asteroidCount ? prev.perfectWaves + 1 : prev.perfectWaves
                }))
              }}
              onBossSpawn={(bossType) => {
                // Add boss asteroid logic here
                console.log('🐉 Boss spawning:', bossType.name)
              }}
              onSpecialEvent={(event) => {
                setSpecialEventActive(event)
              }}
            />
            
            {/* Achievement System */}
            <AchievementManager
              gameStats={gameStats}
              unlockedAchievements={unlockedAchievements}
              setUnlockedAchievements={setUnlockedAchievements}
              onAchievementUnlocked={(achievement) => {
                // Apply achievement rewards
                if (achievement.reward?.type === 'points') {
                  setScore(prev => prev + achievement.reward.value)
                } else if (achievement.reward?.type === 'powerup') {
                  // Add free power-up
                  console.log('🎁 Free power-up reward:', achievement.reward.value)
                }
              }}
            />
            
            {activeQuestion && (
              <QuestionPanel
                question={activeQuestion.question}
                asteroid={activeQuestion.asteroid}
                onAnswer={handleAnswer}
              />
            )}
            
            {/* DEBUG: Force show question panel for testing */}
            {gameState === GAME_STATES.PLAYING && !activeQuestion && (
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50">
                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded font-bold"
                  onClick={() => {
                    console.log('🔥 DEBUG: Force triggering test question')
                    setActiveQuestion({
                      question: {
                        question: 'TEST: What is 2 + 2?',
                        answers: ['2', '4', '6', '8'],
                        correctAnswer: 1,
                        points: 10,
                        explanation: 'Basic math!'
                      },
                      asteroid: {
                        id: 'test',
                        name: 'Test Asteroid',
                        diameter: 100,
                        velocity: 25000
                      }
                    })
                  }}
                >
                  🔥 DEBUG: Force Show Question
                </button>
              </div>
            )}
          </>
        )}

        {gameState === GAME_STATES.GAME_OVER && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center z-50"
          >
            <div className="glassmorphic p-8 text-center max-w-md">
              <h2 className="text-4xl font-bold text-red-500 mb-4">Mission Failed!</h2>
              <p className="text-white mb-4">Earth's defenses have been breached.</p>
              <div className="text-2xl text-neon-blue mb-4">
                Final Score: {score.toLocaleString()}
              </div>
              {score > highScore && (
                <div className="text-neon-green mb-4">🏆 New High Score!</div>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  className="btn-primary"
                  onClick={startGame}
                >
                  Try Again
                </button>
                <button
                  className="btn-neon border-gray-500 text-gray-300"
                  onClick={() => setGameState(GAME_STATES.MENU)}
                >
                  Main Menu
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === GAME_STATES.SPACEPEDIA && (
          <CardCollection
            collectedCards={collectedCards}
            onClose={() => setGameState(GAME_STATES.MENU)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App