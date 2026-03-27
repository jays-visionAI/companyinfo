import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './authStore'
import type { Company, Industry, CommunityPost } from '../types'

interface DataState {
  // 데이터 상태
  companies: Company[]
  industries: Industry[]
  communityPosts: CommunityPost[]
  
  // 로딩 상태
  isLoading: {
    companies: boolean
    industries: boolean
    communityPosts: boolean
  }
  
  // 에러 상태
  errors: {
    companies: string | null
    industries: string | null
    communityPosts: string | null
  }
  
  // 필터 및 정렬
  filters: {
    searchQuery: string
    industryId: string | null
    investmentStage: string | null
    sortBy: 'name' | 'revenue' | 'employeeCount' | 'createdAt'
    sortOrder: 'asc' | 'desc'
  }
  
  // 페이지네이션
  pagination: {
    currentPage: number
    itemsPerPage: number
    totalItems: number
  }
  
  // Actions
  setFilters: (filters: Partial<DataState['filters']>) => void
  setPagination: (pagination: Partial<DataState['pagination']>) => void
  
  // 데이터 가져오기
  fetchCompanies: () => Promise<void>
  fetchIndustries: () => Promise<void>
  fetchCommunityPosts: () => Promise<void>
  
  // 데이터 생성/수정/삭제
  createCompany: (companyData: Partial<Company>) => Promise<{ success: boolean; error?: string }>
  updateCompany: (id: string, companyData: Partial<Company>) => Promise<{ success: boolean; error?: string }>
  deleteCompany: (id: string) => Promise<{ success: boolean; error?: string }>
  
  createCommunityPost: (postData: Partial<CommunityPost>) => Promise<{ success: boolean; error?: string }>
  updateCommunityPost: (id: string, postData: Partial<CommunityPost>) => Promise<{ success: boolean; error?: string }>
  deleteCommunityPost: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // 필터링된 데이터
  getFilteredCompanies: () => Company[]
}

