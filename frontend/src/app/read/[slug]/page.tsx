'use client'

import { useState, useEffect } from 'react'
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
import { ApiErrorDisplay } from '@/components/ui/EmptyState'

export default function ArticleTemplatePage() {
  const params = useParams()
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'magazine' | null>('classic') // Default to classic template
  
  // Get slug from URL params
  const slug = params.slug as string
  
  // Fetch article from API
  const { data: article, isLoading, isError, error, refetch } = useArticle(slug)
  
  // Track article view
  const trackView = useTrackArticleView()
  
  // Track view when article loads
  useEffect(() => {
    if (article?.id) {
      trackView.mutate({
        articleId: article.id,
        metadata: { source: 'read-zone', template: selectedTemplate }
      })
    }
  }, [article?.id, selectedTemplate, trackView])

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
                  src={article.featuredImage}
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
                  src={article.featuredImage}
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
                  src={article.featuredImage}
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
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article>
              {/* Header */}
              <header className="mb-8">
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {article.category}
                  </span>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-black mb-6">
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-2" />
                    <span>{article.author.name}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span>{new Intl.DateTimeFormat('bg-BG').format(article.publishedAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>{article.readTime} минути четене</span>
                  </div>
                </div>
              </header>
              
              {/* Featured Image */}
              <div className="mb-8">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  width={800}
                  height={320}
                  className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
              
              {/* Content */}
              <div className="prose prose-lg max-w-none prose-green">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
              
              {/* Premium CTA */}
              <PremiumCTA 
                zone="coach" 
                variant="highlight"
                title="🚀 Искаш ли достъп до премиум съдържание за треньори?"
                description="Получи достъп до тренировъчни планове, упражнения и анализи, вдъхновени от Конте в Coach Zone."
              />
              
              {/* Tags */}
              <div className="mt-8 pt-8 border-t">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 hover:bg-green-200 transition-colors cursor-pointer"
                    >
                      <TagIcon className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Свързани статии
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-black line-clamp-2">
                        Примерна свързана статия {i}
                      </h4>
                      <p className="text-xs text-green-700 mt-1">5 мин четене</p>
                    </div>
                  </div>
                ))}
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
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 lg:h-[500px]">
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-600 text-white">
                {article.category}
              </span>
            </div>
            
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5" />
                </div>
                <span className="font-medium">{article.author.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>{article.readTime} мин</span>
              </div>
              <div className="flex items-center space-x-1">
                <EyeIcon className="w-4 h-4" />
                <span>1,234 прегледа</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-full shadow-lg px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setIsLiked(!isLiked)
                setLikes(isLiked ? likes - 1 : likes + 1)
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                isLiked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
            >
              {isLiked ? (
                <HeartSolidIcon className="w-5 h-5" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
              <span className="font-medium">{likes}</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span className="font-medium">12</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
              <BookmarkIcon className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <article className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          <div className="prose prose-lg max-w-none prose-green">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
          
          {/* Premium CTA */}
          <PremiumCTA 
            zone="coach" 
            variant="default"
            title="🚀 Искаш ли достъп до премиум съдържание за треньори?"
            description="Получи достъп до тренировъчни планове, упражнения и анализи, вдъхновени от Конте в Coach Zone."
          />
          
          {/* Tags */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Тагове</h3>
            <div className="flex flex-wrap gap-3">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-green-100 text-green-800 hover:bg-green-200 transition-colors cursor-pointer font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

// Magazine Template Component
function MagazineTemplate({ article }: { article: Article }) {
  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article>
              {/* Header */}
              <header className="mb-12">
                <div className="mb-6">
                  <span className="text-green-600 text-sm font-bold uppercase tracking-wider">
                    {article.category}
                  </span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
                  {article.title}
                </h1>
                
                <div className="border-l-4 border-green-600 pl-6 mb-8">
                  <p className="text-xl text-black leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                
                <div className="flex items-center justify-between py-6 border-t border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {article.author.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{article.author.name}</p>
                      <p className="text-sm text-green-700">Автор</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-green-700">
                      {new Intl.DateTimeFormat('bg-BG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }).format(article.publishedAt)}
                    </p>
                    <p className="text-sm text-green-700">{article.readTime} минути четене</p>
                  </div>
                </div>
              </header>
              
              {/* Featured Image */}
              <div className="mb-12">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  width={1200}
                  height={384}
                  className="w-full h-96 object-cover rounded-none shadow-2xl"
                />
              </div>
              
              {/* Content */}
              <div className="prose prose-xl max-w-none prose-gray">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
              
              {/* Premium CTA */}
              <PremiumCTA 
                zone="coach" 
                variant="minimal"
                title="🚀 Искаш ли достъп до премиум съдържание за треньори?"
                description="Получи достъп до тренировъчни планове, упражнения и анализи, вдъхновени от Конте в Coach Zone."
              />
            </article>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Table of Contents */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                  Съдържание
                </h3>
                <nav className="space-y-2">
                  <a href="#" className="block text-sm text-black hover:text-green-600 transition-colors">
                    Принцип 1: Интензитет
                  </a>
                  <a href="#" className="block text-sm text-black hover:text-green-600 transition-colors">
                    Принцип 2: Идентичност
                  </a>
                  <a href="#" className="block text-sm text-black hover:text-green-600 transition-colors">
                    Принцип 3: Дисциплина
                  </a>
                </nav>
              </div>
              
              {/* Tags */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                  Тагове
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 hover:border-green-300 hover:text-green-800 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="bg-green-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-2">
                  Абонирай се
                </h3>
                <p className="text-sm text-green-100 mb-4">
                  Получавай най-новите статии и анализи директно в пощата си.
                </p>
                <input
                  type="email"
                  placeholder="Твоят имейл"
                  className="w-full px-3 py-2 text-gray-900 rounded mb-3 text-sm"
                />
                <button className="w-full bg-white text-green-600 py-2 rounded font-medium text-sm hover:bg-gray-100 transition-colors">
                  Абонирай се
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 