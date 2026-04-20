import ColorThief from 'colorthief'

const colorThief = new ColorThief()

export async function extractDominantColors(imageUrl: string, count: number = 3): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        const palette = colorThief.getPalette(img, count)
        const hexColors = palette.map((rgb: number[]) => 
          `#${rgb.map(c => c.toString(16).padStart(2, '0')).join('')}`
        )
        resolve(hexColors)
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => reject(new Error('Failed to load image for color extraction'))
    img.src = imageUrl
  })
}

export function getDominantMood(colors: string[]): 'warm' | 'cool' | 'bright' | 'dark' | 'muted' {
  if (colors.length === 0) return 'muted'
  
  const rgb = hexToRgb(colors[0])
  if (!rgb) return 'muted'
  
  const { r, g, b } = rgb
  const brightness = (r + g + b) / 3
  const warmth = (r + g * 0.8) - (b * 1.2)
  
  if (brightness > 180) return 'bright'
  if (brightness < 80) return 'dark'
  if (warmth > 30) return 'warm'
  if (warmth < -30) return 'cool'
  return 'muted'
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}