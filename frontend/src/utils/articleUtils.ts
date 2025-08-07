import { Article } from '@/types'

/**
 * Utility functions for article management and optimization
 */

// Article filtering and search utilities
export const filterArticlesByZone = (articles: Article[], zone: string): Article[] => {
  return articles.filter(article => {
    const zoneSettings = article.zoneSettings?.[zone as keyof typeof article.zoneSettings]
    return zoneSettings?.visible === true
  })
}

export const searchArticles = (articles: Article[], searchTerm: string): Article[] => {
  if (!searchTerm.trim()) return articles
  
  const term = searchTerm.toLowerCase()
  return articles.filter(article => 
    article.title.toLowerCase().includes(term) ||
    article.excerpt.toLowerCase().includes(term) ||
    article.content.toLowerCase().includes(term) ||
    article.tags.some(tag => tag.toLowerCase().includes(term)) ||
    article.author.name.toLowerCase().includes(term)
  )
}

export const filterArticlesByCategory = (articles: Article[], category: string): Article[] => {
  if (category === 'all') return articles
  return articles.filter(article => article.category === category)
}

export const sortArticles = (articles: Article[], sortBy: 'date' | 'title' | 'views' | 'order' = 'order'): Article[] => {
  return [...articles].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      case 'views':
        return (b.viewCount || 0) - (a.viewCount || 0)
      case 'order':
      default:
        return (a.order || 0) - (b.order || 0)
    }
  })
}

// Article content utilities
export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export const extractExcerpt = (content: string, maxLength: number = 160): string => {
  const plainText = content.replace(/<[^>]*>/g, '')
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength).trim() + '...'
    : plainText
}

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Article validation
export const validateArticle = (article: Partial<Article>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!article.title?.trim()) {
    errors.push('Заглавието е задължително')
  }

  if (!article.content?.trim()) {
    errors.push('Съдържанието е задължително')
  }

  if (!article.excerpt?.trim()) {
    errors.push('Кратките описание е препоръчително')
  }

  if (!article.category) {
    errors.push('Категорията е задължителна')
  }

  if (!article.featuredImage?.trim()) {
    errors.push('Изображението е препоръчително')
  }

  if (!article.tags || article.tags.length === 0) {
    errors.push('Поне един таг е препоръчителен')
  }

  // Validate zone settings
  const hasVisibleZone = article.zoneSettings && 
    Object.values(article.zoneSettings).some(settings => settings?.visible)
  
  if (!hasVisibleZone) {
    errors.push('Статията трябва да бъде видима в поне една зона')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// SEO utilities
export const generateSEOKeywords = (article: Article): string[] => {
  const keywords: string[] = []
  
  // Add tags
  keywords.push(...article.tags)
  
  // Add category
  keywords.push(article.category)
  
  // Add subcategory if exists
  if (article.subcategory) {
    keywords.push(article.subcategory)
  }
  
  // Extract keywords from title (words longer than 3 characters)
  const titleWords = article.title
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !/^(и|на|за|от|до|във|при|под|над)$/.test(word))
  
  keywords.push(...titleWords)
  
  return [...new Set(keywords)] // Remove duplicates
}

// Analytics utilities
export const getArticleStats = (article: Article) => {
  return {
    readTime: calculateReadTime(article.content),
    wordCount: article.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length,
    characterCount: article.content.replace(/<[^>]*>/g, '').length,
    tagCount: article.tags.length,
    visibleZones: Object.entries(article.zoneSettings || {}).filter(([, settings]) => settings?.visible).length,
    isPremiumInAnyZone: Object.values(article.zoneSettings || {}).some(settings => settings?.requiresSubscription),
    seoScore: calculateSEOScore(article)
  }
}

const calculateSEOScore = (article: Article): number => {
  let score = 0
  
  // Title (20 points)
  if (article.title && article.title.length >= 10 && article.title.length <= 60) {
    score += 20
  } else if (article.title) {
    score += 10
  }
  
  // Excerpt (15 points)
  if (article.excerpt && article.excerpt.length >= 50 && article.excerpt.length <= 160) {
    score += 15
  } else if (article.excerpt) {
    score += 7
  }
  
  // Content length (15 points)
  const wordCount = article.content.replace(/<[^>]*>/g, '').split(/\s+/).length
  if (wordCount >= 300) {
    score += 15
  } else if (wordCount >= 150) {
    score += 10
  } else if (wordCount >= 50) {
    score += 5
  }
  
  // Tags (10 points)
  if (article.tags.length >= 3 && article.tags.length <= 8) {
    score += 10
  } else if (article.tags.length > 0) {
    score += 5
  }
  
  // Featured image (10 points)
  if (article.featuredImage) {
    score += 10
  }
  
  // Category and subcategory (10 points)
  if (article.category) {
    score += 5
  }
  if (article.subcategory) {
    score += 5
  }
  
  // Headings in content (10 points)
  const headingCount = (article.content.match(/<h[1-6][^>]*>/gi) || []).length
  if (headingCount >= 2) {
    score += 10
  } else if (headingCount >= 1) {
    score += 5
  }
  
  // Internal links (5 points)
  const linkCount = (article.content.match(/<a[^>]*href[^>]*>/gi) || []).length
  if (linkCount >= 2) {
    score += 5
  } else if (linkCount >= 1) {
    score += 3
  }
  
  // Images in content (5 points)
  const imageCount = (article.content.match(/<img[^>]*>/gi) || []).length
  if (imageCount >= 1) {
    score += 5
  }
  
  return Math.min(score, 100) // Cap at 100
}

// Bulk operations
export const bulkUpdateArticles = (articles: Article[], updates: Partial<Article>): Article[] => {
  return articles.map(article => ({
    ...article,
    ...updates
  }))
}

export const bulkToggleZoneVisibility = (articles: Article[], zone: string, visible: boolean): Article[] => {
  return articles.map(article => ({
    ...article,
    zoneSettings: {
      ...article.zoneSettings,
      [zone]: {
        ...article.zoneSettings?.[zone as keyof typeof article.zoneSettings],
        visible
      }
    }
  }))
}

// Export utilities
export const exportArticlesToCSV = (articles: Article[]): string => {
  const headers = ['ID', 'Title', 'Category', 'Author', 'Published Date', 'Read Time', 'Tags', 'Is Premium', 'View Count']
  
  const csvData = articles.map(article => [
    article.id,
    `"${article.title}"`,
    article.category,
    `"${article.author.name}"`,
    new Date(article.publishedAt).toLocaleDateString(),
    article.readTime,
    `"${article.tags.join(', ')}"`,
    article.isPremium ? 'Yes' : 'No',
    article.viewCount || 0
  ])
  
  return [headers, ...csvData].map(row => row.join(',')).join('\n')
}

// Performance utilities
export const memoizeArticleFilters = (() => {
  const cache = new Map<string, Article[]>()
  
  return (articles: Article[], filters: any): Article[] => {
    const cacheKey = JSON.stringify(filters)
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!
    }
    
    // Apply filters (implement your filtering logic)
    let filtered = articles
    
    if (filters.zone) {
      filtered = filterArticlesByZone(filtered, filters.zone)
    }
    
    if (filters.category && filters.category !== 'all') {
      filtered = filterArticlesByCategory(filtered, filters.category)
    }
    
    if (filters.search) {
      filtered = searchArticles(filtered, filters.search)
    }
    
    if (filters.sortBy) {
      filtered = sortArticles(filtered, filters.sortBy)
    }
    
    cache.set(cacheKey, filtered)
    
    // Clear cache if it gets too large
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }
    
    return filtered
  }
})()