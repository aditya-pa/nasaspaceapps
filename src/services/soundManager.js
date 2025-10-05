import { Howl } from 'howler'

// Sound manager for AstroDefenders
let sounds = {}
let initialized = false

// Sound configuration
const soundConfig = {
  backgroundMusic: {
    src: ['/sounds/game_music.mp3'],
    loop: true,
    volume: 0.3,
    preload: true
  },
  asteroidSpawn: {
    src: ['/sounds/new_astroid.mp3'],
    volume: 0.5,
    preload: true
  },
  asteroidDeflect: {
    src: ['/sounds/move_away.mp3'],
    volume: 0.7,
    preload: true
  },
  laser: {
    src: ['/sounds/laser.mp3', '/sounds/laser.ogg'],
    volume: 0.6,
    preload: true
  },
  explosion: {
    src: ['/sounds/explosion.mp3', '/sounds/explosion.ogg'],  
    volume: 0.7,
    preload: true
  },
  impact: {
    src: ['/sounds/new_astroid.mp3'], // Use asteroid sound for impact
    volume: 0.9,
    preload: true
  },
  collision: {
    src: ['/sounds/game_over.mp3'], // Dramatic collision sound
    volume: 0.8,
    preload: true
  },
  powerUp: {
    src: ['/sounds/powerup.mp3', '/sounds/powerup.ogg'],
    volume: 0.5,
    preload: true
  },
  timeFreeze: {
    src: ['/sounds/powerup.mp3', '/sounds/powerup.ogg'], // Reuse powerup sound for now
    volume: 0.4,
    preload: true
  },
  waveStart: {
    src: ['/sounds/game_music.mp3'], // Reuse game music for wave start
    volume: 0.6,
    preload: true
  },
  waveComplete: {
    src: ['/sounds/powerup.mp3'], // Success sound
    volume: 0.8,
    preload: true
  },
  bossAppear: {
    src: ['/sounds/new_astroid.mp3'], // Dramatic boss entrance
    volume: 1.0,
    preload: true
  },
  specialEvent: {
    src: ['/sounds/powerup.mp3'], // Special event notification
    volume: 0.5,
    preload: true
  },
  achievement: {
    src: ['/sounds/powerup.mp3'], // Achievement unlocked
    volume: 0.7,
    preload: true
  },
  shieldLow: {
    src: ['/sounds/shield-low.mp3', '/sounds/shield-low.ogg'],
    volume: 0.6,
    preload: true
  },
  gameOver: {
    src: ['/sounds/game_over.mp3'],
    volume: 0.8,
    preload: true
  },
  minorHit: {
    src: ['/sounds/minor hit.mp3'],
    volume: 0.6,
    preload: true
  },
  correctAnswer: {
    src: ['/sounds/correct.mp3', '/sounds/correct.ogg'],
    volume: 0.5,
    preload: true
  },
  wrongAnswer: {
    src: ['/sounds/wrong.mp3', '/sounds/wrong.ogg'],
    volume: 0.5,
    preload: true
  },
  cardCollected: {
    src: ['/sounds/card-collect.mp3', '/sounds/card-collect.ogg'],
    volume: 0.4,
    preload: true
  }
}

// Fallback sound URLs (placeholder sounds)
const fallbackSounds = {
  backgroundMusic: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeywFJHHA8N2QQQoUXrTp66hVFApGn+DyvmMUBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hUFApGn+DyvmMUBjqAyvLLeywFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjiR1/LNeSwFJHfH8N2QQAoUXrTp66hUFApGn+DyvmMUBjqAyvLLeywFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LOeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFApGn+DyvmMUBjmR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMUBjqAyvLLeiwFJHDA8N2QQAoUXrTp66hVFA==',
  laser: 'data:audio/wav;base64,UklGRgEBAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YdoAAAD/AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//',
  explosion: 'data:audio/wav;base64,UklGRgEBAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YdoAAAD/AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//AP//'
}

