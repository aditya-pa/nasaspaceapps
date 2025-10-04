import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Calculate asteroid rarity based on size, speed, and discovery rarity
const calculateRarity = (diameter, velocity, name) => {
  let rarity = 'Common'
  let rarityColor = '#9CA3AF' // Gray
  let rarityGlow = '0 0 10px rgba(156, 163, 175, 0.5)'
  
  // Size factor (much more balanced - most asteroids should be common)
  let sizeScore = diameter < 50 ? 1 : diameter < 150 ? 2 : diameter < 400 ? 3 : diameter < 800 ? 4 : 5
  
  // Speed factor (much more balanced - most speeds should be common)
  let speedScore = velocity < 20000 ? 1 : velocity < 35000 ? 2 : velocity < 50000 ? 3 : velocity < 70000 ? 4 : 5
  
  // Name factor (famous asteroids and short names are rarer)
  let nameScore = 1 // Default score for all asteroids
  if (name.includes('Apophis') || name.includes('Bennu') || name.includes('Ryugu') || name.includes('Itokawa') || name.includes('Ceres') || name.includes('Vesta')) {
    nameScore = 5 // Famous asteroids
  } else if (name.length < 8 && !name.includes('2023') && !name.includes('2024') && !name.includes('2025')) {
    nameScore = 3 // Short, memorable names
  } else if (name.length > 15) {
    nameScore = 2 // Long catalog numbers
  }
  
  const totalScore = sizeScore + speedScore + nameScore
  
  // Much more balanced thresholds
  if (totalScore >= 13) {
    rarity = 'Legendary'
    rarityColor = '#F59E0B' // Gold
    rarityGlow = '0 0 20px rgba(245, 158, 11, 0.8)'
  } else if (totalScore >= 10) {
    rarity = 'Epic' 
    rarityColor = '#A855F7' // Purple
    rarityGlow = '0 0 15px rgba(168, 85, 247, 0.6)'
  } else if (totalScore >= 7) {
    rarity = 'Rare'
    rarityColor = '#3B82F6' // Blue  
    rarityGlow = '0 0 12px rgba(59, 130, 246, 0.5)'
  } else if (totalScore >= 5) {
    rarity = 'Uncommon'
    rarityColor = '#10B981' // Green
    rarityGlow = '0 0 10px rgba(16, 185, 129, 0.4)'
  } 
  // Else stays Common (totalScore 3-4)
  
  return { rarity, rarityColor, rarityGlow, totalScore }
}

// Generate unique asteroid facts based on properties
const getAsteroidFact = (card) => {
  const facts = []
  
  // Size-based facts
  if (card.diameter > 1000) {
    facts.push(`🏔️ This massive space rock is over ${Math.round(card.diameter/1000)}km across - larger than most cities!`)
  } else if (card.diameter > 500) {
    facts.push(`🏙️ At ${Math.round(card.diameter)}m wide, this asteroid could flatten several city blocks on impact.`)
  } else if (card.diameter > 100) {
    facts.push(`🏠 This ${Math.round(card.diameter)}m asteroid is roughly the size of a football stadium.`)
  } else if (card.diameter > 50) {
    facts.push(`🚗 This house-sized asteroid (${Math.round(card.diameter)}m) would create a crater 10x its size.`)
  } else {
    facts.push(`🪨 This ${Math.round(card.diameter)}m space pebble burns up spectacularly in Earth's atmosphere.`)
  }
  
  // Speed-based facts
  if (card.velocity > 70000) {
    facts.push(`⚡ Racing at ${Math.round(card.velocity/1000)}k km/h - faster than any human-made object!`)
  } else if (card.velocity > 50000) {
    facts.push(`🚀 Moving at ${Math.round(card.velocity/1000)}k km/h - it could circle Earth in under 2 hours.`)
  } else if (card.velocity > 30000) {
    facts.push(`✈️ At ${Math.round(card.velocity/1000)}k km/h, it's 30x faster than a commercial jet.`)
  } else {
    facts.push(`🐌 Relatively slow at ${Math.round(card.velocity/1000)}k km/h - still 20x faster than a bullet!`)
  }
  
  // Name-based facts
  if (card.name.includes('Apophis')) {
    facts.push(`🐍 Named after the Egyptian serpent god of chaos - fitting for this potentially hazardous asteroid!`)
  } else if (card.name.includes('Bennu')) {
    facts.push(`🏺 Named after an ancient Egyptian bird deity, this asteroid was sampled by NASA's OSIRIS-REx mission.`)
  } else if (card.name.includes('2023') || card.name.includes('2024') || card.name.includes('2025')) {
    facts.push(`🔭 Recently discovered in ${card.name.match(/20\\d{2}/)?.[0] || 'recent years'} by NASA's asteroid detection network.`)
  } else if (card.name.length > 15) {
    facts.push(`📊 This asteroid's catalog designation contains precise orbital data used by astronomers worldwide.`)
  } else {
    facts.push(`🌌 This space wanderer has been traveling through our solar system for 4.6 billion years.`)
  }
  
  // Randomly select 1-2 facts
  const selectedFacts = facts.sort(() => 0.5 - Math.random()).slice(0, Math.random() > 0.7 ? 2 : 1)
  return selectedFacts.join(' ')
}

