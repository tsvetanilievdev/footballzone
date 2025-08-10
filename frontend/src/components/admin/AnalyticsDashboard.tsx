'use client'

import { useState } from 'react'
import { 
  EyeIcon, 
  UserIcon, 
  ClockIcon, 
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import { ArticleAnalytics, UserActivity } from '@/types'

// Mock analytics data
const mockAnalytics: ArticleAnalytics[] = [
  {
    articleId: '1',
    totalViews: 2847,
    uniqueViews: 1923,
    avgReadTime: 4.2,
    completionRate: 68.5,
    shareCount: 143,
    downloadCount: 89,
    likeCount: 267,
    commentCount: 34,
    topReferrers: ['Google', 'Facebook', 'Direct', 'Twitter'],
    viewsByDay: [
      { date: '2024-01-15', views: 234 },
      { date: '2024-01-16', views: 298 },
      { date: '2024-01-17', views: 167 },
      { date: '2024-01-18', views: 312 },
      { date: '2024-01-19', views: 189 },
      { date: '2024-01-20', views: 278 },
      { date: '2024-01-21', views: 145 }
    ],
    deviceBreakdown: [
      { device: 'mobile', percentage: 58 },
      { device: 'desktop', percentage: 31 },
      { device: 'tablet', percentage: 11 }
    ]
  }
]

const mockUserActivity: UserActivity[] = [
  {
    id: '1',
    userId: 'user1',
    articleId: '1',
    action: 'view',
    timestamp: new Date('2024-01-21T14:30:00'),
    duration: 245,
    completionPercent: 75,
    device: 'mobile',
    referrer: 'google'
  },
  {
    id: '2',
    userId: 'user2',
    articleId: '1',
    action: 'read',
    timestamp: new Date('2024-01-21T13:15:00'),
    duration: 380,
    completionPercent: 95,
    device: 'desktop',
    referrer: 'direct'
  },
  {
    id: '3',
    userId: 'user3',
    articleId: '2',
    action: 'download',
    timestamp: new Date('2024-01-21T12:45:00'),
    device: 'desktop',
    referrer: 'facebook'
  }
]

const topArticles = [
  { id: '1', title: 'Философията на Антонио Конте', views: 2847, growth: 12.5 },
  { id: '2', title: 'Тренировъчен план за U15', views: 1923, growth: -3.2 },
  { id: '3', title: 'Хранене на младия футболист', views: 1654, growth: 8.9 },
  { id: '4', title: 'Тактическа схема 4-3-3', views: 1432, growth: 15.7 },
  { id: '5', title: 'Психология в спорта', views: 1289, growth: 5.3 }
]

interface AnalyticsDashboardProps {
  className?: string
}

export default function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d')

  const totalStats = {
    totalViews: 15847,
    uniqueUsers: 8932,
    avgReadTime: 3.8,
    totalDownloads: 567,
    growth: {
      views: 15.3,
      users: 8.7,
      readTime: -2.1,
      downloads: 23.4
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Analytics Dashboard</h2>
          <p className="text-black mt-1">Проследяване на активността и четенето</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="7d">Последни 7 дни</option>
            <option value="30d">Последни 30 дни</option>
            <option value="90d">Последни 90 дни</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black">Общо прегледи</p>
              <p className="text-2xl font-bold text-black">{totalStats.totalViews.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <EyeIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {totalStats.growth.views > 0 ? (
              <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              totalStats.growth.views > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {Math.abs(totalStats.growth.views)}%
            </span>
            <span className="text-sm text-black ml-1">vs предишния период</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black">Уникални потребители</p>
              <p className="text-2xl font-bold text-black">{totalStats.uniqueUsers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">{totalStats.growth.users}%</span>
            <span className="text-sm text-black ml-1">нови потребители</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black">Средно време четене</p>
              <p className="text-2xl font-bold text-black">{totalStats.avgReadTime} мин</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-sm font-medium text-red-600">{Math.abs(totalStats.growth.readTime)}%</span>
            <span className="text-sm text-black ml-1">vs предишния период</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black">Общо изтегляния</p>
              <p className="text-2xl font-bold text-black">{totalStats.totalDownloads}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-600">{totalStats.growth.downloads}%</span>
            <span className="text-sm text-black ml-1">нови изтегляния</span>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Articles */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black">Най-четени статии</h3>
            <ChartBarIcon className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {topArticles.map((article, index) => (
              <div key={article.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-black text-sm">{article.title}</p>
                    <p className="text-xs text-black">{article.views.toLocaleString()} прегледи</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {article.growth > 0 ? (
                    <ArrowUpIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    article.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(article.growth)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black">Устройства</h3>
            <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {mockAnalytics[0].deviceBreakdown.map((device) => {
              const Icon = device.device === 'mobile' ? DevicePhoneMobileIcon :
                          device.device === 'desktop' ? ComputerDesktopIcon : DeviceTabletIcon
              
              return (
                <div key={device.device} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-black capitalize">{device.device}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-black w-8">{device.percentage}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

              {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black">Последна активност</h3>
            <ArrowTrendingUpIcon className="w-5 h-5 text-gray-400" />
          </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-black text-sm">Потребител</th>
                <th className="text-left py-3 px-4 font-medium text-black text-sm">Действие</th>
                <th className="text-left py-3 px-4 font-medium text-black text-sm">Статия</th>
                <th className="text-left py-3 px-4 font-medium text-black text-sm">Устройство</th>
                <th className="text-left py-3 px-4 font-medium text-black text-sm">Време</th>
                <th className="text-left py-3 px-4 font-medium text-black text-sm">Прогрес</th>
              </tr>
            </thead>
            <tbody>
              {mockUserActivity.map((activity) => (
                <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-black">{activity.userId}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      activity.action === 'view' ? 'bg-blue-100 text-blue-800' :
                      activity.action === 'read' ? 'bg-green-100 text-green-800' :
                      activity.action === 'download' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.action === 'view' ? 'Преглед' :
                       activity.action === 'read' ? 'Четене' :
                       activity.action === 'download' ? 'Изтегляне' : activity.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-black">Статия #{activity.articleId}</td>
                  <td className="py-3 px-4 text-sm text-black capitalize">{activity.device}</td>
                  <td className="py-3 px-4 text-sm text-black">
                    {activity.timestamp.toLocaleTimeString('bg-BG', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </td>
                  <td className="py-3 px-4 text-sm text-black">
                    {activity.completionPercent ? `${activity.completionPercent}%` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}