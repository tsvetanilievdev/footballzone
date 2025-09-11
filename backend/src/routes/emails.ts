import { Router } from 'express'
import * as emailController from '@/controllers/emailController'
import { authenticate, authorize } from '@/middleware/auth'
import { validateRequest } from '@/middleware/validation'
import { z } from 'zod'
import { UserRole } from '@prisma/client'

const router = Router()

// Validation schemas
const sendEmailSchema = z.object({
  to: z.string().email('Invalid email address'),
  templateId: z.string().min(1, 'Template ID is required'),
  variables: z.record(z.any()).optional().default({}),
  scheduledFor: z.string().datetime().optional(),
  priority: z.enum(['low', 'normal', 'high']).optional().default('normal')
})

const bulkEmailSchema = z.object({
  recipients: z.array(z.object({
    email: z.string().email(),
    variables: z.record(z.any()).optional().default({}),
    userId: z.string().uuid().optional()
  })).min(1).max(10000),
  templateId: z.string().min(1),
  batchSize: z.number().min(1).max(1000).optional().default(100),
  delayBetweenBatches: z.number().min(0).max(60000).optional().default(1000),
  priority: z.enum(['low', 'normal', 'high']).optional().default('normal')
})

const preferencesSchema = z.object({
  newsletter: z.boolean().optional(),
  notifications: z.boolean().optional(),
  premium: z.boolean().optional(),
  marketing: z.boolean().optional()
})

const testEmailSchema = z.object({
  to: z.string().email('Invalid email address'),
  templateId: z.string().optional().default('welcome'),
  variables: z.record(z.any()).optional().default({})
})

const notificationSchema = z.object({
  type: z.enum(['new_article', 'premium_released', 'series_completed', 'welcome']),
  data: z.record(z.any())
})

/**
 * @swagger
 * tags:
 *   name: Emails
 *   description: Email management and notification system
 */

// Public routes

/**
 * @swagger
 * /emails/unsubscribe:
 *   get:
 *     summary: Unsubscribe from email category
 *     tags: [Emails]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Unsubscribe token from email
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Successfully unsubscribed
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
 *                   example: "Successfully unsubscribed from email category"
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: string
 *                       example: "newsletter"
 *       400:
 *         description: Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired unsubscribe token"
 */
router.get('/unsubscribe', emailController.unsubscribe)

// Authentication required
router.use(authenticate)

/**
 * @swagger
 * /emails/preferences:
 *   get:
 *     summary: Get user email preferences
 *     tags: [Emails]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Email preferences retrieved successfully
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
 *                     newsletter:
 *                       type: boolean
 *                       example: true
 *                     notifications:
 *                       type: boolean
 *                       example: true
 *                     premium:
 *                       type: boolean
 *                       example: false
 *                     marketing:
 *                       type: boolean
 *                       example: false
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   put:
 *     summary: Update user email preferences
 *     tags: [Emails]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newsletter:
 *                 type: boolean
 *                 example: true
 *               notifications:
 *                 type: boolean
 *                 example: true
 *               premium:
 *                 type: boolean
 *                 example: false
 *               marketing:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Preferences updated successfully
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
 *                   example: "Email preferences updated successfully"
 */
router.get('/preferences', emailController.getEmailPreferences)
router.put('/preferences', 
  validateRequest(preferencesSchema), 
  emailController.updateEmailPreferences
)

