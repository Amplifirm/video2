import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nfjqulatzxujawgsjpai.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5manF1bGF0enh1amF3Z3NqcGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0Njc1OTMsImV4cCI6MjA1MzA0MzU5M30.PXJWDnQbG-thQB476UKVNq82rZkaGBxcbDRlLg6rkCM'

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey
    }
  }
})