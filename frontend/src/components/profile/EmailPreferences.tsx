'use client'

import React, { useState, useEffect } from 'react'
import { 
  EnvelopeIcon,
  BellIcon,
  StarIcon as CrownIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useEmailPreferences, useUpdateEmailPreferences } from '@/hooks/api/useEmails'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'

interface SwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md'
}

const Switch: React.FC<SwitchProps> = ({ enabled, onChange, disabled = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-5',
    md: 'w-12 h-6'
  }
  
  const knobClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5'
  }

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex items-center ${sizeClasses[size]} rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block ${knobClasses[size]} bg-white rounded-full shadow-md transform transition-transform ${
          enabled ? (size === 'sm' ? 'translate-x-5' : 'translate-x-6') : 'translate-x-1'
        }`}
      />
    </button>
  )
}

interface PreferenceItemProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
  color?: 'blue' | 'green' | 'purple' | 'amber'
}

const PreferenceItem: React.FC<PreferenceItemProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  enabled, 
  onChange, 
  disabled = false,
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200'
  }

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200">
      <div className={`flex-shrink-0 p-2 rounded-lg border ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          
          <div className="flex-shrink-0">
            <Switch 
              enabled={enabled} 
              onChange={onChange} 
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const EmailPreferences: React.FC = () => {
  const { user } = useAuth()
  const { data: preferences, isLoading, error } = useEmailPreferences()
  const updatePreferences = useUpdateEmailPreferences()
  
  const [localPreferences, setLocalPreferences] = useState<any>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences)
    }
  }, [preferences])

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    if (!localPreferences) return
    
    const updated = { ...localPreferences, [key]: value }
    setLocalPreferences(updated)
    setHasChanges(true)
  }

  const handleCategoryChange = (category: string, value: boolean) => {
    if (!localPreferences?.categories) return
    
    const updated = {
      ...localPreferences,
      categories: {
        ...localPreferences.categories,
        [category]: value
      }
    }
    setLocalPreferences(updated)
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!hasChanges || !localPreferences) return
    
    try {
      await updatePreferences.mutateAsync(localPreferences)
      setHasChanges(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to update preferences:', error)
    }
  }

  const handleReset = () => {
    if (preferences) {
      setLocalPreferences(preferences)
      setHasChanges(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">Грешка при зареждане на настройките</p>
      </div>
    )
  }

  if (!localPreferences) {
    return (
      <div className="text-center py-12 text-gray-500">
        Настройките не са налични
      </div>
    )
  }

  const frequencyOptions = [
    { value: 'immediate', label: 'Незабавно' },
    { value: 'daily', label: 'Дневно' },
    { value: 'weekly', label: 'Седмично' },
    { value: 'monthly', label: 'Месечно' }
  ]

  const categories = [
    { key: 'tactics', label: 'Тактика', color: 'blue' as const },
    { key: 'technique', label: 'Техника', color: 'green' as const },
    { key: 'fitness', label: 'Фитнес', color: 'purple' as const },
    { key: 'psychology', label: 'Психология', color: 'amber' as const },
    { key: 'youthDevelopment', label: 'Младежко развитие', color: 'blue' as const },
    { key: 'coaching', label: 'Треньорство', color: 'green' as const }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <EnvelopeIcon className="w-8 h-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Имейл настройки</h2>
        <p className="text-gray-600">
          Управлявайте какви имейл уведомления искате да получавате
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-700">
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
          <span>Настройките са запазени успешно!</span>
        </div>
      )}

      {/* Main Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Основни настройки</h3>
        
        <PreferenceItem
          icon={EnvelopeIcon}
          title="Информационен бюлетин"
          description="Получавайте нашия седмичен информационен бюлетин с най-новите статии"
          enabled={localPreferences.newsletter}
          onChange={(enabled) => handlePreferenceChange('newsletter', enabled)}
          color="blue"
        />
        
        <PreferenceItem
          icon={BellIcon}
          title="Уведомления"
          description="Получавайте уведомления за нови статии и актуализации"
          enabled={localPreferences.notifications}
          onChange={(enabled) => handlePreferenceChange('notifications', enabled)}
          color="green"
        />
        
        <PreferenceItem
          icon={CrownIcon}
          title="Премиум съдържание"
          description="Бъдете уведомени когато се публикува ново премиум съдържание"
          enabled={localPreferences.premium}
          onChange={(enabled) => handlePreferenceChange('premium', enabled)}
          color="purple"
        />
        
        <PreferenceItem
          icon={MegaphoneIcon}
          title="Маркетингови имейли"
          description="Получавайте информация за нови функции, промоции и събития"
          enabled={localPreferences.marketing}
          onChange={(enabled) => handlePreferenceChange('marketing', enabled)}
          color="amber"
        />
      </div>

      {/* Frequency Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gray-100 text-gray-600 p-2 rounded-lg">
            <Cog6ToothIcon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Честота на уведомления</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {frequencyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handlePreferenceChange('frequency', option.value)}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                localPreferences.frequency === option.value
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Preferences */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Категории на интерес</h3>
        <p className="text-sm text-gray-600 mb-6">
          Изберете за какви теми искате да получавате уведомления
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Switch
                enabled={localPreferences.categories?.[category.key] || false}
                onChange={(enabled) => handleCategoryChange(category.key, enabled)}
                size="sm"
              />
              <span className="text-sm font-medium text-gray-900">{category.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600">
            Имейлите ще се изпращат на <strong>{user.email}</strong>
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSave}
            disabled={updatePreferences.isPending}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updatePreferences.isPending ? 'Запазване...' : 'Запази настройки'}
          </button>
          
          <button
            onClick={handleReset}
            disabled={updatePreferences.isPending}
            className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Отмени промените
          </button>
        </div>
      )}
    </div>
  )
}

export default EmailPreferences