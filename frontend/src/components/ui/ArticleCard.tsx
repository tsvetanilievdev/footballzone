import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types'
import { ClockIcon, UserIcon, StarIcon, TrendingUpIcon, Crown } from 'lucide-react'
import { Card } from './Card'
import { Badge } from './Badge'
import { cn } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  zone?: 'read' | 'coach' | 'player' | 'parent' | 'admin'
  variant?: 'default' | 'featured' | 'compact'
  showZoneBadge?: boolean
}

const zoneColors = {
  read: 'bg-zones-read',
  coach: 'bg-zones-coach', 
  player: 'bg-zones-player',
  parent: 'bg-zones-parent',
  admin: 'bg-zones-admin',
}

export default function ArticleCard({ 
  article, 
  zone, 
  variant = 'default',
  showZoneBadge = false 
}: ArticleCardProps) {
  const getArticleLink = () => {
    if (zone) {
      return `/${zone}/${article.slug}`
    }
    return `/articles/${article.slug}`
  }

  if (variant === 'compact') {
    return (
      <Link href={getArticleLink()}>
        <Card variant="interactive" size="sm" className="h-full">
          <div className="flex gap-4">
            <div className="relative w-20 h-16 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
              />
              {article.isPremium && (
                <div className="absolute top-1 right-1 bg-gradient-to-br from-amber-500/90 to-amber-600/90 text-white rounded px-1.5 py-0.5 flex items-center gap-0.5 shadow-md backdrop-blur-sm">
                  <Crown className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase">Premium</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-heading line-clamp-2 mb-1">
                {article.title}
              </h4>
              <div className="flex items-center text-xs text-black gap-2">
                <span>{article.readTime} мин</span>
                <span>•</span>
                <time>{new Date(article.publishedAt).toLocaleDateString('bg-BG')}</time>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <article className="group h-full">
      <Card
        variant="interactive"
        size="default"
        className={cn(
          'h-full overflow-hidden flex flex-col',
          variant === 'featured' && 'border-2 border-primary-200'
        )}
      >
        <div className="relative overflow-hidden aspect-[16/9]">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-105"
          />

          {/* Badges overlay */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
            <div className="flex gap-2 flex-wrap">
              {article.isFeatured && (
                <Badge variant="warning" size="sm" className="backdrop-blur-sm">
                  <StarIcon className="w-3 h-3 mr-1" />
                  Препоръчана
                </Badge>
              )}
              {showZoneBadge && zone && (
                <Badge variant={zone} size="sm" className="backdrop-blur-sm">
                  {zone.charAt(0).toUpperCase() + zone.slice(1)}
                </Badge>
              )}
              {article.isPremium && (
                <Badge
                  variant="warning"
                  size="sm"
                  className="backdrop-blur-md bg-gradient-to-br from-amber-500/90 to-amber-600/90 text-white border-amber-600/50 shadow-lg"
                >
                  <Crown className="w-3.5 h-3.5 mr-1" />
                  Premium
                </Badge>
              )}
            </div>

            {variant === 'featured' && (
              <Badge variant="info" size="sm" className="backdrop-blur-sm">
                <TrendingUpIcon className="w-3 h-3 mr-1" />
                Топ
              </Badge>
            )}
          </div>

          {/* Full title overlay on image hover */}
          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
            <h3
              className={cn(
                "font-bold text-center leading-tight",
                article.title.length > 60 ? "text-base sm:text-lg" : "text-xl sm:text-2xl"
              )}
              style={{ color: '#ffffff' }}
            >
              {article.title}
            </h3>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3 flex-1">
          {/* Article metadata */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <UserIcon className="w-3.5 h-3.5" />
              <span>{article.author.name}</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3.5 h-3.5" />
              <span>{article.readTime} мин</span>
            </div>
          </div>

          {/* Article title - Fixed height for consistency - Hidden on hover */}
          <h3 className="font-bold text-heading group-hover:opacity-0 transition-opacity duration-normal text-base leading-tight line-clamp-2 min-h-[2.5rem]">
            <Link href={getArticleLink()}>
              {article.title}
            </Link>
          </h3>

          {/* Article excerpt - Fixed height */}
          <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {article.excerpt}
          </p>

          {/* Spacer to push footer to bottom */}
          <div className="flex-1" />

          {/* Tags footer */}
          <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100">
            {article.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                size="sm"
                className="hover:bg-primary-100 hover:text-primary transition-colors text-xs"
              >
                {tag}
              </Badge>
            ))}
            {article.tags.length > 2 && (
              <Badge variant="outline" size="sm" className="text-xs">
                +{article.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </article>
  )
} 