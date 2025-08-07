'use client'

import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/ui/ArticleCard'
import { Series, Article } from '@/types'
import Link from 'next/link'
import { ArrowLeftIcon, BookOpenIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

// Импортираме статиите
import { allArticles } from '@/data/articles'

// Функция за намиране на серия по slug
function findSeriesBySlug(slug: string, articles: Article[]): Series | null {
  const seriesArticles = articles.filter(article => article.series?.slug === slug)
  
  if (seriesArticles.length === 0) return null

  const firstArticle = seriesArticles[0]
  if (!firstArticle.series) return null

  return {
    name: firstArticle.series.name,
    slug: firstArticle.series.slug,
    description: firstArticle.series.description || '',
    image: firstArticle.featuredImage,
    articleCount: seriesArticles.length,
    tags: [...new Set(seriesArticles.flatMap(a => a.tags))],
    lastUpdated: new Date(Math.max(...seriesArticles.map(a => a.publishedAt.getTime()))),
    articles: seriesArticles.sort((a, b) => (a.series?.part || 0) - (b.series?.part || 0))
  }
}

export default function SeriesDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const series = findSeriesBySlug(slug, allArticles)

  if (!series) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Поредицата не е намерена
              </h1>
              <p className="text-gray-600 mb-6">
                Съжаляваме, но поредицата която търсите не съществува.
              </p>
              <Link 
                href="/read/series"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Назад към поредиците
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('bg-BG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date)
  }

  const totalReadTime = series.articles.reduce((sum, article) => sum + article.readTime, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative bg-gray-900 text-white py-24">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={series.image}
              alt={series.name}
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70" />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-8">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <Link href="/read" className="text-gray-300 hover:text-white transition-colors">
                      Read Zone
                    </Link>
                  </li>
                  <li>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li>
                    <Link href="/read/series" className="text-gray-300 hover:text-white transition-colors">
                      Поредици
                    </Link>
                  </li>
                  <li>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li>
                    <span className="text-gray-300">{series.name}</span>
                  </li>
                </ol>
              </nav>
            </div>

            <div className="max-w-4xl">
              <h1 className="text-5xl font-bold tracking-tight mb-6">
                📚 {series.name}
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                {series.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="w-5 h-5" />
                  <span>{series.articleCount} статии</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5" />
                  <span>~{totalReadTime} мин четене</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>Обновено: {formatDate(series.lastUpdated)}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {series.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Статии в поредицата ({series.articleCount})
              </h2>
              <p className="text-gray-600">
                Препоръчваме да четете статиите в дадения ред за най-добро разбиране на темата.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {series.articles.map((article, index) => (
                <div key={article.id} className="relative">
                  {/* Part Number Badge */}
                  {article.series?.part && (
                    <div className="absolute top-4 left-4 z-10 bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      Част {article.series.part}
                      {article.series.totalParts && ` от ${article.series.totalParts}`}
                    </div>
                  )}
                  
                  <ArticleCard article={article} />
                  
                  {/* Progress connector for non-last items */}
                  {index < series.articles.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border-t border-gray-200 py-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Link 
                href="/read/series"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Назад към всички поредици
              </Link>
              
              <Link 
                href="/read"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Прегледай всички статии
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 