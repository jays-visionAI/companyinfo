import { 
  Industry, 
  Company, 
  FinancialData, 
  CompanyDocument, 
  CommunityPost,
  User,
  InvestmentStage 
} from '../types'

// 샘플 업종 데이터
export const industries: Industry[] = [
  { id: 'ind1', name: '정보기술(IT)', code: 'IT', description: '소프트웨어, 하드웨어, 인터넷 서비스', companyCount: 45 },
  { id: 'ind2', name: '바이오/헬스케어', code: 'BIO', description: '의약품, 의료기기, 헬스테크', companyCount: 32 },
  { id: 'ind3', name: '핀테크', code: 'FINTECH', description: '금융 서비스, 결제 시스템, 블록체인', companyCount: 28 },
  { id: 'ind4', name: '이커머스', code: 'ECOMMERCE', description: '온라인 쇼핑, 마켓플레이스', companyCount: 24 },
  { id: 'ind5', name: '게임/엔터테인먼트', code: 'GAME', description: '게임 개발, 콘텐츠 제작', companyCount: 19 },
  { id: 'ind6', name: '에너지/환경', code: 'ENERGY', description: '신재생에너지, 환경 기술', companyCount: 16 },
  { id: 'ind7', name: '로보틱스/AI', code: 'ROBOTICS', description: '로봇 공학, 인공지능', companyCount: 22 },
  { id: 'ind8', name: '모빌리티', code: 'MOBILITY', description: '전기차, 자율주행, 교통 서비스', companyCount: 18 },
]

// 샘플 유저 데이터
export const users: User[] = [
  { id: 'user1', email: 'investor@example.com', name: '김투자', role: 'user', createdAt: new Date('2023-01-15') },
  { id: 'user2', email: 'company1@example.com', name: '이대표', role: 'company_admin', companyId: 'comp1', createdAt: new Date('2023-02-20') },
  { id: 'user3', email: 'admin@example.com', name: '박관리', role: 'admin', createdAt: new Date('2023-01-01') },
  { id: 'user4', email: 'investor2@example.com', name: '최분석', role: 'user', createdAt: new Date('2023-03-10') },
  { id: 'user5', email: 'company2@example.com', name: '정이사', role: 'company_admin', companyId: 'comp2', createdAt: new Date('2023-02-28') },
]

