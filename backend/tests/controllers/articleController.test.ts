import request from 'supertest'
import app from '@/app'
import { prisma } from '../setup'

describe('Article Controller', () => {
  let testArticle: any

  beforeEach(async () => {
    // Create test data
    const testUser = await prisma.user.create({
      data: {
        email: 'test@footballzone.bg',
        name: 'Test User',
        passwordHash: 'test_hash',
        role: 'ADMIN'
      }
    })

    const testTemplate = await prisma.articleTemplate.create({
      data: {
        name: 'Test Template',
        category: 'read',
        settings: {}
      }
    })

    testArticle = await prisma.article.create({
      data: {
        title: 'Test Article',
        slug: 'test-article',
        excerpt: 'Test excerpt',
        content: 'Test content',
        authorId: testUser.id,
        templateId: testTemplate.id,
        status: 'PUBLISHED',
        category: 'TACTICS',
        isPremium: false
      }
    })
  })

  describe('GET /api/v1/articles', () => {
    it('should return articles list', async () => {
      const response = await request(app)
        .get('/api/v1/articles')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].title).toBe('Test Article')
    })

    it('should filter articles by category', async () => {
      const response = await request(app)
        .get('/api/v1/articles?category=TACTICS')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
    })

    it('should paginate articles', async () => {
      const response = await request(app)
        .get('/api/v1/articles?page=1&limit=5')
        .expect(200)

      expect(response.body.pagination.page).toBe(1)
      expect(response.body.pagination.limit).toBe(5)
    })
  })

  describe('GET /api/v1/articles/:slug', () => {
    it('should return single article by slug', async () => {
      const response = await request(app)
        .get(`/api/v1/articles/${testArticle.slug}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.title).toBe('Test Article')
      expect(response.body.data.slug).toBe('test-article')
    })

    it('should return 404 for non-existent article', async () => {
      const response = await request(app)
        .get('/api/v1/articles/non-existent')
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.error.message).toBe('Article not found')
    })
  })

  describe('GET /api/v1/articles/search', () => {
    it('should search articles by query', async () => {
      const response = await request(app)
        .get('/api/v1/articles/search?q=Test')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.query).toBe('Test')
    })

    it('should return 400 for missing search query', async () => {
      const response = await request(app)
        .get('/api/v1/articles/search')
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error.message).toBe('Search query is required')
    })
  })

  describe('POST /api/v1/articles/:id/track-view', () => {
    it('should track article view', async () => {
      const response = await request(app)
        .post(`/api/v1/articles/${testArticle.id}/track-view`)
        .send({
          duration: 30000,
          completionPercent: 80
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('View tracked successfully')
    })
  })
})