import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Calculate asteroid threat level rarity based on classification, distance, and size
const calculateRarity = (diameter, velocity, name, distance = null) => {
  let rarity = 'Common'
  let rarityColor = '#9CA3AF' // Gray
  let rarityGlow = '0 0 10px rgba(156, 163, 175, 0.5)'
  
  // Classification factor - potentially hazardous objects are rarer
  let classificationScore = 1
  if (name.includes('Apophis') || name.includes('Bennu') || name.includes('Didymos') || name.includes('1999 RQ36')) {
    classificationScore = 5 // Known potentially hazardous asteroids
  } else if (name.match(/^\d{4} [A-Z]{2}\d*$/)) {
    classificationScore = 2 // Recent discoveries (numbered format)
  } else if (name.length < 8) {
    classificationScore = 3 // Named asteroids are typically more significant
  }
  
  // Size-based threat factor
  let sizeScore = 1
  if (diameter >= 1000) {
    sizeScore = 5 // Civilization-ending threat
  } else if (diameter >= 500) {
    sizeScore = 4 // Regional destruction
  } else if (diameter >= 140) {
    sizeScore = 3 // City-destroying size (NASA threshold for tracking)
  } else if (diameter >= 50) {
    sizeScore = 2 // Building-destroying size
  }
  
  // Distance-based threat factor (closer = more dangerous)
  let distanceScore = 1
  if (distance !== null) {
    if (distance < 0.05) { // Very close approach
      distanceScore = 4
    } else if (distance < 0.1) { // Close approach
      distanceScore = 3
    } else if (distance < 0.2) { // Moderate distance
      distanceScore = 2
    }
  }
  
  // Velocity-based impact energy (higher velocity = more destructive)
  let velocityScore = 1
  if (velocity >= 70000) {
    velocityScore = 4 // Extremely high energy impact
  } else if (velocity >= 50000) {
    velocityScore = 3 // High energy impact
  } else if (velocity >= 30000) {
    velocityScore = 2 // Moderate energy impact
  }
  
  const threatLevel = classificationScore + sizeScore + distanceScore + velocityScore
  
  // Threat-based rarity classification
  if (threatLevel >= 15) {
    rarity = 'Legendary'
    rarityColor = '#DC2626' // Red - Extinction level threat
    rarityGlow = '0 0 20px rgba(220, 38, 38, 0.8)'
  } else if (threatLevel >= 12) {
    rarity = 'Epic' 
    rarityColor = '#F59E0B' // Orange - Major regional threat
    rarityGlow = '0 0 15px rgba(245, 158, 11, 0.6)'
  } else if (threatLevel >= 8) {
    rarity = 'Uncommon'
    rarityColor = '#EAB308' // Yellow - Local threat
    rarityGlow = '0 0 12px rgba(234, 179, 8, 0.5)'
  } 
  // Else stays Common (low threat)
  
  return { rarity, rarityColor, rarityGlow, threatLevel }
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
  // Constrain size to fit better in cards (40-60px range)
  const size = Math.min(Math.max(diameter / 15, 40), 60)
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
      className="h-48"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="relative w-full h-full">
        {/* Front of card */}
        <div className="absolute inset-0 backface-hidden glassmorphic rounded-xl p-3 border-2" 
             style={{ borderColor: rarity.rarityColor, boxShadow: rarity.rarityGlow }}>
          <div className="text-center h-full flex flex-col">
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
            <div className="mx-auto mb-2 relative flex-shrink-0" 
                 style={{ width: `${Math.min(asteroidImage.size, 60)}px`, height: `${Math.min(asteroidImage.size, 60)}px` }}>
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
            <h3 className="font-bold text-sm mb-2 truncate"
                style={{ color: rarity.rarityColor }}>
              {card.name}
            </h3>
            
            {/* Quick stats */}
            <div className="text-xs text-gray-300 space-y-1 flex-1 flex flex-col justify-center">
              <div>📏 {formatSize(card.diameter)}</div>
              <div>⚡ {formatVelocity(card.velocity)}</div>
              <div className="text-xs font-bold" style={{ color: rarity.rarityColor }}>⚡ Threat Level: {rarity.threatLevel}/16</div>
            </div>
            

          </div>
        </div>


      </div>
    </motion.div>
  )
}

function CardCollection({ collectedCards, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const categories = [
    { id: 'all', name: 'All Cards', icon: '📚' },
    { id: 'common', name: 'Common', icon: '⚪', color: '#9CA3AF' },
    { id: 'uncommon', name: 'Uncommon', icon: '�', color: '#EAB308' },
    { id: 'epic', name: 'Epic', icon: '�', color: '#F59E0B' },
    { id: 'legendary', name: 'Legendary', icon: '�', color: '#DC2626' },
    { id: 'small', name: 'Small (<100m)', icon: '�' },
    { id: 'large', name: 'Large (>500m)', icon: '🏔️' }
  ]

  const filteredCards = collectedCards.filter(card => {
    if (selectedCategory === 'all') return true
    
    // Rarity filters
    if (['common', 'uncommon', 'epic', 'legendary'].includes(selectedCategory)) {
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