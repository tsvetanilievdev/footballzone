interface Subcategory {
  id: string
  name: string
  count: number
  icon: string
  priority: string
}

interface Props {
  subcategories: Subcategory[]
  selectedSubCategory: string | null
  onSubCategorySelect: (subcategoryId: string | null) => void
  categoryColor: string
}

export default function ParentSubCategories({ 
  subcategories, 
  selectedSubCategory, 
  onSubCategorySelect,
  categoryColor 
}: Props) {
  
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      green: 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
      red: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
      orange: 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100',
      purple: 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100',
      blue: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
    }
    return colorMap[color] || 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
  }

  const getSelectedColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      green: 'border-green-500 bg-green-500 text-white',
      red: 'border-red-500 bg-red-500 text-white',
      orange: 'border-orange-500 bg-orange-500 text-white',
      purple: 'border-purple-500 bg-purple-500 text-white',
      blue: 'border-blue-500 bg-blue-500 text-white'
    }
    return colorMap[color] || 'border-gray-500 bg-gray-500 text-white'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-green-100 text-green-700'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Висок приоритет'
      case 'medium':
        return 'Среден приоритет'
      default:
        return 'Нисък приоритет'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">
          Изберете конкретна област
        </h3>
        <button
          onClick={() => onSubCategorySelect(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedSubCategory 
              ? getSelectedColorClasses(categoryColor)
              : getColorClasses(categoryColor) + ' border'
          }`}
        >
          Всички области
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subcategories.map((subcategory) => {
          const isSelected = selectedSubCategory === subcategory.id
          
          return (
            <div
              key={subcategory.id}
              onClick={() => onSubCategorySelect(isSelected ? null : subcategory.id)}
              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                isSelected 
                  ? getSelectedColorClasses(categoryColor) + ' shadow-lg scale-105'
                  : getColorClasses(categoryColor) + ' border hover:shadow-md'
              }`}
            >
              {/* Priority Badge */}
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(subcategory.priority)}`}>
                {getPriorityText(subcategory.priority)}
              </div>

              {/* Icon and Content */}
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${
                  isSelected 
                    ? 'bg-white/20' 
                    : 'bg-white shadow-sm'
                }`}>
                  <span className={`text-2xl ${isSelected ? 'brightness-200' : ''}`}>
                    {subcategory.icon}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-lg mb-2 ${
                    isSelected ? 'text-white' : 'text-gray-900'
                  }`}>
                    {subcategory.name}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${
                      isSelected ? 'text-white/80' : 'text-gray-600'
                    }`}>
                      {subcategory.count} материала
                    </span>
                    
                    {/* Selection Indicator */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'border-white bg-white' 
                        : `border-${categoryColor}-300`
                    }`}>
                      {isSelected && (
                        <svg className={`w-3 h-3 text-${categoryColor}-600`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Effects */}
              {!isSelected && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent to-white opacity-0 hover:opacity-5 transition-opacity duration-300"></div>
              )}
            </div>
          )
        })}
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-gray-500 text-sm">
          Изберете конкретна област или разгледайте всички материали в категорията
        </p>
      </div>
    </div>
  )
} 