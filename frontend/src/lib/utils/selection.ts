import { PhotoAnalysis } from './photo-scoring'

export type MoodCluster = 'warm' | 'cool' | 'bright' | 'dark' | 'muted'

export function clusterPhotosByMood(photos: PhotoAnalysis[]): Record<MoodCluster, PhotoAnalysis[]> {
  const clusters: Record<MoodCluster, PhotoAnalysis[]> = {
    warm: [],
    cool: [],
    bright: [],
    dark: [],
    muted: [],
  }
  
  for (const photo of photos) {
    clusters[photo.mood].push(photo)
  }
  
  for (const cluster of Object.values(clusters)) {
    cluster.sort((a, b) => b.score - a.score)
  }
  
  return clusters
}

export function selectTopPhotos(
  photos: PhotoAnalysis[],
  minCount: number = 6,
  maxCount: number = 9
): PhotoAnalysis[] {
  if (photos.length <= maxCount) {
    return [...photos].sort((a, b) => b.score - a.score).slice(0, maxCount)
  }
  
  const clusters = clusterPhotosByMood(photos)
  const moodOrder: MoodCluster[] = ['bright', 'warm', 'cool', 'muted', 'dark']
  
  const selected: PhotoAnalysis[] = []
  let clusterIndex = 0
  
  while (selected.length < maxCount && selected.length < photos.length) {
    const mood = moodOrder[clusterIndex % moodOrder.length]
    const clusterPhotos = clusters[mood]
    
    if (clusterPhotos.length > 0) {
      const photo = clusterPhotos.shift()!
      if (!selected.find(p => p.url === photo.url)) {
        selected.push(photo)
      }
    }
    
    clusterIndex++
    
    if (clusterIndex > moodOrder.length * maxCount) break
  }
  
  while (selected.length < minCount && photos.length > selected.length) {
    const remaining = photos.filter(p => !selected.find(s => s.url === p.url))
    if (remaining.length === 0) break
    remaining.sort((a, b) => b.score - a.score)
    selected.push(remaining[0])
  }
  
  return selected
}

export function orderPhotosForVariety(photos: PhotoAnalysis[]): PhotoAnalysis[] {
  if (photos.length <= 3) return photos
  
  const clusters = clusterPhotosByMood(photos)
  const moodOrder: MoodCluster[] = ['bright', 'warm', 'cool', 'muted', 'dark']
  
  const ordered: PhotoAnalysis[] = []
  const used = new Set<string>()
  
  let round = 0
  while (ordered.length < photos.length && round < 50) {
    for (const mood of moodOrder) {
      const cluster = clusters[mood]
      const photo = cluster.find(p => !used.has(p.url))
      
      if (photo) {
        ordered.push(photo)
        used.add(photo.url)
      }
      
      if (ordered.length >= photos.length) break
    }
    round++
  }
  
  const remaining = photos.filter(p => !used.has(p.url))
  ordered.push(...remaining)
  
  return ordered
}