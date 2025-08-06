'use client'

import { useState, useMemo } from 'react'
import { Article } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ParentsHero from '@/components/zones/ParentsHero'
import ParentCategoryGrid from '@/components/zones/ParentCategoryGrid'
import ParentSubCategories from '@/components/zones/ParentSubCategories'
import ParentArticleCard from '@/components/zones/ParentArticleCard'


// Parent Zone Categories with comprehensive support content
const parentCategories = [
  {
    id: 'child-development',
    name: 'Детско развитие',
    icon: '🌱',
    description: 'Физическо и ментално развитие на детето',
    color: 'green',
    gradient: 'from-green-400 via-green-500 to-green-600',
    subcategories: [
      { id: 'physical-growth', name: 'Физическо развитие', count: 18, icon: '📈', priority: 'high' },
      { id: 'motor-skills', name: 'Моторни умения', count: 15, icon: '🤸', priority: 'high' },
      { id: 'cognitive-dev', name: 'Когнитивно развитие', count: 12, icon: '🧠', priority: 'medium' },
      { id: 'social-skills', name: 'Социални умения', count: 20, icon: '👥', priority: 'high' },
      { id: 'talent-recognition', name: 'Разпознаване на талант', count: 8, icon: '⭐', priority: 'medium' }
    ]
  },
  {
    id: 'safety-first-aid',
    name: 'Безопасност и първа помощ',
    icon: '🚑',
    description: 'Превенция на травми и спешни грижи',
    color: 'red',
    gradient: 'from-red-400 via-red-500 to-red-600',
    subcategories: [
      { id: 'injury-prevention', name: 'Превенция на травми', count: 22, icon: '🛡️', priority: 'high' },
      { id: 'first-aid', name: 'Първа помощ', count: 16, icon: '🩹', priority: 'high' },
      { id: 'heat-safety', name: 'Безопасност при жега', count: 10, icon: '☀️', priority: 'high' },
      { id: 'equipment-safety', name: 'Безопасност на екипировката', count: 14, icon: '⚽', priority: 'medium' },
      { id: 'concussion-awareness', name: 'Състезания - осведоменост', count: 12, icon: '🧠', priority: 'high' }
    ]
  },
  {
    id: 'nutrition-health',
    name: 'Хранене и здраве',
    icon: '🥗',
    description: 'Правилно хранене и здравословни навици',
    color: 'orange',
    gradient: 'from-orange-400 via-orange-500 to-orange-600',
    subcategories: [
      { id: 'sports-nutrition', name: 'Спортно хранене', count: 25, icon: '🍎', priority: 'high' },
      { id: 'hydration', name: 'Хидратация', count: 12, icon: '💧', priority: 'high' },
      { id: 'meal-planning', name: 'Планиране на храненето', count: 18, icon: '📅', priority: 'medium' },
      { id: 'supplements', name: 'Хранителни добавки', count: 8, icon: '💊', priority: 'medium' },
      { id: 'healthy-habits', name: 'Здравословни навици', count: 20, icon: '✨', priority: 'high' }
    ]
  },
  {
    id: 'psychology-support',
    name: 'Психология и подкрепа',
    icon: '💝',
    description: 'Емоционална подкрепа и мотивация',
    color: 'purple',
    gradient: 'from-purple-400 via-purple-500 to-purple-600',
    subcategories: [
      { id: 'motivation', name: 'Мотивация', count: 16, icon: '🔥', priority: 'high' },
      { id: 'stress-management', name: 'Управление на стреса', count: 14, icon: '🧘', priority: 'high' },
      { id: 'confidence-building', name: 'Изграждане на увереност', count: 18, icon: '💪', priority: 'high' },
      { id: 'parent-support', name: 'Подкрепа за родители', count: 22, icon: '🤝', priority: 'high' },
      { id: 'dealing-with-failure', name: 'Преодоляване на неуспехи', count: 12, icon: '🌟', priority: 'medium' }
    ]
  },
  {
    id: 'education-planning',
    name: 'Образование и планиране',
    icon: '📚',
    description: 'Баланс между спорт и образование',
    color: 'blue',
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
    subcategories: [
      { id: 'academic-balance', name: 'Баланс учене-спорт', count: 20, icon: '⚖️', priority: 'high' },
      { id: 'career-planning', name: 'Планиране на кариера', count: 15, icon: '🎯', priority: 'medium' },
      { id: 'scholarship-info', name: 'Стипендии и възможности', count: 10, icon: '🏆', priority: 'medium' },
      { id: 'time-management', name: 'Управление на времето', count: 18, icon: '⏰', priority: 'high' },
      { id: 'goal-setting', name: 'Поставяне на цели', count: 12, icon: '📈', priority: 'high' }
    ]
  }
]

// Use centralized articles - filter for parent zone
// import { allArticles } from '@/data/articles'

// Sample articles for parents zone - temporary empty until data migration
const sampleParentArticles: Article[] = []

