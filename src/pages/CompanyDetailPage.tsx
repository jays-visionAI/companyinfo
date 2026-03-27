import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Building2, 
  Calendar, 
  Users, 
  TrendingUp, 
  MapPin, 
  Globe, 
  FileText, 
  BarChart3,
  Target,
  Users2,
  Download,
  Eye,
  MessageSquare,
  Share2,
  Bookmark
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { companies, industries } from '../data/sampleData'
import { formatCurrency, formatNumber, formatDate, cn, getInvestmentStageColor } from '../lib/utils'

const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'documents' | 'community'>('overview')

  // 회사 데이터 찾기
  const company = companies.find(c => c.id === id)
  
  // 업종 정보 찾기
  const industry = company ? industries.find(ind => ind.id === company.industryId) : null

  if (!company || !industry) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">회사를 찾을 수 없습니다</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">요청하신 회사 정보가 존재하지 않습니다.</p>
          <Link
            to="/companies"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            회사 목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  // 샘플 재무 데이터 (실제로는 API에서 가져와야 함)
  const financialData = [
    { year: 2020, revenue: company.revenue * 0.6, profit: company.revenue * 0.15, growth: 25 },
    { year: 2021, revenue: company.revenue * 0.8, profit: company.revenue * 0.18, growth: 33 },
    { year: 2022, revenue: company.revenue * 0.95, profit: company.revenue * 0.2, growth: 19 },
    { year: 2023, revenue: company.revenue, profit: company.revenue * 0.22, growth: 12 },
  ]

  // 시장 포지셔닝 데이터
  const marketPositionData = [
    { name: '시장 점유율', value: 15 },
    { name: '성장 잠재력', value: 85 },
    { name: '기술 경쟁력', value: 92 },
    { name: '브랜드 인지도', value: 45 },
  ]

  // 경쟁사 비교 데이터
  const competitorData = [
    { name: company.name, marketShare: 15, growth: 12, profitMargin: 22 },
    { name: '경쟁사 A', marketShare: 25, growth: 8, profitMargin: 18 },
    { name: '경쟁사 B', marketShare: 20, growth: 10, profitMargin: 20 },
    { name: '경쟁사 C', marketShare: 18, growth: 15, profitMargin: 25 },
  ]

  // 샘플 문서 데이터
  const documents = [
    { id: 'doc1', title: '2023년 연간 보고서', type: 'annual_report', date: '2023-12-15', size: '2.4MB' },
    { id: 'doc2', title: '2023년 4분기 재무제표', type: 'financial_statement', date: '2024-01-20', size: '1.8MB' },
    { id: 'doc3', title: '투자자 프리젠테이션', type: 'investor_presentation', date: '2023-11-30', size: '5.2MB' },
    { id: 'doc4', title: '사업 계획서', type: 'business_plan', date: '2023-10-15', size: '3.1MB' },
  ]

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd']

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 섹션 */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="w-12 h-12 rounded" />
                ) : (
                  <Building2 className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {company.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                    {industry.name}
                  </span>
                  <span className={cn("px-3 py-1 rounded-full text-sm font-medium", getInvestmentStageColor(company.investmentStage))}>
                    {company.investmentStage}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Bookmark className="w-4 h-4" />
                관심 기업 추가
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Share2 className="w-4 h-4" />
                공유하기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 왼쪽 사이드바 - 기본 정보 */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">기본 정보</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">회사명</p>
                    <p className="font-medium text-gray-900 dark:text-white">{company.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">업종</p>
                    <p className="font-medium text-gray-900 dark:text-white">{industry.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">설립년도</p>
                    <p className="font-medium text-gray-900 dark:text-white">{company.foundedYear}년</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">직원수</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatNumber(company.employeeCount)}명</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">연간 매출</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(company.revenue)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">위치</p>
                    <p className="font-medium text-gray-900 dark:text-white">{company.location}</p>
                  </div>
                </div>

                {company.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">웹사이트</p>
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {company.website.replace('https://', '')}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Users2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">대표이사</p>
                    <p className="font-medium text-gray-900 dark:text-white">{company.ceoName}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">회사 설명</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {company.description}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">마켓 포지셔닝</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {company.marketPosition || '마켓 포지셔닝 정보가 없습니다.'}
                </p>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="lg:w-2/3">
            {/* 탭 네비게이션 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 mb-6">
              <div className="border-b dark:border-gray-700">
                <nav className="flex space-x-1 px-6">
                  {[
                    { id: 'overview', label: '개요', icon: BarChart3 },
                    { id: 'financial', label: '재무 정보', icon: TrendingUp },
                    { id: 'documents', label: '문서', icon: FileText },
                    { id: 'community', label: '커뮤니티', icon: MessageSquare },
                  ].map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                          activeTab === tab.id
                            ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </div>

              <div className="p-6">
                {/* 개요 탭 */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* 재무 성장 차트 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">매출 성장 추이</h3>
                      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={financialData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="year" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" tickFormatter={(value) => `${value}억`} />
                            <Tooltip formatter={(value) => [`${value}억 원`, '매출']} />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="revenue" 
                              name="매출액" 
                              stroke="#2563eb" 
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="profit" 
                              name="영업이익" 
                              stroke="#10b981" 
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* 시장 포지셔닝 차트 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">시장 포지셔닝</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={marketPositionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {marketPositionData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value}점`, '점수']} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">경쟁사 비교</h4>
                          <div className="space-y-3">
                            {competitorData.map((competitor, index) => (
                              <div key={competitor.name} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {competitor.name}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {competitor.marketShare}% 점유율
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 dark:text-gray-400">성장률</span>
                                    <span className={cn(
                                      "font-medium",
                                      competitor.growth > 10 ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"
                                    )}>
                                      {competitor.growth}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 dark:text-gray-400">이익률</span>
                                    <span className="font-medium text-blue-600 dark:text-blue-400">
                                      {competitor.profitMargin}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 경쟁사 분석 */}
                    {company.competitorAnalysis && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">경쟁사 분석</h3>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {company.competitorAnalysis}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 재무 정보 탭 */}
                {activeTab === 'financial' && (
                  <div className="space-y-8">
                    {/* 재무 요약 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">연간 매출</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(company.revenue)}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          전년 대비 +12% 증가
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">영업이익률</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">22%</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          업계 평균보다 5% 높음
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">성장률</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">35%</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          CAGR (3년 평균)
                        </p>
                      </div>
                    </div>

                    {/* 재무 성장 차트 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">재무 성장 추이</h3>
                      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
                        <ResponsiveContainer width="100%" height={350}>
                          <BarChart data={financialData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="year" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" tickFormatter={(value) => `${value}억`} />
                            <Tooltip formatter={(value) => [`${value}억 원`, '금액']} />
                            <Legend />
                            <Bar name="매출액" dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                            <Bar name="영업이익" dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* 재무 상세 테이블 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">재무 상세 정보</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800">
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b dark:border-gray-700">
                                항목
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b dark:border-gray-700">
                                2023년
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b dark:border-gray-700">
                                2022년
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b dark:border-gray-700">
                                변동률
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <tr>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">매출액</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                {formatCurrency(company.revenue)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                {formatCurrency(company.revenue * 0.95)}
                              </td>
                              <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400 font-medium">
                                +12%
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">영업이익</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                {formatCurrency(company.revenue * 0.22)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                {formatCurrency(company.revenue * 0.2)}
                              </td>
                              <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400 font-medium">
                                +10%
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">자산 총계</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                {formatCurrency(company.revenue * 3)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                {formatCurrency(company.revenue * 2.7)}
                              </td>
                              <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400 font-medium">
                                +11%
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">부채 총계</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                {formatCurrency(company.revenue * 1.2)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                {formatCurrency(company.revenue * 1.1)}
                              </td>
                              <td className="px-4 py-3 text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                                +9%
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 문서 탭 */}
                {activeTab === 'documents' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">회사 문서</h3>
                      <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        문서 제출하기
                      </button>
                    </div>

                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {doc.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                  {doc.type === 'annual_report' ? '연간 보고서' : 
                                   doc.type === 'financial_statement' ? '재무제표' : 
                                   doc.type === 'investor_presentation' ? '투자자 프리젠테이션' : 
                                   '사업 계획서'}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(doc.date)} · {doc.size}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        회사 문서는 투자 의사결정을 돕기 위한 참고 자료입니다. 
                        정확한 정보를 위해서는 공식 발행 자료를 참조하시기 바랍니다.
                      </p>
                    </div>
                  </div>
                )}

                {/* 커뮤니티 탭 */}
                {activeTab === 'community' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">커뮤니티 질문</h3>
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        질문하기
                      </button>
                    </div>

                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                              U{i}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {company.name}의 투자 전망에 대해 어떻게 생각하시나요?
                                  </h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    익명의 투자자 · {i}시간 전
                                  </p>
                                </div>
                                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                                  답변 완료
                                </span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                                최근 시장 변화에 따라 {company.name}의 성장 전망이 궁금합니다. 
                                특히 {industry.name} 산업에서의 경쟁력이 어떠한지 전문가 분들의 의견이 필요합니다.
                              </p>
                              
                              <div className="mt-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white text-xs">
                                    C{i}
                                  </div>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {company.name} 담당자
                                  </span>
                                  <span className="text-xs text-blue-600 dark:text-blue-400 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded">
                                    공식 답변
                                  </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                  안녕하세요, {company.name} 담당자입니다. 
                                  저희 회사는 현재 {company.marketPosition?.split('시장')[0]} 시장에서 지속적인 성장을 이어가고 있습니다. 
                                  올해는 {company.foundedYear + 5}년까지 매출 성장률 30% 목표를 가지고 있으며, 
                                  신규 사업 다각화를 통해 안정적인 성장 기반을 마련하고 있습니다.
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                  {i}일 전 · {i}개의 답변
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center">
                      <button className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        더 많은 질문 보기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDetailPage