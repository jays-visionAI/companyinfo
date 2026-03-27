import React from 'react'
import { Link } from 'react-router-dom'
import { 
  TrendingUp, 
  Building2, 
  Users, 
  FileText, 
  BarChart3, 
  ArrowUpRight,
  Search,
  Filter
} from 'lucide-react'
import { cn, formatCurrency, formatNumber } from '../lib/utils'
import { allCompanies, industries, communityPosts } from '../data/sampleData'

const DashboardPage: React.FC = () => {
  const totalCompanies = allCompanies.length
  const totalRevenue = allCompanies.reduce((sum, company) => sum + company.revenue, 0)
  const totalEmployees = allCompanies.reduce((sum, company) => sum + company.employeeCount, 0)
  const recentCompanies = [...allCompanies]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
  
  const popularIndustries = [...industries]
    .sort((a, b) => b.companyCount - a.companyCount)
    .slice(0, 4)

  const recentPosts = [...communityPosts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600">비상장주식 플랫폼 주요 현황 및 통계</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">등록 회사</p>
              <p className="text-2xl font-bold text-gray-900">{totalCompanies}개</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>지난달 대비 +5% 증가</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">총 매출액</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>전년 대비 +42% 성장</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">총 직원수</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(totalEmployees)}명</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>전월 대비 +8% 증가</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">활성 토론</p>
              <p className="text-2xl font-bold text-gray-900">{communityPosts.length}개</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>일일 평균 12개 등록</span>
          </div>
        </div>
      </div>

      {/* 주요 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 인기 업종 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 최근 등록 회사 */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">최근 등록 회사</h2>
                <Link to="/companies" className="text-sm text-primary hover:text-primary/80 font-medium">
                  전체 보기 →
                </Link>
              </div>
            </div>
            <div className="divide-y">
              {recentCompanies.map((company) => {
                const industry = industries.find(ind => ind.id === company.industryId)
                return (
                  <Link
                    key={company.id}
                    to={`/companies/${company.id}`}
                    className="block p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{company.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-500">{industry?.name}</span>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                              {company.investmentStage}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(company.revenue)}</p>
                        <p className="text-sm text-gray-500">{company.employeeCount}명</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* 빠른 검색 */}
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-white mb-4">빠른 회사 검색</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/80" />
              </div>
              <input
                type="search"
                className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                placeholder="회사명, 업종, 대표자명으로 검색..."
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                  <Filter className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {popularIndustries.map((industry) => (
                <button
                  key={industry.id}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white transition-colors"
                >
                  {industry.name} ({industry.companyCount})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽 사이드바 */}
        <div className="space-y-6">
          {/* 인기 업종 통계 */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">인기 업종 분포</h2>
            <div className="space-y-4">
              {popularIndustries.map((industry) => (
                <div key={industry.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{industry.name}</span>
                    <span className="text-gray-500">{industry.companyCount}개 회사</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(industry.companyCount / totalCompanies) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 토론 */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">최근 커뮤니티</h2>
                <Link to="/community" className="text-sm text-primary hover:text-primary/80 font-medium">
                  모두 보기 →
                </Link>
              </div>
            </div>
            <div className="divide-y">
              {recentPosts.map((post) => {
                const company = allCompanies.find(c => c.id === post.companyId)
                return (
                  <Link
                    key={post.id}
                    to={`/community`}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                        post.type === 'question' ? 'bg-blue-100' : 
                        post.type === 'announcement' ? 'bg-green-100' : 'bg-gray-100'
                      )}>
                        {post.type === 'question' && <FileText className="h-4 w-4 text-blue-600" />}
                        {post.type === 'announcement' && <BarChart3 className="h-4 w-4 text-green-600" />}
                        {post.type === 'discussion' && <Users className="h-4 w-4 text-gray-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {company?.name} • {post.viewCount} views • {post.likeCount} likes
                        </p>
                      </div>
                      {post.isAnswered && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          답변 완료
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* 투자 단계 분포 */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">투자 단계별 분포</h2>
            <div className="space-y-3">
              {['SEED', 'Series A', 'Series B', 'Series C', 'Series D+', 'IPO 준비'].map((stage) => {
                const count = allCompanies.filter(c => c.investmentStage === stage).length
                const percentage = totalCompanies > 0 ? (count / totalCompanies) * 100 : 0
                return (
                  <div key={stage} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{stage}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-10 text-right">
                        {count}개
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage