import { Router } from 'express'
import * as premiumController from '@/controllers/premiumController'
import { authenticate, authorize } from '@/middleware/auth'
import { validateRequest } from '@/middleware/validation'
import { z } from 'zod'
import { UserRole } from '@prisma/client'

const router = Router()

// Validation schemas
const scheduleReleaseSchema = z.object({
  releaseDate: z.string().datetime('Invalid date format')
})

const batchScheduleSchema = z.object({
  articleIds: z.array(z.string().uuid()).min(1).max(100),
  releaseDate: z.string().datetime('Invalid date format')
})

const bulkAccessCheckSchema = z.object({
  articleIds: z.array(z.string().uuid()).min(1).max(50)
})

const simulateUpgradeSchema = z.object({
  planId: z.string().optional(),
  duration: z.number().min(1).max(365).optional().default(30)
})

/**
 * @swagger
 * tags:
 *   name: Premium
 *   description: Premium content and subscription management
 */

// Public routes

/**
 * @swagger
 * /premium/plans:
 *   get:
 *     summary: Get available subscription plans
 *     tags: [Premium]
 *     responses:
 *       200:
 *         description: Subscription plans retrieved successfully
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
 *                         example: "coach_monthly"
 *                       name:
 *                         type: string
 *                         example: "Coach"
 *                       description:
 *                         type: string
 *                         example: "Comprehensive resources for football coaches"
 *                       price:
 *                         type: number
 *                         example: 39.99
 *                       currency:
 *                         type: string
 *                         example: "BGN"
 *                       interval:
 *                         type: string
 *                         enum: [month, year]
 *                         example: "month"
 *                       features:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Access to all Coach Zone content", "Tactical analysis"]
 *                       isPopular:
 *                         type: boolean
 *                         example: true
 *                       trialDays:
 *                         type: number
 *                         example: 14
 */
router.get('/plans', premiumController.getSubscriptionPlans)

/**
 * @swagger
 * /premium/content/{articleId}/access:
 *   get:
 *     summary: Check access to premium content
 *     tags: [Premium]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Article ID to check access for
 *         example: 254fd880-35d5-42cb-bbb9-700df0f38c30
 *     responses:
 *       200:
 *         description: Access check completed successfully
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
 *                     hasAccess:
 *                       type: boolean
 *                       example: false
 *                     reason:
 *                       type: string
 *                       example: "Premium content - will be free after 2025-09-01"
 *                     requiresUpgrade:
 *                       type: boolean
 *                       example: true
 *                     upgradeUrl:
 *                       type: string
 *                       example: "/pricing"
 *                     previewLength:
 *                       type: number
 *                       example: 300
 *                     releaseDate:
 *                       type: string
 *                       format: date-time
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/content/:articleId/access', premiumController.checkContentAccess)

/**
 * @swagger
 * /premium/content/{articleId}/preview:
 *   get:
 *     summary: Get content preview for premium articles
 *     tags: [Premium]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Content preview retrieved successfully
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
 *                     title:
 *                       type: string
 *                     excerpt:
 *                       type: string
 *                     previewContent:
 *                       type: string
 *                       description: Full content if accessible, preview if premium
 *                     isPremium:
 *                       type: boolean
 *                     releaseDate:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     requiresSubscription:
 *                       type: boolean
 *                     estimatedReadTime:
 *                       type: number
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/content/:articleId/preview', premiumController.getContentPreview)

/**
 * @swagger
 * /premium/content/access/bulk:
 *   post:
 *     summary: Check access to multiple articles at once
 *     tags: [Premium]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [articleIds]
 *             properties:
 *               articleIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 minItems: 1
 *                 maxItems: 50
 *                 example: ["254fd880-35d5-42cb-bbb9-700df0f38c30", "254fd880-35d5-42cb-bbb9-700df0f38c31"]
 *     responses:
 *       200:
 *         description: Bulk access check completed
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
 *                       articleId:
 *                         type: string
 *                         format: uuid
 *                       hasAccess:
 *                         type: boolean
 *                       reason:
 *                         type: string
 *                       requiresUpgrade:
 *                         type: boolean
 *                       error:
 *                         type: boolean
 *                         description: True if article was not found
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/content/access/bulk', 
  validateRequest(bulkAccessCheckSchema), 
  premiumController.checkBulkContentAccess
)

// Authentication required
router.use(authenticate)

/**
 * @swagger
 * /premium/subscription:
 *   get:
 *     summary: Get user's current subscription
 *     tags: [Premium]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User subscription retrieved successfully
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
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     planId:
 *                       type: string
 *                       example: "coach_monthly"
 *                     status:
 *                       type: string
 *                       enum: [ACTIVE, CANCELED, PAST_DUE, UNPAID]
 *                       example: "ACTIVE"
 *                     currentPeriodStart:
 *                       type: string
 *                       format: date-time
 *                     currentPeriodEnd:
 *                       type: string
 *                       format: date-time
 *                     cancelAtPeriodEnd:
 *                       type: boolean
 *                     isActive:
 *                       type: boolean
 *                     daysRemaining:
 *                       type: number
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/subscription', premiumController.getUserSubscription)

/**
 * @swagger
 * /premium/recommendations:
 *   get:
 *     summary: Get premium content recommendations for user
 *     tags: [Premium]
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
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [TACTICS, TRAINING, PSYCHOLOGY, NUTRITION, TECHNIQUE, FITNESS, NEWS, INTERVIEWS, ANALYSIS, YOUTH, CONDITIONING, PERIODIZATION, MANAGEMENT]
 *         description: Filter by category
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
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                       slug:
 *                         type: string
 *                       excerpt:
 *                         type: string
 *                       category:
 *                         type: string
 *                       readTime:
 *                         type: number
 *                       hasAccess:
 *                         type: boolean
 *                       requiresUpgrade:
 *                         type: boolean
 *                       reason:
 *                         type: string
 */
