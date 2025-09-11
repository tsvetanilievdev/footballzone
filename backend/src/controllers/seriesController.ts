import { Request, Response } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import { seriesService } from '@/services/seriesService'
import { SeriesCategory, SeriesStatus } from '@prisma/client'

// Get all series with filtering
export const getSeries = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    category,
    status = 'ACTIVE',
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query

  const filters = {
    page: parseInt(page as string),
    limit: Math.min(parseInt(limit as string), 50), // Max 50 items per page
    category: category as SeriesCategory,
    status: status as SeriesStatus,
    search: search as string,
    sortBy: sortBy as 'createdAt' | 'updatedAt' | 'name' | 'articlesCount',
    sortOrder: sortOrder as 'asc' | 'desc'
  }

  const result = await seriesService.getSeries(filters)

  res.json({
    success: true,
    data: result.series,
    pagination: result.pagination
  })
})

// Get series by ID or slug
export const getSeriesById = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = req.params
  const includeArticles = req.query.articles !== 'false'

  const series = await seriesService.getSeriesById(identifier, includeArticles)

  res.json({
    success: true,
    data: series
  })
})

// Create new series (Admin/Coach only)
export const createSeries = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    slug,
    description,
    coverImageUrl,
    category,
    totalPlannedArticles,
    tags
  } = req.body

  const seriesData = {
    name,
    slug,
    description,
    coverImageUrl,
    category: category as SeriesCategory,
    totalPlannedArticles,
    tags
  }

  const series = await seriesService.createSeries(seriesData)

  res.status(201).json({
    success: true,
    message: 'Series created successfully',
    data: series
  })
})

// Update series (Admin/Coach only)
export const updateSeries = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const {
    name,
    slug,
    description,
    coverImageUrl,
    category,
    status,
    totalPlannedArticles,
    tags
  } = req.body

  const updateData = {
    name,
    slug,
    description,
    coverImageUrl,
    category: category as SeriesCategory,
    status: status as SeriesStatus,
    totalPlannedArticles,
    tags
  }

  // Remove undefined values
  Object.keys(updateData).forEach(key => {
    if (updateData[key as keyof typeof updateData] === undefined) {
      delete updateData[key as keyof typeof updateData]
    }
  })

  const series = await seriesService.updateSeries(id, updateData)

  res.json({
    success: true,
    message: 'Series updated successfully',
    data: series
  })
})

// Delete series (Admin only)
export const deleteSeries = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const result = await seriesService.deleteSeries(id)

  res.json({
    success: true,
    message: result.message
  })
})

// Add article to series (Admin/Coach only)
export const addArticleToSeries = asyncHandler(async (req: Request, res: Response) => {
  const { seriesId, articleId } = req.params
  const { seriesPart } = req.body

  if (!seriesPart || seriesPart < 1) {
    return res.status(400).json({
      success: false,
      message: 'Series part must be a positive number'
    })
  }

  const article = await seriesService.addArticleToSeries(
    seriesId,
    articleId,
    parseInt(seriesPart)
  )

  return res.json({
    success: true,
    message: 'Article added to series successfully',
    data: article
  })
})

// Remove article from series (Admin/Coach only)
export const removeArticleFromSeries = asyncHandler(async (req: Request, res: Response) => {
  const { articleId } = req.params

  const article = await seriesService.removeArticleFromSeries(articleId)

  return res.json({
    success: true,
    message: 'Article removed from series successfully',
    data: article
  })
})

// Reorder articles in series (Admin/Coach only)
export const reorderSeriesArticles = asyncHandler(async (req: Request, res: Response) => {
  const { seriesId } = req.params
  const { articleOrders } = req.body

  if (!Array.isArray(articleOrders)) {
    return res.status(400).json({
      success: false,
      message: 'Article orders must be an array'
    })
  }

  // Validate article orders format
  const isValidFormat = articleOrders.every(order => 
    order.articleId && 
    typeof order.seriesPart === 'number' && 
    order.seriesPart > 0
  )

  if (!isValidFormat) {
    return res.status(400).json({
      success: false,
      message: 'Each article order must have articleId and seriesPart (positive number)'
    })
  }

  const series = await seriesService.reorderSeriesArticles(seriesId, articleOrders)

  return res.json({
    success: true,
    message: 'Articles reordered successfully',
    data: series
  })
})

// Get user progress in series (Authenticated users)
export const getSeriesProgress = asyncHandler(async (req: Request, res: Response) => {
  const { seriesId } = req.params
  const userId = req.user!.id!

  const progress = await seriesService.getSeriesProgress(seriesId, userId)

  return res.json({
    success: true,
    data: progress
  })
})

// Get series recommendations for user (Authenticated users)
export const getSeriesRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id!
  const { limit = 5 } = req.query

  const recommendations = await seriesService.getSeriesRecommendations(
    userId,
    Math.min(parseInt(limit as string), 20) // Max 20 recommendations
  )

  return res.json({
    success: true,
    data: recommendations
  })
})

// Get series analytics (Admin only)
export const getSeriesAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { seriesId } = req.params

  const analytics = await seriesService.getSeriesAnalytics(seriesId)

  return res.json({
    success: true,
    data: analytics
  })
})

// Get series by category (Public)
export const getSeriesByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params
  const { page = 1, limit = 10 } = req.query

  const filters = {
    page: parseInt(page as string),
    limit: Math.min(parseInt(limit as string), 50),
    category: category.toUpperCase() as SeriesCategory,
    status: 'ACTIVE' as SeriesStatus,
    sortBy: 'createdAt' as const,
    sortOrder: 'desc' as const
  }

  const result = await seriesService.getSeries(filters)

  return res.json({
    success: true,
    data: result.series,
    pagination: result.pagination
  })
})

// Get popular series (Public)
export const getPopularSeries = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 10 } = req.query

  const filters = {
    page: 1,
    limit: Math.min(parseInt(limit as string), 20),
    status: 'ACTIVE' as SeriesStatus,
    sortBy: 'articlesCount' as const,
    sortOrder: 'desc' as const
  }

  const result = await seriesService.getSeries(filters)

  // Filter and enhance with popularity metrics
  const popularSeries = result.series
    .filter(series => series.articlesCount > 0)
    .map(series => ({
      ...series,
      popularityScore: series.articlesCount * series.estimatedReadTime // Simple popularity metric
    }))
    .sort((a, b) => b.popularityScore - a.popularityScore)

  return res.json({
    success: true,
    data: popularSeries
  })
})

// Continue series reading (Authenticated users)
export const continueSeriesReading = asyncHandler(async (req: Request, res: Response) => {
  const { seriesId } = req.params
  const userId = req.user!.id!

  const progress = await seriesService.getSeriesProgress(seriesId, userId)
  
  if (!progress.currentArticleId) {
    return res.status(404).json({
      success: false,
      message: 'No more articles to read in this series'
    })
  }

  // Get the current article details
  const series = await seriesService.getSeriesById(seriesId, true)
  const currentArticle = series.articles.find((article: any) => article.id === progress.currentArticleId)

  if (!currentArticle) {
    return res.status(404).json({
      success: false,
      message: 'Current article not found'
    })
  }

  return res.json({
    success: true,
    data: {
      progress,
      currentArticle: {
        id: currentArticle.id,
        title: currentArticle.title,
        slug: currentArticle.slug,
        seriesPart: currentArticle.seriesPart,
        readTime: currentArticle.readTime
      },
      seriesInfo: {
        id: series.id,
        name: series.name,
        slug: series.slug,
        totalArticles: series.articlesCount
      }
    }
  })
})