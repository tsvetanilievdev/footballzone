# FootballZone.bg Backend

Backend API for FootballZone.bg - Bulgarian football education platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose (for local development)
- npm or yarn

### Installation

1. **Clone and setup**
```bash
cd backend
npm install
```

2. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start local databases**
```bash
docker-compose up -d
```

4. **Database setup**
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

5. **Start development server**
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📋 Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start           # Start production server
npm test            # Run tests
npm test:watch      # Run tests in watch mode
npm test:coverage   # Run tests with coverage
npm run lint        # Lint code
npm run lint:fix    # Fix linting issues

# Database commands
npm run db:generate # Generate Prisma client
npm run db:push     # Push schema to database
npm run db:migrate  # Run database migrations
npm run db:seed     # Seed database with sample data
npm run db:studio   # Open Prisma Studio
```

## 🏗️ Project Structure

```
src/
├── config/          # Configuration files
│   ├── database.ts  # Prisma database config
│   ├── redis.ts     # Redis client config
│   └── environment.ts # Environment variables
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── routes/          # API route definitions
├── services/        # Business logic layer
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 🌐 API Endpoints

### Base URL
- Development: `http://localhost:5000/api/v1`
- Production: `https://api.footballzone.bg/api/v1`

### Available Endpoints

```bash
# Health Check
GET /health          # API health status

# Articles
GET /articles        # Get articles with filtering
GET /articles/search # Search articles
GET /articles/:slug  # Get article by slug

# Coming Soon
POST /auth/login     # User authentication
GET /zones/:zone     # Zone-specific content
GET /users/profile   # User profile
```

### Query Parameters

**Articles (`GET /articles`)**
```
?page=1              # Page number (default: 1)
&limit=10            # Items per page (default: 10)
&category=tactics    # Filter by category
&zone=coach          # Filter by zone (read/coach/player/parent)
&isPremium=false     # Filter by premium status
&status=published    # Filter by status
&search=keyword      # Search in title/content
&sortBy=createdAt    # Sort field
&sortOrder=desc      # Sort order (asc/desc)
```

**Search (`GET /articles/search`)**
```
?q=keyword           # Search query (required)
&page=1              # Page number
&limit=10            # Items per page
&zone=coach          # Filter by zone
&category=tactics    # Filter by category
```

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key tables include:

- `users` - User accounts and profiles
- `articles` - Article content and metadata
- `article_zones` - Zone visibility settings
- `article_series` - Article series grouping
- `subscriptions` - Premium subscriptions
- `user_activities` - User activity tracking
- `article_views` - Detailed view analytics

See `prisma/schema.prisma` for the complete schema.

## 🔧 Environment Variables

Create `.env` file based on `.env.example`:

```bash
# Required
DATABASE_URL="postgresql://user:pass@localhost:5432/footballzone_dev"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Optional Services
REDIS_URL="redis://localhost:6379"
STRIPE_SECRET_KEY="sk_test_..."
RESEND_API_KEY="re_..."
CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

Test files should be placed alongside source files with `.test.ts` or `.spec.ts` extension.

## 📦 Docker Development

The project includes Docker Compose for local development:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services included:
- PostgreSQL database
- Redis cache
- Redis Commander (GUI)

## 🚀 Deployment

### Environment Setup
1. Set all required environment variables
2. Ensure database is accessible
3. Run database migrations
4. Build the application

### Build Commands
```bash
npm run build
npm start
```

### Health Monitoring
- Health check endpoint: `GET /health`
- Application logs via Winston
- Database connection monitoring
- Redis connection monitoring

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- JWT authentication (coming soon)
- Input validation with Zod
- SQL injection prevention (Prisma ORM)
- XSS protection

## 📊 Performance Features

- Redis caching for frequently accessed data
- Database query optimization
- Connection pooling
- Compression middleware
- Request/response logging with correlation IDs

## 🐛 Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## 📈 Monitoring

- Request logging with correlation IDs
- Error tracking and logging
- Performance metrics
- Database query monitoring
- Redis cache metrics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

Copyright (c) 2024 FootballZone.bg

No part of this software may be reproduced, distributed, or transmitted without the prior written permission of the copyright holder.

For licensing inquiries, please contact: admin@footballzone.bg