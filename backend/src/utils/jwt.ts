import jwt from 'jsonwebtoken'
import { getJWTConfig } from '@/config/environment'
import { UserRole } from '@prisma/client'

interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  name: string
}

interface RefreshTokenPayload {
  userId: string
  tokenVersion?: number
}

export class JWTService {
  private static instance: JWTService
  private jwtConfig = getJWTConfig()

  static getInstance(): JWTService {
    if (!JWTService.instance) {
      JWTService.instance = new JWTService()
    }
    return JWTService.instance
  }

  /**
   * Generate access token (short-lived)
   */
  generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.jwtConfig.secret, {
      expiresIn: this.jwtConfig.expiry,
      issuer: 'footballzone-api',
      audience: 'footballzone-client'
    } as jwt.SignOptions)
  }

  /**
   * Generate refresh token (long-lived)
   */
  generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, this.jwtConfig.refreshSecret, {
      expiresIn: this.jwtConfig.refreshExpiry,
      issuer: 'footballzone-api',
      audience: 'footballzone-client'
    } as jwt.SignOptions)
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.jwtConfig.secret, {
        issuer: 'footballzone-api',
        audience: 'footballzone-client'
      }) as JWTPayload
      
      return decoded
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token expired')
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid access token')
      } else {
        throw new Error('Token verification failed')
      }
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      const decoded = jwt.verify(token, this.jwtConfig.refreshSecret, {
        issuer: 'footballzone-api',
        audience: 'footballzone-client'
      }) as RefreshTokenPayload
      
      return decoded
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired')
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token')
      } else {
        throw new Error('Refresh token verification failed')
      }
    }
  }

  /**
   * Extract token from Authorization header
   */
  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    
    return authHeader.substring(7) // Remove 'Bearer ' prefix
  }

  /**
   * Generate token pair
   */
  generateTokenPair(userPayload: JWTPayload): { accessToken: string; refreshToken: string } {
    const accessToken = this.generateAccessToken(userPayload)
    const refreshToken = this.generateRefreshToken({ 
      userId: userPayload.userId 
    })

    return { accessToken, refreshToken }
  }

  /**
   * Get token expiry time in seconds
   */
  getAccessTokenExpiry(): number {
    const expiry = this.jwtConfig.expiry
    
    // Parse expiry string (e.g., '15m', '1h', '7d')
    if (expiry.endsWith('m')) {
      return parseInt(expiry) * 60
    } else if (expiry.endsWith('h')) {
      return parseInt(expiry) * 60 * 60
    } else if (expiry.endsWith('d')) {
      return parseInt(expiry) * 24 * 60 * 60
    } else if (expiry.endsWith('s')) {
      return parseInt(expiry)
    }
    
    // Default to seconds if no unit specified
    return parseInt(expiry) || 900 // 15 minutes default
  }
}

export const jwtService = JWTService.getInstance()
export type { JWTPayload, RefreshTokenPayload }