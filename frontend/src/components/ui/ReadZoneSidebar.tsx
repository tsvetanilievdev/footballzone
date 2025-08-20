'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  TrendingUp, 
  User, 
  BookOpen, 
  Share2, 
  Heart, 
  MessageCircle,
  Calendar,
  Clock,
  Eye,
  Star,
  ChevronDown,
  ChevronUp,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react'
import { Article, Series } from '@/types'
import { formatDateShortBG } from '@/utils/dateUtils'

interface ReadZoneSidebarProps {
  currentArticle?: Article
  onSearchChange?: (searchTerm: string) => void
  onCategoryChange?: (category: string) => void
  onDateFilterChange?: (dateRange: string) => void
  onAuthorFilterChange?: (author: string) => void
}

interface Author {
  id: string
  name: string
  avatar: string
  bio: string
  articleCount: number
  followers: number
  expertise: string[]
}

export default function ReadZoneSidebar({
  currentArticle,
  onSearchChange,
  onCategoryChange,
  onDateFilterChange,
  onAuthorFilterChange
}: ReadZoneSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDateRange, setSelectedDateRange] = useState('all')
  const [selectedAuthor, setSelectedAuthor] = useState('all')
  const [expandedSections, setExpandedSections] = useState({
    filters: true,
    related: true,
    popular: true,
    authors: true,
    series: true,
    social: true
  })

  // Mock data - в реално приложение това ще идва от API
  const popularArticles: Article[] = [
    {
      id: '1',
      title: 'Основни принципи на модерния футбол',
      slug: 'osnovni-printsipi-modern-futbol',
      excerpt: 'Разглеждаме ключовите принципи, които определят модерния футбол...',
      content: '',
      featuredImage: '/images/article-1.jpg',
      author: { name: 'Иван Петров', avatar: '/images/author-1.jpg' },
      category: 'tactics',
      tags: ['тактика', 'модерен футбол'],
      publishedAt: new Date('2024-01-15'),
      readTime: 8,
      isPremium: false,
      zones: ['read'],
      zoneSettings: {
        read: { visible: true, requiresSubscription: false },
        coach: { visible: true, requiresSubscription: false },
        player: { visible: true, requiresSubscription: false },
        parent: { visible: true, requiresSubscription: false }
      },
      template: { id: '1', name: 'Classic', description: '', category: 'read', settings: {} as any }
    },
    {
      id: '2',
      title: 'Психологията на успешния играч',
      slug: 'psihologiya-uspeshen-igrach',
      excerpt: 'Как мисленето влияе на представянето на футболиста...',
      content: '',
      featuredImage: '/images/article-2.jpg',
      author: { name: 'Мария Георгиева', avatar: '/images/author-2.jpg' },
      category: 'psychology',
      tags: ['психология', 'успех'],
      publishedAt: new Date('2024-01-10'),
      readTime: 12,
      isPremium: false,
      zones: ['read'],
      zoneSettings: {
        read: { visible: true, requiresSubscription: false },
        coach: { visible: true, requiresSubscription: false },
        player: { visible: true, requiresSubscription: false },
        parent: { visible: true, requiresSubscription: false }
      },
      template: { id: '1', name: 'Classic', description: '', category: 'read', settings: {} as any }
    }
  ]

  const relatedArticles: Article[] = [
    {
      id: '3',
      title: 'Подобряване на техниката',
      slug: 'podobryavane-tehnika',
      excerpt: 'Практически съвети за подобряване на техническите умения...',
      content: '',
      featuredImage: '/images/article-3.jpg',
      author: { name: 'Стефан Димитров', avatar: '/images/author-3.jpg' },
      category: 'technique',
      tags: ['техника', 'умения'],
      publishedAt: new Date('2024-01-08'),
      readTime: 10,
      isPremium: false,
      zones: ['read'],
      zoneSettings: {
        read: { visible: true, requiresSubscription: false },
        coach: { visible: true, requiresSubscription: false },
        player: { visible: true, requiresSubscription: false },
        parent: { visible: true, requiresSubscription: false }
      },
      template: { id: '1', name: 'Classic', description: '', category: 'read', settings: {} as any }
    }
  ]

  const authors: Author[] = [
    {
      id: '1',
      name: 'Иван Петров',
      avatar: '/images/author-1.jpg',
      bio: 'Експерт по тактически анализ с 15 години опит',
      articleCount: 45,
      followers: 1200,
      expertise: ['тактика', 'анализ', 'стратегия']
    },
    {
      id: '2',
      name: 'Мария Георгиева',
      avatar: '/images/author-2.jpg',
      bio: 'Спортен психолог специализиран в младежки футбол',
      articleCount: 32,
      followers: 890,
      expertise: ['психология', 'младежки футбол', 'мотивация']
    }
  ]

  const series: Series[] = [
    {
      name: 'Основен курс по тактика',
      slug: 'osnoven-kurs-taktika',
      description: 'Пълно ръководство за разбиране на модерната тактика',
      image: '/images/series-1.jpg',
      articleCount: 8,
      tags: ['тактика', 'курс', 'основи'],
      lastUpdated: new Date('2024-01-20'),
      articles: []
    },
    {
      name: 'Психология на успеха',
      slug: 'psihologiya-uspeh',
      description: 'Как да развием мисленето на шампион',
      image: '/images/series-2.jpg',
      articleCount: 6,
      tags: ['психология', 'успех', 'мислене'],
      lastUpdated: new Date('2024-01-18'),
      articles: []
    }
  ]

  const categories = [
    { id: 'all', name: 'Всички', count: 156 },
    { id: 'tactics', name: 'Тактика', count: 34 },
    { id: 'technique', name: 'Техника', count: 28 },
    { id: 'psychology', name: 'Психология', count: 22 },
    { id: 'fitness', name: 'Фитнес', count: 19 },
    { id: 'nutrition', name: 'Хранене', count: 15 },
    { id: 'analysis', name: 'Анализ', count: 18 },
    { id: 'interviews', name: 'Интервюта', count: 20 }
  ]

  const dateRanges = [
    { id: 'all', name: 'Всички периоди' },
    { id: 'today', name: 'Днес' },
    { id: 'week', name: 'Тази седмица' },
    { id: 'month', name: 'Този месец' },
    { id: 'quarter', name: 'Тримесечие' },
    { id: 'year', name: 'Тази година' }
  ]

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange?.(value)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    onCategoryChange?.(category)
  }

  const handleDateRangeChange = (range: string) => {
    setSelectedDateRange(range)
    onDateFilterChange?.(range)
  }

  const handleAuthorChange = (author: string) => {
    setSelectedAuthor(author)
    onAuthorFilterChange?.(author)
  }


  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Advanced Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
        <div 
          className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 cursor-pointer"
          onClick={() => toggleSection('filters')}
        >
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-black">Разширени филтри</h3>
          </div>
          {expandedSections.filters ? (
            <ChevronUp className="w-5 h-5 text-green-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-green-600" />
          )}
        </div>
        
        {expandedSections.filters && (
          <div className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600" />
              <input
                type="text"
                placeholder="Търсете статии..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black placeholder-green-600"
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Категории</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                aria-label="Изберете категория"
                className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black bg-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Период</label>
              <select
                value={selectedDateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                aria-label="Изберете период"
                className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black bg-white"
              >
                {dateRanges.map(range => (
                  <option key={range.id} value={range.id}>
                    {range.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Authors */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Автори</label>
              <select
                value={selectedAuthor}
                onChange={(e) => handleAuthorChange(e.target.value)}
                aria-label="Изберете автор"
                className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black bg-white"
              >
                <option value="all">Всички автори</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Related Articles */}
      {currentArticle && (
        <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 cursor-pointer"
            onClick={() => toggleSection('related')}
          >
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-black">Свързани статии</h3>
            </div>
            {expandedSections.related ? (
              <ChevronUp className="w-5 h-5 text-blue-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-blue-600" />
            )}
          </div>
          
          {expandedSections.related && (
            <div className="p-4 space-y-3">
              {relatedArticles.map(article => (
                <Link 
                  key={article.id} 
                  href={`/read/${article.slug}`}
                  className="block group hover:bg-green-50 rounded-lg p-3 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <img 
                      src={article.featuredImage} 
                      alt={article.title}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-black group-hover:text-green-700 line-clamp-2 text-sm">
                        {article.title}
                      </h4>
                      <p className="text-green-700 text-xs mt-1">
                        {article.author.name} • {formatDateShortBG(article.publishedAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Popular Articles */}
      <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
        <div 
          className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 cursor-pointer"
          onClick={() => toggleSection('popular')}
        >
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-black">Популярни статии</h3>
          </div>
          {expandedSections.popular ? (
            <ChevronUp className="w-5 h-5 text-orange-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-orange-600" />
          )}
        </div>
        
        {expandedSections.popular && (
          <div className="p-4 space-y-3">
            {popularArticles.map((article, index) => (
              <Link 
                key={article.id} 
                href={`/read/${article.slug}`}
                className="block group hover:bg-orange-50 rounded-lg p-3 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-black group-hover:text-orange-700 line-clamp-2 text-sm">
                      {article.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-green-700">
                      <Eye className="w-3 h-3" />
                      <span>1.2k</span>
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime} мин</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Author Profiles */}
      <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
        <div 
          className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 cursor-pointer"
          onClick={() => toggleSection('authors')}
        >
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-black">Авторски профили</h3>
          </div>
          {expandedSections.authors ? (
            <ChevronUp className="w-5 h-5 text-purple-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-purple-600" />
          )}
        </div>
        
        {expandedSections.authors && (
          <div className="p-4 space-y-4">
            {authors.map(author => (
              <div key={author.id} className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <img 
                  src={author.avatar} 
                  alt={author.name}
                  className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-white shadow-lg"
                />
                <h4 className="font-semibold text-black mb-1">{author.name}</h4>
                <p className="text-green-700 text-sm mb-3">{author.bio}</p>
                <div className="flex justify-center space-x-4 text-xs text-green-700">
                  <div>
                    <div className="font-semibold">{author.articleCount}</div>
                    <div>статии</div>
                  </div>
                  <div>
                    <div className="font-semibold">{author.followers}</div>
                    <div>последователи</div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-1 mt-3">
                  {author.expertise.map(skill => (
                    <span 
                      key={skill}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Series Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
        <div 
          className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 cursor-pointer"
          onClick={() => toggleSection('series')}
        >
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-black">Серии</h3>
          </div>
          {expandedSections.series ? (
            <ChevronUp className="w-5 h-5 text-indigo-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-indigo-600" />
          )}
        </div>
        
        {expandedSections.series && (
          <div className="p-4 space-y-3">
            {series.map(seriesItem => (
              <Link 
                key={seriesItem.slug} 
                href={`/read/series/${seriesItem.slug}`}
                className="block group hover:bg-indigo-50 rounded-lg p-3 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <img 
                    src={seriesItem.image} 
                    alt={seriesItem.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-black group-hover:text-indigo-700 line-clamp-2 text-sm">
                      {seriesItem.name}
                    </h4>
                    <p className="text-green-700 text-xs mt-1">
                      {seriesItem.articleCount} статии • {formatDateShortBG(seriesItem.lastUpdated)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Social Elements */}
      <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
        <div 
          className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 cursor-pointer"
          onClick={() => toggleSection('social')}
        >
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-black">Социални</h3>
          </div>
          {expandedSections.social ? (
            <ChevronUp className="w-5 h-5 text-green-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-green-600" />
          )}
        </div>
        
        {expandedSections.social && (
          <div className="p-4 space-y-4">
            {/* Social Media Links */}
            <div>
              <h4 className="font-medium text-black mb-3">Последвайте ни</h4>
              <div className="grid grid-cols-2 gap-2">
                <a 
                  href="#" 
                  className="flex items-center space-x-2 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-black">Facebook</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center space-x-2 p-2 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                >
                  <Twitter className="w-4 h-4 text-sky-600" />
                  <span className="text-sm text-black">Twitter</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center space-x-2 p-2 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span className="text-sm text-black">Instagram</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center space-x-2 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-blue-700" />
                  <span className="text-sm text-black">LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
              <h4 className="font-medium text-black mb-2">Абонирайте се</h4>
              <p className="text-green-700 text-sm mb-3">
                Получете най-новите статии директно в имейла си
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Вашият имейл"
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black placeholder-green-600 text-sm"
                />
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                  Абонирай се
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">1.2k</div>
                <div className="text-xs text-green-600">Последователи</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">156</div>
                <div className="text-xs text-blue-600">Статии</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