// Initialize sound system
export const initSounds = async () => {
  if (initialized) return

  try {
    // Create Howl instances for each sound
    Object.entries(soundConfig).forEach(([key, config]) => {
      try {
        sounds[key] = new Howl({
          ...config,
          onloaderror: (id, error) => {
            console.warn(`Failed to load sound ${key}:`, error)
            // Create a silent fallback sound
            sounds[key] = new Howl({
              src: [fallbackSounds[key] || fallbackSounds.laser],
              volume: 0.01
            })
          },
        onload: () => {
          console.log(`Sound loaded: ${key}`)
        }
      })
      } catch (soundError) {
        console.warn(`Failed to create sound ${key}:`, soundError)
        // Create a silent fallback
        sounds[key] = { play: () => {}, stop: () => {}, volume: () => {} }
      }
    })

    initialized = true
    console.log('Sound system initialized')
  } catch (error) {
    console.error('Failed to initialize sound system:', error)
    // Create silent fallback sounds
    Object.keys(soundConfig).forEach(key => {
      sounds[key] = { play: () => {}, stop: () => {}, volume: () => {} }
    })
  }
}

// Play a sound effect
export const playSound = (soundName, options = {}) => {
  if (!sounds[soundName]) {
    console.warn(`Sound not found: ${soundName}`)
    return
  }

  try {
    const sound = sounds[soundName]
    
    // Apply options
    if (options.volume !== undefined) {
      sound.volume(options.volume)
    }
    
    if (options.loop !== undefined) {
      sound.loop(options.loop)
    }
    
    return sound.play()
  } catch (error) {
    console.error(`Failed to play sound ${soundName}:`, error)
  }
}

// Stop a sound
export const stopSound = (soundName) => {
  if (sounds[soundName]) {
    try {
      sounds[soundName].stop()
    } catch (error) {
      console.error(`Failed to stop sound ${soundName}:`, error)
    }
  }
}

// Stop all sounds
export const stopAllSounds = () => {
  Object.values(sounds).forEach(sound => {
    try {
      if (sound.stop) sound.stop()
    } catch (error) {
      console.error('Failed to stop sound:', error)
    }
  })
}

// Set master volume
export const setMasterVolume = (volume) => {
  Howler.volume(Math.max(0, Math.min(1, volume)))
}

// Mute/unmute all sounds
export const toggleMute = () => {
  const isMuted = Howler._muted
  Howler.mute(!isMuted)
  return !isMuted
}

// Get current mute state
export const isMuted = () => {
  return Howler._muted
}

// Sound presets for game events
export const playGameSound = (event, options = {}) => {
  switch (event) {
    case 'correctAnswer':
      playSound('correctAnswer', { volume: 0.6 })
      setTimeout(() => playSound('laser', { volume: 0.8 }), 200)
      break
      
    case 'wrongAnswer':
      playSound('wrongAnswer', { volume: 0.6 })
      setTimeout(() => playSound('explosion', { volume: 0.7 }), 300)
      break
      
    case 'powerUpCollected':
      playSound('powerUp', { volume: 0.7 })
      break
      
    case 'cardCollected':
      playSound('cardCollected', { volume: 0.5 })
      break
      
    case 'shieldCritical':
      playSound('shieldLow', { volume: 0.8 })
      break
      
    case 'gameStart':
      playSound('backgroundMusic', { loop: true, volume: 0.3 })
      break
      
    case 'gameEnd':
      stopSound('backgroundMusic')
      playSound('gameOver', { volume: 0.8 })
      break
      
    default:
      playSound(event, options)
  }
}

// Cleanup function
export const cleanupSounds = () => {
  stopAllSounds()
  Object.values(sounds).forEach(sound => {
    try {
      if (sound.unload) sound.unload()
    } catch (error) {
      console.error('Failed to unload sound:', error)
    }
  })
  sounds = {}
  initialized = false
}

export default {
  initSounds,
  playSound,
  playGameSound,
  stopSound,
  stopAllSounds,
  setMasterVolume,
  toggleMute,
  isMuted,
  cleanupSounds
}