// Generate asteroid image based on properties
const generateAsteroidImage = (diameter, velocity, name) => {
  // Create a unique seed based on asteroid properties
  const seed = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const size = Math.max(diameter / 10, 40)
  const hue = (seed * 137.5) % 60 + 20 // Browns and grays (20-80 hue)
  const saturation = 20 + (seed % 30) // Low saturation for realistic look
  const lightness = 25 + (seed % 20) // Dark colors
  
  return {
    backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    size: size,
    craterCount: 2 + (seed % 4),
    shape: seed % 3 === 0 ? 'oval' : 'circle'
  }
}

function AsteroidCard({ card, index }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const rarity = calculateRarity(card.diameter, card.velocity, card.name)
  const asteroidImage = generateAsteroidImage(card.diameter, card.velocity, card.name)
  
  const formatSize = (diameter) => {
    if (diameter < 10) return `${Math.round(diameter)}m (Car)`
    if (diameter < 50) return `${Math.round(diameter)}m (House)`
    if (diameter < 100) return `${Math.round(diameter)}m (Football field)`
    if (diameter < 500) return `${Math.round(diameter)}m (City block)`
    if (diameter < 1000) return `${Math.round(diameter)}m (Golden Gate Bridge)`
    return `${(diameter / 1000).toFixed(1)}km (Mountain)`
  }

  const formatVelocity = (velocity) => {
    if (velocity < 10000) return `${Math.round(velocity).toLocaleString()} km/h (Racing car)`
    if (velocity < 20000) return `${Math.round(velocity).toLocaleString()} km/h (Jetliner)`
    if (velocity < 50000) return `${Math.round(velocity).toLocaleString()} km/h (Spacecraft)`
    return `${Math.round(velocity).toLocaleString()} km/h (Hypersonic!)`
  }
  
  const getDiscoveryInfo = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Discovered today!'
    if (diffDays === 1) return 'Discovered yesterday'
    if (diffDays < 7) return `Discovered ${diffDays} days ago`
    return `Discovered on ${date.toLocaleDateString()}`
  }

  return (
    <motion.div
      className="perspective-1000 h-48"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <motion.div
        className="relative w-full h-full preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <div className="absolute inset-0 backface-hidden glassmorphic rounded-xl p-4 border-2" 
             style={{ borderColor: rarity.rarityColor, boxShadow: rarity.rarityGlow }}>
          <div className="text-center h-full flex flex-col justify-between">
            {/* Rarity badge */}
            <div className="flex justify-between items-start mb-2">
              <div className="text-xs px-2 py-1 rounded-full font-bold"
                   style={{ 
                     backgroundColor: rarity.rarityColor + '20',
                     color: rarity.rarityColor,
                     border: `1px solid ${rarity.rarityColor}`
                   }}>
                {rarity.rarity}
              </div>
              <div className="text-xs text-gray-400">#{index + 1}</div>
            </div>
            
            {/* Enhanced Asteroid visualization */}
            <div className="mx-auto mb-3 relative" 
                 style={{ width: `${asteroidImage.size}px`, height: `${asteroidImage.size}px` }}>
              <div 
                className="w-full h-full border-2 shadow-lg animate-pulse-neon relative overflow-hidden"
                style={{ 
                  backgroundColor: asteroidImage.backgroundColor,
                  borderColor: rarity.rarityColor,
                  borderRadius: asteroidImage.shape === 'circle' ? '50%' : '40% 60% 50% 70%',
                  boxShadow: `${rarity.rarityGlow}, inset -5px -5px 10px rgba(0,0,0,0.3)`
                }}>
                {/* Craters */}
                {Array.from({ length: asteroidImage.craterCount }).map((_, i) => (
                  <div key={i}
                       className="absolute rounded-full bg-black opacity-30"
                       style={{
                         width: `${8 + (i * 3)}px`,
                         height: `${8 + (i * 3)}px`,
                         top: `${20 + (i * 15)}%`,
                         left: `${15 + (i * 20)}%`
                       }} />
                ))}
                {/* Surface texture */}
                <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-black/20" />
              </div>
            </div>
            
            {/* Name */}
            <h3 className="font-bold text-lg mb-2 truncate"
                style={{ color: rarity.rarityColor }}>
              {card.name}
            </h3>
            
            {/* Quick stats */}
            <div className="text-sm text-gray-300 space-y-1">
              <div>📏 {formatSize(card.diameter)}</div>
              <div>⚡ {formatVelocity(card.velocity)}</div>
              <div className="text-xs" style={{ color: rarity.rarityColor }}>⭐ Score: {rarity.totalScore}/15</div>
            </div>
            
            {/* Flip indicator */}
            <div className="text-xs text-gray-400 mt-2">
              Click to flip 🔄
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 backface-hidden glassmorphic rounded-xl p-3 border-2 rotateY-180"
             style={{ borderColor: rarity.rarityColor, boxShadow: rarity.rarityGlow }}>
          <div className="h-full flex flex-col">
            {/* Header with rarity */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-sm truncate" style={{ color: rarity.rarityColor }}>
                {card.name}
              </h3>
              <div className="text-xs px-2 py-1 rounded-full font-bold"
                   style={{ 
                     backgroundColor: rarity.rarityColor + '20',
                     color: rarity.rarityColor
                   }}>
                {rarity.rarity}
              </div>
            </div>
            
            {/* Scientific Data */}
            <div className="text-xs text-gray-300 space-y-2 flex-1">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-blue-400">📏 Diameter</div>
                  <div className="font-bold">{Math.round(card.diameter)}m</div>
                </div>
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-green-400">⚡ Velocity</div>
                  <div className="font-bold">{Math.round(card.velocity / 1000)}k km/h</div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div><span className="text-purple-400">🔬 Type:</span> Near-Earth Object</div>
                <div><span className="text-yellow-400">🎯 Threat Level:</span> {card.diameter > 500 ? 'High' : card.diameter > 100 ? 'Medium' : 'Low'}</div>
                <div><span className="text-orange-400">🌍 Distance:</span> {(Math.random() * 50 + 0.1).toFixed(1)}M km</div>
                <div><span className="text-pink-400">📅 Added:</span> {getDiscoveryInfo(card.timestamp)}</div>
              </div>
              
              {/* Enhanced fun fact */}
              <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg p-2 mt-2">
                <div className="text-blue-200 text-xs leading-relaxed">
                  💡 <strong>Do you know?</strong><br/>
                  {getAsteroidFact(card)}
                </div>
              </div>
              
              {/* Collection stats */}
              <div className="bg-gray-900/50 rounded-lg p-2 mt-2">
                <div className="text-center">
                  <div className="text-xs text-gray-400">Collection Value</div>
                  <div className="font-bold" style={{ color: rarity.rarityColor }}>⭐ {rarity.totalScore}/15 Points</div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 mt-2 text-center">
              Click to flip back 🔄
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function CardCollection({ collectedCards, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const categories = [
    { id: 'all', name: 'All Cards', icon: '📚' },
    { id: 'common', name: 'Common', icon: '⚪', color: '#9CA3AF' },
    { id: 'uncommon', name: 'Uncommon', icon: '🟢', color: '#10B981' },
    { id: 'rare', name: 'Rare', icon: '🔵', color: '#3B82F6' },
    { id: 'epic', name: 'Epic', icon: '🟣', color: '#A855F7' },
    { id: 'legendary', name: 'Legendary', icon: '🟡', color: '#F59E0B' },
    { id: 'small', name: 'Small (<100m)', icon: '�' },
    { id: 'large', name: 'Large (>500m)', icon: '🏔️' }
  ]

  const filteredCards = collectedCards.filter(card => {
    if (selectedCategory === 'all') return true
    
    // Rarity filters
    if (['common', 'uncommon', 'rare', 'epic', 'legendary'].includes(selectedCategory)) {
      const rarity = calculateRarity(card.diameter, card.velocity, card.name)
      return rarity.rarity.toLowerCase() === selectedCategory
    }
    
    // Size filters
    if (selectedCategory === 'small') return card.diameter < 100
    if (selectedCategory === 'large') return card.diameter >= 500
    
    return true
  })

  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="glassmorphic m-4 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gradient">
              🚀 Spacepedia Collection
            </h2>
            <button
              className="btn-neon border-gray-500 text-gray-300 px-4 py-2"
              onClick={onClose}
            >
              ✕ Close
            </button>
          </div>
          
          <div className="text-gray-300">
            <div className="mb-2">
              You've discovered {collectedCards.length} asteroids! 
              {collectedCards.length === 0 && " Start playing to collect asteroid fact cards!"}
            </div>
            {collectedCards.length > 0 && (
              <div className="flex flex-wrap gap-4 text-sm">
                {['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'].map(rarityType => {
                  const count = collectedCards.filter(card => 
                    calculateRarity(card.diameter, card.velocity, card.name).rarity === rarityType
                  ).length
                  const colors = {
                    'Common': '#9CA3AF',
                    'Uncommon': '#10B981', 
                    'Rare': '#3B82F6',
                    'Epic': '#A855F7',
                    'Legendary': '#F59E0B'
                  }
                  return count > 0 ? (
                    <span key={rarityType} style={{ color: colors[rarityType] }}>
                      {rarityType}: {count}
                    </span>
                  ) : null
                })}
              </div>
            )}
          </div>
        </div>

        {collectedCards.length > 0 && (
          <>
            {/* Category filters */}
            <div className="mx-4 mb-4">
              <div className="glassmorphic p-3 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'border-2'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
                      }`}
                      style={selectedCategory === category.id && category.color ? {
                        backgroundColor: category.color + '20',
                        borderColor: category.color,
                        color: category.color
                      } : {}}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cards grid */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                  {filteredCards.map((card, index) => (
                    <AsteroidCard
                      key={card.id}
                      card={card}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>
              
              {filteredCards.length === 0 && (
                <div className="text-center text-gray-400 mt-8">
                  No asteroids found in this category.
                </div>
              )}
            </div>
          </>
        )}

        {/* Empty state */}
        {collectedCards.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-6xl mb-4">🌌</div>
              <div className="text-2xl text-gray-300 mb-4">Empty Collection</div>
              <div className="text-gray-400 mb-6 max-w-md">
                Start playing AstroDefenders to discover and collect fact cards about real NASA asteroids!
              </div>
              <button
                className="btn-primary"
                onClick={onClose}
              >
                Start Playing
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default CardCollection