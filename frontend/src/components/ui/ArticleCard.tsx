import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types'
import { ClockIcon, UserIcon, LockIcon, StarIcon, TrendingUpIcon } from 'lucide-react'
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
                <div className="absolute top-1 right-1">
                  <LockIcon className="w-3 h-3 text-warning bg-white rounded-full p-0.5" />
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
        size={variant === 'featured' ? 'lg' : 'default'} 
        className={cn(
          'h-full overflow-hidden',
          variant === 'featured' && 'border-2 border-primary-200'
        )}
      >
        <div className={cn(
          'relative overflow-hidden',
          variant === 'featured' ? 'aspect-[16/10]' : 'aspect-[16/9]'
        )}>
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-normal"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-normal" />
          
          {/* Badges overlay */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="flex gap-2">
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
                <Badge variant="outline" size="sm" className="backdrop-blur-sm bg-white/90">
                  <LockIcon className="w-3 h-3 mr-1" />
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
        </div>
        
        <div className={cn(
          'p-4 flex flex-col',
          variant === 'featured' ? 'gap-4' : 'gap-3'
        )}>
          {/* Article metadata */}
          <div className="flex items-center gap-3 text-xs text-black">
            <div className="flex items-center gap-1">
              <UserIcon className="w-3 h-3" />
              <span>{article.author.name}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              <span>{article.readTime} мин четене</span>
            </div>
            <span>•</span>
            <time>{new Date(article.publishedAt).toLocaleDateString('bg-BG')}</time>
          </div>
          
          {/* Article title */}
          <h3 className={cn(
            'font-semibold text-heading line-clamp-2 group-hover:text-primary transition-colors duration-normal',
            variant === 'featured' ? 'text-xl' : 'text-lg'
          )}>
            <Link href={getArticleLink()}>
              {article.title}
            </Link>
          </h3>
          
          {/* Article excerpt */}
          <p className={cn(
            'text-black line-clamp-3 flex-1',
            variant === 'featured' ? 'text-base' : 'text-sm'
          )}>
            {article.excerpt}
          </p>
          
          {/* Tags and date */}
          <div className="flex items-center justify-between pt-2 border-t border-card-border">
            <div className="flex flex-wrap gap-1.5">
              {article.tags.slice(0, variant === 'featured' ? 3 : 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  size="sm"
                  className="hover:bg-primary-100 hover:text-primary transition-colors"
                >
                  {tag}
                </Badge>
              ))}
              {article.tags.length > (variant === 'featured' ? 3 : 2) && (
                <Badge variant="outline" size="sm">
                  +{article.tags.length - (variant === 'featured' ? 3 : 2)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </article>
  )
} 