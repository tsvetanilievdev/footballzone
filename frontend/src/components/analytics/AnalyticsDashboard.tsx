'use client'

import React, { useState } from 'react'
import { 
  useDashboardMetrics, 
  useRealtimeAnalytics, 
  usePerformanceMetrics,
  useExportAnalytics 
} from '@/hooks/api/useAnalytics'
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  EyeIcon, 
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CpuChipIcon,
  ServerIcon,
  CloudIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ComponentType<{ className?: string }>
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {change >= 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">от миналия месец</span>
            </div>
          )}
        </div>
        <div className={`flex-shrink-0 p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

interface ChartCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm ${className}`}>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
)

const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d')
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'content'>('overview')
  
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useDashboardMetrics(dateRange)
  const { data: realtime, isLoading: realtimeLoading } = useRealtimeAnalytics()
  const { data: performance, isLoading: performanceLoading } = usePerformanceMetrics()
  const exportAnalytics = useExportAnalytics()

  const handleExport = (format: 'csv' | 'json') => {
    exportAnalytics.mutate({
      type: 'dashboard',
      format,
      dateRange,
    })
  }

  if (metricsError) {
    return (
      <ErrorBoundary>
        <div className="text-center py-12">
          <p className="text-red-600">Грешка при зареждане на аналитичните данни</p>
        </div>
      </ErrorBoundary>
    )
  }

  const tabs = [
    { id: 'overview' as const, name: 'Преглед', icon: ChartBarIcon },
    { id: 'performance' as const, name: 'Производителност', icon: CpuChipIcon },
    { id: 'content' as const, name: 'Съдържание', icon: DocumentTextIcon }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Аналитика</h1>
            <p className="text-sm text-gray-500 mt-1">Преглед на метрики и производителност</p>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Последните 7 дни</option>
              <option value="30d">Последните 30 дни</option>
              <option value="90d">Последните 90 дни</option>
              <option value="1y">Последната година</option>
            </select>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('csv')}
                disabled={exportAnalytics.isPending}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                disabled={exportAnalytics.isPending}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                JSON
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Real-time indicator */}
        {!realtimeLoading && realtime && (
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>На живо: {realtime.activeUsers || 0} активни потребители</span>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {metricsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : metrics ? (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard
                    title="Общо статии"
                    value={metrics.totalArticles}
                    icon={DocumentTextIcon}
                    color="blue"
                  />
                  <MetricCard
                    title="Общо потребители"
                    value={metrics.totalUsers}
                    icon={UserGroupIcon}
                    color="green"
                  />
                  <MetricCard
                    title="Общо прегледи"
                    value={metrics.totalViews}
                    icon={EyeIcon}
                    color="purple"
                  />
                  <MetricCard
                    title="Конверсия"
                    value={`${metrics.contentMetrics?.conversionRate?.toFixed(1) || 0}%`}
                    icon={ArrowTrendingUpIcon}
                    color="yellow"
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Popular Articles */}
                  <ChartCard title="Популярни статии">
                    <div className="space-y-3">
                      {metrics.popularArticles?.slice(0, 5).map((article, index) => (
                        <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{article.title}</p>
                              <p className="text-xs text-gray-500">{article.category}</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="text-sm font-semibold text-gray-900">{article.views.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">прегледи</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ChartCard>

                  {/* Content Metrics */}
                  <ChartCard title="Метрики на съдържанието">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(metrics.contentMetrics?.avgReadTime / 60) || 0}мин
                        </div>
                        <div className="text-sm text-gray-600">Средно четене</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {metrics.contentMetrics?.bounceRate?.toFixed(1) || 0}%
                        </div>
                        <div className="text-sm text-gray-600">Bounce Rate</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {metrics.contentMetrics?.conversionRate?.toFixed(1) || 0}%
                        </div>
                        <div className="text-sm text-gray-600">Конверсия</div>
                      </div>
                    </div>
                  </ChartCard>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Няма налични данни за този период
              </div>
            )}
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            {performanceLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : performance ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Metrics */}
                <ChartCard title="Системни метрики">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CpuChipIcon className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-gray-600">CPU</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${performance.systemLoad?.cpu || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{performance.systemLoad?.cpu || 0}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ServerIcon className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-600">Памет</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${performance.systemLoad?.memory || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{performance.systemLoad?.memory || 0}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CloudIcon className="w-5 h-5 text-purple-500" />
                        <span className="text-sm text-gray-600">Диск</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${performance.systemLoad?.disk || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{performance.systemLoad?.disk || 0}%</span>
                      </div>
                    </div>
                  </div>
                </ChartCard>

                {/* API Metrics */}
                <ChartCard title="API метрики">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {performance.apiMetrics?.avgResponseTime || 0}ms
                      </div>
                      <div className="text-sm text-gray-600">Средно време</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {performance.apiMetrics?.errorRate?.toFixed(2) || 0}%
                      </div>
                      <div className="text-sm text-gray-600">Процент грешки</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {performance.apiMetrics?.requestsPerMinute || 0}
                      </div>
                      <div className="text-sm text-gray-600">Заявки/мин</div>
                    </div>
                  </div>
                </ChartCard>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Няма налични данни за производителността
              </div>
            )}
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <ChartCard title="Анализ на съдържанието">
              <div className="text-center py-12 text-gray-500">
                Подробен анализ на съдържанието ще бъде добавен скоро
              </div>
            </ChartCard>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsDashboard