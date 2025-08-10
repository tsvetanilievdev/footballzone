'use client'

import Image from 'next/image'
import Link from 'next/link'
import { 
  PlayIcon, 
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import PremiumCTA from '@/components/ui/PremiumCTA'
import { CoachArticle } from '@/types/articles'

interface TrainingTemplateProps {
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

export default function TrainingTemplate({ article }: TrainingTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/coach" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Назад към Coach Zone
          </Link>
        </div>
      </div>

      {/* Training Focus Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center space-x-3 mb-4">
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold">
              ТРЕНИРОВКА
            </span>
            <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
              {article.difficulty}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{article.readTime}</div>
              <div className="text-sm opacity-90">минути четене</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{article.ageGroup}</div>
              <div className="text-sm opacity-90">възрастова група</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">
                {article.equipment ? article.equipment.length : 0}
              </div>
              <div className="text-sm opacity-90">елемента екипировка</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Featured Image */}
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={article.featuredImage}
            alt={article.title}
            width={800}
            height={400}
            className="w-full h-80 object-cover"
          />
        </div>

        {/* Training Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <article className="prose prose-lg max-w-none prose-green">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>
        </div>

        {/* Video Drills */}
        {article.videos && article.videos.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h3 className="text-2xl font-bold text-black mb-6 flex items-center">
              <PlayIcon className="w-6 h-6 mr-2 text-green-600" />
              Тренировъчни упражнения
            </h3>
            <div className="space-y-6">
              {article.videos.map((video, index) => (
                <VideoPlayer key={index} video={video} />
              ))}
            </div>
          </div>
        )}

        {/* Equipment Checklist */}
        {article.equipment && article.equipment.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h3 className="text-xl font-bold text-black mb-4">
              ✅ Списък с екипировка
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {article.equipment.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium CTA */}
        <PremiumCTA 
          zone="coach" 
          variant="default"
          title="🏃‍♂️ Търсиш повече тренировъчни планове?"
          description="Открий библиотека с над 500+ упражнения, сесийни планове и методики в Coach Zone Premium."
        />
      </div>
    </div>
  )
}