import { Router } from 'express'
import * as articleController from '@/controllers/articleController'
import { authenticate, authorize } from '@/middleware/auth'
import { validateRequest } from '@/middleware/validation'
import { articleSchemas } from '@/schemas/articleSchemas'
import { UserRole } from '@prisma/client'

const router = Router()

// Public routes

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all articles with pagination and filtering
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [TACTICS, TRAINING, PSYCHOLOGY, NUTRITION, TECHNIQUE, FITNESS, NEWS, INTERVIEWS, ANALYSIS, YOUTH, CONDITIONING, PERIODIZATION, MANAGEMENT]
 *         description: Filter by article category
 *       - in: query
 *         name: zone
 *         schema:
 *           type: string
 *           enum: [READ, coach, player, parent, series]
 *         description: Filter by zone visibility
 *       - in: query
 *         name: isPremium
 *         schema:
 *           type: boolean
 *         description: Filter by premium status
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED, REVIEW]
 *         description: Filter by publication status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and content
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, title, publishedAt, viewCount, customOrder]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Articles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Article'
 */
router.get('/', articleController.getArticles)

/**
 * @swagger
 * /articles/search:
 *   get:
 *     summary: Search articles by query
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
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
 *       - in: query
 *         name: zone
 *         schema:
 *           type: string
 *           enum: [READ, coach, player, parent, series]
 *         description: Filter by zone
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [TACTICS, TRAINING, PSYCHOLOGY, NUTRITION, TECHNIQUE, FITNESS, NEWS, INTERVIEWS, ANALYSIS, YOUTH, CONDITIONING, PERIODIZATION, MANAGEMENT]
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Article'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get('/search', articleController.searchArticles)

/**
 * @swagger
 * /articles/{slug}:
 *   get:
 *     summary: Get article by slug
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Article slug
 *         example: osnovni-takticheski-principi
 *     responses:
 *       200:
 *         description: Article retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:slug', articleController.getArticleBySlug)

// View tracking route (public for analytics)
router.post('/:id/track-view', articleController.trackView)

// Protected routes - require authentication and authorization
router.post('/', 
  authenticate, 
  authorize([UserRole.ADMIN, UserRole.COACH]), 
  validateRequest(articleSchemas.create), 
  articleController.createArticle
)

router.put('/:id', 
  authenticate, 
  authorize([UserRole.ADMIN, UserRole.COACH]), 
  validateRequest(articleSchemas.update), 
  articleController.updateArticle
)

router.delete('/:id', 
  authenticate, 
  authorize([UserRole.ADMIN]), 
  validateRequest(articleSchemas.delete), 
  articleController.deleteArticle
)

export default router