import { useState } from 'react'
import {
  Users,
  Building2,
  FileText,
  Bell,
  Settings,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  UserPlus,
  Building,
  FilePlus,
  BellRing,
  Activity,
  CheckCircle,
  XCircle,
  MoreVertical,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { formatDate, cn } from '../lib/utils'
import { DashboardStat, AdminActivityLog, RecentUser, TrafficData } from '../types'

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // 샘플 데이터 - 실제로는 API에서 가져와야 함
  const dashboardStats: DashboardStat[] = [
    {
      title: '전체 유저',
      value: 1245,
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: '등록된 회사',
      value: 89,
      change: '+5%',
      icon: Building2,
      color: 'bg-green-500'
    },
    {
      title: '업로드 문서',
      value: 156,
      change: '+23%',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      title: '활동 알림',
      value: 42,
      change: '-8%',
      icon: Bell,
      color: 'bg-orange-500'
    }
  ]

  // 활동 로그 데이터
  const activityLogs: AdminActivityLog[] = [
    {
      id: 1,
      user: '김관리자',
      action: '회사 정보 수정',
      target: '테크노바이오(주)',
      time: '10분 전',
      status: 'success'
    },
    {
      id: 2,
      user: '이담당자',
      action: '문서 업로드',
      target: '2023년 연간 보고서',
      time: '30분 전',
      status: 'success'
    },
    {
      id: 3,
      user: '박관리자',
      action: '유저 계정 차단',
      target: 'spammer123',
      time: '1시간 전',
      status: 'success'
    },
    {
      id: 4,
      user: '시스템',
      action: '자동 백업',
      target: '데이터베이스',
      time: '2시간 전',
      status: 'success'
    },
    {
      id: 5,
      user: '최담당자',
      action: '공지사항 등록',
      target: '서비스 점검 안내',
      time: '3시간 전',
      status: 'success'
    }
  ]

  // 최근 가입 유저
  const recentUsers: RecentUser[] = [
    {
      id: 1,
      name: '홍길동',
      email: 'hong@example.com',
      role: '투자자',
      joinDate: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: '김영희',
      email: 'kim@example.com',
      role: '분석가',
      joinDate: '2024-01-14',
      status: 'active'
    },
    {
      id: 3,
      name: '이철수',
      email: 'lee@example.com',
      role: '회사담당자',
      joinDate: '2024-01-13',
      status: 'pending'
    },
    {
      id: 4,
      name: '박지성',
      email: 'park@example.com',
      role: '관리자',
      joinDate: '2024-01-12',
      status: 'active'
    },
    {
      id: 5,
      name: '정민수',
      email: 'jung@example.com',
      role: '투자자',
      joinDate: '2024-01-11',
      status: 'suspended'
    }
  ]

  // 웹사이트 트래픽 데이터
  const trafficData: TrafficData[] = [
    { date: '1월 10일', visitors: 2345, pageviews: 5678 },
    { date: '1월 11일', visitors: 2567, pageviews: 6123 },
    { date: '1월 12일', visitors: 2789, pageviews: 6543 },
    { date: '1월 13일', visitors: 2456, pageviews: 5890 },
    { date: '1월 14일', visitors: 2678, pageviews: 6234 },
    { date: '1월 15일', visitors: 2890, pageviews: 6789 },
    { date: '1월 16일', visitors: 3012, pageviews: 7123 }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">관리자 대시보드</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                비상장주식 플랫폼 관리자 전용 페이지
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-64"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* 대시보드 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.color} rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={cn(
                    "text-sm font-medium px-2 py-1 rounded",
                    stat.change.startsWith('+') 
                      ? "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
                      : "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30"
                  )}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {stat.title}
                </p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 트래픽 차트 */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">웹사이트 트래픽</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">최근 7일간 방문자 통계</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  7일
                </button>
                <button className="px-3 py-1 text-sm border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  30일
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  다운로드
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="visitors" 
                    name="방문자수" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pageviews" 
                    name="페이지뷰" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 활동 로그 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">최근 활동</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">시스템 활동 로그</p>
              </div>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                모두 보기
              </button>
            </div>
            <div className="space-y-4">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {log.user}
                          <span className="text-gray-600 dark:text-gray-400 font-normal ml-2">
                            {log.action}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {log.target}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {log.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 최근 가입 유저 테이블 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">최근 가입 유저</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">가장 최근에 가입한 유저 목록</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                필터
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                유저 추가
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    유저
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    역할
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    가입일
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {formatDate(user.joinDate)}
                    </td>
                    <td className="px-4 py-3">
                      {user.status === 'active' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                          <CheckCircle className="w-3 h-3" />
                          활성
                        </span>
                      )}
                      {user.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
                          <Eye className="w-3 h-3" />
                          승인 대기
                        </span>
                      )}
                      {user.status === 'suspended' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm">
                          <XCircle className="w-3 h-3" />
                          정지됨
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 퀵 액션 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">퀵 액션</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center p-6 border dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50">
                <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white">유저 추가</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">새 유저 계정 생성</p>
            </button>
            <button className="flex flex-col items-center justify-center p-6 border dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mb-3 group-hover:bg-green-200 dark:group-hover:bg-green-800/50">
                <Building className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white">회사 등록</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">새 회사 정보 추가</p>
            </button>
            <button className="flex flex-col items-center justify-center p-6 border dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50">
                <FilePlus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white">문서 업로드</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">공식 문서 게시</p>
            </button>
            <button className="flex flex-col items-center justify-center p-6 border dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg mb-3 group-hover:bg-orange-200 dark:group-hover:bg-orange-800/50">
                <BellRing className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white">공지 등록</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">새 공지사항 작성</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
