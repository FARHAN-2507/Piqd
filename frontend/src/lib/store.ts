import { create } from 'zustand'
import { Project, Photo, Caption } from '@/lib/supabase'

interface AppState {
  currentProject: Project | null
  photos: Photo[]
  captions: Caption[]
  selectedPhotos: Photo[]
  isProcessing: boolean
  uploadProgress: { [key: string]: number }
  
  setCurrentProject: (project: Project | null) => void
  setPhotos: (photos: Photo[]) => void
  addPhoto: (photo: Photo) => void
  setCaptions: (captions: Caption[]) => void
  setSelectedPhotos: (photos: Photo[]) => void
  reorderSelectedPhotos: (startIndex: number, endIndex: number) => void
  replaceSelectedPhoto: (index: number, newPhoto: Photo) => void
  setIsProcessing: (isProcessing: boolean) => void
  setUploadProgress: (fileId: string, progress: number) => void
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  currentProject: null,
  photos: [],
  captions: [],
  selectedPhotos: [],
  isProcessing: false,
  uploadProgress: {},

  setCurrentProject: (project) => set({ currentProject: project }),
  
  setPhotos: (photos) => set({ photos }),
  
  addPhoto: (photo) => set((state) => ({ photos: [...state.photos, photo] })),
  
  setCaptions: (captions) => set({ captions }),
  
  setSelectedPhotos: (photos) => set({ selectedPhotos: photos }),
  
  reorderSelectedPhotos: (startIndex, endIndex) => set((state) => {
    const newPhotos = [...state.selectedPhotos]
    const [removed] = newPhotos.splice(startIndex, 1)
    newPhotos.splice(endIndex, 0, removed)
    return { 
      selectedPhotos: newPhotos.map((p, i) => ({ ...p, order_index: i })) 
    }
  }),
  
  replaceSelectedPhoto: (index, newPhoto) => set((state) => {
    const newPhotos = [...state.selectedPhotos]
    newPhotos[index] = { ...newPhoto, order_index: index }
    return { selectedPhotos: newPhotos }
  }),
  
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  
  setUploadProgress: (fileId, progress) => set((state) => ({
    uploadProgress: { ...state.uploadProgress, [fileId]: progress }
  })),
  
  reset: () => set({
    currentProject: null,
    photos: [],
    captions: [],
    selectedPhotos: [],
    isProcessing: false,
    uploadProgress: {},
  }),
}))