import { z } from 'zod'
import { ArticleCategory, ArticleStatus, ZoneType } from '@prisma/client'

// Base article validation
const articleBaseSchema = z.object({
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255).regex(/^[a-z0-9-]+$/).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(10),
  featuredImageUrl: z.string().url().optional(),
  category: z.nativeEnum(ArticleCategory),
  subcategory: z.string().max(100).optional(),
  tags: z.array(z.string()).default([]),
  readTime: z.number().int().min(1).max(240).default(5),
  isPremium: z.boolean().default(false),
  premiumReleaseDate: z.string().datetime().optional(),
  isPermanentPremium: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  customOrder: z.number().int().optional(),
  templateId: z.string().cuid().optional(),
  seriesId: z.string().cuid().optional(),
  seriesPart: z.number().int().min(1).optional(),
  status: z.nativeEnum(ArticleStatus).default(ArticleStatus.DRAFT),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(320).optional(),
})

// Zone settings validation
const articleZoneSchema = z.object({
  zone: z.nativeEnum(ZoneType),
  visible: z.boolean().default(true),
  requiresSubscription: z.boolean().default(false),
  freeAfterDate: z.string().datetime().optional()
})

// Create article schema
export const createArticleSchema = z.object({
  body: articleBaseSchema.extend({
    zones: z.array(articleZoneSchema).min(1).max(5)
  })
})

// Update article schema
export const updateArticleSchema = z.object({
  params: z.object({
    id: z.string().cuid()
  }),
  body: articleBaseSchema.partial().extend({
    zones: z.array(articleZoneSchema).min(1).max(5).optional()
  })
})

// Delete article schema
export const deleteArticleSchema = z.object({
  params: z.object({
    id: z.string().cuid()
  })
})

// Get article by slug/id schema
export const getArticleSchema = z.object({
  params: z.object({
    slug: z.string().min(1)
  })
})

// Articles filter schema
export const getArticlesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
    category: z.nativeEnum(ArticleCategory).optional(),
    zone: z.nativeEnum(ZoneType).optional(),
    isPremium: z.string().transform(val => val === 'true').optional(),
    status: z.nativeEnum(ArticleStatus).optional(),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'publishedAt', 'viewCount', 'customOrder']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
})

// Search articles schema
export const searchArticlesSchema = z.object({
  query: z.object({
    q: z.string().min(1),
    page: z.string().regex(/^\d+$/).transform(Number).default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
    zone: z.nativeEnum(ZoneType).optional(),
    category: z.nativeEnum(ArticleCategory).optional()
  })
})

// Track view schema
export const trackViewSchema = z.object({
  params: z.object({
    id: z.string().cuid()
  }),
  body: z.object({
    sessionId: z.string(),
    viewDuration: z.number().int().min(0).optional(),
    completionPercent: z.number().int().min(0).max(100).default(0),
    referrer: z.string().optional(),
    deviceType: z.string().optional()
  })
})

export const articleSchemas = {
  create: createArticleSchema,
  update: updateArticleSchema,
  delete: deleteArticleSchema,
  getBySlug: getArticleSchema,
  getAll: getArticlesSchema,
  search: searchArticlesSchema,
  trackView: trackViewSchema
}