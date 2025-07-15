'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PlayersHero from '@/components/zones/PlayersHero'
import InteractiveCategoryGrid from '@/components/zones/InteractiveCategoryGrid'
import AnimatedSubCategories from '@/components/zones/AnimatedSubCategories'
import PlayerArticleCard from '@/components/zones/PlayerArticleCard'
import { Article } from '@/types'

// Player Zone Categories with enhanced design data
const playerCategories = [
  {
    id: 'technical-skills',
    name: 'Техника',
    icon: '⚽',
    description: 'Усъвършенствайте основните футболни умения',
    color: 'emerald',
    gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
    bgPattern: 'balls',
    subcategories: [
      { id: 'ball-control', name: 'Контрол на топка', count: 25, icon: '🎯', difficulty: 'Начинаещ' },
      { id: 'dribbling', name: 'Дриблиране', count: 18, icon: '💫', difficulty: 'Средно' },
      { id: 'passing', name: 'Точни подавания', count: 22, icon: '🎪', difficulty: 'Начинаещ' },
      { id: 'shooting', name: 'Стрелба по врата', count: 20, icon: '🚀', difficulty: 'Средно' },
      { id: 'first-touch', name: 'Първо докосване', count: 15, icon: '⭐', difficulty: 'Напреднал' }
    ]
  },
  {
    id: 'physical-fitness',
    name: 'Физическа подготовка',
    icon: '💪',
    description: 'Изградете силно и издръжливо тяло',
    color: 'red',
    gradient: 'from-red-400 via-red-500 to-red-600',
    bgPattern: 'fitness',
    subcategories: [
      { id: 'strength', name: 'Силова тренировка', count: 16, icon: '🏋️', difficulty: 'Средно' },
      { id: 'speed', name: 'Скорост и експлозивност', count: 14, icon: '⚡', difficulty: 'Напреднал' },
      { id: 'endurance', name: 'Издръжливост', count: 12, icon: '🏃', difficulty: 'Начинаещ' },
      { id: 'agility', name: 'Координация и ловкост', count: 18, icon: '🤸', difficulty: 'Средно' },
      { id: 'flexibility', name: 'Гъвкавост', count: 10, icon: '🧘', difficulty: 'Начинаещ' }
    ]
  },
  {
    id: 'tactical-awareness',
    name: 'Тактическо мислене',
    icon: '🧠',
    description: 'Развийте футболния си интелект',
    color: 'blue',
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
    bgPattern: 'tactical',
    subcategories: [
      { id: 'positioning', name: 'Позициониране', count: 13, icon: '📍', difficulty: 'Средно' },
      { id: 'decision-making', name: 'Вземане на решения', count: 11, icon: '🎯', difficulty: 'Напреднал' },
      { id: 'game-reading', name: 'Четене на играта', count: 9, icon: '👁️', difficulty: 'Напреднал' },
      { id: 'team-play', name: 'Отборна игра', count: 15, icon: '🤝', difficulty: 'Средно' },
      { id: 'pressing', name: 'Пресинг', count: 8, icon: '⚔️', difficulty: 'Напреднал' }
    ]
  },
  {
    id: 'mental-strength',
    name: 'Ментална сила',
    icon: '🧘',
    description: 'Постигнете психологическо превъзходство',
    color: 'purple',
    gradient: 'from-purple-400 via-purple-500 to-purple-600',
    bgPattern: 'mindfulness',
    subcategories: [
      { id: 'confidence', name: 'Увереност', count: 12, icon: '💎', difficulty: 'Средно' },
      { id: 'focus', name: 'Концентрация', count: 10, icon: '🎯', difficulty: 'Начинаещ' },
      { id: 'motivation', name: 'Мотивация', count: 14, icon: '🔥', difficulty: 'Начинаещ' },
      { id: 'pressure', name: 'Справяне с натиск', count: 8, icon: '💪', difficulty: 'Напреднал' },
      { id: 'visualization', name: 'Визуализация', count: 6, icon: '🌟', difficulty: 'Средно' }
    ]
  },
  {
    id: 'nutrition-recovery',
    name: 'Хранене и възстановяване',
    icon: '🥗',
    description: 'Оптимизирайте тялото си за върхови постижения',
    color: 'orange',
    gradient: 'from-orange-400 via-orange-500 to-orange-600',
    bgPattern: 'nutrition',
    subcategories: [
      { id: 'meal-planning', name: 'Планиране на храненето', count: 11, icon: '📅', difficulty: 'Начинаещ' },
      { id: 'hydration', name: 'Хидратация', count: 8, icon: '💧', difficulty: 'Начинаещ' },
      { id: 'supplements', name: 'Хранителни добавки', count: 7, icon: '💊', difficulty: 'Средно' },
      { id: 'recovery', name: 'Възстановяване', count: 13, icon: '😴', difficulty: 'Средно' },
      { id: 'match-nutrition', name: 'Хранене в мачови дни', count: 9, icon: '🍌', difficulty: 'Напреднал' }
    ]
  }
]

