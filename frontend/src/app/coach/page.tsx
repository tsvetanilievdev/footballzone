'use client'

import { useState, useMemo } from 'react'
import { Article } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CoachHero from '@/components/zones/CoachHero'
import CategorySelector from '@/components/zones/CategorySelector'
import SubCategorySelector from '@/components/zones/SubCategorySelector'
import CoachArticleCard from '@/components/zones/CoachArticleCard'
import { useArticlesByZone } from '@/hooks/api/useArticles'
import { ArticleListSkeleton, InlineLoading } from '@/components/ui/LoadingSpinner'
import { NoArticlesFound } from '@/components/ui/EmptyState'
import { ApiErrorDisplay } from '@/components/ui/ErrorBoundary'
import Pagination from '@/components/ui/Pagination'



// Coach Zone Categories and their subcategories
const coachCategories = [
  {
    id: 'tactics',
    name: 'Тактика',
    icon: '🧠',
    description: 'Тактически схеми и стратегии',
    color: 'blue',
    subcategories: [
      { id: 'formations', name: 'Формации', count: 15 },
      { id: 'attacking', name: 'Атакуваща тактика', count: 12 },
      { id: 'defending', name: 'Защитна тактика', count: 18 },
      { id: 'transitions', name: 'Преходи', count: 8 },
      { id: 'set-pieces', name: 'Стандартни положения', count: 22 }
    ]
  },
  {
    id: 'technique',
    name: 'Техника',
    icon: '⚽',
    description: 'Техническо развитие на играчите',
    color: 'green',
    subcategories: [
      { id: 'ball-control', name: 'Контрол на топка', count: 20 },
      { id: 'passing', name: 'Подаване', count: 16 },
      { id: 'shooting', name: 'Стрелба', count: 14 },
      { id: 'dribbling', name: 'Дриблиране', count: 11 },
      { id: 'first-touch', name: 'Първо докосване', count: 9 }
    ]
  },
  {
    id: 'conditioning',
    name: 'Кондиция',
    icon: '💪',
    description: 'Физическа подготовка и издръжливост',
    color: 'red',
    subcategories: [
      { id: 'endurance', name: 'Издръжливост', count: 13 },
      { id: 'strength', name: 'Сила', count: 17 },
      { id: 'speed', name: 'Скорост', count: 19 },
      { id: 'agility', name: 'Ловкост', count: 12 },
      { id: 'recovery', name: 'Възстановяване', count: 8 }
    ]
  },
  {
    id: 'periodization',
    name: 'Периодизация',
    icon: '📅',
    description: 'Планиране на тренировъчния процес',
    color: 'purple',
    subcategories: [
      { id: 'season-planning', name: 'Сезонно планиране', count: 10 },
      { id: 'training-cycles', name: 'Тренировъчни цикли', count: 14 },
      { id: 'load-management', name: 'Управление на натоварването', count: 7 },
      { id: 'peaking', name: 'Достигане на форма', count: 6 },
      { id: 'recovery-periods', name: 'Периоди на възстановяване', count: 5 }
    ]
  },
  {
    id: 'psychology',
    name: 'Психология',
    icon: '🧘',
    description: 'Ментална подготовка и мотивация',
    color: 'yellow',
    subcategories: [
      { id: 'motivation', name: 'Мотивация', count: 11 },
      { id: 'team-building', name: 'Изграждане на отбор', count: 9 },
      { id: 'stress-management', name: 'Управление на стреса', count: 8 },
      { id: 'confidence', name: 'Увереност', count: 7 },
      { id: 'concentration', name: 'Концентрация', count: 6 }
    ]
  }
]

export default function CoachZonePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const selectedCategoryData = selectedCategory 
    ? coachCategories.find(cat => cat.id === selectedCategory)
    : null

  // Fetch coach articles from API
  const { 
    data: articlesResponse, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useArticlesByZone('COACH', {
    page: currentPage,
    limit: itemsPerPage,
    category: selectedCategory || undefined,
  })

  const articles = articlesResponse?.data || []
  const pagination = articlesResponse?.pagination || { page: 1, total: 0, pages: 1 }

  // Filter articles by subcategory if selected
  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return []
    
    return articles.filter(article => {
      const matchesSubcategory = !selectedSubcategory || true // TODO: implement subcategory filtering when backend supports it
      return matchesSubcategory
    })
  }, [articles, selectedCategory, selectedSubcategory])

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
      setSelectedSubcategory(null)
    } else {
      setSelectedCategory(categoryId)
      setSelectedSubcategory(null)
      setCurrentPage(1) // Reset pagination when changing category
    }
  }

  const handleSubcategorySelect = (subcategoryId: string) => {
    if (selectedSubcategory === subcategoryId) {
      setSelectedSubcategory(null)
    } else {
      setSelectedSubcategory(subcategoryId)
      setCurrentPage(1) // Reset pagination when changing subcategory
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <CoachHero />
      
      {/* Category Selection */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-fade-in-up">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Изберете категория за обучение
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Изследвайте нашите експертни материали разпределени в 5 основни области на треньорската работа
            </p>
          </div>
          
          <CategorySelector 
            categories={coachCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>
      </section>

      {/* Subcategory Selection */}
      {selectedCategoryData && (
        <section className="py-6 lg:py-8 bg-gray-50 animate-fade-in-up">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SubCategorySelector 
              category={selectedCategoryData}
              selectedSubcategory={selectedSubcategory}
              onSubcategorySelect={handleSubcategorySelect}
            />
          </div>
        </section>
      )}

      {/* Articles Display */}
      {selectedCategory && (
        <section className="py-8 lg:py-12 animate-fade-in-up">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                {selectedCategoryData?.name}
                {selectedSubcategory && selectedCategoryData?.subcategories.find(sub => sub.id === selectedSubcategory) && 
                  ` - ${selectedCategoryData.subcategories.find(sub => sub.id === selectedSubcategory)?.name}`
                }
              </h3>
              {!isLoading && (
                <p className="text-gray-600">
                  {filteredArticles.length} статии намерени
                </p>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <ArticleListSkeleton count={6} />
            )}

            {/* Error State */}
            {isError && (
              <ApiErrorDisplay 
                error={error} 
                onRetry={() => refetch()} 
              />
            )}

            {/* Articles Grid */}
            {!isLoading && !isError && (
              <>
                {filteredArticles.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {filteredArticles.map((article, index) => (
                        <div
                          key={article.id}
                          className="animate-fade-in-up hover:-translate-y-2 hover:scale-105 transition-all duration-300"
                          style={{ animationDelay: `${(index + 1) * 100}ms` }}
                        >
                          <CoachArticleCard
                            article={article as unknown as import('@/types').Article}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                      <div className="flex flex-col items-center gap-4">
                        <Pagination
                          currentPage={pagination.page}
                          totalPages={pagination.pages}
                          onPageChange={handlePageChange}
                          className="mb-4"
                        />
                        <p className="text-sm text-gray-600 text-center">
                          Показва статии {((pagination.page - 1) * itemsPerPage) + 1}-{Math.min(pagination.page * itemsPerPage, pagination.total)} от {pagination.total}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <NoArticlesFound />
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* Call to Action when no category selected */}
      {!selectedCategory && (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Започнете вашето треньорско развитие
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Изберете категория отгоре, за да започнете изследването на нашите експертни материали
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                Разгледайте тактиката
              </button>
              <button className="px-8 py-3 border border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors">
                Научете повече
              </button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
} 