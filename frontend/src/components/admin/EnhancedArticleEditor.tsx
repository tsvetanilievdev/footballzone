'use client'

import React, { useState, useEffect } from 'react'
import { Article, ArticleTemplate } from '@/types'
import { 
  DocumentDuplicateIcon, 
  DocumentTextIcon, 
  CogIcon, 
  EyeIcon, 
  SwatchIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import TemplateSelector from './TemplateSelector'
import AdvancedRichTextEditor from './AdvancedRichTextEditor'
import FormErrors from '@/components/ui/FormErrors'
import { ParsedValidationError } from '@/utils/errorUtils'
import { getDefaultFeaturedImage } from '@/utils/articleDefaults'

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
  const [activeTab, setActiveTab] = useState<'template' | 'content' | 'settings' | 'zones' | 'styling'>('template')
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ParsedValidationError[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const [articleData, setArticleData] = useState<Partial<Article>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: { name: 'Admin' },
    category: 'NEWS',
    tags: [],
    publishedAt: new Date(),
    readTime: 0,
    isPremium: false,
    zones: ['read'],
    zoneSettings: {
      read: { visible: true, requiresSubscription: false },
      coach: { visible: false, requiresSubscription: false },
      player: { visible: false, requiresSubscription: false },
      parent: { visible: false, requiresSubscription: false }
    },
    template: null,
    status: 'DRAFT',
    ...article
  })

  useEffect(() => {
    if (article) {
      setArticleData(prev => ({ ...prev, ...article }))
    }
  }, [article])

  const handleInputChange = (field: string, value: any) => {
    setArticleData(prev => ({ ...prev, [field]: value }))
    if (onContentChange) onContentChange()
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setArticleData(prev => ({ ...prev, template }))
      setSelectedTemplate(templateId)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !articleData.tags?.includes(tag)) {
      handleInputChange('tags', [...(articleData.tags || []), tag])
    }
  }

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', (articleData.tags || []).filter(tag => tag !== tagToRemove))
  }

  const getVisibleZones = () => {
    return Object.entries(articleData.zoneSettings || {})
      .filter(([, settings]) => settings?.visible)
      .map(([zone]) => zone)
  }

  const validateForm = (): ParsedValidationError[] => {
    const errors: ParsedValidationError[] = []

    if (!articleData.title?.trim()) {
      errors.push({ field: 'title', message: 'Заглавието е задължително', type: 'required' })
    }

    if (!articleData.content?.trim()) {
      errors.push({ field: 'content', message: 'Съдържанието е задължително', type: 'required' })
    }

    if (!articleData.category) {
      errors.push({ field: 'category', message: 'Категорията е задължителна', type: 'required' })
    }

    return errors
  }

  const handleSave = async () => {
    const errors = validateForm()
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      const finalArticle = {
        ...articleData,
        id: articleData.id || `article-${Date.now()}`,
        slug: articleData.slug || articleData.title?.toLowerCase().replace(/\s+/g, '-') || '',
        readTime: Math.ceil((articleData.content || '').replace(/<[^>]*>/g, '').split(' ').length / 200)
      } as Article

      onSave(finalArticle)
    } catch (error) {
      console.error('Error saving article:', error)
    } finally {
      setIsSubmitting(false)
    }
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
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Запазване...
              </>
            ) : (
              mode === 'create' ? 'Създай статия' : 'Запази промените'
            )}
          </button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <FormErrors 
          errors={validationErrors} 
          showFieldNames={true}
          groupByType={true}
          className="mb-6"
        />
      )}

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
            <article className="prose prose-lg max-w-none">
              <h1 className="text-4xl font-bold text-black mb-4">
                {articleData.title || 'Заглавие на статията'}
              </h1>
              {articleData.excerpt && (
                <p className="text-xl text-black leading-relaxed mb-6">
                  {articleData.excerpt}
                </p>
              )}
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
                  zone={getVisibleZones().join(',')} // Подавай всички видими зони
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
                      value={articleData.category || 'NEWS'}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="NEWS">Новини</option>
                      <option value="TRAINING">Тренировки</option>
                      <option value="TACTICS">Тактика</option>
                      <option value="PSYCHOLOGY">Психология</option>
                      <option value="NUTRITION">Хранене</option>
                      <option value="TECHNIQUE">Техника</option>
                      <option value="FITNESS">Фитнес</option>
                      <option value="INTERVIEWS">Интервюта</option>
                      <option value="ANALYSIS">Анализи</option>
                      <option value="YOUTH">Младежи</option>
                      <option value="CONDITIONING">Кондиция</option>
                      <option value="PERIODIZATION">Периодизация</option>
                      <option value="MANAGEMENT">Мениджмънт</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Статус
                    </label>
                    <select
                      value={articleData.status || 'DRAFT'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="DRAFT">Чернова</option>
                      <option value="PUBLISHED">Публикувана</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={articleData.isPremium || false}
                        onChange={(e) => handleInputChange('isPremium', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-black">Премиум статия</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={articleData.isFeatured || false}
                        onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-black">Препоръчана</span>
                    </label>
                  </div>

                  {articleData.isPremium && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-800 mb-2">Настройки за премиум съдържание</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-yellow-700 mb-1">
                            Дата за безплатен достъп (опционално)
                          </label>
                          <input
                            type="date"
                            value={articleData.premiumSchedule?.releaseFree ?
                              new Date(articleData.premiumSchedule.releaseFree).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : null
                              handleInputChange('premiumSchedule', {
                                ...articleData.premiumSchedule,
                                releaseFree: date,
                                isPermanentPremium: !date
                              })
                            }}
                            className="w-full p-2 border border-yellow-300 rounded text-sm"
                          />
                          <p className="text-xs text-yellow-600 mt-1">
                            Ако не е избрана дата, статията ще остане завинаги премиум
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'zones' && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-black mb-4">Видимост по зони</h3>
                <div className="space-y-4">
                  {['read', 'coach', 'player', 'parent'].map(zone => (
                    <div key={zone} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-black capitalize">{zone} зона</h4>
                        <p className="text-sm text-gray-600">Показване в {zone} зоната</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={articleData.zoneSettings?.[zone as keyof typeof articleData.zoneSettings]?.visible || false}
                            onChange={(e) => {
                              const newZoneSettings = { ...articleData.zoneSettings }
                              newZoneSettings[zone as keyof typeof newZoneSettings] = {
                                ...newZoneSettings[zone as keyof typeof newZoneSettings],
                                visible: e.target.checked
                              }
                              handleInputChange('zoneSettings', newZoneSettings)
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-black">Видима</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'styling' && (
              <div className="bg-white p-6 rounded-lg border space-y-6">
                <h3 className="text-lg font-semibold text-black mb-4">Стилизиране и внешен вид</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Основна снимка
                    </label>
                    <input
                      type="url"
                      value={articleData.featuredImage || ''}
                      onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="URL на основната снимка..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Slug (URL адрес)
                    </label>
                    <input
                      type="text"
                      value={articleData.slug || ''}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="url-slug-za-statistata"
                    />
                  </div>
                </div>

                {articleData.featuredImage && (
                  <div>
                    <h4 className="text-sm font-medium text-black mb-2">Предварителен преглед на снимката</h4>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <img
                        src={articleData.featuredImage}
                        alt="Основна снимка"
                        className="w-full max-w-md h-auto rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-black mb-3">Автоматично генерирани настройки</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Автор:</span>
                        <span className="ml-1">{articleData.author?.name || 'Admin'}</span>
                      </div>
                      <div>
                        <span className="font-medium">Дата на публикуване:</span>
                        <span className="ml-1">{new Date(articleData.publishedAt || new Date()).toLocaleDateString('bg-BG')}</span>
                      </div>
                      <div>
                        <span className="font-medium">Време за четене:</span>
                        <span className="ml-1">~{Math.ceil((articleData.content || '').replace(/<[^>]*>/g, '').split(' ').length / 200)} мин</span>
                      </div>
                      <div>
                        <span className="font-medium">Брой думи:</span>
                        <span className="ml-1">{(articleData.content || '').replace(/<[^>]*>/g, '').split(' ').filter(word => word.length > 0).length}</span>
                      </div>
                    </div>
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
