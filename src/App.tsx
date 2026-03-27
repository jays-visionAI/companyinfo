import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { useEffect } from 'react'
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
  useEffect(() => {
    // 인증 및 데이터 초기화
    initializeAuth()
    initializeData()
  }, [])

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* 보호된 라우트 */}
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
      </Router>
    </ThemeProvider>
  )
}

export default App