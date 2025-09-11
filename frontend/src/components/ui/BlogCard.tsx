import Link from 'next/link'
import NextImage from 'next/image'
import { Article } from '@/types'
import { UserIcon, ChatBubbleLeftIcon, CameraIcon, PlayIcon } from '@heroicons/react/24/outline'
import { formatDate } from '@/utils/dateUtils'

interface BlogCardProps {
  article: Article
  showVideo?: boolean
  showPhoto?: boolean
}

export default function BlogCard({ article, showVideo = false, showPhoto = false }: BlogCardProps) {
  const { day, month } = formatDate(article.publishedAt)

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      {/* Image with Date Badge */}
      <div className="relative">
        <NextImage
          src={article.featuredImageUrl || article.featuredImage || '/images/placeholder-article.jpg'}
          alt={article.title}
          width={400}
          height={208}
          className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Date Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-green-600 text-white text-center rounded-lg px-2.5 py-1.5 shadow-lg">
            <div className="text-lg font-bold leading-none">{day}</div>
            <div className="text-xs font-medium uppercase">{month}</div>
          </div>
        </div>

        {/* Media Icons */}
        <div className="absolute bottom-3 right-3 flex space-x-2">
          {showVideo && (
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-lg group cursor-pointer hover:bg-green-700 transition-colors">
              <PlayIcon className="w-4 h-4 text-white ml-0.5" />
            </div>
          )}
          {showPhoto && (
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-lg group cursor-pointer hover:bg-green-700 transition-colors">
              <CameraIcon className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h2 className="text-lg font-bold text-black mb-2 group-hover:text-green-600 transition-colors duration-300 leading-tight line-clamp-2">
          <Link href={`/read/${article.slug}`}>
            {article.title}
          </Link>
        </h2>

        {/* Meta Info */}
        <div className="flex items-center space-x-3 text-sm text-black mb-3">
          <div className="flex items-center space-x-1">
            <UserIcon className="w-4 h-4" />
            <span className="text-green-600">{article.author.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ChatBubbleLeftIcon className="w-4 h-4" />
            <span className="text-green-600">Един коментар</span>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-black leading-relaxed mb-4 text-sm line-clamp-3">
          {article.excerpt}
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-600 font-medium">Uncategorized</span>
            </div>
            <div className="mt-1">
              <span className="text-xs text-green-700 font-medium">Tags: </span>
              {article.tags.slice(0, 3).map((tag, index) => (
                <span key={tag} className="text-xs text-green-700">
                  {tag}
                  {index < Math.min(article.tags.length, 3) - 1 && ', '}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Read More Button */}
        <div className="pt-3 border-t border-gray-100">
          <Link
            href={`/read/${article.slug}`}
            className="inline-block px-6 py-2.5 bg-green-100 text-green-800 font-medium text-xs rounded hover:bg-green-200 hover:text-green-900 transition-colors duration-300 uppercase tracking-wide"
          >
            READ MORE
          </Link>
        </div>
      </div>
    </article>
  )
} 