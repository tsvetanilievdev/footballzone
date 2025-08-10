'use client'

import { useState } from 'react'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  CogIcon,
  PhotoIcon,
  SwatchIcon,
  SquaresPlusIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { Template, TemplateStatistics } from '@/types/templates'
import { mockTemplates as templateData } from '@/data/templates'

interface TemplateManagerProps {
  onCreateTemplate?: () => void
  onEditTemplate?: (template: Template) => void
  onDeleteTemplate?: (templateId: string) => void
}

export default function TemplateManager({ 
  onCreateTemplate, 
  onEditTemplate, 
  onDeleteTemplate 
}: TemplateManagerProps) {
  const [templates] = useState(templateData)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = [
    { value: 'all', label: 'Всички категории' },
    { value: 'universal', label: 'Универсални' },
    { value: 'editorial', label: 'Редакционни' },
    { value: 'technical', label: 'Технически' },
    { value: 'visual', label: 'Визуални' },
    { value: 'interactive', label: 'Интерактивни' },
    { value: 'academic', label: 'Академични' }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && template.isActive) ||
                         (selectedStatus === 'inactive' && !template.isActive)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getCategoryLabel = (category: string) => {
    return categories.find(cat => cat.value === category)?.label || category
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'universal': return 'bg-gray-100 text-gray-800'
      case 'editorial': return 'bg-blue-100 text-blue-800'
      case 'technical': return 'bg-green-100 text-green-800'
      case 'visual': return 'bg-purple-100 text-purple-800'
      case 'interactive': return 'bg-orange-100 text-orange-800'
      case 'academic': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">Управление на темплейти</h1>
          <p className="text-black mt-2">Създавайте и управлявайте темплейти за статии</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={onCreateTemplate}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Нов темплейт
        </Button>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center">
            <SquaresPlusIcon className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-black">Общо темплейти</p>
              <p className="text-2xl font-bold text-black">{templates.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center">
            <CheckCircleIcon className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-black">Активни</p>
              <p className="text-2xl font-bold text-black">
                {templates.filter(t => t.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-black">Общо използвания</p>
              <p className="text-2xl font-bold text-black">
                {templates.reduce((sum, t) => sum + t.stats.usageCount, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center">
            <XCircleIcon className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-black">Неактивни</p>
              <p className="text-2xl font-bold text-black">
                {templates.filter(t => !t.isActive).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-6 border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
            <input
              type="text"
              placeholder="Търсене на темплейти..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Всички статуси</option>
              <option value="active">Активни</option>
              <option value="inactive">Неактивни</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-green-100' : 'hover:bg-gray-100'}`}
              >
                <SquaresPlusIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-green-100' : 'hover:bg-gray-100'}`}
              >
                <FunnelIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div 
              key={template.id} 
              className={`bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow ${
                !template.isActive ? 'opacity-60' : ''
              }`}
            >
              {/* Template Preview */}
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <div 
                  className="w-full h-full flex items-center justify-center text-black text-lg font-medium"
                  style={{ backgroundColor: template.style.colors.background }}
                >
                  <PhotoIcon className="w-12 h-12 text-gray-400" />
                </div>
                {!template.isActive && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-medium">НЕАКТИВЕН</span>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-black text-lg">{template.name}</h3>
                    <p className="text-sm text-black mt-1">{template.description}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => window.open(template.preview.demoUrl, '_blank')}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-green-600 hover:text-green-800"
                      onClick={() => onEditTemplate?.(template)}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="text-purple-600 hover:text-purple-800">
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => onDeleteTemplate?.(template.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Category and Status */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(template.category)}`}>
                    {getCategoryLabel(template.category)}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    template.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {template.isActive ? 'Активен' : 'Неактивен'}
                  </span>
                </div>

                {/* Usage Statistics */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-black">Използвания:</span>
                    <span className="font-medium text-black">{template.stats.usageCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black">Рейтинг:</span>
                    <span className="font-medium text-black">
                      {template.stats.averageRating.toFixed(1)} ⭐
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black">Версия:</span>
                    <span className="font-medium text-black">{template.version}</span>
                  </div>
                </div>

                {/* Zone Restrictions */}
                {template.allowedZones.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-black mb-2">Достъпен в зони:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.allowedZones.map(zone => (
                        <span key={zone} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {zone}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Темплейт
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Използвания
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Рейтинг
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-black">{template.name}</div>
                      <div className="text-sm text-black">{template.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(template.category)}`}>
                      {getCategoryLabel(template.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {template.isActive ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-black">
                    {template.stats.usageCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-black">
                    {template.stats.averageRating.toFixed(1)} ⭐
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => window.open(template.preview.demoUrl, '_blank')}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-800"
                        onClick={() => onEditTemplate?.(template)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-800">
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => onDeleteTemplate?.(template.id)}
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
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <SquaresPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-black">Няма намерени темплейти</h3>
          <p className="mt-1 text-sm text-black">
            Опитайте да промените филтрите или създайте нов темплейт.
          </p>
          <div className="mt-6">
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={onCreateTemplate}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Нов темплейт
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}