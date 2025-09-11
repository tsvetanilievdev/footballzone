import { Router } from 'express'
import * as seriesController from '@/controllers/seriesController'
import { authenticate, authorize } from '@/middleware/auth'
import { validateRequest } from '@/middleware/validation'
import { z } from 'zod'
import { UserRole } from '@prisma/client'

const router = Router()

// Validation schemas
const createSeriesSchema = z.object({
  name: z.string().min(3).max(255),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(1000).optional(),
  coverImageUrl: z.string().url().optional(),
  category: z.enum(['coaches', 'players', 'teams', 'general']),
  totalPlannedArticles: z.number().min(1).max(100).optional(),
  tags: z.array(z.string().max(50)).max(20).optional()
})

const updateSeriesSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(1000).optional(),
  coverImageUrl: z.string().url().optional(),
  category: z.enum(['coaches', 'players', 'teams', 'general']).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
  totalPlannedArticles: z.number().min(1).max(100).optional(),
  tags: z.array(z.string().max(50)).max(20).optional()
})

const addArticleSchema = z.object({
  seriesPart: z.number().min(1).max(1000)
})

const reorderArticlesSchema = z.object({
  articleOrders: z.array(z.object({
    articleId: z.string().uuid(),
    seriesPart: z.number().min(1).max(1000)
  })).min(1).max(1000)
})

/**
 * @swagger
 * tags:
 *   name: Series
 *   description: Article series management endpoints
 */

// Public routes

/**
 * @swagger
 * /series:
 *   get:
 *     summary: Get all series with filtering and pagination
 *     tags: [Series]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *         description: Items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [coaches, players, teams, general]
 *         description: Filter by category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, ACTIVE, COMPLETED, ARCHIVED]
 *           default: ACTIVE
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name and description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, name, articlesCount]
 *           default: createdAt
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Series retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                         example: "Основи на тактиката"
 *                       slug:
 *                         type: string
 *                         example: "osnovi-na-taktikata"
 *                       description:
 *                         type: string
 *                       category:
 *                         type: string
 *                         enum: [coaches, players, teams, general]
 *                       articlesCount:
 *                         type: number
 *                       estimatedReadTime:
 *                         type: number
 *                       completionRate:
 *                         type: number
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationInfo'
 */
router.get('/', seriesController.getSeries)

/**
 * @swagger
 * /series/popular:
 *   get:
 *     summary: Get popular series
 *     tags: [Series]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 20
 *         description: Number of series to return
 *     responses:
 *       200:
 *         description: Popular series retrieved successfully
 */
router.get('/popular', seriesController.getPopularSeries)

/**
 * @swagger
 * /series/category/{category}:
 *   get:
 *     summary: Get series by category
 *     tags: [Series]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [coaches, players, teams, general]
 *         description: Series category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Series by category retrieved successfully
 */
router.get('/category/:category', seriesController.getSeriesByCategory)

/**
 * @swagger
 * /series/{identifier}:
 *   get:
 *     summary: Get series by ID or slug
 *     tags: [Series]
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: Series ID (UUID) or slug
 *         example: osnovi-na-taktikata
 *       - in: query
 *         name: articles
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Include articles in response
 *     responses:
 *       200:
 *         description: Series retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     description:
 *                       type: string
 *                     category:
 *                       type: string
 *                     articles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           slug:
 *                             type: string
 *                           seriesPart:
 *                             type: number
 *                           readTime:
 *                             type: number
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:identifier', seriesController.getSeriesById)

// Authentication required for user-specific features
router.use(authenticate)

/**
 * @swagger
 * /series/{seriesId}/progress:
 *   get:
 *     summary: Get user progress in series
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seriesId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Series ID
 *     responses:
 *       200:
 *         description: Series progress retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     seriesId:
 *                       type: string
 *                       format: uuid
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     articlesCompleted:
 *                       type: number
 *                       example: 3
 *                     totalArticles:
 *                       type: number
 *                       example: 5
 *                     completionPercentage:
 *                       type: number
 *                       example: 60
 *                     currentArticleId:
 *                       type: string
 *                       format: uuid
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:seriesId/progress', seriesController.getSeriesProgress)

/**
 * @swagger
 * /series/{seriesId}/continue:
 *   get:
 *     summary: Continue reading series from current position
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seriesId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Series ID
 *     responses:
 *       200:
 *         description: Continue reading information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     progress:
 *                       type: object
 *                     currentArticle:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         slug:
 *                           type: string
 *                         seriesPart:
 *                           type: number
 *                     seriesInfo:
 *                       type: object
 *       404:
 *         description: No more articles to read or series not found
 */
router.get('/:seriesId/continue', seriesController.continueSeriesReading)

