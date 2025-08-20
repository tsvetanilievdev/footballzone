'use client'

import Link from 'next/link'
import { Article } from '@/types'
import { UserIcon, ClockIcon, LockClosedIcon, StarIcon, PlayIcon } from '@heroicons/react/24/outline'
import { formatDate } from '@/utils/dateUtils'

interface PlayerArticleCardProps {
  article: Article
}

export default function PlayerArticleCard({ article }: PlayerArticleCardProps) {

  const { day, month } = formatDate(article.publishedAt)

  // Determine if article has video content based on title/content
  const hasVideo = article.title.toLowerCase().includes('видео') || 
                   article.excerpt.toLowerCase().includes('видео') ||
                   Math.random() > 0.7 // Random for demo

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-500 group overflow-hidden transform hover:scale-105">
      {/* Image with Enhanced Badges */}
      <div className="relative overflow-hidden">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Date Badge - Floating */}
        <div className="absolute top-4 left-4">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-center rounded-xl px-3 py-2 shadow-lg backdrop-blur-sm">
            <div className="text-lg font-bold leading-none">{day}</div>
            <div className="text-xs font-medium uppercase">{month}</div>
          </div>
        </div>

        {/* Premium/Free Badge - Top Right */}
        <div className="absolute top-4 right-4">
          {article.isPremium ? (
            <div className="flex items-center px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full shadow-lg backdrop-blur-sm transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <LockClosedIcon className="w-4 h-4 mr-1" />
              <span className="text-xs font-bold uppercase">PRO</span>
            </div>
          ) : (
            <div className="flex items-center px-3 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full shadow-lg backdrop-blur-sm transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <StarIcon className="w-4 h-4 mr-1" />
              <span className="text-xs font-bold uppercase">FREE</span>
            </div>
          )}
        </div>

        {/* Video Badge - Bottom Left */}
        {hasVideo && (
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center px-3 py-2 bg-black/70 backdrop-blur-sm text-white rounded-full shadow-lg">
              <PlayIcon className="w-4 h-4 mr-1" />
              <span className="text-xs font-semibold">VIDEO</span>
            </div>
          </div>
        )}

        {/* Difficulty Level - Bottom Right */}
        <div className="absolute bottom-4 right-4">
          <div className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full text-xs font-medium shadow-lg">
            {article.readTime <= 5 ? 'Начинаещ' : article.readTime <= 10 ? 'Средно' : 'Напреднал'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Category & Title */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide">
              {article.tags[0] || 'Общо'}
            </span>
            <div className="flex items-center space-x-1 text-gray-400">
              {'★'.repeat(Math.floor(Math.random() * 2) + 4)}
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 leading-tight line-clamp-2">
            <Link href={`/players/${article.slug}`}>
              {article.title}
            </Link>
          </h3>
        </div>

        {/* Meta Info with Enhanced Design */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-gray-500">
              <UserIcon className="w-4 h-4" />
              <span className="font-medium text-blue-600">{article.author.name}</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center space-x-1 text-gray-500">
              <ClockIcon className="w-4 h-4" />
              <span>{article.readTime} мин</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-400">4.8</span>
            <div className="flex text-yellow-400">
              {'★'.repeat(5)}
            </div>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">
          {article.excerpt}
        </p>

        {/* Skills Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-xs font-medium hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 transition-all duration-300 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Progress Bar (for demo) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Прогрес в тази тема</span>
            <span className="font-semibold text-blue-600">{Math.floor(Math.random() * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.floor(Math.random() * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <Link 
            href={`/players/${article.slug}`}
            className={`
              inline-flex items-center justify-center w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg
              ${article.isPremium 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 shadow-yellow-200'
                : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600 shadow-blue-200'
              }
            `}
          >
            {article.isPremium ? (
              <>
                <LockClosedIcon className="w-5 h-5 mr-2" />
                Отключи PRO съдържанието
              </>
            ) : (
              <>
                <PlayIcon className="w-5 h-5 mr-2" />
                Започни тренировката
              </>
            )}
          </Link>
          
          {/* Secondary Actions */}
          <div className="flex space-x-2">
            <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm font-medium">
              📖 Запази
            </button>
            <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm font-medium">
              📤 Сподели
            </button>
          </div>
        </div>

        {/* Premium Note */}
        {article.isPremium && (
          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start space-x-2">
              <LockClosedIcon className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-yellow-800 font-medium">
                  PRO съдържание
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Получете достъп до персонализирани тренировки и експертни анализи
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 