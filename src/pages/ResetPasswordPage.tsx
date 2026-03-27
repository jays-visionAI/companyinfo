import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    // URL에서 access_token 추출
    const hash = window.location.hash
    const params = new URLSearchParams(hash.substring(1))
    const token = params.get('access_token')
    
    if (token) {
      setAccessToken(token)
    } else {
      setError('유효하지 않은 링크입니다. 이메일에서 올바른 링크를 클릭해주세요.')
    }
  }, [])

  const validatePassword = () => {
    if (password.length < 6) {
      return '비밀번호는 최소 6자 이상이어야 합니다.'
    }
    if (password !== confirmPassword) {
      return '비밀번호가 일치하지 않습니다.'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validationError = validatePassword()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      // Supabase를 사용하여 비밀번호 재설정
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setIsSuccess(true)
      
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/login', { 
          state: { message: '비밀번호가 성공적으로 변경되었습니다. 새로운 비밀번호로 로그인해주세요.' }
        })
      }, 3000)
    } catch (error: any) {
      console.error('비밀번호 재설정 오류:', error)
      setError(error.message || '비밀번호 재설정 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!accessToken && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">링크를 확인하는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            로그인 페이지로 돌아가기
          </button>
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isSuccess ? '비밀번호 변경 완료' : '새 비밀번호 설정'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isSuccess 
              ? '비밀번호가 성공적으로 변경되었습니다' 
              : '새로운 비밀번호를 입력해주세요'}
          </p>
        </div>

        {/* 폼 카드 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                비밀번호 변경 완료
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                비밀번호가 성공적으로 변경되었습니다. 
                잠시 후 로그인 페이지로 이동합니다.
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }} />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  새 비밀번호
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
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  최소 6자 이상의 비밀번호를 입력해주세요.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    처리 중...
                  </div>
                ) : (
                  '비밀번호 변경하기'
                )}
              </button>
            </form>
          )}

          {/* 안내사항 */}
          <div className="mt-8 pt-6 border-t dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              비밀번호 보안 안내
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                영문, 숫자, 특수문자를 조합하여 사용하세요.
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                개인정보와 관련된 단어는 피해주세요.
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                정기적으로 비밀번호를 변경하는 것을 권장합니다.
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

export default ResetPasswordPage