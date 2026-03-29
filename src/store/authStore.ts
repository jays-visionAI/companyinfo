import { create } from 'zustand'
import { User } from 'firebase/auth'
import { signIn, signUp, signOut as firebaseSignOut, signInWithGoogle, onAuthChange } from '../lib/auth'
import { fetchProfile } from '../lib/firestore'
import type { Profile, UserRole } from '../types'

interface AuthState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  userRole: UserRole | null
  
  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, userData: { fullName: string; role?: UserRole; companyId?: string }) => Promise<{ success: boolean; error?: string }>
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<{ success: boolean; error?: string }>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  userRole: null,

  setUser: (user) => {
    const role = user?.displayName as UserRole || 'user'
    set({ 
      user, 
      isAuthenticated: !!user,
      userRole: role
    })
  },

  setProfile: (profile) => {
    set({ 
      profile,
      userRole: profile?.role || null 
    })
  },

  setLoading: (loading) => set({ isLoading: loading }),

  initialize: async () => {
    try {
      set({ isLoading: true })
      
      // Firebase Auth 상태 변경 감지
      onAuthChange(async (user) => {
        if (user) {
          set({ user, isAuthenticated: true, isLoading: false })
          
          // Firestore에서 프로필 가져오기
          const profile = await fetchProfile(user.uid)
          set({ profile, userRole: profile?.role || 'user' })
        } else {
          set({ 
            user: null, 
            profile: null,
            isAuthenticated: false, 
            userRole: null,
            isLoading: false 
          })
        }
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
      set({ isLoading: false })
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true })
      const { user, error } = await signIn(email, password)

      if (error) throw new Error(error)

      if (user) {
        const profile = await fetchProfile(user.uid)
        set({ 
          user, 
          profile,
          isAuthenticated: true, 
          userRole: profile?.role || 'user',
          isLoading: false 
        })
        return { success: true }
      }
      
      return { success: false, error: '로그인에 실패했습니다.' }
    } catch (error: any) {
      console.error('Login error:', error)
      set({ isLoading: false })
      return { 
        success: false, 
        error: error.message || '로그인 중 오류가 발생했습니다.' 
      }
    }
  },

  signUp: async (email: string, password: string, userData: { fullName: string; role?: UserRole; companyId?: string }) => {
    try {
      set({ isLoading: true })
      const { user, error } = await signUp(email, password, userData)

      if (error) throw new Error(error)

      if (user) {
        const profile = await fetchProfile(user.uid)
        set({ 
          user, 
          profile,
          isAuthenticated: true, 
          userRole: userData.role || 'user',
          isLoading: false 
        })
        return { success: true }
      }
      
      return { success: false, error: '회원가입에 실패했습니다.' }
    } catch (error: any) {
      console.error('Signup error:', error)
      set({ isLoading: false })
      return { 
        success: false, 
        error: error.message || '회원가입 중 오류가 발생했습니다.' 
      }
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ isLoading: true })
      const { user, error } = await signInWithGoogle()

      if (error) throw new Error(error)

      if (user) {
        const profile = await fetchProfile(user.uid)
        set({ 
          user, 
          profile,
          isAuthenticated: true, 
          userRole: profile?.role || 'user',
          isLoading: false 
        })
        return { success: true }
      }
      
      return { success: false, error: 'Google 로그인에 실패했습니다.' }
    } catch (error: any) {
      console.error('Google signin error:', error)
      set({ isLoading: false })
      return { 
        success: false, 
        error: error.message || 'Google 로그인 중 오류가 발생했습니다.' 
      }
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true })
      await firebaseSignOut()
      set({ 
        user: null, 
        profile: null,
        isAuthenticated: false, 
        userRole: null,
        isLoading: false 
      })
    } catch (error) {
      console.error('Signout error:', error)
      set({ isLoading: false })
    }
  },

  updateProfile: async (data: Partial<Profile>) => {
    try {
      const { user, profile } = get()
      if (!user) return { success: false, error: '로그인되어 있지 않습니다.' }

      // Firestore 프로필 업데이트
      const { updateProfile: updateFirestoreProfile } = await import('../lib/firestore')
      const success = await updateFirestoreProfile(user.uid, data)

      if (success) {
        set({ profile: { ...profile, ...data } as Profile })
        return { success: true }
      }
      
      return { success: false, error: '프로필 업데이트에 실패했습니다.' }
    } catch (error: any) {
      console.error('Profile update error:', error)
      return { 
        success: false, 
        error: error.message || '프로필 업데이트 중 오류가 발생했습니다.' 
      }
    }
  }
}))

// 인증 상태 초기화
export const initializeAuth = (): Promise<void> => {
  return new Promise((resolve) => {
    const store = useAuthStore.getState()
    store.initialize().then(() => resolve())
  })
}
