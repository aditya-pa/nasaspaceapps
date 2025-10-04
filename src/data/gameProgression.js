// Game progression and difficulty system for AstroDefenders
export const GAME_PHASES = {
  TUTORIAL: 'tutorial',
  WAVE_PREP: 'wave_prep',
  WAVE_ACTIVE: 'wave_active', 
  BOSS_PREP: 'boss_prep',
  BOSS_FIGHT: 'boss_fight',
  WAVE_COMPLETE: 'wave_complete'
}

export const ASTEROID_TYPES = {
  NORMAL: 'normal',
  FAST: 'fast',
  HEAVY: 'heavy',
  SPLITTER: 'splitter',
  SHIELD: 'shield',
  BOSS: 'boss'
}

// Wave configuration system
export const getWaveConfig = (waveNumber) => {
  const baseConfig = {
    waveNumber,
    asteroidCount: Math.min(3 + Math.floor(waveNumber / 2), 8), // Max 8 asteroids
    maxSimultaneous: Math.min(2 + Math.floor(waveNumber / 3), 4), // Max 4 at once
    spawnRate: Math.max(1000, 3000 - (waveNumber * 150)), // Faster spawning
    timeLimit: Math.max(8, 15 - waveNumber), // Shorter time limits
    pointMultiplier: 1 + (waveNumber * 0.1), // 10% more points per wave
    specialEvents: []
  }

  // Add difficulty modifiers based on wave number
  if (waveNumber >= 3) {
    baseConfig.asteroidTypes = [ASTEROID_TYPES.NORMAL, ASTEROID_TYPES.FAST]
  }
  
  if (waveNumber >= 5) {
    baseConfig.asteroidTypes.push(ASTEROID_TYPES.HEAVY)
    baseConfig.specialEvents.push('METEOR_SHOWER')
  }
  
  if (waveNumber >= 7) {
    baseConfig.asteroidTypes.push(ASTEROID_TYPES.SPLITTER)
    baseConfig.specialEvents.push('SOLAR_FLARE')
  }
  
  if (waveNumber >= 10) {
    baseConfig.asteroidTypes.push(ASTEROID_TYPES.SHIELD)
    baseConfig.specialEvents.push('ASTEROID_STORM')
  }

  // Boss waves every 5 waves
  if (waveNumber % 5 === 0) {
    baseConfig.hasBoss = true
    baseConfig.bossType = getBossType(Math.floor(waveNumber / 5))
  }

  return baseConfig
}

// Boss asteroid configurations
export const getBossType = (bossLevel) => {
  const bossTypes = [
    {
      name: 'Ceres Fragment',
      size: 200,
      health: 3,
      special: 'MULTI_HIT',
      description: 'A massive chunk of the dwarf planet Ceres. Requires multiple correct answers to destroy!'
    },
    {
      name: 'Vesta Core',
      size: 180,
      health: 2,
      special: 'SPEED_BURST',
      description: 'Core material from asteroid Vesta. Periodically accelerates toward Earth!'
    },
    {
      name: 'Apophis Shard',
      size: 220,
      health: 4,
      special: 'SPAWN_MINIONS',
      description: 'Dangerous fragment of asteroid Apophis. Spawns smaller asteroids when damaged!'
    },
    {
      name: 'Bennu Cluster',
      size: 160,
      health: 2,
      special: 'DUPLICATE',
      description: 'Sample from asteroid Bennu. Splits into two when first answered correctly!'
    }
  ]
  
  return bossTypes[Math.min(bossLevel - 1, bossTypes.length - 1)]
}

