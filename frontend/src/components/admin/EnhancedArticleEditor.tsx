'use client'

import React, { useState, useEffect } from 'react'
import { 
  DocumentTextIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  SparklesIcon,
  DocumentDuplicateIcon,
  CogIcon,
  TagIcon,
  PhotoIcon,
  SwatchIcon
} from '@heroicons/react/24/outline'
import AdvancedRichTextEditor from './AdvancedRichTextEditor'
import TemplateSelector from './TemplateSelector'
import { Article, ArticleTemplate } from '@/types'

interface EnhancedArticleEditorProps {
  article?: Partial<Article>
  templates: ArticleTemplate[]
  onSave: (article: Article) => void
  onCancel: () => void
  mode: 'create' | 'edit'
  onContentChange?: () => void
}

export default function EnhancedArticleEditor({
  article,
  templates,
  onSave,
  onCancel,
  mode,
  onContentChange
}: EnhancedArticleEditorProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'zones' | 'styling' | 'template'>('content')
  const [showPreview, setShowPreview] = useState(false)
  const [articleData, setArticleData] = useState<Partial<Article>>({
    title: '',
    excerpt: '',
    content: '',
    category: 'read',
    subcategory: '',
    tags: [],
    featuredImage: '',
    isPremium: false,
    zones: ['read'],
    zoneSettings: {
      read: { visible: true, requiresSubscription: false },
      coach: { visible: false, requiresSubscription: true },
      player: { visible: false, requiresSubscription: true },
      parent: { visible: false, requiresSubscription: true }
    },
    template: templates[0],
    isFeatured: false,
    order: 0,
    formatting: {
      fontSize: 16,
      fontFamily: 'Inter',
      textColor: '#374151',
      backgroundColor: '#ffffff',
      lineHeight: 1.6,
      textAlign: 'left'
    },
    ...article
  })

  const [selectedTemplate, setSelectedTemplate] = useState<string>(articleData.template?.id || templates[0]?.id || '')

  useEffect(() => {
    if (article) {
      setArticleData(article)
      setSelectedTemplate(article.template?.id || templates[0]?.id || '')
    }
  }, [article, templates])

  // Guard: handle empty templates gracefully
  useEffect(() => {
    if (!templates || templates.length === 0) {
      setArticleData(prev => ({
        ...prev,
        template: prev.template || {
          id: 'default',
          name: 'Default',
          description: 'Базов темплейт',
          category: 'universal' as any,
          settings: {
            textLength: 'medium',
            allowVideos: true,
            allowImages: true,
            allowDownloads: false,
            imageLayout: 'single',
            styling: {
              layout: 'single-column',
              fontSize: 'medium',
              spacing: 'normal',
              colors: { primary: '#16a34a', secondary: '#0ea5e9', text: '#111827' }
            }
          } as any
        }
      }))
    }
  }, [templates])

  const handleInputChange = (field: string, value: any) => {
    setArticleData(prev => ({
      ...prev,
      [field]: value
    }))
    onContentChange?.()
  }

  const handleZoneSettingChange = (zone: keyof typeof articleData.zoneSettings, setting: string, value: any) => {
    setArticleData(prev => ({
      ...prev,
      zoneSettings: {
        ...prev.zoneSettings,
        [zone]: {
          ...prev.zoneSettings?.[zone],
          [setting]: value
        }
      }
    }))
    onContentChange?.()
  }

  const handleFormattingChange = (property: string, value: any) => {
    setArticleData(prev => ({
      ...prev,
      formatting: {
        ...prev.formatting,
        [property]: value
      }
    }))
    onContentChange?.()
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setArticleData(prev => ({
        ...prev,
        template
      }))
      onContentChange?.()
    }
  }

  const handleSave = () => {
    if (!articleData.title || !articleData.content) {
      alert('Моля, попълнете заглавието и съдържанието')
      return
    }

    const newArticle: Article = {
      id: articleData.id || Date.now().toString(),
      title: articleData.title || '',
      slug: articleData.slug || articleData.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
      excerpt: articleData.excerpt || '',
      content: articleData.content || '',
      featuredImage: articleData.featuredImage || '',
      author: articleData.author || {
        name: 'Admin',
        avatar: '/images/admin-avatar.jpg'
      },
      category: articleData.category as any || 'read',
      subcategory: articleData.subcategory,
      tags: articleData.tags || [],
      publishedAt: articleData.publishedAt || new Date(),
      readTime: Math.ceil((articleData.content || '').replace(/<[^>]*>/g, '').split(' ').length / 200),
      isPremium: articleData.isPremium || false,
      zones: articleData.zones || ['read'],
      zoneSettings: articleData.zoneSettings || {
        read: { visible: true, requiresSubscription: false },
        coach: { visible: false, requiresSubscription: true },
        player: { visible: false, requiresSubscription: true },
        parent: { visible: false, requiresSubscription: true }
      },
      template: articleData.template || templates[0],
      isFeatured: articleData.isFeatured || false,
      order: articleData.order || 0,
      viewCount: articleData.viewCount || 0,
      formatting: articleData.formatting || {
        fontSize: 16,
        fontFamily: 'Inter',
        textColor: '#374151',
        backgroundColor: '#ffffff',
        lineHeight: 1.6,
        textAlign: 'left'
      }
    }

    onSave(newArticle)
  }

  const addTag = (tag: string) => {
    if (tag && !articleData.tags?.includes(tag)) {
      handleInputChange('tags', [...(articleData.tags || []), tag])
    }
  }

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', (articleData.tags || []).filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">
            {mode === 'create' ? 'Създаване на нова статия' : 'Редактиране на статия'}
          </h1>
          <p className="text-black mt-1">
            Използвайте разширените опции за форматиране и контрол на видимостта
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 border rounded-lg transition-colors font-medium ${
              showPreview
                ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'
                : 'text-purple-600 border-purple-300 hover:bg-purple-50'
            }`}
          >
            <EyeIcon className="w-4 h-4 mr-2 inline" />
            {showPreview ? 'Скрий преглед' : 'Преглед'}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отказ
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {mode === 'create' ? 'Създай статия' : 'Запази промените'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/70 backdrop-blur border border-gray-200 rounded-lg mb-6 sticky top-16 z-10">
        {[
          { id: 'template', icon: DocumentDuplicateIcon, label: 'Темплейт' },
          { id: 'content', icon: DocumentTextIcon, label: 'Съдържание' },
          { id: 'settings', icon: CogIcon, label: 'Настройки' },
          { id: 'zones', icon: EyeIcon, label: 'Зони' },
          { id: 'styling', icon: SwatchIcon, label: 'Стилизиране' }
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-black hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {showPreview ? (
        /* Full-screen Preview */
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-black">Предварителен преглед на статията</h3>
          </div>
          <div className="p-8">
            {/* Article Preview */}
            <article 
              className="prose prose-lg max-w-none"
              style={{
                fontFamily: articleData.formatting?.fontFamily || 'Inter',
                fontSize: `${articleData.formatting?.fontSize || 16}px`,
                color: articleData.formatting?.textColor || '#374151',
                backgroundColor: articleData.formatting?.backgroundColor || 'transparent',
                lineHeight: articleData.formatting?.lineHeight || 1.6,
                textAlign: articleData.formatting?.textAlign || 'left'
              }}
            >
              {/* Article Header */}
              <header className="not-prose mb-8 pb-8 border-b border-gray-200">
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {articleData.category || 'Без категория'}
                  </span>
                </div>
                
                <h1 className="text-4xl font-bold text-black mb-4 leading-tight">
                  {articleData.title || 'Заглавие на статията'}
                </h1>
                
                {articleData.excerpt && (
                  <p className="text-xl text-black leading-relaxed mb-6">
                    {articleData.excerpt}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-black mb-6">
                  <div className="flex items-center">
                    <span>Автор: Admin</span>
                  </div>
                  <div className="flex items-center">
                    <span>Време за четене: ~{Math.ceil((articleData.content || '').replace(/<[^>]*>/g, '').split(' ').length / 200)} мин</span>
                  </div>
                  <div className="flex items-center">
                    <span>Дата: {new Date().toLocaleDateString('bg-BG')}</span>
                  </div>
                </div>
                
                {(articleData.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {(articleData.tags || []).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-200 text-black text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              {/* Article Content */}
              <div 
                dangerouslySetInnerHTML={{ __html: articleData.content || '<p>Няма съдържание за показване.</p>' }}
              />
            </article>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'template' && (
              <div className="bg-white p-6 rounded-lg border">
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={handleTemplateSelect}
                  category={articleData.category || 'read'}
                  zone={articleData.category || 'read'}
                  onTemplateConfig={(templateId) => {
                    console.log('Configure template:', templateId)
                  }}
                />
              </div>
            )}

            {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white p-6 rounded-lg border">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Заглавие *
                    </label>
                    <input
                      type="text"
                      value={articleData.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Въведете заглавие на статията..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Кратко описание
                    </label>
                    <textarea
                      value={articleData.excerpt || ''}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Кратко описание на статията..."
                    />
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white rounded-lg border">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-black">Съдържание на статията</h3>
                </div>
                <div className="p-6">
                  <AdvancedRichTextEditor
                    value={articleData.content || ''}
                    onChange={(content) => handleInputChange('content', content)}
                    placeholder="Започнете да пишете статията..."
                    className="min-h-96"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-lg border space-y-6">
              <h3 className="text-lg font-semibold text-black">Основни настройки</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Основна категория
                  </label>
                  <select
                    value={articleData.category || 'read'}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="read">Read Zone</option>
                    <option value="coach">Coach Zone</option>
                    <option value="player">Player Zone</option>
                    <option value="parent">Parent Zone</option>
                    <option value="news">Новини</option>
                    <option value="training">Тренировки</option>
                    <option value="tactics">Тактика</option>
                    <option value="technique">Техника</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Подкатегория
                  </label>
                  <input
                    type="text"
                    value={articleData.subcategory || ''}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Специфична подкатегория..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Темплейт
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!templates || templates.length === 0}
                  >
                    {templates && templates.length > 0 ? (
                      templates.map(template => (
                        <option key={template.id} value={template.id}>{template.name}</option>
                      ))
                    ) : (
                      <option value="default">Default</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Изображение (URL)
                  </label>
                  <input
                    type="url"
                    value={articleData.featuredImage || ''}
                    onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPremium"
                    checked={articleData.isPremium || false}
                    onChange={(e) => handleInputChange('isPremium', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPremium" className="ml-2 text-sm text-gray-700">
                    Премиум съдържание
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={articleData.isFeatured || false}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                    Открита статия
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ред на показване
                </label>
                <input
                  type="number"
                  value={articleData.order || 0}
                  onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                  className="w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                <p className="text-sm text-gray-500 mt-1">По-ниски номера се показват първи</p>
              </div>
            </div>
          )}

          {activeTab === 'zones' && (
            <div className="bg-white p-6 rounded-lg border space-y-6">
              <h3 className="text-lg font-semibold text-black">Настройки на зоните</h3>
              <p className="text-black">
                Конфигурирайте в кои зони да се показва статията и дали да изисква абонамент
              </p>

              <div className="space-y-4">
                {Object.entries(articleData.zoneSettings || {}).map(([zone, settings]) => (
                  <div key={zone} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 capitalize mb-2">
                          {zone === 'read' ? 'Read Zone' : 
                           zone === 'coach' ? 'Coach Zone' :
                           zone === 'player' ? 'Player Zone' :
                           zone === 'parent' ? 'Parent Zone' : zone} Zone
                        </h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`${zone}-visible`}
                              checked={settings?.visible || false}
                              onChange={(e) => handleZoneSettingChange(zone as any, 'visible', e.target.checked)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={`${zone}-visible`} className="ml-2 text-sm text-gray-700">
                              Видима в тази зона
                            </label>
                          </div>

                          {settings?.visible && (
                            <div className="ml-6 space-y-2">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`${zone}-subscription`}
                                  checked={settings?.requiresSubscription || false}
                                  onChange={(e) => handleZoneSettingChange(zone as any, 'requiresSubscription', e.target.checked)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor={`${zone}-subscription`} className="ml-2 text-sm text-gray-700">
                                  Изисква абонамент
                                </label>
                              </div>

                              <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                  Безплатна от дата (по желание):
                                </label>
                                <input
                                  type="date"
                                  value={settings?.freeAfterDate ? new Date(settings.freeAfterDate).toISOString().split('T')[0] : ''}
                                  onChange={(e) => handleZoneSettingChange(zone as any, 'freeAfterDate', e.target.value ? new Date(e.target.value) : undefined)}
                                  className="w-48 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'styling' && (
            <div className="bg-white p-6 rounded-lg border space-y-6">
              <h3 className="text-lg font-semibold text-black">Стилизиране на статията</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Размер на шрифта
                  </label>
                  <select
                    value={articleData.formatting?.fontSize || 16}
                    onChange={(e) => handleFormattingChange('fontSize', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={12}>12px</option>
                    <option value={14}>14px</option>
                    <option value={16}>16px</option>
                    <option value={18}>18px</option>
                    <option value={20}>20px</option>
                    <option value={24}>24px</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Тип шрифт
                  </label>
                  <select
                    value={articleData.formatting?.fontFamily || 'Inter'}
                    onChange={(e) => handleFormattingChange('fontFamily', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Подравняване
                  </label>
                  <select
                    value={articleData.formatting?.textAlign || 'left'}
                    onChange={(e) => handleFormattingChange('textAlign', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="left">Ляво</option>
                    <option value="center">Център</option>
                    <option value="right">Дясно</option>
                    <option value="justify">Изравнено</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Цвят на текста
                  </label>
                  <input
                    type="color"
                    value={articleData.formatting?.textColor || '#374151'}
                    onChange={(e) => handleFormattingChange('textColor', e.target.value)}
                    className="w-full h-12 p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Цвят на фона
                  </label>
                  <input
                    type="color"
                    value={articleData.formatting?.backgroundColor || '#ffffff'}
                    onChange={(e) => handleFormattingChange('backgroundColor', e.target.value)}
                    className="w-full h-12 p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Междуредие
                  </label>
                  <select
                    value={articleData.formatting?.lineHeight || 1.6}
                    onChange={(e) => handleFormattingChange('lineHeight', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1.2}>1.2</option>
                    <option value={1.4}>1.4</option>
                    <option value={1.6}>1.6</option>
                    <option value={1.8}>1.8</option>
                    <option value={2.0}>2.0</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tags */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
              <TagIcon className="w-5 h-5 mr-2" />
              Тагове
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Добавете таг и натиснете Enter..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const tag = e.currentTarget.value.trim()
                    if (tag) {
                      addTag(tag)
                      e.currentTarget.value = ''
                    }
                  }
                }}
              />
              <div className="flex flex-wrap gap-2">
                {(articleData.tags || []).map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Template Info */}
          {articleData.template && (
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
                Избран темплейт
              </h3>
              <div className="space-y-2">
                <h4 className="font-medium text-black">{articleData.template.name}</h4>
                <p className="text-sm text-black">{articleData.template.description}</p>
                <div className="flex items-center text-sm">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {articleData.template.category}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
              <EyeIcon className="w-5 h-5 mr-2" />
              Кратък преглед
            </h3>
            <div className="space-y-2 text-sm text-black">
              <div>Заглавие: <span className="font-medium">{articleData.title || 'Без заглавие'}</span></div>
              <div>Категория: <span className="font-medium">{articleData.category}</span></div>
              <div>Тагове: <span className="font-medium">{(articleData.tags || []).length}</span></div>
              <div>
                Зони: 
                <span className="font-medium ml-1">
                  {Object.entries(articleData.zoneSettings || {})
                    .filter(([, settings]) => settings?.visible)
                    .map(([zone]) => zone)
                    .join(', ') || 'Няма'}
                </span>
              </div>
              <div>Време за четене: <span className="font-medium">~{Math.ceil((articleData.content || '').replace(/<[^>]*>/g, '').split(' ').length / 200)} мин</span></div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}