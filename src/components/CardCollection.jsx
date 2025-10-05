import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Calculate asteroid threat level rarity based on classification, distance, and size
const calculateRarity = (card) => {
  let rarity = 'Common'
  let rarityColor = '#9CA3AF' // Gray
  let rarityGlow = '0 0 10px rgba(156, 163, 175, 0.5)'
  
  // Use enhanced NASA data for classification
  let classificationScore = 1
  if (card.isPotentiallyHazardous) {
    classificationScore = 5 // NASA-verified potentially hazardous asteroid
  } else if (card.name.includes('Apophis') || card.name.includes('Bennu') || card.name.includes('Didymos')) {
    classificationScore = 4 // Famous asteroids
  } else if (card.name.match(/^\d{4} [A-Z]{2}\d*$/)) {
    classificationScore = 2 // Recent discoveries (numbered format)
  } else if (card.name.length < 8) {
    classificationScore = 3 // Named asteroids are typically more significant
  }
  
  // Size-based threat factor using accurate diameter
  let sizeScore = 1
  if (card.diameter >= 1000) {
    sizeScore = 5 // Civilization-ending threat
  } else if (card.diameter >= 500) {
    sizeScore = 4 // Regional destruction
  } else if (card.diameter >= 140) {
    sizeScore = 3 // City-destroying size (NASA threshold for tracking)
  } else if (card.diameter >= 50) {
    sizeScore = 2 // Building-destroying size
  }
  
  // Distance-based threat factor using accurate AU measurements
  let distanceScore = 1
  if (card.missDistanceAU !== undefined) {
    if (card.missDistanceAU < 0.05) { // Very close approach (< 0.05 AU)
      distanceScore = 4
    } else if (card.missDistanceAU < 0.1) { // Close approach (< 0.1 AU)
      distanceScore = 3
    } else if (card.missDistanceAU < 0.2) { // Moderate distance (< 0.2 AU)
      distanceScore = 2
    }
  }
  
  // Velocity-based impact energy (higher velocity = more destructive)
  let velocityScore = 1
  if (card.velocity >= 70000) {
    velocityScore = 4 // Extremely high energy impact
  } else if (card.velocity >= 50000) {
    velocityScore = 3 // High energy impact
  } else if (card.velocity >= 30000) {
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

// Generate unique asteroid facts based on enhanced NASA properties
const getAsteroidFact = (card) => {
  const facts = []
  
  // NASA potentially hazardous status
  if (card.isPotentiallyHazardous) {
    facts.push(`🚨 NASA classified as Potentially Hazardous due to size (>${card.diameter}m) and close approach orbit!`)
  }
  
  // Enhanced size-based facts with actual diameter
  if (card.diameter > 1000) {
    facts.push(`🏔️ This massive ${Math.round(card.diameter)}m space rock is larger than most cities!`)
  } else if (card.diameter > 500) {
    facts.push(`🏙️ At ${Math.round(card.diameter)}m wide, this asteroid could flatten several city blocks on impact.`)
  } else if (card.diameter > 140) {
    facts.push(`�️ This ${Math.round(card.diameter)}m asteroid meets NASA's size threshold for potentially hazardous objects.`)
  } else if (card.diameter > 50) {
    facts.push(`🏠 This ${Math.round(card.diameter)}m house-sized asteroid would create a crater 10x its size.`)
  } else {
    facts.push(`🪨 This ${Math.round(card.diameter)}m space pebble burns up spectacularly in Earth's atmosphere.`)
  }
  
  // Enhanced distance facts using accurate miss distance
  if (card.missDistanceAU < 0.05) {
    facts.push(`🌙 Extremely close approach! Only ${card.missDistanceLunar.toFixed(1)} lunar distances from Earth.`)
  } else if (card.missDistanceAU < 0.1) {
    facts.push(`🛸 Close approach at ${card.missDistanceLunar.toFixed(1)} lunar distances (${card.missDistanceAU.toFixed(3)} AU).`)
  } else if (card.missDistanceAU < 0.5) {
    facts.push(`🌍 Safe distance at ${(card.missDistance / 1000000).toFixed(1)} million km from Earth.`)
  }
  
  // Absolute magnitude (brightness) facts
  if (card.absoluteMagnitude < 18) {
    facts.push(`✨ Bright magnitude H=${card.absoluteMagnitude.toFixed(1)} - visible to telescopes from great distances!`)
  } else if (card.absoluteMagnitude > 25) {
    facts.push(`🔬 Faint magnitude H=${card.absoluteMagnitude.toFixed(1)} - requires powerful telescopes to detect.`)
  }
  
  // Speed-based facts
  if (card.velocity > 70000) {
    facts.push(`⚡ Racing at ${Math.round(card.velocity/1000)}k km/h - faster than any human-made object!`)
  } else if (card.velocity > 50000) {
    facts.push(`🚀 Moving at ${Math.round(card.velocity/1000)}k km/h - it could circle Earth in under 2 hours.`)
  } else if (card.velocity > 30000) {
    facts.push(`✈️ At ${Math.round(card.velocity/1000)}k km/h, it's 30x faster than a commercial jet.`)
  }
  
  // Famous asteroid facts
  if (card.name.includes('Apophis')) {
    facts.push(`🐍 Named after the Egyptian serpent god of chaos - this asteroid made headlines for its close 2029 approach!`)
  } else if (card.name.includes('Bennu')) {
    facts.push(`🏺 Target of NASA's OSIRIS-REx sample return mission - we have actual pieces of this asteroid!`)
  } else if (card.name.includes('Didymos')) {
    facts.push(`🎯 Target of NASA's DART mission - the first asteroid deflection test in human history!`)
  }
  
  // Randomly select 1-2 facts
  const selectedFacts = facts.filter(fact => fact).sort(() => 0.5 - Math.random()).slice(0, Math.random() > 0.7 ? 2 : 1)
  return selectedFacts.length > 0 ? selectedFacts.join(' ') : `🌌 This asteroid has been traveling through space for 4.6 billion years.`
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
  const rarity = calculateRarity(card)
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
    if (velocity < 40000) return `${Math.round(velocity).toLocaleString()} km/h (Bullet velocity)`
    if (velocity < 60000) return `${Math.round(velocity).toLocaleString()} km/h (Escape velocity)`
    return `${Math.round(velocity).toLocaleString()} km/h (Hypersonic meteor!)`
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

  const getNASADetails = (card) => {
    const details = []
    
    // NASA Classification
    if (card.isPotentiallyHazardous) {
      details.push('🚨 NASA PHA Classification')
    }
    
    // Orbit Type
    if (card.orbitClass) {
      const orbitTypes = {
        'APO': '🔴 Apollo Group',
        'ATE': '🟡 Aten Group', 
        'AMO': '🟠 Amor Group',
        'IEO': '🔵 Atira Group'
      }
      details.push(orbitTypes[card.orbitClass] || `🌌 ${card.orbitClass} Class`)
    }
    
    // Discovery Year
    if (card.firstObservationDate) {
      const year = card.firstObservationDate.split('-')[0]
      details.push(`📅 First observed: ${year}`)
    }
    
    // Orbital Period
    if (card.orbitalPeriod) {
      const years = (card.orbitalPeriod / 365.25).toFixed(1)
      details.push(`⏱️ Orbit: ${years} years`)
    }
    
    // Observations
    if (card.observationsUsed && card.observationsUsed > 100) {
      details.push(`📡 ${card.observationsUsed} observations`)
    }
    
    // Eccentricity
    if (card.eccentricity !== null && card.eccentricity !== undefined) {
      if (card.eccentricity < 0.1) {
        details.push('⭕ Circular orbit')
      } else if (card.eccentricity > 0.6) {
        details.push('🥚 Elliptical orbit')
      }
    }
    
    // Miss Distance
    if (card.missDistanceLunar) {
      details.push(`🌙 ${card.missDistanceLunar.toFixed(1)} lunar distances`)
    }
    
    return details.slice(0, 4) // Show top 4 most important details
  }

  return (
    <motion.div
      className="h-80"
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
            
            {/* Comprehensive NASA Data Display */}
            <div className="text-xs text-gray-300 space-y-1 flex-1 overflow-y-auto">
              
              {/* NASA ID & Classification */}
              <div className="bg-blue-900/30 p-1 rounded text-center">
                <div className="text-blue-300 font-bold">NASA ID: {card.id}</div>
                {card.isPotentiallyHazardous && (
                  <div className="text-red-400 font-bold">⚠️ POTENTIALLY HAZARDOUS</div>
                )}
              </div>
              
              {/* Physical Characteristics */}
              <div className="space-y-1">
                <div className="text-yellow-400 font-semibold">📏 PHYSICAL DATA:</div>
                <div>Size: {card.diameterMin?.toFixed(0) || '?'}-{card.diameterMax?.toFixed(0) || '?'}m</div>
                <div>Magnitude H: {card.absoluteMagnitude?.toFixed(1) || 'Unknown'}</div>
              </div>
              
              {/* Approach Details */}
              <div className="space-y-1">
                <div className="text-green-400 font-semibold">🚀 APPROACH DATA:</div>
                <div>Speed: {(card.velocityKms || card.velocity/3600)?.toFixed(1)} km/s</div>
                <div>Distance: {card.missDistanceLunar?.toFixed(1) || '?'} lunar distances</div>
                <div>Date: {card.approachDateFull || card.approachDate || 'Unknown'}</div>
              </div>
              
              {/* Orbital Information */}
              {(card.orbitalPeriod || card.eccentricity || card.orbitClass) && (
                <div className="space-y-1">
                  <div className="text-purple-400 font-semibold">🌌 ORBITAL DATA:</div>
                  {card.orbitalPeriod && (
                    <div>Period: {card.orbitalPeriod < 365 ? `${Math.round(card.orbitalPeriod)}d` : `${(card.orbitalPeriod/365.25).toFixed(1)}y`}</div>
                  )}
                  {card.eccentricity !== null && card.eccentricity !== undefined && (
                    <div>Eccentricity: {card.eccentricity.toFixed(3)}</div>
                  )}
                  {card.orbitClass && (
                    <div>Class: {card.orbitClass} ({card.orbitClassDescription || 'NASA classified'})</div>
                  )}
                  {card.inclination && (
                    <div>Inclination: {card.inclination.toFixed(1)}°</div>
                  )}
                </div>
              )}
              
              {/* Discovery & Observations */}
              {(card.firstObservationDate || card.observationsUsed) && (
                <div className="space-y-1">
                  <div className="text-cyan-400 font-semibold">🔭 DISCOVERY DATA:</div>
                  {card.firstObservationDate && (
                    <div>First seen: {card.firstObservationDate}</div>
                  )}
                  {card.observationsUsed && (
                    <div>Observations: {card.observationsUsed.toLocaleString()}</div>
                  )}
                  {card.dataArcInDays && (
                    <div>Tracking: {card.dataArcInDays} days</div>
                  )}
                </div>
              )}
              
              {/* NASA JPL Link */}
              {card.nasaJplUrl && (
                <div className="bg-orange-900/30 p-1 rounded text-center">
                  <div className="text-orange-300 text-xs">🔗 NASA JPL Database</div>
                </div>
              )}
              
              {/* Threat Assessment */}
              <div className="bg-gray-800/50 p-1 rounded text-center mt-2">
                <div className="text-xs font-bold" style={{ color: rarity.rarityColor }}>
                  ⚡ Threat Level: {rarity.threatLevel}/16
                </div>
              </div>
              
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
    { id: 'all', name: 'All Cards', icon: '★', color: '#60A5FA' },
    { id: 'common', name: 'Common', icon: '●', color: '#9CA3AF' },
    { id: 'uncommon', name: 'Uncommon', icon: '●', color: '#10B981' },
    { id: 'epic', name: 'Epic', icon: '●', color: '#A855F7' },
    { id: 'legendary', name: 'Legendary', icon: '●', color: '#F59E0B' },
    { id: 'small', name: 'Small (<100m)', icon: '●', color: '#3B82F6' },
    { id: 'large', name: 'Large (>500m)', icon: '●', color: '#EF4444' }
  ]

  const filteredCards = collectedCards.filter(card => {
    if (selectedCategory === 'all') return true
    
    // Rarity filters
    if (['common', 'uncommon', 'epic', 'legendary'].includes(selectedCategory)) {
      const rarity = calculateRarity(card)
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
                    calculateRarity(card).rarity === rarityType
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

            {/* Cards grid - Larger cards for better visibility */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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