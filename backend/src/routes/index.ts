import { Router } from 'express'
import articlesRouter from './articles'
import authRouter from './auth'
import adminRouter from './admin'
import templatesRouter from './templates'
import mediaRouter from './media'
// import usersRouter from './users'
// import zonesRouter from './zones'

const router = Router()

// Health check for API
router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    message: 'API is working',
    timestamp: new Date().toISOString(),
  })
})

// Mount route modules
router.use('/articles', articlesRouter)
router.use('/auth', authRouter)
router.use('/admin', adminRouter)
router.use('/templates', templatesRouter)
router.use('/media', mediaRouter)
// router.use('/users', usersRouter)  
// router.use('/zones', zonesRouter)

// API documentation
router.get('/', (_req, res) => {
  res.json({
    name: 'FootballZone.bg API',
    version: '1.0.0',
    description: 'Backend API for Bulgarian football education platform',
    endpoints: {
      health: '/health',
      articles: '/articles',
      auth: '/auth',
      admin: '/admin',
      templates: '/templates',
      media: '/media',
      // users: '/users',
      // zones: '/zones',
    },
    documentation: 'Coming soon...',
  })
})

export default router