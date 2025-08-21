'use client'

import React, { useState, useRef } from 'react'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  className?: string
  placeholder?: string
  accept?: string
  maxSizeMB?: number
}

export default function ImageUpload({
  value,
  onChange,
  className = '',
  placeholder = 'Избери снимка или въведи URL',
  accept = 'image/*',
  maxSizeMB = 5
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [urlInput, setUrlInput] = useState(value || '')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Файлът е твърде голям. Максимален размер: ${maxSizeMB}MB`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Моля изберете изображение')
      return
    }

    setIsUploading(true)

    try {
      // For now, create a local URL (in production you'd upload to your server/cloud)
      const localUrl = URL.createObjectURL(file)
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onChange(localUrl)
      setUrlInput(localUrl)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Грешка при качване на снимката')
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setShowUrlInput(false)
    }
  }

  const handleRemove = () => {
    onChange('')
    setUrlInput('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {value ? (
        <div className="relative">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              onError={() => {
                // If image fails to load, remove it
                handleRemove()
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-green-200 rounded-lg p-6 text-center">
          <PhotoIcon className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{placeholder}</p>
          
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Качване...' : 'Качи снимка'}
            </button>
            
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Въведи URL адрес
            </button>
          </div>
        </div>
      )}

      {showUrlInput && (
        <div className="flex space-x-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Добави
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}