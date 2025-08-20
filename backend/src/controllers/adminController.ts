import { Request, Response, NextFunction } from 'express'
import { AdminService } from '../services/adminService'
import db from '@/config/database'

const adminService = new AdminService()

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations for platform management
 */

/**
 * @swagger
 * /admin/articles:
 *   get:
 *     summary: Get articles for admin management
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
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
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED, REVIEW]
 *         description: Filter by article status
 *       - in: query
 *         name: zone
 *         schema:
 *           type: string
 *           enum: [read, coach, player, parent, series]
 *         description: Filter by zone
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author ID
 *     responses:
 *       200:
 *         description: Articles retrieved successfully
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
 *                     $ref: '#/components/schemas/Article'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
export const getAdminArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const status = req.query.status as string
    const zone = req.query.zone as string
    const category = req.query.category as string
    const author = req.query.author as string

    const result = await adminService.getAdminArticles({
      page,
      limit,
      status,
      zone,
      category,
      author
    })

    res.json({
      success: true,
      data: result.articles,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit)
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /admin/articles/stats:
 *   get:
 *     summary: Get article statistics for admin dashboard
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Article statistics retrieved successfully
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
 *                     totalArticles:
 *                       type: integer
 *                       example: 156
 *                     publishedArticles:
 *                       type: integer
 *                       example: 142
 *                     draftArticles:
 *                       type: integer
 *                       example: 12
 *                     archivedArticles:
 *                       type: integer
 *                       example: 2
 *                     totalViews:
 *                       type: integer
 *                       example: 25834
 *                     monthlyGrowth:
 *                       type: number
 *                       example: 12.5
 *                     weeklyViews:
 *                       type: integer
 *                       example: 1250
 *                     popularCategories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                           count:
 *                             type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
export const getAdminArticleStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await adminService.getArticleStats()

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get users for admin management
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
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
 *         description: Items per page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [FREE, PLAYER, COACH, PARENT, ADMIN]
 *         description: Filter by user role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, banned]
 *         description: Filter by user status
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search by name or email
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
export const getAdminUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const role = req.query.role as string
    const status = req.query.status as string
    const searchTerm = req.query.searchTerm as string

    const result = await adminService.getAdminUsers({
      page,
      limit,
      role,
      status,
      searchTerm
    })

    res.json({
      success: true,
      data: result.users,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit)
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /admin/users/stats:
 *   get:
 *     summary: Get user statistics for admin dashboard
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
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
 *                       type: integer
 *                       example: 1247
 *                     activeUsers:
 *                       type: integer
 *                       example: 1198
 *                     newUsersThisMonth:
 *                       type: integer
 *                       example: 89
 *                     premiumSubscribers:
 *                       type: integer
 *                       example: 245
 *                     roleBreakdown:
 *                       type: object
 *                       properties:
 *                         FREE:
 *                           type: integer
 *                           example: 856
 *                         PLAYER:
 *                           type: integer
 *                           example: 198
 *                         COACH:
 *                           type: integer
 *                           example: 156
 *                         PARENT:
 *                           type: integer
 *                           example: 89
 *                         ADMIN:
 *                           type: integer
 *                           example: 3
 *                     userGrowth:
 *                       type: number
 *                       example: 8.2
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
export const getAdminUserStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await adminService.getUserStats()

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /admin/analytics:
 *   get:
 *     summary: Get platform analytics for admin dashboard
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *         description: Analytics period
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
 *         name: zone
 *         schema:
 *           type: string
 *         description: Filter by zone
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
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
 *                     views:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     articles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                           count:
 *                             type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
export const getAdminAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = req.query.period as string || 'month'
    const startDate = req.query.startDate as string
    const endDate = req.query.endDate as string
    const zone = req.query.zone as string

    const analytics = await adminService.getAnalytics({
      period,
      startDate,
      endDate,
      zone
    })

    res.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /admin/articles/bulk:
 *   post:
 *     summary: Perform bulk operations on articles
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               operation:
 *                 type: string
 *                 enum: [delete, archive, publish, draft, feature, unfeature]
 *                 example: publish
 *               articleIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: ["123e4567-e89b-12d3-a456-426614174000"]
 *               data:
 *                 type: object
 *                 description: Additional data for the operation
 *     responses:
 *       200:
 *         description: Bulk operation completed successfully
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
 *                   example: Bulk operation completed
 *                 data:
 *                   type: object
 *                   properties:
 *                     affected:
 *                       type: integer
 *                       example: 5
 *                     failed:
 *                       type: integer
 *                       example: 0
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
export const bulkArticleOperation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { operation, articleIds, data } = req.body

    const result = await adminService.bulkArticleOperation(operation, articleIds, data)

    res.json({
      success: true,
      message: 'Bulk operation completed',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /admin/users/{userId}:
 *   put:
 *     summary: Update user information
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Name
 *               email:
 *                 type: string
 *                 format: email
 *                 example: updated@example.com
 *               role:
 *                 type: string
 *                 enum: [FREE, PLAYER, COACH, PARENT, ADMIN]
 *                 example: COACH
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   example: User updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params
    const updateData = req.body

    const user = await adminService.updateUser(userId, updateData)

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /admin/users/{userId}/ban:
 *   post:
 *     summary: Ban a user
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to ban
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Violation of terms of service
 *     responses:
 *       200:
 *         description: User banned successfully
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
 *                   example: User banned successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export const banUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params
    const { reason } = req.body

    await adminService.banUser(userId, reason)

    res.json({
      success: true,
      message: 'User banned successfully'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /admin/users/{userId}/unban:
 *   post:
 *     summary: Unban a user
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to unban
 *     responses:
 *       200:
 *         description: User unbanned successfully
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
 *                   example: User unbanned successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export const unbanUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params

    await adminService.unbanUser(userId)

    res.json({
      success: true,
      message: 'User unbanned successfully'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /admin/users/{userId}/reset-password:
 *   post:
 *     summary: Reset user password (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to reset password
 *     responses:
 *       200:
 *         description: Password reset successfully
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
 *                   example: Password reset email sent
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export const resetUserPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params

    await adminService.resetUserPassword(userId)

    res.json({
      success: true,
      message: 'Password reset email sent'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /admin/settings:
 *   get:
 *     summary: Get admin settings
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
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
 *                     siteName:
 *                       type: string
 *                       example: FootballZone.bg
 *                     maintenanceMode:
 *                       type: boolean
 *                       example: false
 *                     registrationEnabled:
 *                       type: boolean
 *                       example: true
 *                     emailNotifications:
 *                       type: boolean
 *                       example: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
export const getAdminSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await adminService.getSettings()

    res.json({
      success: true,
      data: settings
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /admin/settings:
 *   put:
 *     summary: Update admin settings
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               siteName:
 *                 type: string
 *                 example: FootballZone.bg
 *               maintenanceMode:
 *                 type: boolean
 *                 example: false
 *               registrationEnabled:
 *                 type: boolean
 *                 example: true
 *               emailNotifications:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Settings updated successfully
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
 *                   example: Settings updated successfully
 *                 data:
 *                   type: object
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
export const updateAdminSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = req.body

    const updatedSettings = await adminService.updateSettings(settings)

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: updatedSettings
    })
  } catch (error) {
    next(error)
  }
}
