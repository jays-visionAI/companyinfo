// 유저 역할 타입
export type UserRole = 'user' | 'company_admin' | 'admin'

// 유저 인터페이스
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  companyId?: string
  createdAt: Date
  avatar?: string
}

// 업종 카테고리
export interface Industry {
  id: string
  name: string
  code: string
  description?: string
  companyCount: number
  created_at?: string
  updated_at?: string
}

// 투자 단계
export type InvestmentStage = 'SEED' | 'Series A' | 'Series B' | 'Series C' | 'Series D+' | 'IPO 준비'

// 회사 인터페이스 (Supabase 호환)
export interface Company {
  id: string
  name: string
  industry_id: string
  industryId?: string // 호환성을 위한 별칭
  description: string
  founded_year: number
  foundedYear?: number // 호환성을 위한 별칭
  ceo_name: string
  ceoName?: string // 호환성을 위한 별칭
  employee_count: number
  employeeCount?: number // 호환성을 위한 별칭
  revenue: number // 단위: 억원
  investment_stage: InvestmentStage
  investmentStage?: InvestmentStage // 호환성을 위한 별칭
  location: string
  logo_url?: string
  logo?: string // 호환성을 위한 별칭
  website?: string
  market_position?: string
  marketPosition?: string // 호환성을 위한 별칭
  competitor_analysis?: string
  competitorAnalysis?: string // 호환성을 위한 별칭
  is_verified: boolean
  is_active: boolean
  is_listed?: boolean
  isListed?: boolean // 호환성을 위한 별칭
  created_at: string
  createdAt?: Date // 호환성을 위한 별칭
  updated_at: string
  updatedAt?: Date // 호환성을 위한 별칭
  created_by?: string
  industries?: Industry // 조인된 데이터
}

// 재무 데이터
export interface FinancialData {
  id: string
  company_id: string
  companyId?: string // 호환성을 위한 별칭
  year: number
  revenue: number
  profit: number
  assets: number
  liabilities: number
  equity: number
  growth_rate: number
  growthRate?: number // 호환성을 위한 별칭
  created_at: string
  updated_at: string
}

// 회사 문서
export interface CompanyDocument {
  id: string
  company_id: string
  companyId?: string // 호환성을 위한 별칭
  title: string
  document_type: 'annual_report' | 'financial_statement' | 'business_plan' | 'investor_presentation'
  type?: string // 호환성을 위한 별칭
  file_url: string
  url?: string // 호환성을 위한 별칭
  file_size: number
  uploaded_by: string
  is_public: boolean
  created_at: string
  uploadedAt?: Date // 호환성을 위한 별칭
  updated_at: string
}

// 프로필
export interface Profile {
  id: string
  email: string
  full_name: string
  fullName?: string // 호환성을 위한 별칭
  phone?: string
  location?: string
  bio?: string
  website?: string
  avatar_url?: string
  avatar?: string // 호환성을 위한 별칭
  role: UserRole
  company_id?: string
  companyId?: string // 호환성을 위한 별칭
  notifications: boolean
  email_notifications: boolean
  created_at: string
  updated_at: string
}

// 커뮤니티 게시물
export interface CommunityPost {
  id: string
  title: string
  content: string
  author_id: string
  authorId?: string // 호환성을 위한 별칭
  author_name?: string // 편의를 위해 추가
  author_avatar?: string // 편의를 위해 추가
  company_id?: string
  companyId?: string // 호환성을 위한 별칭
  post_type: 'question' | 'discussion' | 'announcement'
  type?: string // 호환성을 위한 별칭
  tags: string[]
  is_pinned: boolean
  is_resolved: boolean
  isAnswered?: boolean // 호환성을 위한 별칭
  view_count: number
  viewCount?: number // 호환성을 위한 별칭
  like_count: number
  likeCount?: number // 호환성을 위한 별칭
  likes?: number // dataStore 호환성을 위해 추가
  created_at: string
  createdAt?: Date // 호환성을 위한 별칭
  updated_at: string
  updatedAt?: Date // 호환성을 위한 별칭
  profiles?: Profile // 조인된 데이터
  companies?: Company // 조인된 데이터
  comments: Comment[] // 편의를 위해 추가
}

// 댓글
export interface Comment {
  id: string
  post_id: string
  postId?: string // 호환성을 위한 별칭
  author_id: string
  authorId?: string // 호환성을 위한 별칭
  author_name?: string // 편의를 위해 추가
  author_avatar?: string // 편의를 위해 추가
  content: string
  is_official_answer: boolean
  isOfficial?: boolean // 호환성을 위한 별칭
  like_count: number
  likeCount?: number // 호환성을 위한 별칭
  created_at: string
  createdAt?: Date // 호환성을 위한 별칭
  updated_at: string
  updatedAt?: Date // 호환성을 위한 별칭
}

// 좋아요
export interface Like {
  id: string
  user_id: string
  userId?: string // 호환성을 위한 별칭
  post_id?: string
  postId?: string // 호환성을 위한 별칭
  comment_id?: string
  commentId?: string // 호환성을 위한 별칭
  created_at: string
}

// 관심 기업
export interface FavoriteCompany {
  id: string
  user_id: string
  userId?: string // 호환성을 위한 별칭
  company_id: string
  companyId?: string // 호환성을 위한 별칭
  created_at: string
}

// 공지사항
export interface Notice {
  id: string
  title: string
  content: string
  author_id?: string
  authorId?: string // 호환성을 위한 별칭
  is_pinned: boolean
  isImportant?: boolean // 호환성을 위한 별칭
  view_count: number
  viewCount?: number // 호환성을 위한 별칭
  created_at: string
  createdAt?: Date // 호환성을 위한 별칭
  updated_at: string
  updatedAt?: Date // 호환성을 위한 별칭
}

// 활동 로그
export interface ActivityLog {
  id: string
  user_id?: string
  userId?: string // 호환성을 위한 별칭
  action: string
  resource_type?: string
  resourceType?: string // 호환성을 위한 별칭
  resource_id?: string
  resourceId?: string // 호환성을 위한 별칭
  details?: any
  ip_address?: string
  user_agent?: string
  created_at: string
  createdAt?: Date // 호환성을 위한 별칭
}

// 필터 옵션
export interface CompanyFilter {
  industryId?: string
  investmentStage?: InvestmentStage
  minRevenue?: number
  maxRevenue?: number
  minEmployeeCount?: number
  maxEmployeeCount?: number
  foundedYearRange?: [number, number]
  searchTerm?: string
}

// 정렬 옵션
export type CompanySortBy = 'name' | 'revenue' | 'employee_count' | 'founded_year' | 'foundedYear' | 'employeeCount' | 'created_at'
export type SortOrder = 'asc' | 'desc'

// 페이지네이션
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// 커뮤니티 게시물 필터
export interface CommunityPostFilter {
  postType?: 'question' | 'discussion' | 'announcement' | 'all'
  companyId?: string
  isResolved?: boolean
  searchTerm?: string
}

// 커뮤니티 게시물 정렬 옵션
export type CommunityPostSortBy = 'created_at' | 'view_count' | 'like_count' | 'comments'

// API 응답
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  pagination?: Pagination
}

// Admin Dashboard
export interface DashboardStat {
  title: string;
  value: number;
  change: string;
  icon: React.ElementType;
  color: string;
}

export interface AdminActivityLog {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  status: 'success' | 'failure' | 'pending';
}

export type RecentUserStatus = 'active' | 'pending' | 'suspended';

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  status: RecentUserStatus;
}

export interface TrafficData {
  date: string;
  visitors: number;
  pageviews: number;
}
