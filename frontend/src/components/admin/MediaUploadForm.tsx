'use client'

import { useState, useRef } from 'react'
import {
  CloudArrowUpIcon,
  PhotoIcon,
  DocumentIcon,
  VideoCameraIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useMediaManagement } from '@/hooks/api/useAdmin'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface MediaUploadFormProps {
  onUploadComplete?: (uploadedFiles: any[]) => void
  onCancel?: () => void
  acceptedTypes?: string[]
  maxFiles?: number
  maxFileSize?: number // in MB
  folder?: string
}

export default function MediaUploadForm({
  onUploadComplete,
  onCancel,
  acceptedTypes = ['image/*', 'video/*', 'application/pdf'],
  maxFiles = 10,
  maxFileSize = 50,
  folder = 'general'
}: MediaUploadFormProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadResults, setUploadResults] = useState<Record<string, any>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { uploadMedia } = useMediaManagement()

  // File validation
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `Файлът е твърде голям. Максимален размер: ${maxFileSize}MB`
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', '/'))
      }
      return file.type === type
    })

    if (!isValidType) {
      return 'Неподдържан тип файл'
    }

    return null
  }

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles: File[] = []
    const errors: string[] = []

    Array.from(files).forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else if (selectedFiles.length + newFiles.length < maxFiles) {
        newFiles.push(file)
      } else {
        errors.push(`Максимален брой файлове: ${maxFiles}`)
      }
    })

    if (errors.length > 0) {
      alert(errors.join('\n'))
    }

    if (newFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...newFiles])
    }
  }

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFileSelect(e.dataTransfer.files)
  }

  // Remove file from selection
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Get file icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <PhotoIcon className="w-6 h-6 text-blue-500" />
    } else if (file.type.startsWith('video/')) {
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

  // Upload files
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    const results: any[] = []

    for (const file of selectedFiles) {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))
        
        const result = await uploadMedia.mutateAsync({ file, folder })
        
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
        setUploadResults(prev => ({ ...prev, [file.name]: { success: true, data: result } }))
        
        results.push(result)
      } catch (error) {
        console.error('Upload failed:', error)
        setUploadResults(prev => ({ 
          ...prev, 
          [file.name]: { success: false, error: error.message || 'Upload failed' }
        }))
      }
    }

    setUploading(false)
    
    if (onUploadComplete) {
      onUploadComplete(results)
    }
  }

  // Reset form
  const handleReset = () => {
    setSelectedFiles([])
    setUploadProgress({})
    setUploadResults({})
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-green-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">
            Качете файлове
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Плъзнете и пуснете файлове тук или кликнете за избор
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Максимален размер: {maxFileSize}MB | Максимални файлове: {maxFiles}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Поддържани формати: PNG, JPG, GIF, MP4, PDF
          </p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">
            Избрани файлове ({selectedFiles.length})
          </h4>
          
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Upload Progress */}
                  {uploading && uploadProgress[file.name] !== undefined && (
                    <div className="flex items-center space-x-2">
                      {uploadProgress[file.name] === 100 ? (
                        uploadResults[file.name]?.success ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                        )
                      ) : (
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress[file.name]}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Remove Button */}
                  {!uploading && (
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Results */}
      {Object.keys(uploadResults).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Резултати</h4>
          {Object.entries(uploadResults).map(([fileName, result]) => (
            <div
              key={fileName}
              className={`p-3 rounded-lg text-sm ${
                result.success
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <div className="flex items-center">
                {result.success ? (
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                ) : (
                  <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                )}
                <span className="font-medium">{fileName}</span>
              </div>
              {!result.success && result.error && (
                <p className="mt-1 text-xs">{result.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleReset}
          disabled={uploading || selectedFiles.length === 0}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          Изчисти всички
        </button>

        <div className="flex items-center space-x-3">
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={uploading}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Отказ
            </button>
          )}
          
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="px-6 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            {uploading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Качване...
              </>
            ) : (
              'Качи файлове'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}