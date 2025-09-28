'use client'

import { useState } from 'react'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
  BookOpenIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  Bars3BottomLeftIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'
import {
  useSeries,
  useDeleteSeries,
  useSeriesAnalytics,
  seriesKeys
} from '@/hooks/api/useSeries'
import { useQueryClient } from '@tanstack/react-query'
import type { SeriesFilters, SeriesStatus, SeriesCategory } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'
import SeriesCreateModal from './SeriesCreateModal'
import SeriesEditModal from './SeriesEditModal'
import SeriesAnalyticsModal from './SeriesAnalyticsModal'
import ArticleReorderModal from './ArticleReorderModal'

interface SeriesManagementProps {
  className?: string
}

export default function SeriesManagement({ className = '' }: SeriesManagementProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // State management
  const [filters, setFilters] = useState<SeriesFilters>({
    page: 1,
    limit: 10,
    status: 'ACTIVE',
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  })

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingSeries, setEditingSeries] = useState<string | null>(null)
  const [viewingAnalytics, setViewingAnalytics] = useState<string | null>(null)
  const [reorderingSeries, setReorderingSeries] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // API calls
  const {
    data: seriesResponse,
    isLoading,
    error,
    refetch
  } = useSeries(filters)

  const deleteSeries = useDeleteSeries()

  // Check if user has permissions
  const canManageSeries = user?.role === 'ADMIN' || user?.role === 'COACH'
  const canDeleteSeries = user?.role === 'ADMIN'

  if (!canManageSeries) {
    return (
      <EmptyState
        icon={BookOpenIcon}
        title="Недостъпна функция"
        description="Нямате права за управление на серии от статии."
      />
    )
  }

  const handleDeleteSeries = async (seriesId: string, seriesName: string) => {
    if (!confirm(`Сигурни ли сте, че искате да изтриете серията "${seriesName}"?`)) {
      return
    }

    try {
      await deleteSeries.mutateAsync(seriesId)
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: seriesKeys.lists() })
    } catch (error) {
      console.error('Failed to delete series:', error)
    }
  }

  const handleFilterChange = (key: keyof SeriesFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when changing filters
    }))
  }

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      status: 'ACTIVE',
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={BookOpenIcon}
        title="Грешка при зареждането"
        description="Възникна проблем при зареждането на сериите. Моля, опитайте отново."
        action={{
          label: 'Опитайте отново',
          onClick: () => refetch()
        }}
      />
    )
  }

  const series = seriesResponse?.series || []
  const pagination = seriesResponse?.pagination

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление на серии</h2>
          <p className="text-gray-600 mt-1">
            Създавайте и управлявайте серии от статии
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="w-4 h-4" />
            Филтри
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Нова серия
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Търсене..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Всички категории</option>
              <option value="coaches">Треньори</option>
              <option value="players">Играчи</option>
              <option value="teams">Отбори</option>
              <option value="general">Общи</option>
            </select>

            {/* Status */}
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Всички статуси</option>
              <option value="DRAFT">Чернова</option>
              <option value="ACTIVE">Активни</option>
              <option value="COMPLETED">Завършени</option>
              <option value="ARCHIVED">Архивирани</option>
            </select>

            {/* Sort */}
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-') as [any, any]
                handleFilterChange('sortBy', sortBy)
                handleFilterChange('sortOrder', sortOrder)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="updatedAt-desc">Най-скоро обновени</option>
              <option value="createdAt-desc">Най-нови</option>
              <option value="name-asc">Име (А-Я)</option>
              <option value="articlesCount-desc">Най-много статии</option>
            </select>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Изчисти филтрите
            </button>
          </div>
        </div>
      )}

      {/* Series Grid */}
      {series.length === 0 ? (
        <EmptyState
          icon={BookOpenIcon}
          title="Няма серии"
          description="Все още няма създадени серии. Започнете като създадете първата си серия."
          action={{
            label: 'Създай серия',
            onClick: () => setShowCreateModal(true)
          }}
        />
      ) : (
        <div className="space-y-4">
          {series.map((series) => (
            <div
              key={series.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {series.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      series.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      series.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                      series.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {series.status === 'ACTIVE' ? 'Активна' :
                       series.status === 'DRAFT' ? 'Чернова' :
                       series.status === 'COMPLETED' ? 'Завършена' : 'Архивирана'}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      {series.category === 'coaches' ? 'Треньори' :
                       series.category === 'players' ? 'Играчи' :
                       series.category === 'teams' ? 'Отбори' : 'Общи'}
                    </span>
                  </div>

                  {series.description && (
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {series.description}
                    </p>
                  )}

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>{series.articlesCount} статии</span>
                    <span>{Math.round(series.estimatedReadTime / 60)} мин четене</span>
                    <span>{series.completionRate}% завършеност</span>
                    <span>Обновена {new Date(series.updatedAt).toLocaleDateString('bg-BG')}</span>
                  </div>

                  {series.tags && series.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {series.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {series.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{series.tags.length - 3} още
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => window.open(`/series/${series.slug}`, '_blank')}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Преглед"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setViewingAnalytics(series.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Аналитика"
                  >
                    <ChartBarIcon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setReorderingSeries(series.id)}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Подреди статии"
                  >
                    <Bars3BottomLeftIcon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setEditingSeries(series.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Редактиране"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>

                  {canDeleteSeries && (
                    <button
                      onClick={() => handleDeleteSeries(series.id, series.name)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Изтриване"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => handleFilterChange('page', page)}
            showFirstLast
          />
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <SeriesCreateModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            refetch()
          }}
        />
      )}

      {editingSeries && (
        <SeriesEditModal
          seriesId={editingSeries}
          onClose={() => setEditingSeries(null)}
          onSuccess={() => {
            setEditingSeries(null)
            refetch()
          }}
        />
      )}

      {viewingAnalytics && (
        <SeriesAnalyticsModal
          seriesId={viewingAnalytics}
          onClose={() => setViewingAnalytics(null)}
        />
      )}

      {reorderingSeries && (
        <ArticleReorderModal
          seriesId={reorderingSeries}
          onClose={() => setReorderingSeries(null)}
          onSuccess={() => {
            setReorderingSeries(null)
            refetch()
          }}
        />
      )}
    </div>
  )
}