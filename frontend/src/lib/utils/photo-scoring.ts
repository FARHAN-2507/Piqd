import { loadImageAsImageData } from './blur-detection'
import { extractDominantColors, getDominantMood } from './color-extraction'

export interface PhotoScore {
  score: number
  sharpness: number
  resolution: number
  colorRichness: number
  brightnessBalance: number
}

export interface PhotoAnalysis {
  url: string
  score: number
  resolution: number
  dominantColors: string[]
  mood: 'warm' | 'cool' | 'bright' | 'dark' | 'muted'
}

const WEIGHTS = {
  sharpness: 0.4,
  resolution: 0.2,
  colorRichness: 0.2,
  brightnessBalance: 0.2,
}

async function analyzeSharpness(url: string): Promise<number> {
  try {
    const imageData = await loadImageAsImageData(url)
    const data = imageData.data
    const width = imageData.width
    const height = imageData.height
    
    let edgeSum = 0
    let pixelCount = 0
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4
        
        const left = ((y * width + (x - 1)) * 4)
        const right = ((y * width + (x + 1)) * 4)
        const top = (((y - 1) * width + x) * 4)
        const bottom = (((y + 1) * width + x) * 4)
        
        const grayCurrent = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        const grayLeft = 0.299 * data[left] + 0.587 * data[left + 1] + 0.114 * data[left + 2]
        const grayRight = 0.299 * data[right] + 0.587 * data[right + 1] + 0.114 * data[right + 2]
        const grayTop = 0.299 * data[top] + 0.587 * data[top + 1] + 0.114 * data[top + 2]
        const grayBottom = 0.299 * data[bottom] + 0.587 * data[bottom + 1] + 0.114 * data[bottom + 2]
        
        const dx = Math.abs(grayRight - grayLeft)
        const dy = Math.abs(grayBottom - grayTop)
        
        edgeSum += Math.sqrt(dx * dx + dy * dy)
        pixelCount++
      }
    }
    
    const avgEdge = edgeSum / pixelCount
    return Math.min(100, avgEdge * 2)
  } catch (error) {
    console.error('Sharpness analysis error:', error)
    return 0
  }
}

async function analyzeResolution(url: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const pixels = img.width * img.height
      const score = Math.min(100, (pixels / (4000 * 3000)) * 100)
      resolve(score)
    }
    img.onerror = () => resolve(0)
    img.src = url
  })
}

async function analyzeColorRichness(url: string): Promise<number> {
  try {
    const colors = await extractDominantColors(url, 3)
    if (colors.length < 3) return 0
    
    let totalVariance = 0
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const rgb1 = hexToRgb(colors[i])
        const rgb2 = hexToRgb(colors[j])
        if (rgb1 && rgb2) {
          const diff = Math.sqrt(
            Math.pow(rgb1.r - rgb2.r, 2) +
            Math.pow(rgb1.g - rgb2.g, 2) +
            Math.pow(rgb1.b - rgb2.b, 2)
          )
          totalVariance += diff
        }
      }
    }
    
    return Math.min(100, (totalVariance / 300) * 100)
  } catch (error) {
    return 0
  }
}

async function analyzeBrightnessBalance(url: string): Promise<number> {
  try {
    const imageData = await loadImageAsImageData(url)
    const data = imageData.data
    
    const brightnesses: number[] = []
    for (let i = 0; i < data.length; i += 16) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      brightnesses.push(gray)
    }
    
    const mean = brightnesses.reduce((a, b) => a + b, 0) / brightnesses.length
    const ideal = 128
    const deviation = Math.abs(mean - ideal)
    
    return Math.max(0, 100 - (deviation / 128) * 100)
  } catch (error) {
    return 50
  }
}

export async function analyzePhoto(url: string): Promise<PhotoAnalysis> {
  const [sharpness, resolution, colorRichness, brightnessBalance] = await Promise.all([
    analyzeSharpness(url),
    analyzeResolution(url),
    analyzeColorRichness(url),
    analyzeBrightnessBalance(url),
  ])
  
  const score = Math.round(
    sharpness * WEIGHTS.sharpness +
    resolution * WEIGHTS.resolution +
    colorRichness * WEIGHTS.colorRichness +
    brightnessBalance * WEIGHTS.brightnessBalance
  )
  
  const dominantColors = await extractDominantColors(url, 3)
  const mood = getDominantMood(dominantColors)
  
  return {
    url,
    score,
    resolution,
    dominantColors,
    mood,
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}