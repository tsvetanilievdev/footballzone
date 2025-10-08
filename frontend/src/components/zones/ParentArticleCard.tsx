import { Article } from '@/types'
import { formatDateBG } from '@/utils/dateUtils'

interface Props {
  article: Article
  categoryColor: string
}

export default function ParentArticleCard({ article, categoryColor }: Props) {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      green: 'text-green-600 border-green-200',
      red: 'text-red-600 border-red-200',
      orange: 'text-orange-600 border-orange-200',
      purple: 'text-purple-600 border-purple-200',
      blue: 'text-blue-600 border-blue-200'
    }
    return colorMap[color] || 'text-gray-600 border-gray-200'
  }

  const getGradientClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      green: 'from-green-400 to-green-600',
      red: 'from-red-400 to-red-600',
      orange: 'from-orange-400 to-orange-600',
      purple: 'from-purple-400 to-purple-600',
      blue: 'from-blue-400 to-blue-600'
    }
    return colorMap[color] || 'from-gray-400 to-gray-600'
  }

  const getAuthorRole = (authorName: string) => {
    if (authorName.includes('Д-р')) return 'Лекар'
    if (authorName.includes('Психолог')) return 'Спортен психолог'
    if (authorName.includes('Нутриционист')) return 'Спортен нутриционист'
    if (authorName.includes('Педагог')) return 'Образователен консултант'
    if (authorName.includes('Физиотерапевт')) return 'Физиотерапевт'
    return 'Експерт'
  }

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {/* Placeholder Image Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClasses(categoryColor)} opacity-20`}></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          {article.isPremium ? (
            <div className="bg-gradient-to-r from-yellow-400/90 to-yellow-500/90 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-md">
              ⭐ ПРЕМИУМ
            </div>
          ) : (
            <div className="bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-md">
              ✅ БЕЗПЛАТНО
            </div>
          )}
        </div>

        {/* Support Type Badge */}
        <div className="absolute top-4 right-4">
          <div className={`bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border ${getColorClasses(categoryColor)}`}>
            <span className="mr-1">🎯</span>
            Родителска подкрепа
          </div>
        </div>

        {/* Image Placeholder Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">📖</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Article Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300">
          {article.title}
        </h3>

        {/* Article Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className={`px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-${categoryColor}-50 hover:${getColorClasses(categoryColor).split(' ')[0]} transition-colors duration-200`}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Info */}
        <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
            <span className="text-lg">👨‍⚕️</span>
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900 text-sm">{article.author.name}</div>
            <div className="text-xs text-gray-500">{getAuthorRole(article.author.name)}</div>
          </div>
        </div>

        {/* Article Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {article.readTime} мин
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDateBG(article.publishedAt)}
            </div>
          </div>

          {/* Helpfulness Rating */}
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">Полезност:</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star}
                  className={`w-3 h-3 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className={`mt-4 w-full bg-gradient-to-r ${getGradientClasses(categoryColor)} text-white font-medium py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300`}>
          <span className="flex items-center justify-center">
            <span className="mr-2">📚</span>
            Прочетете статията
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>

      {/* Hover Border Effect */}
      <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-${categoryColor}-200 transition-colors duration-300 pointer-events-none`}></div>
    </div>
  )
} 