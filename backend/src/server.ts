import app from './app'
import env from '@/config/environment'
import prisma from '@/config/database'
import redis from '@/config/redis'

const PORT = env.PORT

// Test database connection
async function connectDatabase() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }
}

// Test Redis connection
async function _connectRedis() {
  try {
    await redis.client.ping()
    console.log('✅ Redis connected successfully')
  } catch (error) {
    console.error('❌ Redis connection failed:', error)
    // Don't exit - Redis is not critical for basic functionality
  }
}

async function startServer() {
  // Connect to databases
  await connectDatabase()
  // Redis is optional for now
  // await connectRedis()

  // Start HTTP server
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📍 Environment: ${env.NODE_ENV}`)
    console.log(`🌐 Health check: http://localhost:${PORT}/health`)
    console.log(`📚 API Base URL: http://localhost:${PORT}/api/${env.API_VERSION}`)
  })

  // Graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`)
    
    server.close(async () => {
      console.log('HTTP server closed')
      
      try {
        await prisma.$disconnect()
        console.log('Database disconnected')
        
        await redis.client.quit()
        console.log('Redis disconnected')
        
        console.log('Graceful shutdown completed')
        process.exit(0)
      } catch (error) {
        console.error('Error during shutdown:', error)
        process.exit(1)
      }
    })

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down')
      process.exit(1)
    }, 10000)
  }

  // Handle shutdown signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
  process.on('SIGINT', () => gracefulShutdown('SIGINT'))

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error)
    gracefulShutdown('UNCAUGHT_EXCEPTION')
  })

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    gracefulShutdown('UNHANDLED_REJECTION')
  })

  return server
}

// Start the server
if (require.main === module) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error)
    process.exit(1)
  })
}

export { startServer }
export default app