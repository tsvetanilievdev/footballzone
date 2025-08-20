'use client'

import Link from 'next/link'
import { Article } from '@/types'
import { UserIcon, ClockIcon, LockClosedIcon, StarIcon } from '@heroicons/react/24/outline'
import { formatDate } from '@/utils/dateUtils'

interface CoachArticleCardProps {
  article: Article
}

export default function CoachArticleCard({ article }: CoachArticleCardProps) {

  const { day, month } = formatDate(article.publishedAt)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group overflow-hidden">
      {/* Image with Premium Badge */}
      <div className="relative">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Date Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-green-600 text-white text-center rounded-lg px-2.5 py-1.5 shadow-lg">
            <div className="text-lg font-bold leading-none">{day}</div>
            <div className="text-xs font-medium uppercase">{month}</div>
          </div>
        </div>

        {/* Premium/Free Badge */}
        <div className="absolute top-3 right-3">
          {article.isPremium ? (
            <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full shadow-lg">
              <LockClosedIcon className="w-4 h-4 mr-1" />
              <span className="text-xs font-bold uppercase">Премиум</span>
            </div>
          ) : (
            <div className="flex items-center px-3 py-1.5 bg-green-500 text-white rounded-full shadow-lg">
              <StarIcon className="w-4 h-4 mr-1" />
              <span className="text-xs font-bold uppercase">Безплатно</span>
            </div>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white rounded-full text-xs font-medium">
            {article.tags[0] || 'Общо'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300 leading-tight line-clamp-2">
          <Link href={`/coach/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        {/* Meta Info */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <UserIcon className="w-4 h-4" />
            <span className="text-green-600 font-medium">{article.author.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ClockIcon className="w-4 h-4" />
            <span>{article.readTime} мин</span>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-gray-600 leading-relaxed mb-4 text-sm line-clamp-3">
          {article.excerpt}
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag} 
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Read More Button */}
        <div className="pt-4 border-t border-gray-100">
          <Link 
            href={`/coach/${article.slug}`}
            className={`
              inline-flex items-center justify-center w-full px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105
              ${article.isPremium 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 shadow-lg'
                : 'bg-green-600 text-white hover:bg-green-700'
              }
            `}
          >
            {article.isPremium ? (
              <>
                <LockClosedIcon className="w-4 h-4 mr-2" />
                Отключи премиум съдържанието
              </>
            ) : (
              <>
                Прочети безплатно
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </Link>
        </div>

        {/* Premium Note */}
        {article.isPremium && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <LockClosedIcon className="w-3 h-3 inline mr-1" />
              Това съдържание е достъпно само за премиум абонати
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 