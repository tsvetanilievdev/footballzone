# FootballZone.bg - Bulgarian Football Education Platform

[![License: All Rights Reserved](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)

**FootballZone.bg** is a digital education platform for the Bulgarian football community. It provides specialized content for coaches, players, parents, and football enthusiasts through a zone-based content management system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 6+ (optional, fallback available)

### Installation

1. **Clone and setup**
   ```bash
   git clone [repository-url]
   cd footballzone
   ```

2. **Backend setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure DATABASE_URL, JWT_SECRET in .env

   npm run db:generate
   npm run db:push
   npm run db:seed
   npm run dev
   ```

3. **Frontend setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Configure NEXT_PUBLIC_API_URL in .env.local

   npm run dev
   ```

4. **Access**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - API Docs: http://localhost:5001/api-docs

## 📊 Implementation Status

### ✅ Completed (Backend - Phase 7)
- **Authentication System**: JWT-based auth with refresh tokens
- **Article Management**: Full CRUD with advanced filtering
- **Analytics Service**: Real-time dashboard metrics
- **Series Management**: Complete article series system
- **Premium Content**: Time-based releases and subscriptions
- **Email Notifications**: Professional templates
- **Performance Optimization**: Intelligent caching
- **API Endpoints**: 44+ RESTful endpoints with Swagger docs

### ✅ Completed (Frontend - Phase 6)
- **Authentication Flow**: Login, registration, profile management
- **Article Display**: Read Zone, Coach Zone with real API data
- **Admin Panel**: CRUD interface with rich text editing
- **Search System**: Advanced search with filters
- **React Query**: Data fetching and caching infrastructure
- **Professional UI**: Loading states, error handling, responsive design

### 🔄 In Progress (Phase 8 - Frontend Integration)
- **Series Management UI**: Frontend components for article series
- **Advanced Analytics Dashboard**: Real-time metrics visualization
- **Premium Content Interface**: Subscription management UI
- **Email Preferences**: User notification settings

### ❌ Not Implemented
- **Payment Integration**: Stripe subscription processing
- **Player/Parent Zones**: Specialized content areas
- **Mobile App**: React Native companion
- **AI Features**: Advanced content recommendations

## 🏗️ Architecture

### Frontend (Next.js 15)
- React 19, TypeScript 5, Tailwind CSS 4
- React Query for data fetching
- JWT authentication with auto-refresh
- Zone-based content architecture

### Backend (Node.js + Express)
- PostgreSQL + Prisma ORM
- Redis caching with fallback
- Comprehensive API with Swagger docs
- Security-first approach (Helmet, CORS, rate limiting)

## 📚 Development

### Commands
```bash
# Frontend
npm run dev          # Development server with Turbopack
npm run build        # Production build
npm run lint         # ESLint

# Backend
npm run dev          # Development server with hot reload
npm run build        # TypeScript compilation
npm run test         # Jest tests
npm run db:studio    # Prisma Studio
```

### Test Users
```bash
# Admin account
Email: admin@footballzone.bg
Password: admin123

# Coach account
Email: coach@footballzone.bg
Password: coach123
```

## 📄 License

This project is proprietary software. All rights reserved.
Copyright (c) 2024 FootballZone.bg

For licensing inquiries: admin@footballzone.bg

---

*For detailed documentation, see [CLAUDE.md](./CLAUDE.md)*