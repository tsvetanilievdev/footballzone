'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SeriesList from '@/components/ui/SeriesList'
import { Series, Article } from '@/types'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

// Извличаме статиите от всички серии (в реалност ще идват от API)
import { allArticles } from '@/data/articles'

// Функция за генериране на серии от статиите
function generateSeriesFromArticles(articles: Article[]): Series[] {
  const seriesMap = new Map<string, Series>()

  articles.forEach(article => {
    if (article.series) {
      const seriesSlug = article.series.slug
      
      if (!seriesMap.has(seriesSlug)) {
        seriesMap.set(seriesSlug, {
          name: article.series.name,
          slug: article.series.slug,
          description: article.series.description || '',
          image: article.featuredImage,
          articleCount: 0,
          tags: [...new Set(articles
            .filter(a => a.series?.slug === seriesSlug)
            .flatMap(a => a.tags)
          )],
          lastUpdated: new Date(Math.max(...articles
            .filter(a => a.series?.slug === seriesSlug)
            .map(a => a.publishedAt.getTime())
          )),
          articles: []
        })
      }

      const series = seriesMap.get(seriesSlug)!
      series.articles.push(article)
      series.articleCount = series.articles.length
    }
  })

  return Array.from(seriesMap.values()).sort((a, b) => 
    b.lastUpdated.getTime() - a.lastUpdated.getTime()
  )
}

const availableSeries = generateSeriesFromArticles(allArticles)

export default function SeriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              {/* Back to Read Zone */}
              <div className="mb-6">
                <Link 
                  href="/read"
                  className="inline-flex items-center text-green-200 hover:text-white transition-colors group"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Назад към Read Zone
                </Link>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                📚 Поредици статии
              </h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                Открийте нашите тематични поредици с дълбочинни анализи, 
                експертни съвети и детайлни ръководства за всички аспекти на футбола
              </p>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-16">
                <div>
                  <div className="text-3xl font-bold">{availableSeries.length}</div>
                  <div className="text-green-200">Активни поредици</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    {availableSeries.reduce((sum, series) => sum + series.articleCount, 0)}
                  </div>
                  <div className="text-green-200">Общо статии</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    {availableSeries.reduce((sum, series) => sum + series.tags.length, 0)}
                  </div>
                  <div className="text-green-200">Различни теми</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Series List */}
        <div className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {availableSeries.length > 0 ? (
              <SeriesList series={availableSeries} />
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Все още няма налични поредици
                </h3>
                <p className="text-gray-600 mb-6">
                  Работим усилено върху създаването на интересни тематични поредици за вас.
                </p>
                <Link 
                  href="/read"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Прегледай всички статии
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Featured Content */}
        <div className="bg-white py-16 border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Защо да четете нашите поредици?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Всяка поредица е внимателно планирана да ви предостави цялостни знания по дадена тема
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Структурирано обучение
                </h3>
                <p className="text-gray-600">
                  Всяка поредица следва логическа последователност от основи към напреднали техники
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔬</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Дълбочинен анализ
                </h3>
                <p className="text-gray-600">
                  Детайлни обяснения, примери от практиката и научно обосновани методи
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Практично приложение
                </h3>
                <p className="text-gray-600">
                  Конкретни съвети и упражнения, които можете да приложите веднага
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 