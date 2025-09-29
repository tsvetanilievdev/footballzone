'use client'

import React, { useState } from 'react'
import { 
  DocumentTextIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  SparklesIcon,
  RectangleGroupIcon as TemplateIcon,
  CogIcon as CustomIcon,
  EyeIcon as PreviewIcon
} from '@heroicons/react/24/outline'
import RichTextEditor from './RichTextEditor'
import ZoneAssignmentSelector from './ZoneAssignmentSelector'
import PremiumScheduler from './PremiumScheduler'
import { Article, ArticleTemplate } from '@/types'
import { articleTemplates } from '@/data/templates'

interface TemplateBasedArticleCreatorProps {
  onSave: (article: Article) => void
  onCancel: () => void
}

export default function TemplateBasedArticleCreator({
  onSave,
  onCancel
}: TemplateBasedArticleCreatorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [contentMode, setContentMode] = useState<'rich' | 'template' | 'custom' | 'preview'>('rich')
  const [articleData, setArticleData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    template: '',
    category: '',
    subcategory: '',
    tags: [] as string[],
    featuredImage: '',
    isPremium: false,
    status: 'draft' as 'draft' | 'published',
    zones: [] as string[],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [] as string[],
    authorName: '',
    authorBio: '',
    readTime: 5,
    premiumSchedule: undefined as { releaseFree: Date; isPermanentPremium: boolean } | undefined
  })

  const handleInputChange = (field: string, value: any) => {
    setArticleData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleZonesChange = (zones: string[]) => {
    setArticleData(prev => ({
      ...prev,
      zones
    }))
  }

  const handlePremiumChange = (isPremium: boolean) => {
    setArticleData(prev => ({
      ...prev,
      isPremium
    }))
  }

  const handleScheduleChange = (schedule?: { releaseFree: Date; isPermanentPremium: boolean }) => {
    setArticleData(prev => ({
      ...prev,
      premiumSchedule: schedule
    }))
  }

  const handleContentChange = (content: string) => {
    setArticleData(prev => ({
      ...prev,
      content
    }))
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = articleTemplates.find(t => t.id === templateId)
    if (template) {
      setArticleData(prev => ({
        ...prev,
        template: templateId,
        content: template.defaultContent || ''
      }))
    }
  }

  const handleSave = () => {
    // Валидация на задължителни полета според backend схемата
    if (!articleData.title || articleData.title.length < 3) {
      alert('Заглавието е задължително и трябва да съдържа поне 3 символа')
      return
    }
    if (!articleData.content || articleData.content.length < 10) {
      alert('Съдържанието е задължително и трябва да съдържа поне 10 символа')
      return
    }
    if (!articleData.category) {
      alert('Категорията е задължителна')
      return
    }
    if (articleData.zones.length === 0) {
      alert('Трябва да изберете поне една зона за статията')
      return
    }
    if (!articleData.authorName) {
      alert('Името на автора е задължително')
      return
    }
    if (articleData.slug && articleData.slug.length < 3) {
      alert('Slug-ът трябва да съдържа поне 3 символа')
      return
    }

    // Генериране на slug ако не е зададен
    const generatedSlug = articleData.slug || articleData.title.toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Премахва специални символи
      .replace(/\s+/g, '-') // Заменя интервалите с тирета
      .replace(/^-+|-+$/g, '') // Премахва тиретата в началото и края

    const newArticle: Article = {
      id: Date.now().toString(),
      title: articleData.title,
      slug: generatedSlug,
      excerpt: articleData.excerpt,
      content: articleData.content,
      template: articleTemplates.find(t => t.id === articleData.template) || articleTemplates[0],
      category: articleData.category,
      subcategory: articleData.subcategory,
      tags: articleData.tags,
      featuredImage: articleData.featuredImage,
      author: {
        name: articleData.authorName || 'Admin',
        avatar: '/images/admin-avatar.jpg',
        bio: articleData.authorBio || 'Администратор на Football Zone'
      },
      publishedAt: new Date().toISOString(),
      readTime: articleData.readTime || Math.ceil(articleData.content.split(' ').length / 200),
      isPremium: articleData.isPremium,
      premiumSchedule: articleData.premiumSchedule,
      status: articleData.status,
      views: 0,
      likes: 0,
      comments: [],
      zones: articleData.zones,
      seo: {
        title: articleData.seoTitle,
        description: articleData.seoDescription,
        keywords: articleData.seoKeywords
      }
    }

    onSave(newArticle)
  }

  const getTemplatesByCategory = (category: string) => {
    return articleTemplates.filter(template => template.category === category)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Създаване на нова статия</h1>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Отказ
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Запази статията
          </button>
        </div>
      </div>

      {/* Content Mode Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setContentMode('rich')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            contentMode === 'rich'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <SparklesIcon className="w-4 h-4 mr-1 inline" />
          Редактор
        </button>
        <button
          onClick={() => setContentMode('template')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            contentMode === 'template'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <TemplateIcon className="w-4 h-4 mr-1 inline" />
          Темплейти
        </button>
        <button
          onClick={() => setContentMode('custom')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            contentMode === 'custom'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <CustomIcon className="w-4 h-4 mr-1 inline" />
          Персонализиран
        </button>
        <button
          onClick={() => setContentMode('preview')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            contentMode === 'preview'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <PreviewIcon className="w-4 h-4 mr-1 inline" />
          Преглед
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {contentMode === 'rich' && (
            <div className="space-y-4">
              <RichTextEditor
                value={articleData.content}
                onChange={handleContentChange}
                placeholder="Започнете да пишете статията..."
                className="min-h-96"
              />
            </div>
          )}

          {contentMode === 'template' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Изберете темплейт</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['read', 'coach', 'player', 'parent'].map(category => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-medium text-gray-700 capitalize">{category} Zone</h4>
                    <div className="space-y-2">
                      {getTemplatesByCategory(category).map(template => (
                        <div
                          key={template.id}
                          onClick={() => handleTemplateSelect(template.id)}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedTemplate === template.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <DocumentTextIcon className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">{template.name}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {contentMode === 'custom' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Персонализиран редактор</h3>
              <textarea
                value={articleData.content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none"
                placeholder="Въведете HTML съдържание..."
              />
              <p className="text-sm text-gray-500">
                💡 Съвет: Можете да използвате HTML тагове за форматиране
              </p>
            </div>
          )}

          {contentMode === 'preview' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Предварителен преглед</h3>
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <h1 className="text-2xl font-bold mb-4">{articleData.title || 'Заглавие на статията'}</h1>
                <p className="text-gray-600 mb-6">{articleData.excerpt || 'Кратко описание...'}</p>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: articleData.content || '<p>Съдържание на статията...</p>' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Основна информация</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Заглавие *
                </label>
                <input
                  type="text"
                  value={articleData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Въведете заглавие на статията..."
                  required
                  minLength={3}
                  maxLength={255}
                />
                <p className="text-xs text-gray-500 mt-1">Минимум 3 символа, максимум 255</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL адрес)
                </label>
                <input
                  type="text"
                  value={articleData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="url-friendly-ime-na-statiata"
                  minLength={3}
                  maxLength={255}
                  pattern="[a-z0-9-]+"
                />
                <p className="text-xs text-gray-500 mt-1">Оставете празно за автоматично генериране. Само малки букви, цифри и тирета.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Кратко описание
                </label>
                <textarea
                  value={articleData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Кратко описание на статията..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">Максимум 500 символа</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория *
                </label>
                <select
                  value={articleData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Изберете категория</option>
                  <option value="TACTICS">Тактика</option>
                  <option value="TECHNIQUE">Техника</option>
                  <option value="FITNESS">Фитнес</option>
                  <option value="PSYCHOLOGY">Психология</option>
                  <option value="NUTRITION">Хранене</option>
                  <option value="INJURY_PREVENTION">Превенция на травми</option>
                  <option value="COACHING">Треньорство</option>
                  <option value="YOUTH_DEVELOPMENT">Юношеско развитие</option>
                  <option value="EQUIPMENT">Екипировка</option>
                  <option value="RULES">Правила</option>
                  <option value="NEWS">Новини</option>
                  <option value="INTERVIEWS">Интервюта</option>
                  <option value="ANALYSIS">Анализи</option>
                  <option value="OTHER">Други</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Подкатегория
                </label>
                <input
                  type="text"
                  value={articleData.subcategory}
                  onChange={(e) => handleInputChange('subcategory', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Подкатегория (по желание)..."
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">Максимум 100 символа</p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Настройки</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Премиум съдържание
                </label>
                <button
                  onClick={() => handleInputChange('isPremium', !articleData.isPremium)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    articleData.isPremium ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      articleData.isPremium ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Статус
                </label>
                <select
                  value={articleData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Чернова</option>
                  <option value="published">Публикувана</option>
                </select>
              </div>
            </div>
          </div>

          {/* Zone Assignment */}
          <div className="bg-white p-6 rounded-lg border">
            <ZoneAssignmentSelector
              selectedZones={articleData.zones}
              onZonesChange={handleZonesChange}
            />
          </div>

          {/* Premium Settings */}
          <div className="bg-white p-6 rounded-lg border">
            <PremiumScheduler
              isPremium={articleData.isPremium}
              premiumSchedule={articleData.premiumSchedule}
              onPremiumChange={handlePremiumChange}
              onScheduleChange={handleScheduleChange}
            />
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Основна снимка</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={articleData.featuredImage}
                onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="URL на основната снимка..."
              />
              <p className="text-xs text-gray-500">Въведете URL адрес на основната снимка за статията</p>
            </div>
          </div>

          {/* Author Information */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация за автора</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Име на автора *
                </label>
                <input
                  type="text"
                  value={articleData.authorName}
                  onChange={(e) => handleInputChange('authorName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Въведете име на автора..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Кратко био
                </label>
                <textarea
                  value={articleData.authorBio}
                  onChange={(e) => handleInputChange('authorBio', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Кратко описание на автора..."
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">Максимум 300 символа</p>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO настройки</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO заглавие
                </label>
                <input
                  type="text"
                  value={articleData.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SEO оптимизирано заглавие..."
                  maxLength={255}
                />
                <p className="text-xs text-gray-500 mt-1">Максимум 255 символа</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO описание
                </label>
                <textarea
                  value={articleData.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SEO описание (до 160 символа)..."
                  maxLength={320}
                />
                <p className="text-xs text-gray-500 mt-1">Максимум 320 символа</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO ключови думи
                </label>
                <input
                  type="text"
                  placeholder="Добавете ключова дума и натиснете Enter..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const keyword = e.currentTarget.value.trim()
                      if (keyword && !articleData.seoKeywords.includes(keyword)) {
                        handleInputChange('seoKeywords', [...articleData.seoKeywords, keyword])
                        e.currentTarget.value = ''
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {articleData.seoKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center gap-1"
                    >
                      {keyword}
                      <button
                        onClick={() => handleInputChange('seoKeywords', articleData.seoKeywords.filter((_, i) => i !== index))}
                        className="text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Article Settings */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Настройки на статията</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Време за четене (минути)
                </label>
                <input
                  type="number"
                  value={articleData.readTime}
                  onChange={(e) => handleInputChange('readTime', parseInt(e.target.value) || 5)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={1}
                  max={240}
                />
                <p className="text-xs text-gray-500 mt-1">Приблизително време за четене в минути (1-240)</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Тагове</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Добавете таг и натиснете Enter..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const tag = e.currentTarget.value.trim()
                    if (tag && !articleData.tags.includes(tag)) {
                      handleInputChange('tags', [...articleData.tags, tag])
                      e.currentTarget.value = ''
                    }
                  }
                }}
              />
              <div className="flex flex-wrap gap-2">
                {articleData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleInputChange('tags', articleData.tags.filter((_, i) => i !== index))}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
