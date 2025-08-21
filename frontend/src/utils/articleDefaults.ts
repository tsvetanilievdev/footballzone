// Default values and utility functions for article creation/editing

export interface CreateArticleData {
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImageUrl?: string
  authorId: string
  category: string
  subcategory?: string
  tags: string[]
  isPremium: boolean
  premiumReleaseDate?: Date
  isPermanentPremium: boolean
  isFeatured: boolean
  customOrder?: number
  templateId?: string
  seriesId?: string
  seriesPart?: number
  status: 'DRAFT' | 'PUBLISHED'
  seoTitle?: string
  seoDescription?: string
  zones: Array<{
    zone: 'READ' | 'COACH' | 'PLAYER' | 'PARENT'
    visible: boolean
    requiresSubscription: boolean
    freeAfterDate?: Date
  }>
}

/**
 * Default featured image URLs for different categories
 */
export const DEFAULT_FEATURED_IMAGES = {
  'NEWS': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600',
  'TRAINING': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600',
  'TACTICS': 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600',
  'PLAYERS': 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600',
  'COACHES': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600',
  'INTERVIEWS': 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600',
  'ANALYSIS': 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600',
  'YOUTH': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600',
  'FITNESS': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600',
  'PSYCHOLOGY': 'https://images.unsplash.com/photo-1594882645126-14020914d58d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600',
  'NUTRITION': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600',
  'DEFAULT': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600'
}

/**
 * Get default featured image based on category
 */
export function getDefaultFeaturedImage(category: string): string {
  return DEFAULT_FEATURED_IMAGES[category as keyof typeof DEFAULT_FEATURED_IMAGES] || DEFAULT_FEATURED_IMAGES.DEFAULT
}

/**
 * Calculate read time based on content
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const plainText = content.replace(/<[^>]*>/g, '') // Remove HTML tags
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

/**
 * Generate SEO title and description from article content
 */
export function generateSEO(title: string, excerpt: string, content: string) {
  const seoTitle = title.length > 60 ? title.substring(0, 57) + '...' : title
  
  let seoDescription = excerpt || ''
  if (!seoDescription && content) {
    const plainText = content.replace(/<[^>]*>/g, '')
    seoDescription = plainText.substring(0, 155) + (plainText.length > 155 ? '...' : '')
  }
  
  return {
    seoTitle: seoTitle + ' | FootballZone.bg',
    seoDescription
  }
}

/**
 * Create default article data structure for new articles
 */
export function createDefaultArticleData(
  authorId: string,
  zone: 'READ' | 'COACH' | 'PLAYER' | 'PARENT' = 'READ'
): Partial<CreateArticleData> {
  return {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImageUrl: getDefaultFeaturedImage('DEFAULT'),
    authorId,
    category: 'NEWS',
    subcategory: null,
    tags: [],
    isPremium: false,
    premiumReleaseDate: null,
    isPermanentPremium: false,
    isFeatured: false,
    customOrder: null,
    templateId: null,
    seriesId: null,
    seriesPart: null,
    status: 'DRAFT',
    seoTitle: null,
    seoDescription: null,
    zones: [
      {
        zone,
        visible: true,
        requiresSubscription: false,
        freeAfterDate: null
      }
    ]
  }
}

/**
 * Update article data with computed fields
 */
export function enrichArticleData(data: Partial<CreateArticleData>): CreateArticleData {
  const seo = generateSEO(data.title || '', data.excerpt || '', data.content || '')
  
  return {
    ...data,
    featuredImageUrl: data.featuredImageUrl || getDefaultFeaturedImage(data.category || 'DEFAULT'),
    seoTitle: data.seoTitle || seo.seoTitle,
    seoDescription: data.seoDescription || seo.seoDescription,
    zones: data.zones || [
      {
        zone: 'READ',
        visible: true,
        requiresSubscription: false,
        freeAfterDate: null
      }
    ]
  } as CreateArticleData
}

/**
 * Map frontend article data to backend API format
 */
export function mapToBackendFormat(articleData: any): CreateArticleData {
  return {
    title: articleData.title || '',
    slug: articleData.slug || '',
    excerpt: articleData.excerpt || '',
    content: articleData.content || '',
    featuredImageUrl: articleData.featuredImageUrl || articleData.featuredImage || getDefaultFeaturedImage(articleData.category),
    authorId: articleData.authorId || articleData.author?.id || '',
    category: articleData.category || 'NEWS',
    subcategory: articleData.subcategory || null,
    tags: articleData.tags || [],
    isPremium: articleData.isPremium || false,
    premiumReleaseDate: articleData.premiumReleaseDate || null,
    isPermanentPremium: articleData.isPermanentPremium || false,
    isFeatured: articleData.isFeatured || false,
    customOrder: articleData.customOrder || articleData.order || null,
    templateId: articleData.templateId || null,
    seriesId: articleData.seriesId || null,
    seriesPart: articleData.seriesPart || null,
    status: articleData.status || 'DRAFT',
    seoTitle: articleData.seoTitle || null,
    seoDescription: articleData.seoDescription || null,
    zones: articleData.zones?.map((zone: any) => ({
      zone: zone.zone,
      visible: zone.visible,
      requiresSubscription: zone.requiresSubscription,
      freeAfterDate: zone.freeAfterDate || null
    })) || [
      {
        zone: 'READ' as any,
        visible: true,
        requiresSubscription: false,
        freeAfterDate: null
      }
    ]
  }
}