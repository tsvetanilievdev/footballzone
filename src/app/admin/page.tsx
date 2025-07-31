'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import {
  PlusIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  PhotoIcon,
  UserGroupIcon,
  TagIcon,
  ChartBarIcon,
  CogIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'

// Mock data
const mockStats = {
  totalArticles: 127,
  totalUsers: 1543,
  totalViews: 45623,
  premiumUsers: 89,
  monthlyGrowth: 12.5
}

const mockArticles = [
  {
    id: '1',
    title: 'Тактическа схема 4-3-3 в модерния футбол',
    author: 'Спортен Анализатор',
    category: 'Тактика',
    zone: 'Coach',
    status: 'published',
    views: 1234,
    publishedAt: '2024-01-15',
    isPremium: true
  },
  {
    id: '2',
    title: 'Тренировъчен план за младежи U15',
    author: 'Треньор Петров',
    category: 'Тренировки',
    zone: 'Coach',
    status: 'draft',
    views: 0,
    publishedAt: null,
    isPremium: false
  },
  {
    id: '3',
    title: 'Хранене на младия футболист',
    author: 'Д-р Иванова',
    category: 'Здраве',
    zone: 'Parent',
    status: 'published',
    views: 892,
    publishedAt: '2024-01-10',
    isPremium: false
  }
]

const mockUsers = [
  {
    id: '1',
    name: 'Георги Петров',
    email: 'georgi@example.com',
    role: 'Coach Premium',
    registeredAt: '2024-01-01',
    lastActive: '2024-01-16',
    status: 'active'
  },
  {
    id: '2',
    name: 'Мария Иванова',
    email: 'maria@example.com',
    role: 'Parent Free',
    registeredAt: '2024-01-05',
    lastActive: '2024-01-15',
    status: 'active'
  },
  {
    id: '3',
    name: 'Стефан Димитров',
    email: 'stefan@example.com',
    role: 'Player Premium',
    registeredAt: '2024-01-03',
    lastActive: '2024-01-14',
    status: 'inactive'
  }
]

const mockCategories = [
  { id: '1', name: 'Тактика', count: 23, color: 'green' },
  { id: '2', name: 'Тренировки', count: 34, color: 'blue' },
  { id: '3', name: 'Психология', count: 12, color: 'purple' },
  { id: '4', name: 'Здраве', count: 18, color: 'orange' },
  { id: '5', name: 'Новини', count: 40, color: 'red' }
]

