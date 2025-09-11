'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/layout/Header'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import FormErrors from '@/components/ui/FormErrors'
import PasswordRequirements from '@/components/ui/PasswordRequirements'
import { parseValidationErrors, ErrorContext } from '@/utils/errorUtils'
import { 
  UserIcon,
  LockClosedIcon,
  BellIcon,
  GlobeAltIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface UserSettings {
  emailNotifications: {
    newArticles: boolean
    seriesUpdates: boolean
    premiumContent: boolean
    newsletter: boolean
    marketing: boolean
  }
  pushNotifications: {
    browser: boolean
    mobile: boolean
  }
  preferences: {
    language: 'bg' | 'en'
    timezone: string
    theme: 'light' | 'dark' | 'auto'
  }
}

interface ProfileFormData {
  name: string
  email: string
  bio?: string
  location?: string
  website?: string
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications' | 'privacy'>('profile')
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<any[]>([])
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form states
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  })
  
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Initialize form data when user is loaded
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        socialLinks: {
          facebook: user.socialLinks?.facebook || '',
          twitter: user.socialLinks?.twitter || '',
          instagram: user.socialLinks?.instagram || '',
          linkedin: user.socialLinks?.linkedin || ''
        }
      })
    }
  }, [user])

  // Load user settings
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return
      
      try {
        const response = await fetch('/api/v1/users/settings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setSettings(data.settings)
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      } finally {
        setIsLoadingSettings(false)
      }
    }
    
    loadSettings()
  }, [user])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setErrors([])
    setSuccessMessage('')
    
    try {
      const response = await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profileData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        const parsedErrors = parseValidationErrors(data.error, ErrorContext.SETTINGS)
        setErrors(parsedErrors)
      } else {
        setSuccessMessage('Профилът е обновен успешно!')
        // Update user context if needed
      }
    } catch (error: any) {
      const parsedErrors = parseValidationErrors(error.message, ErrorContext.SETTINGS)
      setErrors(parsedErrors)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setErrors([])
    setSuccessMessage('')
    
    try {
      const response = await fetch('/api/v1/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(passwordData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        const parsedErrors = parseValidationErrors(data.error, ErrorContext.AUTHENTICATION)
        setErrors(parsedErrors)
      } else {
        setSuccessMessage('Паролата е променена успешно!')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setShowPasswordRequirements(false)
      }
    } catch (error: any) {
      const parsedErrors = parseValidationErrors(error.message, ErrorContext.AUTHENTICATION)
      setErrors(parsedErrors)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSettingsUpdate = async (newSettings: Partial<UserSettings>) => {
    if (!settings) return
    
    setIsSaving(true)
    setErrors([])
    
    try {
      const response = await fetch('/api/v1/users/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newSettings)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        const parsedErrors = parseValidationErrors(data.error, ErrorContext.SETTINGS)
        setErrors(parsedErrors)
      } else {
        setSettings(data.settings)
        setSuccessMessage('Настройките са обновени успешно!')
      }
    } catch (error: any) {
      const parsedErrors = parseValidationErrors(error.message, ErrorContext.SETTINGS)
      setErrors(parsedErrors)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAccountDelete = async () => {
    const password = prompt('Въведете паролата си за потвърждение:')
    if (!password) return
    
    setIsSaving(true)
    
    try {
      const response = await fetch('/api/v1/users/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ password })
      })
      
      if (response.ok) {
        alert('Акаунтът е изтрит успешно')
        // Logout and redirect
        localStorage.removeItem('token')
        window.location.href = '/'
      } else {
        const data = await response.json()
        alert(data.error || 'Грешка при изтриването на акаунта')
      }
    } catch (error) {
      alert('Грешка при изтриването на акаунта')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || isLoadingSettings) {
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
            <p className="text-gray-600 mb-6">За да промените настройките си, трябва да влезете в акаунта си.</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Настройки на акаунта</h1>
          <p className="text-gray-600 mt-2">Управлявайте профила си и настройките за поверителност</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckIcon className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <FormErrors errors={errors} context={ErrorContext.SETTINGS} className="mb-6" />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <UserIcon className="w-5 h-5" />
                Профилни данни
              </button>
              
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'password'
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <LockClosedIcon className="w-5 h-5" />
                Смяна на парола
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BellIcon className="w-5 h-5" />
                Известия
              </button>
              
              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'privacy'
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ExclamationTriangleIcon className="w-5 h-5" />
                Поверителност
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Профилни данни</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Пълно име *
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Имейл адрес *
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Биография
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Кратко описание за вас..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Местоположение
                        </label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="София, България"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Уебсайт
                        </label>
                        <input
                          type="url"
                          value={profileData.website}
                          onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSaving ? 'Запазване...' : 'Запази промените'}
                    </button>
                  </div>
                </form>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Смяна на парола</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Текуща парола *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword.current ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Нова парола *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            onFocus={() => setShowPasswordRequirements(true)}
                            onBlur={() => setShowPasswordRequirements(false)}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword.new ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                          </button>
                        </div>
                        <PasswordRequirements 
                          password={passwordData.newPassword} 
                          show={showPasswordRequirements} 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Потвърдете новата парола *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword.confirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSaving ? 'Обновяване...' : 'Обнови паролата'}
                    </button>
                  </div>
                </form>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && settings && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Настройки за известия</h2>
                  
                  {/* Email Notifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Имейл известия</h3>
                    <div className="space-y-3">
                      {Object.entries(settings.emailNotifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {key === 'newArticles' && 'Нови статии'}
                              {key === 'seriesUpdates' && 'Обновления на серии'}
                              {key === 'premiumContent' && 'Премиум съдържание'}
                              {key === 'newsletter' && 'Бюлетин'}
                              {key === 'marketing' && 'Маркетингови съобщения'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleSettingsUpdate({
                              emailNotifications: {
                                ...settings.emailNotifications,
                                [key]: !value
                              }
                            })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Push Notifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Push известия</h3>
                    <div className="space-y-3">
                      {Object.entries(settings.pushNotifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {key === 'browser' && 'Браузър известия'}
                              {key === 'mobile' && 'Мобилни известия'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleSettingsUpdate({
                              pushNotifications: {
                                ...settings.pushNotifications,
                                [key]: !value
                              }
                            })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Поверителност и безопасност</h2>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-red-800 mb-2">Опасна зона</h3>
                    <p className="text-red-700 mb-4">
                      Изтриването на акаунта е необратимо действие. Всичките ви данни ще бъдат изтрити завинаги.
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Изтрий акаунта
                    </button>
                  </div>
                  
                  {showDeleteConfirm && (
                    <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                      <h4 className="font-medium text-red-800 mb-2">Сигурни ли сте?</h4>
                      <p className="text-red-700 mb-4">
                        Това действие не може да бъде отменено. Моля, въведете паролата си за потвърждение.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleAccountDelete}
                          disabled={isSaving}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          {isSaving ? 'Изтриване...' : 'Да, изтрий акаунта'}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Отказ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}