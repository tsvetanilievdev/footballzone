'use client'

import React, { useState } from 'react'
import {
  useDashboardMetrics,
  useRealtimeAnalytics,
  usePerformanceMetrics,
  useExportAnalytics,
  useAnalyticsTimeRange
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
  ArrowDownTrayIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
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

// Sample chart data
const sampleViewsData = [
  { date: '01.09', views: 1200, users: 450 },
  { date: '02.09', views: 1400, users: 520 },
  { date: '03.09', views: 980, users: 380 },
  { date: '04.09', views: 1600, users: 620 },
  { date: '05.09', views: 1350, users: 510 },
  { date: '06.09', views: 1800, users: 700 },
  { date: '07.09', views: 1550, users: 590 },
]

const sampleCategoryData = [
  { name: 'Тактики', value: 35, color: '#3B82F6' },
  { name: 'Тренировки', value: 25, color: '#10B981' },
  { name: 'Техника', value: 20, color: '#F59E0B' },
  { name: 'Фитнес', value: 12, color: '#EF4444' },
  { name: 'Психология', value: 8, color: '#8B5CF6' },
]

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

const AnalyticsDashboard: React.FC = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month')
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'content'>('overview')

  const { getTimeRange } = useAnalyticsTimeRange()
  const timeRange = getTimeRange(period)

  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useDashboardMetrics({
    ...timeRange,
    period
  })
  const { data: realtime, isLoading: realtimeLoading } = useRealtimeAnalytics()
  const { data: performance, isLoading: performanceLoading } = usePerformanceMetrics()
  const exportAnalytics = useExportAnalytics()

  const handleExport = (format: 'csv' | 'json') => {
    exportAnalytics.mutate({
      type: 'dashboard',
      format,
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
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as 'day' | 'week' | 'month' | 'year')}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="day">Днес</option>
                <option value="week">Последната седмица</option>
                <option value="month">Последния месец</option>
                <option value="year">Последната година</option>
              </select>
            </div>
            
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
            ) : (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard
                    title="Общо статии"
                    value={metrics?.totalArticles || 156}
                    change={12.5}
                    icon={DocumentTextIcon}
                    color="blue"
                  />
                  <MetricCard
                    title="Общо потребители"
                    value={metrics?.totalUsers || 1250}
                    change={8.7}
                    icon={UserGroupIcon}
                    color="green"
                  />
                  <MetricCard
                    title="Общо прегледи"
                    value={metrics?.totalViews || 25680}
                    change={15.3}
                    icon={EyeIcon}
                    color="purple"
                  />
                  <MetricCard
                    title="Конверсия"
                    value={`${metrics?.contentMetrics?.conversionRate?.toFixed(1) || 8.2}%`}
                    change={2.1}
                    icon={ArrowTrendingUpIcon}
                    color="yellow"
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Views Trend Chart */}
                  <ChartCard title="Прегледи и потребители">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sampleViewsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                          />
                          <YAxis
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="views"
                            stackId="1"
                            stroke="#3B82F6"
                            fill="#3B82F6"
                            fillOpacity={0.3}
                            name="Прегледи"
                          />
                          <Area
                            type="monotone"
                            dataKey="users"
                            stackId="2"
                            stroke="#10B981"
                            fill="#10B981"
                            fillOpacity={0.3}
                            name="Потребители"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>

                  {/* Popular Articles Bar Chart */}
                  <ChartCard title="Популярни статии">
                    <div className="space-y-3">
                      {(metrics?.popularArticles || [
                        { id: '1', title: 'Философията на Антонио Конте', views: 2847, category: 'Тактики' },
                        { id: '2', title: 'Тренировъчен план за U15', views: 1923, category: 'Тренировки' },
                        { id: '3', title: 'Хранене на младия футболист', views: 1654, category: 'Фитнес' },
                        { id: '4', title: 'Тактическа схема 4-3-3', views: 1432, category: 'Тактики' },
                        { id: '5', title: 'Психология в спорта', views: 1289, category: 'Психология' }
                      ]).slice(0, 5).map((article, index) => (
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

                </div>

                {/* Second Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Content Categories Pie Chart */}
                  <ChartCard title="Категории съдържание">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sampleCategoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {sampleCategoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value}%`, 'Дял']}
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}
                          />
                          <Legend
                            wrapperStyle={{ fontSize: '12px' }}
                            formatter={(value) => value}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>

                  {/* Content Metrics */}
                  <ChartCard title="Метрики на съдържанието">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(metrics.contentMetrics?.avgReadTime / 60) || 4}мин
                        </div>
                        <div className="text-sm text-gray-600">Средно четене</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {metrics.contentMetrics?.bounceRate?.toFixed(1) || 25.8}%
                        </div>
                        <div className="text-sm text-gray-600">Bounce Rate</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {metrics.contentMetrics?.conversionRate?.toFixed(1) || 8.2}%
                        </div>
                        <div className="text-sm text-gray-600">Конверсия</div>
                      </div>
                    </div>
                  </ChartCard>
                </div>
              </>
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
            ) : (
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
                            style={{ width: `${performance?.systemLoad?.cpu || 45}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{performance?.systemLoad?.cpu || 45}%</span>
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
                            style={{ width: `${performance?.systemLoad?.memory || 67}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{performance?.systemLoad?.memory || 67}%</span>
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
                            style={{ width: `${performance?.systemLoad?.disk || 32}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{performance?.systemLoad?.disk || 32}%</span>
                      </div>
                    </div>
                  </div>
                </ChartCard>

                {/* API Metrics */}
                <ChartCard title="API метрики">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {performance?.apiMetrics?.avgResponseTime || 125}ms
                      </div>
                      <div className="text-sm text-gray-600">Средно време</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {performance?.apiMetrics?.errorRate?.toFixed(2) || 0.5}%
                      </div>
                      <div className="text-sm text-gray-600">Процент грешки</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {performance?.apiMetrics?.requestsPerMinute || 850}
                      </div>
                      <div className="text-sm text-gray-600">Заявки/мин</div>
                    </div>
                  </div>
                </ChartCard>
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