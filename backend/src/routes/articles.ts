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
router.get('/by-id/:id', articleController.getArticleById)
router.get('/:slug', articleController.getArticleBySlug)

// View tracking route (public for analytics)
/**
 * @swagger
 * /articles/{id}/track-view:
 *   post:
 *     summary: Track article view for analytics
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Article ID
 *         example: 254fd880-35d5-42cb-bbb9-700df0f38c30
 *     responses:
 *       200:
 *         description: View tracked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: View tracked successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/:id/track-view', articleController.trackView)

// Protected routes - require authentication and authorization

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleCreate'
 *     responses:
 *       201:
 *         description: Article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Article created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post('/', 
  authenticate, 
  authorize([UserRole.ADMIN, UserRole.COACH]), 
  validateRequest(articleSchemas.create), 
  articleController.createArticle
)

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Update an existing article
 *     tags: [Articles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Article ID to update
 *         example: 254fd880-35d5-42cb-bbb9-700df0f38c30
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 example: Обновено заглавие на статията
 *               slug:
 *                 type: string
 *                 pattern: '^[a-z0-9-]+$'
 *                 example: obnoveno-zaglavie-statia
 *               excerpt:
 *                 type: string
 *                 maxLength: 500
 *                 example: Обновено описание
 *               content:
 *                 type: string
 *                 minLength: 10
 *                 example: Обновено съдържание на статията...
 *               category:
 *                 type: string
 *                 enum: [TACTICS, TRAINING, PSYCHOLOGY, NUTRITION, TECHNIQUE, FITNESS, NEWS, INTERVIEWS, ANALYSIS, YOUTH, CONDITIONING, PERIODIZATION, MANAGEMENT]
 *                 example: TACTICS
 *               subcategory:
 *                 type: string
 *                 maxLength: 100
 *                 example: Advanced Tactics
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [тактика, обновена, съвременен футбол]
 *               readTime:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 240
 *                 example: 12
 *               isPremium:
 *                 type: boolean
 *                 example: true
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED, REVIEW]
 *                 example: PUBLISHED
 *               featuredImageUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/new-image.jpg
 *               seoTitle:
 *                 type: string
 *                 maxLength: 255
 *                 example: Ново SEO заглавие
 *               seoDescription:
 *                 type: string
 *                 maxLength: 320
 *                 example: Ново SEO описание
 *               zones:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 5
 *                 items:
 *                   $ref: '#/components/schemas/ArticleZone'
 *                 example:
 *                   - zone: coach
 *                     visible: true
 *                     requiresSubscription: true
 *                   - zone: read
 *                     visible: true
 *                     requiresSubscription: false
 *     responses:
 *       200:
 *         description: Article updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Article updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id', 
  authenticate, 
  authorize([UserRole.ADMIN, UserRole.COACH]), 
  validateRequest(articleSchemas.update), 
  articleController.updateArticle
)

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Delete an article
 *     tags: [Articles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Article ID to delete
 *         example: 254fd880-35d5-42cb-bbb9-700df0f38c30
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Article deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', 
  authenticate, 
  authorize([UserRole.ADMIN]), 
  validateRequest(articleSchemas.delete), 
  articleController.deleteArticle
)

export default router