'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  LinkIcon,
  PhotoIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline'

// Using available icons as replacements for missing ones
import {
  Bars3Icon as AlignLeftIcon,
  Bars3CenterLeftIcon as AlignCenterIcon,
  Bars3BottomRightIcon as AlignRightIcon,
  ListBulletIcon as ListNumberedIcon,
  ChatBubbleLeftRightIcon as QuoteIcon
} from '@heroicons/react/24/outline'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const FONTS = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
  { value: 'Tahoma', label: 'Tahoma' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' }
]

const FONT_SIZES = [
  { value: '12px', label: '12' },
  { value: '14px', label: '14' },
  { value: '16px', label: '16' },
  { value: '18px', label: '18' },
  { value: '20px', label: '20' },
  { value: '24px', label: '24' },
  { value: '28px', label: '28' },
  { value: '32px', label: '32' },
  { value: '36px', label: '36' },
  { value: '48px', label: '48' },
  { value: '72px', label: '72' }
]

const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff'
]

export default function RichTextEditor({ value, onChange, placeholder, className = '' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [selectedFont, setSelectedFont] = useState('Arial')
  const [selectedSize, setSelectedSize] = useState('16px')
  const [customSize, setCustomSize] = useState('')
  const [showCustomSizeInput, setShowCustomSizeInput] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [selectedBgColor, setSelectedBgColor] = useState('transparent')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showBgColorPicker, setShowBgColorPicker] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
      updateWordCount()
    }
  }, [value])

  // Track selection changes to update font size display
  useEffect(() => {
    const updateFormatting = () => {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const container = range.commonAncestorContainer
        const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container as HTMLElement

        if (element && editorRef.current?.contains(element)) {
          // Get computed font size
          const computedStyle = window.getComputedStyle(element)
          const fontSize = computedStyle.fontSize
          if (fontSize) {
            setSelectedSize(fontSize)
          }

          // Get computed font family
          const fontFamily = computedStyle.fontFamily
          if (fontFamily) {
            setSelectedFont(fontFamily.replace(/['"]/g, '').split(',')[0])
          }

          // Check bold, italic, underline
          setIsBold(computedStyle.fontWeight === 'bold' || parseInt(computedStyle.fontWeight) >= 600)
          setIsItalic(computedStyle.fontStyle === 'italic')
          setIsUnderline(computedStyle.textDecoration.includes('underline'))
        }
      }
    }

    document.addEventListener('selectionchange', updateFormatting)
    return () => document.removeEventListener('selectionchange', updateFormatting)
  }, [])

  const updateWordCount = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || editorRef.current.textContent || ''
      const words = text.trim().split(/\s+/).filter(word => word.length > 0)
      setWordCount(words.length)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateWordCount()
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
      updateWordCount()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()

    // Get plain text from clipboard
    const text = e.clipboardData.getData('text/plain')

    // Insert plain text at cursor position
    document.execCommand('insertText', false, text)

    // Ensure the editor is focused
    editorRef.current?.focus()

    // Update content
    handleInput()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      execCommand('insertLineBreak')
    }
  }

  const insertLink = () => {
    const url = prompt('Въведете URL:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const insertImage = () => {
    const url = prompt('Въведете URL на изображението:')
    if (url) {
      execCommand('insertImage', url)
    }
  }

  const changeFont = (font: string) => {
    setSelectedFont(font)
    execCommand('fontName', font)
  }

  const applyFontSize = (size: string) => {
    // Focus first to ensure we're in the editor
    editorRef.current?.focus()

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)

    // If no text is selected, insert a styled space/placeholder for future typing
    if (range.collapsed) {
      const span = document.createElement('span')
      span.style.fontSize = size
      span.innerHTML = '&nbsp;' // Non-breaking space as placeholder

      range.insertNode(span)

      // Move cursor inside the span so future typing inherits the style
      range.setStart(span.firstChild!, 1)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)

      handleInput()
      return
    }

    // Create a span with the font size for selected text
    const span = document.createElement('span')
    span.style.fontSize = size

    // Wrap the selected content
    try {
      const contents = range.extractContents()
      span.appendChild(contents)
      range.insertNode(span)

      // Clear selection and place cursor after the styled text
      range.setStartAfter(span)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)

      // Trigger change
      handleInput()
    } catch (error) {
      console.error('Error applying font size:', error)
    }
  }

  const changeSize = (size: string) => {
    if (size === 'custom') {
      setShowCustomSizeInput(true)
      return
    }
    setSelectedSize(size)
    applyFontSize(size)
  }

  const applyCustomSize = () => {
    const sizeValue = parseInt(customSize)
    if (sizeValue && sizeValue >= 8 && sizeValue <= 144) {
      const newSize = `${sizeValue}px`
      setSelectedSize(newSize)
      applyFontSize(newSize)
      setCustomSize('')
      setShowCustomSizeInput(false)
    }
  }

  const increaseFontSize = () => {
    const currentSize = parseInt(selectedSize)
    const newSize = Math.min(currentSize + 1, 72) // Max 72px
    const newSizeStr = `${newSize}px`
    setSelectedSize(newSizeStr)
    applyFontSize(newSizeStr)
  }

  const decreaseFontSize = () => {
    const currentSize = parseInt(selectedSize)
    const newSize = Math.max(currentSize - 1, 8) // Min 8px
    const newSizeStr = `${newSize}px`
    setSelectedSize(newSizeStr)
    applyFontSize(newSizeStr)
  }

  const changeColor = (color: string) => {
    setSelectedColor(color)
    execCommand('foreColor', color)
  }

  const changeBgColor = (color: string) => {
    setSelectedBgColor(color)
    execCommand('hiliteColor', color)
  }

  const toggleBold = () => {
    setIsBold(!isBold)
    execCommand('bold')
  }

  const toggleItalic = () => {
    setIsItalic(!isItalic)
    execCommand('italic')
  }

  const toggleUnderline = () => {
    setIsUnderline(!isUnderline)
    execCommand('underline')
  }

  const undo = () => execCommand('undo')
  const redo = () => execCommand('redo')

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Toolbar */}
      <div className="bg-white border border-gray-300 rounded-t-lg p-2 flex flex-wrap gap-1 items-center">
        {/* Font Controls */}
        <select
          value={selectedFont}
          onChange={(e) => changeFont(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
        >
          {FONTS.map(font => (
            <option key={font.value} value={font.value}>{font.label}</option>
          ))}
        </select>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={decreaseFontSize}
            className="p-1.5 border border-gray-300 rounded-l hover:bg-gray-100"
            title="Намали размера на шрифта"
          >
            <MinusIcon className="w-3 h-3" />
          </button>
          <select
            value={FONT_SIZES.find(s => s.value === selectedSize) ? selectedSize : 'custom'}
            onChange={(e) => changeSize(e.target.value)}
            className="px-2 py-1 border-y border-gray-300 text-sm w-20"
          >
            {FONT_SIZES.map(size => (
              <option key={size.value} value={size.value}>{size.label}</option>
            ))}
            <option value="custom">
              {FONT_SIZES.find(s => s.value === selectedSize) ? 'Друг' : parseInt(selectedSize)}
            </option>
          </select>
          <button
            type="button"
            onClick={increaseFontSize}
            className="p-1.5 border border-gray-300 rounded-r hover:bg-gray-100"
            title="Увеличи размера на шрифта"
          >
            <PlusIcon className="w-3 h-3" />
          </button>
        </div>

        {showCustomSizeInput && (
          <div className="flex items-center gap-1 ml-2">
            <input
              type="number"
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && applyCustomSize()}
              placeholder="Размер"
              min="8"
              max="144"
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
              autoFocus
            />
            <button
              type="button"
              onClick={applyCustomSize}
              className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCustomSizeInput(false)
                setCustomSize('')
              }}
              className="px-2 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50"
            >
              ✕
            </button>
          </div>
        )}

        {/* Text Style Controls */}
        <button
          onClick={toggleBold}
          className={`p-2 rounded hover:bg-gray-100 ${isBold ? 'bg-blue-100 text-blue-600' : ''}`}
          title="Удебелен текст"
        >
          <BoldIcon className="w-4 h-4" />
        </button>

        <button
          onClick={toggleItalic}
          className={`p-2 rounded hover:bg-gray-100 ${isItalic ? 'bg-blue-100 text-blue-600' : ''}`}
          title="Наклонен текст"
        >
          <ItalicIcon className="w-4 h-4" />
        </button>

        <button
          onClick={toggleUnderline}
          className={`p-2 rounded hover:bg-gray-100 ${isUnderline ? 'bg-blue-100 text-blue-600' : ''}`}
          title="Подчертан текст"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Color Controls */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded hover:bg-gray-100 flex items-center gap-1"
            title="Цвят на текста"
          >
            <div
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: selectedColor }}
            ></div>
            <span className="text-xs">Цвят</span>
          </button>

          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg p-2 shadow-lg z-10">
              <div className="grid grid-cols-10 gap-1">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      changeColor(color)
                      setShowColorPicker(false)
                    }}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  ></button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowBgColorPicker(!showBgColorPicker)}
            className="p-2 rounded hover:bg-gray-100 flex items-center gap-1"
            title="Цвят на фона"
          >
            <div
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: selectedBgColor === 'transparent' ? '#f0f0f0' : selectedBgColor }}
            ></div>
            <span className="text-xs">Фон</span>
          </button>

          {showBgColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg p-2 shadow-lg z-10">
              <div className="grid grid-cols-10 gap-1">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      changeBgColor(color)
                      setShowBgColorPicker(false)
                    }}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  ></button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Alignment Controls */}
        <button
          onClick={() => execCommand('justifyLeft')}
          className="p-2 rounded hover:bg-gray-100"
          title="Подравни вляво"
        >
          <AlignLeftIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => execCommand('justifyCenter')}
          className="p-2 rounded hover:bg-gray-100"
          title="Подравни в центъра"
        >
          <AlignCenterIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => execCommand('justifyRight')}
          className="p-2 rounded hover:bg-gray-100"
          title="Подравни вдясно"
        >
          <AlignRightIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* List Controls */}
        <button
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 rounded hover:bg-gray-100"
          title="Списък с точки"
        >
          <ListBulletIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 rounded hover:bg-gray-100"
          title="Номериран списък"
        >
          <ListNumberedIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Heading Controls */}
        <button
          onClick={() => execCommand('formatBlock', '<h1>')}
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="Заглавие 1"
        >
          H1
        </button>

        <button
          onClick={() => execCommand('formatBlock', '<h2>')}
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="Заглавие 2"
        >
          H2
        </button>

        <button
          onClick={() => execCommand('formatBlock', '<h3>')}
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="Заглавие 3"
        >
          H3
        </button>

        <button
          onClick={() => execCommand('formatBlock', '<p>')}
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          title="Параграф"
        >
          P
        </button>

        <button
          onClick={() => execCommand('formatBlock', '<blockquote>')}
          className="p-2 rounded hover:bg-gray-100"
          title="Цитат"
        >
          <QuoteIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Link and Image Controls */}
        <button
          onClick={insertLink}
          className="p-2 rounded hover:bg-gray-100"
          title="Добави връзка"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          onClick={insertImage}
          className="p-2 rounded hover:bg-gray-100"
          title="Добави изображение"
        >
          <PhotoIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Undo/Redo Controls */}
        <button
          onClick={undo}
          className="p-2 rounded hover:bg-gray-100"
          title="Отмени"
        >
          <ArrowUturnLeftIcon className="w-4 h-4" />
        </button>

        <button
          onClick={redo}
          className="p-2 rounded hover:bg-gray-100"
          title="Повтори"
        >
          <ArrowUturnRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="min-h-96 p-4 border border-t-0 border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [&]:text-left"
        placeholder={placeholder}
        suppressContentEditableWarning
      />

      {/* Word Count */}
      <div className="mt-2 text-sm text-gray-500 flex justify-between items-center">
        <span>Думи: {wordCount}</span>
        <span>Символи: {value.length}</span>
      </div>

      {/* Inline styles to fix text direction */}
      <style jsx>{`
        [contenteditable] {
          writing-mode: horizontal-tb !important;
        }
        [contenteditable]:empty:before {
          content: attr(placeholder);
          color: #9ca3af;
        }
      `}</style>
    </div>
  )
}