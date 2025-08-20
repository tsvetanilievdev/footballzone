import db from '../config/database'
import redis from '../config/redis'
import { ArticleCategory, ArticleStatus, UserRole, ZoneType } from '@prisma/client'
import { PasswordService } from '@/utils/password'

interface AdminArticleFilters {
  page: number
  limit: number
  status?: string
  zone?: string
  category?: string
  author?: string
}

interface AdminUserFilters {
  page: number
  limit: number
  role?: string
  status?: string
  searchTerm?: string
}

interface AnalyticsFilters {
  period: string
  startDate?: string
  endDate?: string
  zone?: string
}

export class AdminService {
  private passwordService = PasswordService.getInstance()

  /**
   * Get articles for admin management with advanced filtering
   */
  async getAdminArticles(filters: AdminArticleFilters) {
    const { page, limit, status, zone, category, author } = filters
    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (status) {
      where.status = status as ArticleStatus
    }
    
    if (category) {
      where.category = category as ArticleCategory
    }
    
    if (author) {
      where.authorId = author
    }

    // If zone filter is specified, join with ArticleZone
    if (zone) {
      where.zones = {
        some: {
          zone: zone as ZoneType,
          visible: true
        }
      }
    }

    try {
      // Get total count
      const total = await db.article.count({ where })

      // Get articles with author and zone information
      const articles = await db.article.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: {
          updatedAt: 'desc'
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          zones: {
            select: {
              zone: true,
              visible: true,
              requiresSubscription: true
            }
          },
          _count: {
            select: {
              views: true
            }
          }
        }
      })

