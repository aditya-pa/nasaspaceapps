// Asteroid visual configurations and skins for variety
export const ASTEROID_SKINS = {
  ROCKY: {
    id: 'rocky',
    name: 'Rocky Asteroid',
    gradient: 'radial-gradient(circle at 30% 30%, #8B7355, #5D4E37, #3E2723)',
    borderColor: '#FFA726',
    shadowColor: 'rgba(255, 167, 38, 0.6)',
    texture: 'rough'
  },
  METALLIC: {
    id: 'metallic',
    name: 'Metallic Asteroid',
    gradient: 'radial-gradient(circle at 30% 30%, #C0C0C0, #808080, #404040)',
    borderColor: '#E0E0E0',
    shadowColor: 'rgba(192, 192, 192, 0.8)',
    texture: 'metallic'
  },
  ICY: {
    id: 'icy',
    name: 'Icy Comet',
    gradient: 'radial-gradient(circle at 30% 30%, #87CEEB, #4682B4, #2F4F4F)',
    borderColor: '#ADD8E6',
    shadowColor: 'rgba(135, 206, 235, 0.7)',
    texture: 'icy'
  },
  VOLCANIC: {
    id: 'volcanic',
    name: 'Volcanic Rock',
    gradient: 'radial-gradient(circle at 30% 30%, #8B4513, #A0522D, #654321)',
    borderColor: '#D2691E',
    shadowColor: 'rgba(210, 105, 30, 0.8)',
    texture: 'volcanic'
  },
  CRYSTALLINE: {
    id: 'crystalline',
    name: 'Crystal Formation',
    gradient: 'radial-gradient(circle at 30% 30%, #9370DB, #8A2BE2, #4B0082)',
    borderColor: '#DA70D6',
    shadowColor: 'rgba(147, 112, 219, 0.9)',
    texture: 'crystalline'
  },
  CARBON: {
    id: 'carbon',
    name: 'Carbon Rich',
    gradient: 'radial-gradient(circle at 30% 30%, #2F2F2F, #1C1C1C, #0A0A0A)',
    borderColor: '#696969',
    shadowColor: 'rgba(105, 105, 105, 0.6)',
    texture: 'carbon'
  },
  GOLD: {
    id: 'gold',
    name: 'Precious Metal',
    gradient: 'radial-gradient(circle at 30% 30%, #FFD700, #FFA500, #FF8C00)',
    borderColor: '#FFFF00',
    shadowColor: 'rgba(255, 215, 0, 0.9)',
    texture: 'precious',
    rare: true
  },
  DIAMOND: {
    id: 'diamond',
    name: 'Diamond Core',
    gradient: 'radial-gradient(circle at 30% 30%, #F0F8FF, #E6E6FA, #D3D3D3)',
    borderColor: '#FFFFFF',
    shadowColor: 'rgba(240, 248, 255, 1.0)',
    texture: 'diamond',
    rare: true
  }
}

export const EARTH_THEMES = {
  DEFAULT: {
    id: 'default',
    name: 'Earth - Blue Marble',
    colors: {
      primary: '#4A90E2',
      secondary: '#2E8B57',
      atmosphere: '#87CEEB'
    }
  },
  DESERT: {
    id: 'desert',
    name: 'Desert World',
    colors: {
      primary: '#DEB887',
      secondary: '#CD853F',
      atmosphere: '#F4A460'
    }
  },
  ICE_AGE: {
    id: 'ice_age',
    name: 'Ice Age Earth',
    colors: {
      primary: '#B0E0E6',
      secondary: '#87CEEB',
      atmosphere: '#E0FFFF'
    }
  },
  VOLCANIC: {
    id: 'volcanic',
    name: 'Volcanic Earth',
    colors: {
      primary: '#8B0000',
      secondary: '#FF4500',
      atmosphere: '#FF6347'
    }
  },
  ALIEN: {
    id: 'alien',
    name: 'Alien World',
    colors: {
      primary: '#9370DB',
      secondary: '#8A2BE2',
      atmosphere: '#DA70D6'
    }
  }
}

// Function to get random asteroid skin based on rarity
export const getRandomAsteroidSkin = (forceRare = false) => {
  const allSkins = Object.values(ASTEROID_SKINS)
  const commonSkins = allSkins.filter(skin => !skin.rare)
  const rareSkins = allSkins.filter(skin => skin.rare)
  
  if (forceRare || Math.random() < 0.1) { // 10% chance for rare
    return rareSkins[Math.floor(Math.random() * rareSkins.length)]
  }
  
  return commonSkins[Math.floor(Math.random() * commonSkins.length)]
}

// Function to get texture overlay pattern
export const getTexturePattern = (textureType) => {
  switch (textureType) {
    case 'rough':
      return 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.1) 2px, transparent 2px)'
    
    case 'metallic':
      return 'linear-gradient(45deg, rgba(255,255,255,0.3) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.3) 75%)'
    
    case 'icy':
      return 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 2px, transparent 2px), linear-gradient(135deg, rgba(255,255,255,0.2) 50%, transparent 50%)'
    
    case 'volcanic':
      return 'radial-gradient(circle at 40% 60%, rgba(255,69,0,0.3) 3px, transparent 3px), radial-gradient(circle at 70% 30%, rgba(255,0,0,0.2) 2px, transparent 2px)'
    
    case 'crystalline':
      return 'linear-gradient(60deg, rgba(255,255,255,0.4) 30%, transparent 30%, transparent 70%, rgba(255,255,255,0.4) 70%), linear-gradient(-60deg, rgba(255,255,255,0.2) 30%, transparent 30%, transparent 70%, rgba(255,255,255,0.2) 70%)'
    
    case 'carbon':
      return 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 1px, transparent 1px)'
    
    case 'precious':
      return 'linear-gradient(45deg, rgba(255,255,255,0.6) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.6) 75%), radial-gradient(circle at 50% 50%, rgba(255,255,0,0.3) 3px, transparent 3px)'
    
    case 'diamond':
      return 'linear-gradient(45deg, rgba(255,255,255,0.8) 12.5%, transparent 12.5%, transparent 87.5%, rgba(255,255,255,0.8) 87.5%), linear-gradient(-45deg, rgba(255,255,255,0.6) 12.5%, transparent 12.5%, transparent 87.5%, rgba(255,255,255,0.6) 87.5%)'
    
    default:
      return 'none'
  }
}

// Get rotation animation based on asteroid type
export const getRotationSpeed = (skin) => {
  switch (skin.texture) {
    case 'icy':
      return 20 // Slower rotation for ice
    case 'metallic':
      return 15 // Faster for metal
    case 'crystalline':
      return 25 // Very slow for crystals
    case 'precious':
      return 10 // Fast sparkle
    case 'diamond':
      return 30 // Slowest for diamonds
    default:
      return 18 // Default rotation speed
  }
}