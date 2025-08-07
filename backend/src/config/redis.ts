import Redis from 'ioredis'

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
}

class RedisClient {
  public client: Redis
  
  constructor() {
    this.client = new Redis(redisConfig)
    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.client.on('connect', () => {
      console.log('✅ Redis connected')
    })

    this.client.on('error', (error) => {
      console.error('❌ Redis error:', error)
    })

    this.client.on('ready', () => {
      console.log('🚀 Redis ready')
    })
  }

  // Cache helpers
  async get(key: string): Promise<string | null> {
    return await this.client.get(key)
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setex(key, ttl, value)
    } else {
      await this.client.set(key, value)
    }
  }

  async setJson(key: string, value: any, ttl?: number): Promise<void> {
    const jsonValue = JSON.stringify(value)
    await this.set(key, jsonValue, ttl)
  }

  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.get(key)
    if (!value) return null
    
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key)
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key)
    return result === 1
  }

  // Pattern-based deletion
  async delPattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern)
    if (keys.length > 0) {
      await this.client.del(...keys)
    }
  }

  // Rate limiting helper
  async rateLimit(key: string, limit: number, window: number): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const current = await this.client.incr(key)
    
    if (current === 1) {
      await this.client.expire(key, window)
    }

    const ttl = await this.client.ttl(key)
    const resetTime = Date.now() + (ttl * 1000)
    
    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
      resetTime
    }
  }
}

const redis = new RedisClient()

export default redis

// Graceful shutdown
process.on('SIGINT', async () => {
  await redis.client.quit()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await redis.client.quit()
  process.exit(0)
})