import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateCaptions } from '@/lib/utils/caption-generation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const geminiApiKey = process.env.GEMINI_API_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    await supabaseAdmin
      .from('projects')
      .update({ status: 'processing' })
      .eq('id', projectId)

    const { data: photos, error: photosError } = await supabaseAdmin
      .from('photos')
      .select('*')
      .eq('project_id', projectId)

    if (photosError || !photos || photos.length === 0) {
      await supabaseAdmin
        .from('projects')
        .update({ status: 'failed' })
        .eq('id', projectId)
      return NextResponse.json({ error: 'No photos found' }, { status: 400 })
    }

    const photoUrls = photos.map(p => ({
      id: p.id,
      url: `${supabaseUrl}/storage/v1/object/public/uploads/${p.storage_path}`
    }))

    const selectedPhotoUrls = photoUrls.slice(0, 9)
    const dominantMood = 'aesthetic'

    let captions: { tone: string; caption: string; hashtags: string }[] = []
    try {
      captions = await generateCaptions(selectedPhotoUrls.map(p => p.url), dominantMood, geminiApiKey)
    } catch (captionError) {
      console.error('Caption generation error:', captionError)
      captions = [
        { tone: 'casual', caption: 'Photo dump 📸', hashtags: '#photodump #memories' },
        { tone: 'funny', caption: 'When you finally get your photos together 😂', hashtags: '#photodump #relatable' },
        { tone: 'aesthetic', caption: 'Moments captured in time', hashtags: '#aesthetic #photo dump' }
      ]
    }

    await supabaseAdmin.from('captions').delete().eq('project_id', projectId)

    for (const caption of captions) {
      await supabaseAdmin.from('captions').insert({
        project_id: projectId,
        tone: caption.tone,
        caption_text: caption.caption,
        hashtags: caption.hashtags
      })
    }

    await supabaseAdmin
      .from('projects')
      .update({ status: 'done' })
      .eq('id', projectId)

    return NextResponse.json({ 
      success: true, 
      message: 'Processing complete',
      captions 
    })

  } catch (error) {
    console.error('Processing error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}