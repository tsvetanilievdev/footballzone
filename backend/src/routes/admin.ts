import { Router } from 'express'
import * as adminController from '@/controllers/adminController'
import { authenticate, requireAdmin } from '@/middleware/auth'
import { validateRequest } from '@/middleware/validation'
import { z } from 'zod'

const router = Router()

// Apply authentication and admin-only access to all routes
router.use(authenticate)
router.use(requireAdmin)

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations for platform management
 */

// Article management routes
router.get('/articles', adminController.getAdminArticles)
router.get('/articles/stats', adminController.getAdminArticleStats)

// Bulk operations schema
const bulkOperationSchema = z.object({
  operation: z.enum(['delete', 'archive', 'publish', 'draft', 'feature', 'unfeature']),
  articleIds: z.array(z.string().uuid()),
  data: z.record(z.any()).optional()
})

router.post('/articles/bulk', 
  validateRequest(bulkOperationSchema), 
  adminController.bulkArticleOperation
)

// User management routes
router.get('/users', adminController.getAdminUsers)
router.get('/users/stats', adminController.getAdminUserStats)

// User update schema
const userUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(['FREE', 'PLAYER', 'COACH', 'PARENT', 'ADMIN']).optional(),
  isActive: z.boolean().optional()
})

router.put('/users/:userId', 
  validateRequest(userUpdateSchema), 
  adminController.updateUser
)

// User ban schema
const banUserSchema = z.object({
  reason: z.string().max(500).optional()
})

router.post('/users/:userId/ban', 
  validateRequest(banUserSchema), 
  adminController.banUser
)

router.post('/users/:userId/unban', adminController.unbanUser)
router.post('/users/:userId/reset-password', adminController.resetUserPassword)

// Analytics routes
router.get('/analytics', adminController.getAdminAnalytics)

// Settings routes
router.get('/settings', adminController.getAdminSettings)

// Settings update schema
const settingsUpdateSchema = z.object({
  siteName: z.string().min(1).max(100).optional(),
  maintenanceMode: z.boolean().optional(),
  registrationEnabled: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  maxFileUploadSize: z.number().min(1).max(100).optional(),
  allowedFileTypes: z.array(z.string()).optional(),
  cacheEnabled: z.boolean().optional(),
  analyticsEnabled: z.boolean().optional()
})

router.put('/settings', 
  validateRequest(settingsUpdateSchema), 
  adminController.updateAdminSettings
)

export default router
