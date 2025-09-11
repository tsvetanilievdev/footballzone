'use client'

import React, { useState } from 'react'
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useSeries, usePopularSeries, useCreateSeries } from '@/hooks/api/useSeries'
import SeriesCard from '@/components/series/SeriesCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Pagination from '@/components/ui/Pagination'
import { useAuth } from '@/hooks/useAuth'

const SeriesManagementPage: React.FC = () => {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const { 
    data: seriesData, 
    isLoading: seriesLoading,
    error: seriesError 
  } = useSeries({
    category: category || undefined,
    status: status || undefined,
    search: search || undefined,
    page: currentPage,
    limit: 12
  })

  const { data: popularSeries } = usePopularSeries(6)
  const createSeries = useCreateSeries()

  const categories = [
    { value: '', label: 'Всички категории' },
    { value: 'TACTICS', label: 'Тактика' },
    { value: 'TECHNIQUE', label: 'Техника' },
    { value: 'FITNESS', label: 'Фитнес' },
    { value: 'PSYCHOLOGY', label: 'Психология' },
    { value: 'YOUTH_DEVELOPMENT', label: 'Младежко развитие' },
    { value: 'COACHING', label: 'Треньорство' }
  ]

  const statuses = [
    { value: '', label: 'Всички статуси' },
    { value: 'DRAFT', label: 'Чернова' },
    { value: 'ACTIVE', label: 'Активни' },
    { value: 'COMPLETED', label: 'Завършени' },
    { value: 'ARCHIVED', label: 'Архивирани' }
  ]

  const isAuthorized = user && (user.role === 'ADMIN' || user.role === 'COACH')

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Нямате достъп
          </h1>
          <p className="text-gray-600">
            Тази страница е достъпна само за администратори и треньори.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Управление на серии
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Създавайте и управлявайте образователни серии статии
              </p>
            </div>
            
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Нова серия
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Popular Series */}
        {popularSeries && popularSeries.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Популярни серии
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularSeries.map((series) => (
                <SeriesCard
                  key={series.id}
                  series={series}
                  size="medium"
                  showProgress={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Филтри</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Търсене
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Търсете по име..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statuses.map((stat) => (
                  <option key={stat.value} value={stat.value}>
                    {stat.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearch('')
                  setCategory('')
                  setStatus('')
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Изчисти филтри
              </button>
            </div>
          </div>
        </div>

        {/* Series List */}
        {seriesLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : seriesError ? (
          <div className="text-center py-12">
            <p className="text-red-600">Грешка при зареждане на сериите</p>
          </div>
        ) : seriesData && seriesData.series.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {seriesData.series.map((series) => (
                <SeriesCard
                  key={series.id}
                  series={series}
                  size="medium"
                  showProgress={false}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {seriesData.pages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={seriesData.pages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Не са намерени серии</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Създай първата серия
            </button>
          </div>
        )}
      </div>

      {/* Create Form Modal - Simplified for now */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Нова серия
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Име на серията
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Въведете име..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {categories.slice(1).map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Кратко описание на серията..."
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Отмени
              </button>
              <button
                disabled={createSeries.isPending}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
              >
                {createSeries.isPending ? 'Създаване...' : 'Създай'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SeriesManagementPage