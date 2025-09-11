import { Request, Response, NextFunction } from 'express'
import { performance } from 'perf_hooks'
import { performanceService } from '@/services/performanceService'
import redis from '@/config/redis'

interface RequestMetrics {
  method: string
  url: string
  statusCode: number
  duration: number
  timestamp: Date
  userAgent?: string
  ipAddress?: string
  userId?: string
}

// Performance monitoring middleware
export const performanceMonitoring = (req: Request, res: Response, next: NextFunction) => {
  const startTime = performance.now()
  const timestamp = new Date()

  // Track request start
  const originalSend = res.send
  const originalJson = res.json

  let _responseBody: any
  let responseSent = false

  // Override response methods to capture metrics
  res.send = function(body: any) {
    if (!responseSent) {
      _responseBody = body
      captureMetrics()
      responseSent = true
    }
    return originalSend.call(this, body)
  }

  res.json = function(body: any) {
    if (!responseSent) {
      _responseBody = body
      captureMetrics()
      responseSent = true
    }
    return originalJson.call(this, body)
  }

  // Capture response finish event as fallback
  res.on('finish', () => {
    if (!responseSent) {
      captureMetrics()
      responseSent = true
    }
  })

  function captureMetrics() {
    const duration = performance.now() - startTime
    const metrics: RequestMetrics = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      timestamp,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
      userId: req.user?.id
    }

    // Track in performance service
    performanceService.trackRequest(duration)

    // Log slow requests
    if (duration > 1000) { // >1 second
      console.warn(`Slow request: ${req.method} ${req.originalUrl} took ${duration.toFixed(2)}ms`)
    }

    // Track endpoint-specific metrics
    trackEndpointMetrics(metrics)

    // Track user activity patterns
    if (req.user?.id) {
      trackUserActivity(req.user.id, metrics)
    }
  }

  next()
}

// Response compression middleware
export const compressionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json

  res.json = function(body: any) {
    // Only compress large responses
    const bodyString = JSON.stringify(body)
    const shouldCompress = bodyString.length > 1000 && 
                          req.headers['accept-encoding']?.includes('gzip')

    if (shouldCompress) {
      res.setHeader('Content-Encoding', 'gzip')
      const zlib = require('zlib')
      const compressed = zlib.gzipSync(bodyString)
      res.setHeader('Content-Length', compressed.length)
      return res.send(compressed)
    }

    return originalJson.call(this, body)
  }

  next()
}

// Rate limiting with performance awareness
export const smartRateLimit = (windowMs: number, maxRequests: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `rate_limit:${req.ip}`
    const now = Date.now()
    const windowStart = now - windowMs

    try {
      // Remove old entries
      await redis.client?.zremrangebyscore(key, 0, windowStart)
      
      // Count current requests
      const currentRequests = await redis.client?.zcard(key) || 0
      
      if (currentRequests >= maxRequests) {
        // Check system load - allow more requests if system is healthy
        const systemMetrics = await performanceService.getPerformanceMetrics()
        const canBypass = systemMetrics.averageResponseTime < 200 && 
                         systemMetrics.memoryUsage.heapUsed < 100 * 1024 * 1024 // 100MB

        if (!canBypass) {
          return res.status(429).json({
            success: false,
            message: 'Too many requests, please try again later.',
            retryAfter: Math.ceil(windowMs / 1000)
          })
        }
      }

      // Add current request
      await redis.client?.zadd(key, now, `${now}-${Math.random()}`)
      await redis.client?.expire(key, Math.ceil(windowMs / 1000))

      return next()
    } catch (error) {
      console.error('Rate limiting error:', error)
      return next() // Allow request to proceed on error
    }
  }
}

// Database query optimization middleware
export const queryOptimization = (req: Request, res: Response, next: NextFunction) => {
  // Add query hints based on request patterns
  if (req.originalUrl.includes('/articles') && req.method === 'GET') {
    // Suggest including commonly requested relations
    if (!req.query.include && !req.originalUrl.includes('/search')) {
      req.query.include = 'author,zones'
    }
  }

  // Optimize pagination parameters
  if (req.query.page) {
    const page = parseInt(req.query.page as string)
    const limit = parseInt(req.query.limit as string) || 10
    
    // Prevent excessive pagination
    if (page * limit > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Pagination offset too large. Please use cursor-based pagination for deep results.'
      })
    }
  }

  return next()
}