// Sample player articles
const playerArticles: Article[] = [
  {
    id: '1',
    title: '10 упражнения за подобряване на контрола на топката',
    slug: '10-exercises-ball-control-improvement',
    excerpt: 'Научете основните упражнения за развитие на перфектен контрол на топката. Тези техники ще ви помогнат да се чувствате уверено с топката във всяка ситуация...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    author: { name: 'Христо Стоичков', avatar: '/avatars/admin.jpg' },
    category: 'technical-skills',
    subcategory: 'ball-control',
    tags: ['Техника', 'Контрол', 'Упражнения'],
    publishedAt: new Date('2024-11-25'),
    readTime: 8,
    isPremium: false,
  },
  {
    id: '2',
    title: 'Тайните на великите дриблери',
    slug: 'secrets-of-great-dribblers',
    excerpt: 'Разкрийте секретите на световните звезди в дриблирането. Научете техниките на Меси, Неймар и други майстори на финтовете...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=450&fit=crop',
    author: { name: 'Димитър Бербатов', avatar: '/avatars/admin.jpg' },
    category: 'technical-skills',
    subcategory: 'dribbling',
    tags: ['Дриблиране', 'Техника', 'Финтове'],
    publishedAt: new Date('2024-11-24'),
    readTime: 12,
    isPremium: true,
  },
  {
    id: '3',
    title: 'Силова програма за младите футболисти',
    slug: 'strength-program-young-footballers',
    excerpt: 'Специално разработена силова програма за футболисти под 18 години. Безопасни и ефективни упражнения за изграждане на мускулна маса...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=450&fit=crop',
    author: { name: 'Валери Божинов', avatar: '/avatars/admin.jpg' },
    category: 'physical-fitness',
    subcategory: 'strength',
    tags: ['Сила', 'Тренировка', 'Младежи'],
    publishedAt: new Date('2024-11-23'),
    readTime: 15,
    isPremium: true,
  },
  {
    id: '4',
    title: 'Как да четем играта като професионалист',
    slug: 'how-to-read-game-like-professional',
    excerpt: 'Развийте способността си да предвиждате следващите ходове. Научете как професионалистите анализират ситуациите на терена...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    author: { name: 'Стилиян Петров', avatar: '/avatars/admin.jpg' },
    category: 'tactical-awareness',
    subcategory: 'game-reading',
    tags: ['Тактика', 'Анализ', 'Професионализъм'],
    publishedAt: new Date('2024-11-22'),
    readTime: 10,
    isPremium: false,
  },
  {
    id: '5',
    title: 'Изградете непобедима увереност',
    slug: 'build-unbeatable-confidence',
    excerpt: 'Психологически техники за развиване на увереност на терена. Научете как да се справяте с грешките и да играете с глава нагоре...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=450&fit=crop',
    author: { name: 'Мартин Петров', avatar: '/avatars/admin.jpg' },
    category: 'mental-strength',
    subcategory: 'confidence',
    tags: ['Психология', 'Увереност', 'Ментално здраве'],
    publishedAt: new Date('2024-11-21'),
    readTime: 7,
    isPremium: true,
  },
  {
    id: '6',
    title: 'Пълен ръководител за хранене на футболиста',
    slug: 'complete-footballer-nutrition-guide',
    excerpt: 'Всичко, което трябва да знаете за правилното хранене. От закуска до следтренировъчно възстановяване - пълен план за оптимални резултати...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=450&fit=crop',
    author: { name: 'Ивелин Попов', avatar: '/avatars/admin.jpg' },
    category: 'nutrition-recovery',
    subcategory: 'meal-planning',
    tags: ['Хранене', 'Диета', 'Възстановяване'],
    publishedAt: new Date('2024-11-20'),
    readTime: 18,
    isPremium: true,
  }
]

export default function PlayersZonePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const selectedCategoryData = selectedCategory 
    ? playerCategories.find(cat => cat.id === selectedCategory)
    : null

  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return []
    
    return playerArticles.filter(article => {
      const matchesCategory = article.category === selectedCategory
      const matchesSubcategory = !selectedSubcategory || article.subcategory === selectedSubcategory
      
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <PlayersHero />
      
      {/* Interactive Category Grid */}
      <section className="py-12 lg:py-16 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-green-50/50"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20 translate-x-48 translate-y-48"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full text-sm font-semibold mb-6">
              🏆 Развийте своите умения
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Изберете областта за развитие
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Открийте персонализирани тренировъчни програми и експертни съвети в 5 ключови области на футболното развитие
            </p>
          </div>
          
          <InteractiveCategoryGrid 
            categories={playerCategories}
            selectedCategory={selectedCategory}
            hoveredCategory={hoveredCategory}
            onCategorySelect={handleCategorySelect}
            onCategoryHover={setHoveredCategory}
          />
        </div>
      </section>

      {/* Animated Subcategory Selection */}
      {selectedCategoryData && (
        <AnimatedSubCategories 
          category={selectedCategoryData}
          selectedSubcategory={selectedSubcategory}
          onSubcategorySelect={handleSubcategorySelect}
        />
      )}

      {/* Articles Display */}
      {filteredArticles.length > 0 && (
        <section className="py-12 lg:py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {selectedCategoryData?.name}
                  {selectedSubcategory && selectedCategoryData?.subcategories.find(sub => sub.id === selectedSubcategory) && 
                    ` - ${selectedCategoryData.subcategories.find(sub => sub.id === selectedSubcategory)?.name}`
                  }
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {filteredArticles.length} материала
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {filteredArticles.filter(a => !a.isPremium).length} безплатни
                  </span>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full w-20"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <PlayerArticleCard 
                  key={article.id} 
                  article={article}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action when no category selected */}
      {!selectedCategory && (
        <section className="py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-green-800"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-blue-400/20 rounded-full blur-xl animate-bounce delay-500"></div>
          
          <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="mb-8">
              <span className="text-6xl">⚽</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">
              Започнете вашето футболно пътешествие
            </h2>
            <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed">
              Изберете категория отгоре, за да открийте персонализирани тренировки, експертни съвети и професионални техники
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => handleCategorySelect('technical-skills')}
                className="px-10 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-xl hover:from-green-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Започни с техника
              </button>
              <button 
                onClick={() => handleCategorySelect('physical-fitness')}
                className="px-10 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
              >
                Физическа подготовка
              </button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
} 