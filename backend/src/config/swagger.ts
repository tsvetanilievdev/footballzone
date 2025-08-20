import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'
import env from '@/config/environment'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FootballZone.bg API',
      version: '1.0.0',
      description: 'Backend API for Bulgarian football education platform',
      contact: {
        name: 'FootballZone Team',
        email: 'support@footballzone.bg',
      },
      license: {
        name: 'All Rights Reserved',
        url: 'https://footballzone.bg/license',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
        description: 'Development server',
      },
      {
        url: 'https://api.footballzone.bg/api/v1',
        description: 'Production server (future)',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Access Token for authentication',
        },
        CookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refreshToken',
          description: 'HTTP-only refresh token cookie',
        },
      },
      schemas: {
        // User & Authentication Schemas
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '71134f3c-2d2b-43c8-b7f6-0b03f04f2897',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'coach@example.com',
            },
            name: {
              type: 'string',
              example: 'Test Coach',
            },
            role: {
              type: 'string',
              enum: ['FREE', 'PLAYER', 'COACH', 'PARENT', 'ADMIN'],
              example: 'COACH',
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            emailVerified: {
              type: 'boolean',
              example: false,
            },
            avatarUrl: {
              type: 'string',
              nullable: true,
              example: 'https://example.com/avatar.jpg',
            },
            bio: {
              type: 'string',
              nullable: true,
              example: 'Experienced football coach',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-11T10:43:34.111Z',
            },
          },
        },
        UserRegistration: {
          type: 'object',
          required: ['email', 'password', 'name', 'acceptTerms'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'coach@example.com',
            },
            password: {
              type: 'string',
              minLength: 8,
              example: 'SecurePassword123!',
              description: 'At least 8 characters with special chars and numbers',
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'Test Coach',
            },
            role: {
              type: 'string',
              enum: ['FREE', 'PLAYER', 'COACH', 'PARENT'],
              default: 'FREE',
              example: 'COACH',
            },
            acceptTerms: {
              type: 'boolean',
              example: true,
              description: 'Must be true to register',
            },
            subscribeNewsletter: {
              type: 'boolean',
              default: false,
              example: false,
            },
            avatarUrl: {
              type: 'string',
              format: 'uri',
              nullable: true,
              example: 'https://example.com/avatar.jpg',
            },
            bio: {
              type: 'string',
              maxLength: 500,
              nullable: true,
              example: 'Experienced football coach',
            },
          },
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'coach@example.com',
            },
            password: {
              type: 'string',
              example: 'SecurePassword123!',
            },
            rememberMe: {
              type: 'boolean',
              default: false,
              example: true,
            },
            deviceName: {
              type: 'string',
              example: 'Postman Client',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Login successful',
            },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                accessToken: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                expiresAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-08-11T11:03:43.951Z',
                },
              },
            },
          },
        },
        
        // Article Schemas
        Article: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '254fd880-35d5-42cb-bbb9-700df0f38c30',
            },
            title: {
              type: 'string',
              example: 'Основни тактически принципи в съвременния футбол',
            },
            slug: {
              type: 'string',
              example: 'osnovni-takticheski-principi',
            },
            excerpt: {
              type: 'string',
              nullable: true,
              example: 'Разглеждаме ключовите тактически принципи...',
            },
            content: {
              type: 'string',
              example: 'В съвременния футбол тактиката играе решаваща роля...',
            },
            featuredImageUrl: {
              type: 'string',
              format: 'uri',
              nullable: true,
              example: 'https://example.com/image.jpg',
            },
            category: {
              type: 'string',
              enum: ['TACTICS', 'TRAINING', 'PSYCHOLOGY', 'NUTRITION', 'TECHNIQUE', 'FITNESS', 'NEWS', 'INTERVIEWS', 'ANALYSIS', 'YOUTH', 'CONDITIONING', 'PERIODIZATION', 'MANAGEMENT'],
              example: 'TACTICS',
            },
            subcategory: {
              type: 'string',
              nullable: true,
              example: 'Modern Tactics',
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['тактика', 'треньори', 'основи', 'принципи'],
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2025-08-11T10:48:51.484Z',
            },
            readTime: {
              type: 'integer',
              minimum: 1,
              maximum: 240,
              example: 8,
            },
            isPremium: {
              type: 'boolean',
              example: false,
            },
            viewCount: {
              type: 'integer',
              example: 0,
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'REVIEW'],
              example: 'PUBLISHED',
            },
            author: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string', example: 'Test Coach' },
                role: { type: 'string', example: 'COACH' },
              },
            },
            zones: {
              type: 'array',
              items: { $ref: '#/components/schemas/ArticleZone' },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-11T10:48:51.486Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-11T10:48:51.486Z',
            },
          },
        },
        ArticleZone: {
          type: 'object',
          properties: {
            zone: {
              type: 'string',
              enum: ['READ', 'coach', 'player', 'parent', 'series'],
              example: 'coach',
            },
            visible: {
              type: 'boolean',
              example: true,
            },
            requiresSubscription: {
              type: 'boolean',
              example: false,
            },
            freeAfterDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: null,
            },
          },
        },
        ArticleCreate: {
          type: 'object',
          required: ['title', 'content', 'category', 'zones'],
          properties: {
            title: {
              type: 'string',
              minLength: 3,
              maxLength: 255,
              example: 'Нова тактическа статия',
            },
            slug: {
              type: 'string',
              pattern: '^[a-z0-9-]+$',
              example: 'nova-takticheska-statia',
              description: 'Auto-generated if not provided',
            },
            excerpt: {
              type: 'string',
              maxLength: 500,
              example: 'Кратко описание на статията',
            },
            content: {
              type: 'string',
              minLength: 10,
              example: 'Пълното съдържание на статията...',
            },
            category: {
              type: 'string',
              enum: ['TACTICS', 'TRAINING', 'PSYCHOLOGY', 'NUTRITION', 'TECHNIQUE', 'FITNESS', 'NEWS', 'INTERVIEWS', 'ANALYSIS', 'YOUTH', 'CONDITIONING', 'PERIODIZATION', 'MANAGEMENT'],
              example: 'TACTICS',
            },
            subcategory: {
              type: 'string',
              maxLength: 100,
              example: 'Modern Tactics',
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['тактика', 'съвременен футбол'],
            },
            readTime: {
              type: 'integer',
              minimum: 1,
              maximum: 240,
              default: 5,
              example: 10,
            },
            isPremium: {
              type: 'boolean',
              default: false,
              example: false,
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'REVIEW'],
              default: 'DRAFT',
              example: 'PUBLISHED',
            },
            featuredImageUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/image.jpg',
            },
            seoTitle: {
              type: 'string',
              maxLength: 255,
              example: 'SEO заглавие',
            },
            seoDescription: {
              type: 'string',
              maxLength: 320,
              example: 'SEO описание',
            },
            zones: {
              type: 'array',
              minItems: 1,
              maxItems: 5,
              items: { $ref: '#/components/schemas/ArticleZone' },
              example: [
                {
                  zone: 'coach',
                  visible: true,
                  requiresSubscription: false,
                },
                {
                  zone: 'read',
                  visible: true,
                  requiresSubscription: false,
                },
              ],
            },
          },
        },
        
        // Response Schemas
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              description: 'Response data (varies by endpoint)',
            },
            message: {
              type: 'string',
              example: 'Operation successful',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'array',
              items: {},
              description: 'Array of items',
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer', example: 1 },
                limit: { type: 'integer', example: 10 },
                total: { type: 'integer', example: 25 },
                pages: { type: 'integer', example: 3 },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Validation failed',
                },
                stack: {
                  type: 'string',
                  example: 'Error: Validation failed...',
                },
              },
            },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        Forbidden: {
          description: 'Access denied - insufficient permissions',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'System health and status endpoints',
      },
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
      },
      {
        name: 'Articles',
        description: 'Article management and content operations',
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/schemas/*.ts',
  ],
}

const specs = swaggerJSDoc(options)

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'FootballZone.bg API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      tryItOutEnabled: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  }))
  
  // JSON endpoint for the spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(specs)
  })
}

export { specs }