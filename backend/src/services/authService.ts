import prisma from '@/config/database'
import { jwtService, JWTPayload } from '@/utils/jwt'
import { passwordService } from '@/utils/password'
import { AppError } from '@/middleware/errorHandler'
import { UserRole } from '@prisma/client'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

interface RegisterData {
  email: string
  password: string
  name: string
  role?: UserRole
  avatarUrl?: string
  bio?: string
  acceptTerms: boolean
  subscribeNewsletter?: boolean
  referralCode?: string
}

interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
  deviceName?: string
  userAgent?: string
}

interface AuthResult {
  user: {
    id: string
    email: string
    name: string
    role: UserRole
    isActive: boolean
    emailVerified: boolean
    avatarUrl?: string | null
    bio?: string | null
    createdAt: Date
  }
  tokens: {
    accessToken: string
    refreshToken: string
    expiresAt: Date
  }
}

interface RefreshResult {
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

export class AuthService {
  
  /**
   * Register a new user
   */
  async register(registerData: RegisterData): Promise<AuthResult> {
    const { email, password, name, role = UserRole.FREE, avatarUrl, bio, acceptTerms, subscribeNewsletter, referralCode } = registerData

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      throw new AppError('User with this email already exists', 409)
    }

    // Validate password strength
    const passwordValidation = passwordService.validatePasswordStrength(password)
    if (!passwordValidation.isValid) {
      throw new AppError(`Password validation failed: ${passwordValidation.errors.join(', ')}`, 400)
    }

    // Hash password
    const passwordHash = await passwordService.hashPassword(password)

    // Handle referral code (optional)
    let referredBy: string | null = null
    if (referralCode) {
      const referrer = await prisma.user.findFirst({
        where: { 
          OR: [
            { id: referralCode },
            { email: referralCode }
          ]
        }
      })
      referredBy = referrer?.id || null
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name: name.trim(),
        role,
        avatarUrl,
        bio: bio?.trim(),
        isActive: true,
        emailVerified: false,
        acceptedTermsAt: acceptTerms ? new Date() : null,
        subscribeNewsletter: subscribeNewsletter || false,
        referredBy,
        
        // Generate email verification token
        emailVerificationToken: crypto.randomBytes(32).toString('hex'),
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        emailVerified: true,
        avatarUrl: true,
        bio: true,
        createdAt: true
      }
    })

    // Generate tokens
    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }

    const tokens = jwtService.generateTokenPair(tokenPayload)
    const expiresAt = new Date(Date.now() + jwtService.getAccessTokenExpiry() * 1000)

    // Store refresh token (optional - for token rotation)
    await this.storeRefreshToken(user.id, tokens.refreshToken)

    // TODO: Send verification email
    // await emailService.sendVerificationEmail(user.email, user.emailVerificationToken)

    return {
      user,
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt
      }
    }
  }

  /**
   * Login user
   */
  async login(loginData: LoginData): Promise<AuthResult> {
    const { email, password, rememberMe, deviceName, userAgent } = loginData

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        emailVerified: true,
        passwordHash: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        loginAttempts: true,
        lockedUntil: true
      }
    })

    if (!user) {
      throw new AppError('Invalid email or password', 401)
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (1000 * 60))
      throw new AppError(`Account is locked. Try again in ${minutesLeft} minutes.`, 423)
    }

    // Check if account is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated. Please contact support.', 403)
    }

    // Verify password
    const isPasswordValid = await passwordService.verifyPassword(password, user.passwordHash)

    if (!isPasswordValid) {
      // Increment failed login attempts
      const attempts = (user.loginAttempts || 0) + 1
      const lockUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null // Lock for 15 minutes after 5 attempts

      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: attempts,
          lockedUntil: lockUntil
        }
      })

      throw new AppError('Invalid email or password', 401)
    }

    // Reset login attempts on successful login
    if (user.loginAttempts && user.loginAttempts > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: 0,
          lockedUntil: null
        }
      })
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: '', // Will be set by controller from req.ip
      }
    })

    // Generate tokens
    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }

    const tokens = jwtService.generateTokenPair(tokenPayload)
    const expiresAt = new Date(Date.now() + jwtService.getAccessTokenExpiry() * 1000)

    // Store refresh token
    await this.storeRefreshToken(user.id, tokens.refreshToken, {
      deviceName,
      userAgent,
      rememberMe
    })

    // Create login session record
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        sessionId: uuidv4(),
        action: 'LOGIN',
        resourceType: 'AUTH',
        resourceId: null, // No specific resource for auth activities
        metadata: {
          deviceName,
          userAgent,
          rememberMe
        }
      }
    })

    const { passwordHash: _passwordHash, loginAttempts: _loginAttempts, lockedUntil: _lockedUntil, ...userWithoutSensitive } = user

    return {
      user: userWithoutSensitive,
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt
      }
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<RefreshResult> {
    try {
      // Verify refresh token
      const decoded = jwtService.verifyRefreshToken(refreshToken)

      // Check if refresh token exists and is valid
      const storedToken = await prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          userId: decoded.userId,
          expiresAt: {
            gt: new Date()
          },
          isRevoked: false
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              isActive: true
            }
          }
        }
      })

      if (!storedToken) {
        throw new AppError('Invalid refresh token', 401)
      }

      if (!storedToken.user.isActive) {
        throw new AppError('Account is deactivated', 401)
      }

      // Generate new tokens
      const tokenPayload: JWTPayload = {
        userId: storedToken.user.id,
        email: storedToken.user.email,
        role: storedToken.user.role,
        name: storedToken.user.name
      }

      const tokens = jwtService.generateTokenPair(tokenPayload)
      const expiresAt = new Date(Date.now() + jwtService.getAccessTokenExpiry() * 1000)

      // Revoke old refresh token and store new one (token rotation)
      await prisma.$transaction([
        prisma.refreshToken.update({
          where: { id: storedToken.id },
          data: { isRevoked: true }
        }),
        // Store new refresh token
        prisma.refreshToken.create({
          data: {
            token: tokens.refreshToken,
            userId: storedToken.userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            deviceName: storedToken.deviceName,
            userAgent: storedToken.userAgent
          }
        })
      ])

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt
      }

    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Token refresh failed', 401)
    }
  }

  /**
   * Logout user
   */
  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Revoke specific refresh token
      await prisma.refreshToken.updateMany({
        where: {
          token: refreshToken,
          userId: userId
        },
        data: {
          isRevoked: true
        }
      })
    } else {
      // Revoke all refresh tokens for user
      await prisma.refreshToken.updateMany({
        where: { userId },
        data: { isRevoked: true }
      })
    }

    // Log logout activity
    await prisma.userActivity.create({
      data: {
        userId,
        sessionId: uuidv4(),
        action: 'LOGOUT',
        resourceType: 'AUTH',
        resourceId: null // No specific resource for auth activities
      }
    })
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        bio: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        subscribeNewsletter: true,
        emailNotifications: true,
        pushNotifications: true
      }
    })

    if (!user) {
      throw new AppError('User not found', 404)
    }

    return user
  }

  /**
   * Store refresh token with metadata
   */
  private async storeRefreshToken(
    userId: string, 
    token: string, 
    metadata?: { deviceName?: string; userAgent?: string; rememberMe?: boolean }
  ): Promise<void> {
    // Clean up expired tokens first
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })

    // Store new refresh token
    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        deviceName: metadata?.deviceName,
        userAgent: metadata?.userAgent,
        isRevoked: false
      }
    })
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<void> {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      throw new AppError('Invalid or expired verification token', 400)
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        emailVerifiedAt: new Date()
      }
    })
  }
}

export const authService = new AuthService()