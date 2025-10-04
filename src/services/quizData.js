import quizData from './quizData.json'

console.log('🔥 DEBUG: Quiz data loaded:', quizData ? 'SUCCESS' : 'FAILED')
console.log('🔥 DEBUG: Categories available:', Object.keys(quizData?.categories || {}))

// Get all questions from all categories
const getAllQuestions = () => {
  console.log('🔥 DEBUG: Getting all questions...')
  const allQuestions = []
  Object.values(quizData.categories).forEach(category => {
    allQuestions.push(...category.questions)
  })
  console.log('🔥 DEBUG: Total questions loaded:', allQuestions.length)
  return allQuestions
}

// Get questions by difficulty level
export const getQuestionsByDifficulty = (difficulty = 'easy') => {
  const allQuestions = getAllQuestions()
  return allQuestions.filter(q => q.difficulty === difficulty)
}

// Get questions by category
export const getQuestionsByCategory = (categoryId) => {
  return quizData.categories[categoryId]?.questions || []
}

// Get a random REAL SPACE/SCIENCE question (no test questions!)
export const getRandomQuestion = (level = 1, streak = 0) => {
  console.log('🧐 DEBUG: Getting REAL space question for level:', level, 'streak:', streak)
  let questions = []
  
  // Streak bonus questions for high streaks - ONLY REAL SPACE QUESTIONS
  if (streak >= 5 && Math.random() < 0.3 && quizData.streakBonusQuestions) {
    console.log('🔥 DEBUG: Using streak bonus space question!')
    const bonusQuestions = quizData.streakBonusQuestions.filter(q => 
      q.question && !q.question.toLowerCase().includes('2 + 2') && 
      (q.question.toLowerCase().includes('space') || 
       q.question.toLowerCase().includes('asteroid') ||
       q.question.toLowerCase().includes('planet') ||
       q.question.toLowerCase().includes('solar'))
    )
    if (bonusQuestions.length > 0) {
      return bonusQuestions[Math.floor(Math.random() * bonusQuestions.length)]
    }
  }
  
  // Difficulty progression based on level - FILTER OUT TEST QUESTIONS
  if (level <= 2) {
    // Early levels: mostly easy SPACE questions
    const easySpaceQuestions = getQuestionsByDifficulty('easy').filter(q => 
      q.question && !q.question.toLowerCase().includes('2 + 2') &&
      (q.question.toLowerCase().includes('space') || 
       q.question.toLowerCase().includes('asteroid') ||
       q.question.toLowerCase().includes('earth') ||
       q.question.toLowerCase().includes('moon') ||
       q.question.toLowerCase().includes('solar') ||
       q.question.toLowerCase().includes('planet'))
    )
    const mediumSpaceQuestions = getQuestionsByDifficulty('medium').filter(q => 
      q.question && !q.question.toLowerCase().includes('2 + 2') &&
      (q.question.toLowerCase().includes('space') || 
       q.question.toLowerCase().includes('asteroid') ||
       q.question.toLowerCase().includes('earth') ||
       q.question.toLowerCase().includes('solar'))
    )
    questions = [...easySpaceQuestions, ...easySpaceQuestions, ...mediumSpaceQuestions] // Double weight easy
  } else if (level <= 5) {
    // Mid levels: mix of easy and medium SPACE questions
    questions = [
      ...getQuestionsByDifficulty('easy').filter(q => q.question && !q.question.includes('2 + 2')),
      ...getQuestionsByDifficulty('medium').filter(q => q.question && !q.question.includes('2 + 2'))
    ].filter(q => 
      q.question.toLowerCase().includes('space') || 
      q.question.toLowerCase().includes('asteroid') ||
      q.question.toLowerCase().includes('nasa') ||
      q.question.toLowerCase().includes('solar') ||
      q.question.toLowerCase().includes('planet')
    )
    questions = [
      ...getQuestionsByDifficulty('easy'),
      ...getQuestionsByDifficulty('medium'),
      ...getQuestionsByDifficulty('medium') // More medium questions
    ]
  } else {
    // High levels: medium and hard SPACE questions only
    const mediumSpaceQuestions = getQuestionsByDifficulty('medium').filter(q => 
      q.question && !q.question.includes('2 + 2') &&
      (q.question.toLowerCase().includes('space') || 
       q.question.toLowerCase().includes('asteroid') ||
       q.question.toLowerCase().includes('nasa') ||
       q.question.toLowerCase().includes('galaxy') ||
       q.question.toLowerCase().includes('planet') ||
       q.question.toLowerCase().includes('solar'))
    )
    const hardSpaceQuestions = getQuestionsByDifficulty('hard').filter(q => 
      q.question && !q.question.includes('2 + 2') &&
      (q.question.toLowerCase().includes('space') || 
       q.question.toLowerCase().includes('asteroid') ||
       q.question.toLowerCase().includes('nasa') ||
       q.question.toLowerCase().includes('scientific') ||
       q.question.toLowerCase().includes('solar'))
    )
    questions = [...mediumSpaceQuestions, ...hardSpaceQuestions, ...hardSpaceQuestions] // Double weight hard
  }

  if (questions.length === 0) {
    console.log('⚠️ DEBUG: No space questions found, using fallback real space questions')
    questions = [
      {
        id: 'space_001',
        question: 'What is the name of NASA\'s mission to study near-Earth asteroids?',
        answers: ['DART', 'OSIRIS-REx', 'Lucy', 'NEAR Shoemaker'],
        correctAnswer: 1,
        difficulty: 'medium',
        points: 15,
        explanation: 'OSIRIS-REx successfully collected samples from asteroid Bennu!'
      },
      {
        id: 'space_002', 
        question: 'Which asteroid is known as potentially hazardous and will come close to Earth in 2029?',
        answers: ['Ceres', 'Apophis', 'Vesta', 'Eros'],
        correctAnswer: 1,
        difficulty: 'hard',
        points: 20,
        explanation: 'Apophis will pass very close to Earth in 2029, closer than some satellites!'
      },
      {
        id: 'space_003',
        question: 'What causes most asteroids to be found between Mars and Jupiter?',
        answers: ['Gravity', 'Solar wind', 'Magnetic fields', 'Temperature'],
        correctAnswer: 0,
        difficulty: 'easy', 
        points: 10,
        explanation: 'Jupiter\'s strong gravity prevented these rocks from forming into a planet!'
      }
    ]
  }
  
  const selectedQuestion = questions[Math.floor(Math.random() * questions.length)]
  console.log('✅ DEBUG: Selected REAL SPACE question:', selectedQuestion?.question?.substring(0, 50) + '...')
  
  // Ensure no test questions slip through
  if (selectedQuestion?.question?.toLowerCase().includes('2 + 2')) {
    console.log('⚠️ DEBUG: Detected test question, using fallback')
    return {
      id: 'space_fallback',
      question: 'How many planets are in our solar system?',
      answers: ['7', '8', '9', '10'],
      correctAnswer: 1,
      difficulty: 'easy',
      points: 10,
      explanation: 'There are 8 planets since Pluto was reclassified as a dwarf planet in 2006!'
    }
  }
  
  return selectedQuestion
}