// 샘플 회사 데이터
export const companies: Company[] = [
  {
    id: 'comp1',
    name: '테크노바이오',
    industryId: 'ind2',
    description: '차세대 암 치료제 개발을 선도하는 바이오벤처',
    foundedYear: 2018,
    ceoName: '이대표',
    employeeCount: 85,
    revenue: 32.5,
    investmentStage: 'Series B',
    location: '서울 강남구',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TechBio',
    website: 'https://technobio.kr',
    marketPosition: '국내 암 치료제 시장에서 15% 점유율, AI 기반 신약 개발 플랫폼 보유',
    competitorAnalysis: '주요 경쟁사: 제넨텍, 셀트리온. 차별화 포인트: 맞춤형 치료제 개발 기술',
    isListed: false,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-12-01'),
  },
  {
    id: 'comp2',
    name: '핀테크솔루션',
    industryId: 'ind3',
    description: '블록체인 기반 결제 솔루션 제공 핀테크 스타트업',
    foundedYear: 2020,
    ceoName: '정이사',
    employeeCount: 120,
    revenue: 78.2,
    investmentStage: 'Series C',
    location: '서울 서초구',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=FinTech',
    website: 'https://fintechsolutions.co.kr',
    marketPosition: '국내 B2B 결제 솔루션 시장 1위, 해외 5개국 진출',
    competitorAnalysis: '주요 경쟁사: 토스, 카카오페이. 차별화: 블록체인 기반 보안 솔루션',
    isListed: false,
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-11-20'),
  },
  {
    id: 'comp3',
    name: 'AI로보틱스',
    industryId: 'ind7',
    description: '산업용 로봇 및 AI 자동화 솔루션 개발',
    foundedYear: 2017,
    ceoName: '박창업',
    employeeCount: 156,
    revenue: 145.8,
    investmentStage: 'Series D+',
    location: '경기 성남시',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AI Robotics',
    website: 'https://airobotics.kr',
    marketPosition: '국내 산업용 로봇 시장 2위, 자율주행 로봇 특허 15건 보유',
    competitorAnalysis: '주요 경쟁사: 현대로보틱스, 두산로보틱스. 차별화: AI 학습형 제어 시스템',
    isListed: false,
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-12-05'),
  },
  {
    id: 'comp4',
    name: '그린에너지',
    industryId: 'ind6',
    description: '태양광 발전 및 에너지 저장 시스템 전문 기업',
    foundedYear: 2015,
    ceoName: '김환경',
    employeeCount: 92,
    revenue: 56.3,
    investmentStage: 'Series C',
    location: '부산 해운대구',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GreenEnergy',
    website: 'https://greenenergy.kr',
    marketPosition: '국내 태양광 에너지 저장 시장 3위, 정부 지원 프로젝트 다수 수행',
    competitorAnalysis: '주요 경쟁사: 한화솔루션, 효성. 차별화: 고효율 배터리 기술',
    isListed: false,
    createdAt: new Date('2023-02-05'),
    updatedAt: new Date('2023-11-15'),
  },
  {
    id: 'comp5',
    name: '게임스튜디오X',
    industryId: 'ind5',
    description: '모바일 및 PC 게임 개발 전문 스튜디오',
    foundedYear: 2019,
    ceoName: '이개발',
    employeeCount: 68,
    revenue: 41.7,
    investmentStage: 'Series A',
    location: '서울 마포구',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GameStudio',
    website: 'https://gamestudiox.kr',
    marketPosition: '국내 모바일 RPG 게임 시장에서 성공적인 타이틀 3개 보유',
    competitorAnalysis: '주요 경쟁사: 넷마블, 크래프톤. 차별화: 소셜 게임 플랫폼 통합',
    isListed: false,
    createdAt: new Date('2023-01-25'),
    updatedAt: new Date('2023-11-30'),
  },
  {
    id: 'comp6',
    name: '클라우드네트웍스',
    industryId: 'ind1',
    description: '엔터프라이즈 클라우드 인프라 서비스 제공',
    foundedYear: 2016,
    ceoName: '정클라우드',
    employeeCount: 210,
    revenue: 189.4,
    investmentStage: 'IPO 준비',
    location: '서울 송파구',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CloudNet',
    website: 'https://cloudnetworks.kr',
    marketPosition: '국내 중소기업 클라우드 시장 1위, 500개 이상 기업 고객 보유',
    competitorAnalysis: '주요 경쟁사: 네이버클라우드, AWS. 차별화: 한국형 보안 솔루션 통합',
    isListed: false,
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-12-10'),
  },
  {
    id: 'comp7',
    name: '헬스테크코리아',
    industryId: 'ind2',
    description: '웨어러블 헬스케어 디바이스 및 앱 개발',
    foundedYear: 2021,
    ceoName: '박헬스',
    employeeCount: 45,
    revenue: 18.9,
    investmentStage: 'SEED',
    location: '대전 유성구',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=HealthTech',
    website: 'https://healthtechkorea.kr',
    marketPosition: '스마트워치 건강 모니터링 시장 신흥 강자',
    competitorAnalysis: '주요 경쟁사: 애플, 삼성전자. 차별화: 맞춤형 건강 관리 AI',
    isListed: false,
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-11-25'),
  },
  {
    id: 'comp8',
    name: '모빌리티플랫폼',
    industryId: 'ind8',
    description: '전기차 충전 인프라 및 모빌리티 서비스 플랫폼',
    foundedYear: 2018,
    ceoName: '김모빌',
    employeeCount: 134,
    revenue: 67.8,
    investmentStage: 'Series B',
    location: '인천 연수구',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Mobility',
    website: 'https://mobilityplatform.kr',
    marketPosition: '국내 전기차 충전소 네트워크 2위, 1,200개 충전소 운영',
    competitorAnalysis: '주요 경쟁사: 현대오토에버, EVgo. 차별화: 통합 충전 예약 시스템',
    isListed: false,
    createdAt: new Date('2023-01-30'),
    updatedAt: new Date('2023-12-03'),
  },
]