// Admin/Coach routes
/**
 * @swagger
 * /emails/templates:
 *   get:
 *     summary: Get available email templates
 *     tags: [Emails]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Email templates retrieved successfully
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
 *                         example: "welcome"
 *                       name:
 *                         type: string
 *                         example: "Welcome Email"
 *                       subject:
 *                         type: string
 *                         example: "Добре дошли в FootballZone.bg! ⚽"
 *                       category:
 *                         type: string
 *                         example: "welcome"
 *                       variables:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["userName", "dashboardUrl"]
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/templates', 
  authorize([UserRole.ADMIN, UserRole.COACH]), 
  emailController.getEmailTemplates
)

/**
 * @swagger
 * /emails/send:
 *   post:
 *     summary: Send individual email
 *     tags: [Emails]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [to, templateId]
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               templateId:
 *                 type: string
 *                 example: "welcome"
 *               variables:
 *                 type: object
 *                 example: {"userName": "John Doe", "dashboardUrl": "https://footballzone.bg/dashboard"}
 *               scheduledFor:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-01T10:00:00Z"
 *                 description: Schedule email for later sending
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high]
 *                 default: normal
 *     responses:
 *       200:
 *         description: Email sent or scheduled successfully
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
 *                   example: "Email sent successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     emailId:
 *                       type: string
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post('/send', 
  authorize([UserRole.ADMIN]), 
  validateRequest(sendEmailSchema), 
  emailController.sendEmail
)

/**
 * @swagger
 * /emails/send/bulk:
 *   post:
 *     summary: Send bulk emails
 *     tags: [Emails]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [recipients, templateId]
 *             properties:
 *               recipients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [email]
 *                   properties:
 *                     email:
 *                       type: string
 *                       format: email
 *                     variables:
 *                       type: object
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                 minItems: 1
 *                 maxItems: 10000
 *                 example: [{"email": "user1@example.com", "variables": {"userName": "User 1"}}, {"email": "user2@example.com", "variables": {"userName": "User 2"}}]
 *               templateId:
 *                 type: string
 *                 example: "newsletter"
 *               batchSize:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 1000
 *                 default: 100
 *                 description: Number of emails to send per batch
 *               delayBetweenBatches:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 60000
 *                 default: 1000
 *                 description: Delay in milliseconds between batches
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high]
 *                 default: normal
 *     responses:
 *       200:
 *         description: Bulk emails sent successfully
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
 *                   example: "Bulk email completed: 150 sent, 5 failed"
 *                 data:
 *                   type: object
 *                   properties:
 *                     sent:
 *                       type: number
 *                       example: 150
 *                     failed:
 *                       type: number
 *                       example: 5
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.post('/send/bulk', 
  authorize([UserRole.ADMIN]), 
  validateRequest(bulkEmailSchema), 
  emailController.sendBulkEmails
)

/**
 * @swagger
 * /emails/notifications:
 *   post:
 *     summary: Send notification emails based on user activity
 *     tags: [Emails]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, data]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [new_article, premium_released, series_completed, welcome]
 *                 example: "new_article"
 *               data:
 *                 type: object
 *                 description: Data specific to the notification type
 *                 example: {"articleId": "254fd880-35d5-42cb-bbb9-700df0f38c30", "category": "TACTICS"}
 *     responses:
 *       200:
 *         description: Notifications sent successfully
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
 *                   example: "new_article notifications processed"
 *                 data:
 *                   type: object
 */
router.post('/notifications', 
  authorize([UserRole.ADMIN, UserRole.COACH]), 
  validateRequest(notificationSchema), 
  emailController.sendNotificationEmails
)

// Admin-only routes
/**
 * @swagger
 * /emails/analytics:
 *   get:
 *     summary: Get email analytics
 *     tags: [Emails]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [welcome, newsletter, notification, premium, system, marketing]
 *         description: Filter by email category
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
 *         description: Email analytics retrieved successfully
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
 *                     sent:
 *                       type: number
 *                       example: 1250
 *                     delivered:
 *                       type: number
 *                       example: 1200
 *                     opened:
 *                       type: number
 *                       example: 800
 *                     clicked:
 *                       type: number
 *                       example: 150
 *                     bounced:
 *                       type: number
 *                       example: 25
 *                     complained:
 *                       type: number
 *                       example: 5
 *                     unsubscribed:
 *                       type: number
 *                       example: 10
 *                     byCategory:
 *                       type: object
 *                       additionalProperties:
 *                         type: object
 *                         properties:
 *                           sent:
 *                             type: number
 *                           delivered:
 *                             type: number
 *                           opened:
 *                             type: number
 */
router.get('/analytics', 
  authorize([UserRole.ADMIN]), 
  emailController.getEmailAnalytics
)

// Development/Testing endpoints (not available in production)
/**
 * @swagger
 * /emails/test:
 *   post:
 *     summary: Send test email (Development only)
 *     tags: [Emails]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [to]
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *                 example: "test@example.com"
 *               templateId:
 *                 type: string
 *                 default: "welcome"
 *                 example: "welcome"
 *               variables:
 *                 type: object
 *                 example: {"userName": "Test User"}
 *     responses:
 *       200:
 *         description: Test email sent successfully
 *       403:
 *         description: Not available in production
 *       500:
 *         description: Failed to send test email
 */
router.post('/test', 
  validateRequest(testEmailSchema), 
  emailController.testEmail
)

export default router