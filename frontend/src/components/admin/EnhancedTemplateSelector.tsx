'use client'

import { useState } from 'react'
import { 
  CheckIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  EyeIcon,
  SwatchIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { CheckIcon as CheckSolidIcon } from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/Button'

interface Template {
  id: string
  name: string
  description: string
  category: string
  settings: {
    textLength: string
    allowVideos: boolean
    maxVideos: number
    allowImages: boolean
    maxImages: number
    imageLayout: string
    allowDownloads: boolean
    styling: {
      layout: string
      fontSize: string
      spacing: string
      colors: {
        primary: string
        secondary: string
        text: string
      }
    }
  }
}

interface EnhancedTemplateSelectorProps {
  templates: Template[]
  selectedTemplateId?: string
  onTemplateSelect: (template: Template) => void
  onClose?: () => void
}

export default function EnhancedTemplateSelector({
  templates,
  selectedTemplateId,
  onTemplateSelect,
  onClose
}: EnhancedTemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)

  const categories = [
    { id: 'all', name: 'Всички', color: 'gray' },
    { id: 'technical', name: 'Технически', color: 'green' },
    { id: 'interactive', name: 'Интерактивни', color: 'blue' },
    { id: 'editorial', name: 'Редакционни', color: 'purple' },
    { id: 'visual', name: 'Визуални', color: 'pink' },
    { id: 'universal', name: 'Универсални', color: 'indigo' }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category)
    switch (cat?.color) {
      case 'green': return 'bg-green-100 text-green-800 border-green-200'
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'purple': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'pink': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'indigo': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'two-column': return '⚡'
      case 'full-width': return '🎨'
      default: return '📄'
    }
  }

  const getFeatureIcons = (template: Template) => {
    const features = []
    if (template.settings.allowImages) features.push(<PhotoIcon key="images" className="w-4 h-4 text-green-600" />)
    if (template.settings.allowVideos) features.push(<VideoCameraIcon key="videos" className="w-4 h-4 text-blue-600" />)
    if (template.settings.allowDownloads) features.push(<DocumentTextIcon key="downloads" className="w-4 h-4 text-purple-600" />)
    return features
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-black">Изберете темплейт</h2>
              <p className="text-black mt-1">Изберете темплейт, който най-добре подходи на вашето съдържание</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
              <input
                type="text"
                placeholder="Търсене на темплейти..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 text-sm rounded-full border transition-all ${
                    selectedCategory === category.id
                      ? getCategoryColor(category.id)
                      : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Templates Grid/List */}
          <div className="flex-1 overflow-y-auto p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => {
                  const isSelected = selectedTemplateId === template.id
                  
                  return (
                    <div
                      key={template.id}
                      className={`relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-lg ${
                        isSelected 
                          ? 'border-green-500 shadow-lg ring-2 ring-green-200' 
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => onTemplateSelect(template)}
                    >
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckSolidIcon className="w-4 h-4 text-white" />
                        </div>
                      )}

                      {/* Template Preview */}
                      <div className="mb-4 h-32 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden"
                           style={{ backgroundColor: `${template.settings.styling.colors.primary}10` }}>
                        <div className="text-4xl">
                          {getLayoutIcon(template.settings.styling.layout)}
                        </div>
                        {/* Color accent */}
                        <div className="absolute bottom-0 left-0 right-0 h-2"
                             style={{ backgroundColor: template.settings.styling.colors.primary }}></div>
                      </div>

                      {/* Template Info */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-black text-lg">{template.name}</h3>
                          <p className="text-sm text-black mt-1 line-clamp-2">{template.description}</p>
                        </div>

                        {/* Category Badge */}
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(template.category)}`}>
                            {categories.find(c => c.id === template.category)?.name || template.category}
                          </span>
                        </div>

                        {/* Features */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getFeatureIcons(template)}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setPreviewTemplate(template)
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Преглед"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                // Open customization modal
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Персонализиране"
                            >
                              <Cog6ToothIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Technical specs */}
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                          <span>Max. {template.settings.maxImages} снимки</span>
                          <span>Max. {template.settings.maxVideos} видео</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredTemplates.map((template) => {
                  const isSelected = selectedTemplateId === template.id
                  
                  return (
                    <div
                      key={template.id}
                      className={`flex items-center p-4 bg-white rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                        isSelected 
                          ? 'border-green-500 shadow-lg' 
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => onTemplateSelect(template)}
                    >
                      {/* Preview */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4"
                           style={{ backgroundColor: `${template.settings.styling.colors.primary}20` }}>
                        <div className="text-2xl">
                          {getLayoutIcon(template.settings.styling.layout)}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-black">{template.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(template.category)}`}>
                            {categories.find(c => c.id === template.category)?.name || template.category}
                          </span>
                        </div>
                        <p className="text-sm text-black mb-2">{template.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Снимки: {template.settings.maxImages}</span>
                          <span>Видео: {template.settings.maxVideos}</span>
                          <span>Layout: {template.settings.styling.layout}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex items-center gap-2 mr-4">
                        {getFeatureIcons(template)}
                      </div>

                      {/* Selection */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckSolidIcon className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-black">Няма намерени темплейти</h3>
                <p className="mt-1 text-sm text-black">
                  Опитайте да промените търсенето или филтрите.
                </p>
              </div>
            )}
          </div>

          {/* Preview Panel (if template is being previewed) */}
          {previewTemplate && (
            <div className="w-80 border-l bg-gray-50 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-black">Преглед</h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>

              {/* Template Preview */}
              <div className="bg-white rounded-lg p-4 mb-4 border"
                   style={{ backgroundColor: previewTemplate.settings.styling.colors.background }}>
                <h4 className="font-bold mb-2" 
                    style={{ color: previewTemplate.settings.styling.colors.primary }}>
                  Примерно заглавие
                </h4>
                <p className="text-sm mb-3"
                   style={{ color: previewTemplate.settings.styling.colors.text }}>
                  Това е примерен текст, който показва как ще изглежда съдържанието ви с този темплейт.
                </p>
                {previewTemplate.settings.allowImages && (
                  <div className="w-full h-20 bg-gray-200 rounded mb-3"></div>
                )}
                {previewTemplate.settings.allowVideos && (
                  <div className="w-full h-16 bg-gray-300 rounded flex items-center justify-center">
                    <VideoCameraIcon className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Template Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-black mb-2">Възможности</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black">Снимки:</span>
                      <span className="text-black">{previewTemplate.settings.maxImages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Видео:</span>
                      <span className="text-black">{previewTemplate.settings.maxVideos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Сваляния:</span>
                      <span className="text-black">{previewTemplate.settings.allowDownloads ? 'Да' : 'Не'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-black mb-2">Стилове</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black">Layout:</span>
                      <span className="text-black">{previewTemplate.settings.styling.layout}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Размер шрифт:</span>
                      <span className="text-black">{previewTemplate.settings.styling.fontSize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-black">Цветове:</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded" 
                             style={{ backgroundColor: previewTemplate.settings.styling.colors.primary }}></div>
                        <div className="w-4 h-4 rounded" 
                             style={{ backgroundColor: previewTemplate.settings.styling.colors.secondary }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full mt-6 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  onTemplateSelect(previewTemplate)
                  setPreviewTemplate(null)
                }}
              >
                Изберете този темплейт
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-black">
            Намерени {filteredTemplates.length} от {templates.length} темплейта
          </div>
          <div className="flex items-center gap-3">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${
                  viewMode === 'grid' 
                    ? 'bg-green-100 text-green-700' 
                    : 'hover:bg-gray-100 text-black'
                }`}
              >
                Мрежа
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm border-l border-gray-300 ${
                  viewMode === 'list' 
                    ? 'bg-green-100 text-green-700' 
                    : 'hover:bg-gray-100 text-black'
                }`}
              >
                Списък
              </button>
            </div>
            <Button variant="outline" onClick={onClose}>
              Отказ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}