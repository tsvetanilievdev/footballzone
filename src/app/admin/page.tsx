'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import {
  PlusIcon,
  DocumentTextIcon,
  PhotoIcon,
  UserGroupIcon,
  TagIcon,
  ChartBarIcon,
  CogIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowUpIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  BarsArrowUpIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import ArticleEditor from '@/components/admin/ArticleEditor'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'
import ArticleOrderManager from '@/components/admin/ArticleOrderManager'
import EnhancedMediaManager from '@/components/admin/EnhancedMediaManager'

// Types
interface AdminArticle {
  id: string
  title: string
  author: string
  category: string
  zone: string
  status: string
  views: number
  publishedAt: string | null
  isPremium: boolean
}

// Mock data
const mockStats = {
  totalArticles: 127,
  totalUsers: 1543,
  totalViews: 45623,
  premiumUsers: 89,
  monthlyGrowth: 12.5
}

const mockArticles: AdminArticle[] = [
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

type ActiveTab = 'dashboard' | 'articles' | 'analytics' | 'ordering' | 'series' | 'users' | 'categories' | 'media' | 'settings' | 'create-article'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')
  const [showArticleEditor, setShowArticleEditor] = useState(false)
  const [editingArticle, setEditingArticle] = useState<AdminArticle | null>(null)

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'articles', name: 'Статии', icon: DocumentTextIcon },
    { id: 'analytics', name: 'Analytics', icon: ClipboardDocumentListIcon },
    { id: 'ordering', name: 'Подредба статии', icon: BarsArrowUpIcon },
    { id: 'series', name: 'Серии', icon: BookOpenIcon },
    { id: 'users', name: 'Потребители', icon: UserGroupIcon },
    { id: 'categories', name: 'Категории', icon: TagIcon },
    { id: 'media', name: 'Медия', icon: PhotoIcon },
    { id: 'settings', name: 'Настройки', icon: CogIcon }
  ]

  const handleSaveArticle = (articleData: unknown) => {
    console.log('Saving article:', articleData)
    // Here you would typically save to your backend
    setShowArticleEditor(false)
    setEditingArticle(null)
    // Refresh articles list
  }

  const handleCancelEdit = () => {
    setShowArticleEditor(false)
    setEditingArticle(null)
  }

  const handleCreateArticle = () => {
    setEditingArticle(null)
    setShowArticleEditor(true)
  }

  const handleEditArticle = (article: AdminArticle) => {
    setEditingArticle(article)
    setShowArticleEditor(true)
  }

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
            {showArticleEditor ? (
                              <ArticleEditor
                  article={undefined}
                  onSave={handleSaveArticle}
                  onCancel={handleCancelEdit}
                  mode={editingArticle ? 'edit' : 'create'}
                />
            ) : (
              <>
                {activeTab === 'dashboard' && <DashboardTab stats={mockStats} onCreateArticle={handleCreateArticle} onSetActiveTab={setActiveTab} />}
                {activeTab === 'articles' && <ArticlesTab articles={mockArticles} onEditArticle={handleEditArticle} onCreateArticle={handleCreateArticle} />}
                {activeTab === 'analytics' && <AnalyticsDashboard />}
                {activeTab === 'ordering' && <ArticleOrderTab />}
                {activeTab === 'series' && <SeriesTab />}
                {activeTab === 'users' && <UsersTab users={mockUsers} />}
                {activeTab === 'categories' && <CategoriesTab categories={mockCategories} />}
                {activeTab === 'media' && <EnhancedMediaTab />}
                {activeTab === 'settings' && <SettingsTab />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard Tab
function DashboardTab({ 
  stats, 
  onCreateArticle, 
  onSetActiveTab 
}: { 
  stats: typeof mockStats
  onCreateArticle: () => void
  onSetActiveTab: (tab: ActiveTab) => void
}) {
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
            <Button 
              className="w-full justify-start bg-green-600 hover:bg-green-700"
              onClick={onCreateArticle}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Нова статия
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onSetActiveTab('analytics')}
            >
              <ChartBarIcon className="w-4 h-4 mr-2" />
              Виж Analytics
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onSetActiveTab('ordering')}
            >
              <BarsArrowUpIcon className="w-4 h-4 mr-2" />
              Подреди статии
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
function ArticlesTab({ 
  articles, 
  onEditArticle, 
  onCreateArticle 
}: { 
  articles: typeof mockArticles
  onEditArticle: (article: AdminArticle) => void
  onCreateArticle: () => void
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Статии</h1>
          <p className="text-gray-600 mt-2">Управление на всички статии в платформата</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={onCreateArticle}
        >
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
                    <button 
                      className="text-green-600 hover:text-green-900"
                      onClick={() => onEditArticle(article)}
                    >
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
const zoneCategories = {
  read: [
    { id: 'news', name: 'Новини', count: 45, description: 'Актуални новини от футболния свят' },
    { id: 'interviews', name: 'Интервюта', count: 23, description: 'Разговори с футболни личности' },
    { id: 'analysis', name: 'Анализи', count: 34, description: 'Задълбочени анализи на мачове и събития' },
    { id: 'history', name: 'История', count: 18, description: 'Исторически моменти и легенди' }
  ],
  coach: [
    { id: 'tactics', name: 'Тактика', count: 28, description: 'Тактически схеми и анализи' },
    { id: 'training', name: 'Тренировки', count: 42, description: 'Методи и програми за тренировки' },
    { id: 'psychology', name: 'Психология', count: 16, description: 'Ментална подготовка и мотивация' },
    { id: 'management', name: 'Мениджмънт', count: 12, description: 'Управление на отбор и играчи' }
  ],
  player: [
    { id: 'technique', name: 'Техника', count: 38, description: 'Технически умения и упражнения' },
    { id: 'fitness', name: 'Фитнес', count: 31, description: 'Физическа подготовка и кондиция' },
    { id: 'nutrition', name: 'Хранене', count: 19, description: 'Спортно хранене и диети' },
    { id: 'recovery', name: 'Възстановяване', count: 24, description: 'Методи за възстановяване след тренировки' }
  ],
  parent: [
    { id: 'development', name: 'Развитие', count: 22, description: 'Развитие на детето като спортист' },
    { id: 'safety', name: 'Безопасност', count: 15, description: 'Безопасност и превенция на травми' },
    { id: 'education', name: 'Образование', count: 18, description: 'Балансиране на спорт и образование' },
    { id: 'support', name: 'Подкрепа', count: 26, description: 'Как да подкрепите детето си' }
  ]
}

function CategoriesTab({}: { categories: typeof mockCategories }) {
  const [selectedZone, setSelectedZone] = useState<string>('read')
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; color: string; description?: string } | null>(null)
  const [showCategoryForm, setShowCategoryForm] = useState(false)

  const zones = [
    { id: 'read', name: 'Read Zone', color: 'blue' },
    { id: 'coach', name: 'Coach Zone', color: 'green' },
    { id: 'player', name: 'Player Zone', color: 'purple' },
    { id: 'parent', name: 'Parent Zone', color: 'orange' }
  ]

  const getZoneColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'green': return 'bg-green-100 text-green-800 border-green-200'
      case 'purple': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleCreateCategory = () => {
    setEditingCategory(null)
    setShowCategoryForm(true)
  }

  const handleEditCategory = (category: { id: string; name: string; color: string; description?: string }) => {
    setEditingCategory(category)
    setShowCategoryForm(true)
  }

  const handleSaveCategory = (categoryData: { name: string; color: string; description?: string }) => {
    console.log('Saving category:', categoryData)
    setShowCategoryForm(false)
    setEditingCategory(null)
  }

  if (showCategoryForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingCategory ? 'Редактиране на категория' : 'Създаване на нова категория'}
            </h2>
            <button
              onClick={() => setShowCategoryForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target as HTMLFormElement)
            handleSaveCategory({
              name: formData.get('name') as string || '',
              color: formData.get('color') as string || 'blue'
            })
          }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Име на категорията
              </label>
              <input
                type="text"
                name="name"
                defaultValue={editingCategory?.name || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Въведете име на категорията"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Зона
              </label>
              <select
                defaultValue={selectedZone}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {zones.map(zone => (
                  <option key={zone.id} value={zone.id}>{zone.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                rows={3}
                defaultValue={editingCategory?.description || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Кратко описание на категорията"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL идентификатор)
              </label>
              <input
                type="text"
                defaultValue={editingCategory?.id || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="напр. taktika, hranene, tehnika"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => setShowCategoryForm(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Отказ
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingCategory ? 'Запази промените' : 'Създай категория'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Категории</h1>
          <p className="text-gray-600 mt-2">Управление на категории в различните зони</p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={handleCreateCategory}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Нова категория
        </Button>
      </div>

      {/* Zone Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {zones.map(zone => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedZone === zone.id
                    ? `border-${zone.color}-500 text-${zone.color}-600`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {zone.name}
                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {zoneCategories[selectedZone as keyof typeof zoneCategories]?.length || 0}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Zone Summary */}
      <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {zones.find(z => z.id === selectedZone)?.name}
            </h3>
            <p className="text-gray-600 mt-1">
              Общо {zoneCategories[selectedZone as keyof typeof zoneCategories]?.reduce((sum, cat) => sum + cat.count, 0)} статии в {zoneCategories[selectedZone as keyof typeof zoneCategories]?.length} категории
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg border ${getZoneColor(zones.find(z => z.id === selectedZone)?.color || 'gray')}`}>
            <span className="font-medium">
              {zones.find(z => z.id === selectedZone)?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zoneCategories[selectedZone as keyof typeof zoneCategories]?.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button 
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => handleEditCategory({
                    id: category.id,
                    name: category.name,
                    color: 'blue', // default color
                    description: category.description
                  })}
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{category.count}</span>
                <span className="text-sm text-gray-600">статии</span>
              </div>
              <span className="text-xs text-gray-500">#{category.id}</span>
            </div>
          </div>
        ))}
        
        {/* Add Category Card */}
        <div 
          className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={handleCreateCategory}
        >
          <div className="text-center">
            <PlusIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Добави категория</p>
          </div>
        </div>
      </div>

      {/* Category Statistics */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        {zones.map(zone => {
          const zoneData = zoneCategories[zone.id as keyof typeof zoneCategories] || []
          const totalArticles = zoneData.reduce((sum, cat) => sum + cat.count, 0)
          
          return (
            <div key={zone.id} className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${getZoneColor(zone.color)}`}>
                  <span className="font-bold text-lg">{zone.name.charAt(0)}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{zone.name}</h4>
                <p className="text-2xl font-bold text-gray-900">{totalArticles}</p>
                <p className="text-sm text-gray-600">статии в {zoneData.length} категории</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Enhanced Media Tab
function EnhancedMediaTab() {
  return <EnhancedMediaManager />
}

// Article Order Tab
function ArticleOrderTab() {
  const handleReorder = (articles: { id: string; order: number }[]) => {
    console.log('Reordering articles:', articles)
    // Here you would typically save to your backend
  }

  const handleToggleFeatured = (articleId: string) => {
    console.log('Toggle featured:', articleId)
    // Here you would typically update the article
  }

  const handleTogglePinned = (articleId: string) => {
    console.log('Toggle pinned:', articleId)
    // Here you would typically update the article
  }

  return (
    <ArticleOrderManager 
      articles={[]} // This would come from your data source
      onReorder={handleReorder}
      onToggleFeatured={handleToggleFeatured}
      onTogglePinned={handleTogglePinned}
    />
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

// Series Tab
const mockSeries = [
  {
    id: '1',
    name: 'Философията на Антонио Конте',
    slug: 'antonio-conte-philosophy',
    description: 'Серия статии за треньорската философия и методите на Антонио Конте',
    category: 'coaches',
    status: 'active',
    articleCount: 5,
    totalPlanned: 8,
    lastUpdated: new Date('2024-01-15'),
    tags: ['Конте', 'Философия', 'Тактика'],
    coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop'
  },
  {
    id: '2',
    name: 'Тики-така еволюция',
    slug: 'tiki-taka-evolution',
    description: 'Развитието на tiki-taka стила от Cruyff до Guardiola',
    category: 'teams',
    status: 'draft',
    articleCount: 3,
    totalPlanned: 6,
    lastUpdated: new Date('2024-01-10'),
    tags: ['Tiki-taka', 'Барселона', 'Гуардиола'],
    coverImage: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=250&fit=crop'
  },
  {
    id: '3',
    name: 'Техники на Роналдиньо',
    slug: 'ronaldinho-techniques',
    description: 'Магическите техники и финтове на бразилския маестро',
    category: 'players',
    status: 'completed',
    articleCount: 4,
    totalPlanned: 4,
    lastUpdated: new Date('2024-01-05'),
    tags: ['Роналдиньо', 'Техника', 'Финтове'],
    coverImage: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&h=250&fit=crop'
  }
]

function SeriesTab() {
  const [editingSeries, setEditingSeries] = useState<{ 
    id: string; 
    name: string; 
    category?: string; 
    description?: string; 
    totalPlanned?: number;
    status?: string;
    tags?: string[];
  } | null>(null)
  const [showSeriesForm, setShowSeriesForm] = useState(false)

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'coaches': return 'Треньори'
      case 'players': return 'Играчи'
      case 'teams': return 'Отбори'
      case 'general': return 'Общи'
      default: return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'coaches': return 'bg-green-100 text-green-800'
      case 'players': return 'bg-purple-100 text-purple-800'
      case 'teams': return 'bg-blue-100 text-blue-800'
      case 'general': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusName = (status: string) => {
    switch (status) {
      case 'active': return 'Активна'
      case 'draft': return 'Чернова'
      case 'completed': return 'Завършена'
      default: return status
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getProgressPercent = (current: number, total: number) => {
    return Math.round((current / total) * 100)
  }

  const handleCreateSeries = () => {
    setEditingSeries(null)
    setShowSeriesForm(true)
  }

  const handleEditSeries = (series: { id: string; name: string; category?: string; description?: string }) => {
    setEditingSeries(series)
    setShowSeriesForm(true)
  }

  const handleSaveSeries = (seriesData: { name: string; description: string }) => {
    console.log('Saving series:', seriesData)
    setShowSeriesForm(false)
    setEditingSeries(null)
  }

  if (showSeriesForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingSeries ? 'Редактиране на серия' : 'Създаване на нова серия'}
            </h2>
            <button
              onClick={() => setShowSeriesForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target as HTMLFormElement)
            handleSaveSeries({
              name: formData.get('name') as string || '',
              description: formData.get('description') as string || ''
            })
          }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Име на серията
                </label>
                <input
                  type="text"
                  defaultValue={editingSeries?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Въведете име на серията"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория
                </label>
                <select
                  defaultValue={editingSeries?.category || 'general'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="coaches">Треньори</option>
                  <option value="players">Играчи</option>
                  <option value="teams">Отбори</option>
                  <option value="general">Общи</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                rows={3}
                defaultValue={editingSeries?.description || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Кратко описание на серията"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Планирани статии
                </label>
                <input
                  type="number"
                  min="1"
                  defaultValue={editingSeries?.totalPlanned || 5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Статус
                </label>
                <select
                  defaultValue={editingSeries?.status || 'draft'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Чернова</option>
                  <option value="active">Активна</option>
                  <option value="completed">Завършена</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тагове (разделени със запетая)
              </label>
              <input
                type="text"
                defaultValue={editingSeries?.tags?.join(', ') || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="напр. тактика, техника, анализ"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => setShowSeriesForm(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Отказ
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingSeries ? 'Запази промените' : 'Създай серия'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Серии</h1>
          <p className="text-gray-600 mt-2">Управление на серии от статии</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleCreateSeries}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Нова серия
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border">
        <div className="flex items-center space-x-4">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>Всички категории</option>
            <option>Треньори</option>
            <option>Играчи</option>
            <option>Отбори</option>
            <option>Общи</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>Всички статуси</option>
            <option>Активни</option>
            <option>Чернови</option>
            <option>Завършени</option>
          </select>
        </div>
      </div>

      {/* Series Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSeries.map((series) => (
          <div key={series.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            {/* Cover Image */}
            <div className="h-48 bg-gray-200 overflow-hidden">
              <img 
                src={series.coverImage} 
                alt={series.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                  {series.name}
                </h3>
                <div className="flex space-x-1">
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditSeries(series)}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {series.description}
              </p>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(series.category)}`}>
                  {getCategoryName(series.category)}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(series.status)}`}>
                  {getStatusName(series.status)}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Прогрес</span>
                  <span className="text-sm font-medium text-gray-900">
                    {series.articleCount} / {series.totalPlanned}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${getProgressPercent(series.articleCount, series.totalPlanned)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {getProgressPercent(series.articleCount, series.totalPlanned)}% завършено
                </div>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {series.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {series.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                      +{series.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                <span>Обновено: {formatDate(series.lastUpdated)}</span>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Виж статии →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}