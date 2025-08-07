# FootballZone.bg - Full Stack Application

Educational football platform for Bulgarian players, coaches, and parents.

## 🏗️ Project Structure

```
footballzone/
├── frontend/           # Next.js React application
├── backend/            # Node.js Express API
├── docs/              # Project documentation
├── .claude/           # Claude Code configuration
└── CLAUDE.md          # Development guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### 1. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Frontend available at: `http://localhost:3000`

### 2. Backend Setup (Node.js + Express)
```bash
cd backend
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start databases
docker-compose up -d

# Setup database
npm run db:generate
npm run db:migrate

# Start API server
npm run dev
```
API available at: `http://localhost:5000`

## 🎯 Features

### Multi-Zone Content System
- **Read Zone**: General football articles
- **Coach Zone**: Training materials and tactics
- **Player Zone**: Skills development (planned)
- **Parent Zone**: Child development support (planned)
- **Admin Zone**: Content management

### Advanced Content Management
- Template-based article creation
- Rich text editor with media support
- Premium content scheduling
- Article series organization
- Multi-zone visibility controls

### Premium Features
- Stripe payment integration (planned)
- Subscription-based content access
- Time-based content release
- Analytics and tracking

## 🛠️ Tech Stack

### Frontend
- Next.js 15 with App Router
- React 19 & TypeScript 5
- Tailwind CSS 4
- Headless UI & Framer Motion
- React Hook Form + Zod

### Backend
- Node.js 20+ & Express.js
- PostgreSQL 15+ & Redis 6+
- Prisma ORM & TypeScript 5
- JWT Authentication
- Stripe & Cloudinary integration

## 📚 Documentation

- **[Frontend Architecture](docs/README-ORIGINAL.md)** - Next.js app details
- **[Backend Architecture](docs/BACKEND_ARCHITECTURE.md)** - API design and database schema
- **[Implementation Plan](docs/BACKEND_IMPLEMENTATION_PLAN.md)** - Step-by-step development guide
- **[CLAUDE.md](CLAUDE.md)** - Developer guidance for Claude Code

## 🚀 Development Commands

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Lint code
```

### Backend Development
```bash
cd backend
npm run dev         # Start with hot reload
npm run build       # Build TypeScript
npm start          # Start production
npm test           # Run tests
npm run db:studio  # Open Prisma Studio
```

## 🏃‍♂️ Available Features

### Currently Implemented (Frontend)
- ✅ Responsive multi-zone layout
- ✅ Article browsing and reading
- ✅ Rich text editor for admin
- ✅ Template-based article creation
- ✅ Premium content indicators
- ✅ Series organization
- ✅ Search and filtering

### Currently Implemented (Backend)
- ✅ Article CRUD API endpoints
- ✅ Database schema with Prisma
- ✅ Redis caching layer
- ✅ Error handling and logging
- ✅ Basic analytics tracking

### Planned Features
- 🔲 User authentication (JWT)
- 🔲 Payment processing (Stripe)
- 🔲 Email notifications
- 🔲 Advanced analytics
- 🔲 Course system
- 🔲 Mobile app

## 🌐 API Endpoints

**Base URL:** `http://localhost:5000/api/v1`

### Available Now
- `GET /health` - API health check
- `GET /articles` - List articles with filtering
- `GET /articles/search` - Search articles
- `GET /articles/:slug` - Get article by slug

### Coming Soon
- `POST /auth/login` - User authentication
- `GET /zones/:zone` - Zone-specific content
- `POST /subscriptions/create` - Create subscription

## 🗄️ Database Schema

The application uses PostgreSQL with comprehensive schemas for:
- User management and roles
- Article content and zones
- Premium subscriptions
- Analytics tracking
- Media file management

See `backend/prisma/schema.prisma` for complete schema.

## 🔒 Environment Configuration

Both frontend and backend require environment setup. See respective directories for `.env.example` files.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

For development questions or issues:
- Check documentation in `/docs`
- Review CLAUDE.md for development guidance
- Open an issue for bugs or feature requests

---

**Built for Bulgarian Football Education** ⚽ 🇧🇬