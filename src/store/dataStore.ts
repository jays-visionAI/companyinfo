import create from 'zustand'
import {
  Company,
  Industry,
  FinancialData,
  CompanyDocument,
  CommunityPost,
  User,
  CompanyFilter,
  CompanySortBy,
  SortOrder,
  Pagination,
  CommunityPostFilter,
  CommunityPostSortBy,
  Comment,
} from '../types'
import {
  companies as sampleCompanies,
  industries as sampleIndustries,
  financialData as sampleFinancialData,
  documents as sampleDocuments,
  communityPosts as sampleCommunityPosts,
  users as sampleUsers,
} from '../data/sampleData'
import { useAuthStore } from './authStore'

interface DataState {
  // Data
  companies: Company[]
  industries: Industry[]
  financialData: FinancialData[]
  documents: CompanyDocument[]
  communityPosts: CommunityPost[]
  users: User[]

  // Company List State
  filteredCompanies: Company[]
  filters: CompanyFilter
  sortBy: CompanySortBy
  sortOrder: SortOrder
  pagination: Pagination

  // Community Page State
  filteredCommunityPosts: CommunityPost[]
  communityFilters: CommunityPostFilter
  communitySortBy: CommunityPostSortBy
  communitySortOrder: SortOrder
  communityPagination: Pagination

  // Loading and Error State
  loading: boolean
  error: string | null

  // Actions
  initializeData: () => void
  getCompanyById: (id: string) => Company | undefined
  getIndustryById: (id: string) => Industry | undefined
  getFinancialDataForCompany: (companyId: string) => FinancialData[]
  getDocumentsForCompany: (companyId: string) => CompanyDocument[]
  getPostById: (id: string) => CommunityPost | undefined

  // Company List Actions
  setFilters: (filters: Partial<CompanyFilter>) => void
  setSort: (sortBy: CompanySortBy, sortOrder: SortOrder) => void
  setPage: (page: number) => void
  applyFiltersAndSort: () => void

  // Community Page Actions
  setCommunityFilters: (filters: Partial<CommunityPostFilter>) => void
  setCommunitySort: (sortBy: CommunityPostSortBy, sortOrder: SortOrder) => void
  setCommunityPage: (page: number) => void
  applyCommunityFiltersAndSort: () => void
  addPost: (post: Omit<CommunityPost, 'id' | 'created_at' | 'author_id' | 'author_name' | 'author_avatar' | 'likes' | 'comments'>) => void
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'author_id' | 'author_name' | 'author_avatar' | 'created_at'>) => void
  toggleLike: (postId: string) => void
  
  // Search
  setSearchTerm: (term: string) => void
}

