// Local storage manager for AstroDefenders game data
const STORAGE_KEYS = {
  HIGH_SCORES: 'astro_defenders_high_scores',
  GAME_DATA: 'astro_defenders_game_data',
  SETTINGS: 'astro_defenders_settings',
  COLLECTED_CARDS: 'astro_defenders_collected_cards',
  ACHIEVEMENTS: 'astro_defenders_achievements',
  STATISTICS: 'astro_defenders_statistics'
}

// Default game data structure
const DEFAULT_GAME_DATA = {
  highScore: 0,
  totalGamesPlayed: 0,
  totalAsteroidsDestroyed: 0,
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  longestStreak: 0,
  highestLevel: 0,
  collectedCards: [],
  achievements: [],
  firstPlayDate: null,
  lastPlayDate: null
}

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  musicEnabled: true,
  volume: 0.7,
  difficulty: 'normal', // easy, normal, hard
  showHints: true,
  autoSave: true
}

// Safely parse JSON from localStorage
const safeParseJSON = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Failed to parse localStorage key ${key}:`, error)
    return defaultValue
  }
}

// Safely save JSON to localStorage
const safeSaveJSON = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error(`Failed to save to localStorage key ${key}:`, error)
    return false
  }
}

// Load all game data
export const loadGameData = () => {
  const savedData = safeParseJSON(STORAGE_KEYS.GAME_DATA, {})
  return { ...DEFAULT_GAME_DATA, ...savedData }
}

// Save game data
export const saveGameData = (newData) => {
  const currentData = loadGameData()
  const updatedData = { 
    ...currentData, 
    ...newData,
    lastPlayDate: new Date().toISOString()
  }
  
  // Set first play date if not exists
  if (!updatedData.firstPlayDate) {
    updatedData.firstPlayDate = updatedData.lastPlayDate
  }
  
  return safeSaveJSON(STORAGE_KEYS.GAME_DATA, updatedData)
}

// High scores management
export const getHighScores = () => {
  const scores = safeParseJSON(STORAGE_KEYS.HIGH_SCORES, [])
  return scores.sort((a, b) => b.score - a.score).slice(0, 10) // Top 10
}

export const saveHighScore = (score, playerName = 'Anonymous', level = 1, accuracy = 0) => {
  const scores = getHighScores()
  const newScore = {
    id: Date.now(),
    score,
    playerName,
    level,
    accuracy: Math.round(accuracy * 100),
    date: new Date().toISOString(),
    timestamp: Date.now()
  }
  
  scores.push(newScore)
  const topScores = scores.sort((a, b) => b.score - a.score).slice(0, 10)
  
  safeSaveJSON(STORAGE_KEYS.HIGH_SCORES, topScores)
  return newScore
}

// Settings management
export const loadSettings = () => {
  const savedSettings = safeParseJSON(STORAGE_KEYS.SETTINGS, {})
  return { ...DEFAULT_SETTINGS, ...savedSettings }
}

export const saveSettings = (newSettings) => {
  const currentSettings = loadSettings()
  const updatedSettings = { ...currentSettings, ...newSettings }
  return safeSaveJSON(STORAGE_KEYS.SETTINGS, updatedSettings)
}

// Collected cards management
export const getCollectedCards = () => {
  return safeParseJSON(STORAGE_KEYS.COLLECTED_CARDS, [])
}

export const addCollectedCard = (card) => {
  const cards = getCollectedCards()
  
  // Check if card already exists
  if (cards.find(c => c.id === card.id)) {
    return false // Card already collected
  }
  
  const newCard = {
    ...card,
    collectedDate: new Date().toISOString(),
    collectedTimestamp: Date.now()
  }
  
  cards.push(newCard)
  safeSaveJSON(STORAGE_KEYS.COLLECTED_CARDS, cards)
  
  // Also update game data
  const gameData = loadGameData()
  saveGameData({ collectedCards: cards })
  
  return true // New card added
}

// Achievement system
const ACHIEVEMENTS = {
  FIRST_ASTEROID: {
    id: 'first_asteroid',
    name: 'First Strike',
    description: 'Destroy your first asteroid',
    icon: '🎯'
  },
  STREAK_5: {
    id: 'streak_5',
    name: 'On Fire!',
    description: 'Get a 5-answer streak',
    icon: '🔥'
  },
  STREAK_10: {
    id: 'streak_10',
    name: 'Unstoppable',
    description: 'Get a 10-answer streak',
    icon: '⚡'
  },
  SCORE_1000: {
    id: 'score_1000',
    name: 'Defender',
    description: 'Score 1,000 points',
    icon: '🛡️'
  },
  SCORE_10000: {
    id: 'score_10000',
    name: 'Elite Defender',
    description: 'Score 10,000 points',
    icon: '🏆'
  },
  CARDS_10: {
    id: 'cards_10',
    name: 'Space Collector',
    description: 'Collect 10 asteroid cards',
    icon: '📚'
  },
  PERFECT_GAME: {
    id: 'perfect_game',
    name: 'Perfect Defense',
    description: 'Complete a game with 100% accuracy',
    icon: '⭐'
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Answer 10 questions in under 2 minutes',
    icon: '💨'
  }
}

export const getAchievements = () => {
  return safeParseJSON(STORAGE_KEYS.ACHIEVEMENTS, [])
}

export const unlockAchievement = (achievementId) => {
  const achievements = getAchievements()
  
  if (achievements.find(a => a.id === achievementId)) {
    return false // Already unlocked
  }
  
  const achievement = ACHIEVEMENTS[achievementId.toUpperCase()]
  if (!achievement) {
    console.error(`Achievement not found: ${achievementId}`)
    return false
  }
  
  const unlockedAchievement = {
    ...achievement,
    unlockedDate: new Date().toISOString(),
    unlockedTimestamp: Date.now()
  }
  
  achievements.push(unlockedAchievement)
  safeSaveJSON(STORAGE_KEYS.ACHIEVEMENTS, achievements)
  
  return unlockedAchievement
}

// Game statistics
export const updateStatistics = (stats) => {
  const currentStats = safeParseJSON(STORAGE_KEYS.STATISTICS, {
    totalGamesPlayed: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    totalAsteroidsDestroyed: 0,
    totalPlayTime: 0,
    averageScore: 0,
    bestAccuracy: 0,
    longestStreak: 0,
    favoriteCategory: null
  })
  
  const updatedStats = { ...currentStats }
  
  Object.entries(stats).forEach(([key, value]) => {
    if (typeof value === 'number') {
      updatedStats[key] = (updatedStats[key] || 0) + value
    } else {
      updatedStats[key] = value
    }
  })
  
  // Calculate averages
  if (updatedStats.totalGamesPlayed > 0) {
    updatedStats.averageScore = Math.round(
      (updatedStats.totalScore || 0) / updatedStats.totalGamesPlayed
    )
  }
  
  if (updatedStats.totalQuestionsAnswered > 0) {
    updatedStats.accuracy = 
      updatedStats.totalCorrectAnswers / updatedStats.totalQuestionsAnswered
  }
  
  safeSaveJSON(STORAGE_KEYS.STATISTICS, updatedStats)
  return updatedStats
}

export const getStatistics = () => {
  return safeParseJSON(STORAGE_KEYS.STATISTICS, {
    totalGamesPlayed: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    totalAsteroidsDestroyed: 0,
    totalPlayTime: 0,
    averageScore: 0,
    accuracy: 0,
    longestStreak: 0
  })
}

// Data export/import for sharing or backup
export const exportGameData = () => {
  const data = {
    gameData: loadGameData(),
    settings: loadSettings(),
    highScores: getHighScores(),
    collectedCards: getCollectedCards(),
    achievements: getAchievements(),
    statistics: getStatistics(),
    exportDate: new Date().toISOString(),
    version: '1.0.0'
  }
  
  return JSON.stringify(data, null, 2)
}

export const importGameData = (jsonData) => {
  try {
    const data = JSON.parse(jsonData)
    
    if (data.gameData) safeSaveJSON(STORAGE_KEYS.GAME_DATA, data.gameData)
    if (data.settings) safeSaveJSON(STORAGE_KEYS.SETTINGS, data.settings)
    if (data.highScores) safeSaveJSON(STORAGE_KEYS.HIGH_SCORES, data.highScores)
    if (data.collectedCards) safeSaveJSON(STORAGE_KEYS.COLLECTED_CARDS, data.collectedCards)
    if (data.achievements) safeSaveJSON(STORAGE_KEYS.ACHIEVEMENTS, data.achievements)
    if (data.statistics) safeSaveJSON(STORAGE_KEYS.STATISTICS, data.statistics)
    
    return true
  } catch (error) {
    console.error('Failed to import game data:', error)
    return false
  }
}

// Clear all data (for reset)
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    return true
  } catch (error) {
    console.error('Failed to clear game data:', error)
    return false
  }
}

export default {
  loadGameData,
  saveGameData,
  getHighScores,
  saveHighScore,
  loadSettings,
  saveSettings,
  getCollectedCards,
  addCollectedCard,
  getAchievements,
  unlockAchievement,
  updateStatistics,
  getStatistics,
  exportGameData,
  importGameData,
  clearAllData
}