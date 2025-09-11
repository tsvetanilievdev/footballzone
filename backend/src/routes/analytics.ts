import { Router } from 'express'
import * as analyticsController from '@/controllers/analyticsController'
import { authenticate, authorize, requireAdmin } from '@/middleware/auth'
import { validateRequest } from '@/middleware/validation'
import { z } from 'zod'
import { UserRole } from '@prisma/client'

const router = Router()

// Validation schemas
const trackEventSchema = z.object({
  action: z.enum(['VIEW', 'READ', 'SHARE', 'DOWNLOAD', 'LIKE', 'COMMENT', 'LOGIN', 'LOGOUT', 'REGISTER', 'SUBSCRIBE', 'UNSUBSCRIBE']),
  resourceType: z.enum(['ARTICLE', 'COURSE', 'LESSON', 'MEDIA', 'USER', 'SUBSCRIPTION', 'AUTH']).optional(),
  resourceId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional()
})

const advancedAnalyticsSchema = z.object({
  metric: z.enum(['user_retention', 'content_performance', 'engagement_funnel', 'revenue_analytics']),
  groupBy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  filters: z.record(z.any()).optional()
})

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics and reporting endpoints
 */

// Public analytics endpoints (limited data)
/**
 * @swagger
 * /analytics/track:
 *   post:
 *     summary: Track user event
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [action]
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [VIEW, READ, SHARE, DOWNLOAD, LIKE, COMMENT, LOGIN, LOGOUT, REGISTER, SUBSCRIBE, UNSUBSCRIBE]
 *                 example: VIEW
 *               resourceType:
 *                 type: string
 *                 enum: [ARTICLE, COURSE, LESSON, MEDIA, USER, SUBSCRIPTION, AUTH]
 *                 example: ARTICLE
 *               resourceId:
 *                 type: string
 *                 format: uuid
 *                 example: 254fd880-35d5-42cb-bbb9-700df0f38c30
 *               metadata:
 *                 type: object
 *                 example: { "readTime": 120, "completion": 75 }
 *     responses:
 *       200:
 *         description: Event tracked successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/track', 
  validateRequest(trackEventSchema), 
  analyticsController.trackEvent
)

// Authentication required for detailed analytics
router.use(authenticate)

/**
 * @swagger
 * /analytics/realtime:
 *   get:
 *     summary: Get real-time analytics data
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Real-time analytics data
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
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     activeUsers:
 *                       type: number
 *                       example: 25
 *                     viewsInLastHour:
 *                       type: number
 *                       example: 150
 *                     currentLoad:
 *                       type: number
 *                       example: 45
 *                     serverStatus:
 *                       type: string
 *                       example: healthy
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/realtime', analyticsController.getRealTimeAnalytics)

// User-specific analytics (users can see their own data)
/**
 * @swagger
 * /analytics/users/{userId}/activity:
 *   get:
 *     summary: Get user activity analytics
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
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
 *         description: User activity data
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
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     userName:
 *                       type: string
 *                     totalSessions:
 *                       type: number
 *                     totalReadTime:
 *                       type: number
 *                     articlesRead:
 *                       type: number
 *                     activityScore:
 *                       type: number
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/users/:userId/activity', 
  authorize([UserRole.ADMIN, UserRole.COACH]), // Remove the second parameter that's causing the error
  analyticsController.getUserActivity
)

// Admin-only analytics endpoints
router.use(requireAdmin)

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Get dashboard analytics
 *     tags: [Analytics]
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
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *         description: Time period grouping
 *     responses:
 *       200:
 *         description: Dashboard analytics data
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
 *                     totalUsers:
 *                       type: number
 *                       example: 1250
 *                     activeUsers:
 *                       type: number
 *                       example: 345
 *                     newUsersToday:
 *                       type: number
 *                       example: 12
 *                     totalArticles:
 *                       type: number
 *                       example: 156
 *                     totalViews:
 *                       type: number
 *                       example: 25680
 *                     topArticles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           views:
 *                             type: number
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/dashboard', analyticsController.getDashboardAnalytics)

/**
 * @swagger
 * /analytics/articles/{id}/detailed:
 *   get:
 *     summary: Get detailed article analytics
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Article ID
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
 *         description: Detailed article analytics
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
 *                     totalViews:
 *                       type: number
 *                     uniqueViews:
 *                       type: number
 *                     avgReadTime:
 *                       type: number
 *                     completionRate:
 *                       type: number
 *                     bounceRate:
 *                       type: number
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/articles/:id/detailed', analyticsController.getArticleAnalytics)

/**
 * @swagger
 * /analytics/performance:
 *   get:
 *     summary: Get system performance metrics
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: System performance data
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
 *                     apiResponseTimes:
 *                       type: object
 *                       properties:
 *                         avg:
 *                           type: number
 *                         p95:
 *                           type: number
 *                         p99:
 *                           type: number
 *                     cachePerformance:
 *                       type: object
 *                       properties:
 *                         hitRate:
 *                           type: number
 *                         missRate:
 *                           type: number
 *                     systemResources:
 *                       type: object
 *                       properties:
 *                         cpuUsage:
 *                           type: number
 *                         memoryUsage:
 *                           type: number
 */
router.get('/performance', analyticsController.getPerformanceMetrics)

/**
 * @swagger
 * /analytics/export:
 *   get:
 *     summary: Export analytics data
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [dashboard, articles, users]
 *         description: Type of data to export
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv]
 *           default: json
 *         description: Export format
 *     responses:
 *       200:
 *         description: Exported data file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *           text/csv:
 *             schema:
 *               type: string
 *       400:
 *         description: Invalid parameters
 */
router.get('/export', analyticsController.exportAnalytics)

/**
 * @swagger
 * /analytics/advanced:
 *   post:
 *     summary: Run advanced analytics queries
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [metric]
 *             properties:
 *               metric:
 *                 type: string
 *                 enum: [user_retention, content_performance, engagement_funnel, revenue_analytics]
 *                 example: user_retention
 *               groupBy:
 *                 type: string
 *                 example: category
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               filters:
 *                 type: object
 *                 example: { "category": "TACTICS", "zone": "coach" }
 *     responses:
 *       200:
 *         description: Advanced analytics results
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
 *       400:
 *         description: Invalid parameters
 */
router.post('/advanced', 
  validateRequest(advancedAnalyticsSchema), 
  analyticsController.getAdvancedAnalytics
)

export default router