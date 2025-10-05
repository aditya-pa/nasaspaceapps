// Educational Quiz System for AstroDefenders
// 7-Wave progression system with NASA space education content

import { EDUCATIONAL_QUESTIONS, WAVE_INFO } from '../data/educationalQuestions'

// Get questions by wave/level (1-7 wave system)
export const getQuestionsByWave = (wave = 1) => {
  return EDUCATIONAL_QUESTIONS[wave] || EDUCATIONAL_QUESTIONS[1]
}

// Get random questions for a specific wave
export const getWaveQuestions = (waveNumber, questionCount = 5) => {
  const waveQuestions = EDUCATIONAL_QUESTIONS[waveNumber] || EDUCATIONAL_QUESTIONS[1]
  
  // Shuffle questions and return the requested number
  const shuffled = [...waveQuestions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(questionCount, shuffled.length))
}

// Get wave information
export const getWaveInfo = (wave) => {
  return WAVE_INFO[wave] || WAVE_INFO[1]
}

// Get a random question based on current wave/level (1-7 wave system)
export const getRandomQuestion = (level = 1, streak = 0, excludeQuestions = new Set()) => {
  // Map level to wave (max 7 waves)
  const wave = Math.min(level, 7)
  
  // Get questions from current wave, filtering out already answered ones
  let waveQuestions = EDUCATIONAL_QUESTIONS[wave] || EDUCATIONAL_QUESTIONS[1]
  waveQuestions = waveQuestions.filter(q => !excludeQuestions.has(q.question))
  
  // If no unanswered questions in current wave, get from other waves
  if (waveQuestions.length === 0) {
    console.log('⚠️ DEBUG: No unanswered questions in current wave, expanding search...')
    // Try adjacent waves
    const adjacentWaves = [wave - 1, wave + 1].filter(w => w >= 1 && w <= 7)
    for (const adjacentWave of adjacentWaves) {
      const adjacentQuestions = EDUCATIONAL_QUESTIONS[adjacentWave] || []
      const unansweredAdjacent = adjacentQuestions.filter(q => !excludeQuestions.has(q.question))
      if (unansweredAdjacent.length > 0) {
        waveQuestions = unansweredAdjacent
        break
      }
    }
    
    // If still no questions, use all questions (reset answered tracking for this wave)
    if (waveQuestions.length === 0) {
      console.log('⚠️ DEBUG: All questions answered, resetting for this wave...')
      waveQuestions = EDUCATIONAL_QUESTIONS[wave] || EDUCATIONAL_QUESTIONS[1]
    }
  }
  
  // For high streaks, sometimes get harder questions from next wave
  if (streak >= 5 && wave < 7 && Math.random() < 0.3) {
    let nextWaveQuestions = EDUCATIONAL_QUESTIONS[wave + 1] || waveQuestions
    nextWaveQuestions = nextWaveQuestions.filter(q => !excludeQuestions.has(q.question))
    
    if (nextWaveQuestions.length > 0) {
      const hardQuestion = nextWaveQuestions[Math.floor(Math.random() * nextWaveQuestions.length)]
      return {
        ...hardQuestion,
        points: Math.floor(hardQuestion.points * 1.5), // Bonus points for harder question
        isBonus: true,
        bonusText: `BONUS: ${WAVE_INFO[wave + 1]?.topic || 'Advanced'} Question!`,
        wave: wave + 1,
        topic: WAVE_INFO[wave + 1]?.topic || 'Advanced',
        difficulty: WAVE_INFO[wave + 1]?.difficulty || 'Hard'
      }
    }
  }
  
  // Return random question from available wave questions
  const question = waveQuestions[Math.floor(Math.random() * waveQuestions.length)]
  return {
    ...question,
    wave: wave,
    topic: WAVE_INFO[wave]?.topic || 'Space Exploration',
    difficulty: WAVE_INFO[wave]?.difficulty || 'Unknown'
  }
}

// Get all questions from all waves
export const getAllQuestions = () => {
  const allQuestions = []
  Object.values(EDUCATIONAL_QUESTIONS).forEach(waveQuestions => {
    allQuestions.push(...waveQuestions)
  })
  return allQuestions
}

// Get questions by difficulty level
export const getQuestionsByDifficulty = (difficulty) => {
  const difficultyMap = {
    'easy': [1, 2],      // Waves 1-2
    'medium': [3, 4],    // Waves 3-4  
    'hard': [5, 6],      // Waves 5-6
    'expert': [7]        // Wave 7
  }
  
  const waves = difficultyMap[difficulty.toLowerCase()] || [1]
  const questions = []
  
  waves.forEach(wave => {
    if (EDUCATIONAL_QUESTIONS[wave]) {
      questions.push(...EDUCATIONAL_QUESTIONS[wave])
    }
  })
  
  return questions
}

// Helper function to validate questions (remove any test content)
export const validateQuestion = (question) => {
  if (!question || !question.question) return false
  
  // Filter out any test questions
  const testKeywords = ['2 + 2', 'test', 'android', 'debug']
  const questionText = question.question.toLowerCase()
  
  return !testKeywords.some(keyword => questionText.includes(keyword))
}

// Get educational statistics
export const getEducationalStats = () => {
  const stats = {}
  
  Object.keys(EDUCATIONAL_QUESTIONS).forEach(wave => {
    const waveNum = parseInt(wave)
    const questions = EDUCATIONAL_QUESTIONS[wave]
    stats[`wave${waveNum}`] = {
      questionCount: questions.length,
      topic: WAVE_INFO[waveNum]?.topic,
      difficulty: WAVE_INFO[waveNum]?.difficulty,
      avgPoints: Math.round(questions.reduce((sum, q) => sum + q.points, 0) / questions.length)
    }
  })
  
  return stats
}

export default {
  getRandomQuestion,
  getQuestionsByWave,
  getWaveQuestions,
  getWaveInfo,
  getAllQuestions,
  getQuestionsByDifficulty,
  validateQuestion,
  getEducationalStats
}