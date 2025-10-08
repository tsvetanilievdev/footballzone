import Link from 'next/link'
import NextImage from 'next/image'
import { Article } from '@/types'
import { UserIcon, ChatBubbleLeftIcon, CameraIcon, PlayIcon } from '@heroicons/react/24/outline'
import { LockClosedIcon } from '@heroicons/react/24/solid'
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
      <div className="relative overflow-hidden">
        <NextImage
          src={article.featuredImageUrl || article.featuredImage || '/images/placeholder-article.jpg'}
          alt={article.title}
          width={400}
          height={208}
          className="w-full h-48 sm:h-52 object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-105"
        />

        {/* Date Badge */}
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-br from-green-500 to-green-700 text-white text-center rounded-xl px-3 py-2 shadow-xl backdrop-blur-sm">
            <div className="text-xl font-extrabold leading-none">{day}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{month}</div>
          </div>
        </div>

        {/* Premium Badge */}
        {article.isPremium && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-gradient-to-br from-amber-500/90 to-amber-600/90 text-white rounded-lg px-3 py-2 shadow-xl backdrop-blur-md flex items-center gap-1.5">
              <LockClosedIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wide">Premium</span>
            </div>
          </div>
        )}

        {/* Media Icons */}
        <div className="absolute bottom-3 right-3 flex space-x-2 z-10">
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

        {/* Full title overlay on image hover */}
        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
          <h2
            className={`font-bold text-center leading-tight ${
              article.title.length > 60 ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'
            }`}
            style={{ color: '#ffffff' }}
          >
            {article.title}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col h-[calc(100%-13rem)]">
        {/* Meta Info */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <UserIcon className="w-3.5 h-3.5" />
            <span>{article.author.name}</span>
          </div>
          <span className="text-gray-400">•</span>
          <div className="flex items-center gap-1">
            <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
            <span>Един коментар</span>
          </div>
        </div>

        {/* Title - Fixed height - Hidden on hover */}
        <h2 className="text-base font-bold text-black group-hover:opacity-0 transition-opacity duration-300 leading-tight line-clamp-2 min-h-[2.5rem] mb-3">
          <Link href={`/read/${article.slug}`}>
            {article.title}
          </Link>
        </h2>

        {/* Excerpt - Fixed height */}
        <p className="text-gray-700 leading-relaxed mb-3 text-sm line-clamp-2 min-h-[2.5rem]">
          {article.excerpt}
        </p>

        {/* Spacer to push content to bottom */}
        <div className="flex-1" />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5">
              {article.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md font-medium">
                  {tag}
                </span>
              ))}
              {article.tags.length > 2 && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                  +{article.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Read More Button */}
        <div className="pt-3 border-t border-gray-100">
          <Link
            href={`/read/${article.slug}`}
            className="inline-block px-5 py-2 bg-green-600 text-white font-medium text-sm rounded-md hover:bg-green-700 transition-colors duration-300"
          >
            Прочети повече
          </Link>
        </div>
      </div>
    </article>
  )
} 