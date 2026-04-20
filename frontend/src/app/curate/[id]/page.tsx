'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { CheckCircle, Copy, RefreshCw, AlertTriangle, Sparkles, Home } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Photo {
  id: string
  url: string
  public_id: string
  score: number
  is_selected: boolean
  dominant_color: string
}

interface Caption {
  id: string
  tone: string
  caption_text: string
  hashtags: string
}

export default function CuratePage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(true)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([])
  const [captions, setCaptions] = useState<Caption[]>([])
  const [selectedCaption, setSelectedCaption] = useState<number | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      checkProjectAndProcess()
    }
  }, [id])

  const checkProjectAndProcess = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${id}`)
      if (!response.ok) {
        router.push('/dashboard')
        return
      }
      
      const project = await response.json()
      
      if (project.status === 'processed') {
        await loadResults()
      } else {
        await startProcessing()
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to load project')
      setLoading(false)
      setProcessing(false)
    }
  }

  const startProcessing = async () => {
    setProcessing(true)
    
    try {
      const response = await fetch(`${API_URL}/api/projects/${id}/process`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Processing failed')
      }

      await loadResults()
    } catch (err) {
      setError('Processing failed. Please try again.')
      setProcessing(false)
    }
  }

  const loadResults = async () => {
    setLoading(true)
    setProcessing(false)

    try {
      const response = await fetch(`${API_URL}/api/projects/${id}`)
      if (response.ok) {
        const project = await response.json()
        setPhotos(project.photos || [])
        setSelectedPhotos((project.photos || []).filter((p: Photo) => p.is_selected))
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const copyCaption = () => {
    if (selectedCaption === null || !captions[selectedCaption]) return
    
    const caption = captions[selectedCaption]
    const fullCaption = `${caption.caption_text}\n\n${caption.hashtags}`
    navigator.clipboard.writeText(fullCaption)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const downloadPhotos = async () => {
    for (let i = 0; i < selectedPhotos.length; i++) {
      const photo = selectedPhotos[i]
      try {
        const response = await fetch(photo.url)
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = `${String(i + 1).padStart(2, '0')}_photodump.jpg`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        await new Promise(resolve => setTimeout(resolve, 300))
      } catch (error) {
        console.error('Download error:', error)
      }
    }
  }

  if (loading || processing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-yellow-5/20 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Sparkles className="h-10 w-10 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold mb-3">
            {processing ? 'Processing your photos...' : 'Loading results...'}
          </h2>
          <p className="text-gray-500 font-medium">
            This usually takes 10-20 seconds
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-yellow-5/20 to-white flex items-center justify-center">
        <Card className="max-w-md border-2 border-yellow-200 shadow-xl">
          <CardContent className="py-10 text-center">
            <AlertTriangle className="h-14 w-14 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-xl font-extrabold mb-3">Something went wrong</h2>
            <p className="text-gray-500 font-medium mb-6">{error}</p>
            <Button onClick={startProcessing} className="btn-primary">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-yellow-5/20 to-white">
      <header className="bg-white/90 backdrop-blur-md border-b border-yellow-100 sticky top-0 z-50">
        <div className="container mx-auto py-4 px-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">Piqd</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors font-medium">
              <Home className="h-5 w-5" />
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4">
        <h2 className="text-2xl font-extrabold mb-8">Your Curated Photos</h2>
        
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-extrabold mb-4">Selected Photos ({selectedPhotos.length})</h3>
            <div className="grid grid-cols-3 gap-3">
              {selectedPhotos.map((photo, index) => (
                <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border-2 border-yellow-100">
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-sm">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-6 btn-primary text-lg" onClick={downloadPhotos}>
              Download All Photos (Numbered)
            </Button>
          </div>

          <div>
            <h3 className="text-xl font-extrabold mb-4">Captions</h3>
            {captions.length > 0 ? (
              <div className="space-y-4">
                {captions.map((caption, index) => (
                  <Card
                    key={caption.id}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedCaption === index
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-yellow-100 hover:border-yellow-300'
                    }`}
                    onClick={() => setSelectedCaption(index)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-extrabold capitalize">{caption.tone}</CardTitle>
                        {selectedCaption === index && (
                          <CheckCircle className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 font-medium mb-2">{caption.caption_text}</p>
                      <p className="text-sm text-gray-400">{caption.hashtags}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-yellow-100">
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500 font-medium">No captions yet</p>
                </CardContent>
              </Card>
            )}

            {selectedCaption !== null && captions[selectedCaption] && (
              <Button
                className="w-full mt-4 btn-primary"
                onClick={copyCaption}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copySuccess ? 'Copied!' : 'Copy Caption'}
              </Button>
            )}
          </div>
        </div>

        <Card className="mt-10 border-2 border-yellow-200">
          <CardHeader className="bg-yellow-50">
            <CardTitle className="font-extrabold">How to Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-yellow-400 text-white rounded-full flex items-center justify-center font-extrabold text-sm">1</span>
              <p className="font-medium">Download the numbered photos to your device</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-yellow-400 text-white rounded-full flex items-center justify-center font-extrabold text-sm">2</span>
              <p className="font-medium">Open Instagram and tap the + button</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-yellow-400 text-white rounded-full flex items-center justify-center font-extrabold text-sm">3</span>
              <p className="font-medium">Select multiple photos in order (01, 02, 03...)</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-yellow-400 text-white rounded-full flex items-center justify-center font-extrabold text-sm">4</span>
              <p className="font-medium">Paste the caption you copied</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center font-extrabold text-sm">5</span>
              <p className="font-medium text-green-600">Post your photo dump!</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-10 text-center">
          <Link href="/upload">
            <Button variant="outline" className="font-extrabold">
              Create New Dump
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}