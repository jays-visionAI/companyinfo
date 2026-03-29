import { createClient } from '@supabase/supabase-js'

// .env 파일이 없을 경우를 대비한 폴백(fallback) 값 제공
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://ggrcztsozlwyligerpyp.supabase.co'
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdncmN6dHNvemx3eWxpZ2VycHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk0NjA5NDAsImV4cCI6MjAzNTAzNjk0MH0.jJ-nukJ_c2oQ9tE2tq9s0wzI8EbP3a2Gq53JzS5Jz4g'

if (!((import.meta as any).env?.VITE_SUPABASE_URL && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY)) {
  console.warn('Supabase 환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요. 임시 값으로 대체합니다.')
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// 인증 헬퍼 함수들
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email)
  return { data, error }
}

// 데이터베이스 쿼리 헬퍼
export const fetchCompanies = async () => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const fetchCompanyById = async (id: string) => {
  const { data, error } = await supabase
    .from('companies')
    .select('*, industries(*)')
    .eq('id', id)
    .single()
  return { data, error }
}

export const fetchIndustries = async () => {
  const { data, error } = await supabase
    .from('industries')
    .select('*')
    .order('name')
  return { data, error }
}

export const fetchCommunityPosts = async () => {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*, profiles(*)')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createCommunityPost = async (postData: any) => {
  const { data, error } = await supabase
    .from('community_posts')
    .insert([postData])
    .select()
  return { data, error }
}
