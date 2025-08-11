import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AppError } from '@/middleware/errorHandler'

/**
 * Middleware to validate request using Zod schemas
 */
export const validateRequest = (schema: z.ZodType<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate the request
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      })

      // Replace request data with validated data
      req.body = validatedData.body || req.body
      req.query = validatedData.query || req.query
      req.params = validatedData.params || req.params

      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format Zod validation errors
        const errorMessages = error.errors.map(err => {
          const path = err.path.join('.')
          return `${path}: ${err.message}`
        })

        next(new AppError(`Validation failed: ${errorMessages.join(', ')}`, 400))
      } else {
        next(new AppError('Request validation failed', 400))
      }
    }
  }
}

/**
 * Middleware to validate specific parts of the request
 */
export const validateBody = (schema: z.ZodType<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => {
          const path = err.path.join('.')
          return `${path}: ${err.message}`
        })
        next(new AppError(`Body validation failed: ${errorMessages.join(', ')}`, 400))
      } else {
        next(new AppError('Body validation failed', 400))
      }
    }
  }
}

export const validateQuery = (schema: z.ZodType<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = await schema.parseAsync(req.query)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => {
          const path = err.path.join('.')
          return `${path}: ${err.message}`
        })
        next(new AppError(`Query validation failed: ${errorMessages.join(', ')}`, 400))
      } else {
        next(new AppError('Query validation failed', 400))
      }
    }
  }
}

export const validateParams = (schema: z.ZodType<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = await schema.parseAsync(req.params)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => {
          const path = err.path.join('.')
          return `${path}: ${err.message}`
        })
        next(new AppError(`Params validation failed: ${errorMessages.join(', ')}`, 400))
      } else {
        next(new AppError('Params validation failed', 400))
      }
    }
  }
}

/**
 * Sanitize input to prevent XSS and other attacks
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      // Basic XSS prevention - remove dangerous characters
      return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .trim()
    } else if (Array.isArray(obj)) {
      return obj.map(sanitizeObject)
    } else if (obj !== null && typeof obj === 'object') {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value)
      }
      return sanitized
    }
    return obj
  }

  // Sanitize body, query, and params
  if (req.body) {
    req.body = sanitizeObject(req.body)
  }
  if (req.query) {
    req.query = sanitizeObject(req.query)
  }
  if (req.params) {
    req.params = sanitizeObject(req.params)
  }

  next()
}

/**
 * Validate file uploads
 */
export const validateFileUpload = (options: {
  maxSize?: number
  allowedTypes?: string[]
  required?: boolean
} = {}) => {
  const { maxSize = 10 * 1024 * 1024, allowedTypes = [], required = false } = options

  return (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[] | undefined
    const file = req.file as Express.Multer.File | undefined

    // Check if file is required
    if (required && !file && !files?.length) {
      return next(new AppError('File is required', 400))
    }

    // If no file and not required, continue
    if (!file && !files?.length) {
      return next()
    }

    // Validate single file or multiple files
    const filesToCheck = file ? [file] : files || []

    for (const fileToCheck of filesToCheck) {
      // Check file size
      if (fileToCheck.size > maxSize) {
        return next(new AppError(`File size exceeds ${maxSize} bytes`, 400))
      }

      // Check file type
      if (allowedTypes.length > 0 && !allowedTypes.includes(fileToCheck.mimetype)) {
        return next(new AppError(`File type ${fileToCheck.mimetype} not allowed`, 400))
      }
    }

    next()
  }
}

/**
 * Rate limiting for specific endpoints
 */
export const createRateLimit = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  const requests = new Map<string, { count: number; resetTime: number }>()

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown'
    const now = Date.now()
    
    // Clean up old entries
    for (const [key, value] of requests) {
      if (now > value.resetTime) {
        requests.delete(key)
      }
    }
    
    const current = requests.get(clientId) || { count: 0, resetTime: now + windowMs }
    
    if (current.count >= maxRequests && now < current.resetTime) {
      const remainingTime = Math.ceil((current.resetTime - now) / 1000 / 60)
      return next(new AppError(
        `Rate limit exceeded. Try again in ${remainingTime} minutes.`,
        429
      ))
    }
    
    current.count++
    current.resetTime = now + windowMs
    requests.set(clientId, current)
    
    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': Math.max(0, maxRequests - current.count).toString(),
      'X-RateLimit-Reset': new Date(current.resetTime).toISOString()
    })
    
    next()
  }
}