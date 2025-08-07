'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
  icon: string
  description: string
  color: string
  gradient: string
  bgPattern: string
  subcategories: { id: string; name: string; count: number; icon: string; difficulty: string }[]
}

interface InteractiveCategoryGridProps {
  categories: Category[]
  selectedCategory: string | null
  hoveredCategory: string | null
  onCategorySelect: (categoryId: string) => void
  onCategoryHover: (categoryId: string | null) => void
}

const colorVariants = {
  emerald: 'border-emerald-500 bg-emerald-50',
  red: 'border-red-500 bg-red-50',
  blue: 'border-blue-500 bg-blue-50',
  purple: 'border-purple-500 bg-purple-50',
  orange: 'border-orange-500 bg-orange-50',
}

const glowVariants = {
  emerald: 'shadow-emerald-500/50',
  red: 'shadow-red-500/50',
  blue: 'shadow-blue-500/50',
  purple: 'shadow-purple-500/50',
  orange: 'shadow-orange-500/50',
}

export default function InteractiveCategoryGrid({
  categories,
  selectedCategory,
  hoveredCategory,
  onCategorySelect,
  onCategoryHover
}: InteractiveCategoryGridProps) {
  const [animationClass, setAnimationClass] = useState('')

  useEffect(() => {
    if (selectedCategory) {
      setAnimationClass('animate-pulse')
      const timer = setTimeout(() => setAnimationClass(''), 600)
      return () => clearTimeout(timer)
    }
  }, [selectedCategory])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
      {categories.map((category, index) => {
        const isSelected = selectedCategory === category.id
        const isHovered = hoveredCategory === category.id
        const colorClass = colorVariants[category.color as keyof typeof colorVariants] || colorVariants.emerald
        const glowClass = glowVariants[category.color as keyof typeof glowVariants] || glowVariants.emerald
        
        return (
          <div
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            onMouseEnter={() => onCategoryHover(category.id)}
            onMouseLeave={() => onCategoryHover(null)}
            className={`
              relative group cursor-pointer transform transition-all duration-500 ease-out
              ${isSelected ? 'scale-110 z-20' : isHovered ? 'scale-105 z-10' : 'scale-100'}
              ${animationClass}
            `}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            {/* Glow Effect */}
            <div className={`
              absolute -inset-2 rounded-3xl opacity-0 transition-opacity duration-300
              ${isSelected || isHovered ? 'opacity-100' : ''}
              bg-gradient-to-r ${category.gradient} blur-xl ${glowClass}
            `}></div>
            
            {/* Main Card */}
            <div className={`
              relative bg-white rounded-2xl border-2 p-6 h-full shadow-lg transition-all duration-300
              ${isSelected 
                ? `${colorClass} border-4 shadow-2xl` 
                : isHovered 
                  ? 'border-gray-300 shadow-xl' 
                  : 'border-gray-200 hover:border-gray-300'
              }
              backdrop-blur-sm
            `}>
              
              {/* Background Pattern */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className={`
                  absolute inset-0 opacity-5 transition-opacity duration-300
                  ${isSelected || isHovered ? 'opacity-10' : ''}
                  bg-gradient-to-br ${category.gradient}
                `}></div>
                
                {/* Pattern Elements */}
                <div className="absolute top-4 right-4 text-6xl opacity-5 transform rotate-12">
                  {category.icon}
                </div>
                <div className="absolute bottom-4 left-4 text-4xl opacity-5 transform -rotate-12">
                  {category.icon}
                </div>
              </div>
              
              {/* Floating Icon */}
              <div className="text-center mb-6 relative z-10">
                <div className={`
                  inline-flex items-center justify-center w-20 h-20 rounded-2xl text-4xl mb-4 transition-all duration-500
                  transform ${isSelected || isHovered ? 'rotate-12 scale-110' : 'rotate-0 scale-100'}
                  ${isSelected 
                    ? `bg-gradient-to-br ${category.gradient} text-white shadow-2xl`
                    : isHovered 
                      ? `bg-gradient-to-br ${category.gradient} text-white shadow-xl`
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }
                `}>
                  <span className={`transition-transform duration-300 ${isSelected || isHovered ? 'animate-bounce' : ''}`}>
                    {category.icon}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="text-center space-y-3 relative z-10">
                <h3 className={`
                  font-bold text-xl transition-all duration-300
                  ${isSelected ? 'text-gray-900 scale-105' : isHovered ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}
                `}>
                  {category.name}
                </h3>
                
                <p className={`
                  text-sm leading-relaxed transition-all duration-300
                  ${isSelected ? 'text-gray-700' : isHovered ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-600'}
                `}>
                  {category.description}
                </p>
                
                {/* Stats */}
                <div className="flex justify-center space-x-4 pt-3">
                  <div className={`
                    flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300
                    ${isSelected 
                      ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                      : isHovered 
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    }
                  `}>
                    <span className="mr-1">📚</span>
                    {category.subcategories.reduce((total, sub) => total + sub.count, 0)} материала
                  </div>
                </div>
                
                {/* Subcategories Preview */}
                {(isSelected || isHovered) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
                    <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">
                      Секции:
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {category.subcategories.slice(0, 3).map((sub) => (
                        <span 
                          key={sub.id}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                        >
                          <span className="mr-1">{sub.icon}</span>
                          {sub.name}
                        </span>
                      ))}
                      {category.subcategories.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-200 text-gray-500 rounded text-xs font-medium">
                          +{category.subcategories.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Selection Indicator */}
              {isSelected && (
                <div className={`
                  absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg
                  bg-gradient-to-br ${category.gradient} animate-pulse
                `}>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              {/* Progress Bar */}
              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${category.gradient} animate-pulse`}></div>
                </div>
              )}
            </div>
            
            {/* Floating Elements */}
            {(isSelected || isHovered) && (
              <>
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-ping delay-300"></div>
              </>
            )}
          </div>
        )
      })}
      
      {/* Custom CSS */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
} 