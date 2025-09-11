'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/layout/Header'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { 
  UserIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  EyeIcon,
  ChatBubbleLeftEllipsisIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  PencilIcon,
  MapPinIcon,
  LinkIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { 
  UserIcon as UserIconSolid,
  StarIcon,
  FireIcon
} from '@heroicons/react/24/solid'

interface UserStats {
  totalViews: number
  totalComments: number
  recentViews: Array<{
    articleId: string
    articleTitle: string
    articleSlug: string
    articleImage?: string
    viewedAt: string
  }>
}

const getRoleDisplayName = (role: string) => {
  const roleNames: Record<string, string> = {
    'FREE': 'Безплатен потребител',
    'PLAYER': 'Играч', 
    'COACH': 'Треньор',
    'PARENT': 'Родител',
    'ADMIN': 'Администратор'
  }
  return roleNames[role] || role
}

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    'FREE': 'bg-gray-100 text-gray-800',
    'PLAYER': 'bg-blue-100 text-blue-800',
    'COACH': 'bg-green-100 text-green-800',
    'PARENT': 'bg-purple-100 text-purple-800',
    'ADMIN': 'bg-red-100 text-red-800'
  }
  return colors[role] || 'bg-gray-100 text-gray-800'
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'settings'>('overview')
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <UserIcon className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Моля, влезте в профила си</h1>
            <p className="text-gray-600 mb-6">За да видите профила си, трябва да влезете в акаунта си.</p>
            <a
              href="/auth/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Вход
            </a>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Profile Header */}
      <div className="pt-20 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <span className="text-white font-bold text-2xl">
                  {getUserInitials(user.name)}
                </span>
              </div>
              {user.role === 'ADMIN' && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <StarIcon className="w-5 h-5 text-yellow-800" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)} bg-white/90`}>
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span className="text-sm">Член от {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm border border-white/20"
            >
              <PencilIcon className="w-4 h-4" />
              Редактирай
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 p-1 bg-gray-200 rounded-lg mt-6 w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserIconSolid className="w-4 h-4 mr-2 inline" />
            Преглед
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'activity'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FireIcon className="w-4 h-4 mr-2 inline" />
            Активност
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Cog6ToothIcon className="w-4 h-4 mr-2 inline" />
            Настройки
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Statistics Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Views */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Общо прегледи</p>
                      <p className="text-3xl font-bold text-gray-900">{userStats?.totalViews || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <EyeIcon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Total Comments */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Общо коментари</p>
                      <p className="text-3xl font-bold text-gray-900">{userStats?.totalComments || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpenIcon className="w-5 h-5" />
                  Последно четени статии
                </h3>
                {userStats?.recentViews && userStats.recentViews.length > 0 ? (
                  <div className="space-y-3">
                    {userStats.recentViews.map((view, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <BookOpenIcon className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{view.articleTitle}</h4>
                          <p className="text-sm text-gray-500">{formatDate(view.viewedAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Все още не сте чели статии</p>
                    <a
                      href="/read"
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <BookOpenIcon className="w-4 h-4" />
                      Разгледайте статиите
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info Sidebar */}
            <div className="space-y-6">
              {/* User Details */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Профилна информация</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Пълно име</p>
                    <p className="text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Имейл</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Роля</p>
                    <p className="text-gray-900">{getRoleDisplayName(user.role)}</p>
                  </div>
                  {user.bio && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Биография</p>
                      <p className="text-gray-900">{user.bio}</p>
                    </div>
                  )}
                  {user.location && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Местоположение</p>
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900">{user.location}</span>
                      </div>
                    </div>
                  )}
                  {user.website && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Уебсайт</p>
                      <div className="flex items-center gap-1">
                        <GlobeAltIcon className="w-4 h-4 text-gray-500" />
                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                          {user.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Бързи действия</h3>
                <div className="space-y-2">
                  <a
                    href="/settings"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900"
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span>Настройки на акаунта</span>
                  </a>
                  <a
                    href="/read"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900"
                  >
                    <BookOpenIcon className="w-5 h-5" />
                    <span>Разгледай статии</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Активност на потребителя</h3>
            <div className="text-center py-8">
              <FireIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Функционалността за активност ще бъде добавена скоро</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Настройки на акаунта</h3>
            <div className="text-center py-8">
              <Cog6ToothIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">За пълна функционалност на настройките, посетете страницата за настройки</p>
              <a
                href="/settings"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Cog6ToothIcon className="w-4 h-4" />
                Отиди към настройки
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}