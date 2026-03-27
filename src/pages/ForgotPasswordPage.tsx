import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setIsSubmitted(true)
    } catch (error: any) {
      console.error('비밀번호 재설정 오류:', error)
      setError(error.message || '비밀번호 재설정 요청 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            로그인 페이지로 돌아가기
          </Link>
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            비밀번호 재설정
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isSubmitted 
              ? '이메일을 확인해주세요' 
              : '가입하신 이메일을 입력해주세요'}
          </p>
        </div>

        {/* 폼 카드 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                이메일이 전송되었습니다
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                <span className="font-medium text-blue-600 dark:text-blue-400">{email}</span>으로
                비밀번호 재설정 링크가 전송되었습니다. 이메일을 확인해주세요.
              </p>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-center"
                >
                  로그인 페이지로 돌아가기
                </Link>
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    setEmail('')
                  }}
                  className="block w-full px-4 py-3 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  다른 이메일로 재시도
                </button>
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
                  이메일 주소
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
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  이메일로 비밀번호 재설정 링크가 전송됩니다.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    전송 중...
                  </div>
                ) : (
                  '비밀번호 재설정 링크 보내기'
                )}
              </button>
            </form>
          )}

          {/* 안내사항 */}
          <div className="mt-8 pt-6 border-t dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              안내사항
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                이메일을 받지 못하셨다면 스팸 폴더를 확인해주세요.
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                링크는 24시간 동안 유효합니다.
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                계속해서 문제가 발생한다면 고객센터로 문의해주세요.
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

export default ForgotPasswordPage