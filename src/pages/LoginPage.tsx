import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogIn, Mail, Lock, Eye, EyeOff, Building2, User } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { cn } from '../lib/utils'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, isLoading, isAuthenticated } = useAuthStore()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  
  // 추가 회원가입 필드
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'user' | 'company_rep'>('user')
  const [companyName, setCompanyName] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isSignUp) {
      // 회원가입 로직
      if (!fullName.trim()) {
        setError('이름을 입력해주세요.')
        return
      }
      
      if (role === 'company_rep' && !companyName.trim()) {
        setError('회사명을 입력해주세요.')
        return
      }

      const userData = {
        fullName,
        role,
        companyName: role === 'company_rep' ? companyName : null
      }

      const result = await useAuthStore.getState().signUp(email, password, userData)
      if (result.success) {
        alert('회원가입이 완료되었습니다. 이메일을 확인해주세요.')
        setIsSignUp(false)
        setFullName('')
        setRole('user')
        setCompanyName('')
      } else {
        setError(result.error || '회원가입 중 오류가 발생했습니다.')
      }
    } else {
      // 로그인 로직
      const result = await signIn(email, password)
      if (!result.success) {
        setError(result.error || '로그인 중 오류가 발생했습니다.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 및 제목 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            비상장주식 정보 플랫폼
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isSignUp ? '새로운 계정을 생성하세요' : '계정에 로그인하세요'}
          </p>
        </div>

        {/* 폼 카드 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {isSignUp && (
              <>
                {/* 이름 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    이름
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="홍길동"
                      required
                    />
                  </div>
                </div>

                {/* 역할 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    역할 선택
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('user')}
                      className={cn(
                        "p-4 border rounded-lg text-center transition-colors",
                        role === 'user'
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      )}
                    >
                      <User className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">일반 사용자</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('company_rep')}
                      className={cn(
                        "p-4 border rounded-lg text-center transition-colors",
                        role === 'company_rep'
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      )}
                    >
                      <Building2 className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">회사 담당자</span>
                    </button>
                  </div>
                </div>

                {role === 'company_rep' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      회사명
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="pl-10 w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="회사명을 입력하세요"
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 이메일 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                이메일
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {!isSignUp && (
                <div className="mt-2 text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    비밀번호를 잊으셨나요?
                  </Link>
                </div>
              )}
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isSignUp ? '계정 생성 중...' : '로그인 중...'}
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {isSignUp ? '회원가입' : '로그인'}
                </>
              )}
            </button>

            {/* 모드 전환 */}
            <div className="text-center pt-4 border-t dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                {isSignUp ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError('')
                  }}
                  className="ml-2 text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  {isSignUp ? '로그인하기' : '회원가입하기'}
                </button>
              </p>
            </div>
          </form>

          {/* 서비스 설명 */}
          <div className="mt-8 pt-6 border-t dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              서비스 특징
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                비상장주식 정보 제공
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                회사별 상세 재무 정보
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                투자자 커뮤니티
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                전문가 Q&A
              </li>
            </ul>
          </div>
        </div>

        {/* 푸터 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 비상장주식 정보 플랫폼. 모든 권리 보유.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage