'use client'

import { useState, useEffect } from 'react'
import {
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import TemplateSelector from './TemplateSelector'
import RichTextEditor from './RichTextEditor'
import ZoneAssignmentSelector from './ZoneAssignmentSelector'
import PremiumScheduler from './PremiumScheduler'
import { getTemplatePlaceholder, isPlaceholderContent } from '@/utils/templatePlaceholders'

interface Video {
  title: string
  url: string
  platform: 'youtube' | 'vimeo'
  duration?: string
}

interface ArticleData {
  id?: string
  title: string
  slug?: string
  excerpt: string
  content: string
  template: string
  category: string
  subcategory?: string
  tags: string[]
  featuredImage: string
  images: string[]
  videos: Video[]
  isPremium: boolean
  premiumSchedule?: {
    releaseFree: Date
    isPermanentPremium: boolean
  }
  zones: string[]
  status: 'draft' | 'published' | 'archived'
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  series?: {
    name: string
    slug: string
    part?: number
    totalParts?: number
  }
  seo?: {
    title: string
    description: string
    keywords: string[]
  }
  downloads?: {
    title: string
    url: string
    type: 'pdf' | 'doc' | 'excel' | 'image'
    size?: string
  }[]
  readTime?: number
}

interface ArticleEditorProps {
  article?: ArticleData
  onSave: (data: ArticleData) => void
  onCancel: () => void
  mode: 'create' | 'edit'
}

export default function ArticleEditor({ 
  article, 
  onSave, 
  onCancel, 
  mode 
}: ArticleEditorProps) {
  const [formData, setFormData] = useState<ArticleData>({
    title: article?.title || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    template: article?.template || 'classic',
    category: article?.category || 'read',
    subcategory: article?.subcategory || '',
    tags: article?.tags || [],
    featuredImage: article?.featuredImage || '',
    images: article?.images || [],
    videos: article?.videos || [],
    isPremium: article?.isPremium || false,
    zones: article?.zones || ['read'],
    status: article?.status || 'draft',
    author: {
      name: article?.author?.name || '',
      avatar: article?.author?.avatar || '',
      bio: article?.author?.bio || ''
    },
    seo: {
      title: article?.seo?.title || '',
      description: article?.seo?.description || '',
      keywords: article?.seo?.keywords || []
    }
  })

  const [uploading, setUploading] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newKeyword, setNewKeyword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPlaceholderWarning, setShowPlaceholderWarning] = useState(false)

  // Проверка дали съдържанието е все още placeholder
  useEffect(() => {
    if (formData.content && formData.template) {
      const isPlaceholder = isPlaceholderContent(formData.content, formData.template)
      setShowPlaceholderWarning(isPlaceholder)
    }
  }, [formData.content, formData.template])

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleTemplateChange = (templateId: string) => {
    // Проверка дали има съществуващо съдържание
    const hasExistingContent = formData.content && formData.content.trim().length > 0

    if (hasExistingContent && !isPlaceholderContent(formData.content, formData.template)) {
      // Ако има реално съдържание, питаме потребителя
      const confirmChange = window.confirm(
        'Промяната на темплейта ще замени текущото съдържание с примерно такова. Сигурни ли сте?'
      )
      if (!confirmChange) return
    }

    // Зареждаме placeholder съдържание за новия темплейт
    const placeholderContent = getTemplatePlaceholder(templateId)

    setFormData(prev => ({
      ...prev,
      template: templateId,
      content: placeholderContent
    }))
  }

  const loadPlaceholderContent = () => {
    const placeholderContent = getTemplatePlaceholder(formData.template)
    setFormData(prev => ({
      ...prev,
      content: placeholderContent
    }))
  }

  const handleZonesChange = (zones: string[]) => {
    setFormData(prev => ({
      ...prev,
      zones
    }))
  }

  const handlePremiumChange = (isPremium: boolean) => {
    setFormData(prev => ({
      ...prev,
      isPremium
    }))
  }

  const handleScheduleChange = (schedule?: { releaseFree: Date; isPermanentPremium: boolean }) => {
    setFormData(prev => ({
      ...prev,
      premiumSchedule: schedule
    }))
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      // Mock upload for now - replace with actual API call
      const mockUrl = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, mockUrl]
      }))
    } catch (error) {
      console.error('Upload failed:', error)
      setErrors(prev => ({ ...prev, images: 'Грешка при качване на снимка' }))
    }
    setUploading(false)
  }

  const handleFeaturedImageUpload = async (file: File) => {
    setUploading(true)
    try {
      // Mock upload for now - replace with actual API call
      const mockUrl = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        featuredImage: mockUrl
      }))
    } catch (error) {
      console.error('Upload failed:', error)
      setErrors(prev => ({ ...prev, featuredImage: 'Грешка при качване на снимка' }))
    }
    setUploading(false)
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const addVideo = () => {
    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, { title: '', url: '', platform: 'youtube' }]
    }))
  }

  const updateVideo = (index: number, field: keyof Video, value: string) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.map((video, i) => 
        i === index ? { ...video, [field]: value } : video
      )
    }))
  }

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.seo?.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo!,
          keywords: [...(prev.seo?.keywords || []), newKeyword.trim()]
        }
      }))
      setNewKeyword('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo!,
        keywords: prev.seo?.keywords.filter(k => k !== keyword) || []
      }
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Заглавието е задължително'
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Краткото описание е задължително'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Съдържанието е задължително'
    }

    if (!formData.category) {
      newErrors.category = 'Категорията е задължителна'
    }

    if (formData.zones.length === 0) {
      newErrors.zones = 'Трябва да изберете поне една зона'
    }

    if (!formData.featuredImage) {
      newErrors.featuredImage = 'Основната снимка е задължителна'
    }

    if (!formData.author.name.trim()) {
      newErrors.authorName = 'Името на автора е задължително'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave(formData)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Създаване на нова статия' : 'Редактиране на статия'}
          </h2>
          <p className="text-gray-600 mt-1">
            Попълнете всички полета за да създадете статията
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Отказ
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {mode === 'create' ? 'Създай статия' : 'Запази промените'}
          </button>
        </div>
      </div>

      {/* Zone Assignment */}
      <div className="bg-white p-6 rounded-lg border">
        <ZoneAssignmentSelector
          selectedZones={formData.zones}
          onZonesChange={handleZonesChange}
        />
        {errors.zones && <p className="text-red-500 text-sm mt-2">{errors.zones}</p>}
      </div>

      {/* Template Selection */}
      <div className="bg-white p-6 rounded-lg border">
        <TemplateSelector
          selectedTemplate={formData.template}
          onTemplateSelect={handleTemplateChange}
          category={formData.category}
          zone={formData.zones.length > 0 ? formData.zones.join(',') : undefined}
        />
      </div>

      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Основна информация</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заглавие *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full p-3 border rounded-lg ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Въведете заглавие на статията"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Категория *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full p-3 border rounded-lg ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
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
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Кратко описание *
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => handleInputChange('excerpt', e.target.value)}
            rows={3}
            className={`w-full p-3 border rounded-lg ${
              errors.excerpt ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Кратко описание на статията (ще се показва в списъка)"
          />
          {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Подкатегория
          </label>
          <input
            type="text"
            value={formData.subcategory}
            onChange={(e) => handleInputChange('subcategory', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Опционална подкатегория"
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Съдържание</h3>

          {showPlaceholderWarning && (
            <button
              type="button"
              onClick={loadPlaceholderContent}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <SparklesIcon className="w-4 h-4" />
              Зареди примерно съдържание
            </button>
          )}
        </div>

        {showPlaceholderWarning && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <SparklesIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>Примерно съдържание:</strong> Това е template съдържание. Редактирайте го с реалната информация преди публикуване.
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Съдържание на статията *
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(value) => handleInputChange('content', value)}
            placeholder="Въведете съдържанието на статията..."
            className={`${errors.content ? 'border-red-500' : ''}`}
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
          <div className="mt-2 text-sm text-gray-500">
            <p>💡 Съвет: Използвайте toolbar-а за форматиране на текста</p>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Медия файлове</h3>
        
        {/* Featured Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Основна снимка *
          </label>
          <div className="flex items-center space-x-4">
            {formData.featuredImage ? (
              <div className="relative">
                <img 
                  src={formData.featuredImage} 
                  alt="Featured" 
                  className="w-32 h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleInputChange('featuredImage', '')}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <PhotoIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFeaturedImageUpload(file)
                }}
                className="hidden"
                id="featured-image"
              />
              <label
                htmlFor="featured-image"
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {uploading ? 'Качване...' : 'Избери снимка'}
              </label>
            </div>
          </div>
          {errors.featuredImage && <p className="text-red-500 text-sm mt-1">{errors.featuredImage}</p>}
        </div>

        {/* Additional Images */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Допълнителни снимки
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <img 
                  src={image} 
                  alt={`Image ${index + 1}`} 
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              files.forEach(handleImageUpload)
            }}
            className="hidden"
            id="additional-images"
          />
          <label
            htmlFor="additional-images"
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Добави снимки
          </label>
        </div>

        {/* Videos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Видео файлове
          </label>
          {formData.videos.map((video, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4 p-4 border rounded-lg">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Заглавие на видеото"
                  value={video.title}
                  onChange={(e) => updateVideo(index, 'title', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="YouTube или Vimeo URL"
                  value={video.url}
                  onChange={(e) => updateVideo(index, 'url', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <select
                  value={video.platform}
                  onChange={(e) => updateVideo(index, 'platform', e.target.value as 'youtube' | 'vimeo')}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => removeVideo(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addVideo}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <VideoCameraIcon className="w-4 h-4 mr-2" />
            Добави видео
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Тагове</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Въведете таг"
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Добави
          </button>
        </div>
      </div>

      {/* Author Information */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация за автора</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Име на автора *
            </label>
            <input
              type="text"
              value={formData.author.name}
              onChange={(e) => handleInputChange('author', { ...formData.author, name: e.target.value })}
              className={`w-full p-3 border rounded-lg ${
                errors.authorName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Въведете име на автора"
            />
            {errors.authorName && <p className="text-red-500 text-sm mt-1">{errors.authorName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Аватар URL
            </label>
            <input
              type="text"
              value={formData.author.avatar}
              onChange={(e) => handleInputChange('author', { ...formData.author, avatar: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="URL на аватара"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Кратко био
          </label>
          <textarea
            value={formData.author.bio}
            onChange={(e) => handleInputChange('author', { ...formData.author, bio: e.target.value })}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Кратко описание на автора"
          />
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO настройки</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO заглавие
            </label>
            <input
              type="text"
              value={formData.seo?.title}
              onChange={(e) => handleInputChange('seo', { ...formData.seo, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="SEO оптимизирано заглавие"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO описание
            </label>
            <textarea
              value={formData.seo?.description}
              onChange={(e) => handleInputChange('seo', { ...formData.seo, description: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="SEO описание (до 160 символа)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO ключови думи
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.seo?.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                placeholder="Въведете ключова дума"
                className="flex-1 p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Добави
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Настройки</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Премиум съдържание</label>
              <p className="text-sm text-gray-500">Достъпно само за абонирани потребители</p>
            </div>
            <button
              type="button"
              onClick={() => handleInputChange('isPremium', !formData.isPremium)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isPremium ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isPremium ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Статус на публикацията
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="draft">Чернова</option>
              <option value="published">Публикувана</option>
              <option value="archived">Архивирана</option>
            </select>
          </div>
        </div>
      </div>

      {/* Premium Settings */}
      <div className="bg-white p-6 rounded-lg border">
        <PremiumScheduler
          isPremium={formData.isPremium}
          premiumSchedule={formData.premiumSchedule}
          onPremiumChange={handlePremiumChange}
          onScheduleChange={handleScheduleChange}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="text-sm text-gray-500">
          <p>Автоматично генериран slug: <code className="bg-gray-100 px-2 py-1 rounded">{generateSlug(formData.title)}</code></p>
        </div>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Отказ
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('status', 'draft')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Запази като чернова
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {mode === 'create' ? 'Създай статия' : 'Запази промените'}
          </button>
        </div>
      </div>
    </form>
  )
} 