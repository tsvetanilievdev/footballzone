'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
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
  BarsArrowUpIcon,
  SquaresPlusIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { Article } from '@/types'
import ArticleEditor from '@/components/admin/ArticleEditor'
import { formatDateShortBG } from '@/utils/dateUtils'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'
import ArticleOrderManager from '@/components/admin/ArticleOrderManager'
import EnhancedMediaManager from '@/components/admin/EnhancedMediaManager'
import TemplateManager from '@/components/admin/TemplateManager'
import SeriesManagement from '@/components/admin/SeriesManagement'
import { useAdminArticles, useAdminArticleStats, useAdminUsers, useAdminUserStats } from '@/hooks/api/useAdmin'
import { useCreateArticle, useUpdateArticle, useDeleteArticle, useArticleById } from '@/hooks/api/useArticles'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import MediaUploadForm from '@/components/admin/MediaUploadForm'
import MediaGallery from '@/components/admin/MediaGallery'

// Types
interface AdminArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  author: {
    name: string
    email?: string
  }
  category: string
  zones: string[]
  status: string
  viewCount: number
  publishedAt: string | null
  isPremium: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

const mockCategories = [
  { id: '1', name: 'Тактика', count: 23, color: 'green' },
  { id: '2', name: 'Тренировки', count: 34, color: 'blue' },
  { id: '3', name: 'Психология', count: 12, color: 'purple' },
  { id: '4', name: 'Здраве', count: 18, color: 'orange' },
  { id: '5', name: 'Новини', count: 40, color: 'red' }
]

type ActiveTab = 'dashboard' | 'articles' | 'analytics' | 'ordering' | 'series' | 'users' | 'categories' | 'media' | 'templates' | 'settings' | 'moderation'

function AdminContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')
  const [showArticleEditor, setShowArticleEditor] = useState(false)
  const [editingArticle, setEditingArticle] = useState<AdminArticle | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)
  const [pendingTab, setPendingTab] = useState<ActiveTab | null>(null)

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'articles', name: 'Статии', icon: DocumentTextIcon },
    { id: 'analytics', name: 'Analytics', icon: ClipboardDocumentListIcon },
    { id: 'ordering', name: 'Подредба статии', icon: BarsArrowUpIcon },
    { id: 'series', name: 'Серии', icon: BookOpenIcon },
    { id: 'users', name: 'Потребители', icon: UserGroupIcon },
    { id: 'categories', name: 'Категории', icon: TagIcon },
    { id: 'media', name: 'Медия', icon: PhotoIcon },
    { id: 'templates', name: 'Темплейти', icon: SquaresPlusIcon },
    { id: 'moderation', name: 'Модерация', icon: ClipboardDocumentListIcon },
    { id: 'settings', name: 'Настройки', icon: CogIcon }
  ]

  // Mutations for article operations
  const createArticleMutation = useCreateArticle()
  const updateArticleMutation = useUpdateArticle()
  const deleteArticleMutation = useDeleteArticle()

  // Get edit article ID from URL params
  const editArticleId = searchParams.get('edit')
  const { data: editArticleData, isLoading: isLoadingEditArticle } = useArticleById(editArticleId || '')

  // Effect to handle edit article loading from URL
  useEffect(() => {
    if (editArticleId && editArticleData && !showArticleEditor) {
      // Convert real article data to AdminArticle format
      const adminArticle: AdminArticle = {
        id: editArticleData.id,
        title: editArticleData.title,
        slug: editArticleData.slug || '',
        excerpt: editArticleData.excerpt || '',
        author: editArticleData.author || { name: 'Unknown' },
        category: editArticleData.category,
        zones: editArticleData.zoneSettings ? Object.keys(editArticleData.zoneSettings).filter(zone => editArticleData.zoneSettings?.[zone]?.visible) : ['read'],
        status: editArticleData.publishedAt ? 'PUBLISHED' : 'DRAFT',
        viewCount: editArticleData.viewCount || 0,
        publishedAt: editArticleData.publishedAt || null,
        isPremium: editArticleData.isPremium || false,
        isFeatured: editArticleData.isFeatured || false,
        createdAt: editArticleData.createdAt || new Date().toISOString(),
        updatedAt: editArticleData.updatedAt || new Date().toISOString()
      }
      
      setEditingArticle(adminArticle)
      setShowArticleEditor(true)
      setActiveTab('articles')
    }
  }, [editArticleId, editArticleData, showArticleEditor])

  const handleSaveArticle = async (articleData: any) => {
    try {
      if (editArticleData) {
        // Use editArticleData.id (real article ID from API)
        console.log('Updating article with ID:', editArticleData.id)
        console.log('Article data:', articleData)
        await updateArticleMutation.mutateAsync({
          id: editArticleData.id,
          data: articleData
        })
      } else {
        console.log('Creating new article')
        await createArticleMutation.mutateAsync(articleData)
      }
      setShowArticleEditor(false)
      setEditingArticle(null)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Error saving article:', error)
      alert('Грешка при запазване: ' + (error as any)?.response?.data?.error?.message || (error as Error).message)
    }
  }

  const handleDeleteArticle = async (articleId: string) => {
    if (confirm('Сигурни ли сте, че искате да изтриете тази статия?')) {
      try {
        await deleteArticleMutation.mutateAsync(articleId)
      } catch (error) {
        console.error('Error deleting article:', error)
      }
    }
  }

  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      setShowExitConfirmation(true)
      return
    }
    setShowArticleEditor(false)
    setEditingArticle(null)
    setHasUnsavedChanges(false)
  }

  const confirmExit = () => {
    setShowArticleEditor(false)
    setEditingArticle(null)
    setHasUnsavedChanges(false)
    setShowExitConfirmation(false)
    if (pendingTab) {
      setActiveTab(pendingTab)
      setPendingTab(null)
    }
  }

  const cancelExit = () => {
    setShowExitConfirmation(false)
    setPendingTab(null)
  }

  const handleTabChange = (tabId: ActiveTab) => {
    if (showArticleEditor && hasUnsavedChanges) {
      setPendingTab(tabId)
      setShowExitConfirmation(true)
      return
    }
    setActiveTab(tabId)
    if (showArticleEditor && tabId !== 'articles') {
      setShowArticleEditor(false)
      setEditingArticle(null)
      setHasUnsavedChanges(false)
    }
  }

  const handleCreateArticle = () => {
    window.location.href = '/admin/create-article'
  }

  const handleEditArticle = (article: AdminArticle) => {
    window.location.href = `/admin/edit-article/${article.id}`
  }

  const convertAdminToArticlePartial = (a: AdminArticle | null): Partial<Article> | undefined => {
    if (!a) return undefined
    
    // If we have full article data from the edit flow, use it
    if (editArticleData && a.id === editArticleData.id) {
      return {
        id: editArticleData.id,
        title: editArticleData.title,
        slug: editArticleData.slug,
        excerpt: editArticleData.excerpt,
        content: editArticleData.content,
        featuredImage: editArticleData.featuredImage,
        featuredImageUrl: editArticleData.featuredImageUrl,
        author: editArticleData.author,
        category: editArticleData.category,
        tags: editArticleData.tags || [],
        readTime: editArticleData.readTime,
        isPremium: editArticleData.isPremium,
        publishedAt: editArticleData.publishedAt,
        viewCount: editArticleData.viewCount,
        createdAt: editArticleData.createdAt,
        updatedAt: editArticleData.updatedAt,
        zoneSettings: editArticleData.zoneSettings
      }
    }
    
    // Fallback for basic admin article data
    const zones = a.zones || ['read']
    const mappedZone = zones.find(zone => ['read', 'coach', 'player', 'parent'].includes(zone.toLowerCase())) || 'read'
    return {
      id: a.id,
      title: a.title,
      slug: a.slug || `article-${a.id}`,
      excerpt: a.excerpt || '',
      content: '',
      featuredImage: '',
      author: { name: typeof a.author === 'string' ? a.author : a.author.name },
      category: mappedZone,
      tags: [],
      readTime: 5,
      isPremium: a.isPremium,
      publishedAt: a.publishedAt,
      viewCount: a.viewCount,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Header />
      
      <div className="pt-20">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white/95 backdrop-blur sticky top-16 self-start shadow-sm border-r border-green-100 min-h-screen">
            <div className="p-6">
              <h2 className="text-lg font-bold text-[#000000] mb-6">Admin Panel</h2>
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id as ActiveTab)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all hover-lift ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 font-semibold shadow-sm'
                          : 'text-[#000000] hover:bg-green-50 hover:text-green-800'
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
              <div className="max-w-7xl mx-auto">
                <ArticleEditor
                  article={editArticleData}
                  onSave={handleSaveArticle}
                  onCancel={handleCancelEdit}
                />
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && <DashboardTab onCreateArticle={handleCreateArticle} onSetActiveTab={handleTabChange} />}
                {activeTab === 'articles' && <ArticlesTab onEditArticle={handleEditArticle} onCreateArticle={handleCreateArticle} onDeleteArticle={handleDeleteArticle} />}
                {activeTab === 'analytics' && <AnalyticsDashboard />}
                {activeTab === 'ordering' && <ArticleOrderTab />}
                {activeTab === 'series' && <SeriesManagement />}
                {activeTab === 'users' && <UsersTab />}
                {activeTab === 'categories' && <CategoriesTab categories={mockCategories} />}
                {activeTab === 'media' && <EnhancedMediaTab />}
                {activeTab === 'templates' && <TemplatesTab />}
                {activeTab === 'moderation' && <ModerationTab />}
                {activeTab === 'settings' && <SettingsTab />}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Exit Confirmation Modal */}
      {showExitConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.083 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#000000]">Незапазени промени</h3>
              </div>
            </div>
            
            <p className="text-[#166534] mb-6">
              Имате незапазени промени в статията. Искате ли да ги запазите преди да продължите?
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleSaveArticle({})
                  confirmExit()
                }}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Запази и продължи
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Изхвърли промените
              </button>
              <button
                onClick={cancelExit}
                className="flex-1 text-[#000000] border border-green-200 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
              >
                Отказ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Dashboard Tab with Real Data
