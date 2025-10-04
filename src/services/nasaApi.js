// NASA NeoWs API Integration for AstroDefenders
const NASA_API_BASE = 'https://api.nasa.gov/neo/rest/v1'
const API_KEY = 'RkuqLf7O1I0V4kfLVH1feNAShVzdoMXlKq8Ermos'

// Cache for asteroid data to avoid excessive API calls
let asteroidCache = []
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Fun facts about asteroids for educational content
const asteroidFacts = [
  "Most asteroids are found in the asteroid belt between Mars and Jupiter!",
  "Some asteroids have their own tiny moons called moonlets.",
  "The largest asteroid, Ceres, is so big it's classified as a dwarf planet.",
  "Asteroids are leftover building blocks from when our solar system formed 4.6 billion years ago.",
  "Some asteroids contain precious metals like platinum and gold!",
  "The dinosaurs went extinct when a large asteroid hit Earth 66 million years ago.",
  "NASA tracks over 28,000 near-Earth asteroids to protect our planet.",
  "Some asteroids spin so fast they complete a rotation in just a few minutes!",
  "Water has been detected on several asteroids, which could help future space missions.",
  "The smallest asteroids are just a few meters across - smaller than a car!"
]

// Size comparison helpers for kid-friendly descriptions
const getSizeComparison = (diameter) => {
  if (diameter < 5) return "as big as a car"
  if (diameter < 20) return "as big as a house"
  if (diameter < 50) return "as big as a football field"
  if (diameter < 100) return "as big as a city block"
  if (diameter < 500) return "as big as a small mountain"
  if (diameter < 1000) return "as big as a large mountain"
  return "as big as a huge mountain"
}

const getSpeedComparison = (velocity) => {
  if (velocity < 10000) return "faster than a jet plane"
  if (velocity < 25000) return "faster than a rocket"
  if (velocity < 50000) return "faster than a spacecraft"
  return "incredibly fast - hypersonic!"
}

// Fetch today's asteroid data from NASA
export const fetchTodayAsteroids = async () => {
  console.log('🔥 DEBUG: fetchTodayAsteroids called')
  try {
    const today = new Date().toISOString().split('T')[0]
    const apiUrl = `${NASA_API_BASE}/feed?start_date=${today}&end_date=${today}&api_key=${API_KEY}`
    console.log('🔥 DEBUG: NASA API URL:', apiUrl)
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error(`NASA API Error: ${response.status}`)
    }
    
    const data = await response.json()
    const todayAsteroids = data.near_earth_objects[today] || []
    
    return todayAsteroids.map(asteroid => ({
      id: asteroid.id,
      name: asteroid.name.replace(/[()]/g, ''), // Clean up name
      diameter: asteroid.estimated_diameter?.meters?.estimated_diameter_average || 100,
      velocity: parseFloat(asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour) || 25000,
      missDistance: parseFloat(asteroid.close_approach_data?.[0]?.miss_distance?.kilometers) || 1000000,
      isPotentiallyHazardous: asteroid.is_potentially_hazardous_asteroid,
      approachDate: asteroid.close_approach_data?.[0]?.close_approach_date || today
    }))
  } catch (error) {
    console.error('Failed to fetch NASA asteroid data:', error)
    return [] // Return empty array to fall back to mock data
  }
}

// Generate mock asteroid data as fallback
const generateMockAsteroid = () => {
  const names = [
    "2024 XR", "Bennu Jr", "Ryugu Twin", "Apollo-2", "Aten-5", 
    "Amor-12", "Itokawa-B", "Eros-3", "Vesta Fragment", "Pallas Chip",
    "Ceres Moon", "Juno Rock", "Hygiea Shard", "Psyche Piece"
  ]
  
  const diameters = [10, 25, 50, 75, 120, 200, 350, 500, 750, 1200]
  const velocities = [15000, 22000, 28000, 35000, 42000, 55000, 68000, 85000]
  
  return {
    id: `mock_${Date.now()}_${Math.random()}`,
    name: names[Math.floor(Math.random() * names.length)],
    diameter: diameters[Math.floor(Math.random() * diameters.length)],
    velocity: velocities[Math.floor(Math.random() * velocities.length)],
    missDistance: Math.random() * 10000000, // Random miss distance
    isPotentiallyHazardous: Math.random() < 0.2, // 20% chance
    approachDate: new Date().toISOString().split('T')[0]
  }
}

// Main function to get asteroid data for the game
export const fetchAsteroidData = async () => {
  console.log('🚀 DEBUG: Fetching asteroid data...')
  try {
    // Check cache first
    const now = Date.now()
    if (asteroidCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('📦 DEBUG: Using cached asteroid data, cache size:', asteroidCache.length)
      const randomAsteroid = asteroidCache[Math.floor(Math.random() * asteroidCache.length)]
      return formatAsteroidForGame(randomAsteroid)
    }

    console.log('🌍 DEBUG: Fetching fresh data from NASA API...')
    // Fetch fresh data from NASA
    const nasaAsteroids = await fetchTodayAsteroids()
    
    if (nasaAsteroids.length > 0) {
      console.log('✅ DEBUG: NASA API returned', nasaAsteroids.length, 'asteroids')
      asteroidCache = nasaAsteroids
      cacheTimestamp = now
      const randomAsteroid = nasaAsteroids[Math.floor(Math.random() * nasaAsteroids.length)]
      console.log('🎲 DEBUG: Selected asteroid:', randomAsteroid.name)
      return formatAsteroidForGame(randomAsteroid)
    } else {
      console.log('⚠️ DEBUG: No NASA data, using mock asteroid')
      // Fallback to mock data
      return formatAsteroidForGame(generateMockAsteroid())
    }
  } catch (error) {
    console.error('Error fetching asteroid data:', error)
    // Always have a fallback
    return formatAsteroidForGame(generateMockAsteroid())
  }
}

// Format asteroid data for game use
const formatAsteroidForGame = (asteroid) => {
  const randomFact = asteroidFacts[Math.floor(Math.random() * asteroidFacts.length)]
  
  return {
    id: asteroid.id,
    name: asteroid.name,
    diameter: asteroid.diameter,
    velocity: asteroid.velocity,
    missDistance: asteroid.missDistance,
    isPotentiallyHazardous: asteroid.isPotentiallyHazardous,
    fact: randomFact,
    sizeComparison: getSizeComparison(asteroid.diameter),
    speedComparison: getSpeedComparison(asteroid.velocity),
    formattedApproachDate: new Date(asteroid.approachDate).toLocaleDateString()
  }
}

// Get interesting asteroid stats for educational display
export const getAsteroidStats = async () => {
  try {
    const response = await fetch(`${NASA_API_BASE}/stats?api_key=${API_KEY}`)
    if (response.ok) {
      const stats = await response.json()
      return {
        totalKnown: stats.near_earth_object_count,
        newThisYear: stats.year_range?.near_earth_object_count || 0,
        potentiallyHazardous: Math.floor(stats.near_earth_object_count * 0.08) // Approximate
      }
    }
  } catch (error) {
    console.error('Failed to fetch asteroid stats:', error)
  }
  
  // Fallback stats
  return {
    totalKnown: 28000,
    newThisYear: 2500,
    potentiallyHazardous: 2200
  }
}

export default {
  fetchAsteroidData,
  fetchTodayAsteroids,
  getAsteroidStats
}