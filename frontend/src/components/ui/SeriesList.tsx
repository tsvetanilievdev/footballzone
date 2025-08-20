'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BookOpenIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { Series } from '@/types'
import { formatDateBG } from '@/utils/dateUtils'

interface SeriesListProps {
  series: Series[]
  className?: string
}

export default function SeriesList({ series, className = '' }: SeriesListProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          📚 Поредици статии
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Открийте нашите тематични поредици с дълбочинни анализи и експертни съвети
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {series.map((s) => (
          <SeriesCard key={s.slug} series={s} />
        ))}
      </div>
    </div>
  )
}

interface SeriesCardProps {
  series: Series
}

function SeriesCard({ series }: SeriesCardProps) {

  return (
    <Link href={`/read/series/${series.slug}`}>
      <div className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={series.image}
            alt={series.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Article count badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-900">
            {series.articleCount} статии
          </div>
          
          {/* Series title overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-bold text-lg leading-tight group-hover:text-green-200 transition-colors">
              {series.name}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {series.description}
          </p>

          {/* Meta info */}
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="w-4 h-4" />
              <span>{series.articleCount} статии</span>
            </div>
            
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>Обновено: {formatDateBG(series.lastUpdated)}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {series.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
            {series.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                +{series.tags.length - 3}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-600 group-hover:text-green-700 transition-colors">
                Прегледай поредицата
              </span>
              <svg 
                className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 