// 추가 회사 데이터 (20개까지 채우기)
export const additionalCompanies: Company[] = [
  {
    id: 'comp9',
    name: '에듀테크솔루션',
    industryId: 'ind1',
    description: 'AI 기반 맞춤형 교육 플랫폼',
    foundedYear: 2020,
    ceoName: '이에듀',
    employeeCount: 53,
    revenue: 28.4,
    investmentStage: 'Series A',
    location: '서울 종로구',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=EduTech',
    marketPosition: '국내 온라인 교육 플랫폼 시장 신흥 기업',
    isListed: false,
    createdAt: new Date('2023-02-18'),
    updatedAt: new Date('2023-11-28'),
  },
  {
    id: 'comp10',
    name: '푸드테크파트너스',
    industryId: 'ind4',
    description: '푸드 배달 및 식자재 공급 플랫폼',
    foundedYear: 2019,
    ceoName: '정푸드',
    employeeCount: 87,
    revenue: 62.1,
    investmentStage: 'Series B',
    location: '서울 강서구',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=FoodTech',
    marketPosition: 'B2B 식자재 공급 시장에서 빠른 성장 중',
    isListed: false,
    createdAt: new Date('2023-01-22'),
    updatedAt: new Date('2023-12-02'),
  },
  {
    id: 'comp11',
    name: '로보틱스코어',
    industryId: 'ind7',
    description: '의료용 로봇 시스템 개발',
    foundedYear: 2016,
    ceoName: '박로봇',
    employeeCount: 142,
    revenue: 112.6,
    investmentStage: 'Series C',
    location: '경기 용인시',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=RoboticsCore',
    marketPosition: '수술용 로봇 시장에서 혁신적인 기술 보유',
    isListed: false,
    createdAt: new Date('2023-01-18'),
    updatedAt: new Date('2023-11-18'),
  },
  {
    id: 'comp12',
    name: '블록체인트러스트',
    industryId: 'ind3',
    description: '블록체인 기반 디지털 신원 인증 서비스',
    foundedYear: 2021,
    ceoName: '김블록',
    employeeCount: 38,
    revenue: 14.7,
    investmentStage: 'SEED',
    location: '서울 영등포구',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Blockchain',
    marketPosition: '디지털 신원 인증 시장의 선도적 스타트업',
    isListed: false,
    createdAt: new Date('2023-02-25'),
    updatedAt: new Date('2023-11-22'),
  },
]

// 모든 회사 합치기
export const allCompanies: Company[] = [...companies, ...additionalCompanies]

// 재무 데이터 샘플
export const financialData: FinancialData[] = [
  // 테크노바이오 재무 데이터
  { id: 'fin1', companyId: 'comp1', year: 2022, revenue: 24.8, profit: -3.2, assets: 45.6, liabilities: 18.3, equity: 27.3, growthRate: 31.2 },
  { id: 'fin2', companyId: 'comp1', year: 2023, revenue: 32.5, profit: -1.5, assets: 58.9, liabilities: 22.1, equity: 36.8, growthRate: 31.0 },
  
  // 핀테크솔루션 재무 데이터
  { id: 'fin3', companyId: 'comp2', year: 2022, revenue: 45.3, profit: 2.8, assets: 67.2, liabilities: 32.4, equity: 34.8, growthRate: 72.5 },
  { id: 'fin4', companyId: 'comp2', year: 2023, revenue: 78.2, profit: 8.1, assets: 89.5, liabilities: 41.6, equity: 47.9, growthRate: 72.6 },
  
  // AI로보틱스 재무 데이터
  { id: 'fin5', companyId: 'comp3', year: 2022, revenue: 98.7, profit: 15.2, assets: 156.3, liabilities: 67.8, equity: 88.5, growthRate: 47.8 },
  { id: 'fin6', companyId: 'comp3', year: 2023, revenue: 145.8, profit: 28.4, assets: 198.2, liabilities: 89.3, equity: 108.9, growthRate: 47.8 },
  
  // 그린에너지 재무 데이터
  { id: 'fin7', companyId: 'comp4', year: 2022, revenue: 42.1, profit: 3.8, assets: 78.9, liabilities: 45.2, equity: 33.7, growthRate: 33.7 },
  { id: 'fin8', companyId: 'comp4', year: 2023, revenue: 56.3, profit: 6.2, assets: 94.3, liabilities: 52.8, equity: 41.5, growthRate: 33.7 },
]

