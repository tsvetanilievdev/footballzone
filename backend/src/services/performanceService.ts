import redis from '@/config/redis'
import prisma from '@/config/database'
import { performance } from 'perf_hooks'

interface CacheStrategy {
  key: string
  ttl: number
  tags?: string[]
  compress?: boolean
}

interface QueryMetrics {
  query: string
  duration: number
  timestamp: Date
  table: string
  operation: string
}

interface PerformanceMetrics {
  requestCount: number
  averageResponseTime: number
  slowQueries: QueryMetrics[]
  cacheHitRate: number
  memoryUsage: NodeJS.MemoryUsage
  activeConnections: number
}

export class PerformanceService {
  private readonly METRICS_PREFIX = 'metrics:'
  private readonly CACHE_PREFIX = 'cache:'
  
  // Cache strategies for different data types
  private readonly CACHE_STRATEGIES = {
    articles: { ttl: 3600, tags: ['articles'] }, // 1 hour
    users: { ttl: 1800, tags: ['users'] }, // 30 minutes
    analytics: { ttl: 900, tags: ['analytics'] }, // 15 minutes
    series: { ttl: 3600, tags: ['series'] }, // 1 hour
    premium: { ttl: 1800, tags: ['premium'] }, // 30 minutes
    search: { ttl: 600, tags: ['search'] }, // 10 minutes
    static: { ttl: 86400, tags: ['static'] }, // 24 hours
    session: { ttl: 86400, tags: ['session'] } // 24 hours
  }

  private queryMetrics: QueryMetrics[] = []
  private requestMetrics: Array<{ timestamp: Date; duration: number }> = []

  // Enhanced caching with compression and tagging
  async setCache(
    key: string, 
    data: any, 
    strategy: keyof typeof this.CACHE_STRATEGIES = 'articles'
  ): Promise<void> {
    const config = this.CACHE_STRATEGIES[strategy]
    const fullKey = `${this.CACHE_PREFIX}${key}`
    
    let serializedData = JSON.stringify(data)
    
    // Compress large data
    if ((config as any).compress || serializedData.length > 10000) {
      const zlib = require('zlib')
      serializedData = zlib.deflateSync(serializedData).toString('base64')
      await redis.set(`${fullKey}:compressed`, serializedData, config.ttl)
    } else {
      await redis.set(fullKey, serializedData, config.ttl)
    }

    // Tag for cache invalidation
    if (config.tags) {
      for (const tag of config.tags) {
        await redis.client?.sadd(`${this.CACHE_PREFIX}tags:${tag}`, fullKey)
        await redis.client?.expire(`${this.CACHE_PREFIX}tags:${tag}`, config.ttl + 300) // Tags expire slightly later
      }
    }
  }

  // Enhanced cache retrieval with decompression
  async getCache(key: string): Promise<any | null> {
    const fullKey = `${this.CACHE_PREFIX}${key}`
    
    // Try compressed version first
    let cached = await redis.get(`${fullKey}:compressed`)
    if (cached) {
      const zlib = require('zlib')
      const decompressed = zlib.inflateSync(Buffer.from(cached, 'base64')).toString()
      return JSON.parse(decompressed)
    }

    // Try regular version
    cached = await redis.get(fullKey)
    if (cached) {
      return JSON.parse(cached)
    }

    return null
  }

