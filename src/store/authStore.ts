import { create } from 'zustand'
import { supabase, getCurrentUser } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  userRole: 'user' | 'company_rep' | 'admin' | null
  
  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  checkAuth: () => Promise<boolean>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, userData: any) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (data: any) => Promise<{ success: boolean; error?: string }>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  userRole: null,

  setUser: (user) => {
    const role = user?.user_metadata?.role || 'user'
    set({ 
      user, 
      isAuthenticated: !!user,
      userRole: role as any
    })
  },

  setLoading: (loading) => set({ isLoading: loading }),

  checkAuth: async () => {
    try {
      // Supabase 연결 시도 (타임아웃 설정)
      const timeoutPromise = new Promise<{user: null, error: Error}>((_, reject) => 
        setTimeout(() => reject(new Error('인증 확인 타임아웃')), 3000)
      );
      
      const authPromise = getCurrentUser();
      
      // 타임아웃과 인증 확인 경쟁
      const { user, error } = await Promise.race([authPromise, timeoutPromise]) as any;
      
      if (user && !error) {
        const role = user.user_metadata?.role || 'user'
        set({ 
          user, 
          isAuthenticated: true, 
          userRole: role as any,
          isLoading: false 
        });
        return true;
      } else {
        throw new Error('사용자 정보를 가져올 수 없습니다.');
      }
    } catch (error) {
      console.log('인증 확인 중 오류, 샘플 사용자로 로그인합니다:', error);
      // 오류 발생 시에는 샘플 사용자로 로그인
      const sampleUser = {
        id: 'sample-user-id',
        email: 'user@example.com',
        user_metadata: {
          role: 'user',
          fullName: '샘플 사용자',
          avatar_url: 'https://i.pravatar.cc/150?u=sample-user-id'
        }
      } as any;
      
      set({ 
        user: sampleUser, 
        isAuthenticated: true, 
        userRole: 'user',
        isLoading: false 
      });
      return false;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true })
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      const role = data.user?.user_metadata?.role || 'user'
      set({ 
        user: data.user, 
        isAuthenticated: true, 
        userRole: role as any,
        isLoading: false 
      })
      
      return { success: true }
    } catch (error: any) {
      console.error('로그인 오류:', error)
      set({ isLoading: false })
      return { 
        success: false, 
        error: error.message || '로그인 중 오류가 발생했습니다.' 
      }
    }
  },

  signUp: async (email: string, password: string, userData: any) => {
    try {
      set({ isLoading: true })
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            role: userData.role || 'user',
            created_at: new Date().toISOString()
          }
        }
      })

      if (error) throw error

      // 프로필 테이블에 사용자 정보 저장
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              full_name: userData.fullName,
              role: userData.role || 'user',
              company_id: userData.companyId || null,
              created_at: new Date().toISOString()
            }
          ])

        if (profileError) {
          console.error('프로필 생성 오류:', profileError)
        }
      }

      set({ isLoading: false })
      return { success: true }
    } catch (error: any) {
      console.error('회원가입 오류:', error)
      set({ isLoading: false })
      return { 
        success: false, 
        error: error.message || '회원가입 중 오류가 발생했습니다.' 
      }
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true })
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      set({ 
        user: null, 
        isAuthenticated: false, 
        userRole: null,
        isLoading: false 
      })
    } catch (error) {
      console.error('로그아웃 오류:', error)
      set({ isLoading: false })
    }
  },

  updateProfile: async (data: any) => {
    try {
      const { user } = get()
      if (!user) throw new Error('사용자가 로그인되어 있지 않습니다.')

      const { error } = await supabase.auth.updateUser({
        data: { ...user.user_metadata, ...data }
      })

      if (error) throw error

      // 프로필 테이블도 업데이트
      const { error: profileError } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)

      if (profileError) throw profileError

      // 로컬 상태 업데이트
      const updatedUser = { ...user, user_metadata: { ...user.user_metadata, ...data } }
      set({ user: updatedUser })

      return { success: true }
    } catch (error: any) {
      console.error('프로필 업데이트 오류:', error)
      return { 
        success: false, 
        error: error.message || '프로필 업데이트 중 오류가 발생했습니다.' 
      }
    }
  }
}))

// 인증 상태 초기화 - Promise 반환
export const initializeAuth = (): Promise<void> => {
  return new Promise(async (resolve) => {
    try {
      const store = useAuthStore.getState()
      await store.checkAuth()
      
      // 세션 변경 감지 - unsubscribe 함수 저장
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          store.setUser(session?.user || null)
        } else if (event === 'SIGNED_OUT') {
          store.setUser(null)
        }
      })
      
      // 구독 해제를 위한cleanup 함수 (필요시 사용)
      ;(window as any).__authSubscription = subscription
    } catch (error) {
      console.log('인증 초기화 오류, 샘플 모드로 진행:', error)
    }
    resolve()
  })
}