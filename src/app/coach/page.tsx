'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CoachHero from '@/components/zones/CoachHero'
import CategorySelector from '@/components/zones/CategorySelector'
import SubCategorySelector from '@/components/zones/SubCategorySelector'
import CoachArticleCard from '@/components/zones/CoachArticleCard'
import { Article } from '@/types'

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

// Sample coach articles
const coachArticles: Article[] = [
  {
    id: '1',
    title: 'Модерната 4-3-3 формация в детайли',
    slug: 'modern-4-3-3-formation-details',
    excerpt: 'Подробен анализ на 4-3-3 формацията, нейните варианти и как да я приложите ефективно с различни типове играчи...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    author: { name: 'Димитър Пенев', avatar: '/avatars/admin.jpg' },
    category: 'tactics',
    subcategory: 'formations',
    tags: ['Тактика', 'Формации', '4-3-3'],
    publishedAt: new Date('2024-11-25'),
    readTime: 12,
    isPremium: true,
  },
  {
    id: '2',
    title: 'Упражнения за подобряване на първото докосване',
    slug: 'first-touch-improvement-exercises',
    excerpt: 'Колекция от практични упражнения за развитие на първото докосване при играчите от различни възрасти...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=450&fit=crop',
    author: { name: 'Стилиян Петров', avatar: '/avatars/admin.jpg' },
    category: 'technique',
    subcategory: 'first-touch',
    tags: ['Техника', 'Упражнения', 'Първо докосване'],
    publishedAt: new Date('2024-11-24'),
    readTime: 8,
    isPremium: false,
  },
  {
    id: '3',
    title: 'Планиране на предсезонната подготовка',
    slug: 'preseason-planning-guide',
    excerpt: 'Стъпка по стъпка ръководство за планиране на ефективна предсезонна подготовка за аматьорски и професионални отбори...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=450&fit=crop',
    author: { name: 'Людмил Киров', avatar: '/avatars/admin.jpg' },
    category: 'periodization',
    subcategory: 'season-planning',
    tags: ['Периодизация', 'Планиране', 'Предсезонна подготовка'],
    publishedAt: new Date('2024-11-23'),
    readTime: 15,
    isPremium: true,
  },
  {
    id: '4',
    title: 'Психологическа подготовка преди финал',
    slug: 'psychological-preparation-final',
    excerpt: 'Как да подготвите отбора си психологически за важни мачове и финали. Техники за справяне с напрежението...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    author: { name: 'Георги Дерменджиев', avatar: '/avatars/admin.jpg' },
    category: 'psychology',
    subcategory: 'stress-management',
    tags: ['Психология', 'Стрес', 'Финали'],
    publishedAt: new Date('2024-11-22'),
    readTime: 10,
    isPremium: true,
  },
  {
    id: '5',
    title: 'Интервални тренировки за футболисти',
    slug: 'interval-training-footballers',
    excerpt: 'Научно обосновани интервални тренировки за подобряване на аеробната и анаеробната издръжливост...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=450&fit=crop',
    author: { name: 'Ивайло Петев', avatar: '/avatars/admin.jpg' },
    category: 'conditioning',
    subcategory: 'endurance',
    tags: ['Кондиция', 'Издръжливост', 'Интервални тренировки'],
    publishedAt: new Date('2024-11-21'),
    readTime: 9,
    isPremium: false,
  },
  {
    id: '6',
    title: 'Защита при корнери - модерни подходи',
    slug: 'modern-corner-defending',
    excerpt: 'Анализ на съвременните тенденции в защитата при корнери и практически съвети за тренировка...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=450&fit=crop',
    author: { name: 'Красимир Балъков', avatar: '/avatars/admin.jpg' },
    category: 'tactics',
    subcategory: 'set-pieces',
    tags: ['Тактика', 'Стандартни положения', 'Защита'],
    publishedAt: new Date('2024-11-20'),
    readTime: 7,
    isPremium: true,
  }
]

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <CoachHero />
      
      {/* Category Selection */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
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
        <section className="py-6 lg:py-8 bg-gray-50">
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
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
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
              {filteredArticles.map((article) => (
                <CoachArticleCard 
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