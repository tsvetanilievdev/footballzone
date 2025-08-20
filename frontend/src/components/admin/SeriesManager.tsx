'use client'

import { useState } from 'react'
import { 
  PlusIcon, 
  BookOpenIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { formatDateShortBG } from '@/utils/dateUtils'

interface SeriesItem {
  id: string
  name: string
  slug: string
  description: string
  category: 'coaches' | 'players' | 'teams' | 'general'
  status: 'active' | 'draft' | 'completed'
  articleCount: number
  totalPlanned: number
  lastUpdated: Date
  tags: string[]
  coverImage?: string
}

interface SeriesManagerProps {
  onCreateSeries: () => void
  onEditSeries: (series: SeriesItem) => void
  className?: string
}

// Mock data for series
const mockSeries: SeriesItem[] = [
  {
    id: '1',
    name: 'Философията на Антонио Конте',
    slug: 'antonio-conte-philosophy',
    description: 'Дълбочинен анализ на треньорските методи и тактическата философия на Антонио Конте',
    category: 'coaches',
    status: 'active',
    articleCount: 4,
    totalPlanned: 6,
    lastUpdated: new Date('2024-01-15'),
    tags: ['Конте', 'тактика', 'треньорство', '3-5-2'],
    coverImage: '/api/placeholder/300/200'
  },
  {
    id: '2',
    name: 'Еволюцията на Лионел Меси',
    slug: 'messi-evolution',
    description: 'Проследяване на развитието на Меси от млад талант до GOAT',
    category: 'players',
    status: 'completed',
    articleCount: 8,
    totalPlanned: 8,
    lastUpdated: new Date('2024-01-10'),
    tags: ['Меси', 'еволюция', 'техника', 'Барселона', 'ПСЖ'],
    coverImage: '/api/placeholder/300/200'
  },
  {
    id: '3',
    name: 'Тактиката на Манчестър Сити',
    slug: 'man-city-tactics',
    description: 'Как Гуардиола изгражда своята тактическа система в Сити',
    category: 'teams',
    status: 'draft',
    articleCount: 2,
    totalPlanned: 5,
    lastUpdated: new Date('2024-01-12'),
    tags: ['Гуардиола', 'Сити', 'притискане', 'контрол'],
    coverImage: '/api/placeholder/300/200'
  }
]

export default function SeriesManager({
  onCreateSeries,
  onEditSeries,
  className = ''
}: SeriesManagerProps) {
  const [series] = useState<SeriesItem[]>(mockSeries)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredSeries = series.filter(s => {
    const categoryMatch = filterCategory === 'all' || s.category === filterCategory
    const statusMatch = filterStatus === 'all' || s.status === filterStatus
    return categoryMatch && statusMatch
  })

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'coaches': return 'Треньори'
      case 'players': return 'Играчи'
      case 'teams': return 'Отбори'
      case 'general': return 'Общо'
      default: return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'coaches': return 'bg-green-100 text-green-800'
      case 'players': return 'bg-blue-100 text-blue-800'
      case 'teams': return 'bg-purple-100 text-purple-800'
      case 'general': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusName = (status: string) => {
    switch (status) {
      case 'active': return 'Активна'
      case 'completed': return 'Завършена'
      case 'draft': return 'Чернова'
      default: return status
    }
  }


  const getProgressPercent = (current: number, total: number) => {
    return Math.round((current / total) * 100)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление на поредици</h2>
          <p className="text-gray-600 mt-1">
            Създавайте и управлявайте тематични поредици от статии
          </p>
        </div>
        <Button 
          onClick={onCreateSeries}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Нова поредица
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Всички категории</option>
              <option value="coaches">Треньори</option>
              <option value="players">Играчи</option>
              <option value="teams">Отбори</option>
              <option value="general">Общо</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Всички статуси</option>
              <option value="active">Активни</option>
              <option value="completed">Завършени</option>
              <option value="draft">Чернови</option>
            </select>
          </div>

          <div className="flex-1"></div>
          
          <div className="text-sm text-gray-600">
            Общо: {filteredSeries.length} поредици
          </div>
        </div>
      </div>

      {/* Series Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSeries.map(seriesItem => (
          <div key={seriesItem.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            {/* Cover Image */}
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-t-lg"></div>
              <div className="absolute top-4 left-4 right-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(seriesItem.category)}`}>
                    {getCategoryName(seriesItem.category)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(seriesItem.status)}`}>
                    {getStatusName(seriesItem.status)}
                  </span>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg mb-2">
                  {seriesItem.name}
                </h3>
                <div className="flex items-center text-white text-sm">
                  <BookOpenIcon className="w-4 h-4 mr-1" />
                  <span>{seriesItem.articleCount}/{seriesItem.totalPlanned} статии</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {seriesItem.description}
              </p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Прогрес</span>
                  <span className="font-medium">
                    {getProgressPercent(seriesItem.articleCount, seriesItem.totalPlanned)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${getProgressPercent(seriesItem.articleCount, seriesItem.totalPlanned)}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {seriesItem.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {seriesItem.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{seriesItem.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Meta info */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  <span>Обновена {formatDateShortBG(seriesItem.lastUpdated)}</span>
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="w-3 h-3 mr-1" />
                  <span>Series Zone</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 border border-blue-200 rounded transition-colors"
                >
                  <EyeIcon className="w-4 h-4 mr-1" />
                  Преглед
                </button>
                <button
                  onClick={() => onEditSeries(seriesItem)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-green-600 hover:bg-green-50 border border-green-200 rounded transition-colors"
                >
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Редактирай
                </button>
                <button
                  className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Create new series card */}
        <div 
          onClick={onCreateSeries}
          className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
        >
          <PlusIcon className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Създай нова поредица
          </h3>
          <p className="text-sm text-gray-500 text-center">
            Организирай статиите в тематични поредици за по-добра навигация
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">
          📊 Обобщение на поредиците
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-700 font-medium">Общо поредици:</span>
            <p className="text-blue-900 font-semibold">{series.length}</p>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Активни:</span>
            <p className="text-blue-900 font-semibold">
              {series.filter(s => s.status === 'active').length}
            </p>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Общо статии:</span>
            <p className="text-blue-900 font-semibold">
              {series.reduce((sum, s) => sum + s.articleCount, 0)}
            </p>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Планирани:</span>
            <p className="text-blue-900 font-semibold">
              {series.reduce((sum, s) => sum + s.totalPlanned, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}