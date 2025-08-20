'use client'

import { useState } from 'react'
import {
  PhotoIcon,
  VideoCameraIcon,
  DocumentIcon,
  TrashIcon,
  PencilIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  CalendarIcon,
  TagIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import { useMediaManagement } from '@/hooks/api/useAdmin'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDateShortBG } from '@/utils/dateUtils'

interface MediaGalleryProps {
  folder?: string
  selectable?: boolean
  onSelect?: (media: any) => void
  selectedMedia?: any[]
  maxSelection?: number
}

export default function MediaGallery({
  folder,
  selectable = false,
  onSelect,
  selectedMedia = [],
  maxSelection
}: MediaGalleryProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFolder, setSelectedFolder] = useState(folder || '')
  const [selectedType, setSelectedType] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Media management hooks
  const { deleteMedia, updateMedia } = useMediaManagement()

  // Mock data for demonstration - replace with real API call
  const mediaData = {
    data: {
      data: [
        {
          id: '1',
          filename: 'tactical-formation.jpg',
          originalName: 'Tactical Formation 4-3-3.jpg',
          mimeType: 'image/jpeg',
          size: 2048576,
          folder: 'tactics',
          url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=150&fit=crop',
          createdAt: '2024-01-15T10:30:00Z',
          tags: ['tactics', 'formation', '4-3-3']
        },
        {
          id: '2',
          filename: 'training-drill.mp4',
          originalName: 'Training Drill - Passing.mp4',
          mimeType: 'video/mp4',
          size: 15728640,
          folder: 'training',
          url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=200&h=150&fit=crop',
          createdAt: '2024-01-14T15:45:00Z',
          tags: ['training', 'passing', 'drill']
        },
        {
          id: '3',
          filename: 'nutrition-guide.pdf',
          originalName: 'Football Nutrition Guide.pdf',
          mimeType: 'application/pdf',
          size: 1024000,
          folder: 'guides',
          url: '#',
          thumbnailUrl: null,
          createdAt: '2024-01-13T09:15:00Z',
          tags: ['nutrition', 'guide', 'health']
        }
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        total: 3,
        limit: 20
      }
    }
  }

  const isLoading = false
  const error = null

  // Filter media based on search and filters
  const filteredMedia = mediaData.data.data.filter(item => {
    const matchesSearch = !searchTerm || 
      item.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFolder = !selectedFolder || item.folder === selectedFolder
    const matchesType = !selectedType || item.mimeType.startsWith(selectedType)
    
    return matchesSearch && matchesFolder && matchesType
  })

  // Get file icon based on mime type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <PhotoIcon className="w-6 h-6 text-blue-500" />
    } else if (mimeType.startsWith('video/')) {
      return <VideoCameraIcon className="w-6 h-6 text-purple-500" />
    } else {
      return <DocumentIcon className="w-6 h-6 text-gray-500" />
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Handle media selection
  const handleSelect = (media: any) => {
    if (!selectable || !onSelect) return
    
    const isSelected = selectedMedia.some(item => item.id === media.id)
    
    if (isSelected) {
      const newSelection = selectedMedia.filter(item => item.id !== media.id)
      onSelect(newSelection.length === 1 ? newSelection[0] : newSelection)
    } else {
      if (maxSelection && selectedMedia.length >= maxSelection) {
        return // Max selection reached
      }
      const newSelection = [...selectedMedia, media]
      onSelect(newSelection.length === 1 ? newSelection[0] : newSelection)
    }
  }

  // Handle delete
  const handleDelete = async (mediaId: string) => {
    if (confirm('Сигурни ли сте, че искате да изтриете този файл?')) {
      try {
        await deleteMedia.mutateAsync(mediaId)
      } catch (error) {
        console.error('Failed to delete media:', error)
      }
    }
  }

  // Copy URL to clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    // Show toast notification
  }

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

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Търси по име или тагове..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Filters and View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-1 rounded-lg border text-sm ${
                showFilters
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
              Филтри
            </button>

            {/* Folder Filter */}
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="">Всички папки</option>
              <option value="tactics">Тактика</option>
              <option value="training">Тренировки</option>
              <option value="guides">Ръководства</option>
              <option value="general">Общи</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="">Всички типове</option>
              <option value="image">Изображения</option>
              <option value="video">Видеа</option>
              <option value="application">Документи</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list'
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {filteredMedia.length} файл{filteredMedia.length !== 1 ? 'а' : ''} намерен{filteredMedia.length !== 1 ? 'и' : ''}
        </span>
        {selectable && selectedMedia.length > 0 && (
          <span>
            Избрани: {selectedMedia.length}
            {maxSelection && ` / ${maxSelection}`}
          </span>
        )}
      </div>

      {/* Media Grid/List */}
      {filteredMedia.length === 0 ? (
        <EmptyState
          icon={PhotoIcon}
          title="Няма файлове"
          description="Не са намерени файлове отговарящи на критериите за търсене."
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.map((media) => (
            <MediaGridCard
              key={media.id}
              media={media}
              selectable={selectable}
              selected={selectedMedia.some(item => item.id === media.id)}
              onSelect={() => handleSelect(media)}
              onDelete={() => handleDelete(media.id)}
              onCopyUrl={() => copyToClipboard(media.url)}
              getFileIcon={getFileIcon}
              formatFileSize={formatFileSize}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMedia.map((media) => (
            <MediaListCard
              key={media.id}
              media={media}
              selectable={selectable}
              selected={selectedMedia.some(item => item.id === media.id)}
              onSelect={() => handleSelect(media)}
              onDelete={() => handleDelete(media.id)}
              onCopyUrl={() => copyToClipboard(media.url)}
              getFileIcon={getFileIcon}
              formatFileSize={formatFileSize}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Grid Card Component
function MediaGridCard({ media, selectable, selected, onSelect, onDelete, onCopyUrl, getFileIcon, formatFileSize }: any) {
  return (
    <div
      className={`group relative bg-white border rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer ${
        selected ? 'ring-2 ring-green-500 border-green-500' : 'border-gray-200'
      }`}
      onClick={selectable ? onSelect : undefined}
    >
      {/* Media Preview */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {media.thumbnailUrl ? (
          <img
            src={media.thumbnailUrl}
            alt={media.originalName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            {getFileIcon(media.mimeType)}
            <span className="mt-2 text-xs">{media.mimeType.split('/')[1].toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Selection Indicator */}
      {selectable && (
        <div className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 ${
          selected 
            ? 'bg-green-500 border-green-500' 
            : 'bg-white border-gray-300 group-hover:border-green-400'
        }`}>
          {selected && (
            <svg className="w-3 h-3 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      )}

      {/* Actions */}
      {!selectable && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onCopyUrl()
              }}
              className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70"
              title="Копирай URL"
            >
              <ClipboardDocumentIcon className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70"
              title="Изтрий"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-3">
        <h4 className="text-sm font-medium text-gray-900 truncate" title={media.originalName}>
          {media.originalName}
        </h4>
        <div className="mt-1 text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>{formatFileSize(media.size)}</span>
            <span className="flex items-center">
              <FolderIcon className="w-3 h-3 mr-1" />
              {media.folder}
            </span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="w-3 h-3 mr-1" />
            {formatDateShortBG(new Date(media.createdAt))}
          </div>
        </div>
        
        {/* Tags */}
        {media.tags && media.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {media.tags.slice(0, 2).map((tag: string) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
            {media.tags.length > 2 && (
              <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                +{media.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// List Card Component
function MediaListCard({ media, selectable, selected, onSelect, onDelete, onCopyUrl, getFileIcon, formatFileSize }: any) {
  return (
    <div
      className={`flex items-center p-4 bg-white border rounded-lg hover:shadow-sm transition-all cursor-pointer ${
        selected ? 'ring-2 ring-green-500 border-green-500' : 'border-gray-200'
      }`}
      onClick={selectable ? onSelect : undefined}
    >
      {/* Selection Checkbox */}
      {selectable && (
        <div className={`mr-4 w-5 h-5 rounded border-2 flex items-center justify-center ${
          selected 
            ? 'bg-green-500 border-green-500' 
            : 'border-gray-300 hover:border-green-400'
        }`}>
          {selected && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      )}

      {/* Thumbnail */}
      <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
        {media.thumbnailUrl ? (
          <img
            src={media.thumbnailUrl}
            alt={media.originalName}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          getFileIcon(media.mimeType)
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {media.originalName}
        </h4>
        <div className="mt-1 text-xs text-gray-500 flex items-center space-x-4">
          <span>{formatFileSize(media.size)}</span>
          <span className="flex items-center">
            <FolderIcon className="w-3 h-3 mr-1" />
            {media.folder}
          </span>
          <span className="flex items-center">
            <CalendarIcon className="w-3 h-3 mr-1" />
            {formatDateShortBG(new Date(media.createdAt))}
          </span>
        </div>
      </div>

      {/* Tags */}
      {media.tags && media.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mr-4">
          {media.tags.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      {!selectable && (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onCopyUrl()
            }}
            className="p-2 text-gray-400 hover:text-blue-600"
            title="Копирай URL"
          >
            <ClipboardDocumentIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-2 text-gray-400 hover:text-red-600"
            title="Изтрий"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}