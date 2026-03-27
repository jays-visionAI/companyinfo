import { createClient } from '@supabase/supabase-js'

// Vite 환경 변수 타입 정의
interface ImportMetaEnv {
  VITE_SUPABASE_URL: string
  VITE_SUPABASE_ANON_KEY: string
  VITE_SUPABASE_SERVICE_ROLE_KEY: string
  VITE_APP_NAME: string
  VITE_APP_DESCRIPTION: string
}

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || ''
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요.')
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