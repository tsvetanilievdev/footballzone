'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const footballCategories = [
  { id: 'all', name: 'Всички', slug: 'all' },
  { id: 'news', name: 'Новини', slug: 'news' },
  { id: 'training', name: 'Тренировки', slug: 'training' },
  { id: 'tactics', name: 'Тактика', slug: 'tactics' },
  { id: 'players', name: 'Играчи', slug: 'players' },
  { id: 'coaches', name: 'Треньори', slug: 'coaches' },
  { id: 'interviews', name: 'Интервюта', slug: 'interviews' },
  { id: 'analysis', name: 'Анализи', slug: 'analysis' },
  { id: 'youth', name: 'Детско-юношески', slug: 'youth' },
  { id: 'nutrition', name: 'Хранене', slug: 'nutrition' },
  { id: 'psychology', name: 'Психология', slug: 'psychology' },
  { id: 'fitness', name: 'Физическа подготовка', slug: 'fitness' },
  { id: 'injuries', name: 'Травми', slug: 'injuries' },
  { id: 'equipment', name: 'Екипировка', slug: 'equipment' },
  { id: 'rules', name: 'Правила', slug: 'rules' },
  { id: 'tournaments', name: 'Турнири', slug: 'tournaments' }
]

interface SearchAndCategoriesProps {
  onSearchChange?: (searchTerm: string) => void
  onCategoryChange?: (category: string) => void
  selectedCategory?: string
}

export default function SearchAndCategories({ 
  onSearchChange, 
  onCategoryChange, 
  selectedCategory = 'all' 
}: SearchAndCategoriesProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearchChange?.(value)
  }

  const handleCategoryClick = (categorySlug: string) => {
    onCategoryChange?.(categorySlug)
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Search Section */}
          <div className="relative w-full sm:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full rounded border border-gray-300 bg-white py-1.5 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors"
              placeholder="Търсете статии..."
            />
          </div>

          {/* Categories Section - Horizontal Scroll */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-2 pb-1">
              {footballCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`
                    px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-all duration-200 
                    border border-gray-200 hover:border-green-500
                    ${selectedCategory === category.slug
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }
                  `}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 