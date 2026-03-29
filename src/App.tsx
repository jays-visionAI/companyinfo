import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { initializeAuth } from './store/authStore'
import { initializeData } from './store/dataStore'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import CompaniesPage from './pages/CompaniesPage'
import CompanyDetailPage from './pages/CompanyDetailPage'
import CommunityPage from './pages/CommunityPage'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const safeInitialize = async () => {
      try {
        await Promise.race([
          initializeAuth(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('인증 초기화 타임아웃')), 3000)
          )
        ])
      } catch (error) {
        console.log('인증 초기화 실패, 샘플 모드로 계속 진행:', error)
      }

      try {
        await Promise.race([
          Promise.resolve(initializeData()),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('데이터 초기화 타임아웃')), 2000)
          )
        ])
      } catch (error) {
        console.log('데이터 초기화 실패, 샘플 데이터로 계속 진행:', error)
      }

      setInitialized(true)
    }

    safeInitialize()
  }, [])

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">비상장주식 정보 플랫폼</h2>
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="companies/:id" element={<CompanyDetailPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}

export default App