export const useDataStore = create<DataState>((set, get) => ({
  companies: [],
  industries: [],
  communityPosts: [],
  
  isLoading: {
    companies: false,
    industries: false,
    communityPosts: false
  },
  
  errors: {
    companies: null,
    industries: null,
    communityPosts: null
  },
  
  filters: {
    searchQuery: '',
    industryId: null,
    investmentStage: null,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  
  pagination: {
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0
  },
  
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, currentPage: 1 }
    }))
  },
  
  setPagination: (pagination) => {
    set((state) => ({
      pagination: { ...state.pagination, ...pagination }
    }))
  },
  
  fetchCompanies: async () => {
    try {
      set((state) => ({
        isLoading: { ...state.isLoading, companies: true },
        errors: { ...state.errors, companies: null }
      }))
      
      const { data, error } = await supabase
        .from('companies')
        .select('*, industries(*)')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      set((state) => ({
        companies: data || [],
        isLoading: { ...state.isLoading, companies: false },
        pagination: { ...state.pagination, totalItems: data?.length || 0 }
      }))
    } catch (error: any) {
      console.error('회사 데이터 가져오기 오류:', error)
      set((state) => ({
        isLoading: { ...state.isLoading, companies: false },
        errors: { ...state.errors, companies: error.message }
      }))
    }
  },
  
  fetchIndustries: async () => {
    try {
      set((state) => ({
        isLoading: { ...state.isLoading, industries: true },
        errors: { ...state.errors, industries: null }
      }))
      
      const { data, error } = await supabase
        .from('industries')
        .select('*')
        .order('name')
      
      if (error) throw error
      
      set((state) => ({
        industries: data || [],
        isLoading: { ...state.isLoading, industries: false }
      }))
    } catch (error: any) {
      console.error('업종 데이터 가져오기 오류:', error)
      set((state) => ({
        isLoading: { ...state.isLoading, industries: false },
        errors: { ...state.errors, industries: error.message }
      }))
    }
  },
  
  fetchCommunityPosts: async () => {
    try {
      set((state) => ({
        isLoading: { ...state.isLoading, communityPosts: true },
        errors: { ...state.errors, communityPosts: null }
      }))
      
      const { data, error } = await supabase
        .from('community_posts')
        .select('*, profiles(full_name, role), companies(name)')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      set((state) => ({
        communityPosts: data || [],
        isLoading: { ...state.isLoading, communityPosts: false }
      }))
    } catch (error: any) {
      console.error('커뮤니티 게시물 가져오기 오류:', error)
      set((state) => ({
        isLoading: { ...state.isLoading, communityPosts: false },
        errors: { ...state.errors, communityPosts: error.message }
      }))
    }
  },
  
  createCompany: async (companyData) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([{
          ...companyData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      
      // 로컬 상태 업데이트
      set((state) => ({
        companies: [data[0], ...state.companies]
      }))
      
      return { success: true }
    } catch (error: any) {
      console.error('회사 생성 오류:', error)
      return { success: false, error: error.message }
    }
  },
  
  updateCompany: async (id, companyData) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update({
          ...companyData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      
      if (error) throw error
      
      // 로컬 상태 업데이트
      set((state) => ({
        companies: state.companies.map(company => 
          company.id === id ? { ...company, ...data[0] } : company
        )
      }))
      
      return { success: true }
    } catch (error: any) {
      console.error('회사 수정 오류:', error)
      return { success: false, error: error.message }
    }
  },
  
  deleteCompany: async (id) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // 로컬 상태 업데이트
      set((state) => ({
        companies: state.companies.filter(company => company.id !== id)
      }))
      
      return { success: true }
    } catch (error: any) {
      console.error('회사 삭제 오류:', error)
      return { success: false, error: error.message }
    }
  },
  
  createCommunityPost: async (postData) => {
    try {
      const { user } = useAuthStore.getState()
      if (!user) throw new Error('로그인이 필요합니다.')
      
      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          ...postData,
          author_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      
      // 로컬 상태 업데이트
      set((state) => ({
        communityPosts: [data[0], ...state.communityPosts]
      }))
      
      return { success: true }
    } catch (error: any) {
      console.error('게시물 생성 오류:', error)
      return { success: false, error: error.message }
    }
  },
  
  updateCommunityPost: async (id, postData) => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .update({
          ...postData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      
      if (error) throw error
      
      // 로컬 상태 업데이트
      set((state) => ({
        communityPosts: state.communityPosts.map(post => 
          post.id === id ? { ...post, ...data[0] } : post
        )
      }))
      
      return { success: true }
    } catch (error: any) {
      console.error('게시물 수정 오류:', error)
      return { success: false, error: error.message }
    }
  },
  
  deleteCommunityPost: async (id) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // 로컬 상태 업데이트
      set((state) => ({
        communityPosts: state.communityPosts.filter(post => post.id !== id)
      }))
      
      return { success: true }
    } catch (error: any) {
      console.error('게시물 삭제 오류:', error)
      return { success: false, error: error.message }
    }
  },
  
  getFilteredCompanies: () => {
    const { companies, filters } = get()
    
    let filtered = [...companies]
    
    // 검색어 필터링
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(query) ||
        company.description?.toLowerCase().includes(query) ||
        company.location.toLowerCase().includes(query)
      )
    }
    
    // 업종 필터링
    if (filters.industryId) {
      filtered = filtered.filter(company => {
        const industryId = company.industry_id || company.industryId
        return industryId === filters.industryId
      })
    }
    
    // 투자 단계 필터링
    if (filters.investmentStage) {
      filtered = filtered.filter(company => {
        const investmentStage = company.investment_stage || company.investmentStage
        return investmentStage === filters.investmentStage
      })
    }
    
    // 정렬
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'revenue':
          aValue = a.revenue || 0
          bValue = b.revenue || 0
          break
        case 'employeeCount':
          aValue = (a.employee_count || a.employeeCount || 0)
          bValue = (b.employee_count || b.employeeCount || 0)
          break
        case 'createdAt':
          aValue = new Date(a.created_at || a.createdAt || 0).getTime()
          bValue = new Date(b.created_at || b.createdAt || 0).getTime()
          break
        default:
          aValue = a.name
          bValue = b.name
      }
      
      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    return filtered
  }
}))

// 데이터 초기화
export const initializeData = () => {
  const store = useDataStore.getState()
  store.fetchCompanies()
  store.fetchIndustries()
  store.fetchCommunityPosts()
}