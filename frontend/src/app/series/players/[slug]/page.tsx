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
  TagIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

// Mock player profile data
const getPlayerProfile = (slug: string) => {
  const profiles = {
    'lionel-messi': {
      name: 'Lionel Messi',
      avatar: 'https://images.unsplash.com/photo-1594736797933-d0d6ac4e5ded?w=400&h=400&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=400&fit=crop',
      currentTeam: 'Inter Miami',
      position: 'Forward',
      nationality: 'Argentina',
      birthDate: '1987-06-24',
      height: '170 cm',
      preferredFoot: 'Left',
      description: 'Най-великият футболист в историята, осемкратен носител на Златната топка и световен шампион.',
      biography: `
        <p>Лионел Меси е аргентински футболист, който се смята за един от най-великите играчи в историята на спорта. Роден в Росарио, Аржентина, той започва кариерата си в Барселона на 13-годишна възраст.</p>
        
        <h3>Кариера в Барселона</h3>
        <p>Меси прекарва цялата си младежка и по-голямата част от професионалната си кариера в ФК Барселона, където печели множество титли и установява невероятни рекорди.</p>
        
        <h3>Стил на игра</h3>
        <p>Известен е със своето невероятно дриблиране, визия и способност да вкарва голове от невъзможни позиции. Неговата лява крака е считана за една от най-точните в историята на футбола.</p>
      `,
      specialties: ['Dribbling', 'Free Kicks', 'Playmaking', 'Goal Scoring'],
      achievements: [
        '8x Ballon d\'Or Winner',
        'World Cup Winner 2022',
        '4x Champions League Winner',
        '10x La Liga Champion',
        'Copa America Winner 2021'
      ],
      socialLinks: {
        instagram: '@leomessi',
        twitter: '',
        website: ''
      },
      stats: {
        totalArticles: 15,
        totalSeries: 6,
        totalViews: 128500,
        averageRating: 5.0,
        careerGoals: 800,
        careerAssists: 350
      }
    },
    'lamine-yamal': {
      name: 'Lamine Yamal',
      avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&h=400&fit=crop',
      currentTeam: 'FC Barcelona',
      position: 'Right Winger',
      nationality: 'Spain',
      birthDate: '2007-07-13',
      height: '178 cm',
      preferredFoot: 'Left',
      description: 'Новата звезда на световния футбол, най-младият играч дебютирал за Барселона.',
      biography: `
        <p>Ламине Ямал е испански футболист, който се счита за едно от най-ярките таланти в съвременния футбол. На едва 16 години той вече прави история в Барселона.</p>
        
        <h3>Ранна кариера</h3>
        <p>Ямал преминава през всички възрастови категории на Барселона и бързо се налага като изключителен талант с невероятна техника и зрялост на терена.</p>
        
        <h3>Стил на игра</h3>
        <p>Известен е със своята скорост, техника и способност да създава голови ситуации. Въпреки младата си възраст, показва изключителна зрялост в решенията си.</p>
      `,
      specialties: ['Youth Development', 'Wing Play', 'Technical Skills', 'Pace'],
      achievements: [
        'Youngest Barca Debutant',
        'Euro 2024 Winner',
        'La Liga Champion',
        'Golden Boy Nominee'
      ],
      socialLinks: {
        instagram: '@lamineyamal',
        twitter: '',
        website: ''
      },
      stats: {
        totalArticles: 5,
        totalSeries: 2,
        totalViews: 32100,
        averageRating: 4.7,
        careerGoals: 8,
        careerAssists: 12
      }
    }
  }
  
  return profiles[slug as keyof typeof profiles] || null
}

// Mock categories for players
const playerCategories = [
  {
    id: 'technique',
    name: 'Техника',
    slug: 'technique',
    icon: '⚽',
    color: '#3b82f6',
    description: 'Технически умения и контрол на топката',
    articleCount: 5
  },
  {
    id: 'tactics',
    name: 'Тактика',
    slug: 'tactics',
    icon: '🧠',
    color: '#10b981',
    description: 'Позиционна игра и тактическо разбиране',
    articleCount: 3
  },
  {
    id: 'fitness',
    name: 'Физика',
    slug: 'fitness',
    icon: '💪',
    color: '#f59e0b',
    description: 'Физическа подготовка и издръжливост',
    articleCount: 2
  },
  {
    id: 'mental',
    name: 'Психология',
    slug: 'mental',
    icon: '🎯',
    color: '#8b5cf6',
    description: 'Ментална подготовка и концентрация',
    articleCount: 5
  }
]