// Memory monitoring middleware
export const memoryMonitoring = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send
  
  res.send = function(body: any) {
    // Check memory usage after response
    process.nextTick(() => {
      const memUsage = process.memoryUsage()
      const memoryThreshold = 200 * 1024 * 1024 // 200MB heap threshold
      
      if (memUsage.heapUsed > memoryThreshold) {
        console.warn(`High memory usage detected: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB heap used`)
        
        // Trigger garbage collection if available
        if (global.gc) {
          global.gc()
          console.log('Forced garbage collection')
        }
      }
    })
    
    return originalSend.call(this, body)
  }

  next()
}

// Request context enhancement
export const contextEnhancement = (req: Request, res: Response, next: NextFunction) => {
  // Add request ID for tracing
  req.headers['x-request-id'] = req.headers['x-request-id'] || 
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Add timing information
  ;(req as any).startTime = performance.now()

  // Enhance response with performance headers
  res.setHeader('X-Request-ID', req.headers['x-request-id'])
  
  const originalEnd = res.end
  res.end = function(this: any, chunk?: any, encoding?: any, cb?: any) {
    const duration = performance.now() - (req as any).startTime
    res.setHeader('X-Response-Time', `${duration.toFixed(2)}ms`)
    
    return originalEnd.call(this as any, chunk, encoding, cb)
  } as any

  next()
}

// Helper functions
async function trackEndpointMetrics(metrics: RequestMetrics) {
  const endpointKey = `endpoint:${metrics.method}:${metrics.url.split('?')[0]}`
  const metricsKey = `metrics:${endpointKey}`
  
  try {
    // Update endpoint statistics
    await redis.client?.hincrby(metricsKey, 'count', 1)
    await redis.client?.hincrby(metricsKey, 'total_duration', Math.round(metrics.duration))
    
    // Track status codes
    await redis.client?.hincrby(metricsKey, `status_${metrics.statusCode}`, 1)
    
    // Update min/max response times
    const currentMin = await redis.client?.hget(metricsKey, 'min_duration')
    const currentMax = await redis.client?.hget(metricsKey, 'max_duration')
    
    if (!currentMin || metrics.duration < parseFloat(currentMin)) {
      await redis.client?.hset(metricsKey, 'min_duration', metrics.duration.toFixed(2))
    }
    
    if (!currentMax || metrics.duration > parseFloat(currentMax)) {
      await redis.client?.hset(metricsKey, 'max_duration', metrics.duration.toFixed(2))
    }
    
    // Set expiration for cleanup
    await redis.client?.expire(metricsKey, 7 * 24 * 60 * 60) // 7 days
    
  } catch (error) {
    console.error('Error tracking endpoint metrics:', error)
  }
}

async function trackUserActivity(userId: string, metrics: RequestMetrics) {
  const userKey = `user_activity:${userId}`
  const timestamp = Math.floor(Date.now() / 1000)
  
  try {
    // Track recent activity (sliding window)
    await redis.client?.zadd(userKey, timestamp, `${timestamp}-${metrics.method}-${metrics.url}`)
    
    // Keep only last 24 hours of activity
    const oneDayAgo = timestamp - (24 * 60 * 60)
    await redis.client?.zremrangebyscore(userKey, 0, oneDayAgo)
    
    await redis.client?.expire(userKey, 7 * 24 * 60 * 60) // 7 days
    
  } catch (error) {
    console.error('Error tracking user activity:', error)
  }
}

// Endpoint performance analyzer
export async function getEndpointPerformance(endpoint?: string): Promise<any> {
  if (endpoint) {
    const metricsKey = `metrics:${endpoint}`
    const metrics = await redis.client?.hgetall(metricsKey) || {}
    
    if (Object.keys(metrics).length === 0) {
      return null
    }
    
    const count = parseInt(metrics.count || '0')
    const totalDuration = parseFloat(metrics.total_duration || '0')
    
    return {
      endpoint,
      requestCount: count,
      averageResponseTime: count > 0 ? totalDuration / count : 0,
      minResponseTime: parseFloat(metrics.min_duration || '0'),
      maxResponseTime: parseFloat(metrics.max_duration || '0'),
      statusCodes: Object.keys(metrics)
        .filter(key => key.startsWith('status_'))
        .reduce((acc, key) => {
          const status = key.replace('status_', '')
          acc[status] = parseInt(metrics[key])
          return acc
        }, {} as Record<string, number>)
    }
  }

  // Get all endpoints
  const pattern = 'metrics:endpoint:*'
  const keys = await redis.client?.keys(pattern) || []
  const results = []
  
  for (const key of keys) {
    const endpoint = key.replace('metrics:', '')
    const performance = await getEndpointPerformance(endpoint)
    if (performance) {
      results.push(performance)
    }
  }
  
  return results.sort((a, b) => b.requestCount - a.requestCount).slice(0, 20)
}