// Get adaptive question based on player performance
export const getAdaptiveQuestion = (correctAnswers, totalAnswers, level) => {
  const accuracy = totalAnswers > 0 ? correctAnswers / totalAnswers : 0.5
  
  if (accuracy > 0.8) {
    // Player doing well - give harder questions
    const hardQuestions = getQuestionsByDifficulty('hard')
    const mediumQuestions = getQuestionsByDifficulty('medium')
    const candidates = [...hardQuestions, ...mediumQuestions]
    return candidates[Math.floor(Math.random() * candidates.length)]
  } else if (accuracy < 0.4) {
    // Player struggling - give easier questions
    const easyQuestions = getQuestionsByDifficulty('easy')
    return easyQuestions[Math.floor(Math.random() * easyQuestions.length)]
  } else {
    // Balanced performance - normal progression
    return getRandomQuestion(level)
  }
}

// Get question statistics for analytics
export const getQuizStats = () => {
  const allQuestions = getAllQuestions()
  const categories = Object.keys(quizData.categories)
  
  const stats = {
    totalQuestions: allQuestions.length,
    categoryCounts: {},
    difficultyCounts: { easy: 0, medium: 0, hard: 0 },
    averagePoints: 0
  }
  
  // Count by category
  categories.forEach(cat => {
    stats.categoryCounts[cat] = quizData.categories[cat].questions.length
  })
  
  // Count by difficulty and calculate average points
  let totalPoints = 0
  allQuestions.forEach(q => {
    stats.difficultyCounts[q.difficulty]++
    totalPoints += q.points
  })
  
  stats.averagePoints = Math.round(totalPoints / allQuestions.length)
  
  return stats
}

// Get a fun fact
export const getRandomFunFact = () => {
  const facts = quizData.funFacts
  return facts[Math.floor(Math.random() * facts.length)]
}

// Validate question format (for development)
export const validateQuestion = (question) => {
  const required = ['id', 'question', 'answers', 'correctAnswer', 'points', 'difficulty']
  const missing = required.filter(field => !(field in question))
  
  if (missing.length > 0) {
    console.warn(`Question ${question.id} missing fields:`, missing)
    return false
  }
  
  if (!Array.isArray(question.answers) || question.answers.length < 2) {
    console.warn(`Question ${question.id} needs at least 2 answers`)
    return false
  }
  
  if (question.correctAnswer >= question.answers.length) {
    console.warn(`Question ${question.id} correctAnswer index out of range`)
    return false
  }
  
  return true
}

// Initialize and validate all questions
export const initializeQuiz = () => {
  const allQuestions = getAllQuestions()
  const invalidQuestions = allQuestions.filter(q => !validateQuestion(q))
  
  if (invalidQuestions.length > 0) {
    console.warn(`Found ${invalidQuestions.length} invalid questions`)
  }
  
  console.log(`Quiz initialized with ${allQuestions.length} questions`)
  return getQuizStats()
}

export default {
  getRandomQuestion,
  getAdaptiveQuestion,
  getQuestionsByDifficulty,
  getQuestionsByCategory,
  getRandomFunFact,
  getQuizStats,
  initializeQuiz
}