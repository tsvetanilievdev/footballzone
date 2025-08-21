'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ClockIcon,
  FireIcon,
  TagIcon,
  UserIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { useArticleSearch, useSearchSuggestions, useSearchHistory } from '@/hooks/api/useSearch'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDateShortBG } from '@/utils/dateUtils'
import type { ArticleZone } from '@/types/articles'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    zone: (searchParams.get('zone') as ArticleZone) || '',
    category: searchParams.get('category') || '',
    author: searchParams.get('author') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    premium: searchParams.get('premium') === 'true' ? true : undefined
  })

  // Search suggestions and history
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  
  // API calls
  const { data: searchResults, isLoading, error } = useArticleSearch({
    q: searchQuery,
    page: currentPage,
    limit: 12,
    ...filters
  })

  const { data: searchHistory } = useSearchHistory()
  const { data: suggestionsData } = useSearchSuggestions({ q: searchQuery, limit: 5 })

  // Update URL when search parameters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (filters.zone) params.set('zone', filters.zone)
    if (filters.category) params.set('category', filters.category)
    if (filters.author) params.set('author', filters.author)
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.set('dateTo', filters.dateTo)
    if (filters.premium !== undefined) params.set('premium', filters.premium.toString())
    
    const newUrl = params.toString() ? `/search?${params.toString()}` : '/search'
    router.replace(newUrl, { scroll: false })
  }, [searchQuery, filters, router])

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    setShowSuggestions(false)
  }

  // Handle filter change
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }))
    setCurrentPage(1)
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      zone: '',
      category: '',
      author: '',
      dateFrom: '',
      dateTo: '',
      premium: undefined
    })
    setCurrentPage(1)
  }

  // Active filters count
  const activeFiltersCount = Object.values(filters).filter(v => v !== '' && v !== undefined).length

  const articles = searchResults?.data?.data || []
  const totalPages = searchResults?.data?.totalPages || 1
  const totalResults = searchResults?.data?.total || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Header />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#000000] mb-4">Търсене</h1>
            
            {/* Search Bar */}
            <div className="relative">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSuggestions(e.target.value.length > 2)
                  }}
                  onFocus={() => setShowSuggestions(searchQuery.length > 2)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery)
                    }
                  }}
                  placeholder="Търси статии, теми, автори..."
                  className="w-full pl-10 pr-12 py-4 text-lg border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleSearch(searchQuery)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Търси
                </button>
              </div>

              {/* Search Suggestions */}
              {showSuggestions && (suggestionsData?.data || searchHistory?.data) && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white border border-green-200 rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto">
                  {/* Suggestions from API */}
                  {suggestionsData?.data && suggestionsData.data.length > 0 && (
                    <div className="p-3">
                      <div className="text-xs font-medium text-gray-500 mb-2">Предложения</div>
                      {suggestionsData.data.map((suggestion: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(suggestion)}
                          className="w-full text-left px-3 py-2 hover:bg-green-50 rounded-lg text-sm"
                        >
                          <MagnifyingGlassIcon className="inline w-4 h-4 mr-2 text-gray-400" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Search History */}
                  {searchHistory?.data && searchHistory.data.length > 0 && (
                    <div className="p-3 border-t border-gray-100">
                      <div className="text-xs font-medium text-gray-500 mb-2">Последни търсения</div>
                      {searchHistory.data.slice(0, 5).map((historyItem: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(historyItem.query)}
                          className="w-full text-left px-3 py-2 hover:bg-green-50 rounded-lg text-sm flex items-center"
                        >
                          <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
                          {historyItem.query}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Filters Toggle */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  showFilters
                    ? 'bg-green-100 border-green-300 text-green-800'
                    : 'bg-white border-green-200 text-gray-700 hover:bg-green-50'
                }`}
              >
                <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
                Филтри
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Изчисти филтрите
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white rounded-lg border border-green-200 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Zone Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Зона
                  </label>
                  <select
                    value={filters.zone}
                    onChange={(e) => handleFilterChange('zone', e.target.value)}
                    className="w-full border border-green-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Всички зони</option>
                    <option value="read">Read Zone</option>
                    <option value="coach">Coach Zone</option>
                    <option value="player">Player Zone</option>
                    <option value="parent">Parent Zone</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full border border-green-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Всички категории</option>
                    <option value="TACTICS">Тактика</option>
                    <option value="TRAINING">Тренировки</option>
                    <option value="PSYCHOLOGY">Психология</option>
                    <option value="NUTRITION">Хранене</option>
                    <option value="TECHNIQUE">Техника</option>
                    <option value="FITNESS">Фитнес</option>
                    <option value="NEWS">Новини</option>
                    <option value="INTERVIEWS">Интервюта</option>
                    <option value="ANALYSIS">Анализи</option>
                  </select>
                </div>

                {/* Author Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Автор
                  </label>
                  <input
                    type="text"
                    value={filters.author}
                    onChange={(e) => handleFilterChange('author', e.target.value)}
                    placeholder="Име на автор..."
                    className="w-full border border-green-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    От дата
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full border border-green-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    До дата
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full border border-green-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Premium Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип съдържание
                  </label>
                  <select
                    value={filters.premium === true ? 'premium' : filters.premium === false ? 'free' : ''}
                    onChange={(e) => handleFilterChange('premium', e.target.value === 'premium' ? true : e.target.value === 'free' ? false : undefined)}
                    className="w-full border border-green-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Всички</option>
                    <option value="free">Безплатно</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="mb-8">
            {/* Results Header */}
            {searchQuery && (
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#000000]">
                    Резултати за "{searchQuery}"
                  </h2>
                  {!isLoading && (
                    <p className="text-gray-600 mt-1">
                      {totalResults > 0 
                        ? `Намерени ${totalResults} резултат${totalResults !== 1 ? 'а' : ''}`
                        : 'Няма намерени резултати'
                      }
                    </p>
                  )}
                </div>

                {/* Sort Options */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Сортиране:</span>
                  <select className="border border-green-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500">
                    <option value="relevance">Релевантност</option>
                    <option value="date">Дата</option>
                    <option value="popularity">Популярност</option>
                    <option value="title">Заглавие</option>
                  </select>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <ErrorBoundary 
                error={error} 
                resetError={() => window.location.reload()}
              />
            )}

            {/* Empty State - No Search Query */}
            {!searchQuery && !isLoading && (
              <EmptyState
                icon={MagnifyingGlassIcon}
                title="Започнете търсене"
                description="Въведете ключови думи, за да намерите статии по ваши интереси"
              />
            )}

            {/* Empty State - No Results */}
            {searchQuery && !isLoading && articles.length === 0 && (
              <EmptyState
                icon={MagnifyingGlassIcon}
                title="Няма намерени резултати"
                description={`Не са намерени статии за "${searchQuery}". Опитайте с други ключови думи или премахнете някои филтри.`}
              />
            )}

            {/* Search Results Grid */}
            {articles.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {articles.map((article: any) => (
                    <SearchResultCard key={article.id} article={article} searchQuery={searchQuery} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Search Result Card Component
function SearchResultCard({ article, searchQuery }: { article: any; searchQuery: string }) {
  // Highlight search terms in title and excerpt
  const highlightText = (text: string, query: string) => {
    if (!query) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  return (
    <div className="bg-white rounded-lg border border-green-100 p-6 hover:shadow-md transition-shadow">
      {/* Article Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            article.zones?.find((z: any) => z.zone === 'coach') ? 'bg-green-100 text-green-800' :
            article.zones?.find((z: any) => z.zone === 'player') ? 'bg-blue-100 text-blue-800' :
            article.zones?.find((z: any) => z.zone === 'parent') ? 'bg-orange-100 text-orange-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {article.zones?.[0]?.zone || 'Read Zone'}
          </span>
          
          {article.isPremium && (
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              Premium
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-[#000000] mb-2 line-clamp-2">
          <a href={`/read/${article.slug}`} className="hover:text-green-600">
            {highlightText(article.title, searchQuery)}
          </a>
        </h3>
        
        {article.excerpt && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {highlightText(article.excerpt, searchQuery)}
          </p>
        )}
      </div>

      {/* Article Meta */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <UserIcon className="w-4 h-4 mr-1" />
            {article.author?.name || 'Football Zone'}
          </div>
          
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1" />
            {formatDateShortBG(new Date(article.publishedAt || article.createdAt))}
          </div>
          
          {article.viewCount > 0 && (
            <div className="flex items-center">
              <EyeIcon className="w-4 h-4 mr-1" />
              {article.viewCount}
            </div>
          )}
        </div>

        <div className="flex items-center">
          <TagIcon className="w-4 h-4 mr-1" />
          {article.category}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchPageContent />
    </Suspense>
  )
}