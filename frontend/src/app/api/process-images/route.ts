import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
    const { projectId, photoIds } = await request.json()

    if (!projectId || !photoIds || !Array.isArray(photoIds)) {
      return NextResponse.json({ error: 'Project ID and photo IDs required' }, { status: 400 })
    }

    const { data: photos, error: photosError } = await supabaseAdmin
      .from('photos')
      .select('*')
      .eq('project_id', projectId)
      .in('id', photoIds)

    if (photosError || !photos || photos.length === 0) {
      return NextResponse.json({ error: 'Photos not found' }, { status: 404 })
    }

    const processedPhotos: { id: string; path: string }[] = []

    for (const photo of photos) {
      const inputPath = `${supabaseUrl}/storage/v1/object/public/uploads/${photo.storage_path}`
      
      const response = await fetch(inputPath)
      const buffer = await response.arrayBuffer()
      
      const processedBuffer = await sharp(Buffer.from(buffer))
        .resize(1080, 1080, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer()

      const fileName = `${photo.order_index}_photodump.jpg`
      const storagePath = `${projectId}/${fileName}`

      const { error: uploadError } = await supabaseAdmin.storage
        .from('processed')
        .upload(storagePath, processedBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        continue
      }

      processedPhotos.push({
        id: photo.id,
        path: storagePath
      })
    }

    return NextResponse.json({ 
      success: true, 
      processedPhotos 
    })

  } catch (error) {
    console.error('Image processing error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}