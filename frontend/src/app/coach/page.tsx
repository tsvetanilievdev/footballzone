'use client'

import { useState, useMemo } from 'react'
import { Article } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CoachHero from '@/components/zones/CoachHero'
import CategorySelector from '@/components/zones/CategorySelector'
import SubCategorySelector from '@/components/zones/SubCategorySelector'
import CoachArticleCard from '@/components/zones/CoachArticleCard'



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

// Use articles from central data instead
// import { coachZoneArticles } from '@/data/articles'

// Sample coach articles - temporary empty until data migration
const coachArticles: Article[] = []

export default function CoachZonePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  const selectedCategoryData = selectedCategory 
    ? coachCategories.find(cat => cat.id === selectedCategory)
    : null

  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return []
    
    return coachArticles.filter(article => {
      const matchesCategory = article.category === selectedCategory
      const matchesSubcategory = !selectedSubcategory || true // Simplified for now
      
      return matchesCategory && matchesSubcategory
    })
  }, [selectedCategory, selectedSubcategory])

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
      setSelectedSubcategory(null)
    } else {
      setSelectedCategory(categoryId)
      setSelectedSubcategory(null)
    }
  }

  const handleSubcategorySelect = (subcategoryId: string) => {
    if (selectedSubcategory === subcategoryId) {
      setSelectedSubcategory(null)
    } else {
      setSelectedSubcategory(subcategoryId)
    }
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
      {filteredArticles.length > 0 && (
        <section className="py-8 lg:py-12 animate-fade-in-up">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                {selectedCategoryData?.name}
                {selectedSubcategory && selectedCategoryData?.subcategories.find(sub => sub.id === selectedSubcategory) && 
                  ` - ${selectedCategoryData.subcategories.find(sub => sub.id === selectedSubcategory)?.name}`
                }
              </h3>
              <p className="text-gray-600">
                {filteredArticles.length} статии намерени
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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