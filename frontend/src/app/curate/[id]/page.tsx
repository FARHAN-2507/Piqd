'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { CheckCircle, Copy, RefreshCw, AlertTriangle } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Photo {
  id: string
  storage_path: string
  score: number | null
  is_selected: boolean
  order_index: number | null
  dominant_color: string | null
}

interface Caption {
  id: string
  tone: string
  caption_text: string
  hashtags: string
}

export default function CuratePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(true)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([])
  const [captions, setCaptions] = useState<Caption[]>([])
  const [selectedCaption, setSelectedCaption] = useState<number | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkProjectAndProcess()
  }, [params.id])

  const checkProjectAndProcess = async () => {
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single()

    if (projectError || !project) {
      router.push('/dashboard')
      return
    }

    if (project.status === 'done') {
      await loadResults()
    } else if (project.status === 'processing') {
      pollForResults()
    } else {
      await startProcessing()
    }
  }

  const startProcessing = async () => {
    setProcessing(true)
    
    await supabase
      .from('projects')
      .update({ status: 'processing' })
      .eq('id', params.id)

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: params.id })
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

  const pollForResults = () => {
    const interval = setInterval(async () => {
      const { data: project } = await supabase
        .from('projects')
        .select('status')
        .eq('id', params.id)
        .single()

      if (project?.status === 'done') {
        clearInterval(interval)
        loadResults()
      } else if (project?.status === 'failed') {
        clearInterval(interval)
        setError('Processing failed')
        setProcessing(false)
      }
    }, 2000)
  }

  const loadResults = async () => {
    setLoading(true)
    setProcessing(false)

    const [photosResult, captionsResult] = await Promise.all([
      supabase
        .from('photos')
        .select('*')
        .eq('project_id', params.id)
        .eq('is_selected', true)
        .order('order_index'),
      supabase
        .from('captions')
        .select('*')
        .eq('project_id', params.id)
    ])

    if (photosResult.data) {
      setSelectedPhotos(photosResult.data)
    }
    if (captionsResult.data) {
      setCaptions(captionsResult.data)
    }
    setLoading(false)
  }

  const copyCaption = () => {
    if (selectedCaption === null) return
    
    const caption = captions[selectedCaption]
    const fullCaption = `${caption.caption_text}\n\n${caption.hashtags}`
    navigator.clipboard.writeText(fullCaption)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const downloadPhotos = async () => {
    const links: string[] = []
    
    for (let i = 0; i < selectedPhotos.length; i++) {
      const photo = selectedPhotos[i]
      const url = `${supabaseUrl}/storage/v1/object/public/uploads/${photo.storage_path}`
      links.push(url)
    }

    for (let i = 0; i < links.length; i++) {
      try {
        const response = await fetch(links[i])
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {processing ? 'Processing your photos...' : 'Loading results...'}
          </h2>
          <p className="text-muted-foreground">
            This usually takes 10-20 seconds
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={startProcessing}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="bg-white border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold">Your Curated Photos</h1>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Selected Photos ({selectedPhotos.length})</h2>
            <div className="grid grid-cols-3 gap-2">
              {selectedPhotos.map((photo, index) => (
                <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={`${supabaseUrl}/storage/v1/object/public/uploads/${photo.storage_path}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" onClick={downloadPhotos}>
              Download All Photos (Numbered)
            </Button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Captions</h2>
            <div className="space-y-4">
              {captions.map((caption, index) => (
                <Card
                  key={caption.id}
                  className={`cursor-pointer transition-all ${
                    selectedCaption === index
                      ? 'ring-2 ring-primary'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedCaption(index)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg capitalize">{caption.tone}</CardTitle>
                      {selectedCaption === index && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{caption.caption_text}</p>
                    <p className="text-xs text-muted-foreground">{caption.hashtags}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedCaption !== null && (
              <Button
                className="w-full mt-4"
                onClick={copyCaption}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copySuccess ? 'Copied!' : 'Copy Caption'}
              </Button>
            )}
          </div>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Post</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Download the numbered photos to your device</li>
              <li>Open Instagram and tap the + button</li>
              <li>Select multiple photos in order (01, 02, 03...)</li>
              <li>Paste the caption you copied</li>
              <li>Post your photo dump!</li>
            </ol>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  )
}