'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Article } from '@/types'
import {
  UserIcon,
  ClockIcon,
  CalendarIcon,
  TagIcon,
  ShareIcon,
  BookmarkIcon,
  ArrowLeftIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import Image from 'next/image'
import PremiumCTA from '@/components/ui/PremiumCTA'
import AdminEditButton from '@/components/admin/AdminEditButton'
import { useArticle, useTrackArticleView } from '@/hooks/api/useArticles'
import { ArticleDetailSkeleton } from '@/components/ui/LoadingSpinner'
import { ApiErrorDisplay } from '@/components/ui/ErrorBoundary'
import { safeFormatDate } from '@/utils/dateUtils'

export default function ArticleTemplatePage() {
  const params = useParams()
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'magazine' | null>('classic') // Default to classic template
  
  // Get slug from URL params
  const slug = params.slug as string
  
  // Fetch article from API
  const { data: article, isLoading, isError, error, refetch } = useArticle(slug)
  
  // Track article view
  const trackView = useTrackArticleView()
  
  // Track view only once when article loads (use ref to prevent multiple calls)
  const hasTrackedView = useRef(false)
  
  useEffect(() => {
    if (article?.id && !hasTrackedView.current) {
      hasTrackedView.current = true
      trackView.mutate({
        articleId: article.id,
        metadata: { source: 'read-zone', template: selectedTemplate || 'classic' }
      })
    }
  }, [article?.id, trackView]) // Remove selectedTemplate from dependencies

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <ArticleDetailSkeleton />
        </div>
        <Footer />
      </div>
    )
  }

  // Error state
  if (isError || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link
                href="/read"
                className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Назад към Read Zone
              </Link>
            </div>
            <ApiErrorDisplay 
              error={error} 
              onRetry={() => refetch()} 
            />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Show article with selected template (default to classic)
  if (selectedTemplate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminEditButton article={article} />
        <Header />
        <div className="pt-16">
          {selectedTemplate === 'classic' && <ClassicTemplate article={article} />}
          {selectedTemplate === 'modern' && <ModernTemplate article={article} />}
          {selectedTemplate === 'magazine' && <MagazineTemplate article={article} />}
          
          {/* Template selection button */}
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
              title="Избери различен темплейт"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminEditButton article={article} />
      <Header />
      
      <div className="pt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Read Zone */}
          <div className="mb-8">
            <Link
              href="/read"
              className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Назад към Read Zone
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Избери темплейт за статия
            </h1>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Разгледай 3-те различни темплейта за показване на статии и избери този, който най-добре отговаря на нуждите ти.
            </p>
          </div>

          {/* Template Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Classic Template Preview */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <Image
                  src={article.featuredImageUrl || article.featuredImage || '/images/placeholder-article.jpg'}
                  alt="Classic Template"
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-bold">Класически</h3>
                  <p className="text-sm opacity-90">Традиционен и елегантен дизайн</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-green-700">
                    <span className="flex items-center"><UserIcon className="w-4 h-4 mr-1" /> Автор</span>
                    <span className="flex items-center"><ClockIcon className="w-4 h-4 mr-1" /> {article.readTime} мин</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedTemplate('classic')}
                  className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Прегледай Класически
                </button>
              </div>
            </div>

            {/* Modern Template Preview */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <Image
                  src={article.featuredImageUrl || article.featuredImage || '/images/placeholder-article.jpg'}
                  alt="Modern Template"
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-600/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-bold">Модерен</h3>
                  <p className="text-sm opacity-90">Съвременен и интерактивен</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-green-100 rounded-full w-16 animate-pulse"></div>
                    <div className="h-6 bg-green-100 rounded-full w-20 animate-pulse"></div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedTemplate('modern')}
                  className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Прегледай Модерен
                </button>
              </div>
            </div>

            {/* Magazine Template Preview */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <Image
                  src={article.featuredImageUrl || article.featuredImage || '/images/placeholder-article.jpg'}
                  alt="Magazine Template"
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-bold">Списание</h3>
                  <p className="text-sm opacity-90">Стил на съвременно списание</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="text-sm text-green-600 font-semibold">КАТЕГОРИЯ</div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                  </div>
                  <div className="border-l-4 border-green-600 pl-4">
                    <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse mt-1"></div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedTemplate('magazine')}
                  className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Прегледай Списание
                </button>
              </div>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Сравнение на функционалности
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 font-semibold text-gray-900">Функционалност</th>
                      <th className="text-center py-4 font-semibold text-green-600">Класически</th>
                      <th className="text-center py-4 font-semibold text-green-600">Модерен</th>
                      <th className="text-center py-4 font-semibold text-green-600">Списание</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-4 text-black">Четим дизайн</td>
                      <td className="text-center py-4">✅</td>
                      <td className="text-center py-4">✅</td>
                      <td className="text-center py-4">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 text-black">Интерактивни елементи</td>
                      <td className="text-center py-4">⭐</td>
                      <td className="text-center py-4">✅</td>
                      <td className="text-center py-4">⭐</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 text-black">Боковa лента</td>
                      <td className="text-center py-4">✅</td>
                      <td className="text-center py-4">❌</td>
                      <td className="text-center py-4">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 text-black">Социални функции</td>
                      <td className="text-center py-4">⭐</td>
                      <td className="text-center py-4">✅</td>
                      <td className="text-center py-4">⭐</td>
                    </tr>
                    <tr>
                      <td className="py-4 text-black">Мобилна оптимизация</td>
                      <td className="text-center py-4">✅</td>
                      <td className="text-center py-4">✅</td>
                      <td className="text-center py-4">✅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 text-center text-sm text-green-700">
                ✅ Пълна поддръжка | ⭐ Основна поддръжка | ❌ Не се поддържа
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

// Classic Template Component
function ClassicTemplate({ article }: { article: Article }) {
  
  // Safety check
  if (!article || !article.title) {
    return (
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Няма данни за статията</h1>
            <p className="text-gray-600 mt-2">Статията не можа да бъде заредена.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <article>
                {/* Featured Image */}
                <div className="relative h-64 md:h-96 mb-0">
                  <Image
                    src={article.featuredImageUrl || article.featuredImage || '/images/placeholder-article.jpg'}
                    alt={article.title || 'Статия от FootballZone.bg'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Header Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <div className="mb-4">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-600 text-white shadow-lg">
                          {article.category}
                        </span>
                      </div>
                      
                      <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                        {article.title}
                      </h1>
                      
                      <div className="flex flex-wrap items-center gap-6 text-sm text-white/90">
                        <div className="flex items-center">
                          <UserIcon className="w-4 h-4 mr-2" />
                          <span className="font-medium">{article.author?.name || 'Анонимен автор'}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          <span>{safeFormatDate(article.publishedAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-2" />
                          <span>{article.readTime} минути четене</span>
                        </div>
                      </div>
                    </div>
                </div>
                
                {/* Content */}
                <div className="px-6 md:px-8 py-8">
                  <div className="prose prose-lg max-w-none prose-gray">
                    <div 
                      dangerouslySetInnerHTML={{ __html: article.content }} 
                      className="text-gray-800 leading-relaxed"
                    />
                  </div>
                  
                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Тагове</h3>
                      <div className="flex flex-wrap gap-3">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer font-medium"
                          >
                            <TagIcon className="w-3 h-3 mr-2" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="xl:col-span-1">
            <div className="space-y-6">
              {/* Premium CTA */}
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="text-lg font-bold mb-2">Coach Zone</h3>
                <p className="text-green-100 text-sm mb-4">
                  Искаш ли достъп до премиум съдържание за треньори?
                </p>
                <button className="w-full bg-white text-green-700 py-2 px-4 rounded-lg font-semibold text-sm hover:bg-green-50 transition-colors">
                  Научи повече
                </button>
              </div>

              {/* Related Articles */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Свързани статии
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex space-x-3 group cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0 group-hover:from-green-50 group-hover:to-green-100 transition-colors">
                        <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:text-green-500 transition-colors">
                          ⚽
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors">
                          Тактическа анализа на Евро 2024 - част {i}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">5 мин четене</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Абонирай се за новини
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Получавай най-новите анализи и тренировъчни материали.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Твоят имейл"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-green-700 transition-colors">
                    Абонирай се
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modern Template Component
function ModernTemplate({ article }: { article: Article }) {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(42)
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] lg:h-[70vh]">
        <Image
          src={article.featuredImageUrl || article.featuredImage || '/images/placeholder-article.jpg'}
          alt={article.title || 'Статия от FootballZone.bg'}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-green-600 text-white shadow-lg">
                {article.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 text-white/90">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-lg">{article.author?.name || 'Анонимен автор'}</div>
                  <div className="text-sm text-white/70">Автор</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-5 h-5" />
                <span className="text-lg">{article.readTime} мин четене</span>
              </div>
              <div className="flex items-center space-x-2">
                <EyeIcon className="w-5 h-5" />
                <span className="text-lg">{article.viewCount || 1234} прегледа</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-2xl shadow-lg px-8 py-6">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => {
                setIsLiked(!isLiked)
                setLikes(isLiked ? likes - 1 : likes + 1)
              }}
              className={`flex items-center space-x-3 px-6 py-3 rounded-full transition-all transform hover:scale-105 ${
                isLiked ? 'bg-red-100 text-red-600 shadow-md' : 'bg-green-100 text-green-600 hover:bg-green-200 shadow-md'
              }`}
            >
              {isLiked ? (
                <HeartSolidIcon className="w-6 h-6" />
              ) : (
                <HeartIcon className="w-6 h-6" />
              )}
              <span className="font-semibold text-lg">{likes}</span>
            </button>
            
            <button className="flex items-center space-x-3 px-6 py-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all transform hover:scale-105 shadow-md">
              <ChatBubbleLeftIcon className="w-6 h-6" />
              <span className="font-semibold text-lg">12</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all transform hover:scale-105 shadow-md">
              <BookmarkIcon className="w-6 h-6" />
            </button>
            <button className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all transform hover:scale-105 shadow-md">
              <ShareIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <article className="bg-white rounded-3xl shadow-xl p-8 lg:p-16">
          <div className="prose prose-xl max-w-none prose-gray">
            <div 
              dangerouslySetInnerHTML={{ __html: article.content }} 
              className="text-gray-800 leading-relaxed"
            />
          </div>
          
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Тагове</h3>
              <div className="flex flex-wrap gap-4">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-6 py-3 rounded-full text-sm bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300 transition-all cursor-pointer font-semibold shadow-md transform hover:scale-105"
                  >
                    <TagIcon className="w-4 h-4 mr-2" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

// Magazine Template Component
function MagazineTemplate({ article }: { article: Article }) {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-4">
            <article className="bg-white">
              {/* Header */}
              <header className="mb-16">
                <div className="mb-8">
                  <span className="inline-block text-green-600 text-sm font-bold uppercase tracking-widest bg-green-50 px-4 py-2 rounded-lg">
                    {article.category}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-12 leading-none tracking-tighter">
                  {article.title}
                </h1>
                
                <div className="border-l-8 border-green-600 pl-8 mb-12 bg-gray-50 py-6 rounded-r-xl">
                  <p className="text-2xl text-gray-700 leading-relaxed font-light italic">
                    {article.excerpt}
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between py-8 border-t-2 border-b-2 border-gray-200">
                  <div className="flex items-center space-x-6 mb-4 md:mb-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-2xl">
                        {(article.author?.name || 'А').charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-xl text-gray-900">{article.author?.name || 'Анонимен автор'}</p>
                      <p className="text-green-600 font-semibold">Главен редактор</p>
                    </div>
                  </div>
                  
                  <div className="text-left md:text-right">
                    <p className="text-gray-600 font-semibold text-lg">
                      {safeFormatDate(article.publishedAt, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-green-600 font-bold">{article.readTime} минути четене</p>
                  </div>
                </div>
              </header>
              
              {/* Featured Image */}
              <div className="mb-16">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <Image
                    src={article.featuredImageUrl || article.featuredImage || '/images/placeholder-article.jpg'}
                    alt={article.title || 'Статия от FootballZone.bg'}
                    width={1200}
                    height={500}
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
              
              {/* Content */}
              <div className="prose prose-2xl max-w-none prose-gray leading-loose">
                <div 
                  dangerouslySetInnerHTML={{ __html: article.content }} 
                  className="text-gray-800 font-serif text-xl leading-loose"
                />
              </div>
              
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-20 pt-12 border-t-2 border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 uppercase tracking-wide">
                    Тагове
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-6 py-3 text-sm font-bold bg-gray-100 text-gray-800 border-2 border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-800 transition-all cursor-pointer uppercase tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Table of Contents */}
              <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl">
                <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wider border-b border-gray-700 pb-4">
                  Съдържание
                </h3>
                <nav className="space-y-4">
                  <a href="#" className="block text-gray-300 hover:text-white transition-colors font-semibold uppercase text-sm tracking-wide border-l-2 border-transparent hover:border-green-500 pl-4 py-2">
                    Основни защитни модели
                  </a>
                  <a href="#" className="block text-gray-300 hover:text-white transition-colors font-semibold uppercase text-sm tracking-wide border-l-2 border-transparent hover:border-green-500 pl-4 py-2">
                    Позициониране в защита
                  </a>
                  <a href="#" className="block text-gray-300 hover:text-white transition-colors font-semibold uppercase text-sm tracking-wide border-l-2 border-transparent hover:border-green-500 pl-4 py-2">
                    Изводи от турнира
                  </a>
                </nav>
              </div>
              
              {/* Premium Offer */}
              <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">⚽</div>
                  <h3 className="text-xl font-black uppercase tracking-wider">
                    Coach Zone
                  </h3>
                </div>
                <p className="text-green-100 text-sm mb-6 text-center leading-relaxed">
                  Професионални тренировъчни материали и тактически анализи
                </p>
                <button className="w-full bg-white text-green-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-lg">
                  РАЗГЛЕДАЙ ПРЕМИУМ
                </button>
              </div>

              {/* Newsletter */}
              <div className="border-2 border-gray-300 p-8 rounded-2xl bg-white shadow-lg">
                <h3 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-wide">
                  Новини
                </h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  Седмични анализи и тренировъчни съвети.
                </p>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Твоят имейл"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-green-500 focus:outline-none"
                  />
                  <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors">
                    АБОНИРАЙ СЕ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 