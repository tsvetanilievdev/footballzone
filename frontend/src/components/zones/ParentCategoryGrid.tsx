interface ParentCategory {
  id: string
  name: string
  icon: string
  description: string
  color: string
  gradient: string
  subcategories: Array<{
    id: string
    name: string
    count: number
    icon: string
    priority: string
  }>
}

interface Props {
  categories: ParentCategory[]
  onCategorySelect: (categoryId: string) => void
}

export default function ParentCategoryGrid({ categories, onCategorySelect }: Props) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Изберете област за подкрепа
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Открийте експертни съвети и ресурси за всеки аспект от спортното развитие на детето ви
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <div
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className="group relative bg-white rounded-3xl p-8 cursor-pointer transform hover:scale-105 transition-all duration-500 hover:shadow-2xl border border-gray-100 overflow-hidden"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            {/* Floating Background Elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-gray-100 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 bg-gray-200 rounded-full opacity-30 group-hover:animate-pulse"></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Category Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow duration-300">
                <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </span>
              </div>

              {/* Category Info */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors duration-300">
                {category.name}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {category.description}
              </p>

              {/* Subcategory Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Области:</span>
                  <span className="text-sm text-purple-600 font-medium">
                    {category.subcategories.length} раздела
                  </span>
                </div>
                
                {/* Preview of high priority subcategories */}
                <div className="space-y-1">
                  {category.subcategories
                    .filter(sub => sub.priority === 'high')
                    .slice(0, 3)
                    .map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">{subcategory.icon}</span>
                        <span className="flex-1">{subcategory.name}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {subcategory.count}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Action Indicator */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Натиснете за разглеждане
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                  <svg className="w-4 h-4 text-purple-600 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Hover Border Effect */}
            <div className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-${category.color}-200 transition-colors duration-300`}></div>
          </div>
        ))}
      </div>

      {/* Bottom Info */}
      <div className="text-center pt-8">
        <div className="inline-flex items-center px-6 py-3 bg-purple-50 rounded-full">
          <span className="mr-2">💡</span>
          <span className="text-purple-700 font-medium">
            Всички материали са създадени от сертифицирани експерти
          </span>
        </div>
      </div>
    </div>
  )
} 