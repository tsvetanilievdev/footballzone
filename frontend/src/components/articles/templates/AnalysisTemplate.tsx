'use client'

import Image from 'next/image'
import Link from 'next/link'
import { 
  PlayIcon, 
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import PremiumCTA from '@/components/ui/PremiumCTA'
import { CoachArticle } from '@/types/articles'

interface AnalysisTemplateProps {
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

export default function AnalysisTemplate({ article }: AnalysisTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header */}
      <div className="border-b bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/coach" className="text-black hover:text-gray-800 flex items-center">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Coach Zone
            </Link>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{new Date(article.publishedAt).toLocaleDateString('bg-BG')}</span>
              <span>•</span>
              <span>{article.readTime} мин</span>
            </div>
          </div>
          
          <div className="max-w-3xl">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              АНАЛИЗ
            </span>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-black mb-4 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-black leading-relaxed">
              {article.excerpt}
            </p>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Image */}
            <div className="mb-10 rounded-lg overflow-hidden">
              <Image
                src={article.featuredImage}
                alt={article.title}
                width={800}
                height={450}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Article Content */}
            <article className="prose prose-xl max-w-none prose-gray">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </article>

            {/* Analysis Videos */}
            {article.videos && article.videos.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-black mb-8 pb-3 border-b">
                  📊 Видео анализ
                </h3>
                <div className="space-y-8">
                  {article.videos.map((video, index) => (
                    <VideoPlayer key={index} video={video} />
                  ))}
                </div>
              </div>
            )}

            {/* Premium CTA */}
            <div className="mt-12">
              <PremiumCTA 
                zone="coach" 
                variant="minimal"
                title="📈 Искаш дълбочинни анализи?"
                description="Получи достъп до професионални мачови анализи, статистики и експертни прогнози в Coach Zone Premium."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Author Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">
                    {article.author.name.charAt(0)}
                  </span>
                </div>
                <h4 className="font-bold text-black mb-2">{article.author.name}</h4>
                <p className="text-sm text-black">
                  {article.author.bio || 'Професионален футболен анализатор с над 10 години опит.'}
                </p>
              </div>
            </div>

            {/* Article Stats */}
            <div className="bg-white border rounded-lg p-6 mb-8">
              <h4 className="font-bold text-black mb-4">Статистика</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-black">Прегледи</span>
                  <span className="font-medium">3,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Споделяния</span>
                  <span className="font-medium">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Харесвания</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Коментари</span>
                  <span className="font-medium">23</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <h4 className="font-bold text-black mb-4">Тагове</h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm hover:bg-green-100 hover:text-green-700 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}