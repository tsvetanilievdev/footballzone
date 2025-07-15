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

interface AnimatedSubCategoriesProps {
  category: Category
  selectedSubcategory: string | null
  onSubcategorySelect: (subcategoryId: string) => void
}

const colorVariants = {
  emerald: 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500',
  red: 'bg-red-600 hover:bg-red-700 border-red-500',
  blue: 'bg-blue-600 hover:bg-blue-700 border-blue-500',
  purple: 'bg-purple-600 hover:bg-purple-700 border-purple-500',
  orange: 'bg-orange-600 hover:bg-orange-700 border-orange-500',
}

const lightColorVariants = {
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100',
  red: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100',
  blue: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100',
  purple: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100',
  orange: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100',
}

const difficultyColors = {
  'Начинаещ': 'bg-green-100 text-green-800',
  'Средно': 'bg-yellow-100 text-yellow-800',
  'Напреднал': 'bg-red-100 text-red-800',
}

export default function AnimatedSubCategories({ 
  category, 
  selectedSubcategory, 
  onSubcategorySelect 
}: AnimatedSubCategoriesProps) {
  const [isVisible, setIsVisible] = useState(false)
  const colorClass = colorVariants[category.color as keyof typeof colorVariants] || colorVariants.emerald
  const lightColorClass = lightColorVariants[category.color as keyof typeof lightColorVariants] || lightColorVariants.emerald

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className={`
      py-12 lg:py-16 relative overflow-hidden transition-all duration-1000 ease-out
      ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}
    `}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-5`}></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-current to-transparent opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-current to-transparent opacity-20"></div>
      </div>
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float-slow"></div>
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Category Header with Animation */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className={`
              inline-flex items-center justify-center w-16 h-16 rounded-2xl text-3xl mr-6
              ${colorClass} text-white shadow-2xl animate-bounce-gentle
            `}>
              {category.icon}
            </div>
            <div className="text-left">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-lg text-gray-600">{category.description}</p>
            </div>
          </div>
        </div>

        {/* Interactive Subcategories Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h4 className="text-2xl font-bold text-gray-800 mb-4">
              Изберете специализация:
            </h4>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mb-8"></div>
          </div>
          
          {/* All Button with Special Design */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => onSubcategorySelect('')}
              className={`
                group relative px-8 py-4 rounded-2xl border-2 font-bold text-lg transition-all duration-300 transform hover:scale-105
                ${!selectedSubcategory
                  ? `${colorClass} text-white border-transparent shadow-2xl scale-105`
                  : `${lightColorClass} border-2 hover:shadow-xl`
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎯</span>
                <span>Всички специализации</span>
                <span className={`
                  px-3 py-1 rounded-full text-sm font-bold transition-all duration-300
                  ${!selectedSubcategory 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                  }
                `}>
                  {category.subcategories.reduce((total, sub) => total + sub.count, 0)} материала
                </span>
              </div>
              
              {/* Animated Border */}
              {!selectedSubcategory && (
                <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-pulse"></div>
              )}
            </button>
          </div>

          {/* Subcategories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {category.subcategories.map((subcategory, index) => (
              <div
                key={subcategory.id}
                className={`
                  transform transition-all duration-500 ease-out
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                <button
                  onClick={() => onSubcategorySelect(subcategory.id)}
                  className={`
                    group relative w-full p-6 rounded-2xl border-2 font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl
                    ${selectedSubcategory === subcategory.id
                      ? `${colorClass} text-white border-transparent shadow-2xl scale-105`
                      : `${lightColorClass} border-2 hover:shadow-lg`
                    }
                  `}
                >
                  {/* Background Effects */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className={`
                      absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10
                      bg-gradient-to-br ${category.gradient}
                    `}></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 space-y-3">
                    {/* Icon and Title */}
                    <div className="flex items-center justify-center mb-4">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300
                        ${selectedSubcategory === subcategory.id 
                          ? 'bg-white/20 text-white scale-110' 
                          : 'bg-gray-100 group-hover:bg-gray-200 group-hover:scale-110'
                        }
                      `}>
                        {subcategory.icon}
                      </div>
                    </div>
                    
                    <h5 className="font-bold text-base leading-tight">
                      {subcategory.name}
                    </h5>
                    
                    {/* Stats Row */}
                    <div className="flex items-center justify-between">
                      <span className={`
                        inline-flex items-center px-2 py-1 rounded-full text-xs font-bold transition-all duration-300
                        ${selectedSubcategory === subcategory.id 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                        }
                      `}>
                        {subcategory.count} урока
                      </span>
                      
                      <span className={`
                        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${difficultyColors[subcategory.difficulty as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-600'}
                      `}>
                        {subcategory.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  {/* Selection Indicator */}
                  {selectedSubcategory === subcategory.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <svg className={`w-4 h-4 text-${category.color}-600`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Hover Effects */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-300 pointer-events-none"></div>
                </button>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mt-12">
            <div className="flex items-center space-x-4 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg">
              <div className={`w-4 h-4 rounded-full ${colorClass} animate-pulse`}></div>
              <div className="text-sm font-medium text-gray-700">
                {selectedSubcategory 
                  ? `${category.subcategories.find(sub => sub.id === selectedSubcategory)?.name} избрана`
                  : 'Всички категории показани'
                }
              </div>
              <div className="flex space-x-1">
                {category.subcategories.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      selectedSubcategory === category.subcategories[index].id
                        ? `${colorClass.split(' ')[0]} scale-125`
                        : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(90deg); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
} 