router.get('/recommendations', premiumController.getPremiumRecommendations)

// Development/Testing endpoint (not available in production)
/**
 * @swagger
 * /premium/simulate-upgrade:
 *   post:
 *     summary: Simulate subscription upgrade (Development only)
 *     tags: [Premium]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planId:
 *                 type: string
 *                 default: "coach_monthly"
 *                 example: "coach_monthly"
 *               duration:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 365
 *                 default: 30
 *                 example: 30
 *                 description: Duration in days
 *     responses:
 *       200:
 *         description: Subscription simulated successfully
 *       403:
 *         description: Not available in production
 */
router.post('/simulate-upgrade', 
  validateRequest(simulateUpgradeSchema), 
  premiumController.simulateUpgrade
)

// Admin/Coach routes
/**
 * @swagger
 * /premium/content/{articleId}/schedule:
 *   post:
 *     summary: Schedule premium content release
 *     tags: [Premium]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Article ID to schedule release for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [releaseDate]
 *             properties:
 *               releaseDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-01T10:00:00Z"
 *                 description: Date when content will be released to free users
 *     responses:
 *       200:
 *         description: Content release scheduled successfully
 *       400:
 *         description: Invalid parameters or date in the past
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/content/:articleId/schedule', 
  authorize([UserRole.ADMIN, UserRole.COACH]), 
  validateRequest(scheduleReleaseSchema), 
  premiumController.scheduleContentRelease
)

/**
 * @swagger
 * /premium/content/schedule/batch:
 *   post:
 *     summary: Schedule multiple articles for release
 *     tags: [Premium]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [articleIds, releaseDate]
 *             properties:
 *               articleIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 minItems: 1
 *                 maxItems: 100
 *                 example: ["254fd880-35d5-42cb-bbb9-700df0f38c30"]
 *               releaseDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-01T10:00:00Z"
 *     responses:
 *       200:
 *         description: Batch scheduling completed
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
 *                   example: "Scheduled 5 articles successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     successful:
 *                       type: number
 *                     failed:
 *                       type: number
 *                     failedIds:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.post('/content/schedule/batch', 
  authorize([UserRole.ADMIN, UserRole.COACH]), 
  validateRequest(batchScheduleSchema), 
  premiumController.batchScheduleContentRelease
)

/**
 * @swagger
 * /premium/scheduled:
 *   get:
 *     summary: Get content scheduled for release
 *     tags: [Premium]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Number of items to return
 *     responses:
 *       200:
 *         description: Scheduled content retrieved successfully
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
 *                       title:
 *                         type: string
 *                       slug:
 *                         type: string
 *                       releaseDate:
 *                         type: string
 *                         format: date-time
 *                       daysUntilRelease:
 *                         type: number
 *                       category:
 *                         type: string
 */
router.get('/scheduled', 
  authorize([UserRole.ADMIN, UserRole.COACH]), 
  premiumController.getScheduledContent
)

// Admin-only routes
/**
 * @swagger
 * /premium/analytics:
 *   get:
 *     summary: Get premium content analytics
 *     tags: [Premium]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics
 *     responses:
 *       200:
 *         description: Premium analytics retrieved successfully
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
 *                     content:
 *                       type: object
 *                       properties:
 *                         totalPremiumArticles:
 *                           type: number
 *                           example: 45
 *                         scheduledReleases:
 *                           type: number
 *                           example: 12
 *                         releasedToday:
 *                           type: number
 *                           example: 2
 *                     subscriptions:
 *                       type: object
 *                       properties:
 *                         activeSubscriptions:
 *                           type: number
 *                           example: 156
 *                         totalRevenue:
 *                           type: number
 *                           example: 15420
 *                         churnRate:
 *                           type: number
 *                           example: 5.2
 *                     conversions:
 *                       type: object
 *                       properties:
 *                         conversionRate:
 *                           type: number
 *                           example: 3.2
 *                         premiumTrials:
 *                           type: number
 *                           example: 45
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/analytics', 
  authorize([UserRole.ADMIN]), 
  premiumController.getPremiumAnalytics
)

/**
 * @swagger
 * /premium/releases/process:
 *   post:
 *     summary: Process scheduled content releases
 *     tags: [Premium]
 *     security:
 *       - BearerAuth: []
 *     description: Processes all content scheduled for release (typically called by cron job)
 *     responses:
 *       200:
 *         description: Content releases processed
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
 *                   example: "Processed content releases: 3 released"
 *                 data:
 *                   type: object
 *                   properties:
 *                     released:
 *                       type: number
 *                       example: 3
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.post('/releases/process', 
  authorize([UserRole.ADMIN]), 
  premiumController.processContentReleases
)

export default router