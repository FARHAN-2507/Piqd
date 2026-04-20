import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type ProjectStatus = 'uploading' | 'processing' | 'done' | 'failed'

export interface Project {
  id: string
  user_id: string
  title: string
  status: ProjectStatus
  created_at: string
}

export interface Photo {
  id: string
  project_id: string
  storage_path: string
  score: number | null
  is_selected: boolean
  order_index: number | null
  dominant_color: string | null
}

export interface Caption {
  id: string
  project_id: string
  tone: 'casual' | 'funny' | 'aesthetic'
  caption_text: string
  hashtags: string
}