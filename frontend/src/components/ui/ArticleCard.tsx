import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types'
import { ClockIcon, UserIcon, LockIcon } from 'lucide-react'

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 relative">
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {article.isPremium && (
          <div className="absolute top-2 right-2">
            <LockIcon className="w-5 h-5 text-amber-500 bg-white rounded-full p-1" />
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <UserIcon className="w-4 h-4" />
          <span>{article.author.name}</span>
          <span>•</span>
          <ClockIcon className="w-4 h-4" />
          <span>{article.readTime} мин</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link href={`/articles/${article.slug}`} className="hover:text-green-600 transition-colors">
            {article.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <time className="text-sm text-gray-500">
            {new Date(article.publishedAt).toLocaleDateString('bg-BG')}
          </time>
        </div>
      </div>
    </article>
  )
} 