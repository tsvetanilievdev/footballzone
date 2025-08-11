import { Request, Response, NextFunction } from 'express'
import { authService } from '@/services/authService'
import { AppError } from '@/middleware/errorHandler'

/**
 * Register new user
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const registerData = req.body
    
    const result = await authService.register(registerData)

    // Set HTTP-only cookie for refresh token (more secure)
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        expiresAt: result.tokens.expiresAt
      }
    })

    // Emit success event for rate limiting
    req.emit('authSuccess')

  } catch (error) {
    // Emit failure event for rate limiting
    req.emit('authFailed')
    next(error)
  }
}

/**
 * Login user
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginData = {
      ...req.body,
      userAgent: req.get('User-Agent'),
    }

    const result = await authService.login(loginData)

    // Update user's last login IP
    // This is done in the service, but we can also set it here from req.ip
    
    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        expiresAt: result.tokens.expiresAt
      }
    })

    // Emit success event for rate limiting
    req.emit('authSuccess')

  } catch (error) {
    // Emit failure event for rate limiting
    req.emit('authFailed')
    next(error)
  }
}

/**
 * Refresh access token
 */
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Try to get refresh token from cookie first, then from body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!refreshToken) {
      throw new AppError('Refresh token required', 401)
    }

    const result = await authService.refreshToken(refreshToken)

    // Set new refresh token cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: result.accessToken,
        expiresAt: result.expiresAt
      }
    })

  } catch (error) {
    // Clear invalid refresh token cookie
    res.clearCookie('refreshToken')
    next(error)
  }
}

/**
 * Logout user
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken
    const logoutAll = req.body.logoutAll || false

    if (req.user) {
      await authService.logout(req.user.userId, logoutAll ? undefined : refreshToken)
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken')

    res.json({
      success: true,
      message: logoutAll ? 'Logged out from all devices' : 'Logout successful'
    })

  } catch (error) {
    // Clear cookie anyway
    res.clearCookie('refreshToken')
    next(error)
  }
}

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401)
    }

    const profile = await authService.getProfile(req.user.userId)

    res.json({
      success: true,
      data: profile
    })

  } catch (error) {
    next(error)
  }
}

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401)
    }

    // This will be implemented when we add user update service
    throw new AppError('Profile update not implemented yet', 501)

  } catch (error) {
    next(error)
  }
}

/**
 * Change password
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401)
    }

    // This will be implemented when we add password change service
    throw new AppError('Password change not implemented yet', 501)

  } catch (error) {
    next(error)
  }
}

/**
 * Verify email address
 */
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params

    await authService.verifyEmail(token)

    res.json({
      success: true,
      message: 'Email verified successfully'
    })

  } catch (error) {
    next(error)
  }
}

/**
 * Resend email verification
 */
export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // This will be implemented when we add email service
    throw new AppError('Email verification not implemented yet', 501)

  } catch (error) {
    next(error)
  }
}

/**
 * Forgot password
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // This will be implemented when we add email service
    throw new AppError('Password reset not implemented yet', 501)

  } catch (error) {
    next(error)
  }
}

/**
 * Reset password
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // This will be implemented when we add email service
    throw new AppError('Password reset not implemented yet', 501)

  } catch (error) {
    next(error)
  }
}

/**
 * Get user sessions (for security dashboard)
 */
export const getSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401)
    }

    // This will be implemented for session management
    throw new AppError('Session management not implemented yet', 501)

  } catch (error) {
    next(error)
  }
}

/**
 * Revoke specific session
 */
export const revokeSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401)
    }

    // This will be implemented for session management
    throw new AppError('Session management not implemented yet', 501)

  } catch (error) {
    next(error)
  }
}