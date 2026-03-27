import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  UserCircle,
  Menu,
  X,
  MessageSquare,
  FileText,
  LogOut
} from 'lucide-react'
import { cn } from '../lib/utils'
import { ThemeToggle } from './ThemeToggle'
import { useAuthStore } from '../store/authStore'

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { user, userRole, isAuthenticated, isLoading, signOut } = useAuthStore()

  useEffect(() => {
    // 인증되지 않은 사용자는 로그인 페이지로 리디렉션
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // 리디렉션 중
  }

  const navigation = [
    { name: '대시보드', href: '/dashboard', icon: LayoutDashboard },
    { name: '회사 목록', href: '/companies', icon: Building2 },
    { name: '커뮤니티', href: '/community', icon: Users },
  ]

  // 관리자만 관리자 페이지 접근 가능
  if (userRole === 'admin') {
    navigation.push({ name: '관리자', href: '/admin', icon: Settings })
  }

  const userNavigation = [
    { name: '프로필', href: '/profile', icon: UserCircle },
    { name: '메시지', href: '/messages', icon: MessageSquare },
    { name: '문의하기', href: '/inquiry', icon: FileText },
  ]

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const roleLabels = {
    user: { label: '일반 사용자', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    company_rep: { label: '회사 담당자', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    admin: { label: '관리자', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
  }

  const roleInfo = roleLabels[userRole as keyof typeof roleLabels] || roleLabels.user

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">비상장주식 플랫폼</span>
            </div>
          </div>

          {/* User profile */}
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.user_metadata?.fullName || user?.email?.split('@')[0] || '사용자'}
                </p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* Main navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>

          {/* User navigation */}
          <div className="p-4 border-t dark:border-gray-700">
            <div className="space-y-1">
              {userNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href)
                      setSidebarOpen(false)
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </button>
                )
              })}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side - Mobile menu button */}
              <div className="flex items-center lg:hidden">
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <span className="sr-only">메뉴 열기</span>
                  {sidebarOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>

              {/* Center - Search */}
              <div className="flex-1 max-w-2xl mx-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="회사명, 업종, 대표자명 검색..."
                  />
                </div>
              </div>

              {/* Right side - Notifications and user */}
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                
                <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => navigate('/profile')}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle className="h-5 w-5 text-primary" />
                    </div>
                    <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.user_metadata?.fullName || user?.email?.split('@')[0] || '사용자'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout