// Firebase Auth
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'
import type { Profile, UserRole } from '../types'

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()

// 프로필 생성 또는 업데이트
const createOrUpdateProfile = async (user: User, additionalData?: Partial<Profile>) => {
  const profileRef = doc(db, 'profiles', user.uid)
  const profileSnap = await getDoc(profileRef)

  const profileData = {
    email: user.email || '',
    fullName: user.displayName || additionalData?.fullName || '사용자',
    avatar: user.photoURL || '',
    role: (additionalData?.role as UserRole) || 'user',
    companyId: additionalData?.companyId,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  }

  if (!profileSnap.exists()) {
    await setDoc(profileRef, profileData)
  } else {
    await setDoc(profileRef, { ...profileData, updatedAt: serverTimestamp() }, { merge: true })
  }

  return profileData
}

// 이메일/비밀번호 회원가입
export const signUp = async (
  email: string,
  password: string, 
  userData: { fullName: string; role?: UserRole; companyId?: string }
): Promise<{ user: User | null; error?: string }> => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName: userData.fullName })
    await createOrUpdateProfile(user, userData)
    return { user }
  } catch (error: any) {
    console.error('Signup error:', error)
    return { user: null, error: error.message }
  }
}

// 이메일/비밀번호 로그인
export const signIn = async (
  email: string, 
  password: string
): Promise<{ user: User | null; error?: string }> => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    return { user }
  } catch (error: any) {
    console.error('Signin error:', error)
    return { user: null, error: error.message }
  }
}

// Google 로그인
export const signInWithGoogle = async (): Promise<{ user: User | null; error?: string }> => {
  try {
    const { user } = await signInWithPopup(auth, googleProvider)
    // 이미 프로필이 있는지 확인하고 없으면 생성
    await createOrUpdateProfile(user)
    return { user }
  } catch (error: any) {
    console.error('Google signin error:', error)
    return { user: null, error: error.message }
  }
}

// 로그아웃
export const signOut = async (): Promise<{ error?: string }> => {
  try {
    await firebaseSignOut(auth)
    return {}
  } catch (error: any) {
    console.error('Signout error:', error)
    return { error: error.message }
  }
}

// 현재 사용자 가져오기
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

// 프로필 가져오기
export const getProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const profileRef = doc(db, 'profiles', userId)
    const profileSnap = await getDoc(profileRef)
    
    if (profileSnap.exists()) {
      return { id: profileSnap.id, ...profileSnap.data() } as Profile
    }
    return null
  } catch (error) {
    console.error('Get profile error:', error)
    return null
  }
}

// 비밀번호 재설정
export const resetPassword = async (email: string): Promise<{ error?: string }> => {
  try {
    await sendPasswordResetEmail(auth, email)
    return {}
  } catch (error: any) {
    console.error('Reset password error:', error)
    return { error: error.message }
  }
}

// 인증 상태 변경 감지
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

export default {
  signUp,
  signIn,
  signInWithGoogle,
  signOut,
  getCurrentUser,
  getProfile,
  resetPassword,
  onAuthChange,
}