      // Transform for admin interface
      const transformedArticles = articles.map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        author: {
          name: article.author?.name || 'Unknown',
          email: article.author?.email || ''
        },
        category: article.category,
        status: article.status,
        zones: article.zones.map(z => z.zone),
        viewCount: article._count.views,
        isPremium: article.isPremium,
        isFeatured: article.isFeatured,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt
      }))

      return {
        articles: transformedArticles,
        total
      }
    } catch (error) {
      console.error('Error getting admin articles:', error)
      throw new Error('Failed to fetch admin articles')
    }
  }

  /**
   * Get article statistics for admin dashboard
   */
  async getArticleStats() {
    try {
      // Check cache first
      const cacheKey = 'admin:article-stats'
      const cached = await redis.getJson(cacheKey)
      if (cached) {
        return cached
      }

      // Calculate current month and previous month dates
      const now = new Date()
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

      // Get article counts by status
      const [
        totalArticles,
        publishedArticles,
        draftArticles,
        archivedArticles,
        currentMonthArticles,
        previousMonthArticles
      ] = await Promise.all([
        db.article.count(),
        db.article.count({ where: { status: 'PUBLISHED' } }),
        db.article.count({ where: { status: 'DRAFT' } }),
        db.article.count({ where: { status: 'ARCHIVED' } }),
        db.article.count({
          where: {
            createdAt: {
              gte: currentMonthStart
            }
          }
        }),
        db.article.count({
          where: {
            createdAt: {
              gte: previousMonthStart,
              lt: previousMonthEnd
            }
          }
        })
      ])

      // Calculate monthly growth
      const monthlyGrowth = previousMonthArticles > 0 
        ? ((currentMonthArticles - previousMonthArticles) / previousMonthArticles) * 100
        : currentMonthArticles > 0 ? 100 : 0

      // Get total views
      const totalViews = await db.articleView.count()

      // Get weekly views (last 7 days)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      
      const weeklyViews = await db.articleView.count({
        where: {
          createdAt: {
            gte: weekAgo
          }
        }
      })

      // Get popular categories
      const categoryStats = await db.article.groupBy({
        by: ['category'],
        _count: {
          category: true
        },
        orderBy: {
          _count: {
            category: 'desc'
          }
        },
        take: 5
      })

      const popularCategories = categoryStats.map(stat => ({
        category: stat.category,
        count: stat._count.category
      }))

      const stats = {
        totalArticles,
        publishedArticles,
        draftArticles,
        archivedArticles,
        totalViews,
        monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
        weeklyViews,
        popularCategories
      }

      // Cache for 10 minutes
      await redis.setJson(cacheKey, stats, 600)

      return stats
    } catch (error) {
      console.error('Error getting article stats:', error)
      throw new Error('Failed to fetch article statistics')
    }
  }

  /**
   * Get users for admin management
   */
  async getAdminUsers(filters: AdminUserFilters) {
    const { page, limit, role, status, searchTerm } = filters
    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (role) {
      where.role = role as UserRole
    }
    
    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    } else if (status === 'banned') {
      where.lockedUntil = {
        gt: new Date()
      }
    }
    
    if (searchTerm) {
      where.OR = [
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          email: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        }
      ]
    }

    try {
      // Get total count
      const total = await db.user.count({ where })

      // Get users
      const users = await db.user.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          emailVerified: true,
          lastLoginAt: true,
          loginAttempts: true,
          lockedUntil: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              articles: true,
              userActivities: true
            }
          }
        }
      })

      return {
        users,
        total
      }
    } catch (error) {
      console.error('Error getting admin users:', error)
      throw new Error('Failed to fetch admin users')
    }
  }

  /**
   * Get user statistics for admin dashboard
   */
  async getUserStats() {
    try {
      // Check cache first
      const cacheKey = 'admin:user-stats'
      const cached = await redis.getJson(cacheKey)
      if (cached) {
        return cached
      }

      // Calculate current month start
      const now = new Date()
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

      // Get user counts
      const [
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        previousMonthUsers,
        premiumSubscribers
      ] = await Promise.all([
        db.user.count(),
        db.user.count({ where: { isActive: true } }),
        db.user.count({
          where: {
            createdAt: {
              gte: currentMonthStart
            }
          }
        }),
        db.user.count({
          where: {
            createdAt: {
              gte: previousMonthStart,
              lt: previousMonthEnd
            }
          }
        }),
        db.subscription.count({
          where: {
            status: 'ACTIVE'
          }
        })
      ])

      // Get role breakdown
      const roleStats = await db.user.groupBy({
        by: ['role'],
        _count: {
          role: true
        }
      })

      const roleBreakdown = roleStats.reduce((acc, stat) => {
        acc[stat.role] = stat._count.role
        return acc
      }, {} as Record<string, number>)

      // Calculate user growth
      const userGrowth = previousMonthUsers > 0 
        ? ((newUsersThisMonth - previousMonthUsers) / previousMonthUsers) * 100
        : newUsersThisMonth > 0 ? 100 : 0

      const stats = {
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        premiumSubscribers,
        roleBreakdown,
        userGrowth: Math.round(userGrowth * 10) / 10
      }

      // Cache for 10 minutes
      await redis.setJson(cacheKey, stats, 600)

      return stats
    } catch (error) {
      console.error('Error getting user stats:', error)
      throw new Error('Failed to fetch user statistics')
    }
  }

  /**
   * Get platform analytics
   */
  async getAnalytics(filters: AnalyticsFilters) {
    const { period, startDate, endDate, zone } = filters

    try {
      // Default date range based on period
      let start: Date, end: Date
      const now = new Date()

      switch (period) {
        case 'day':
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
          break
        case 'week':
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
          end = now
          break
        case 'year':
          start = new Date(now.getFullYear(), 0, 1)
          end = now
          break
        default: // month
          start = new Date(now.getFullYear(), now.getMonth(), 1)
          end = now
      }

      if (startDate) start = new Date(startDate)
      if (endDate) end = new Date(endDate)

      // Base query conditions
      const timeFilter = {
        createdAt: {
          gte: start,
          lte: end
        }
      }

      // Get views analytics
      const viewsQuery: any = { where: timeFilter }
      if (zone) {
        viewsQuery.where.article = {
          zones: {
            some: {
              zone: zone as ZoneType
            }
          }
        }
      }

      const views = await db.articleView.groupBy({
        by: ['createdAt'],
        _count: {
          id: true
        },
        where: viewsQuery.where,
        orderBy: {
          createdAt: 'asc'
        }
      })

      // Get users analytics (new registrations)
      const users = await db.user.groupBy({
        by: ['createdAt'],
        _count: {
          id: true
        },
        where: timeFilter,
        orderBy: {
          createdAt: 'asc'
        }
      })

      // Get articles analytics (new articles)
      const articlesQuery: any = { where: timeFilter }
      if (zone) {
        articlesQuery.where.zones = {
          some: {
            zone: zone as ZoneType
          }
        }
      }

      const articles = await db.article.groupBy({
        by: ['createdAt'],
        _count: {
          id: true
        },
        where: articlesQuery.where,
        orderBy: {
          createdAt: 'asc'
        }
      })

      // Format data for charts
      const formatData = (data: any[]) => {
        return data.map(item => ({
          date: item.createdAt.toISOString().split('T')[0],
          count: item._count.id
        }))
      }

      return {
        views: formatData(views),
        users: formatData(users),
        articles: formatData(articles)
      }
    } catch (error) {
      console.error('Error getting analytics:', error)
      throw new Error('Failed to fetch analytics')
    }
  }

  /**
   * Perform bulk operations on articles
   */
  async bulkArticleOperation(operation: string, articleIds: string[], data?: any) {
    try {
      let affected = 0
      let failed = 0

      switch (operation) {
        case 'publish':
          const publishResult = await db.article.updateMany({
            where: {
              id: {
                in: articleIds
              }
            },
            data: {
              status: 'PUBLISHED',
              publishedAt: new Date()
            }
          })
          affected = publishResult.count
          break

        case 'draft':
          const draftResult = await db.article.updateMany({
            where: {
              id: {
                in: articleIds
              }
            },
            data: {
              status: 'DRAFT',
              publishedAt: null
            }
          })
          affected = draftResult.count
          break

        case 'archive':
          const archiveResult = await db.article.updateMany({
            where: {
              id: {
                in: articleIds
              }
            },
            data: {
              status: 'ARCHIVED'
            }
          })
          affected = archiveResult.count
          break

        case 'delete':
          const deleteResult = await db.article.deleteMany({
            where: {
              id: {
                in: articleIds
              }
            }
          })
          affected = deleteResult.count
          break

        case 'feature':
          const featureResult = await db.article.updateMany({
            where: {
              id: {
                in: articleIds
              }
            },
            data: {
              isFeatured: true
            }
          })
          affected = featureResult.count
          break

        case 'unfeature':
          const unfeatureResult = await db.article.updateMany({
            where: {
              id: {
                in: articleIds
              }
            },
            data: {
              isFeatured: false
            }
          })
          affected = unfeatureResult.count
          break

        default:
          throw new Error(`Unknown operation: ${operation}`)
      }

      return {
        affected,
        failed
      }
    } catch (error) {
      console.error('Error performing bulk operation:', error)
      throw new Error('Failed to perform bulk operation')
    }
  }

  /**
   * Update user information
   */
  async updateUser(userId: string, updateData: any) {
    try {
      const user = await db.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return user
    } catch (error) {
      console.error('Error updating user:', error)
      throw new Error('Failed to update user')
    }
  }

  /**
   * Ban a user
   */
  async banUser(userId: string, reason?: string) {
    try {
      // Lock user account for 1 year (effectively a ban)
      const banUntil = new Date()
      banUntil.setFullYear(banUntil.getFullYear() + 1)

      await db.user.update({
        where: { id: userId },
        data: {
          isActive: false,
          lockedUntil: banUntil
        }
      })

      // Log the ban action
      await db.userActivity.create({
        data: {
          userId,
          action: 'LOGOUT', // Using existing enum value
          resourceType: 'USER',
          metadata: {
            action: 'banned',
            reason: reason || 'No reason provided',
            bannedAt: new Date().toISOString()
          }
        }
      })
    } catch (error) {
      console.error('Error banning user:', error)
      throw new Error('Failed to ban user')
    }
  }

  /**
   * Unban a user
   */
  async unbanUser(userId: string) {
    try {
      await db.user.update({
        where: { id: userId },
        data: {
          isActive: true,
          lockedUntil: null,
          loginAttempts: 0
        }
      })

      // Log the unban action
      await db.userActivity.create({
        data: {
          userId,
          action: 'LOGIN', // Using existing enum value
          resourceType: 'USER',
          metadata: {
            action: 'unbanned',
            unbannedAt: new Date().toISOString()
          }
        }
      })
    } catch (error) {
      console.error('Error unbanning user:', error)
      throw new Error('Failed to unban user')
    }
  }

  /**
   * Reset user password (admin action)
   */
  async resetUserPassword(userId: string) {
    try {
      // Generate a temporary password
      const tempPassword = this.passwordService.generateRandomPassword(12)
      const hashedPassword = await this.passwordService.hashPassword(tempPassword)

      await db.user.update({
        where: { id: userId },
        data: {
          passwordHash: hashedPassword
        }
      })

      // In a real app, you would send an email with the temporary password
      // For now, we'll just log the action
      await db.userActivity.create({
        data: {
          userId,
          action: 'LOGOUT', // Using existing enum value
          resourceType: 'USER',
          metadata: {
            action: 'password_reset_by_admin',
            resetAt: new Date().toISOString()
          }
        }
      })

      return { tempPassword } // Only for development - remove in production
    } catch (error) {
      console.error('Error resetting user password:', error)
      throw new Error('Failed to reset user password')
    }
  }

  /**
   * Get admin settings
   */
  async getSettings() {
    try {
      // For now, return default settings
      // In a real app, these would be stored in a settings table
      return {
        siteName: 'FootballZone.bg',
        maintenanceMode: false,
        registrationEnabled: true,
        emailNotifications: true,
        maxFileUploadSize: 50, // MB
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        cacheEnabled: true,
        analyticsEnabled: true
      }
    } catch (error) {
      console.error('Error getting settings:', error)
      throw new Error('Failed to get settings')
    }
  }

  /**
   * Update admin settings
   */
  async updateSettings(settings: Record<string, any>) {
    try {
      // In a real app, you would update a settings table
      // For now, we'll just validate and return the settings
      
      // Clear relevant caches when settings change
      await redis.del('admin:settings')
      
      return settings
    } catch (error) {
      console.error('Error updating settings:', error)
      throw new Error('Failed to update settings')
    }
  }
}
