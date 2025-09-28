'use client'

import { useState } from 'react'
import {
  XMarkIcon,
  ChartBarIcon,
  EyeIcon,
  UsersIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { useSeriesDetail, useSeriesAnalytics } from '@/hooks/api/useSeries'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'

interface SeriesAnalyticsModalProps {
  seriesId: string
  onClose: () => void
}

export default function SeriesAnalyticsModal({ seriesId, onClose }: SeriesAnalyticsModalProps) {
  const { data: series, isLoading: isLoadingSeries } = useSeriesDetail(seriesId, false)
  const { data: analytics, isLoading: isLoadingAnalytics } = useSeriesAnalytics(seriesId)

  const isLoading = isLoadingSeries || isLoadingAnalytics

  const exportData = () => {
    if (!analytics || !series) return

    const data = {
      series: {
        name: series.name,
        category: series.category,
        status: series.status,
        articlesCount: series.articlesCount
      },
      analytics,
      exportedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `series-analytics-${series.slug}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!series || !analytics) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8">
          <EmptyState
            icon={ChartBarIcon}
            title="Няма данни"
            description="Не могат да бъдат заредени аналитичните данни."
            action={{
              label: 'Затвори',
              onClick: onClose
            }}
          />
        </div>
      </div>
    )
  }

  const { seriesInfo, engagement, progression, articlePerformance } = analytics

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Аналитика за серия
            </h2>
            <p className="text-gray-600 mt-1">{series.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Експорт
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Series Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Статии</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {seriesInfo.articlesCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <EyeIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Общо прегледи</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {engagement.totalViews.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Уникални читатели</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {engagement.uniqueUsers.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ср. време четене</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {Math.round(engagement.avgReadTime / 60)}м
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ангажираност</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Процент завършеност</p>
                  <span className={`inline-flex items-center gap-1 text-sm ${
                    engagement.avgCompletionRate >= 70 ? 'text-green-600' :
                    engagement.avgCompletionRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {engagement.avgCompletionRate >= 70 ? (
                      <ArrowTrendingUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4" />
                    )}
                    {engagement.avgCompletionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      engagement.avgCompletionRate >= 70 ? 'bg-green-600' :
                      engagement.avgCompletionRate >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${engagement.avgCompletionRate}%` }}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Започнали четене</p>
                <p className="text-2xl font-bold text-blue-600">
                  {progression.usersStarted.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">потребители</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Завършили серията</p>
                <p className="text-2xl font-bold text-green-600">
                  {progression.usersCompleted.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {progression.usersStarted > 0
                    ? `${Math.round((progression.usersCompleted / progression.usersStarted) * 100)}% от започналите`
                    : 'няма данни'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Dropoff Analysis */}
          {progression.dropoffPoints.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Анализ на отпадането</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-3">
                  {progression.dropoffPoints.map((point, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">
                        След статия {point.articleIndex}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              point.dropoffRate >= 50 ? 'bg-red-500' :
                              point.dropoffRate >= 25 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${point.dropoffRate}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${
                          point.dropoffRate >= 50 ? 'text-red-600' :
                          point.dropoffRate >= 25 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {point.dropoffRate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Article Performance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Производителност на статиите</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Част
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Заглавие
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      Прегледи
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      Ср. завършеност
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      Рейтинг
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {articlePerformance.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Част {article.seriesPart}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {article.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {article.views.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {Math.round(article.avgCompletion)}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center">
                          {article.avgCompletion >= 80 ? (
                            <div className="w-4 h-4 bg-green-500 rounded-full" title="Отлична" />
                          ) : article.avgCompletion >= 60 ? (
                            <div className="w-4 h-4 bg-yellow-500 rounded-full" title="Добра" />
                          ) : article.avgCompletion >= 40 ? (
                            <div className="w-4 h-4 bg-orange-500 rounded-full" title="Средна" />
                          ) : (
                            <div className="w-4 h-4 bg-red-500 rounded-full" title="Слаба" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="mt-8 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Обобщение</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                • Серията има <strong>{engagement.uniqueUsers}</strong> уникални читатели с общо <strong>{engagement.totalViews}</strong> прегледи
              </p>
              <p>
                • Средната завършеност е <strong>{engagement.avgCompletionRate}%</strong>, което е {
                  engagement.avgCompletionRate >= 70 ? 'отличен' :
                  engagement.avgCompletionRate >= 50 ? 'добър' : 'слаб'
                } резултат
              </p>
              <p>
                • <strong>{progression.usersCompleted}</strong> от <strong>{progression.usersStarted}</strong> започнали са завършили серията
                {progression.usersStarted > 0 && ` (${Math.round((progression.usersCompleted / progression.usersStarted) * 100)}%)`}
              </p>
              {progression.dropoffPoints.length > 0 && (
                <p>
                  • Най-голямо отпадане: <strong>{Math.max(...progression.dropoffPoints.map(p => p.dropoffRate))}%</strong> след статия {
                    progression.dropoffPoints.find(p => p.dropoffRate === Math.max(...progression.dropoffPoints.map(dp => dp.dropoffRate)))?.articleIndex
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}