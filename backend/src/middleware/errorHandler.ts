import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import env from '@/config/environment'

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export const createError = (message: string, statusCode: number) => {
  return new AppError(message, statusCode)
}

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404)
  next(error)
}

export const errorHandler = (
  error: Error | AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let err: AppError
  
  if (error instanceof AppError) {
    err = error
  } else {
    err = new AppError(error.message, 500)
  }

  // Log error
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  })

  // Zod validation error
  if (error instanceof ZodError) {
    const message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    err = new AppError(`Validation Error: ${message}`, 400)
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        const field = (error.meta?.target as string[])?.join(', ') || 'field'
        err = new AppError(`${field} already exists`, 409)
        break
      case 'P2025':
        // Record not found
        err = new AppError('Record not found', 404)
        break
      case 'P2003':
        // Foreign key constraint violation
        err = new AppError('Related record not found', 400)
        break
      default:
        err = new AppError('Database error', 500)
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    err = new AppError('Invalid data provided', 400)
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    err = new AppError('Invalid token', 401)
  }

  if (error.name === 'TokenExpiredError') {
    err = new AppError('Token expired', 401)
  }

  // Multer errors (file upload)
  if (error.name === 'MulterError') {
    if (error.message === 'File too large') {
      err = new AppError('File too large', 413)
    } else {
      err = new AppError('File upload error', 400)
    }
  }

  // Use default status code if not AppError instance
  const statusCode = err.statusCode || 500

  // Send error response
  const response: any = {
    success: false,
    error: {
      message: err.message,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  }

  // Add validation details for development
  if (env.NODE_ENV === 'development' && error instanceof ZodError) {
    response.error.validation = error.errors
  }

  res.status(statusCode).json(response)
}