'use client'

interface Category {
  id: string
  name: string
  icon: string
  description: string
  color: string
  subcategories: { id: string; name: string; count: number }[]
}

interface CategorySelectorProps {
  categories: Category[]
  selectedCategory: string | null
  onCategorySelect: (categoryId: string) => void
}

const colorVariants = {
  blue: 'from-blue-500 to-blue-600 border-blue-200 hover:border-blue-400',
  green: 'from-green-500 to-green-600 border-green-200 hover:border-green-400',
  red: 'from-red-500 to-red-600 border-red-200 hover:border-red-400',
  purple: 'from-purple-500 to-purple-600 border-purple-200 hover:border-purple-400',
  yellow: 'from-yellow-500 to-yellow-600 border-yellow-200 hover:border-yellow-400',
}

const selectedColorVariants = {
  blue: 'border-blue-500 bg-blue-50',
  green: 'border-green-500 bg-green-50',
  red: 'border-red-500 bg-red-50',
  purple: 'border-purple-500 bg-purple-50',
  yellow: 'border-yellow-500 bg-yellow-50',
}

export default function CategorySelector({ categories, selectedCategory, onCategorySelect }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id
        const colorClass = colorVariants[category.color as keyof typeof colorVariants] || colorVariants.blue
        const selectedColorClass = selectedColorVariants[category.color as keyof typeof selectedColorVariants] || selectedColorVariants.blue
        
        return (
          <div
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`
              relative group cursor-pointer transition-all duration-300 transform hover:scale-105
              ${isSelected ? 'scale-105' : ''}
            `}
          >
            <div className={`
              relative bg-white rounded-2xl border-2 p-6 h-full shadow-lg hover:shadow-xl transition-all duration-300
              ${isSelected 
                ? `${selectedColorClass} border-2` 
                : `border-gray-200 hover:border-gray-300`
              }
            `}>
              
              {/* Background Gradient */}
              {!isSelected && (
                <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              )}
              
              {/* Icon */}
              <div className="text-center mb-4">
                <div className={`
                  inline-flex items-center justify-center w-16 h-16 rounded-full text-3xl mb-3 transition-all duration-300
                  ${isSelected 
                    ? `bg-gradient-to-br ${colorClass} text-white shadow-lg scale-110`
                    : 'bg-gray-100 group-hover:bg-gray-200'
                  }
                `}>
                  {category.icon}
                </div>
              </div>
              
              {/* Content */}
              <div className="text-center space-y-2">
                <h3 className={`
                  font-bold text-lg transition-colors duration-300
                  ${isSelected ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}
                `}>
                  {category.name}
                </h3>
                
                <p className={`
                  text-sm leading-relaxed transition-colors duration-300
                  ${isSelected ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-600'}
                `}>
                  {category.description}
                </p>
                
                {/* Article Count */}
                <div className={`
                  inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300
                  ${isSelected 
                    ? `bg-gradient-to-r ${colorClass} text-white`
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }
                `}>
                  {category.subcategories.reduce((total, sub) => total + sub.count, 0)} материала
                </div>
              </div>
              
              {/* Selection Indicator */}
              {isSelected && (
                <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center shadow-lg`}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              {/* Hover Effect Border */}
              <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gray-300 transition-colors duration-300 ${isSelected ? 'border-transparent' : ''}`}></div>
            </div>
          </div>
        )
      })}
    </div>
  )
} 