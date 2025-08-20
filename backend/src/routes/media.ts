import { Router } from 'express'
import * as mediaController from '@/controllers/mediaController'
import { authenticate, authorize } from '@/middleware/auth'
import { UserRole } from '@prisma/client'
import { validateRequest } from '@/middleware/validation'
import { z } from 'zod'
import multer from 'multer'

const router = Router()

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'audio/mpeg',
      'audio/wav'
    ]

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('File type not allowed'))
    }
  }
})

// Apply authentication to all routes
router.use(authenticate)

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Media file management
 */

// Media validation schemas
const updateMediaSchema = z.object({
  altText: z.string().max(500).optional(),
  tags: z.array(z.string()).optional()
})

// Media routes
router.get('/', mediaController.getMediaFiles)
router.get('/folders', mediaController.getMediaFolders)
router.get('/:id', mediaController.getMediaFile)

// Protected routes (coach or admin required for upload/modify)
router.post('/upload', 
  authorize([UserRole.COACH, UserRole.ADMIN]),
  upload.single('file'),
  mediaController.uploadMedia
)

router.put('/:id', 
  authorize([UserRole.COACH, UserRole.ADMIN]),
  validateRequest(updateMediaSchema), 
  mediaController.updateMediaFile
)

router.delete('/:id', 
  authorize([UserRole.COACH, UserRole.ADMIN]),
  mediaController.deleteMediaFile
)

export default router