/* Mock data fallback if no parent articles found
{
    id: '1',
    title: 'Как да разпознаем футболния талант при детето си',
    slug: 'recognize-football-talent-child',
    excerpt: 'Практически съвети за родители как да идентифицират и развиват спортните способности на детето си.',
    content: '',
    featuredImage: '/images/talent-recognition.jpg',
    author: { name: 'Д-р Петър Петров', avatar: '/avatars/dr-petrov.jpg' },
    category: 'parent',
    subcategory: 'talent-recognition',
    tags: ['талант', 'развитие', 'деца'],
    publishedAt: new Date('2024-01-15'),
    readTime: 8,
    isPremium: true
  },
  {
    id: '2',
    title: 'Първа помощ при спортни травми при деца',
    slug: 'first-aid-sports-injuries-children',
    excerpt: 'Основни знания за оказване на първа помощ при най-честите травми във футбола.',
    content: '',
    featuredImage: '/images/first-aid-sports.jpg',
    author: { name: 'Д-р Мария Георгиева', avatar: '/avatars/dr-maria.jpg' },
    category: 'parent',
    subcategory: 'first-aid',
    tags: ['първа помощ', 'травми', 'безопасност'],
    publishedAt: new Date('2024-01-12'),
    readTime: 10,
    isPremium: true
  },
  {
    id: '3',
    title: 'Хранителен план за младите футболисти',
    slug: 'nutrition-plan-young-footballers',
    excerpt: 'Как да съставим правилно меню за детето си, което играе футбол - практически съвети и рецепти.',
    content: '',
    featuredImage: '/images/youth-nutrition.jpg',
    author: { name: 'Нутриционист Елена Стоянова', avatar: '/avatars/elena.jpg' },
    category: 'parent',
    subcategory: 'sports-nutrition',
    tags: ['хранене', 'диета', 'младежи'],
    publishedAt: new Date('2024-01-10'),
    readTime: 12,
    isPremium: true
  },
  {
    id: '4',
    title: 'Как да мотивираме детето си след загуба',
    slug: 'motivate-child-after-loss',
    excerpt: 'Психологически подходи за преодоляване на разочарованието и изграждане на устойчивост.',
    content: '',
    featuredImage: '/images/child-motivation.jpg',
    author: { name: 'Психолог Иван Димитров', avatar: '/avatars/ivan-psychologist.jpg' },
    category: 'parent',
    subcategory: 'motivation',
    tags: ['мотивация', 'психология', 'детска психика'],
    publishedAt: new Date('2024-01-08'),
    readTime: 6,
    isPremium: false
  },
  {
    id: '5',
    title: 'Баланс между учене и спорт',
    slug: 'balance-education-sports',
    excerpt: 'Стратегии за успешно съчетаване на академичните изисквания и спортните тренировки.',
    content: '',
    featuredImage: '/images/education-sports-balance.jpg',
    author: { name: 'Педагог Анна Николова', avatar: '/avatars/anna-pedagog.jpg' },
    category: 'parent',
    subcategory: 'academic-balance',
    tags: ['образование', 'баланс', 'планиране'],
    publishedAt: new Date('2024-01-05'),
    readTime: 9,
    isPremium: true
  },
  {
    id: '6',
    title: 'Превенция на травми при младите спортисти',
    slug: 'injury-prevention-young-athletes',
    excerpt: 'Ефективни методи за предотвратяване на най-честите спортни травми при деца.',
    content: '',
    featuredImage: '/images/injury-prevention.jpg',
    author: { name: 'Физиотерапевт Георги Стефанов', avatar: '/avatars/georgi-physio.jpg' },
    category: 'parent',
    subcategory: 'injury-prevention',
    tags: ['превенция', 'травми', 'здраве'],
    publishedAt: new Date('2024-01-03'),
    readTime: 11,
    isPremium: true
  }
] */

export default function ParentsZone() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)

  // Filter articles based on selected category and subcategory
  const filteredArticles = useMemo(() => {
    let filtered = sampleParentArticles

    if (selectedCategory && selectedSubCategory) {
      filtered = filtered.filter(article => 
        article.subcategory === selectedSubCategory
      )
    } else if (selectedCategory) {
      const category = parentCategories.find(cat => cat.id === selectedCategory)
      const subcategoryIds = category?.subcategories.map(sub => sub.id) || []
      filtered = filtered.filter(article => 
        subcategoryIds.includes(article.subcategory || '')
      )
    }

    return filtered
  }, [selectedCategory, selectedSubCategory])

  const selectedCategoryData = parentCategories.find(cat => cat.id === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <ParentsHero />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Category Selection */}
        {!selectedCategory ? (
          <ParentCategoryGrid 
            categories={parentCategories}
            onCategorySelect={setSelectedCategory}
          />
        ) : (
          <div className="space-y-8">
            {/* Back Button */}
            <button
              onClick={() => {
                setSelectedCategory(null)
                setSelectedSubCategory(null)
              }}
              className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Обратно към категориите
            </button>

            {/* Selected Category Header */}
            <div className={`bg-gradient-to-r ${selectedCategoryData?.gradient} rounded-2xl p-8 text-white`}>
              <div className="flex items-center space-x-4">
                <span className="text-4xl">{selectedCategoryData?.icon}</span>
                <div>
                  <h2 className="text-3xl font-bold">{selectedCategoryData?.name}</h2>
                  <p className="text-lg opacity-90 mt-2">{selectedCategoryData?.description}</p>
                </div>
              </div>
            </div>

            {/* Sub-category Selection */}
            {selectedCategoryData && (
              <ParentSubCategories
                subcategories={selectedCategoryData.subcategories}
                selectedSubCategory={selectedSubCategory}
                onSubCategorySelect={setSelectedSubCategory}
                categoryColor={selectedCategoryData.color}
              />
            )}

            {/* Articles Grid */}
            {filteredArticles.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                  {selectedSubCategory ? 
                    `Статии в "${selectedCategoryData?.subcategories.find(sub => sub.id === selectedSubCategory)?.name}"` :
                    `Всички статии в "${selectedCategoryData?.name}"`
                  }
                  <span className="ml-2 text-lg font-normal text-gray-600">
                    ({filteredArticles.length} статии)
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArticles.map((article) => (
                    <ParentArticleCard 
                      key={article.id} 
                      article={article}
                      categoryColor={selectedCategoryData?.color || 'purple'}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
} 