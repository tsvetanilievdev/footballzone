import { Router } from 'express'
import * as templateController from '@/controllers/templateController'
import { authenticate, authorize } from '@/middleware/auth'
import { UserRole } from '@prisma/client'
import { validateRequest } from '@/middleware/validation'
import { z } from 'zod'

const router = Router()

// Apply authentication to all routes
router.use(authenticate)

/**
 * @swagger
 * tags:
 *   name: Templates
 *   description: Article template management
 */

// Template validation schemas
const createTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.enum(['read', 'coach', 'player', 'parent', 'universal']),
  settings: z.record(z.any()),
  isDefault: z.boolean().optional()
})

const updateTemplateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  settings: z.record(z.any()).optional(),
  isDefault: z.boolean().optional()
})

// Public template routes (all authenticated users can view)
router.get('/', templateController.getTemplates)
router.get('/:id', templateController.getTemplate)

// Protected template routes (coach or admin required)
router.post('/', 
  authorize([UserRole.COACH, UserRole.ADMIN]), 
  validateRequest(createTemplateSchema), 
  templateController.createTemplate
)

router.put('/:id', 
  authorize([UserRole.COACH, UserRole.ADMIN]), 
  validateRequest(updateTemplateSchema), 
  templateController.updateTemplate
)

router.delete('/:id', 
  authorize([UserRole.COACH, UserRole.ADMIN]), 
  templateController.deleteTemplate
)

export default router
