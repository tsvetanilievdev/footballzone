import * as articleService from '@/services/articleService'
import { prisma } from '../setup'

// Mock Redis to avoid connection issues in tests
jest.mock('@/config/redis', () => ({
  getJson: jest.fn().mockResolvedValue(null),
  setJson: jest.fn().mockResolvedValue('OK'),
  delPattern: jest.fn().mockResolvedValue(1)
}))

describe('Article Service', () => {
  let testUser: any
  let testTemplate: any
  let testArticle: any

  beforeEach(async () => {
    // Create test data
    testUser = await prisma.user.create({
      data: {
        email: 'test@footballzone.bg',
        name: 'Test User',
        passwordHash: 'test_hash',
        role: 'ADMIN'
      }
    })

    testTemplate = await prisma.articleTemplate.create({
      data: {
        name: 'Test Template',
        category: 'TACTICS',
        settings: {}
      }
    })

    testArticle = await prisma.article.create({
      data: {
        title: 'Test Article',
        slug: 'test-article',
        excerpt: 'Test excerpt for searching',
        content: 'Test content with keywords',
        authorId: testUser.id,
        templateId: testTemplate.id,
        status: 'PUBLISHED',
        category: 'TACTICS',
        isPremium: false,
        tags: ['test', 'football']
      }
    })
  })

  describe('getArticles', () => {
    it('should return articles with pagination', async () => {
      const filters = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const
      }

      const result = await articleService.getArticles(filters)

      expect(result.articles).toHaveLength(1)
      expect(result.total).toBe(1)
      expect(result.articles[0].title).toBe('Test Article')
    })

    it('should filter by category', async () => {
      const filters = {
        page: 1,
        limit: 10,
        category: 'TACTICS',
        sortBy: 'createdAt',
        sortOrder: 'desc' as const
      }

      const result = await articleService.getArticles(filters)

      expect(result.articles).toHaveLength(1)
      expect(result.articles[0].category).toBe('TACTICS')
    })

    it('should filter by premium status', async () => {
      const filters = {
        page: 1,
        limit: 10,
        isPremium: false,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const
      }

      const result = await articleService.getArticles(filters)

      expect(result.articles).toHaveLength(1)
      expect(result.articles[0].isPremium).toBe(false)
    })

    it('should search in title, excerpt, and tags', async () => {
      const filters = {
        page: 1,
        limit: 10,
        search: 'searching',
        sortBy: 'createdAt',
        sortOrder: 'desc' as const
      }

      const result = await articleService.getArticles(filters)

      expect(result.articles).toHaveLength(1)
    })
  })

  describe('getArticleBySlug', () => {
    it('should return article by slug', async () => {
      const article = await articleService.getArticleBySlug('test-article')

      expect(article).toBeTruthy()
      expect((article as any)?.title).toBe('Test Article')
      expect((article as any)?.slug).toBe('test-article')
    })

    it('should return null for non-existent slug', async () => {
      const article = await articleService.getArticleBySlug('non-existent')

      expect(article).toBeNull()
    })
  })

  describe('searchArticles', () => {
    it('should search articles by query', async () => {
      const filters = {
        query: 'Test',
        page: 1,
        limit: 10
      }

      const result = await articleService.searchArticles(filters)

      expect(result.articles).toHaveLength(1)
      expect(result.total).toBe(1)
    })

    it('should search in content', async () => {
      const filters = {
        query: 'keywords',
        page: 1,
        limit: 10
      }

      const result = await articleService.searchArticles(filters)

      expect(result.articles).toHaveLength(1)
    })

    it('should search in tags', async () => {
      const filters = {
        query: 'football',
        page: 1,
        limit: 10
      }

      const result = await articleService.searchArticles(filters)

      expect(result.articles).toHaveLength(1)
    })
  })

  describe('trackArticleView', () => {
    it('should track article view without errors', async () => {
      const viewData = {
        articleId: testArticle.id,
        sessionId: 'test-session-123',
        userId: testUser.id,
        viewDuration: 30000,
        completionPercent: 80,
        deviceType: 'desktop',
        ipAddress: '127.0.0.1'
      }

      // Should not throw any errors
      await expect(articleService.trackArticleView(viewData)).resolves.toBeUndefined()
    })
  })
})