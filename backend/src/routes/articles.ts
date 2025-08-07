import { Router } from 'express'
import * as articleController from '@/controllers/articleController'
// import { authenticate, authorize } from '@/middleware/auth'
// import { validateRequest } from '@/middleware/validation'
// import { articleSchemas } from '@/schemas/articleSchemas'

const router = Router()

// Public routes
router.get('/', articleController.getArticles)
router.get('/search', articleController.searchArticles)
router.get('/:slug', articleController.getArticleBySlug)

// Protected routes (will be implemented later)
// router.post('/', authenticate, authorize(['ADMIN', 'COACH']), validateRequest(articleSchemas.create), articleController.createArticle)
// router.put('/:id', authenticate, authorize(['ADMIN', 'COACH']), validateRequest(articleSchemas.update), articleController.updateArticle)
// router.delete('/:id', authenticate, authorize(['ADMIN']), articleController.deleteArticle)
// router.post('/:id/view', articleController.trackView)

export default router