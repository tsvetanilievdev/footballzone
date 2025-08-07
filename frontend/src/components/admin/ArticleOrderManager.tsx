'use client'

import { useState, useRef } from 'react'
import { 
  PencilIcon,
  StarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BarsArrowUpIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon, PaperClipIcon as PinSolidIcon } from '@heroicons/react/24/solid'

interface ArticleOrderItem {
  id: string
  title: string
  category: string
  zone: string
  views: number
  publishedAt: Date
  order: number
  isFeatured: boolean
  isPinned: boolean
  status: 'published' | 'draft' | 'archived'
}

interface ArticleOrderManagerProps {
  articles: ArticleOrderItem[]
  zone?: string
  category?: string
  onReorder: (articles: ArticleOrderItem[]) => void
  onToggleFeatured: (articleId: string) => void
  onTogglePinned: (articleId: string) => void
  className?: string
}

const mockArticles: ArticleOrderItem[] = [
  {
    id: '1',
    title: 'Философията на Антонио Конте - Интензитет и дисциплина',
    category: 'tactics',
    zone: 'coach',
    views: 2847,
    publishedAt: new Date('2024-01-20'),
    order: 1,
    isFeatured: true,
    isPinned: true,
    status: 'published'
  },
  {
    id: '2',
    title: 'Тренировъчен план за младежи U15',
    category: 'training',
    zone: 'coach',
    views: 1923,
    publishedAt: new Date('2024-01-18'),
    order: 2,
    isFeatured: false,
    isPinned: false,
    status: 'published'
  },
  {
    id: '3',
    title: 'Хранене на младия футболист',
    category: 'nutrition',
    zone: 'parent',
    views: 1654,
    publishedAt: new Date('2024-01-16'),
    order: 3,
    isFeatured: true,
    isPinned: false,
    status: 'published'
  },
  {
    id: '4',
    title: 'Тактическа схема 4-3-3 в модерния футбол',
    category: 'tactics',
    zone: 'coach',
    views: 1432,
    publishedAt: new Date('2024-01-15'),
    order: 4,
    isFeatured: false,
    isPinned: false,
    status: 'draft'
  },
  {
    id: '5',
    title: 'Психология в спорта за младите играчи',
    category: 'psychology',
    zone: 'player',
    views: 1289,
    publishedAt: new Date('2024-01-14'),
    order: 5,
    isFeatured: false,
    isPinned: false,
    status: 'published'
  }
]