  // Invalidate cache by tags
  async invalidateCacheByTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      const keys = await redis.smembers(`${this.CACHE_PREFIX}tags:${tag}`)
      if (keys.length > 0) {
        // Delete keys one by one to avoid spread operator issues
        for (const key of keys) {
          await redis.del(key)
        }
        await redis.del(`${this.CACHE_PREFIX}tags:${tag}`)
      }
    }
  }

  // Cache warmer for frequently accessed data
  async warmCache(): Promise<void> {
    console.log('Starting cache warm-up...')

    try {
      // Warm up popular articles
      const popularArticles = await prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { viewCount: 'desc' },
        take: 50,
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          zones: true
        }
      })

      for (const article of popularArticles) {
        await this.setCache(`article:${article.id}`, article, 'articles')
        await this.setCache(`article:slug:${article.slug}`, article, 'articles')
      }

      // Warm up categories
      const categories = await prisma.article.groupBy({
        by: ['category'],
        where: { status: 'PUBLISHED' },
        _count: { category: true }
      })
      await this.setCache('article:categories', categories, 'static')

      // Warm up series
      const activeSeries = await prisma.articleSeries.findMany({
        where: { status: 'ACTIVE' },
        take: 20,
        include: {
          articles: {
            where: { status: 'PUBLISHED' },
            orderBy: { seriesPart: 'asc' }
          }
        }
      })
      await this.setCache('series:active', activeSeries, 'series')

      console.log(`Cache warmed with ${popularArticles.length} articles and ${activeSeries.length} series`)
    } catch (error) {
      console.error('Cache warm-up failed:', error)
    }
  }

  // Database query optimization wrapper
  async optimizedQuery<T>(
    queryName: string,
    queryFn: () => Promise<T>,
    cacheKey?: string,
    cacheStrategy: keyof typeof this.CACHE_STRATEGIES = 'articles'
  ): Promise<T> {
    const startTime = performance.now()

    // Try cache first
    if (cacheKey) {
      const cached = await this.getCache(cacheKey)
      if (cached) {
        this.recordCacheHit()
        return cached as T
      }
      this.recordCacheMiss()
    }

    // Execute query with metrics
    try {
      const result = await queryFn()
      const duration = performance.now() - startTime

      // Record query metrics
      this.recordQueryMetrics({
        query: queryName,
        duration,
        timestamp: new Date(),
        table: this.extractTableFromQuery(queryName),
        operation: this.extractOperationFromQuery(queryName)
      })

      // Cache result if specified
      if (cacheKey && result) {
        await this.setCache(cacheKey, result, cacheStrategy)
      }

      return result
    } catch (error) {
      const duration = performance.now() - startTime
      console.error(`Query ${queryName} failed in ${duration.toFixed(2)}ms:`, error)
      throw error
    }
  }

  // Batch operations for better performance
  async batchUpdateArticleViews(viewUpdates: Array<{ articleId: string; increment: number }>): Promise<void> {
    const batchSize = 100
    const batches = []

    for (let i = 0; i < viewUpdates.length; i += batchSize) {
      batches.push(viewUpdates.slice(i, i + batchSize))
    }

    await Promise.all(
      batches.map(batch => 
        prisma.$transaction(
          batch.map(update => 
            prisma.article.update({
              where: { id: update.articleId },
              data: { viewCount: { increment: update.increment } }
            })
          )
        )
      )
    )

    // Invalidate article cache
    await this.invalidateCacheByTags(['articles'])
  }

  // Connection pool monitoring
  async getConnectionPoolStatus(): Promise<{
    activeConnections: number
    idleConnections: number
    totalConnections: number
    maxConnections: number
  }> {
    // This would integrate with Prisma's connection pool metrics
    // For now, we'll return mock data
    return {
      activeConnections: 12,
      idleConnections: 8,
      totalConnections: 20,
      maxConnections: 50
    }
  }

  // Request metrics tracking
  trackRequest(duration: number): void {
    this.requestMetrics.push({
      timestamp: new Date(),
      duration
    })

    // Keep only last 1000 requests
    if (this.requestMetrics.length > 1000) {
      this.requestMetrics = this.requestMetrics.slice(-1000)
    }
  }

  // Get performance metrics
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    // Recent requests
    const recentRequests = this.requestMetrics.filter(req => req.timestamp > oneHourAgo)
    
    // Cache hit rate calculation
    const cacheStats = await this.getCacheStatistics()
    
    // Slow queries (>100ms)
    const slowQueries = this.queryMetrics
      .filter(query => query.duration > 100 && query.timestamp > oneHourAgo)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10)

    return {
      requestCount: recentRequests.length,
      averageResponseTime: recentRequests.length > 0 
        ? recentRequests.reduce((sum, req) => sum + req.duration, 0) / recentRequests.length 
        : 0,
      slowQueries,
      cacheHitRate: cacheStats.hitRate,
      memoryUsage: process.memoryUsage(),
      activeConnections: (await this.getConnectionPoolStatus()).activeConnections
    }
  }

  // Preload critical data
  async preloadCriticalData(): Promise<void> {
    const criticalQueries = [
      // Most viewed articles
      () => prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { viewCount: 'desc' },
        take: 10,
        include: { author: { select: { name: true, avatarUrl: true } } }
      }),
      
      // Recent articles
      () => prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 20,
        include: { author: { select: { name: true, avatarUrl: true } } }
      }),

      // Active series
      () => prisma.articleSeries.findMany({
        where: { status: 'ACTIVE' },
        take: 10,
        include: { _count: { select: { articles: true } } }
      }),

      // Categories with counts
      () => prisma.article.groupBy({
        by: ['category'],
        where: { status: 'PUBLISHED' },
        _count: { category: true }
      })
    ]

    await Promise.all([
      this.optimizedQuery('popular-articles', criticalQueries[0] as any, 'articles:popular', 'articles'),
      this.optimizedQuery('recent-articles', criticalQueries[1] as any, 'articles:recent', 'articles'),
      this.optimizedQuery('active-series', criticalQueries[2] as any, 'series:active', 'series'),
      this.optimizedQuery('categories', criticalQueries[3] as any, 'articles:categories', 'static')
    ])
  }

  // Database index recommendations
  async analyzeQueryPerformance(): Promise<Array<{
    table: string
    recommendedIndex: string
    reason: string
    impact: 'high' | 'medium' | 'low'
  }>> {
    const recommendations: Array<{
      table: string
      recommendedIndex: string
      reason: string
      impact: 'high' | 'medium' | 'low'
    }> = []

    // Analyze slow queries
    const slowQueries = this.queryMetrics.filter(query => query.duration > 100)
    const tableQueries = slowQueries.reduce((acc, query) => {
      const table = query.table
      if (!acc[table]) acc[table] = []
      acc[table].push(query)
      return acc
    }, {} as Record<string, QueryMetrics[]>)

    for (const [table, queries] of Object.entries(tableQueries)) {
      if (table === 'articles') {
        if (queries.some(q => q.operation === 'findMany' && q.query.includes('category'))) {
          recommendations.push({
            table: 'articles',
            recommendedIndex: 'CREATE INDEX idx_articles_category_status ON articles(category, status)',
            reason: 'Frequent filtering by category and status',
            impact: 'high'
          })
        }

        if (queries.some(q => q.query.includes('viewCount'))) {
          recommendations.push({
            table: 'articles',
            recommendedIndex: 'CREATE INDEX idx_articles_viewcount_desc ON articles(view_count DESC)',
            reason: 'Frequent ordering by view count',
            impact: 'medium'
          })
        }
      }

      if (table === 'article_views') {
        recommendations.push({
          table: 'article_views',
          recommendedIndex: 'CREATE INDEX idx_article_views_article_user ON article_views(article_id, user_id)',
          reason: 'Frequent lookups for article views by user',
          impact: 'high'
        })
      }
    }

    return recommendations
  }

  // Cleanup old metrics
  async cleanupMetrics(): Promise<void> {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
    
    this.queryMetrics = this.queryMetrics.filter(metric => metric.timestamp > cutoffTime)
    this.requestMetrics = this.requestMetrics.filter(metric => metric.timestamp > cutoffTime)
    
    console.log(`Cleaned up old metrics. Remaining: ${this.queryMetrics.length} queries, ${this.requestMetrics.length} requests`)
  }

  // Private helper methods
  private recordQueryMetrics(metrics: QueryMetrics): void {
    this.queryMetrics.push(metrics)
    
    // Keep only last 1000 queries
    if (this.queryMetrics.length > 1000) {
      this.queryMetrics = this.queryMetrics.slice(-1000)
    }

    // Log slow queries
    if (metrics.duration > 500) {
      console.warn(`Slow query detected: ${metrics.query} took ${metrics.duration.toFixed(2)}ms`)
    }
  }

  private async recordCacheHit(): Promise<void> {
    await redis.client?.incr(`${this.METRICS_PREFIX}cache_hits`)
    await redis.client?.expire(`${this.METRICS_PREFIX}cache_hits`, 86400) // 24 hours
  }

  private async recordCacheMiss(): Promise<void> {
    await redis.client?.incr(`${this.METRICS_PREFIX}cache_misses`)
    await redis.client?.expire(`${this.METRICS_PREFIX}cache_misses`, 86400) // 24 hours
  }

  private async getCacheStatistics(): Promise<{ hitRate: number; hits: number; misses: number }> {
    const hits = parseInt(await redis.get(`${this.METRICS_PREFIX}cache_hits`) || '0')
    const misses = parseInt(await redis.get(`${this.METRICS_PREFIX}cache_misses`) || '0')
    const total = hits + misses
    const hitRate = total > 0 ? (hits / total) * 100 : 0

    return { hitRate, hits, misses }
  }

  private extractTableFromQuery(queryName: string): string {
    if (queryName.includes('article')) return 'articles'
    if (queryName.includes('user')) return 'users'
    if (queryName.includes('series')) return 'article_series'
    if (queryName.includes('view')) return 'article_views'
    return 'unknown'
  }

  private extractOperationFromQuery(queryName: string): string {
    if (queryName.includes('find')) return 'findMany'
    if (queryName.includes('create')) return 'create'
    if (queryName.includes('update')) return 'update'
    if (queryName.includes('delete')) return 'delete'
    return 'unknown'
  }
}

export const performanceService = new PerformanceService()

// Auto-cleanup metrics every hour
setInterval(() => {
  performanceService.cleanupMetrics()
}, 60 * 60 * 1000)