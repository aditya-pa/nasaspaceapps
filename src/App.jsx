import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import EarthScene from './components/EarthScene'
import AsteroidManager from './components/AsteroidManager'
import QuestionPanel from './components/QuestionPanel'
import HUD from './components/HUD'
import PowerUps from './components/PowerUps'
import CardCollection from './components/CardCollection'
import WaveManager from './components/WaveManager'
import AchievementManager from './components/AchievementManager'
import IntroPage from './components/IntroPage'
import DefenseBeamManager from './components/DefenseBeamManager'
import ShieldBoundary from './components/ShieldBoundary'
import FireEffectManager from './components/FireEffectManager'
import GameOverCutscene from './components/GameOverCutscene'
import { initSounds, playSound, stopSound } from './services/soundManager'
import { loadGameData, saveGameData } from './services/storage'
import { fetchAsteroidData } from './services/nasaApi'
import { getWaveConfig, getDailyChallenge } from './data/gameProgression'
import { getEarthScreenPosition } from './utils/earthPosition'

const GAME_STATES = {
  LOADING: 'loading',
  INTRO: 'intro',
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  CUTSCENE: 'cutscene',
  GAME_OVER: 'game_over',
  SPACEPEDIA: 'spacepedia'
}

function App() {
  // Game state - Start with loading
  const [gameState, setGameState] = useState(GAME_STATES.LOADING)
  const [score, setScore] = useState(0)
  const [shield, setShieldInternal] = useState(100)
  
  // Wrap setShield to debug ALL shield changes
  const setShield = useCallback((newValue) => {
    console.log('🛡️ SHIELD CHANGE DETECTED!')
    if (typeof newValue === 'function') {
      setShieldInternal(prev => {
        const result = newValue(prev)
        console.log('🛡️ Shield function: ' + prev + ' -> ' + result)
        console.trace('🛡️ Shield change stack trace')
        return result
      })
    } else {
      console.log('🛡️ Shield direct set: ' + shield + ' -> ' + newValue)
      console.trace('🛡️ Shield direct change stack trace')
      setShieldInternal(newValue)
    }
  }, [shield])
  const [level, setLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [highScore, setHighScore] = useState(0)
  
  // Game entities
  const [asteroids, setAsteroids] = useState([])
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [questionTimer, setQuestionTimer] = useState(null) // Time left to answer
  const [powerUps, setPowerUps] = useState([])
  const [collectedCards, setCollectedCards] = useState([])
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set()) // Track correctly answered questions
  const [defenseBeams, setDefenseBeams] = useState([]) // Active defense beams
  const [shieldImpacts, setShieldImpacts] = useState([]) // Shield impact effects
  const [fireEffects, setFireEffects] = useState([]) // Fire effects for collisions
  
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
  const [gameFreezedByWave, setGameFreezedByWave] = useState(false)
  
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
    setAnsweredQuestions(new Set()) // Reset answered questions for new game
    console.log('🎵 DEBUG: Playing background music')
    playSound('backgroundMusic', { loop: true, volume: 0.3 })
  }, [])

  // Create defense beam effect
  const createDefenseBeam = useCallback((asteroid) => {
    const earthPos = getEarthScreenPosition()
    
    const newBeam = {
      id: `beam_${Date.now()}_${Math.random()}`,
      startX: earthPos.x,
      startY: earthPos.y,
      endX: asteroid.x || asteroid.startX,
      endY: asteroid.y || -100
    }
    
    setDefenseBeams(prev => [...prev, newBeam])
  }, [])

  // Remove completed defense beam
  const removeDefenseBeam = useCallback((beamId) => {
    setDefenseBeams(prev => prev.filter(beam => beam.id !== beamId))
  }, [])

  // Create shield impact effect
  const createShieldImpact = useCallback((asteroid) => {
    const earthPos = getEarthScreenPosition()
    
    const newImpact = {
      id: `impact_${Date.now()}_${Math.random()}`,
      x: asteroid.x || asteroid.startX,
      y: asteroid.y || earthPos.y
    }
    
    setShieldImpacts(prev => [...prev, newImpact])
  }, [])

  // Remove completed shield impact
  const removeShieldImpact = useCallback((impactId) => {
    setShieldImpacts(prev => prev.filter(impact => impact.id !== impactId))
  }, [])

  // Create fire effect
  const createFireEffect = useCallback((asteroid) => {
    const earthPos = getEarthScreenPosition()
    
    // Calculate angle from Earth center to asteroid (where impact occurs)
    const dx = (asteroid.x || asteroid.startX) - earthPos.x
    const dy = (asteroid.y || earthPos.y) - earthPos.y
    
    // Fire should shoot away from Earth center through the collision point
    // atan2 gives us the direction from Earth to collision point
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    
    console.log('🔥 Fire angle calculated:', angle, 'degrees for collision at', dx, dy)
    
    const newFire = {
      id: `fire_${Date.now()}_${Math.random()}`,
      x: asteroid.x || asteroid.startX,
      y: asteroid.y || earthPos.y,
      angle: angle // Fire direction from Earth center through collision point
    }
    
    setFireEffects(prev => [...prev, newFire])
  }, [])

  // Remove completed fire effect
  const removeFireEffect = useCallback((fireId) => {
    setFireEffects(prev => prev.filter(fire => fire.id !== fireId))
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
      // Create defense beam effect
      createDefenseBeam(asteroid)
      
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
      
      // Track correctly answered question to prevent duplicates
      if (asteroid.question && asteroid.question.question) {
        setAnsweredQuestions(prev => new Set([...prev, asteroid.question.question]))
        console.log('✅ DEBUG: Added question to answered list:', asteroid.question.question.substring(0, 50) + '...')
      }
      
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
      nameSimple: asteroid.nameSimple || asteroid.name,
      
      // Physical characteristics (NASA verified)
      diameter: asteroid.diameter,
      diameterMin: asteroid.diameterMin || asteroid.diameter * 0.8,
      diameterMax: asteroid.diameterMax || asteroid.diameter * 1.2,
      absoluteMagnitude: asteroid.absoluteMagnitude || 20,
      
      // Approach data (NASA calculated)
      velocity: asteroid.velocity,
      velocityKmh: asteroid.velocityKmh || asteroid.velocity,
      velocityKms: asteroid.velocityKms || asteroid.velocity / 3600,
      missDistance: asteroid.missDistance || 1000000,
      missDistanceAU: asteroid.missDistanceAU || 0.1,
      missDistanceLunar: asteroid.missDistanceLunar || 38,
      approachDate: asteroid.approachDate || new Date().toISOString().split('T')[0],
      approachDateFull: asteroid.approachDateFull || new Date().toISOString(),
      orbitingBody: asteroid.orbitingBody || 'Earth',
      
      // NASA classifications
      isPotentiallyHazardous: asteroid.isPotentiallyHazardous || false,
      isSentryObject: asteroid.isSentryObject || false,
      
      // Discovery and observation data (NASA records)
      firstObservationDate: asteroid.firstObservationDate || null,
      lastObservationDate: asteroid.lastObservationDate || null,
      dataArcInDays: asteroid.dataArcInDays || null,
      observationsUsed: asteroid.observationsUsed || null,
      orbitDeterminationDate: asteroid.orbitDeterminationDate || null,
      
      // Orbital elements (NASA calculated)
      orbitId: asteroid.orbitId || null,
      eccentricity: asteroid.eccentricity || null,
      semiMajorAxis: asteroid.semiMajorAxis || null,
      inclination: asteroid.inclination || null,
      orbitalPeriod: asteroid.orbitalPeriod || null,
      perihelionDistance: asteroid.perihelionDistance || null,
      aphelionDistance: asteroid.aphelionDistance || null,
      meanMotion: asteroid.meanMotion || null,
      meanAnomaly: asteroid.meanAnomaly || null,
      
      // Orbit classification (NASA)
      orbitClass: asteroid.orbitClass || null,
      orbitClassDescription: asteroid.orbitClassDescription || null,
      orbitClassRange: asteroid.orbitClassRange || null,
      
      // Tisserand parameter (NASA calculated)
      jupiterTisserandInvariant: asteroid.jupiterTisserandInvariant || null,
      minimumOrbitIntersection: asteroid.minimumOrbitIntersection || null,
      
      // NASA JPL reference
      nasaJplUrl: asteroid.nasaJplUrl || '',
      
      // Original fact
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
    console.log('🔍 Game over check - Shield:', shield, 'GameState:', gameState)
    if (shield <= 0 && gameState === GAME_STATES.PLAYING) {
      console.log('🚨 GAME OVER TRIGGERED! Shield:', shield)
      setGameState(GAME_STATES.CUTSCENE) // Show cutscene first
      stopSound('backgroundMusic')
      playSound('gameOver') // Play game over sound when cutscene starts
      
      // Save high score
      if (score > highScore) {
        setHighScore(score)
        saveGameData({ highScore: score, collectedCards })
      }
    }
  }, [shield, gameState, score, highScore, collectedCards])

  // Handle cutscene completion
  const handleCutsceneComplete = useCallback(() => {
    setGameState(GAME_STATES.GAME_OVER)
    // Game over sound already played when cutscene started
  }, [])

  // Handle loading completion
  const handleLoadingComplete = useCallback(() => {
    setGameState(GAME_STATES.INTRO)
  }, [])

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
        {gameState === GAME_STATES.LOADING && (
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        )}
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
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gradient mb-8 px-4 leading-tight"
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
                className="btn-primary text-lg px-8 py-4"
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
                className="btn-neon border-neon-purple text-neon-purple ml-4 text-lg px-8 py-4"
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

            
            <AsteroidManager
              ref={asteroidManagerRef}
              asteroids={asteroids}
              setAsteroids={setAsteroids}
              setActiveQuestion={setActiveQuestion}
              timeFreeze={activeTimeFreeze}
              questionFreeze={questionFreeze}
              waveFreeze={gameFreezedByWave}
              level={level}
              gameState={gameState}
              answeredQuestions={answeredQuestions}
              onAsteroidImpact={(damage, asteroid) => {
                console.log('=== ASTEROID IMPACT DEBUG START ===')
                console.log('Time:', new Date().toLocaleTimeString())
                console.log('Raw damage received:', damage)
                console.log('Damage type:', typeof damage)
                console.log('Shield BEFORE impact:', shield)
                
                // Create shield impact visual effect
                createShieldImpact(asteroid)
                
                // Play minor hit sound effect
                playSound('minorHit')
                
                // Create fire effect on collision
                console.log('🔥 Creating fire effect for asteroid collision at:', asteroid.x, asteroid.y)
                createFireEffect(asteroid)
                
                // Track how many times this function is called
                window.impactCount = (window.impactCount || 0) + 1
                console.log('Impact call #', window.impactCount)
                
                // FORCE 15 damage per hit
                setShield(currentShield => {
                  console.log('Inside setShield - current shield:', currentShield)
                  console.log('Applying 15 damage')
                  const result = currentShield - 15
                  console.log('New shield will be:', result)
                  return Math.max(0, result)
                })
                
                console.log('=== ASTEROID IMPACT DEBUG END ===')
              }}
            />
            
            {/* Shield Boundary Visual */}
            <ShieldBoundary
              shield={shield}
              impacts={shieldImpacts}
              onImpactComplete={removeShieldImpact}
            />
            
            {/* Defense Beam Effects */}
            <DefenseBeamManager
              beams={defenseBeams}
              onBeamComplete={removeDefenseBeam}
            />
            
            {/* Fire Effects */}
            <FireEffectManager
              fires={fireEffects}
              onFireComplete={removeFireEffect}
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
              onGameFreeze={setGameFreezedByWave}
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
          </>
        )}

        {gameState === GAME_STATES.CUTSCENE && (
          <GameOverCutscene
            onCutsceneComplete={handleCutsceneComplete}
            score={score}
            highScore={highScore}
          />
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