'use client'

import { useState, useRef } from 'react'
import { 
  PhotoIcon, 
  VideoCameraIcon,
  DocumentIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  LinkIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { MediaFile } from '@/types'

// Mock media data
const mockMediaFiles: MediaFile[] = [
  {
    id: '1',
    filename: 'antonio-conte-tactical-board.jpg',
    originalName: 'Conte Tactical Board.jpg',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
    type: 'image',
    size: 245760, // 240KB
    uploadedAt: new Date('2024-01-20T14:30:00'),
    uploadedBy: 'admin',
    tags: ['тактика', 'конте', 'треньорство'],
    usageCount: 3,
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=150&fit=crop'
  },
  {
    id: '2',
    filename: 'youth-training-drills.mp4',
    originalName: 'Youth Training Drills.mp4',
    url: '/media/videos/youth-training-drills.mp4',
    type: 'video',
    size: 15728640, // 15MB
    uploadedAt: new Date('2024-01-19T10:15:00'),
    uploadedBy: 'coach_petrov',
    tags: ['тренировки', 'младежи', 'упражнения'],
    usageCount: 7,
    thumbnail: '/media/thumbnails/youth-training-drills.jpg'
  },
  {
    id: '3',
    filename: 'nutrition-guide-u15.pdf',
    originalName: 'Nutrition Guide for U15 Players.pdf',
    url: '/media/documents/nutrition-guide-u15.pdf',
    type: 'pdf',
    size: 524288, // 512KB
    uploadedAt: new Date('2024-01-18T16:45:00'),
    uploadedBy: 'dr_ivanova',
    tags: ['хранене', 'младежи', 'ръководство'],
    usageCount: 12,
  },
  {
    id: '4',
    filename: 'player-technique-session.jpg',
    originalName: 'Player Technique Session.jpg',
    url: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&h=600&fit=crop',
    type: 'image',
    size: 189440, // 185KB
    uploadedAt: new Date('2024-01-17T09:20:00'),
    uploadedBy: 'admin',
    tags: ['техника', 'играчи', 'тренировка'],
    usageCount: 2,
    thumbnail: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=200&h=150&fit=crop'
  },
  {
    id: '5',
    filename: 'match-analysis-template.excel',
    originalName: 'Match Analysis Template.xlsx',
    url: '/media/documents/match-analysis-template.xlsx',
    type: 'excel',
    size: 94208, // 92KB
    uploadedAt: new Date('2024-01-16T13:10:00'),
    uploadedBy: 'analyst_georgi',
    tags: ['анализ', 'мач', 'темплейт'],
    usageCount: 8,
  }
]

interface EnhancedMediaManagerProps {
  onSelectFile?: (file: MediaFile) => void
  selectionMode?: boolean
  allowedTypes?: ('image' | 'video' | 'pdf' | 'doc' | 'excel')[]
  className?: string
}

export default function EnhancedMediaManager({ 
  onSelectFile, 
  selectionMode = false,
  allowedTypes = ['image', 'video', 'pdf', 'doc', 'excel'],
  className = '' 
}: EnhancedMediaManagerProps) {
  const [files, setFiles] = useState<MediaFile[]>(mockMediaFiles)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size' | 'usage'>('date')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  // const [showUploadModal, setShowUploadModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter files
  const filteredFiles = files.filter(file => {
    const matchesSearch = searchTerm === '' || 
      file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = selectedType === 'all' || file.type === selectedType
    const isAllowedType = allowedTypes.includes(file.type)
    
    return matchesSearch && matchesType && isAllowedType
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.originalName.localeCompare(b.originalName)
      case 'size':
        return b.size - a.size
      case 'usage':
        return b.usageCount - a.usageCount
      case 'date':
      default:
        return b.uploadedAt.getTime() - a.uploadedAt.getTime()
    }
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <PhotoIcon className="w-8 h-8 text-green-600" />
      case 'video':
        return <VideoCameraIcon className="w-8 h-8 text-blue-600" />
      case 'pdf':
      case 'doc':
      case 'excel':
        return <DocumentIcon className="w-8 h-8 text-red-600" />
      default:
        return <DocumentIcon className="w-8 h-8 text-gray-600" />
    }
  }

  const handleFileSelect = (file: MediaFile) => {
    if (selectionMode) {
      onSelectFile?.(file)
    } else {
      // Regular view/edit mode
      console.log('View file:', file)
    }
  }

  const handleMultiSelect = (fileId: string) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId))
    } else {
      setSelectedFiles([...selectedFiles, fileId])
    }
  }

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files
    if (uploadedFiles) {
      // Handle file upload logic here
      console.log('Uploading files:', uploadedFiles)
      // setShowUploadModal(false)
    }
  }

  const handleDeleteSelected = () => {
    setFiles(files.filter(file => !selectedFiles.includes(file.id)))
    setSelectedFiles([])
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  const totalUsage = files.reduce((sum, file) => sum + file.usageCount, 0)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Медия библиотека</h2>
          <p className="text-gray-600 mt-1">Управление на снимки, видеа и документи</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {selectedFiles.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Изтрий ({selectedFiles.length})
            </button>
          )}
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Качи файлове
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.xlsx,.xls"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Търси файлове и тагове..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">Всички типове</option>
            <option value="image">Снимки</option>
            <option value="video">Видеа</option>
            <option value="pdf">PDF</option>
            <option value="doc">Документи</option>
            <option value="excel">Excel</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size' | 'usage')}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="date">По дата</option>
            <option value="name">По име</option>
            <option value="size">По размер</option>
            <option value="usage">По употреба</option>
          </select>
          
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <PhotoIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <FolderIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{files.length}</div>
            <div className="text-sm text-gray-600">Общо файлове</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatFileSize(totalSize)}</div>
            <div className="text-sm text-gray-600">Общо размер</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalUsage}</div>
            <div className="text-sm text-gray-600">Общо употреби</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{filteredFiles.length}</div>
            <div className="text-sm text-gray-600">Показани</div>
          </div>
        </div>
      </div>

      {/* Files Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => handleFileSelect(file)}
              className={`group relative bg-white rounded-lg border p-4 hover:shadow-md transition-all cursor-pointer ${
                selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              } ${selectionMode ? 'hover:bg-blue-50' : ''}`}
            >
              {/* Selection checkbox */}
              {!selectionMode && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleMultiSelect(file.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>
              )}
              
              {/* File preview */}
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {file.thumbnail ? (
                  <img 
                    src={file.thumbnail} 
                    alt={file.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getFileIcon(file.type)
                )}
              </div>
              
              {/* File info */}
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                  {file.originalName}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatFileSize(file.size)}</span>
                  <span>{file.usageCount} употреби</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {file.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-1 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {file.tags.length > 2 && (
                    <span className="px-1 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                      +{file.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(file.url, '_blank')
                  }}
                  className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100"
                  title="Виж"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const link = document.createElement('a')
                    link.href = file.url
                    link.download = file.originalName
                    link.click()
                  }}
                  className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100"
                  title="Изтегли"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigator.clipboard.writeText(file.url)
                  }}
                  className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100"
                  title="Копирай URL"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex items-center text-sm font-medium text-gray-600">
              <div className="w-8"></div>
              <div className="flex-1 px-4">Файл</div>
              <div className="w-24 text-center">Тип</div>
              <div className="w-24 text-center">Размер</div>
              <div className="w-24 text-center">Употреби</div>
              <div className="w-32 text-center">Качен на</div>
              <div className="w-32 text-center">Действия</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center p-4 hover:bg-gray-50 ${
                  selectedFiles.includes(file.id) ? 'bg-blue-50' : ''
                }`}
              >
                <div className="w-8">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleMultiSelect(file.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex-1 px-4 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                    {file.thumbnail ? (
                      <img 
                        src={file.thumbnail} 
                        alt={file.originalName}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      getFileIcon(file.type)
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{file.originalName}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      {file.tags.map(tag => (
                        <span key={tag} className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="w-24 text-center">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full uppercase">
                    {file.type}
                  </span>
                </div>
                
                <div className="w-24 text-center text-sm text-gray-600">
                  {formatFileSize(file.size)}
                </div>
                
                <div className="w-24 text-center text-sm text-gray-600">
                  {file.usageCount}
                </div>
                
                <div className="w-32 text-center text-sm text-gray-600">
                  {file.uploadedAt.toLocaleDateString('bg-BG')}
                </div>
                
                <div className="w-32 flex items-center justify-center space-x-2">
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Виж"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = file.url
                      link.download = file.originalName
                      link.click()
                    }}
                    className="p-1 text-green-600 hover:text-green-800"
                    title="Изтегли"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => navigator.clipboard.writeText(file.url)}
                    className="p-1 text-gray-600 hover:text-gray-800"
                    title="Копирай URL"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Няма намерени файлове</h3>
          <p className="text-gray-600">Опитайте с различни филтри или качете нови файлове</p>
        </div>
      )}
    </div>
  )
}