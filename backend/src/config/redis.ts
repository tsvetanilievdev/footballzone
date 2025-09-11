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
  public client: Redis | null
  private isConnected: boolean = false
  private connectionTimeout: NodeJS.Timeout | null = null
  
  constructor() {
    this.client = null
    this.initializeRedis()
  }

  private async initializeRedis() {
    try {
      this.client = new Redis(redisConfig)
      this.setupEventHandlers()

      // Test connection with timeout
      this.connectionTimeout = setTimeout(() => {
        console.warn('⚠️  Redis connection timeout - running without cache')
        this.isConnected = false
      }, 5000)

      // Test connection
      await this.client.ping()
      
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout)
        this.connectionTimeout = null
      }
      
      this.isConnected = true
      console.log('✅ Redis connected and ready')
    } catch (error: any) {
      console.warn('⚠️  Redis unavailable - running without cache:', error?.message || error)
      this.isConnected = false
      if (this.client) {
        this.client.disconnect()
        this.client = null
      }
    }
  }

  private setupEventHandlers() {
    if (!this.client) return

    this.client.on('connect', () => {
      console.log('✅ Redis connected')
      this.isConnected = true
    })

    this.client.on('error', (error) => {
      console.warn('⚠️  Redis error - falling back to no cache:', error.message)
      this.isConnected = false
    })

    this.client.on('ready', () => {
      console.log('🚀 Redis ready')
      this.isConnected = true
    })

    this.client.on('close', () => {
      console.warn('⚠️  Redis connection closed')
      this.isConnected = false
    })
  }

  // Cache helpers with fallback
  async get(key: string): Promise<string | null> {
    if (!this.isConnected || !this.client) {
      return null
    }
    
    try {
      return await this.client.get(key)
    } catch (error: any) {
      console.warn(`Redis get failed for key ${key}:`, error?.message || error)
      return null
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.isConnected || !this.client) {
      return
    }
    
    try {
      if (ttl) {
        await this.client.setex(key, ttl, value)
      } else {
        await this.client.set(key, value)
      }
    } catch (error: any) {
      console.warn(`Redis set failed for key ${key}:`, error?.message || error)
    }
  }

  async setJson(key: string, value: any, ttl?: number): Promise<void> {
    if (!this.isConnected || !this.client) {
      return
    }
    
    try {
      const jsonValue = JSON.stringify(value)
      await this.set(key, jsonValue, ttl)
    } catch (error: any) {
      console.warn(`Redis setJson failed for key ${key}:`, error?.message || error)
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.client) {
      return null
    }
    
    try {
      const value = await this.get(key)
      if (!value) return null
      
      return JSON.parse(value) as T
    } catch (error: any) {
      console.warn(`Redis getJson failed for key ${key}:`, error?.message || error)
      return null
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected || !this.client) {
      return
    }
    
    try {
      await this.client.del(key)
    } catch (error: any) {
      console.warn(`Redis del failed for key ${key}:`, error?.message || error)
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false
    }
    
    try {
      const result = await this.client.exists(key)
      return result === 1
    } catch (error: any) {
      console.warn(`Redis exists failed for key ${key}:`, error?.message || error)
      return false
    }
  }

  // Pattern-based deletion
  async delPattern(pattern: string): Promise<void> {
    if (!this.isConnected || !this.client) {
      return
    }
    
    try {
      const keys = await this.client.keys(pattern)
      if (keys.length > 0) {
        await this.client.del(...keys)
      }
    } catch (error: any) {
      console.warn(`Redis delPattern failed for pattern ${pattern}:`, error?.message || error)
    }
  }

  // Rate limiting helper
  async rateLimit(key: string, limit: number, window: number): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    if (!this.isConnected || !this.client) {
      // When Redis is not available, allow all requests
      return {
        allowed: true,
        remaining: limit,
        resetTime: Date.now() + (window * 1000)
      }
    }
    
    try {
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
    } catch (error: any) {
      console.warn(`Redis rateLimit failed for key ${key}:`, error?.message || error)
      // Fallback to allowing the request
      return {
        allowed: true,
        remaining: limit,
        resetTime: Date.now() + (window * 1000)
      }
    }
  }

  // Additional Redis methods needed by services
  async zrangebyscore(key: string, min: number, max: number, ...args: any[]): Promise<string[]> {
    if (!this.isConnected || !this.client) {
      return []
    }
    
    try {
      return await this.client.zrangebyscore(key, min, max, ...args) as string[]
    } catch (error: any) {
      console.warn(`Redis zrangebyscore failed for key ${key}:`, error?.message || error)
      return []
    }
  }

  async zrem(key: string, ...members: string[]): Promise<number> {
    if (!this.isConnected || !this.client) {
      return 0
    }
    
    try {
      return await this.client.zrem(key, ...members)
    } catch (error: any) {
      console.warn(`Redis zrem failed for key ${key}:`, error?.message || error)
      return 0
    }
  }

  async hmget(key: string, ...fields: string[]): Promise<(string | null)[]> {
    if (!this.isConnected || !this.client) {
      return fields.map(() => null)
    }
    
    try {
      return await this.client.hmget(key, ...fields)
    } catch (error: any) {
      console.warn(`Redis hmget failed for key ${key}:`, error?.message || error)
      return fields.map(() => null)
    }
  }

  async hmset(key: string, ...args: (string | number)[]): Promise<'OK'> {
    if (!this.isConnected || !this.client) {
      return 'OK'
    }
    
    try {
      return await this.client.hmset(key, ...args)
    } catch (error: any) {
      console.warn(`Redis hmset failed for key ${key}:`, error?.message || error)
      return 'OK'
    }
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (!this.isConnected || !this.client) {
      return 0
    }
    
    try {
      return await this.client.expire(key, seconds)
    } catch (error: any) {
      console.warn(`Redis expire failed for key ${key}:`, error?.message || error)
      return 0
    }
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    if (!this.isConnected || !this.client) {
      return 0
    }
    
    try {
      return await this.client.sadd(key, ...members)
    } catch (error: any) {
      console.warn(`Redis sadd failed for key ${key}:`, error?.message || error)
      return 0
    }
  }

  async sismember(key: string, member: string): Promise<number> {
    if (!this.isConnected || !this.client) {
      return 0
    }
    
    try {
      return await this.client.sismember(key, member)
    } catch (error: any) {
      console.warn(`Redis sismember failed for key ${key}:`, error?.message || error)
      return 0
    }
  }

  async zadd(key: string, ...args: (string | number)[]): Promise<number> {
    if (!this.isConnected || !this.client) {
      return 0
    }
    
    try {
      return await this.client.zadd(key, ...args)
    } catch (error: any) {
      console.warn(`Redis zadd failed for key ${key}:`, error?.message || error)
      return 0
    }
  }

  async hincrby(key: string, field: string, increment: number): Promise<number> {
    if (!this.isConnected || !this.client) {
      return 0
    }
    
    try {
      return await this.client.hincrby(key, field, increment)
    } catch (error: any) {
      console.warn(`Redis hincrby failed for key ${key}:`, error?.message || error)
      return 0
    }
  }

  async smembers(key: string): Promise<string[]> {
    if (!this.isConnected || !this.client) {
      return []
    }
    
    try {
      return await this.client.smembers(key)
    } catch (error: any) {
      console.warn(`Redis smembers failed for key ${key}:`, error?.message || error)
      return []
    }
  }

  async incr(key: string): Promise<number> {
    if (!this.isConnected || !this.client) {
      return 1
    }
    
    try {
      return await this.client.incr(key)
    } catch (error: any) {
      console.warn(`Redis incr failed for key ${key}:`, error?.message || error)
      return 1
    }
  }

  async ttl(key: string): Promise<number> {
    if (!this.isConnected || !this.client) {
      return -1
    }
    
    try {
      return await this.client.ttl(key)
    } catch (error: any) {
      console.warn(`Redis ttl failed for key ${key}:`, error?.message || error)
      return -1
    }
  }

  // Health check method
  isHealthy(): boolean {
    return this.isConnected
  }
}

const redis = new RedisClient()

export default redis

// Graceful shutdown
process.on('SIGINT', async () => {
  if (redis.client && redis.isHealthy()) {
    await redis.client.quit()
  }
  process.exit(0)
})

process.on('SIGTERM', async () => {
  if (redis.client && redis.isHealthy()) {
    await redis.client.quit()
  }
  process.exit(0)
})