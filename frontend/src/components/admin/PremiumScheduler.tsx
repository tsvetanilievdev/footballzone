'use client'

import { useState } from 'react'
import { CalendarIcon, ClockIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline'
import { formatDateBG } from '@/utils/dateUtils'

interface PremiumSchedulerProps {
  isPremium: boolean
  premiumSchedule?: {
    releaseFree: Date
    isPermanentPremium: boolean
  }
  onPremiumChange: (isPremium: boolean) => void
  onScheduleChange: (schedule?: {
    releaseFree: Date
    isPermanentPremium: boolean
  }) => void
  className?: string
}

export default function PremiumScheduler({
  isPremium,
  premiumSchedule,
  onPremiumChange,
  onScheduleChange,
  className = ''
}: PremiumSchedulerProps) {
  const [scheduleType, setScheduleType] = useState<'immediate' | 'scheduled' | 'permanent'>(
    premiumSchedule?.isPermanentPremium ? 'permanent' :
    premiumSchedule?.releaseFree ? 'scheduled' : 'immediate'
  )
  
  const [releaseDate, setReleaseDate] = useState(
    premiumSchedule?.releaseFree?.toISOString().split('T')[0] || ''
  )
  
  const [releaseTime, setReleaseTime] = useState(
    premiumSchedule?.releaseFree?.toTimeString().split(' ')[0].slice(0, 5) || '09:00'
  )

  const handleScheduleTypeChange = (type: 'immediate' | 'scheduled' | 'permanent') => {
    setScheduleType(type)
    
    if (type === 'immediate') {
      onPremiumChange(false)
      onScheduleChange(undefined)
    } else if (type === 'permanent') {
      onPremiumChange(true)
      onScheduleChange({
        releaseFree: new Date('9999-12-31'),
        isPermanentPremium: true
      })
    } else {
      onPremiumChange(true)
      // Schedule will be set when date/time is updated
    }
  }

  const handleDateTimeChange = () => {
    if (scheduleType === 'scheduled' && releaseDate) {
      const releaseDatetime = new Date(`${releaseDate}T${releaseTime}`)
      onScheduleChange({
        releaseFree: releaseDatetime,
        isPermanentPremium: false
      })
    }
  }


  const getStatusColor = () => {
    if (!isPremium) return 'text-green-600'
    if (scheduleType === 'permanent') return 'text-purple-600'
    if (scheduleType === 'scheduled') return 'text-orange-600'
    return 'text-blue-600'
  }

  const getStatusIcon = () => {
    if (!isPremium) return <LockOpenIcon className="w-5 h-5" />
    return <LockClosedIcon className="w-5 h-5" />
  }

  const getStatusText = () => {
    if (!isPremium) return 'Безплатна статия'
    if (scheduleType === 'permanent') return 'Завинаги премиум'
    if (scheduleType === 'scheduled' && releaseDate) {
      const releaseDateTime = new Date(`${releaseDate}T${releaseTime}`)
      return `Премиум до ${formatDateBG(releaseDateTime)}`
    }
    return 'Премиум статия'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Настройки за премиум достъп
        </h3>
        <p className="text-sm text-gray-600">
          Определете кога и как статията ще бъде достъпна
        </p>
      </div>

      {/* Current status */}
      <div className={`p-4 rounded-lg border-2 border-dashed ${
        isPremium ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={getStatusColor()}>
            {getStatusIcon()}
          </div>
          <div>
            <h4 className={`font-semibold ${getStatusColor()}`}>
              {getStatusText()}
            </h4>
            {scheduleType === 'scheduled' && releaseDate && (
              <p className="text-sm text-gray-600">
                Статията автоматично ще стане безплатна в зададения момент
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Schedule options */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Изберете план за достъп:</h4>
        
        <div className="space-y-3">
          {/* Immediate free */}
          <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="scheduleType"
              value="immediate"
              checked={scheduleType === 'immediate'}
              onChange={() => handleScheduleTypeChange('immediate')}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <LockOpenIcon className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Безплатна статия</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Статията е достъпна за всички потребители веднага
              </p>
            </div>
          </label>

          {/* Scheduled release */}
          <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="scheduleType"
              value="scheduled"
              checked={scheduleType === 'scheduled'}
              onChange={() => handleScheduleTypeChange('scheduled')}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-gray-900">Планирано освобождаване</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Премиум сега, но ще стане безплатна в определен момент
              </p>
              
              {scheduleType === 'scheduled' && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Дата на освобождаване
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={releaseDate}
                        onChange={(e) => {
                          setReleaseDate(e.target.value)
                          setTimeout(handleDateTimeChange, 0)
                        }}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <CalendarIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Час на освобождаване
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={releaseTime}
                        onChange={(e) => {
                          setReleaseTime(e.target.value)
                          setTimeout(handleDateTimeChange, 0)
                        }}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <ClockIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </label>

          {/* Permanent premium */}
          <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="scheduleType"
              value="permanent"
              checked={scheduleType === 'permanent'}
              onChange={() => handleScheduleTypeChange('permanent')}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <LockClosedIcon className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Завинаги премиум</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Статията винаги ще изисква премиум достъп
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Preview */}
      {isPremium && scheduleType === 'scheduled' && releaseDate && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            📅 Преглед на планирането
          </h4>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Сега:</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                Премиум съдържание
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">От {formatDateBG(new Date(`${releaseDate}T${releaseTime}`))}:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                Безплатно съдържание
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">
          💡 Съвети за премиум съдържание
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Планираното освобождаване е полезно за промоции и събития</li>
          <li>• Завинаги премиум е подходящо за специализирано съдържание</li>
          <li>• Може да промените настройките по всяко време</li>
        </ul>
      </div>
    </div>
  )
}