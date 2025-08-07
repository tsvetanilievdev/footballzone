import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'

declare global {
  namespace Express {
    interface Request {
      correlationId: string
    }
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Generate correlation ID for request tracking
  const correlationId = uuidv4()
  req.correlationId = correlationId
  
  // Add correlation ID to response headers
  res.setHeader('X-Correlation-ID', correlationId)
  
  const start = Date.now()
  
  // Log request
  console.log(`[${correlationId}] ${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  })
  
  // Override res.json to log responses
  const originalJson = res.json
  res.json = function(data) {
    const duration = Date.now() - start
    
    console.log(`[${correlationId}] Response: ${res.statusCode} (${duration}ms)`)
    
    // Call original json method
    return originalJson.call(this, data)
  }
  
  next()
}