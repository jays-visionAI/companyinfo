import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import useDataStore from '../store/dataStore'
import { CommunityPostSortBy } from '../types'

const CommunityPage = () => {
  const {
    filteredCommunityPosts,
    communityFilters,
    communitySortBy,
    communitySortOrder,
    communityPagination,
    setCommunityFilters,
    setCommunitySort,
    applyCommunityFiltersAndSort,
    addPost,
    companies,
    getCompanyById,
  } = useDataStore()

  const [showAskForm, setShowAskForm] = useState(false)

  useEffect(() => {
    applyCommunityFiltersAndSort()
  }, [communityFilters, communitySortBy, communitySortOrder, applyCommunityFiltersAndSort])

  const handleFilterChange = (filters: Partial<typeof communityFilters>) => {
    setCommunityFilters(filters)
  }

  const handleSortChange = (sortBy: CommunityPostSortBy) => {
    setCommunitySort(sortBy, communitySortOrder === 'asc' ? 'desc' : 'asc')
  }

  // 질문하기 폼 컴포넌트
  const AskQuestionForm = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [companyId, setCompanyId] = useState('')
    const [tags, setTags] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!title || !content || !companyId) {
        alert('제목, 내용, 관련 회사를 모두 입력해주세요.')
        return
      }
      addPost({
        title,
        content,
        company_id: companyId,
        tags: tags.split(',').map((tag: string) => tag.trim()),
        post_type: 'question',
        is_pinned: false,
        is_resolved: false,
        view_count: 0,
        like_count: 0,
        updated_at: new Date().toISOString(),
      })
      setShowAskForm(false)
      setTitle('')
      setContent('')
      setCompanyId('')
      setTags('')
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">질문하기</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="질문의 제목을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              내용
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
              placeholder="자세한 내용을 입력하세요"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                관련 회사
              </label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              >
                <option value="">회사를 선택하세요</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                태그 (쉼표로 구분)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="예: 신약개발, 바이오, 임상시험"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAskForm(false)}
              className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              취소
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              질문 등록
            </button>
          </div>
        </form>
      </div>
    )
  }

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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{communityPagination.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
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
                    value={communityFilters.searchTerm || ''}
                    onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
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
                    { id: 'all', label: '전체' },
                    { id: 'question', label: '질문' },
                    { id: 'discussion', label: '토론' },
                    { id: 'announcement', label: '공지' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleFilterChange({ postType: type.id as any })}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors text-left",
                        communityFilters.postType === type.id
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <span>{type.label}</span>
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
                    onClick={() => handleFilterChange({ companyId: undefined })}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors text-left",
                      !communityFilters.companyId
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    <span>전체 회사</span>
                  </button>
                  {companies.slice(0, 10).map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleFilterChange({ companyId: company.id })}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors text-left",
                        communityFilters.companyId === company.id
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <span className="truncate">{company.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 업종 필터 - industries를 사용한 필터링은 실제로 지원되지 않으므로 제거 */}
              {/* 정렬 옵션 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">정렬</h3>
                <div className="space-y-2">
                  {[
                    { id: 'created_at', label: '최신순' },
                    { id: 'like_count', label: '인기순' },
                    { id: 'comments', label: '답변순' }
                  ].map((sort) => (
                    <button
                      key={sort.id}
                      onClick={() => handleSortChange(sort.id as CommunityPostSortBy)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 rounded-lg transition-colors text-left",
                        communitySortBy === sort.id
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
                  {communityFilters.searchTerm ? `"${communityFilters.searchTerm}" 검색 결과` : '최근 질문'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  총 {communityPagination.total}개의 질문이 있습니다
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
              {filteredCommunityPosts.length > 0 ? (
                filteredCommunityPosts.map((post) => {
                  const company = getCompanyById(post.company_id || '')
                  
                  return (
                    <div
                      key={post.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 overflow-hidden hover:shadow-md dark:hover:shadow-gray-800 transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          {/* 왼쪽: 통계 */}
                          <div className="flex flex-col items-center gap-1 min-w-16">
                            <div className="text-center">
                              <div className="text-xl font-bold text-gray-900 dark:text-white">
                                {post.likes || post.like_count}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">추천</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-gray-900 dark:text-white">
                                {post.comments.length}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">답변</div>
                            </div>
                          </div>

                          {/* 중앙: 내용 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              {post.company_id && (
                                <Link 
                                  to={`/companies/${post.company_id}`}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                  {company?.name || '알 수 없음'}
                                  <ChevronRight className="w-3 h-3" />
                                </Link>
                              )}
                              <span className={cn(
                                "px-2 py-1 rounded text-xs font-medium",
                                post.post_type === 'question'
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                  : post.post_type === 'discussion'
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                  : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                              )}>
                                {post.post_type === 'question' ? '질문' : 
                                 post.post_type === 'discussion' ? '토론' : '공지'}
                              </span>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              <Link to={`/community/${post.id}`}>{post.title}</Link>
                            </h3>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {truncateText(post.content, 150)}
                            </p>

                            <div className="flex items-center gap-2 flex-wrap">
                              {post.tags.map((tag: string) => (
                                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                                  <Tag className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* 오른쪽: 작성자 정보 */}
                          <div className="flex-shrink-0 w-24 text-right">
                            <div className="flex items-center justify-end gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{post.author_name}</span>
                              {post.author_avatar && (
                                <img
                                  src={post.author_avatar}
                                  alt={post.author_name || ''}
                                  className="w-6 h-6 rounded-full"
                                />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatRelativeTime(new Date(post.created_at))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <MessageSquare className="mx-auto w-12 h-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                    게시글이 없습니다
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    필터 조건을 변경하거나 새로운 질문을 등록해보세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityPage

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 7) {
    return date.toLocaleDateString('ko-KR');
  } else if (diffDays > 0) {
    return `${diffDays}일 전`;
  } else if (diffHours > 0) {
    return `${diffHours}시간 전`;
  } else if (diffMins > 0) {
    return `${diffMins}분 전`;
  } else {
    return '방금 전';
  }
}