type ActiveTab = 'dashboard' | 'articles' | 'users' | 'categories' | 'media' | 'settings'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'articles', name: 'Статии', icon: DocumentTextIcon },
    { id: 'users', name: 'Потребители', icon: UserGroupIcon },
    { id: 'categories', name: 'Категории', icon: TagIcon },
    { id: 'media', name: 'Медия', icon: PhotoIcon },
    { id: 'settings', name: 'Настройки', icon: CogIcon }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-sm border-r min-h-screen">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Admin Panel</h2>
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as ActiveTab)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-green-100 text-green-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {activeTab === 'dashboard' && <DashboardTab stats={mockStats} />}
            {activeTab === 'articles' && <ArticlesTab articles={mockArticles} />}
            {activeTab === 'users' && <UsersTab users={mockUsers} />}
            {activeTab === 'categories' && <CategoriesTab categories={mockCategories} />}
            {activeTab === 'media' && <MediaTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard Tab
function DashboardTab({ stats }: { stats: typeof mockStats }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Добре дошли в Admin панела на Football Zone</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общо статии</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalArticles}</p>
            </div>
            <DocumentTextIcon className="w-8 h-8 text-green-600" />
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+8</span>
            <span className="text-gray-500 ml-1">този месец</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Потребители</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+{stats.monthlyGrowth}%</span>
            <span className="text-gray-500 ml-1">растеж</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общо прегледи</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
            </div>
            <EyeIcon className="w-8 h-8 text-purple-600" />
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+2.4k</span>
            <span className="text-gray-500 ml-1">тази седмица</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Premium потребители</p>
              <p className="text-3xl font-bold text-gray-900">{stats.premiumUsers}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+15</span>
            <span className="text-gray-500 ml-1">нови абонати</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Бързи действия</h3>
          <div className="space-y-3">
            <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
              <PlusIcon className="w-4 h-4 mr-2" />
              Нова статия
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <VideoCameraIcon className="w-4 h-4 mr-2" />
              Качи видео
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TagIcon className="w-4 h-4 mr-2" />
              Добави категория
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Последна активност</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Нова статия публикувана</p>
                <p className="text-xs text-gray-500">преди 2 часа</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Нов потребител се регистрира</p>
                <p className="text-xs text-gray-500">преди 4 часа</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Видео качено в Coach Zone</p>
                <p className="text-xs text-gray-500">преди 6 часа</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Articles Tab
function ArticlesTab({ articles }: { articles: typeof mockArticles }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Статии</h1>
          <p className="text-gray-600 mt-2">Управление на всички статии в платформата</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <PlusIcon className="w-4 h-4 mr-2" />
          Нова статия
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border">
        <div className="flex items-center space-x-4">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>Всички зони</option>
            <option>Coach Zone</option>
            <option>Player Zone</option>
            <option>Parent Zone</option>
            <option>Read Zone</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>Всички статуси</option>
            <option>Публикувано</option>
            <option>Чернова</option>
            <option>На ревизия</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>Всички категории</option>
            <option>Тактика</option>
            <option>Тренировки</option>
            <option>Психология</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статия
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Автор
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Зона
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Прегледи
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {article.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {article.category}
                        {article.isPremium && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Premium
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {article.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    article.zone === 'Coach' ? 'bg-green-100 text-green-800' :
                    article.zone === 'Player' ? 'bg-blue-100 text-blue-800' :
                    article.zone === 'Parent' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {article.zone}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    article.status === 'published' ? 'bg-green-100 text-green-800' :
                    article.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status === 'published' ? 'Публикувано' :
                     article.status === 'draft' ? 'Чернова' : 'На ревизия'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {article.views.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {article.publishedAt || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Users Tab
function UsersTab({ users }: { users: typeof mockUsers }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Потребители</h1>
          <p className="text-gray-600 mt-2">Управление на потребителски акаунти</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <PlusIcon className="w-4 h-4 mr-2" />
          Нов потребител
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Потребител
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Роля
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Регистрация
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Последна активност
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role.includes('Premium') ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.registeredAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastActive}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'active' ? 'Активен' : 'Неактивен'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-green-600 hover:text-green-900">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Categories Tab
function CategoriesTab({ categories }: { categories: typeof mockCategories }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Категории</h1>
          <p className="text-gray-600 mt-2">Управление на категории и тагове</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <PlusIcon className="w-4 h-4 mr-2" />
          Нова категория
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-4 h-4 rounded-full bg-${category.color}-500`}></div>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button className="text-red-400 hover:text-red-600">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
            <p className="text-gray-600 text-sm">{category.count} статии</p>
          </div>
        ))}
        
        {/* Add Category Card */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
          <div className="text-center">
            <PlusIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Добави категория</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Media Tab
function MediaTab() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Медия библиотека</h1>
          <p className="text-gray-600 mt-2">Управление на снимки и видео</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <VideoCameraIcon className="w-4 h-4 mr-2" />
            Качи видео
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <PhotoIcon className="w-4 h-4 mr-2" />
            Качи снимки
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm p-8 border border-dashed border-gray-300 mb-8">
        <div className="text-center">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Качи файлове</h3>
          <p className="text-gray-600 mb-4">Влачете и пуснете файлове тук или кликнете за избор</p>
          <Button>Избери файлове</Button>
        </div>
      </div>

      {/* Media Grid - Placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
            <PhotoIcon className="w-8 h-8 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Settings Tab
function SettingsTab() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-600 mt-2">Общи настройки на платформата</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Site Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Настройки на сайта</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Име на сайта
              </label>
              <input
                type="text"
                defaultValue="Football Zone"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                defaultValue="Българска футболна платформа за треньори, играчи и родители"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              Запази промените
            </Button>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email настройки</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Host
              </label>
              <input
                type="text"
                defaultValue="smtp.gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Port
              </label>
              <input
                type="text"
                defaultValue="587"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Тествай връзката
            </Button>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics ID
              </label>
              <input
                type="text"
                placeholder="GA-XXXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook Pixel ID
              </label>
              <input
                type="text"
                placeholder="123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Backup */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Резервно копие</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Последно резервно копие: 15.01.2024, 14:30
            </p>
            <div className="flex space-x-3">
              <Button variant="outline">
                Създай резервно копие
              </Button>
              <Button variant="outline">
                Възстанови
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 