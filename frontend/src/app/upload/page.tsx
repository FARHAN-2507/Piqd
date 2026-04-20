'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface FileValidation {
  file: File
  status: 'valid' | 'invalid'
  error?: string
}

export default function UploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<FileValidation[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [projectId, setProjectId] = useState<string | null>(null)
  const [title, setTitle] = useState('')

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Only JPG, PNG, and WEBP allowed.'
    }
    if (file.size > 20 * 1024 * 1024) {
      return 'File too large. Maximum 20MB per file.'
    }
    return null
  }

  const handleFiles = useCallback((fileList: FileList) => {
    const validFiles: FileValidation[] = []
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const error = validateFile(file)
      validFiles.push({
        file,
        status: error ? 'invalid' : 'valid',
        error: error || undefined
      })
    }

    setFiles(prev => [...prev, ...validFiles])
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
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getTotalSize = () => {
    return files.filter(f => f.status === 'valid').reduce((acc, f) => acc + f.file.size, 0)
  }

  const getValidCount = () => {
    return files.filter(f => f.status === 'valid').length
  }

  const handleUpload = async () => {
    const validFiles = files.filter(f => f.status === 'valid')
    
    if (validFiles.length < 15) {
      alert('Please upload at least 15 photos')
      return
    }
    if (validFiles.length > 200) {
      alert('Maximum 200 photos allowed')
      return
    }
    if (getTotalSize() > 500 * 1024 * 1024) {
      alert('Total size exceeds 500MB')
      return
    }

    setUploading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        title: title || `Photo Dump ${new Date().toLocaleDateString()}`,
        status: 'uploading'
      })
      .select()
      .single()

    if (projectError) {
      console.error('Project error:', projectError)
      setUploading(false)
      return
    }

    setProjectId(project.id)

    const { data: { user: supabaseUser } } = await supabase.auth.getUser()
    
    for (let i = 0; i < validFiles.length; i++) {
      const { file } = validFiles[i]
      const fileName = `${project.id}/${Date.now()}_${i}_${file.name}`
      
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, file)

      if (!uploadError) {
        await supabase.from('photos').insert({
          project_id: project.id,
          storage_path: fileName
        })
      }

      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
    }

    router.push(`/curate/${project.id}`)
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="bg-white border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold">New Photo Dump</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Photos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium">Project Title (optional)</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Photo Dump"
                className="mt-1"
              />
            </div>

            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                dragActive ? 'border-primary bg-primary/5' : 'border-border',
                files.length > 0 && 'border-primary/50'
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto text-muted mb-4" />
              <p className="text-lg font-medium mb-2">
                Drag and drop your photos here
              </p>
              <p className="text-muted-foreground mb-4">
                or click to select files
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                Select Photos
              </Button>
            </div>

            {files.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">
                      {getValidCount()} valid photos selected
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {files.length - getValidCount()} invalid files
                      {(getTotalSize() / 1024 / 1024).toFixed(1)} MB total
                    </p>
                  </div>
                  <Button variant="ghost" onClick={() => setFiles([])}>
                    Clear All
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className={cn(
                        'relative rounded-lg overflow-hidden aspect-square',
                        f.status === 'invalid' && 'opacity-50'
                      )}
                    >
                      <img
                        src={URL.createObjectURL(f.file)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                      {f.status === 'invalid' ? (
                        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-1">
                          <AlertCircle className="h-3 w-3 inline mr-1" />
                          {f.error}
                        </div>
                      ) : (
                        <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-xs p-1 flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                          Valid
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                <p>Min: 15 photos • Max: 200 photos</p>
                <p>Max file size: 20MB each • Max total: 500MB</p>
                <p>Formats: JPG, PNG, WEBP only</p>
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploading || getValidCount() < 15}
                size="lg"
              >
                {uploading ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    Uploading...
                  </>
                ) : (
                  'Continue to Curation'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}