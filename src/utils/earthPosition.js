// Utility to calculate Earth's position on screen
// Earth is positioned at [0, -3, 0] in 3D space with camera at [0, 0, 15]
export const getEarthScreenPosition = () => {
  if (typeof window === 'undefined') {
    return { x: 400, y: 400 } // Fallback for SSR
  }
  
  // Earth appears in the center horizontally
  const earthCenterX = window.innerWidth / 2
  
  // Earth appears at about 68% down the screen - adjusted to center shield properly around Earth
  const earthCenterY = window.innerHeight * 0.68
  
  return {
    x: earthCenterX,
    y: earthCenterY
  }
}

// Shield boundary radius in pixels
export const SHIELD_RADIUS = 150

// Earth surface detection (slightly inside shield boundary)
export const getEarthSurfaceY = () => {
  return getEarthScreenPosition().y + 80 // Surface is below center
}