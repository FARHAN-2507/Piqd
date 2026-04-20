export function calculateBlurVariance(imageData: ImageData): number {
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height
  
  const grayscale: number[] = []
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const gray = 0.299 * r + 0.587 * g + 0.114 * b
    grayscale.push(gray)
  }
  
  const mean = grayscale.reduce((a, b) => a + b, 0) / grayscale.length
  
  let variance = 0
  for (let i = 0; i < grayscale.length; i++) {
    variance += Math.pow(grayscale[i] - mean, 2)
  }
  variance /= grayscale.length
  
  return variance
}

export async function loadImageAsImageData(url: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }
      
      const sampleSize = Math.min(img.width, img.height, 200)
      canvas.width = sampleSize
      canvas.height = sampleSize
      
      ctx.drawImage(img, 0, 0, sampleSize, sampleSize)
      
      try {
        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize)
        resolve(imageData)
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = url
  })
}

export async function detectBlur(url: string, threshold: number = 100): Promise<boolean> {
  try {
    const imageData = await loadImageAsImageData(url)
    const variance = calculateBlurVariance(imageData)
    return variance < threshold
  } catch (error) {
    console.error('Blur detection error:', error)
    return false
  }
}