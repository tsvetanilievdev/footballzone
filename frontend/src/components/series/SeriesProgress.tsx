'use client'

import React from 'react'
import Link from 'next/link'
import { 
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  PlayCircleIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'
import { SeriesArticle, UserProgress } from '@/hooks/api/useSeries'

interface SeriesProgressProps {
  articles: SeriesArticle[]
  progress?: UserProgress
  onArticleClick?: (article: SeriesArticle) => void
  className?: string
}

const SeriesProgress: React.FC<SeriesProgressProps> = ({ 
  articles, 
  progress, 
  onArticleClick,
  className = '' 
}) => {
  const isArticleCompleted = (partNumber: number) => {
    return progress?.completedParts?.includes(partNumber) || false
  }

  const isArticleAccessible = (partNumber: number) => {
    if (!progress) return partNumber === 1
    return partNumber <= (progress.currentPartNumber + 1)
  }

  const getCurrentStatus = (article: SeriesArticle) => {
    const isCompleted = isArticleCompleted(article.partNumber)
    const isAccessible = isArticleAccessible(article.partNumber)
    const isCurrent = progress?.currentPartNumber === article.partNumber

    if (isCompleted) return 'completed'
    if (isCurrent) return 'current'
    if (isAccessible) return 'available'
    return 'locked'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIconSolid className="w-5 h-5 text-green-500" />
      case 'current':
        return <PlayCircleIcon className="w-5 h-5 text-blue-500" />
      case 'available':
        return <BookOpenIcon className="w-5 h-5 text-gray-400" />
      case 'locked':
        return <LockClosedIcon className="w-5 h-5 text-gray-300" />
      default:
        return <BookOpenIcon className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 hover:bg-green-100'
      case 'current':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100 ring-2 ring-blue-500 ring-opacity-20'
      case 'available':
        return 'bg-white border-gray-200 hover:bg-gray-50'
      case 'locked':
        return 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-75'
      default:
        return 'bg-white border-gray-200'
    }
  }

  const sortedArticles = [...articles].sort((a, b) => a.partNumber - b.partNumber)

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Прогрес на серията
        </h3>
        
        {progress && (
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              <span>{progress.completedParts.length} завършени</span>
            </div>
            
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4 text-blue-500" />
              <span>{Math.round(progress.progressPercentage)}% готово</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {progress && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Общ прогрес</span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round(progress.progressPercentage)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress.progressPercentage, 100)}%` }}
            />
          </div>
          
          {progress.estimatedTimeRemaining > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Приблизително {Math.round(progress.estimatedTimeRemaining / 60)} минути оставащо време
            </p>
          )}
        </div>
      )}

      {/* Article List */}
      <div className="space-y-2">
        {sortedArticles.map((article) => {
          const status = getCurrentStatus(article)
          const isClickable = status !== 'locked' && article.status === 'PUBLISHED'
          
          const ArticleItem = ({ children }: { children: React.ReactNode }) => {
            if (isClickable && onArticleClick) {
              return (
                <button
                  onClick={() => onArticleClick(article)}
                  className={`w-full text-left rounded-lg border p-4 transition-all duration-200 ${getStatusStyles(status)}`}
                >
                  {children}
                </button>
              )
            } else if (isClickable) {
              return (
                <Link href={`/articles/${article.slug}`} className={`block rounded-lg border p-4 transition-all duration-200 ${getStatusStyles(status)}`}>
                  {children}
                </Link>
              )
            } else {
              return (
                <div className={`rounded-lg border p-4 transition-all duration-200 ${getStatusStyles(status)}`}>
                  {children}
                </div>
              )
            }
          }

          return (
            <ArticleItem key={article.id}>
              <div className="flex items-center gap-4">
                {/* Part Number */}
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    status === 'completed' ? 'bg-green-500 text-white' :
                    status === 'current' ? 'bg-blue-500 text-white' :
                    status === 'available' ? 'bg-gray-200 text-gray-700' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {article.partNumber}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    {getStatusIcon(status)}
                    
                    <h4 className={`text-sm font-medium line-clamp-2 ${
                      status === 'locked' ? 'text-gray-400' : 'text-gray-900'
                    }`}>
                      {article.title}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{article.readTime} мин четене</span>
                    
                    {article.publishedAt && (
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString('bg-BG')}
                      </span>
                    )}
                    
                    {status === 'locked' && (
                      <span className="text-gray-400">Заключено</span>
                    )}
                    
                    {status === 'current' && (
                      <span className="text-blue-600 font-medium">Текущо</span>
                    )}
                  </div>
                </div>

                {/* Status Indicator */}
                {status === 'completed' && (
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircleIconSolid className="w-4 h-4" />
                      <span className="hidden sm:inline">Завършено</span>
                    </div>
                  </div>
                )}
              </div>
            </ArticleItem>
          )
        })}
      </div>

      {/* Summary */}
      {progress && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {progress.completedParts.length}
              </div>
              <div className="text-sm text-gray-600">Завършени</div>
            </div>
            
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {articles.length - progress.completedParts.length}
              </div>
              <div className="text-sm text-gray-600">Оставащи</div>
            </div>
            
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {Math.round(progress.progressPercentage)}%
              </div>
              <div className="text-sm text-gray-600">Прогрес</div>
            </div>
            
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {progress.estimatedTimeRemaining > 0 
                  ? `${Math.round(progress.estimatedTimeRemaining / 60)}мин`
                  : '0мин'
                }
              </div>
              <div className="text-sm text-gray-600">Оставащо</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SeriesProgress