// 회사 문서 샘플
export const companyDocuments: CompanyDocument[] = [
  { id: 'doc1', companyId: 'comp1', title: '2023년 사업보고서', type: 'annual_report', url: '#', uploadedAt: new Date('2023-11-30') },
  { id: 'doc2', companyId: 'comp1', title: '2023년 재무제표', type: 'financial_statement', url: '#', uploadedAt: new Date('2023-11-30') },
  { id: 'doc3', companyId: 'comp2', title: '투자자 프레젠테이션', type: 'investor_presentation', url: '#', uploadedAt: new Date('2023-11-25') },
  { id: 'doc4', companyId: 'comp3', title: '2024년 사업계획서', type: 'business_plan', url: '#', uploadedAt: new Date('2023-12-05') },
]

// 커뮤니티 게시물 샘플
export const communityPosts: CommunityPost[] = [
  {
    id: 'post1',
    companyId: 'comp1',
    userId: 'user1',
    title: '테크노바이오의 최근 임상실험 결과에 대해 어떻게 생각하시나요?',
    content: '최근 발표된 2상 임상실험 결과가 아주 인상적이었습니다. 향후 투자 전망에 대해 의견을 나누고 싶습니다.',
    type: 'question',
    isAnswered: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-02'),
    viewCount: 245,
    likeCount: 34,
  },
  {
    id: 'post2',
    companyId: 'comp2',
    userId: 'user4',
    title: '핀테크솔루션의 해외 진출 전략에 대한 토론',
    content: '동남아 시장 진출을 발표한 핀테크솔루션의 전략이 적절한지, 어떤 리스크가 있을지 논의해보고 싶습니다.',
    type: 'discussion',
    isAnswered: false,
    createdAt: new Date('2023-11-28'),
    updatedAt: new Date('2023-11-29'),
    viewCount: 178,
    likeCount: 21,
  },
  {
    id: 'post3',
    companyId: 'comp3',
    userId: 'user2',
    title: 'AI로보틱스 공식 성과 발표 (2023년 4분기)',
    content: '2023년 4분기 매출은 42억원으로 전년 동기 대비 47% 증가했습니다. 주요 고객사와의 계약 갱신도 완료되었습니다.',
    type: 'announcement',
    isAnswered: false,
    createdAt: new Date('2023-12-05'),
    updatedAt: new Date('2023-12-05'),
    viewCount: 321,
    likeCount: 45,
  },
]

// 산업별 회사 수 계산 함수
export function getCompaniesByIndustry(industryId: string): Company[] {
  return allCompanies.filter(company => company.industryId === industryId)
}

// 투자 단계별 필터링 함수
export function filterCompaniesByStage(stage: InvestmentStage): Company[] {
  return allCompanies.filter(company => company.investmentStage === stage)
}

// 매출 기준 정렬 함수
export function sortCompaniesByRevenue(order: 'asc' | 'desc' = 'desc'): Company[] {
  return [...allCompanies].sort((a, b) => {
    return order === 'desc' ? b.revenue - a.revenue : a.revenue - b.revenue
  })
}

// 검색 함수
export function searchCompanies(query: string): Company[] {
  if (!query.trim()) return allCompanies
  
  const searchLower = query.toLowerCase()
  return allCompanies.filter(company =>
    company.name.toLowerCase().includes(searchLower) ||
    company.ceoName.toLowerCase().includes(searchLower) ||
    company.description.toLowerCase().includes(searchLower) ||
    industries.find(ind => ind.id === company.industryId)?.name.toLowerCase().includes(searchLower)
  )
}