'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogCard from '@/components/ui/BlogCard'
import BlogSidebar from '@/components/ui/BlogSidebar'
import SearchAndCategories from '@/components/ui/SearchAndCategories'
import { Article } from '@/types'

// Примерни статии за Read Zone
const readArticles: Article[] = [
  {
    id: '1',
    title: 'Интервю с треньор на голям отбор по футбол',
    slug: 'interview-with-ceo-of-big-data-business',
    excerpt: 'Никой не отхвърля, не харесва или избягва удоволствието само по себе си, защото то е удоволствие, а защото тези, които не знаят как да преследват удоволствието рационално, се сблъскват с последици, които са изключително болезнени...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'interviews',
    tags: ['Интервюта', 'Треньори', 'Тактика'],
    publishedAt: new Date('2024-11-25'),
    readTime: 5,
    isPremium: false,
  },
  {
    id: '2',
    title: 'Тренировъчни методи за подобряване на скоростта',
    slug: 'training-methods-for-speed-improvement',
    excerpt: 'Скоростта е едно от най-важните качества в модерния футбол. Научете как да подобрите скоростните си показатели чрез специализирани тренировки...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'training',
    tags: ['Тренировки', 'Скорост', 'Фитнес'],
    publishedAt: new Date('2024-11-24'),
    readTime: 8,
    isPremium: false,
  },
  {
    id: '3',
    title: 'Анализ на тактиката 4-3-3 в съвременния футбол',
    slug: 'analysis-of-4-3-3-formation',
    excerpt: 'Формацията 4-3-3 е сред най-популярните в съвременния футбол. Анализираме предимствата и недостатъците на тази тактическа схема...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'tactics',
    tags: ['Тактика', 'Формации', 'Анализи'],
    publishedAt: new Date('2024-11-23'),
    readTime: 6,
    isPremium: false,
  },
  {
    id: '4',
    title: 'Новини от световния футбол - трансфери',
    slug: 'world-football-transfer-news',
    excerpt: 'Последните новини от трансферния пазар. Кои са най-горещите имена и какви са очакванията за зимния трансферен прозорец...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'news',
    tags: ['Новини', 'Трансфери', 'Играчи'],
    publishedAt: new Date('2024-11-22'),
    readTime: 9,
    isPremium: false,
  },
  {
    id: '5',
    title: 'Психологическа подготовка преди мач',
    slug: 'psychological-preparation-before-match',
    excerpt: 'Менталната подготовка е ключова за успеха на терена. Научете техники за справяне със стреса и подобряване на концентрацията...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'psychology',
    tags: ['Психология', 'Ментална подготовка', 'Играчи'],
    publishedAt: new Date('2024-11-21'),
    readTime: 7,
    isPremium: false,
  },
  {
    id: '6',
    title: 'Програма за хранене на младите футболисти',
    slug: 'nutrition-program-young-footballers',
    excerpt: 'Правилното хранене е основа за развитието на младите футболисти. Препоръки за балансирано хранене и хидратация...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'nutrition',
    tags: ['Хранене', 'Младежки футбол', 'Здраве'],
    publishedAt: new Date('2024-11-20'),
    readTime: 4,
    isPremium: false,
  },
]

export default function ReadZonePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredArticles = useMemo(() => {
    return readArticles.filter(article => {
      const matchesSearch = searchTerm === '' || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section - Reduced height */}
      <section className="relative bg-black text-white pt-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=1920&h=300&fit=crop&crop=center"
            alt="Blog Header"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:px-8">
          <div className="text-center">
            <div className="mb-2">
              <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">BLOG</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Football Zone Blog
            </h1>
          </div>
        </div>
      </section>

      {/* Search and Categories */}
      <SearchAndCategories 
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />

      {/* Main Content - Adjusted spacing */}
      <section className="py-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Sidebar - Moved to left side */}
            <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
              <BlogSidebar />
            </div>

            {/* Main Content - Moved to right side */}
            <div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2">
              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article, index) => (
                    <BlogCard 
                      key={article.id} 
                      article={article}
                      showVideo={index === 1 || index === 3}
                      showPhoto={index === 0 || index === 4}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">Няма намерени статии, които да отговарят на критериите.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button className="px-2 py-1 text-gray-500 hover:text-gray-700 transition-colors">
                  «
                </button>
                
                <button className="px-3 py-1 bg-green-600 text-white font-medium rounded shadow hover:bg-green-700 transition-colors">
                  1
                </button>
                
                <button className="px-3 py-1 text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  2
                </button>
                
                <button className="px-3 py-1 text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  3
                </button>
                
                <button className="px-3 py-1 text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  4
                </button>
                
                <button className="px-3 py-1 text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  5
                </button>
                
                <button className="px-2 py-1 text-gray-500 hover:text-gray-700 transition-colors">
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 