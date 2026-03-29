import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Mail, 
  Building2, 
  Calendar, 
  Edit2, 
  Save, 
  X, 
  Shield,
  Globe,
  Phone,
  MapPin,
  Bell,
  Lock,
  LogOut
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { formatDate } from '../lib/utils'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, userRole, signOut, updateProfile, profile } = useAuthStore()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    location: '',
    bio: '',
    website: '',
    notifications: true,
    emailNotifications: true
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Firebase Auth에서 사용자 정보 로드
    setProfileData(prev => ({
      ...prev,
      fullName: user.displayName || profile?.fullName || '',
    }))
  }, [user, profile])

  const handleSave = async () => {
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const result = await updateProfile(profileData)
      
      if (result.success) {
        setSuccess('프로필이 성공적으로 업데이트되었습니다.')
        setIsEditing(false)
        setTimeout(() => {
          setSuccess('')
        }, 2000)
      } else {
        setError(result.error || '프로필 업데이트 중 오류가 발생했습니다.')
      }
    } catch (error: any) {
      setError(error.message || '프로필 업데이트 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setError('')
    if (user) {
      setProfileData({
        fullName: user.displayName || profile?.fullName || '',
        phone: profile?.phone || '',
        location: profile?.location || '',
        bio: profile?.bio || '',
        website: profile?.website || '',
        notifications: profile?.notifications ?? true,
        emailNotifications: profile?.email_notifications ?? profile?.emailNotifications ?? true
      })
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  if (!user) {
    return null
  }

  const roleLabels: Record<string, { label: string; color: string }> = {
    user: { label: '일반 사용자', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    company_rep: { label: '회사 담당자', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    admin: { label: '관리자', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
  }

  const roleInfo = roleLabels[userRole || 'user'] || roleLabels.user

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">프로필 설정</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            계정 정보와 개인 설정을 관리하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽 사이드바 - 프로필 요약 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-6 sticky top-6">
              {/* 프로필 아바타 */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mb-4">
                  {profile?.avatar || user.photoURL ? (
                    <img 
                      src={profile?.avatar || user.photoURL || ''} 
                      alt={profileData.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {profileData.fullName || '이름 없음'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
              </div>

              {/* 계정 정보 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">이메일</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">가입일</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.metadata?.creationTime ? formatDate(new Date(user.metadata.creationTime)) : '정보 없음'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">계정 상태</p>
                    <p className="font-medium text-green-600 dark:text-green-400">
                      {user.emailVerified ? '인증 완료' : '이메일 인증 필요'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="mt-8 pt-6 border-t dark:border-gray-700 space-y-3">
                <button
                  onClick={() => navigate('/change-password')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <Lock className="w-4 h-4" />
                  비밀번호 변경
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 - 프로필 편집 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900 p-6">
              {/* 헤더 */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  개인 정보
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    편집하기
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center gap-2 px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      취소
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          저장 중...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          저장하기
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* 상태 메시지 */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                </div>
              )}

              {/* 프로필 폼 */}
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      이름
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="이름을 입력하세요"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                        {profileData.fullName || '이름 없음'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      전화번호
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="pl-10 w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="010-0000-0000"
                        />
                      </div>
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                        {profileData.phone || '전화번호 없음'}
                      </p>
                    )}
                  </div>
                </div>

                {/* 위치 및 웹사이트 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      위치
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          className="pl-10 w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="서울시 강남구"
                        />
                      </div>
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                        {profileData.location || '위치 정보 없음'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      웹사이트
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="url"
                          value={profileData.website}
                          onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                          className="pl-10 w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="https://example.com"
                        />
                      </div>
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                        {profileData.website || '웹사이트 없음'}
                      </p>
                    )}
                  </div>
                </div>

                {/* 소개 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    자기소개
                  </label>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="자기소개를 입력하세요..."
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white whitespace-pre-wrap">
                      {profileData.bio || '자기소개가 없습니다.'}
                    </p>
                  )}
                </div>

                {/* 회사 담당자 정보 */}
                {(userRole === 'company_rep' || userRole === 'admin') && profile?.companyId && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-medium text-gray-900 dark:text-white">담당 회사 정보</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      회사 담당자로 등록되어 있습니다. 담당 회사 정보는 관리자 페이지에서 확인할 수 있습니다.
                    </p>
                  </div>
                )}

                {/* 알림 설정 */}
                <div className="pt-6 border-t dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <h3 className="font-medium text-gray-900 dark:text-white">알림 설정</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">푸시 알림</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          새로운 질문, 답변, 공지사항 알림
                        </p>
                      </div>
                      {isEditing ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profileData.notifications}
                            onChange={(e) => setProfileData({ ...profileData, notifications: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-sm ${profileData.notifications ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                          {profileData.notifications ? '활성화' : '비활성화'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">이메일 알림</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          주간 요약 및 중요한 공지사항
                        </p>
                      </div>
                      {isEditing ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profileData.emailNotifications}
                            onChange={(e) => setProfileData({ ...profileData, emailNotifications: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-sm ${profileData.emailNotifications ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                          {profileData.emailNotifications ? '활성화' : '비활성화'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage