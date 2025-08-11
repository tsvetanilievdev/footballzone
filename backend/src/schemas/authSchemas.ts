import { z } from 'zod'
import { UserRole } from '@prisma/client'

// Password validation schema with strength requirements
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')

// Email validation schema
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(1, 'Email is required')
  .max(255, 'Email must not exceed 255 characters')

// Name validation schema
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters long')
  .max(100, 'Name must not exceed 100 characters')
  .regex(/^[a-zA-ZàáâäčđèéêëìíîïñòóôöšüùúûýžА-Яа-я\s'-]+$/, 'Name contains invalid characters')

// Registration schema
export const registerSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema,
    role: z.nativeEnum(UserRole).default(UserRole.FREE).optional(),
    
    // Optional fields
    avatarUrl: z.string().url().optional(),
    bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
    
    // Terms acceptance
    acceptTerms: z.boolean().refine(val => val === true, {
      message: 'You must accept the terms and conditions'
    }),
    
    // Optional newsletter subscription
    subscribeNewsletter: z.boolean().default(false).optional(),
    
    // Referral code (optional)
    referralCode: z.string().max(50).optional(),
  })
})

// Login schema
export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
    
    // Remember me option
    rememberMe: z.boolean().default(false).optional(),
    
    // Device info for security
    deviceName: z.string().max(100).optional(),
    userAgent: z.string().max(500).optional(),
  })
})

// Refresh token schema
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
  })
})

// Forgot password schema
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema
  })
})

// Reset password schema
export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string()
  }),
  params: z.object({
    token: z.string().optional() // Can also be in URL params
  })
}).refine(data => data.body.password === data.body.confirmPassword, {
  message: "Passwords don't match",
  path: ['body', 'confirmPassword']
})

// Change password schema (for authenticated users)
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string()
  })
}).refine(data => data.body.newPassword === data.body.confirmPassword, {
  message: "New passwords don't match",
  path: ['body', 'confirmPassword']
})

// Update profile schema
export const updateProfileSchema = z.object({
  body: z.object({
    name: nameSchema.optional(),
    bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
    avatarUrl: z.string().url().optional(),
    
    // Notification preferences
    emailNotifications: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
    marketingEmails: z.boolean().optional(),
    
    // Privacy settings
    profilePublic: z.boolean().optional(),
    showEmail: z.boolean().optional(),
  })
})

// Email verification schema
export const verifyEmailSchema = z.object({
  params: z.object({
    token: z.string().min(1, 'Verification token is required')
  })
})

// Resend verification schema
export const resendVerificationSchema = z.object({
  body: z.object({
    email: emailSchema
  })
})

// Logout schema (for logging out from all devices)
export const logoutSchema = z.object({
  body: z.object({
    logoutAll: z.boolean().default(false).optional()
  })
})

// Admin user creation schema
export const createUserSchema = z.object({
  body: z.object({
    email: emailSchema,
    name: nameSchema,
    role: z.nativeEnum(UserRole).default(UserRole.FREE),
    password: passwordSchema.optional(), // Optional - can send invite email instead
    
    // Admin-only fields
    isActive: z.boolean().default(true).optional(),
    emailVerified: z.boolean().default(false).optional(),
    
    // Send invitation email instead of password
    sendInvite: z.boolean().default(false).optional(),
  })
})

// Admin user update schema
export const updateUserSchema = z.object({
  body: z.object({
    name: nameSchema.optional(),
    role: z.nativeEnum(UserRole).optional(),
    isActive: z.boolean().optional(),
    emailVerified: z.boolean().optional(),
    
    // Reset password flag
    resetPassword: z.boolean().default(false).optional(),
  }),
  params: z.object({
    userId: z.string().uuid('Invalid user ID format')
  })
})

// Query schemas for user listing
export const getUsersSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).default('1'),
    limit: z.string().transform(Number).default('20'),
    role: z.nativeEnum(UserRole).optional(),
    search: z.string().max(100).optional(),
    isActive: z.string().transform(val => val === 'true').optional(),
    emailVerified: z.string().transform(val => val === 'true').optional(),
    sortBy: z.enum(['createdAt', 'name', 'email', 'role']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
})

// Two-factor authentication schemas (for future implementation)
export const enableTwoFactorSchema = z.object({
  body: z.object({
    password: z.string().min(1, 'Password is required for 2FA setup')
  })
})

export const verifyTwoFactorSchema = z.object({
  body: z.object({
    token: z.string().length(6, '2FA token must be 6 digits'),
    code: z.string().min(1, 'Verification code is required')
  })
})

// Type exports for TypeScript usage
export type RegisterRequest = z.infer<typeof registerSchema>
export type LoginRequest = z.infer<typeof loginSchema>
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>
export type CreateUserRequest = z.infer<typeof createUserSchema>
export type UpdateUserRequest = z.infer<typeof updateUserSchema>
export type GetUsersRequest = z.infer<typeof getUsersSchema>