'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  BookOpenIcon, 
  ClockIcon, 
  CheckCircleIcon,
  PlayIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { Series, UserProgress } from '@/hooks/api/useSeries'

interface SeriesCardProps {
  series: Series
  progress?: UserProgress
  showProgress?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
  onClick?: () => void
}

const SeriesCard: React.FC<SeriesCardProps> = ({ 
  series, 
  progress, 
  showProgress = true, 
  size = 'medium',
  className = '',
  onClick
}) => {
  const totalArticles = series._count?.articles || series.totalPlannedArticles || 0
  const completedParts = progress?.completedParts?.length || 0
  const progressPercentage = progress?.progressPercentage || 0

  const getCategoryColor = (category: string) => {
    const colors = {
      TACTICS: 'bg-blue-100 text-blue-800 border-blue-200',
      TECHNIQUE: 'bg-green-100 text-green-800 border-green-200',
      FITNESS: 'bg-red-100 text-red-800 border-red-200',
      PSYCHOLOGY: 'bg-purple-100 text-purple-800 border-purple-200',
      YOUTH_DEVELOPMENT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      COACHING: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getCategoryName = (category: string) => {
    const names = {
      TACTICS: 'Тактика',
      TECHNIQUE: 'Техника',
      FITNESS: 'Фитнес',
      PSYCHOLOGY: 'Психология',
      YOUTH_DEVELOPMENT: 'Младежко развитие',
      COACHING: 'Треньорство'
    }
    return names[category as keyof typeof names] || category
  }

  const sizeClasses = {
    small: 'p-4',
    medium: 'p-4 sm:p-6',
    large: 'p-6 sm:p-8'
  }

  const imageSize = {
    small: { width: 60, height: 40 },
    medium: { width: 80, height: 60 },
    large: { width: 120, height: 80 }
  }

  const CardContent = () => (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${sizeClasses[size]} ${className}`}>
      <div className="flex flex-col h-full">
        {/* Header with image and category */}
        <div className="flex items-start gap-4 mb-4">
          {series.coverImageUrl && (
            <div className="flex-shrink-0">
              <Image
                src={series.coverImageUrl}
                alt={series.name}
                width={imageSize[size].width}
                height={imageSize[size].height}
                className="rounded-lg object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(series.category)}`}>
                {getCategoryName(series.category)}
              </span>
              
              {series.status === 'COMPLETED' && (
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
              )}
            </div>
            
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
              {series.name}
            </h3>
          </div>
        </div>

        {/* Description */}
        {series.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {series.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <BookOpenIcon className="w-4 h-4" />
            <span>{totalArticles} части</span>
          </div>
          
          {progress?.estimatedTimeRemaining && (
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>{Math.round(progress.estimatedTimeRemaining / 60)}мин оставащо</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {showProgress && progress && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Прогрес: {completedParts} от {totalArticles}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            
            {progress.lastReadAt && (
              <p className="text-xs text-gray-500 mt-2">
                Последно четено: {new Date(progress.lastReadAt).toLocaleDateString('bg-BG')}
              </p>
            )}
          </div>
        )}

        {/* Tags */}
        {series.tags && series.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {series.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
            {series.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{series.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-auto pt-2">
          {progress && progress.currentPartNumber > 0 ? (
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <PlayIcon className="w-4 h-4" />
              Продължи четенето
            </button>
          ) : (
            <button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Започни четенето
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  if (onClick) {
    return (
      <button onClick={onClick} className="text-left w-full">
        <CardContent />
      </button>
    )
  }

  return (
    <Link href={`/series/${series.slug || series.id}`} className="block">
      <CardContent />
    </Link>
  )
}

export default SeriesCard