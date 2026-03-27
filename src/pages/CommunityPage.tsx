import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  MessageSquare,
  ChevronRight,
  Plus,
  Tag,
  CheckCircle,
  Building2,
  TrendingUp,
  Users,
  Hash
} from 'lucide-react'
import { companies, industries } from '../data/sampleData'
import { formatRelativeTime, cn, truncateText } from '../lib/utils'

type CommunityType = 'all' | 'question' | 'discussion' | 'announcement'
type SortBy = 'latest' | 'popular' | 'answered'

interface Question {
  id: string
  title: string
  content: string
  author: {
    name: string
    role: string
    avatar?: string
  }
  companyId: string
  type: 'question' | 'discussion' | 'announcement'
  isAnswered: boolean
  isOfficial: boolean
  tags: string[]
  createdAt: Date
  viewCount: number
  likeCount: number
  answerCount: number
}

const CommunityPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<CommunityType>('all')
  const [selectedCompany, setSelectedCompany] = useState<string>('all')
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortBy>('latest')
  const [showAskForm, setShowAskForm] = useState(false)

  // 샘플 질문 데이터 생성
  const sampleQuestions: Question[] = [
    {
      id: 'q1',
      title: '테크노바이오의 신약 개발 현황이 궁금합니다',
      content: '최근 발표된 암 치료제 개발 진행 상황과 임상시험 결과에 대해 자세히 알고 싶습니다. 전문가 분들의 의견을 듣고 싶습니다.',
      author: {
        name: '김투자',
        role: '투자자',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kim'
      },
      companyId: 'comp1',
      type: 'question',
      isAnswered: true,
      isOfficial: true,
      tags: ['신약개발', '바이오', '임상시험'],
      createdAt: new Date('2024-01-15'),
      viewCount: 245,
      likeCount: 42,
      answerCount: 3
    },
    {
      id: 'q2',
      type: 'discussion',
      title: '핀테크 산업의 2024년 전망',
      content: '블록체인 기술이 금융 산업에 미치는 영향과 향후 5년간의 전망에 대해 의견을 나눠보고 싶습니다.',
      author: {
        name: '이분석',
        role: '금융분석가',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lee'
      },
      companyId: 'comp2',
      isAnswered: false,
      isOfficial: false,
      tags: ['핀테크', '블록체인', '금융', '전망'],
      createdAt: new Date('2024-01-14'),
      viewCount: 189,
      likeCount: 31,
      answerCount: 12
    },
    {
      id: 'q3',
      type: 'announcement',
      title: 'AI로보틱스 신제품 발표 안내',
      content: '차세대 산업용 로봇 "RoboAI-X" 출시를 앞두고 있습니다. 자세한 사양과 데모 일정을 공유드립니다.',
      author: {
        name: 'AI로보틱스',
        role: '회사담당자',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AI Robotics'
      },
      companyId: 'comp3',
      isAnswered: false,
      isOfficial: true,
      tags: ['신제품', '로보틱스', '발표'],
      createdAt: new Date('2024-01-16'),
      viewCount: 156,
      likeCount: 28,
      answerCount: 0
    },
    {
      id: 'q4',
      type: 'question',
      title: '그린에너지의 해외 진출 전략',
      content: '태양광 사업의 해외 시장 진출 계획과 현재 진행 중인 해외 프로젝트에 대해 알고 싶습니다.',
      author: {
        name: '최환경',
        role: '에너지분석가'
      },
      companyId: 'comp4',
      isAnswered: true,
      isOfficial: true,
      tags: ['태양광', '해외진출', '에너지'],
      createdAt: new Date('2024-01-13'),
      viewCount: 132,
      likeCount: 19,
      answerCount: 2
    },
    {
      id: 'q5',
      type: 'discussion',
      title: '게임스튜디오X의 차기작 기대감',
      content: '다음 프로젝트로 어떤 장르의 게임을 준비 중인지, 그리고 언제쯤 공개될지에 대한 소식이 궁금합니다.',
      author: {
        name: '박게이머',
        role: '게임평론가'
      },
      companyId: 'comp5',
      isAnswered: false,
      isOfficial: false,
      tags: ['게임', '신작', '엔터테인먼트'],
      createdAt: new Date('2024-01-12'),
      viewCount: 98,
      likeCount: 24,
      answerCount: 8
    },
    {
      id: 'q6',
      type: 'question',
      title: '클라우드네트웍스의 IPO 계획',
      content: '언제쯤 상장을 계획하고 있으며, 상장 규모와 공모가에 대한 정보를 얻을 수 있을까요?',
      author: {
        name: '정투자',
        role: '기관투자자'
      },
      companyId: 'comp6',
      isAnswered: false,
      isOfficial: false,
      tags: ['IPO', '상장', '클라우드'],
      createdAt: new Date('2024-01-11'),
      viewCount: 312,
      likeCount: 45,
      answerCount: 15
    }
  ]

  // 필터링된 질문
  const filteredQuestions = sampleQuestions.filter(question => {
    // 검색어 필터
    if (searchTerm && !question.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !question.content.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    
    // 타입 필터
    if (selectedType !== 'all' && question.type !== selectedType) {
      return false
    }
    
    // 회사 필터
    if (selectedCompany !== 'all' && question.companyId !== selectedCompany) {
      return false
    }
    
    // 업종 필터
    if (selectedIndustry !== 'all') {
      const company = companies.find(c => c.id === question.companyId)
      if (!company || company.industryId !== selectedIndustry) {
        return false
      }
    }
    
    return true
  })

  // 정렬
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return b.createdAt.getTime() - a.createdAt.getTime()
      case 'popular':
        return b.viewCount - a.viewCount
      case 'answered':
        return (b.isAnswered ? 1 : 0) - (a.isAnswered ? 1 : 0)
      default:
        return 0
    }
  })

  // 질문하기 폼 컴포넌트
  const AskQuestionForm = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">질문하기</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            제목
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="질문의 제목을 입력하세요"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            내용
          </label>
          <textarea
            rows={4}
            className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
            placeholder="자세한 내용을 입력하세요"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              관련 회사
            </label>
            <select className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="">회사를 선택하세요</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              질문 유형
            </label>
            <select className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="question">질문</option>
              <option value="discussion">토론</option>
              <option value="announcement">공지</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowAskForm(false)}
            className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            취소
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            질문 등록
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">커뮤니티</h1>
          <p className="text-gray-600 dark:text-gray-400">
            비상장주식에 관심있는 투자자, 전문가, 회사 담당자들과 소통하세요
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">전체 질문</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              지난달 대비 +12% 증가
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">답변 완료</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">856</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              69% 답변률
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">활동 회원</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">543</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              +45명 신규 가입
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">인기 토론</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              245회 이상 조회
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 왼쪽 사이드바 - 필터 */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-6 sticky top-6">
              {/* 검색 */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="질문 검색..."
                    className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* 질문 유형 필터 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  질문 유형
                </h3>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: '전체', count: 1234 },
                    { id: 'question', label: '질문', count: 678 },
                    { id: 'discussion', label: '토론', count: 412 },
                    { id: 'announcement', label: '공지', count: 144 }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id as CommunityType)}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors text-left",
                        selectedType === type.id
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <span>{type.label}</span>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {type.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 회사 필터 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  관련 회사
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => setSelectedCompany('all')}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors text-left",
                      selectedCompany === 'all'
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    <span>전체 회사</span>
                  </button>
                  {companies.slice(0, 8).map((company) => (
                    <button
                      key={company.id}
                      onClick={() => setSelectedCompany(company.id)}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors text-left",
                        selectedCompany === company.id
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <span className="truncate">{company.name}</span>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded whitespace-nowrap">
                        {Math.floor(Math.random() * 50) + 10}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 업종 필터 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  업종
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => setSelectedIndustry('all')}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors text-left",
                      selectedIndustry === 'all'
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    <span>전체 업종</span>
                  </button>
                  {industries.map((industry) => (
                    <button
                      key={industry.id}
                      onClick={() => setSelectedIndustry(industry.id)}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors text-left",
                        selectedIndustry === industry.id
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <span>{industry.name}</span>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {industry.companyCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 정렬 옵션 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">정렬</h3>
                <div className="space-y-2">
                  {[
                    { id: 'latest', label: '최신순' },
                    { id: 'popular', label: '인기순' },
                    { id: 'answered', label: '답변완료순' }
                  ].map((sort) => (
                    <button
                      key={sort.id}
                      onClick={() => setSortBy(sort.id as SortBy)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 rounded-lg transition-colors text-left",
                        sortBy === sort.id
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <span>{sort.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="lg:w-3/4">
            {/* 질문하기 버튼 */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {searchTerm ? `"${searchTerm}" 검색 결과` : '최근 질문'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  총 {sortedQuestions.length}개의 질문이 있습니다
                </p>
              </div>
              <button
                onClick={() => setShowAskForm(!showAskForm)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                질문하기
              </button>
            </div>

            {/* 질문하기 폼 */}
            {showAskForm && <AskQuestionForm />}

            {/* 질문 목록 */}
            <div className="space-y-4">
              {sortedQuestions.length > 0 ? (
                sortedQuestions.map((question) => {
                  const company = companies.find(c => c.id === question.companyId)
                  
                  return (
                    <div
                      key={question.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 overflow-hidden hover:shadow-md dark:hover:shadow-gray-800 transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          {/* 왼쪽: 통계 */}
                          <div className="flex flex-col items-center gap-1 min-w-16">
                            <div className="text-center">
                              <div className="text-xl font-bold text-gray-900 dark:text-white">
                                {question.likeCount}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">추천</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-gray-900 dark:text-white">
                                {question.answerCount}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">답변</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-gray-900 dark:text-white">
                                {question.viewCount}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">조회</div>
                            </div>
                          </div>

                          {/* 중앙: 내용 */}
                          <div className="flex-1 min-w-0">
                            {/* 제목과 상태 */}
                            <div className="flex items-center gap-2 mb-2">
                              <Link 
                                to={`/companies/${question.companyId}`}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              >
                                {company?.name}
                                <ChevronRight className="w-3 h-3" />
                              </Link>
                              <span className={cn(
                                "px-2 py-1 rounded text-xs font-medium",
                                question.type === 'question'
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                  : question.type === 'discussion'
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                  : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                              )}>
                                {question.type === 'question' ? '질문' : 
                                 question.type === 'discussion' ? '토론' : '공지'}
                              </span>
                              {question.isOfficial && (
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                                  공식 답변
                                </span>
                              )}
                              {question.isAnswered && (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                                  답변 완료
                                </span>
                              )}
                            </div>

                            {/* 제목 */}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                              {question.title}
                            </h3>

                            {/* 내용 미리보기 */}
                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {truncateText(question.content, 200)}
                            </p>

                            {/* 태그 */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {question.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                                >
                                  <Tag className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* 작성자 정보 */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm">
                                    {question.author.avatar ? (
                                      <img src={question.author.avatar} alt={question.author.name} className="w-full h-full rounded-full" />
                                    ) : (
                                      question.author.name.charAt(0)
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {question.author.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {question.author.role} · {formatRelativeTime(question.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <button className="inline-flex items-center gap-2 px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">
                                답변하기
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    검색 결과가 없습니다
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    다른 검색어로 시도해 보거나, 첫 번째 질문을 등록해 보세요!
                  </p>
                  <button
                    onClick={() => setShowAskForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    첫 질문 등록하기
                  </button>
                </div>
              )}
            </div>

            {/* 페이지네이션 */}
            {sortedQuestions.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-1">
                  <button className="px-3 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    이전
                  </button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className={cn(
                        "px-3 py-2 border dark:border-gray-600 rounded-lg transition-colors",
                        page === 1
                          ? "bg-blue-600 text-white border-blue-600"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <button className="px-3 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    다음
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityPage