'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  ClockIcon,
  TagIcon,
  ShareIcon,
  BookmarkIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Article } from '@/types'
import { useState } from 'react'

interface NewsTemplateProps {
  article: Article
}

export default function NewsTemplate({ article }: NewsTemplateProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/read" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Назад към новините
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* Breaking News Badge */}
        <div className="flex items-center space-x-3 mb-6">
          <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
            НОВИНИ
          </span>
          <span className="text-gray-500 text-sm">
            {new Date(article.publishedAt).toLocaleDateString('bg-BG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">
            {article.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-6 mb-8">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {article.author.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{article.author.name}</p>
                <p className="text-sm text-gray-500">Журналист</p>
              </div>
            </div>

            <div className="flex items-center text-gray-500 text-sm">
              <ClockIcon className="w-4 h-4 mr-1" />
              {article.readTime} мин четене
            </div>

            {article.viewCount && (
              <div className="text-gray-500 text-sm">
                {article.viewCount.toLocaleString()} прегледа
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-colors ${
                isLiked ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              {isLiked ? <HeartSolidIcon className="w-5 h-5" /> : <HeartIcon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <BookmarkIcon className="w-5 h-5" />
            </button>

            <button className="p-2 rounded-full text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors">
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-8">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TagIcon className="w-5 h-5 mr-2" />
              Теми
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Share */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Сподели статията</h3>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Facebook
            </button>
            <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm font-medium">
              Twitter
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
              WhatsApp
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}