export default function ArticleOrderManager({ 
  articles = mockArticles, 
  zone, 
  category, 
  onReorder,
  onToggleFeatured,
  onTogglePinned,
  className = '' 
}: ArticleOrderManagerProps) {
  const [sortedArticles, setSortedArticles] = useState(articles.sort((a, b) => a.order - b.order))
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'order' | 'date' | 'views'>('order')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  // Filter articles
  const filteredArticles = sortedArticles.filter(article => {
    if (zone && article.zone !== zone) return false
    if (category && article.category !== category) return false
    if (filterStatus !== 'all' && article.status !== filterStatus) return false
    if (showFeaturedOnly && !article.isFeatured) return false
    return true
  })

  const handleDragStart = (index: number) => {
    dragItem.current = index
    setDraggedIndex(index)
  }

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index
  }

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newArticles = [...filteredArticles]
      const draggedItemContent = newArticles[dragItem.current]
      
      // Remove dragged item
      newArticles.splice(dragItem.current, 1)
      
      // Insert at new position
      newArticles.splice(dragOverItem.current, 0, draggedItemContent)
      
      // Update order numbers
      const updatedArticles = newArticles.map((article, index) => ({
        ...article,
        order: index + 1
      }))
      
      setSortedArticles(updatedArticles)
      onReorder?.(updatedArticles)
    }
    
    dragItem.current = null
    dragOverItem.current = null
    setDraggedIndex(null)
  }

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newArticles = [...filteredArticles]
      const temp = newArticles[index]
      newArticles[index] = newArticles[index - 1]
      newArticles[index - 1] = temp
      
      // Update order numbers
      const updatedArticles = newArticles.map((article, idx) => ({
        ...article,
        order: idx + 1
      }))
      
      setSortedArticles(updatedArticles)
      onReorder?.(updatedArticles)
    }
  }

  const handleMoveDown = (index: number) => {
    if (index < filteredArticles.length - 1) {
      const newArticles = [...filteredArticles]
      const temp = newArticles[index]
      newArticles[index] = newArticles[index + 1]
      newArticles[index + 1] = temp
      
      // Update order numbers
      const updatedArticles = newArticles.map((article, idx) => ({
        ...article,
        order: idx + 1
      }))
      
      setSortedArticles(updatedArticles)
      onReorder?.(updatedArticles)
    }
  }

  const handleSort = (newSortBy: 'order' | 'date' | 'views') => {
    setSortBy(newSortBy)
    const sorted = [...sortedArticles].sort((a, b) => {
      switch (newSortBy) {
        case 'date':
          return b.publishedAt.getTime() - a.publishedAt.getTime()
        case 'views':
          return b.views - a.views
        case 'order':
        default:
          return a.order - b.order
      }
    })
    setSortedArticles(sorted)
  }

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      tactics: 'Тактика',
      training: 'Тренировки',
      nutrition: 'Хранене',
      psychology: 'Психология',
      technique: 'Техника',
      fitness: 'Фитнес'
    }
    return categories[category] || category
  }

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'coach': return 'bg-green-100 text-green-800'
      case 'player': return 'bg-purple-100 text-purple-800'
      case 'parent': return 'bg-orange-100 text-orange-800'
      case 'read': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление на реда</h2>
          <p className="text-gray-600 mt-1">Подредете статиите и задайте приоритети</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showFeaturedOnly 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <StarIcon className="w-4 h-4 mr-1 inline" />
            Само featured
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Сортиране:</label>
              <select 
                value={sortBy}
                onChange={(e) => handleSort(e.target.value as 'order' | 'date' | 'views')}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="order">По ред</option>
                <option value="date">По дата</option>
                <option value="views">По прегледи</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Статус:</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">Всички</option>
                <option value="published">Публикувани</option>
                <option value="draft">Чернови</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Показани: {filteredArticles.length} от {sortedArticles.length} статии
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center text-sm font-medium text-gray-600">
            <div className="w-8"></div>
            <div className="flex-1 px-4">Статия</div>
            <div className="w-24 text-center">Зона</div>
            <div className="w-24 text-center">Статус</div>
            <div className="w-24 text-center">Прегледи</div>
            <div className="w-32 text-center">Действия</div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredArticles.map((article, index) => (
            <div
              key={article.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center p-4 hover:bg-gray-50 transition-colors ${
                draggedIndex === index ? 'opacity-50' : ''
              } ${article.isPinned ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
            >
              {/* Drag Handle */}
              <div className="w-8 flex items-center justify-center cursor-move">
                <BarsArrowUpIcon className="w-5 h-5 text-gray-400" />
              </div>
              
              {/* Article Info */}
              <div className="flex-1 px-4">
                <div className="flex items-center space-x-2 mb-1">
                  {article.isPinned && (
                    <PinSolidIcon className="w-4 h-4 text-blue-600" />
                  )}
                  {article.isFeatured && (
                    <StarSolidIcon className="w-4 h-4 text-yellow-500" />
                  )}
                  <h3 className="font-medium text-gray-900 line-clamp-1">
                    {article.title}
                  </h3>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded-full text-xs ${getZoneColor(article.zone)}`}>
                    {article.zone}
                  </span>
                  <span>{getCategoryName(article.category)}</span>
                  <span>•</span>
                  <span>{article.publishedAt.toLocaleDateString('bg-BG')}</span>
                </div>
              </div>
              
              {/* Zone */}
              <div className="w-24 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getZoneColor(article.zone)}`}>
                  {article.zone}
                </span>
              </div>
              
              {/* Status */}
              <div className="w-24 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                  {article.status === 'published' ? 'Публикувана' : 
                   article.status === 'draft' ? 'Чернова' : 'Архивирана'}
                </span>
              </div>
              
              {/* Views */}
              <div className="w-24 text-center">
                <span className="text-sm font-medium text-gray-900">
                  {article.views.toLocaleString()}
                </span>
              </div>
              
              {/* Actions */}
              <div className="w-32 flex items-center justify-center space-x-1">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  title="Нагоре"
                >
                  <ArrowUpIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === filteredArticles.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  title="Надолу"
                >
                  <ArrowDownIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => onTogglePinned?.(article.id)}
                  className={`p-1 transition-colors ${
                    article.isPinned 
                      ? 'text-blue-600 hover:text-blue-800' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Закачи отгоре"
                >
                  {article.isPinned ? (
                    <PinSolidIcon className="w-4 h-4" />
                  ) : (
                    <PaperClipIcon className="w-4 h-4" />
                  )}
                </button>
                
                <button
                  onClick={() => onToggleFeatured?.(article.id)}
                  className={`p-1 transition-colors ${
                    article.isFeatured 
                      ? 'text-yellow-500 hover:text-yellow-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Маркирай като featured"
                >
                  {article.isFeatured ? (
                    <StarSolidIcon className="w-4 h-4" />
                  ) : (
                    <StarIcon className="w-4 h-4" />
                  )}
                </button>
                
                <button
                  className="p-1 text-blue-600 hover:text-blue-800"
                  title="Редактирай"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {filteredArticles.filter(a => a.isPinned).length}
            </div>
            <div className="text-sm text-gray-600">Закачени</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {filteredArticles.filter(a => a.isFeatured).length}
            </div>
            <div className="text-sm text-gray-600">Featured</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {filteredArticles.filter(a => a.status === 'published').length}
            </div>
            <div className="text-sm text-gray-600">Публикувани</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {filteredArticles.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Общо прегледи</div>
          </div>
        </div>
      </div>
    </div>
  )
}