import React, { useState, useEffect, useRef } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
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
import useDataStore from '../store/dataStore'

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const navigate = useNavigate()
  const location = useLocation()
  const { user, userRole, isAuthenticated, isLoading, signOut } = useAuthStore()
  const { setSearchTerm } = useDataStore()

  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  // Handle search query changes
  useEffect(() => {
    // Debounce search term update
    const handler = setTimeout(() => {
      setSearchTerm(searchQuery)
      if (searchQuery && location.pathname !== '/companies') {
        navigate('/companies')
      }
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery, setSearchTerm, navigate, location.pathname])

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [notificationRef])


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
    return null // Redirecting
  }

  const navigation = [
    { name: '대시보드', href: '/dashboard', icon: LayoutDashboard },
    { name: '회사 목록', href: '/companies', icon: Building2 },
    { name: '커뮤니티', href: '/community', icon: Users },
  ]

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
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b dark:border-gray-700">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">기업정보</span>
            </div>
          </div>

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

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
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
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t dark:border-gray-700">
            <div className="space-y-1">
              {userNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => cn(
                    "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
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

      <div className="lg:pl-64 flex flex-col">
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center lg:hidden">
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <span className="sr-only">메뉴 열기</span>
                  {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>

              <div className="flex-1 max-w-2xl mx-4 hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="회사 검색..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 ml-auto">
                <ThemeToggle />
                
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="sr-only">알림 보기</span>
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                  </button>
                  
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white border-b dark:border-gray-700">
                          알림
                        </div>
                        <div className="py-2">
                          <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="flex-shrink-0 mr-3">
                              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                                <Building2 className="h-5 w-5" />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">새로운 회사 등록</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">15분 전</p>
                            </div>
                          </a>
                          <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="flex-shrink-0 mr-3">
                              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                <MessageSquare className="h-5 w-5" />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">새로운 답변이 달렸습니다</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">1시간 전</p>
                            </div>
                          </a>
                        </div>
                        <div className="px-4 py-2 border-t dark:border-gray-700">
                          <a href="#" className="block text-center text-sm font-medium text-primary hover:underline">
                            모든 알림 보기
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
