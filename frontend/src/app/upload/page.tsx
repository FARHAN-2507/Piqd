'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Upload, X, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface FileValidation {
  file: File
  preview: string
  status: 'valid' | 'invalid'
  error?: string
}

export default function UploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<FileValidation[]>([])
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type'
    }
    if (file.size > 50 * 1024 * 1024) {
      return 'File too large (max 50MB)'
    }
    return null
  }

  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles: FileValidation[] = []
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const error = validateFile(file)
      newFiles.push({
        file,
        preview: URL.createObjectURL(file),
        status: error ? 'invalid' : 'valid',
        error: error || undefined
      })
    }

    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index)
      prev[index]?.preview && URL.revokeObjectURL(prev[index].preview)
      return newFiles
    })
  }

  const getValidCount = () => files.filter(f => f.status === 'valid').length

  const handleUpload = async () => {
    const validFiles = files.filter(f => f.status === 'valid')
    
    if (validFiles.length === 0) {
      alert('Please select at least one photo')
      return
    }

    setUploading(true)

    try {
      const projectRes = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title || `Photo Dump ${new Date().toLocaleDateString()}` })
      })
      
      const project = await projectRes.json()
      
      const photos = validFiles.map(f => ({
        url: f.preview,
        name: f.file.name
      }))
      
      await fetch(`${API_URL}/api/projects/${project.id}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos })
      })

      router.push(`/curate/${project.id}`)
    } catch (error) {
      console.error('Upload error:', error)
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-yellow-5/20 to-white">
      <header className="bg-white/80 backdrop-blur-sm border-b border-yellow-100 sticky top-0 z-50">
        <div className="container mx-auto py-5 px-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">New Photo Dump</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4 max-w-4xl">
        <Card className="border-3 border-yellow-200 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg border-b border-yellow-100">
            <CardTitle className="text-2xl font-extrabold">Upload Your Photos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            <div>
              <label className="text-sm font-extrabold text-gray-700">Project Title (optional)</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Photo Dump"
                className="mt-2 input-modern text-lg py-6"
              />
            </div>

            <div
              className={cn(
                'border-3 border-dashed rounded-3xl p-16 text-center transition-all duration-300',
                dragActive ? 'border-primary bg-yellow-50 scale-[1.02]' : 'border-yellow-200 bg-yellow-25',
                files.length > 0 && 'border-primary/50'
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Upload className="h-12 w-12 text-white" />
              </div>
              <p className="text-2xl font-extrabold mb-3">
                Drag and drop your photos here
              </p>
              <p className="text-gray-500 font-medium mb-6">
                or click to select files • No limits!
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              <Button 
                size="lg" 
                className="btn-primary text-lg px-8"
                onClick={() => fileInputRef.current?.click()}
              >
                Select Photos
              </Button>
            </div>

            {files.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-xl">
                      {getValidCount()} photos selected
                    </p>
                    <p className="text-sm font-medium text-gray-500">
                      {files.length - getValidCount()} invalid files
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setFiles([])} className="font-bold">
                    Clear All
                  </Button>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className={cn(
                        'relative rounded-2xl overflow-hidden aspect-square border-2 border-yellow-100',
                        f.status === 'invalid' && 'opacity-50'
                      )}
                    >
                      <img
                        src={f.preview}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-all"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                      {f.status === 'invalid' ? (
                        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-2 font-bold">
                          <AlertCircle className="h-3 w-3 inline mr-1" />
                          {f.error}
                        </div>
                      ) : (
                        <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-xs p-2 flex items-center justify-center font-bold">
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                          OK
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-8 border-t-2 border-yellow-100">
              <div className="text-sm font-medium text-gray-500">
                <p>Supported: JPG, PNG, WEBP</p>
                <p>Max file size: 50MB each</p>
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploading || getValidCount() === 0}
                size="lg"
                className="btn-primary text-lg px-10"
              >
                {uploading ? (
                  <>
                    <Spinner className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Start Curation'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}