function DashboardTab({ 
  onCreateArticle, 
  onSetActiveTab 
}: { 
  onCreateArticle: () => void
  onSetActiveTab: (tab: ActiveTab) => void
}) {
  const { data: articleStats, isLoading: statsLoading, error: statsError } = useAdminArticleStats()
  const { data: userStats, isLoading: userStatsLoading } = useAdminUserStats()

  if (statsLoading || userStatsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (statsError) {
    return (
      <ErrorBoundary 
        error={statsError} 
        resetError={() => window.location.reload()}
      />
    )
  }

  const stats = {
    totalArticles: articleStats?.data?.totalArticles || 0,
    totalUsers: userStats?.data?.totalUsers || 0,
    totalViews: articleStats?.data?.totalViews || 0,
    premiumUsers: userStats?.data?.premiumUsers || 0,
    monthlyGrowth: userStats?.data?.monthlyGrowth || 0
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#000000]">Dashboard</h1>
        <p className="text-[#000000] mt-2">Добре дошли в Admin панела на Football Zone</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-green-100 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#166534]">Общо статии</p>
              <p className="text-3xl font-bold text-[#000000]">{stats.totalArticles}</p>
            </div>
            <DocumentTextIcon className="w-8 h-8 text-green-600" />
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+{articleStats?.data?.monthlyNew || 0}</span>
            <span className="text-[#000000] ml-1">този месец</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-green-100 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#166534]">Потребители</p>
              <p className="text-3xl font-bold text-[#000000]">{stats.totalUsers}</p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+{stats.monthlyGrowth.toFixed(1)}%</span>
            <span className="text-[#000000] ml-1">растеж</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-green-100 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#166534]">Общо прегледи</p>
              <p className="text-3xl font-bold text-[#000000]">{stats.totalViews.toLocaleString()}</p>
            </div>
            <EyeIcon className="w-8 h-8 text-purple-600" />
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+{articleStats?.data?.weeklyViews || 0}</span>
            <span className="text-[#000000] ml-1">тази седмица</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-green-100 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#166534]">Premium потребители</p>
              <p className="text-3xl font-bold text-[#000000]">{stats.premiumUsers}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+{userStats?.data?.newPremiumUsers || 0}</span>
            <span className="text-[#000000] ml-1">нови абонати</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-[#000000] mb-4">Бързи действия</h3>
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
              className="w-full justify-start border-green-200 text-[#000000] hover:bg-green-50"
              onClick={() => onSetActiveTab('analytics')}
            >
              <ChartBarIcon className="w-4 h-4 mr-2" />
              Виж Analytics
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-green-200 text-[#000000] hover:bg-green-50"
              onClick={() => onSetActiveTab('ordering')}
            >
              <BarsArrowUpIcon className="w-4 h-4 mr-2" />
              Подреди статии
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-[#000000] mb-4">Последна активност</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-[#000000]">Нова статия публикувана</p>
                <p className="text-xs text-[#000000]">преди 2 часа</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-[#000000]">Нов потребител се регистрира</p>
                <p className="text-xs text-[#000000]">преди 4 часа</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-[#000000]">Видео качено в Coach Zone</p>
                <p className="text-xs text-[#000000]">преди 6 часа</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Articles Tab with Real Data
function ArticlesTab({ 
  onEditArticle, 
  onCreateArticle,
  onDeleteArticle
}: { 
  onEditArticle: (article: AdminArticle) => void
  onCreateArticle: () => void
  onDeleteArticle: (articleId: string) => void
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    zone: '',
    status: '',
    category: ''
  })

  const { data: articlesData, isLoading, error } = useAdminArticles({
    page: currentPage,
    limit: 10,
    ...filters
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorBoundary 
        error={error} 
        resetError={() => window.location.reload()}
      />
    )
  }

  const articles = articlesData?.data || []
  const totalPages = articlesData?.pagination?.pages || 1

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filtering
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#000000]">Статии</h1>
          <p className="text-[#000000] mt-2">Управление на всички статии в платформата</p>
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
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-green-100">
        <div className="flex items-center space-x-4">
          <select
            value={filters.zone}
            onChange={(e) => handleFilterChange('zone', e.target.value)}
            className="border border-green-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">Всички зони</option>
            <option value="coach">Coach Zone</option>
            <option value="player">Player Zone</option>
            <option value="parent">Parent Zone</option>
            <option value="READ">Read Zone</option>
          </select>
          <select 
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border border-green-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">Всички статуси</option>
            <option value="PUBLISHED">Публикувано</option>
            <option value="DRAFT">Чернова</option>
            <option value="REVIEW">На ревизия</option>
            <option value="ARCHIVED">Архивирано</option>
          </select>
          <select 
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="border border-green-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">Всички категории</option>
            <option value="TACTICS">Тактика</option>
            <option value="TRAINING">Тренировки</option>
            <option value="PSYCHOLOGY">Психология</option>
            <option value="NUTRITION">Хранене</option>
            <option value="TECHNIQUE">Техника</option>
            <option value="FITNESS">Фитнес</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow-sm border border-green-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#166534] uppercase tracking-wider">
                Статия
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#166534] uppercase tracking-wider">
                Автор
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#166534] uppercase tracking-wider">
                Зона
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#166534] uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#166534] uppercase tracking-wider">
                Прегледи
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#166534] uppercase tracking-wider">
                Дата
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#166534] uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-green-100">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-[#000000]">
                        {article.title}
                      </div>
                      <div className="text-sm text-[#166534]">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#000000]">
                  {typeof article.author === 'string' ? article.author : article.author?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    article.zones?.includes('coach') ? 'bg-green-100 text-green-800' :
                    article.zones?.includes('player') ? 'bg-blue-100 text-blue-800' :
                    article.zones?.includes('parent') ? 'bg-orange-100 text-orange-800' :
                    'bg-green-50 text-green-800'
                  }`}>
                    {article.zones?.join(', ') || 'READ'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    article.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                    article.status === 'DRAFT' ? 'bg-green-50 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status === 'PUBLISHED' ? 'Публикувано' :
                     article.status === 'DRAFT' ? 'Чернова' : 'На ревизия'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#000000]">
                  {(article.viewCount || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#166534]">
                  {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('bg-BG') : '-'}
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
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => onDeleteArticle(article.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Страница {currentPage} от {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm bg-white border border-green-200 rounded-lg disabled:opacity-50 hover:bg-green-50"
            >
              Предишна
            </button>
            <span className="text-sm text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm bg-white border border-green-200 rounded-lg disabled:opacity-50 hover:bg-green-50"
            >
              Следваща
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Users Tab with Real Data
function UsersTab() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    searchTerm: ''
  })

  const { data: usersData, isLoading, error } = useAdminUsers({
    page: currentPage,
    limit: 10,
    ...filters
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorBoundary 
        error={error} 
        resetError={() => window.location.reload()}
      />
    )
  }

  const users = usersData?.data?.data || []
  const totalPages = usersData?.data?.totalPages || 1

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#000000]">Потребители</h1>
          <p className="text-[#166534] mt-2">Управление на потребителски акаунти</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <PlusIcon className="w-4 h-4 mr-2" />
          Нов потребител
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-green-100">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Търси по име или email..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="flex-1 border border-green-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          />
          <select 
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="border border-green-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">Всички роли</option>
            <option value="ADMIN">Админ</option>
            <option value="COACH">Треньор</option>
            <option value="PLAYER">Играч</option>
            <option value="PARENT">Родител</option>
            <option value="FREE">Безплатен</option>
          </select>
          <select 
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border border-green-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">Всички статуси</option>
            <option value="active">Активен</option>
            <option value="inactive">Неактивен</option>
            <option value="banned">Блокиран</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-green-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#166534] uppercase tracking-wider">
                Потребител
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#166534] uppercase tracking-wider">
                Роля
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#166534] uppercase tracking-wider">
                Регистрация
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#166534] uppercase tracking-wider">
                Последна активност
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#166534] uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#166534] uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-green-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-[#000000]">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-[#166534]">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.subscription?.type === 'PREMIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-50 text-green-800'
                  }`}>
                    {user.role} {user.subscription?.type === 'PREMIUM' && 'Premium'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#166534]">
                  {new Date(user.createdAt).toLocaleDateString('bg-BG')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#166534]">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('bg-BG') : 'Никога'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Активен' : 'Неактивен'}
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

      {/* Pagination for Users */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Страница {currentPage} от {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm bg-white border border-green-200 rounded-lg disabled:opacity-50 hover:bg-green-50"
            >
              Предишна
            </button>
            <span className="text-sm text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm bg-white border border-green-200 rounded-lg disabled:opacity-50 hover:bg-green-50"
            >
              Следваща
            </button>
          </div>
        </div>
      )}
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
      default: return 'bg-green-50 text-green-800 border-green-200'
    }
  }

  // Fix Tailwind dynamic class bug for tabs by mapping explicit classes
  const getZoneTabClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-500 text-blue-600'
      case 'green': return 'border-green-500 text-green-600'
      case 'purple': return 'border-purple-500 text-purple-600'
      case 'orange': return 'border-orange-500 text-orange-600'
      default: return 'border-green-500 text-green-600'
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
            <h2 className="text-2xl font-bold text-[#000000]">
              {editingCategory ? 'Редактиране на категория' : 'Създаване на нова категория'}
            </h2>
            <button
              onClick={() => setShowCategoryForm(false)}
              className="text-[#166534] hover:text-green-700"
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
              <label className="block text-sm font-medium text-[#166534] mb-2">
                Име на категорията
              </label>
              <input
                type="text"
                name="name"
                defaultValue={editingCategory?.name || ''}
                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Въведете име на категорията"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#166534] mb-2">
                Зона
              </label>
              <select
                defaultValue={selectedZone}
                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {zones.map(zone => (
                  <option key={zone.id} value={zone.id}>{zone.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#166534] mb-2">
                Описание
              </label>
              <textarea
                rows={3}
                defaultValue={editingCategory?.description || ''}
                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Кратко описание на категорията"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#166534] mb-2">
                Slug (URL идентификатор)
              </label>
              <input
                type="text"
                defaultValue={editingCategory?.id || ''}
                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="напр. taktika, hranene, tehnika"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => setShowCategoryForm(false)}
                className="px-6 py-2 border border-green-200 text-[#000000] rounded-lg hover:bg-green-50"
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
          <h1 className="text-3xl font-bold text-[#000000]">Категории</h1>
          <p className="text-[#166534] mt-2">Управление на категории в различните зони</p>
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
        <div className="border-b border-green-200">
          <nav className="-mb-px flex space-x-8">
            {zones.map(zone => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedZone === zone.id
                    ? getZoneTabClasses(zone.color)
                    : 'border-transparent text-[#166534] hover:text-green-700 hover:border-green-300'
                }`}
              >
                {zone.name}
                <span className="ml-2 px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full">
                  {zoneCategories[selectedZone as keyof typeof zoneCategories]?.length || 0}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Zone Summary */}
      <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#000000]">
              {zones.find(z => z.id === selectedZone)?.name}
            </h3>
            <p className="text-[#166534] mt-1">
              Общо {zoneCategories[selectedZone as keyof typeof zoneCategories]?.reduce((sum, cat) => sum + cat.count, 0)} статии в {zoneCategories[selectedZone as keyof typeof zoneCategories]?.length} категории
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg border ${getZoneColor(zones.find(z => z.id === selectedZone)?.color || 'gray')} shadow-xs` }>
            <span className="font-medium">
              {zones.find(z => z.id === selectedZone)?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zoneCategories[selectedZone as keyof typeof zoneCategories]?.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm p-6 border border-green-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#000000] mb-2">{category.name}</h3>
                <p className="text-sm text-[#166534] mb-3">{category.description}</p>
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
                <span className="text-sm font-medium text-[#000000]">{category.count}</span>
                <span className="text-sm text-[#166534]">статии</span>
              </div>
              <span className="text-xs text-[#166534]">#{category.id}</span>
            </div>
          </div>
        ))}
        
        {/* Add Category Card */}
        <div 
          className="bg-green-50 border-2 border-dashed border-green-300 rounded-lg p-6 flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors"
          onClick={handleCreateCategory}
        >
          <div className="text-center">
            <PlusIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-green-700">Добави категория</p>
          </div>
        </div>
      </div>

      {/* Category Statistics */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        {zones.map(zone => {
          const zoneData = zoneCategories[zone.id as keyof typeof zoneCategories] || []
          const totalArticles = zoneData.reduce((sum, cat) => sum + cat.count, 0)
          
          return (
            <div key={zone.id} className="bg-white rounded-lg shadow-sm p-6 border border-green-100">
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${getZoneColor(zone.color)}`}>
                  <span className="font-bold text-lg">{zone.name.charAt(0)}</span>
                </div>
                <h4 className="font-semibold text-[#000000] mb-1">{zone.name}</h4>
                <p className="text-2xl font-bold text-[#000000]">{totalArticles}</p>
                <p className="text-sm text-[#166534]">статии в {zoneData.length} категории</p>
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
  const [showUpload, setShowUpload] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#000000]">Медия управление</h1>
          <p className="text-[#166534] mt-2">Качване и управление на медийни файлове</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowUpload(true)}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Качи файлове
        </Button>
      </div>

      {showUpload ? (
        <div className="bg-white rounded-lg border border-green-100 p-6 mb-8">
          <MediaUploadForm 
            onUploadComplete={() => setShowUpload(false)}
            onCancel={() => setShowUpload(false)}
          />
        </div>
      ) : (
        <MediaGallery />
      )}
    </div>
  )
}

// Templates Tab
function TemplatesTab() {
  const handleCreateTemplate = () => {
    console.log('Creating new template')
    // Here you would typically open the template editor
  }

  const handleEditTemplate = (template: any) => {
    console.log('Editing template:', template)
    // Here you would typically open the template editor with the template data
  }

  const handleDeleteTemplate = (templateId: string) => {
    console.log('Deleting template:', templateId)
    // Here you would typically confirm and delete the template
  }

  return (
    <TemplateManager
      onCreateTemplate={handleCreateTemplate}
      onEditTemplate={handleEditTemplate}
      onDeleteTemplate={handleDeleteTemplate}
    />
  )
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
        <h1 className="text-3xl font-bold text-[#000000]">Настройки</h1>
        <p className="text-[#166534] mt-2">Общи настройки на платформата</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Site Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-[#000000] mb-4">Настройки на сайта</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#166534] mb-2">
                Име на сайта
              </label>
              <input
                type="text"
                defaultValue="Football Zone"
                className="w-full px-3 py-2 border border-green-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#166534] mb-2">
                Описание
              </label>
              <textarea
                defaultValue="Българска футболна платформа за треньори, играчи и родители"
                className="w-full px-3 py-2 border border-green-200 rounded-lg"
                rows={3}
              />
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              Запази промените
            </Button>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-[#000000] mb-4">Email настройки</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#166534] mb-2">
                SMTP Host
              </label>
              <input
                type="text"
                defaultValue="smtp.gmail.com"
                className="w-full px-3 py-2 border border-green-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#166534] mb-2">
                SMTP Port
              </label>
              <input
                type="text"
                defaultValue="587"
                className="w-full px-3 py-2 border border-green-200 rounded-lg"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Тествай връзката
            </Button>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-[#000000] mb-4">Analytics</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#166534] mb-2">
                Google Analytics ID
              </label>
              <input
                type="text"
                placeholder="GA-XXXXXXXXX"
                className="w-full px-3 py-2 border border-green-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#166534] mb-2">
                Facebook Pixel ID
              </label>
              <input
                type="text"
                placeholder="123456789"
                className="w-full px-3 py-2 border border-green-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Backup */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-[#000000] mb-4">Резервно копие</h3>
          <div className="space-y-4">
            <p className="text-sm text-[#166534]">
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

// Moderation Tab (Коментари и сигнали)
function ModerationTab() {
  const mockReports = [
    { id: 'r1', type: 'comment', reason: 'Обиден език', target: 'Коментар #1245', createdAt: 'преди 2 часа', status: 'pending' },
    { id: 'r2', type: 'user', reason: 'Спам поведение', target: 'Потребител maria@example.com', createdAt: 'преди 5 часа', status: 'reviewing' },
    { id: 'r3', type: 'comment', reason: 'Неподходящо съдържание', target: 'Коментар #1189', createdAt: 'вчера', status: 'resolved' }
  ] as const

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'reviewing':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-green-50 text-green-800'
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#000000]">Модерация</h1>
        <p className="text-[#166534] mt-2">Управлявайте коментари, сигнали и нарушения</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-green-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#000000] mb-2">Отворени сигнали</h3>
          <p className="text-3xl font-bold text-[#000000]">12</p>
        </div>
        <div className="bg-white border border-green-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#000000] mb-2">Очакват преглед</h3>
          <p className="text-3xl font-bold text-[#000000]">5</p>
        </div>
        <div className="bg-white border border-green-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#000000] mb-2">Решени тази седмица</h3>
          <p className="text-3xl font-bold text-[#000000]">27</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-green-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#166534] uppercase tracking-wider">Тип</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#166534] uppercase tracking-wider">Причина</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#166534] uppercase tracking-wider">Обект</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#166534] uppercase tracking-wider">Създаден</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#166534] uppercase tracking-wider">Статус</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#166534] uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-green-100">
            {mockReports.map((r) => (
              <tr key={r.id} className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-sm text-[#000000]">{r.type === 'comment' ? 'Коментар' : 'Потребител'}</td>
                <td className="px-6 py-4 text-sm text-[#000000]">{r.reason}</td>
                <td className="px-6 py-4 text-sm text-[#166534]">{r.target}</td>
                <td className="px-6 py-4 text-sm text-[#166534]">{r.createdAt}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(r.status)}`}>{r.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">Одобри</button>
                    <button className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">Изтрий</button>
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

// Note: SeriesTab has been replaced with SeriesManagement component
export default function AdminPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminContent />
    </Suspense>
  )
}
