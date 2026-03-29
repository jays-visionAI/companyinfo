// Firebase Firestore Database Operations
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  addDoc,
  increment,
  arrayUnion,
  arrayRemove,
  QueryConstraint,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Company, Industry, CommunityPost, Comment, Profile, Notice } from '../types'

// ============================================
// 유틸리티 함수
// ============================================

// Firestore 타임스탬프를 Date로 변환
export const convertTimestamp = (data: any): any => {
  if (!data) return data
  const converted = { ...data }
  for (const key in converted) {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate()
    }
  }
  return converted
}

// ============================================
// 회사 (Companies) CRUD
// ============================================

// 모든 회사 가져오기
export const fetchCompanies = async (constraints?: QueryConstraint[]): Promise<Company[]> => {
  try {
    const companiesRef = collection(db, 'companies')
    const q = constraints ? query(companiesRef, ...constraints) : companiesRef
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company))
  } catch (error) {
    console.error('Fetch companies error:', error)
    return []
  }
}

// ID로 회사 가져오기
export const fetchCompanyById = async (id: string): Promise<Company | null> => {
  try {
    const docRef = doc(db, 'companies', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Company
    }
    return null
  } catch (error) {
    console.error('Fetch company by id error:', error)
    return null
  }
}

// 회사 생성
export const createCompany = async (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
  try {
    const companiesRef = collection(db, 'companies')
    const docRef = await addDoc(companiesRef, {
      ...companyData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error('Create company error:', error)
    return null
  }
}

// 회사 업데이트
export const updateCompany = async (id: string, data: Partial<Company>): Promise<boolean> => {
  try {
    const docRef = doc(db, 'companies', id)
    await updateDoc(docRef, {
      ...data,
      updated_at: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error('Update company error:', error)
    return false
  }
}

// ============================================
// 업종 (Industries) CRUD
// ============================================

// 모든 업종 가져오기
export const fetchIndustries = async (): Promise<Industry[]> => {
  try {
    const industriesRef = collection(db, 'industries')
    const snapshot = await getDocs(industriesRef)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Industry))
  } catch (error) {
    console.error('Fetch industries error:', error)
    return []
  }
}

// ============================================
// 커뮤니티 게시물 (Community Posts) CRUD
// ============================================

// 모든 게시물 가져오기
export const fetchCommunityPosts = async (constraints?: QueryConstraint[]): Promise<CommunityPost[]> => {
  try {
    const postsRef = collection(db, 'community_posts')
    const q = constraints 
      ? query(postsRef, ...constraints, orderBy('created_at', 'desc'))
      : query(postsRef, orderBy('created_at', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityPost))
  } catch (error) {
    console.error('Fetch community posts error:', error)
    return []
  }
}

// 게시물 생성
export const createCommunityPost = async (
  postData: Omit<CommunityPost, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'like_count' | 'comments'>
): Promise<string | null> => {
  try {
    const postsRef = collection(db, 'community_posts')
    const docRef = await addDoc(postsRef, {
      ...postData,
      view_count: 0,
      like_count: 0,
      comments: [],
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error('Create community post error:', error)
    return null
  }
}

// 게시물에 댓글 추가
export const addComment = async (postId: string, comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
  try {
    const commentsRef = collection(db, 'community_posts', postId, 'comments')
    const docRef = await addDoc(commentsRef, {
      ...comment,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
    
    // 게시물의 댓글 수 증가
    const postRef = doc(db, 'community_posts', postId)
    await updateDoc(postRef, { updated_at: serverTimestamp() })
    
    return docRef.id
  } catch (error) {
    console.error('Add comment error:', error)
    return null
  }
}

// 게시물 좋아요
export const toggleLike = async (postId: string, userId: string, isLiked: boolean): Promise<boolean> => {
  try {
    const postRef = doc(db, 'community_posts', postId)
    await updateDoc(postRef, {
      like_count: increment(isLiked ? -1 : 1),
      liked_by: isLiked ? arrayRemove(userId) : arrayUnion(userId),
    })
    return true
  } catch (error) {
    console.error('Toggle like error:', error)
    return false
  }
}

// ============================================
// 프로필 (Profiles) CRUD
// ============================================

// 프로필 가져오기
export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const profileRef = doc(db, 'profiles', userId)
    const profileSnap = await getDoc(profileRef)
    if (profileSnap.exists()) {
      return { id: profileSnap.id, ...profileSnap.data() } as Profile
    }
    return null
  } catch (error) {
    console.error('Fetch profile error:', error)
    return null
  }
}

// 프로필 업데이트
export const updateProfile = async (userId: string, data: Partial<Profile>): Promise<boolean> => {
  try {
    const profileRef = doc(db, 'profiles', userId)
    await updateDoc(profileRef, {
      ...data,
      updated_at: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error('Update profile error:', error)
    return false
  }
}

// ============================================
// 공지사항 (Notices) CRUD
// ============================================

// 모든 공지사항 가져오기
export const fetchNotices = async (): Promise<Notice[]> => {
  try {
    const noticesRef = collection(db, 'notices')
    const q = query(noticesRef, orderBy('is_pinned', 'desc'), orderBy('created_at', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notice))
  } catch (error) {
    console.error('Fetch notices error:', error)
    return []
  }
}

// ============================================
// 실시간 리스너
// ============================================

// 게시물 실시간 업데이트
export const subscribeToPosts = (callback: (posts: CommunityPost[]) => void) => {
  const postsRef = collection(db, 'community_posts')
  const q = query(postsRef, orderBy('created_at', 'desc'), limit(50))
  
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityPost))
    callback(posts)
  })
}

// ============================================
// 배치 쓰기 (여러 문서 동시 업데이트)
// ============================================

// 회사 일괄 생성 (초기 데이터 로드용)
export const batchCreateCompanies = async (companies: Company[]): Promise<boolean> => {
  try {
    const batch: Promise<void>[] = []
    
    for (const company of companies) {
      const companyRef = doc(db, 'companies', company.id)
      batch.push(
        setDoc(companyRef, {
          ...company,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        })
      )
    }
    
    await Promise.all(batch)
    return true
  } catch (error) {
    console.error('Batch create companies error:', error)
    return false
  }
}

export default {
  // Companies
  fetchCompanies,
  fetchCompanyById,
  createCompany,
  updateCompany,
  // Industries
  fetchIndustries,
  // Community
  fetchCommunityPosts,
  createCommunityPost,
  addComment,
  toggleLike,
  // Profile
  fetchProfile,
  updateProfile,
  // Notices
  fetchNotices,
  // Subscriptions
  subscribeToPosts,
  // Batch
  batchCreateCompanies,
}