const useDataStore = create<DataState>((set, get) => ({
  // Initial Data
  companies: [],
  industries: [],
  financialData: [],
  documents: [],
  communityPosts: [],
  users: [],

  // Initial Company List State
  filteredCompanies: [],
  filters: {},
  sortBy: 'created_at',
  sortOrder: 'desc',
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  // Initial Community Page State
  filteredCommunityPosts: [],
  communityFilters: {},
  communitySortBy: 'created_at',
  communitySortOrder: 'desc',
  communityPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  // Initial Loading and Error State
  loading: true,
  error: null,

  // --- ACTIONS ---

  initializeData: (): Promise<void> => {
    return new Promise((resolve) => {
      set({
        loading: true,
        companies: sampleCompanies as Company[],
        industries: sampleIndustries,
        financialData: sampleFinancialData,
        documents: sampleDocuments,
        communityPosts: sampleCommunityPosts,
        users: sampleUsers,
      })
      set({ loading: false })
      get().applyFiltersAndSort()
      get().applyCommunityFiltersAndSort()
      resolve()
    })
  },

  getCompanyById: (id: string) => {
    return get().companies.find(c => c.id === id)
  },

  getIndustryById: (id: string) => {
    return get().industries.find(i => i.id === id)
  },

  getFinancialDataForCompany: (companyId: string) => {
    return get().financialData.filter(fd => fd.company_id === companyId)
  },

  getDocumentsForCompany: (companyId: string) => {
    return get().documents.filter(d => d.company_id === companyId)
  },
  
  getPostById: (id: string) => {
    return get().communityPosts.find(p => p.id === id)
  },

  // --- COMPANY LIST ACTIONS ---

  setFilters: (newFilters: Partial<CompanyFilter>) => {
    set(state => ({ filters: { ...state.filters, ...newFilters }, pagination: { ...state.pagination, page: 1 } }))
    get().applyFiltersAndSort()
  },

  setSort: (sortBy: CompanySortBy, sortOrder: SortOrder) => {
    set({ sortBy, sortOrder })
    get().applyFiltersAndSort()
  },

  setPage: (page: number) => {
    set(state => ({ pagination: { ...state.pagination, page } }))
    get().applyFiltersAndSort()
  },

  applyFiltersAndSort: () => {
    const { companies, filters, sortBy, sortOrder, pagination } = get()
    let result: Company[] = [...companies]

    // Filtering logic...
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      result = result.filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.description.toLowerCase().includes(term)
      )
    }
    if (filters.industryId) {
      result = result.filter(c => c.industry_id === filters.industryId)
    }
    // ... other filters

    // Sorting logic - 모든 가능한 필드 지원
    const sortFields: Record<string, (c: Company) => string | number | undefined> = {
      'name': c => c.name,
      'revenue': c => c.revenue,
      'employee_count': c => c.employee_count,
      'founded_year': c => c.founded_year,
      'created_at': c => c.created_at,
      // 별칭 필드들
      'foundedYear': c => c.founded_year,
      'employeeCount': c => c.employee_count,
    }

    const sortField = sortFields[sortBy] || sortFields['created_at']

    result.sort((a, b) => {
      const aValue = sortField(a)
      const bValue = sortField(b)
      if (aValue === undefined || bValue === undefined) return 0
      let comparison = 0
      if (aValue > bValue) comparison = 1
      else if (aValue < bValue) comparison = -1
      return sortOrder === 'desc' ? comparison * -1 : comparison
    })

    const total = result.length
    const totalPages = Math.ceil(total / pagination.limit)
    const startIndex = (pagination.page - 1) * pagination.limit
    const paginatedResult = result.slice(startIndex, startIndex + pagination.limit)

    set({
      filteredCompanies: paginatedResult,
      pagination: { ...pagination, total, totalPages },
    })
  },

  // --- COMMUNITY PAGE ACTIONS ---

  setCommunityFilters: (newFilters: Partial<CommunityPostFilter>) => {
    set(state => ({
      communityFilters: { ...state.communityFilters, ...newFilters },
      communityPagination: { ...state.communityPagination, page: 1 },
    }))
    get().applyCommunityFiltersAndSort()
  },

  setCommunitySort: (sortBy: CommunityPostSortBy, sortOrder: SortOrder) => {
    set({ communitySortBy: sortBy, communitySortOrder: sortOrder })
    get().applyCommunityFiltersAndSort()
  },

  setCommunityPage: (page: number) => {
    set(state => ({ communityPagination: { ...state.communityPagination, page } }))
    get().applyCommunityFiltersAndSort()
  },

  applyCommunityFiltersAndSort: () => {
    const { communityPosts, communityFilters, communitySortBy, communitySortOrder, communityPagination } = get()
    let result: CommunityPost[] = [...communityPosts]

    if (communityFilters.searchTerm) {
      const term = communityFilters.searchTerm.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.content.toLowerCase().includes(term) ||
        (p.author_name && p.author_name.toLowerCase().includes(term))
      )
    }
    if (communityFilters.postType && communityFilters.postType !== 'all') {
      result = result.filter(p => p.post_type === communityFilters.postType)
    }

    result.sort((a, b) => {
      let aValue, bValue;
      if (communitySortBy === 'comments') {
        aValue = a.comments.length;
        bValue = b.comments.length;
      } else {
        aValue = a[communitySortBy];
        bValue = b[communitySortBy];
      }
      
      if (aValue === undefined || bValue === undefined) return 0
      let comparison = 0
      if (aValue > bValue) comparison = 1
      else if (aValue < bValue) comparison = -1
      return communitySortOrder === 'desc' ? comparison * -1 : comparison
    })

    const total = result.length
    const totalPages = Math.ceil(total / communityPagination.limit)
    const startIndex = (communityPagination.page - 1) * communityPagination.limit
    const paginatedResult = result.slice(startIndex, startIndex + communityPagination.limit)

    set({
      filteredCommunityPosts: paginatedResult,
      communityPagination: { ...communityPagination, total, totalPages },
    })
  },
  
  addPost: (post) => {
    const { user } = useAuthStore.getState()
    const newPost: CommunityPost = {
      ...post,
      id: `post-${Date.now()}`,
      created_at: new Date().toISOString(),
      author_id: user?.uid || 'sample-user-id',
      author_name: user?.displayName || '샘플 사용자',
      author_avatar: user?.photoURL || `https://i.pravatar.cc/150?u=${user?.uid || 'sample-user-id'}`,
      likes: 0,
      comments: [],
    }
    set(state => ({ communityPosts: [newPost, ...state.communityPosts] }))
    get().applyCommunityFiltersAndSort()
  },

  addComment: (postId, comment) => {
    const { user } = useAuthStore.getState()
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}`,
      author_id: user?.uid || 'sample-user-id',
      author_name: user?.displayName || '샘플 사용자',
      author_avatar: user?.photoURL || `https://i.pravatar.cc/150?u=${user?.uid || 'sample-user-id'}`,
      created_at: new Date().toISOString(),
    }
    set(state => ({
      communityPosts: state.communityPosts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ),
    }))
    get().applyCommunityFiltersAndSort()
  },
  
  toggleLike: (postId: string) => {
    set(state => ({
      communityPosts: state.communityPosts.map(post => {
        if (post.id === postId) {
          // In a real app, you'd track who liked it. Here we just toggle.
          // For simplicity, we'll just increment. A real implementation would be more complex.
          return { ...post, likes: (post.likes || 0) + 1 }; 
        }
        return post;
      })
    }))
    get().applyCommunityFiltersAndSort();
  },

  // --- SEARCH ---
  setSearchTerm: (term: string) => {
    set(state => ({ filters: { ...state.filters, searchTerm: term } }))
    get().applyFiltersAndSort()
  },
}))

export const { getState: getDataState, setState: setDataState, subscribe: subscribeData } = useDataStore

export const initializeData = (): Promise<void> => {
  return Promise.resolve(useDataStore.getState().initializeData())
}

export default useDataStore
