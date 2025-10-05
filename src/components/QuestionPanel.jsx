import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

function QuestionPanel({ question, asteroid, onAnswer, timeLeft }) {

  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)

  // Shuffle answers and track correct answer position
  const shuffledAnswers = useMemo(() => {
    const answersWithIndex = question.answers.map((answer, index) => ({
      text: answer,
      originalIndex: index,
      isCorrect: index === question.correctAnswer
    }))
    
    console.log('🔀 BEFORE SHUFFLE:')
    console.log('Original answers:', question.answers)
    console.log('Correct answer index:', question.correctAnswer)
    console.log('Correct answer text:', question.answers[question.correctAnswer])
    console.log('Answers with flags:', answersWithIndex)
    
    // Fisher-Yates shuffle algorithm
    for (let i = answersWithIndex.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[answersWithIndex[i], answersWithIndex[j]] = [answersWithIndex[j], answersWithIndex[i]]
    }
    
    console.log('🔀 AFTER SHUFFLE:')
    console.log('Shuffled answers:', answersWithIndex)
    console.log('Correct answer is now at position:', answersWithIndex.findIndex(a => a.isCorrect))
    
    return answersWithIndex
  }, [question])

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return
    
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    
    const selectedAnswerData = shuffledAnswers[answerIndex]
    const isCorrect = selectedAnswerData.isCorrect
    
    // Debug logging
    console.log('🎯 ANSWER DEBUG:', {
      originalQuestion: question,
      originalCorrectIndex: question.correctAnswer,
      originalCorrectAnswer: question.answers[question.correctAnswer],
      selectedIndex: answerIndex,
      selectedAnswerText: selectedAnswerData.text,
      selectedAnswerData: selectedAnswerData,
      isCorrectResult: isCorrect,
      allShuffledAnswers: shuffledAnswers
    })
    
    // Delay before calling onAnswer to show result
    setTimeout(() => {
      onAnswer(isCorrect, asteroid)
    }, 1500)
  }

  const getAnswerButtonClass = (index) => {
    let baseClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-300 "
    
    if (!showResult) {
      return baseClass + "border-gray-600 bg-gray-800/80 text-white hover:border-neon-blue hover:bg-neon-blue/20"
    }
    
    // Show result state
    const answerData = shuffledAnswers[index]
    if (answerData.isCorrect) {
      return baseClass + "border-neon-green bg-neon-green/20 text-neon-green"
    } else if (index === selectedAnswer) {
      return baseClass + "border-red-500 bg-red-500/20 text-red-500"
    } else {
      return baseClass + "border-gray-600 bg-gray-800/50 text-gray-400"
    }
  }

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-40 pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Question panel */}
      <motion.div
        className="relative glassmorphic p-6 max-w-2xl mx-4"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: -50 }}
      >
        {/* Timer and Asteroid info header */}
        <div className="text-center mb-6">
          {/* URGENT TIMER */}
          {timeLeft !== null && timeLeft !== undefined && (
            <div className="mb-4">
              <div 
                className="inline-block px-4 py-2 rounded-full font-bold text-lg border-2 animate-pulse"
                style={{
                  backgroundColor: timeLeft <= 3 ? 'rgba(255, 0, 0, 0.2)' : timeLeft <= 7 ? 'rgba(255, 165, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)',
                  borderColor: timeLeft <= 3 ? '#FF0000' : timeLeft <= 7 ? '#FFA500' : '#00FF00',
                  color: timeLeft <= 3 ? '#FF6B6B' : timeLeft <= 7 ? '#FFB347' : '#90EE90'
                }}
              >
                ⏰ {Math.max(0, Math.floor(timeLeft))} {timeLeft <= 3 ? 'HURRY!' : timeLeft <= 7 ? 'QUICK!' : 'seconds remaining'}
              </div>
            </div>
          )}
          
          <div className="text-neon-blue text-sm font-bold">
            {asteroid.isPotentiallyHazardous ? '🚨 HAZARDOUS ASTEROID 🚨' : 'INCOMING ASTEROID'}
          </div>
          <div className="text-white text-lg font-bold">{asteroid.name}</div>
          
          {/* Enhanced asteroid details */}
          <div className="grid grid-cols-2 gap-4 text-sm mt-3 p-3 bg-black/30 rounded">
            <div>
              <div className="text-gray-400">Diameter:</div>
              <div className="text-white font-semibold">~{Math.round(asteroid.diameter)}m</div>
            </div>
            <div>
              <div className="text-gray-400">Velocity:</div>
              <div className="text-white font-semibold">{Math.round(asteroid.velocity).toLocaleString()} km/h</div>
            </div>
            <div>
              <div className="text-gray-400">Composition:</div>
              <div className="text-white font-semibold">{asteroid.skin?.name || 'Rocky Material'}</div>
            </div>
            <div>
              <div className="text-gray-400">Threat Level:</div>
              <div className="font-semibold" style={{ 
                color: asteroid.threatLevel === 'HIGH' ? '#FF6B6B' : asteroid.threatLevel === 'MEDIUM' ? '#FFB347' : '#90EE90' 
              }}>
                {asteroid.threatLevel}
              </div>
            </div>
          </div>
          
          {/* Special properties */}
          {asteroid.skin?.rare && (
            <div className="mt-2 text-center">
              <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                ⭐ RARE ASTEROID ⭐
              </span>
            </div>
          )}
          
          {asteroid.isPotentiallyHazardous && (
            <div className="mt-2 text-center">
              <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                ⚠️ POTENTIALLY HAZARDOUS OBJECT ⚠️
              </span>
            </div>
          )}
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-xl text-white mb-4 font-bold">
            🚀 {question.question}
          </h3>
          
          {/* Answer options */}
          <div className="grid gap-3">
            {shuffledAnswers.map((answerData, index) => (
              <button
                key={index}
                className={getAnswerButtonClass(index)}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                <span className="font-bold mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {answerData.text}
              </button>
            ))}
          </div>
        </div>

        {/* Result feedback */}
        {showResult && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {shuffledAnswers[selectedAnswer]?.isCorrect ? (
              <div className="text-neon-green">
                <div className="text-2xl mb-2">✅ Correct!</div>
                <div className="text-lg">Asteroid destroyed! +{question.points || 10} points</div>
              </div>
            ) : (
              <div className="text-red-500">
                <div className="text-2xl mb-2">❌ Incorrect!</div>
                <div className="text-lg">
                  Earth takes damage! Correct answer was: <br/>
                  <span className="text-neon-green font-semibold">
                    {(() => {
                      const correctAnswerIndex = shuffledAnswers.findIndex(answer => answer.isCorrect);
                      return `${String.fromCharCode(65 + correctAnswerIndex)}. ${shuffledAnswers[correctAnswerIndex].text}`;
                    })()}
                  </span>
                </div>
              </div>
            )}
            
            {/* Educational explanation */}
            {question.explanation && (
              <div className="mt-4 p-3 bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-200">
                  💡 {question.explanation}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Progress indicator */}
        <div className="absolute top-2 right-2">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
            !
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default QuestionPanel