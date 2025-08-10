'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  PlayIcon, 
  BookmarkIcon, 
  ShareIcon,
  ClockIcon,
  TagIcon,
  EyeIcon,
  HeartIcon,
  PrinterIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import PremiumCTA from '@/components/ui/PremiumCTA'
import { CoachArticle } from '@/types/articles'

interface TacticalTemplateProps {
  article: CoachArticle
}

// Video Player Component
function VideoPlayer({ video }: { video: NonNullable<CoachArticle['videos']>[0] }) {
  const getEmbedUrl = (url: string, platform: string) => {
    if (platform === 'youtube') {
      const videoId = url.split('v=')[1] || url.split('/').pop()
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    } else if (platform === 'vimeo') {
      const videoId = url.split('/').pop()
      return `https://player.vimeo.com/video/${videoId}?color=22c55e&title=0&byline=0&portrait=0`
    }
    return url
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden mb-6">
      <div className="aspect-video">
        <iframe
          src={getEmbedUrl(video.url, video.platform)}
          title={video.title}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      <div className="p-4 bg-gray-800">
        <h4 className="text-white font-medium mb-1">{video.title}</h4>
        {video.duration && (
          <div className="flex items-center text-gray-400 text-sm">
            <PlayIcon className="w-4 h-4 mr-1" />
            {video.duration}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TacticalTemplate({ article }: TacticalTemplateProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Tactical Background */}
      <div className="relative h-96 bg-gradient-to-br from-green-900 via-green-800 to-blue-900">
        <div className="absolute inset-0">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        
        {/* Tactical Grid Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex items-end h-full p-8">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                ТАКТИКА
              </span>
              <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                {article.difficulty}
              </span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                {article.ageGroup}
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {article.title}
            </h1>
            
            {article.subtitle && (
              <p className="text-xl text-gray-200 mb-6 leading-relaxed">
                {article.subtitle}
              </p>
            )}
            
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="font-bold text-sm">{article.author.name.charAt(0)}</span>
                </div>
                <div>
                  <span className="font-medium">{article.author.name}</span>
                  <div className="text-sm text-gray-300">Треньор експерт</div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>{article.readTime} мин четене</span>
              </div>
              <div className="flex items-center space-x-1">
                <EyeIcon className="w-4 h-4" />
                <span>2,543 прегледа</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8 p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isLiked ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm font-medium">127</span>
            </button>
            
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isBookmarked ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50'
              }`}
            >
              <BookmarkIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Запази</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <ShareIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Сподели</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <PrinterIcon className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none prose-green">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        {/* Videos Section */}
        {article.videos && article.videos.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-black mb-6 flex items-center">
              <PlayIcon className="w-6 h-6 mr-2 text-green-600" />
              Видео материали
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {article.videos.map((video, index) => (
                <VideoPlayer key={index} video={video} />
              ))}
            </div>
          </div>
        )}

        {/* Equipment Section */}
        {article.equipment && article.equipment.length > 0 && (
          <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-4">
              🛠️ Необходимо оборудване
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.equipment.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Premium CTA */}
        <PremiumCTA 
          zone="coach" 
          variant="highlight"
          title="🎯 Искаш повече тактически материали?"
          description="Получи достъп до библиотека с над 200+ тактически схеми, видео анализи и тренировъчни планове в Coach Zone Premium."
        />

        {/* Tags */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-black hover:bg-green-100 hover:text-green-800 transition-colors cursor-pointer"
              >
                <TagIcon className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}