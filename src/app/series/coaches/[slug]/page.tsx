'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  EyeIcon, 
  DocumentTextIcon, 
  RectangleStackIcon, 
  UserIcon,
  StarIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { coachZoneArticles } from '@/data/articles'

// Mock coach profile data - in real implementation this would come from database
const getCoachProfile = (slug: string) => {
  const profiles = {
    'antonio-conte': {
      name: 'Antonio Conte',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&h=400&fit=crop',
      currentTeam: 'Former Chelsea, Inter, Juventus',
      position: 'Head Coach',
      nationality: 'Italy',
      birthDate: '1969-07-31',
      description: 'Антонио Конте е един от най-успешните треньори в съвременния футбол, известен със своята интензивна философия и тактическа гениалност.',
      biography: `
        <p>Антонио Конте е италиански футболен треньор, който се утвърди като един от най-влиятелните тактици в съвременния футбол. Роден в Лече, Италия, той започва кариерата си като играч, но истинската му слава идва като треньор.</p>
        
        <h3>Ранна кариера</h3>
        <p>Като играч, Конте прекарва по-голямата част от кариерата си в Ювентус, където печели множество титли като капитан на отбора. Неговото лидерство и тактическо разбиране се проявяват още от играческите му години.</p>
        
        <h3>Треньорска философия</h3>
        <p>Конте е известен със своята интензивна, почти военна дисциплина. Неговите отбори се характеризират с високо натискане, организирана защита и бързи преходи от защита в атака.</p>
      `,
      specialties: ['3-5-2 Formation', 'Intensive Training', 'Team Psychology', 'Tactical Discipline'],
      achievements: [
        'Serie A Champion (3x with Juventus)',
        'Premier League Champion (Chelsea)',
        'Serie A Champion (Inter Milan)',
        'UEFA Euro 2016 Quarter-finalist (Italy NT)'
      ],
      socialLinks: {
        instagram: '',
        twitter: '',
        website: ''
      },
      stats: {
        totalArticles: 8,
        totalSeries: 3,
        totalViews: 45200,
        averageRating: 4.8
      }
    }
  }
  
  return profiles[slug as keyof typeof profiles] || null
}

// Mock categories for this coach
const coachCategories = [
  {
    id: 'philosophy',
    name: 'Философия',
    slug: 'philosophy',
    icon: '🧠',
    color: '#10b981',
    description: 'Основните принципи и подход на Конте',
    articleCount: 3
  },
  {
    id: 'tactics',
    name: 'Тактика',
    slug: 'tactics', 
    icon: '⚡',
    color: '#3b82f6',
    description: 'Тактически схеми и формации',
    articleCount: 2
  },
  {
    id: 'training',
    name: 'Тренировки',
    slug: 'training',
    icon: '💪',
    color: '#f59e0b',
    description: 'Методи и интензивност на тренировките',
    articleCount: 3
  }
]

export default function CoachProfilePage() {
  const params = useParams()
  const slug = params.slug as string
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const profile = getCoachProfile(slug)
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Профилът не е намерен</h1>
          <Link href="/series/coaches" className="text-blue-600 hover:text-blue-700">
            Обратно към треньорите
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Преглед', icon: EyeIcon },
    { id: 'articles', name: 'Статии', icon: DocumentTextIcon },
    { id: 'series', name: 'Поредици', icon: RectangleStackIcon },
    { id: 'about', name: 'За него', icon: UserIcon }
  ]

  const relatedArticles = coachZoneArticles.filter(article => 
    selectedCategory === 'all' || article.category.toLowerCase().includes(selectedCategory)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative">
          {/* Cover Image */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <Image
              src={profile.coverImage}
              alt={`${profile.name} cover`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Back Navigation */}
            <div className="absolute top-6 left-6">
              <Link 
                href="/series/coaches" 
                className="inline-flex items-center text-white hover:text-gray-200 font-medium transition-colors group bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Обратно към треньорите
              </Link>
            </div>
          </div>

          {/* Profile Info */}
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="relative -mt-32 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-6 border-white shadow-xl bg-white">
                    <Image
                      src={profile.avatar}
                      alt={profile.name}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-white text-lg font-bold">✓</span>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {profile.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    {profile.currentTeam}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{profile.stats.totalArticles}</div>
                      <div className="text-sm text-gray-600">Статии</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{profile.stats.totalSeries}</div>
                      <div className="text-sm text-gray-600">Поредици</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{profile.stats.totalViews.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Гледания</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                        <span className="text-2xl font-bold text-yellow-600">{profile.stats.averageRating}</span>
                      </div>
                      <div className="text-sm text-gray-600">Рейтинг</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="border-b border-gray-200 bg-white sticky top-20 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-12"
              >
                {/* Description */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">За треньора</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {profile.description}
                  </p>
                </div>

                {/* Specialties */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Специалности</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {profile.specialties.map((specialty, index) => (
                      <div key={specialty} className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Категории съдържание</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {coachCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`#articles`}
                        onClick={() => {
                          setActiveTab('articles')
                          setSelectedCategory(category.slug)
                        }}
                        className="group p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
                      >
                        <div className="flex items-center mb-4">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            {category.icon}
                          </div>
                          <div className="ml-4">
                            <h3 className="font-bold text-gray-900 group-hover:text-green-700">{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.articleCount} статии</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-green-600">
                          {category.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Articles Tab */}
            {activeTab === 'articles' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Category Filter */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`
                      px-4 py-2 rounded-full font-medium transition-all
                      ${selectedCategory === 'all' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
                      }
                    `}
                  >
                    Всички ({coachZoneArticles.length})
                  </button>
                  {coachCategories.map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`
                        px-4 py-2 rounded-full font-medium transition-all
                        ${selectedCategory === category.slug 
                          ? 'bg-green-600 text-white' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
                        }
                      `}
                    >
                      {category.name} ({category.articleCount})
                    </button>
                  ))}
                </div>

                {/* Articles Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedArticles.slice(0, 6).map((article) => (
                    <Link
                      key={article.id}
                      href={`/coach/${article.slug}`}
                      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl">📊</span>
                        </div>
                        {article.isPremium && (
                          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                            PREMIUM
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {article.readTime} мин
                          </div>
                          <div className="flex items-center">
                            <TagIcon className="w-4 h-4 mr-1" />
                            {article.difficulty}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Биография</h2>
                  <div 
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: profile.biography }}
                  />
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Постижения</h2>
                  <div className="space-y-3">
                    {profile.achievements.map((achievement) => (
                      <div key={achievement} className="flex items-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                          🏆
                        </div>
                        <span className="font-medium text-gray-900">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}