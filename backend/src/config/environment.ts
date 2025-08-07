import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  API_VERSION: z.string().default('v1'),

  // Database
  DATABASE_URL: z.string(),
  DATABASE_POOL_SIZE: z.string().transform(Number).default('10'),

  // Redis
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_TTL_DEFAULT: z.string().transform(Number).default('3600'),

  // Authentication
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().email().default('noreply@footballzone.bg'),
  SUPPORT_EMAIL: z.string().email().default('support@footballzone.bg'),

  // File Storage
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Features
  ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('true'),
  ENABLE_NEWSLETTERS: z.string().transform(val => val === 'true').default('true'),
  MAX_FILE_SIZE: z.string().transform(Number).default('10485760'), // 10MB

  // CORS
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000,https://footballzone.bg'),

  // Security
  BCRYPT_SALT_ROUNDS: z.string().transform(Number).default('12'),
  SESSION_SECRET: z.string().min(32).optional(),
})

export type Environment = z.infer<typeof envSchema>

let env: Environment

try {
  env = envSchema.parse(process.env)
} catch (error) {
  console.error('❌ Invalid environment variables:', error)
  process.exit(1)
}

export default env

// Helper functions
export const isDevelopment = () => env.NODE_ENV === 'development'
export const isProduction = () => env.NODE_ENV === 'production'
export const isTest = () => env.NODE_ENV === 'test'

export const getAllowedOrigins = () => env.ALLOWED_ORIGINS.split(',')

export const getDatabaseConfig = () => ({
  url: env.DATABASE_URL,
  poolSize: env.DATABASE_POOL_SIZE,
})

export const getRedisConfig = () => ({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  defaultTTL: env.REDIS_TTL_DEFAULT,
})

export const getJWTConfig = () => ({
  secret: env.JWT_SECRET,
  refreshSecret: env.JWT_REFRESH_SECRET,
  expiry: env.JWT_EXPIRY,
  refreshExpiry: env.JWT_REFRESH_EXPIRY,
})

export const getStripeConfig = () => ({
  secretKey: env.STRIPE_SECRET_KEY,
  webhookSecret: env.STRIPE_WEBHOOK_SECRET,
  publishableKey: env.STRIPE_PUBLISHABLE_KEY,
})

export const getEmailConfig = () => ({
  apiKey: env.RESEND_API_KEY,
  fromEmail: env.FROM_EMAIL,
  supportEmail: env.SUPPORT_EMAIL,
})

export const getCloudinaryConfig = () => ({
  cloudName: env.CLOUDINARY_CLOUD_NAME,
  apiKey: env.CLOUDINARY_API_KEY,
  apiSecret: env.CLOUDINARY_API_SECRET,
})