// Achievement system
export const ACHIEVEMENTS = {
  FIRST_WAVE: {
    id: 'first_wave',
    name: 'Space Cadet',
    description: 'Complete your first wave',
    icon: '🚀',
    reward: { type: 'powerup', value: 'shield_boost' }
  },
  PERFECT_WAVE: {
    id: 'perfect_wave', 
    name: 'Flawless Defense',
    description: 'Complete a wave without taking damage',
    icon: '⭐',
    reward: { type: 'points', value: 500 }
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Lightning Fast',
    description: 'Answer 5 questions in under 3 seconds each',
    icon: '⚡',
    reward: { type: 'powerup', value: 'time_freeze' }
  },
  BOSS_SLAYER: {
    id: 'boss_slayer',
    name: 'Titan Destroyer',
    description: 'Defeat your first boss asteroid',
    icon: '👑',
    reward: { type: 'permanent', value: 'extra_life' }
  },
  COLLECTOR: {
    id: 'collector',
    name: 'Cosmic Curator',
    description: 'Collect 25 different asteroid cards',
    icon: '🎴',
    reward: { type: 'unlock', value: 'card_gallery' }
  },
  SURVIVOR: {
    id: 'survivor',
    name: 'Space Survivor',
    description: 'Survive 10 waves in a single game',
    icon: '🛡️',
    reward: { type: 'permanent', value: 'shield_regen' }
  },
  POWER_USER: {
    id: 'power_user',
    name: 'Power Cosmic',
    description: 'Use 3 different power-ups in one wave',
    icon: '💫',
    reward: { type: 'unlock', value: 'rare_powerups' }
  }
}

// Special events that can happen during waves
export const SPECIAL_EVENTS = {
  METEOR_SHOWER: {
    name: 'Meteor Shower',
    description: 'Rapid asteroid spawning for 10 seconds!',
    duration: 10000,
    effect: { spawnRate: 0.3, asteroidCount: '+50%' }
  },
  SOLAR_FLARE: {
    name: 'Solar Flare',
    description: 'All asteroids move 2x faster for 15 seconds!',
    duration: 15000,
    effect: { asteroidSpeed: 2, timeLimit: 0.8 }
  },
  ASTEROID_STORM: {
    name: 'Asteroid Storm',
    description: 'Double asteroid spawning with reduced visibility!',
    duration: 20000,
    effect: { spawnRate: 0.5, visibility: 0.7, asteroidCount: '+100%' }
  },
  BONUS_ROUND: {
    name: 'Bonus Knowledge Round',
    description: 'All correct answers worth 3x points for 30 seconds!',
    duration: 30000,
    effect: { pointMultiplier: 3 }
  }
}

// Unlockable content system
export const UNLOCKABLES = {
  THEMES: [
    { id: 'mars', name: 'Mars Surface', requirement: 'Reach Wave 10' },
    { id: 'jupiter', name: 'Jupiter System', requirement: 'Defeat 3 Bosses' },
    { id: 'saturn', name: 'Saturn Rings', requirement: 'Collect 50 Cards' }
  ],
  POWERUPS: [
    { id: 'mega_shield', name: 'Mega Shield', requirement: 'Perfect 5 Waves' },
    { id: 'asteroid_magnet', name: 'Asteroid Magnet', requirement: 'Use Power-ups 50 times' },
    { id: 'knowledge_burst', name: 'Knowledge Burst', requirement: 'Answer 200 questions correctly' }
  ],
  DIFFICULTY_MODES: [
    { id: 'nightmare', name: 'Nightmare Mode', requirement: 'Survive 15 Waves' },
    { id: 'zen', name: 'Zen Mode', requirement: 'Play for 2 hours total' }
  ]
}

// Daily challenges for extra engagement
export const getDailyChallenge = () => {
  const challenges = [
    { 
      name: 'Speed Run', 
      description: 'Complete 5 waves in under 10 minutes',
      reward: { type: 'points', value: 2000 },
      icon: '🏃'
    },
    {
      name: 'No Power-ups',
      description: 'Complete 3 waves without using any power-ups', 
      reward: { type: 'card_pack', value: 'rare' },
      icon: '🚫'
    },
    {
      name: 'Perfect Knowledge',
      description: 'Answer 20 questions correctly in a row',
      reward: { type: 'achievement_boost', value: 1.5 },
      icon: '🧠'
    }
  ]
  
  // Return challenge based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
  return challenges[dayOfYear % challenges.length]
}