// Simple test to check if the basic game works
console.log('🔥 DEBUG: Test file loaded')

// Test function to create a simple asteroid
export const createTestAsteroid = () => {
  const uniqueId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  console.log('🔥 DEBUG: Creating test asteroid with ID:', uniqueId)
  
  // FORCE ASTEROIDS TO CENTER OF SCREEN FOR VISIBILITY
  const centerX = window.innerWidth / 2
  const startX = centerX - 100  // Start slightly left of center
  const endX = centerX + 100    // End slightly right of center
  
  console.log('🔥 DEBUG: FORCED CENTER positions:', { startX, endX, centerX, windowWidth: window.innerWidth })
  
  return {
    id: uniqueId,
    name: 'Test Rock',
    diameter: 100,
    velocity: 25000,
    fact: 'This is a test asteroid',
    size: 80, // Make bigger for visibility
    startX: startX,
    endX: endX,
    fallDuration: 12000, // Slower for easier clicking
    questionTriggered: false,
    question: {
      id: 'test_001',
      question: 'What is 2 + 2?',
      answers: ['2', '4', '6', '8'],
      correctAnswer: 1,
      points: 10,
      explanation: 'Basic addition!'
    }
  }
}

// Test question
export const getTestQuestion = () => {
  console.log('🔥 DEBUG: Getting test question')
  return {
    id: 'test_001',
    question: 'What color is the sky on Mars?',
    answers: ['Blue', 'Red', 'Green', 'Purple'],
    correctAnswer: 1,
    points: 10,
    explanation: 'Mars has a reddish-orange sky due to iron oxide dust!'
  }
}