/**
 * @swagger
 * /series/recommendations:
 *   get:
 *     summary: Get series recommendations for user
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *           maximum: 20
 *         description: Number of recommendations
 *     responses:
 *       200:
 *         description: Recommendations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       seriesId:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       slug:
 *                         type: string
 *                       category:
 *                         type: string
 *                       articlesCount:
 *                         type: number
 *                       estimatedReadTime:
 *                         type: number
 *                       matchScore:
 *                         type: number
 *                       reason:
 *                         type: string
 *                         example: "Based on your interest in tactics"
 */
router.get('/recommendations', seriesController.getSeriesRecommendations)

// Admin/Coach only routes
/**
 * @swagger
 * /series:
 *   post:
 *     summary: Create new series
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug, category]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 example: "Основи на тактиката"
 *               slug:
 *                 type: string
 *                 pattern: "^[a-z0-9-]+$"
 *                 example: "osnovi-na-taktikata"
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Серия статии за основните принципи в тактиката"
 *               coverImageUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/cover.jpg"
 *               category:
 *                 type: string
 *                 enum: [coaches, players, teams, general]
 *                 example: "coaches"
 *               totalPlannedArticles:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 100
 *                 example: 5
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   maxLength: 50
 *                 maxItems: 20
 *                 example: ["тактика", "основи", "треньори"]
 *     responses:
 *       201:
 *         description: Series created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: Series with this slug already exists
 */
router.post('/', 
  authorize([UserRole.ADMIN, UserRole.COACH]), 
  validateRequest(createSeriesSchema), 
  seriesController.createSeries
)

/**
 * @swagger
 * /series/{id}:
 *   put:
 *     summary: Update series
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Series ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *               slug:
 *                 type: string
 *                 pattern: "^[a-z0-9-]+$"
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               coverImageUrl:
 *                 type: string
 *                 format: uri
 *               category:
 *                 type: string
 *                 enum: [coaches, players, teams, general]
 *               status:
 *                 type: string
 *                 enum: [DRAFT, ACTIVE, COMPLETED, ARCHIVED]
 *               totalPlannedArticles:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 100
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Series updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id', 
  authorize([UserRole.ADMIN, UserRole.COACH]), 
  validateRequest(updateSeriesSchema), 
  seriesController.updateSeries
)

/**
 * @swagger
 * /series/{id}:
 *   delete:
 *     summary: Delete series
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Series ID
 *     responses:
 *       200:
 *         description: Series deleted successfully
 *       400:
 *         description: Cannot delete series with associated articles
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', 
  authorize([UserRole.ADMIN]), 
  seriesController.deleteSeries
)

// Article management within series
/**
 * @swagger
 * /series/{seriesId}/articles/{articleId}:
 *   post:
 *     summary: Add article to series
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seriesId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [seriesPart]
 *             properties:
 *               seriesPart:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 1000
 *                 example: 1
 *     responses:
 *       200:
 *         description: Article added to series successfully
 */
router.post('/:seriesId/articles/:articleId', 
  authorize([UserRole.ADMIN, UserRole.COACH]), 
  validateRequest(addArticleSchema), 
  seriesController.addArticleToSeries
)

/**
 * @swagger
 * /series/articles/{articleId}:
 *   delete:
 *     summary: Remove article from series
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Article removed from series successfully
 */
router.delete('/articles/:articleId', 
  authorize([UserRole.ADMIN, UserRole.COACH]), 
  seriesController.removeArticleFromSeries
)

/**
 * @swagger
 * /series/{seriesId}/reorder:
 *   put:
 *     summary: Reorder articles in series
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seriesId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [articleOrders]
 *             properties:
 *               articleOrders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [articleId, seriesPart]
 *                   properties:
 *                     articleId:
 *                       type: string
 *                       format: uuid
 *                     seriesPart:
 *                       type: number
 *                       minimum: 1
 *                 example:
 *                   - articleId: "123e4567-e89b-12d3-a456-426614174000"
 *                     seriesPart: 1
 *                   - articleId: "123e4567-e89b-12d3-a456-426614174001"
 *                     seriesPart: 2
 *     responses:
 *       200:
 *         description: Articles reordered successfully
 */
router.put('/:seriesId/reorder', 
  authorize([UserRole.ADMIN, UserRole.COACH]), 
  validateRequest(reorderArticlesSchema), 
  seriesController.reorderSeriesArticles
)

// Analytics routes (Admin only)
/**
 * @swagger
 * /series/{seriesId}/analytics:
 *   get:
 *     summary: Get series analytics
 *     tags: [Series]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seriesId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Series analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     seriesInfo:
 *                       type: object
 *                     engagement:
 *                       type: object
 *                       properties:
 *                         totalViews:
 *                           type: number
 *                         uniqueUsers:
 *                           type: number
 *                         avgCompletionRate:
 *                           type: number
 *                     progression:
 *                       type: object
 *                       properties:
 *                         usersStarted:
 *                           type: number
 *                         usersCompleted:
 *                           type: number
 *                         dropoffPoints:
 *                           type: array
 */
router.get('/:seriesId/analytics', 
  authorize([UserRole.ADMIN]), 
  seriesController.getSeriesAnalytics
)

export default router