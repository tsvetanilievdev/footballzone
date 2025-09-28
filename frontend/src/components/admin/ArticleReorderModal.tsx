'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  XMarkIcon,
  Bars3Icon,
  EyeIcon,
  ClockIcon,
  PlusIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { useSeriesDetail, useReorderSeriesArticles, useAddArticleToSeries } from '@/hooks/api/useSeries'
import { useArticles } from '@/hooks/api/useArticles'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import FormErrors from '@/components/ui/FormErrors'
import { parseValidationErrors, ErrorContextEnum } from '@/utils/errorUtils'

// Simple drag and drop implementation without external libraries
interface DragItem {
  id: string
  index: number
}

interface ArticleReorderModalProps {
  seriesId: string
  onClose: () => void
  onSuccess: () => void
}

export default function ArticleReorderModal({ seriesId, onClose, onSuccess }: ArticleReorderModalProps) {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null)
  const [errors, setErrors] = useState<any[]>([])
  const [showAddArticle, setShowAddArticle] = useState(false)
  const [selectedArticleId, setSelectedArticleId] = useState('')

  const { data: series, isLoading: isLoadingSeries } = useSeriesDetail(seriesId, true)
  const { data: availableArticlesResponse } = useArticles({
    page: 1,
    limit: 50,
    status: 'PUBLISHED',
    seriesId: 'null' // Articles not in any series
  })

  const reorderArticles = useReorderSeriesArticles()
  const addArticleToSeries = useAddArticleToSeries()

  // Local state for article order
  const [localArticles, setLocalArticles] = useState<any[]>([])

  useEffect(() => {
    if (series?.articles) {
      // Sort articles by seriesPart
      const sortedArticles = [...series.articles].sort((a, b) => a.seriesPart - b.seriesPart)
      setLocalArticles(sortedArticles)
    }
  }, [series])

  const availableArticles = availableArticlesResponse?.articles || []

  const handleDragStart = useCallback((e: React.DragEvent, article: any, index: number) => {
    setDraggedItem({ id: article.id, index })
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (!draggedItem) return

    const { index: dragIndex } = draggedItem

    if (dragIndex === dropIndex) return

    // Reorder the articles array
    const newArticles = [...localArticles]
    const draggedArticle = newArticles[dragIndex]

    // Remove the dragged item
    newArticles.splice(dragIndex, 1)

    // Insert at new position
    newArticles.splice(dropIndex, 0, draggedArticle)

    // Update seriesPart numbers
    const updatedArticles = newArticles.map((article, index) => ({
      ...article,
      seriesPart: index + 1
    }))

    setLocalArticles(updatedArticles)
    setDraggedItem(null)
  }, [draggedItem, localArticles])

  const handleSaveOrder = async () => {
    try {
      setErrors([])

      const articleOrders = localArticles.map((article, index) => ({
        articleId: article.id,
        seriesPart: index + 1
      }))

      await reorderArticles.mutateAsync({
        seriesId,
        data: { articleOrders }
      })

      onSuccess()
    } catch (error: any) {
      console.error('Failed to reorder articles:', error)
      const parsedErrors = parseValidationErrors(
        error.response?.data?.message || error.message
      )
      setErrors(parsedErrors)
    }
  }

  const handleAddArticle = async () => {
    if (!selectedArticleId) return

    try {
      setErrors([])

      const nextPart = localArticles.length + 1

      await addArticleToSeries.mutateAsync({
        seriesId,
        articleId: selectedArticleId,
        seriesPart: nextPart
      })

      // Refresh series data
      setShowAddArticle(false)
      setSelectedArticleId('')
      onSuccess()
    } catch (error: any) {
      console.error('Failed to add article to series:', error)
      const parsedErrors = parseValidationErrors(
        error.response?.data?.message || error.message
      )
      setErrors(parsedErrors)
    }
  }

  const resetOrder = () => {
    if (series?.articles) {
      const sortedArticles = [...series.articles].sort((a, b) => a.seriesPart - b.seriesPart)
      setLocalArticles(sortedArticles)
    }
  }

  const hasChanges = JSON.stringify(
    localArticles.map((a, i) => ({ id: a.id, part: i + 1 }))
  ) !== JSON.stringify(
    (series?.articles || [])
      .sort((a, b) => a.seriesPart - b.seriesPart)
      .map((a, i) => ({ id: a.id, part: i + 1 }))
  )

  if (isLoadingSeries) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!series) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8">
          <EmptyState
            icon={Bars3Icon}
            title="Серията не е намерена"
            description="Не може да бъде заредена серията за редактиране."
            action={{
              label: 'Затвори',
              onClick: onClose
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Подредба на статии
            </h2>
            <p className="text-gray-600 mt-1">{series.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Error Display */}
          {errors.length > 0 && (
            <FormErrors
              errors={errors}
              context={ErrorContextEnum.CONTENT_MANAGEMENT}
              className="mb-4"
            />
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Инструкции</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Хванете и плъзнете статиите, за да ги пренаредите</li>
              <li>• Номерацията на частите автоматично се обновява</li>
              <li>• Не забравяйте да запазите промените</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddArticle(!showAddArticle)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Добави статия
              </button>

              {hasChanges && (
                <button
                  onClick={resetOrder}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Върни оригиналния ред
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отказ
              </button>
              <button
                onClick={handleSaveOrder}
                disabled={!hasChanges || reorderArticles.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {reorderArticles.isPending && <LoadingSpinner size="sm" />}
                <CheckIcon className="w-4 h-4" />
                Запази реда
              </button>
            </div>
          </div>

          {/* Add Article Section */}
          {showAddArticle && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Добави статия към серията</h3>

              {availableArticles.length === 0 ? (
                <p className="text-sm text-gray-600">Няма достъпни статии за добавяне.</p>
              ) : (
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label htmlFor="articleSelect" className="block text-sm text-gray-700 mb-1">
                      Изберете статия
                    </label>
                    <select
                      id="articleSelect"
                      value={selectedArticleId}
                      onChange={(e) => setSelectedArticleId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Изберете статия --</option>
                      {availableArticles.map((article) => (
                        <option key={article.id} value={article.id}>
                          {article.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleAddArticle}
                    disabled={!selectedArticleId || addArticleToSeries.isPending}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {addArticleToSeries.isPending && <LoadingSpinner size="sm" />}
                    Добави
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Articles List */}
          {localArticles.length === 0 ? (
            <EmptyState
              icon={Bars3Icon}
              title="Няма статии в серията"
              description="Добавете първата статия към серията."
              action={{
                label: 'Добави статия',
                onClick: () => setShowAddArticle(true)
              }}
            />
          ) : (
            <div className="space-y-3">
              {localArticles.map((article, index) => (
                <div
                  key={article.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, article, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`bg-white border-2 border-gray-200 rounded-lg p-4 cursor-move hover:border-blue-300 hover:shadow-md transition-all ${
                    draggedItem?.id === article.id ? 'opacity-50 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Drag Handle */}
                    <div className="flex-shrink-0">
                      <Bars3Icon className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* Part Number */}
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {index + 1}
                      </span>
                    </div>

                    {/* Article Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <EyeIcon className="w-3 h-3" />
                          {article.viewCount || 0} прегледи
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {article.readTime} мин
                        </span>
                        <span>
                          Публикувана: {new Date(article.publishedAt).toLocaleDateString('bg-BG')}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => window.open(`/read/${article.slug}`, '_blank')}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Преглед"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Original vs Current Position Indicator */}
                  {article.seriesPart !== index + 1 && (
                    <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                      Преместена от част {article.seriesPart} → част {index + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Change Summary */}
          {hasChanges && localArticles.length > 0 && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-900 mb-2">Промени за запазване</h3>
              <div className="text-sm text-yellow-800">
                <p>Статиите ще бъдат пренаредени според новата подредба.</p>
                <p className="mt-1">Натиснете "Запази реда" за да потвърдите промените.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}