// Mock articles related to players
const playerArticles = [
  {
    id: '1',
    title: 'Дриблиращи техники на Меси',
    slug: 'messi-dribbling-techniques',
    excerpt: 'Анализ на уникалните дриблиращи движения и как да ги приложите',
    category: 'technique',
    readTime: 8,
    difficulty: 'Advanced',
    isPremium: true
  },
  {
    id: '2',
    title: 'Позиционна игра като фалшива девятка',
    slug: 'false-nine-positioning',
    excerpt: 'Как да се движите интелигентно в атакуващата третина',
    category: 'tactics',
    readTime: 12,
    difficulty: 'Intermediate',
    isPremium: false
  },
  {
    id: '3',
    title: 'Изграждане на експлозивност за младите играчи',
    slug: 'youth-explosiveness-training',
    excerpt: 'Специфични упражнения за развитие на скорост и сила',
    category: 'fitness',
    readTime: 15,
    difficulty: 'Beginner',
    isPremium: true
  },
  {
    id: '4',
    title: 'Ментална подготовка преди големи мачове',
    slug: 'mental-preparation-big-games',
    excerpt: 'Техники за концентрация и справяне с напрежението',
    category: 'mental',
    readTime: 10,
    difficulty: 'Intermediate',
    isPremium: false
  }
]

export default function PlayerProfilePage() {
  const params = useParams()
  const slug = params.slug as string
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const profile = getPlayerProfile(slug)
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Профилът не е намерен</h1>
          <Link href="/series/players" className="text-blue-600 hover:text-blue-700">
            Обратно към играчите
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

  const filteredArticles = selectedCategory === 'all' 
    ? playerArticles 
    : playerArticles.filter(article => article.category === selectedCategory)

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
                href="/series/players" 
                className="inline-flex items-center text-white hover:text-gray-200 font-medium transition-colors group bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Обратно към играчите
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
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-white text-lg">⚽</span>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                      {profile.name}
                    </h1>
                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      <StarIcon className="w-4 h-4 mr-1" />
                      <span className="text-sm font-bold">{profile.stats.averageRating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <p className="text-lg text-gray-600">{profile.currentTeam}</p>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      {profile.position}
                    </span>
                  </div>
                  
                  {/* Player-specific stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{profile.stats.totalArticles}</div>
                      <div className="text-sm text-gray-600">Статии</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{profile.stats.careerGoals}</div>
                      <div className="text-sm text-gray-600">Голове</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{profile.stats.careerAssists}</div>
                      <div className="text-sm text-gray-600">Асистенции</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{profile.stats.totalViews.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Гледания</div>
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
                        ? 'border-blue-500 text-blue-600'
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">За играча</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {profile.description}
                  </p>
                  
                  {/* Player Details */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-2xl mr-4">🏃</div>
                      <div>
                        <div className="font-medium text-gray-900">Височина</div>
                        <div className="text-blue-600 font-bold">{profile.height}</div>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl mr-4">🦶</div>
                      <div>
                        <div className="font-medium text-gray-900">Предпочитан крак</div>
                        <div className="text-green-600 font-bold">{profile.preferredFoot}</div>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                      <div className="text-2xl mr-4">🏳️</div>
                      <div>
                        <div className="font-medium text-gray-900">Националност</div>
                        <div className="text-purple-600 font-bold">{profile.nationality}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Специалности</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {profile.specialties.map((specialty, index) => (
                      <div key={specialty} className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
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
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {playerCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`#articles`}
                        onClick={() => {
                          setActiveTab('articles')
                          setSelectedCategory(category.slug)
                        }}
                        className="group p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                      >
                        <div className="text-center">
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            {category.icon}
                          </div>
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-700 mb-2">{category.name}</h3>
                          <p className="text-sm text-gray-600 group-hover:text-blue-600 mb-2">
                            {category.description}
                          </p>
                          <div className="text-sm font-medium text-gray-500">
                            {category.articleCount} статии
                          </div>
                        </div>
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
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                      }
                    `}
                  >
                    Всички ({playerArticles.length})
                  </button>
                  {playerCategories.map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`
                        px-4 py-2 rounded-full font-medium transition-all
                        ${selectedCategory === category.slug 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                        }
                      `}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Articles Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl">⚽</span>
                        </div>
                        {article.isPremium && (
                          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                            PREMIUM
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 line-clamp-2">
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
                    </div>
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
                        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white text-lg mr-4">
                          <TrophyIcon className="w-6 h-6" />
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