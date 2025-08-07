import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import env, { getAllowedOrigins } from '@/config/environment'
import { errorHandler, notFound } from '@/middleware/errorHandler'
import { requestLogger } from '@/middleware/requestLogger'
import apiRoutes from '@/routes'

const app = express()

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1)

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins()
    
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api', limiter)

// Body parsing middleware
app.use(express.json({ 
  limit: `${env.MAX_FILE_SIZE}b`,
  verify: (req, res, buf) => {
    // Store raw body for webhooks
    if (req.url?.includes('/webhooks/')) {
      (req as any).rawBody = buf
    }
  }
}))
app.use(express.urlencoded({ extended: true, limit: `${env.MAX_FILE_SIZE}b` }))

// Compression middleware
app.use(compression())

// Request logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('combined'))
}
app.use(requestLogger)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  })
})

// API routes
app.use(`/api/${env.API_VERSION}`, apiRoutes)

// Catch 404
app.use('*', notFound)

// Global error handler
app.use(errorHandler)

export default app