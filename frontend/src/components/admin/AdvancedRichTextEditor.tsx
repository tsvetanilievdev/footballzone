'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon,
  LinkIcon,
  PhotoIcon,
  VideoCameraIcon,
  CodeBracketIcon,
  PaintBrushIcon,
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

interface AdvancedRichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function AdvancedRichTextEditor({
  value,
  onChange,
  placeholder = "Започнете да пишете...",
  className = ""
}: AdvancedRichTextEditorProps) {
  const [activeFormats, setActiveFormats] = useState<string[]>([])
  const [fontSize, setFontSize] = useState('16')
  const [fontFamily, setFontFamily] = useState('Inter')
  const [textColor, setTextColor] = useState('#374151')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [showColorPicker, setShowColorPicker] = useState<'text' | 'background' | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatButtons = [
    { id: 'bold', icon: BoldIcon, command: 'bold', title: 'Удебелен (Ctrl+B)' },
    { id: 'italic', icon: ItalicIcon, command: 'italic', title: 'Курсив (Ctrl+I)' },
    { id: 'underline', icon: UnderlineIcon, command: 'underline', title: 'Подчертан (Ctrl+U)' },
  ]

  const listButtons = [
    { id: 'ul', icon: ListBulletIcon, command: 'insertUnorderedList', title: 'Списък с точки' },
    { id: 'ol', icon: NumberedListIcon, command: 'insertOrderedList', title: 'Номериран списък' },
  ]

  const mediaButtons = [
    { id: 'link', icon: LinkIcon, title: 'Добави връзка (Ctrl+K)' },
    { id: 'image', icon: PhotoIcon, title: 'Добави изображение' },
    { id: 'video', icon: VideoCameraIcon, title: 'Вмъкни видео' },
  ]

  const colors = [
    '#374151', '#DC2626', '#059669', '#3B82F6', '#7C3AED', '#F59E0B',
    '#EF4444', '#10B981', '#6366F1', '#8B5CF6', '#F97316', '#84CC16'
  ]

  const fontFamilies = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Courier New', label: 'Courier New' },
  ]

  const fontSizes = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '48']

  const handleFormat = (command: string) => {
    document.execCommand(command, false, '')
    updateActiveFormats()
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleFontSize = (size: string) => {
    setFontSize(size)
    document.execCommand('fontSize', false, '7')
    const fontElements = document.querySelectorAll('font[size="7"]')
    fontElements.forEach(element => {
      element.removeAttribute('size')
      ;(element as HTMLElement).style.fontSize = `${size}px`
    })
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleFontFamily = (family: string) => {
    setFontFamily(family)
    document.execCommand('fontName', false, family)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleTextColor = (color: string) => {
    setTextColor(color)
    document.execCommand('foreColor', false, color)
    setShowColorPicker(null)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleBackgroundColor = (color: string) => {
    setBackgroundColor(color)
    document.execCommand('hiliteColor', false, color)
    setShowColorPicker(null)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const insertLink = () => {
    const url = prompt('Въведете URL адрес:')
    if (url) {
      document.execCommand('createLink', false, url)
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    }
  }

  const insertImage = () => {
    const url = prompt('Въведете URL на изображението:')
    if (url) {
      document.execCommand('insertImage', false, url)
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    }
  }

  const insertVideo = () => {
    const url = prompt('Въведете URL на видеото (YouTube, Vimeo):')
    if (url) {
      let embedUrl = ''
      
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('youtu.be') 
          ? url.split('youtu.be/')[1]
          : url.split('v=')[1]?.split('&')[0]
        embedUrl = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`
      } else if (url.includes('vimeo.com')) {
        const videoId = url.split('vimeo.com/')[1]
        embedUrl = `<iframe width="100%" height="315" src="https://player.vimeo.com/video/${videoId}" frameborder="0" allowfullscreen></iframe>`
      }

      if (embedUrl && editorRef.current) {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const videoElement = document.createElement('div')
          videoElement.innerHTML = embedUrl
          videoElement.style.margin = '20px 0'
          range.insertNode(videoElement)
        }
        onChange(editorRef.current.innerHTML)
      }
    }
  }

  const insertHeading = (level: number) => {
    document.execCommand('formatBlock', false, `h${level}`)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const insertQuote = () => {
    document.execCommand('formatBlock', false, 'blockquote')
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const insertCode = () => {
    const code = prompt('Въведете код:')
    if (code) {
      const codeElement = `<pre><code>${code}</code></pre>`
      document.execCommand('insertHTML', false, codeElement)
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    }
  }

  const updateActiveFormats = () => {
    const formats: string[] = []
    if (document.queryCommandState('bold')) formats.push('bold')
    if (document.queryCommandState('italic')) formats.push('italic')
    if (document.queryCommandState('underline')) formats.push('underline')
    setActiveFormats(formats)
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
    updateActiveFormats()
  }

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || ''
    }
  }, [])

  // Sync external value changes with editor content
  useEffect(() => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value
      }
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          handleFormat('bold')
          break
        case 'i':
          e.preventDefault()
          handleFormat('italic')
          break
        case 'u':
          e.preventDefault()
          handleFormat('underline')
          break
        case 'k':
          e.preventDefault()
          insertLink()
          break
      }
    }
  }

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Font Controls */}
          <div className="flex items-center gap-2 border-r border-gray-300 pr-3">
            <select
              value={fontFamily}
              onChange={(e) => handleFontFamily(e.target.value)}
              className="text-sm border border-gray-200 rounded px-2 py-1"
            >
              {fontFamilies.map(font => (
                <option key={font.value} value={font.value}>{font.label}</option>
              ))}
            </select>
            
            <select
              value={fontSize}
              onChange={(e) => handleFontSize(e.target.value)}
              className="text-sm border border-gray-200 rounded px-2 py-1 w-16"
            >
              {fontSizes.map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>

          {/* Format Controls */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
            {formatButtons.map(button => {
              const Icon = button.icon
              return (
                <button
                  key={button.id}
                  onClick={() => handleFormat(button.command)}
                  className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                    activeFormats.includes(button.id) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                  }`}
                  title={button.title}
                >
                  <Icon className="w-4 h-4" />
                </button>
              )
            })}
          </div>

          {/* Color Controls */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3 relative" ref={colorPickerRef}>
            <button
              onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
              title="Цвят на текста"
            >
              <div className="flex items-center">
                <PaintBrushIcon className="w-4 h-4" />
                <div 
                  className="w-3 h-1 ml-1 rounded"
                  style={{ backgroundColor: textColor }}
                />
              </div>
            </button>

            <button
              onClick={() => setShowColorPicker(showColorPicker === 'background' ? null : 'background')}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
              title="Цвят на фона"
            >
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 border border-gray-300 rounded"
                  style={{ backgroundColor: backgroundColor }}
                />
              </div>
            </button>

            {/* Color Picker */}
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                <div className="grid grid-cols-6 gap-1">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => 
                        showColorPicker === 'text' 
                          ? handleTextColor(color) 
                          : handleBackgroundColor(color)
                      }
                      className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* List Controls */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
            {listButtons.map(button => {
              const Icon = button.icon
              return (
                <button
                  key={button.id}
                  onClick={() => handleFormat(button.command)}
                  className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
                  title={button.title}
                >
                  <Icon className="w-4 h-4" />
                </button>
              )
            })}
          </div>

          {/* Heading Controls */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
            {[1, 2, 3, 4].map(level => (
              <button
                key={level}
                onClick={() => insertHeading(level)}
                className="px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors text-gray-600"
                title={`Заглавие ${level}`}
              >
                H{level}
              </button>
            ))}
            <button
              onClick={insertQuote}
              className="px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors text-gray-600"
              title="Цитат"
            >
              "
            </button>
          </div>

          {/* Media Controls */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
            <button
              onClick={insertLink}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
              title="Добави връзка"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              onClick={insertImage}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
              title="Добави изображение"
            >
              <PhotoIcon className="w-4 h-4" />
            </button>
            <button
              onClick={insertVideo}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
              title="Вмъкни видео"
            >
              <VideoCameraIcon className="w-4 h-4" />
            </button>
            <button
              onClick={insertCode}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
              title="Добави код"
            >
              <CodeBracketIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Preview Toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              showPreview ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
            title="Преглед"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        {showPreview ? (
          <div 
            className="p-4 min-h-64 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            className="p-4 min-h-64 outline-none prose max-w-none"
            style={{
              fontFamily: fontFamily,
              fontSize: `${fontSize}px`
            }}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onBlur={updateActiveFormats}
            onFocus={updateActiveFormats}
            suppressContentEditableWarning={true}
            data-placeholder={placeholder}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-3 py-2 text-xs text-gray-500 flex justify-between">
        <span>
          Думи: {value.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}
        </span>
        <span>
          Символи: {value.replace(/<[^>]*>/g, '').length}
        </span>
      </div>
    </div>
  )
}