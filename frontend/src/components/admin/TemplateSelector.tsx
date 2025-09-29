'use client'

import { useState, useEffect } from 'react'
import { CheckIcon, CogIcon, EyeIcon, VideoCameraIcon, PhotoIcon, DocumentIcon } from '@heroicons/react/24/outline'
// import { ArticleTemplate } from '@/types' // Using any[] for flexibility
import { getTemplatesByCategory, getTemplatesByZone, getActiveTemplates, convertToLegacyTemplate } from '@/data/templates'

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateSelect: (template: string) => void
  category: string
  className?: string
  onTemplateConfig?: (templateId: string) => void
  templatesOverride?: any[]
  zone?: string
}

export default function TemplateSelector({ 
  selectedTemplate, 
  onTemplateSelect,
  category,
  className = '',
  onTemplateConfig,
  templatesOverride,
  zone
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState<string | null>(null)

  useEffect(() => {
    // Зареждане на темплейти: приоритетно подадени отвън; иначе по зона; fallback към категория
    if (templatesOverride && templatesOverride.length > 0) {
      setTemplates(templatesOverride)
      setLoading(false)
      return
    }

    let available: any[] = []

    if (zone) {
      // Ако има множество зони (разделени със запетая)
      const zones = zone.split(',').filter(z => z.trim())
      if (zones.length > 1) {
        // Събираме темплейти от всички зони
        const allTemplates = getActiveTemplates()
        available = allTemplates.filter(template =>
          template.category === 'universal' || zones.some(z => template.allowedZones?.includes(z.trim()))
        )
      } else {
        // Единична зона
        available = getTemplatesByZone(zone)
      }
    } else {
      // Fallback към категория
      available = getTemplatesByCategory(category)
    }

    setTemplates(available)
    setLoading(false)
  }, [category, templatesOverride, zone])

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-32 rounded-lg mb-2"></div>
            <div className="bg-gray-200 h-4 rounded mb-1"></div>
            <div className="bg-gray-200 h-3 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  const getFeatureIcons = (template: any) => {
    const icons = []

    // Handle both old and new template structure
    const hasVideos = template.settings?.allowVideos || template.mediaSettings?.video?.enabled
    const hasImages = template.settings?.allowImages || template.mediaSettings?.gallery?.enabled || template.mediaSettings?.featuredImage?.required
    const hasDownloads = template.settings?.allowDownloads || template.mediaSettings?.documents?.enabled

    if (hasVideos) {
      icons.push(<VideoCameraIcon key="video" className="w-4 h-4" />)
    }
    if (hasImages) {
      icons.push(<PhotoIcon key="photo" className="w-4 h-4" />)
    }
    if (hasDownloads) {
      icons.push(<DocumentIcon key="doc" className="w-4 h-4" />)
    }
    return icons
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'read': return 'Read Zone'
      case 'coach': return 'Coach Zone'
      case 'player': return 'Player Zone'
      case 'parent': return 'Parent Zone'
      case 'universal': return 'Универсален'
      default: return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'read': return 'bg-blue-100 text-blue-800'
      case 'coach': return 'bg-green-100 text-green-800'
      case 'player': return 'bg-purple-100 text-purple-800'
      case 'parent': return 'bg-orange-100 text-orange-800'
      case 'universal': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Избери темплейт за статията
        </h3>
        <p className="text-sm text-gray-600">
          Всеки темплейт има специфични настройки за съдържание и визуализация
        </p>
        {zone && zone.includes(',') && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
            <strong>Показани темплейти за зони:</strong> {zone.split(',').map(z => z.trim()).join(', ')} + универсални
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.length === 0 && (
          <div className="col-span-full p-6 border border-dashed rounded-lg text-center text-gray-500">
            Няма налични темплейти за тази категория/зона.
          </div>
        )}
        {templates.map(template => (
          <div
            key={template.id}
            className={`relative group border-2 rounded-lg transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            {/* Selected indicator */}
            {selectedTemplate === template.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-10">
                <CheckIcon className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Template header */}
            <div className="p-4 cursor-pointer" onClick={() => onTemplateSelect(template.id)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {template.name}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Category badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                  {getCategoryName(template.category)}
                </span>
                <div className="flex items-center space-x-1 text-gray-400">
                  {getFeatureIcons(template)}
                </div>
              </div>

              {/* Template features */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Тип:</span>
                  <span className="capitalize font-medium">
                    {template.category === 'technical' ? 'Техническа' :
                     template.category === 'interactive' ? 'Интерактивна' :
                     template.category === 'editorial' ? 'Редакционна' :
                     template.category === 'visual' ? 'Визуална' : template.category}
                  </span>
                </div>

                {(template.settings?.allowVideos || template.mediaSettings?.video?.enabled) && (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Видео:</span>
                    <span className="font-medium">до {template.settings?.maxVideos || template.mediaSettings?.video?.maxVideos || '∞'}</span>
                  </div>
                )}

                {(template.settings?.allowImages || template.mediaSettings?.gallery?.enabled) && (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Снимки:</span>
                    <span className="font-medium">
                      {template.settings?.imageLayout || 'gallery'} / до {template.settings?.maxImages || template.mediaSettings?.gallery?.maxImages || '∞'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-4 pb-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDetails(showDetails === template.id ? null : template.id)
                }}
                className="flex-1 flex items-center justify-center px-3 py-2 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                <EyeIcon className="w-4 h-4 mr-1" />
                Детайли
              </button>
              
              {onTemplateConfig && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onTemplateConfig(template.id)
                  }}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-xs text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                >
                  <CogIcon className="w-4 h-4 mr-1" />
                  Настройки
                </button>
              )}
            </div>

            {/* Template details expansion */}
            {showDetails === template.id && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <h5 className="font-medium text-gray-900 mb-2">Настройки на темплейта</h5>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Layout:</span>
                    <span className="font-medium">{template.settings?.styling?.layout || template.layout?.structure?.columns + ' колони'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Размер шрифт:</span>
                    <span className="font-medium">{template.settings?.styling?.fontSize || template.style?.typography?.fontSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Версия:</span>
                    <span className="font-medium">{template.version || 'N/A'}</span>
                  </div>
                  {template.settings?.customSections && template.settings.customSections.length > 0 && (
                    <div>
                      <span className="font-medium">Секции:</span>
                      <ul className="mt-1 space-y-1">
                        {template.settings.customSections.map((section: any) => (
                          <li key={section.id} className="flex justify-between">
                            <span>{section.name}</span>
                            <span className={section.required ? 'text-red-600' : 'text-gray-500'}>
                              {section.required ? 'задължителна' : 'опционална'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected template summary */}
      {selectedTemplate && (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3">
            Избран темплейт: {templates.find(t => t.id === selectedTemplate)?.name}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Категория:</span>
              <p className="text-blue-600 mt-1">
                {getCategoryName(templates.find(t => t.id === selectedTemplate)?.category || '')}
              </p>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Тип:</span>
              <p className="text-blue-600 mt-1 capitalize">
                {templates.find(t => t.id === selectedTemplate)?.category}
              </p>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Видео поддръжка:</span>
              <p className="text-blue-600 mt-1">
                {(templates.find(t => t.id === selectedTemplate)?.settings?.allowVideos ||
                  templates.find(t => t.id === selectedTemplate)?.mediaSettings?.video?.enabled) ? 'Да' : 'Не'}
              </p>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Версия:</span>
              <p className="text-blue-600 mt-1">
                {templates.find(t => t.id === selectedTemplate)?.version || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 