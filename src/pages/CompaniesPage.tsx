import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Grid3x3, 
  List, 
  Building2, 
  Users, 
  TrendingUp,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn, formatCurrency, formatNumber, getInvestmentStageColor } from '../lib/utils'
import { allCompanies, industries, searchCompanies, sortCompaniesByRevenue } from '../data/sampleData'
import type { Company, InvestmentStage, CompanySortBy, SortOrder } from '../types'

const CompaniesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all')
  const [selectedStage, setSelectedStage] = useState<InvestmentStage | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<CompanySortBy>('revenue')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(allCompanies)

  const itemsPerPage = 20

  // 필터링 및 정렬 적용
  useEffect(() => {
    let result = [...allCompanies]

    // 검색 적용
    if (searchQuery.trim()) {
      result = searchCompanies(searchQuery)
    }

    // 업종 필터 적용
    if (selectedIndustry !== 'all') {
      result = result.filter(company => company.industryId === selectedIndustry)
    }

    // 투자 단계 필터 적용
    if (selectedStage !== 'all') {
      result = result.filter(company => company.investmentStage === selectedStage)
    }

    // 정렬 적용
    result.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'revenue':
          aValue = a.revenue
          bValue = b.revenue
          break
        case 'employeeCount':
          aValue = a.employeeCount
          bValue = b.employeeCount
          break
        case 'foundedYear':
          aValue = a.foundedYear
          bValue = b.foundedYear
          break
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        default:
          aValue = a.revenue
          bValue = b.revenue
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

    setFilteredCompanies(result)
    setCurrentPage(1) // 필터 변경 시 페이지 초기화
  }, [searchQuery, selectedIndustry, selectedStage, sortBy, sortOrder])

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex)

  // 정렬 헤더 클릭 핸들러
  const handleSortClick = (field: CompanySortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  // 투자 단계 옵션
  const investmentStages: (InvestmentStage | 'all')[] = [
    'all', 'SEED', 'Series A', 'Series B', 'Series C', 'Series D+', 'IPO 준비'
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">회사 목록</h1>
        <p className="text-gray-600">비상장주식 회사 정보를 업종별로 탐색하세요</p>
      </div>

      {/* 필터 및 검색 영역 */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="space-y-4">
          {/* 검색 바 */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="회사명, 대표자명, 업종으로 검색..."
            />
          </div>

          {/* 필터 영역 */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap gap-3">
              {/* 업종 필터 */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">업종:</span>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">모든 업종</option>
                  {industries.map((industry) => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name} ({industry.companyCount})
                    </option>
                  ))}
                </select>
              </div>

              {/* 투자 단계 필터 */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">투자단계:</span>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value as InvestmentStage | 'all')}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {investmentStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage === 'all' ? '모든 단계' : stage}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 뷰 모드 및 정렬 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  )}
                >
                  <Grid3x3 className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  )}
                >
                  <List className="h-5 w-5 text-gray-700" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">정렬:</span>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-') as [CompanySortBy, SortOrder]
                    setSortBy(field)
                    setSortOrder(order)
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="revenue-desc">매출 높은 순</option>
                  <option value="revenue-asc">매출 낮은 순</option>
                  <option value="employeeCount-desc">직원수 많은 순</option>
                  <option value="employeeCount-asc">직원수 적은 순</option>
                  <option value="foundedYear-desc">최근 설립 순</option>
                  <option value="foundedYear-asc">오래된 설립 순</option>
                  <option value="name-asc">회사명 가나다순</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 결과 요약 */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          총 <span className="font-semibold text-gray-900">{filteredCompanies.length}</span>개 회사
          {selectedIndustry !== 'all' && (
            <span className="ml-2">
              • {industries.find(i => i.id === selectedIndustry)?.name} 업종
            </span>
          )}
          {selectedStage !== 'all' && (
            <span className="ml-2">• {selectedStage} 단계</span>
          )}
        </p>
        <p className="text-gray-600">
          페이지 <span className="font-semibold">{currentPage}</span> / <span className="font-semibold">{totalPages}</span>
        </p>
      </div>

      {/* 회사 목록 */}
      {viewMode === 'grid' ? (
        // 그리드 뷰
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentCompanies.map((company) => {
            const industry = industries.find(ind => ind.id === company.industryId)
            return (
              <Link
                key={company.id}
                to={`/companies/${company.id}`}
                className="bg-white rounded-xl shadow-sm border hover:shadow-lg hover:-translate-y-1 transition-all duration-200 card-hover"
              >
                <div className="p-6">
                  {/* 회사 헤더 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-gray-600" />
                    </div>
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      getInvestmentStageColor(company.investmentStage)
                    )}>
                      {company.investmentStage}
                    </span>
                  </div>

                  {/* 회사 정보 */}
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{company.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{company.description}</p>

                  {/* 업종 */}
                  <div className="mb-4">
                    <span className="text-xs font-medium text-gray-500">업종</span>
                    <p className="text-sm font-medium text-gray-900">{industry?.name}</p>
                  </div>

                  {/* 정보 그리드 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        매출
                      </div>
                      <p className="font-semibold text-gray-900">{formatCurrency(company.revenue)}</p>
                    </div>
                    <div>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <Users className="h-4 w-4 mr-1" />
                        직원수
                      </div>
                      <p className="font-semibold text-gray-900">{formatNumber(company.employeeCount)}명</p>
                    </div>
                    <div>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        창업년도
                      </div>
                      <p className="font-semibold text-gray-900">{company.foundedYear}년</p>
                    </div>
                    <div>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <User className="h-4 w-4 mr-1" />
                        대표자
                      </div>
                      <p className="font-semibold text-gray-900 truncate">{company.ceoName}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        // 리스트 뷰 (테이블)
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    회사명
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortClick('revenue')}
                  >
                    <div className="flex items-center">
                      매출
                      {sortBy === 'revenue' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    업종
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortClick('foundedYear')}
                  >
                    <div className="flex items-center">
                      창업년도
                      {sortBy === 'foundedYear' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    대표자명
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortClick('employeeCount')}
                  >
                    <div className="flex items-center">
                      직원수
                      {sortBy === 'employeeCount' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    투자단계
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCompanies.map((company) => {
                  const industry = industries.find(ind => ind.id === company.industryId)
                  return (
                    <tr 
                      key={company.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => window.location.href = `/companies/${company.id}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                            <Building2 className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{company.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {company.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{formatCurrency(company.revenue)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{industry?.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{company.foundedYear}년</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{company.ceoName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatNumber(company.employeeCount)}명</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          getInvestmentStageColor(company.investmentStage)
                        )}>
                          {company.investmentStage}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border p-6">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>-
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredCompanies.length)}</span> of{' '}
            <span className="font-medium">{filteredCompanies.length}</span> 결과
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={cn(
                "p-2 rounded-lg border transition-colors",
                currentPage === 1 
                  ? "text-gray-400 border-gray-200 cursor-not-allowed" 
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    currentPage === pageNum
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {pageNum}
                </button>
              )
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={cn(
                "p-2 rounded-lg border transition-colors",
                currentPage === totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed" 
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompaniesPage