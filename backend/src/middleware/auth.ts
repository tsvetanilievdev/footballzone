import { Request, Response, NextFunction } from 'express'
import { jwtService } from '@/utils/jwt'
import { AppError } from '@/middleware/errorHandler'
import { UserRole } from '@prisma/client'
import prisma from '@/config/database'

// Note: Request interface extended in @/types/api.ts

/**
 * Authentication middleware - verifies JWT token
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = jwtService.extractTokenFromHeader(authHeader)

    if (!token) {
      throw new AppError('Access token required', 401)
    }

    // Verify token
    const decoded = jwtService.verifyAccessToken(token)

    // Optional: Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        emailVerified: true
      }
    })

    if (!user) {
      throw new AppError('User not found', 401)
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401)
    }

    // Add user to request object
    req.user = {
      userId: user.id,
      id: user.id, // for backward compatibility
      email: user.email,
      role: user.role,
      name: user.name
    }

    next()
  } catch (error: any) {
    if (error instanceof AppError) {
      next(error)
    } else {
      // JWT-specific errors
      if (error.message.includes('expired')) {
        next(new AppError('Access token expired', 401))
      } else if (error.message.includes('invalid') || error.message.includes('malformed')) {
        next(new AppError('Invalid access token', 401))
      } else {
        next(new AppError('Authentication failed', 401))
      }
    }
  }
}

/**
 * Authorization middleware - checks user roles
 */
export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401)
      }

      const userRole = req.user.role

      if (!allowedRoles.includes(userRole)) {
        throw new AppError(
          `Access denied. Required roles: ${allowedRoles.join(', ')}`, 
          403
        )
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = jwtService.extractTokenFromHeader(authHeader)

    if (token) {
      try {
        const decoded = jwtService.verifyAccessToken(token)
        
        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true
          }
        })

        if (user && user.isActive) {
          req.user = {
            userId: user.id,
            id: user.id, // for backward compatibility
            email: user.email,
            role: user.role,
            name: user.name
          }
        }
      } catch {
        // Ignore token errors in optional auth
        // req.user remains undefined
      }
    }

    next()
  } catch (error) {
    // Don't block request on optional auth errors
    next()
  }
}

/**
 * Admin only authorization helper
 */
export const requireAdmin = authorize([UserRole.ADMIN])

/**
 * Coach or Admin authorization helper  
 */
export const requireCoachOrAdmin = authorize([UserRole.COACH, UserRole.ADMIN])

/**
 * Any authenticated user authorization helper
 */
export const requireAuth = authorize([UserRole.FREE, UserRole.PLAYER, UserRole.COACH, UserRole.PARENT, UserRole.ADMIN])

/**
 * Premium user authorization helper
 */
export const requirePremium = authorize([UserRole.PLAYER, UserRole.COACH, UserRole.PARENT, UserRole.ADMIN])

/**
 * Rate limiting for authentication endpoints
 */
export const authRateLimit = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
  const attempts = new Map<string, { count: number; resetTime: number }>()

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown'
    const now = Date.now()
    
    // Clean up old entries
    for (const [key, value] of attempts) {
      if (now > value.resetTime) {
        attempts.delete(key)
      }
    }
    
    const current = attempts.get(clientId) || { count: 0, resetTime: now + windowMs }
    
    if (current.count >= maxAttempts && now < current.resetTime) {
      const remainingTime = Math.ceil((current.resetTime - now) / 1000 / 60)
      throw new AppError(
        `Too many authentication attempts. Try again in ${remainingTime} minutes.`,
        429
      )
    }
    
    // Increment counter on auth failures (handled in auth controller)
    req.on('authFailed', () => {
      current.count++
      current.resetTime = now + windowMs
      attempts.set(clientId, current)
    })
    
    // Reset counter on successful auth
    req.on('authSuccess', () => {
      attempts.delete(clientId)
    })
    
    next()
  }
}

/**
 * CORS helper for auth endpoints
 */
export const authCORS = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
}