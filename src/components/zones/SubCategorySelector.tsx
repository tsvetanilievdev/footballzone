'use client'

interface Category {
  id: string
  name: string
  icon: string
  description: string
  color: string
  subcategories: { id: string; name: string; count: number }[]
}

interface SubCategorySelectorProps {
  category: Category
  selectedSubcategory: string | null
  onSubcategorySelect: (subcategoryId: string) => void
}

const colorVariants = {
  blue: 'bg-blue-600 hover:bg-blue-700 border-blue-500',
  green: 'bg-green-600 hover:bg-green-700 border-green-500',
  red: 'bg-red-600 hover:bg-red-700 border-red-500',
  purple: 'bg-purple-600 hover:bg-purple-700 border-purple-500',
  yellow: 'bg-yellow-600 hover:bg-yellow-700 border-yellow-500',
}

const lightColorVariants = {
  blue: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100',
  green: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100',
  red: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100',
  purple: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100',
}

export default function SubCategorySelector({ 
  category, 
  selectedSubcategory, 
  onSubcategorySelect 
}: SubCategorySelectorProps) {
  const colorClass = colorVariants[category.color as keyof typeof colorVariants] || colorVariants.blue
  const lightColorClass = lightColorVariants[category.color as keyof typeof lightColorVariants] || lightColorVariants.blue

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-2xl mr-4 ${colorClass} text-white`}>
            {category.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
            <p className="text-gray-600">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 text-center">
          Изберете специализация:
        </h4>
        
        <div className="flex flex-wrap justify-center gap-3">
          {/* All Subcategories Button */}
          <button
            onClick={() => onSubcategorySelect('')}
            className={`
              px-6 py-3 rounded-full border-2 font-medium transition-all duration-300 transform hover:scale-105
              ${!selectedSubcategory
                ? `${colorClass} text-white border-transparent shadow-lg scale-105`
                : `${lightColorClass} border-2`
              }
            `}
          >
            <span className="flex items-center space-x-2">
              <span>Всички</span>
              <span className={`
                px-2 py-1 rounded-full text-xs font-bold
                ${!selectedSubcategory 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {category.subcategories.reduce((total, sub) => total + sub.count, 0)}
              </span>
            </span>
          </button>

          {/* Individual Subcategory Buttons */}
          {category.subcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => onSubcategorySelect(subcategory.id)}
              className={`
                px-6 py-3 rounded-full border-2 font-medium transition-all duration-300 transform hover:scale-105
                ${selectedSubcategory === subcategory.id
                  ? `${colorClass} text-white border-transparent shadow-lg scale-105`
                  : `${lightColorClass} border-2`
                }
              `}
            >
              <span className="flex items-center space-x-2">
                <span>{subcategory.name}</span>
                <span className={`
                  px-2 py-1 rounded-full text-xs font-bold
                  ${selectedSubcategory === subcategory.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {subcategory.count}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
        <div className="text-sm text-gray-500">
          {selectedSubcategory 
            ? `${category.subcategories.find(sub => sub.id === selectedSubcategory)?.name} избрана`
            : 'Всички категории показани'
          }
        </div>
      </div>
    </div>
  )
} 