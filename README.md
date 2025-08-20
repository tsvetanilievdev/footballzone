# FootballZone.bg - Bulgarian Football Education Platform

[![License: All Rights Reserved](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://www.postgresql.org/)

## 🏆 Project Overview

**FootballZone.bg** is a comprehensive digital education platform designed for the Bulgarian football community. It provides specialized content for coaches, players, parents, and football enthusiasts through a sophisticated zone-based content management system.

### 🎯 Mission
To democratize football education in Bulgaria by providing accessible, high-quality content that helps develop better coaches, players, and understanding of the beautiful game.

### 🌟 Key Highlights
- **Multi-zone Architecture**: Specialized content areas for different user types
- **Professional Content Management**: Advanced article templating and scheduling
- **Premium Content System**: Time-based content release and subscription management  
- **Modern Tech Stack**: Next.js 15, React 19, Node.js, PostgreSQL
- **Mobile-First Design**: Responsive design optimized for all devices
- **Bulgarian Language**: Native support for Bulgarian football community

---

## 📋 Table of Contents

1. [Features Overview](#features-overview)
2. [Technical Architecture](#technical-architecture)
3. [Implementation Status](#implementation-status)
4. [Getting Started](#getting-started)
5. [API Documentation](#api-documentation)
6. [Deployment](#deployment)
7. [Contributing](#contributing)

---

## ✨ Features Overview

### 🎛️ Core Platform Features

#### **Multi-Zone Content System**
- **📚 Read Zone**: General articles accessible to all users
- **🎯 Coach Zone**: Professional development, tactics, training methodologies  
- **⚽ Player Zone**: Skills development, technique, fitness programs
- **👨‍👩‍👧‍👦 Parent Zone**: Child development, safety, psychology support
- **🔧 Admin Zone**: Comprehensive content management and analytics

#### **Advanced Article Management**
- **Template-Based System**: Configurable article layouts and styling
- **Zone Visibility Controls**: Articles can appear in multiple zones with different access rules
- **Premium Content Scheduling**: Time-based content release (premium → free)
- **Series Support**: Organize articles into educational series
- **Rich Media Integration**: Videos, images, downloadable resources

#### **User Management & Authentication**
- **Role-Based Access Control**: FREE, PLAYER, COACH, PARENT, ADMIN roles
- **JWT Authentication**: Secure token-based authentication
- **Profile Management**: Comprehensive user profiles with preferences
- **Subscription System**: Premium content access management

#### **Content Discovery**
- **Advanced Search**: Full-text search with filtering and suggestions
- **Category Organization**: Tactics, Training, Psychology, Nutrition, etc.
- **Tag-Based Navigation**: Flexible content organization
- **Featured Content**: Curated content promotion

---

## 🏗️ Technical Architecture

### **Frontend (Next.js 15)**
```
Technology Stack:
├── Next.js 15 (App Router) - React framework
├── React 19 - UI library  
├── TypeScript 5 - Type safety
├── Tailwind CSS 4 - Styling framework
├── React Query - Data fetching & caching
├── Framer Motion - Animations
├── Headless UI - Accessible components
└── React Hook Form + Zod - Forms & validation
```

### **Backend (Node.js + Express)**
```
Technology Stack:
├── Node.js 18+ - Runtime environment
├── Express.js - Web framework
├── TypeScript 5 - Type safety
├── PostgreSQL 15+ - Primary database
├── Prisma - Database ORM
├── Redis 6+ - Caching layer
├── JWT - Authentication
├── Cloudinary - Media storage
└── Stripe - Payment processing
```

### **Development & Deployment**
```
Tools & Infrastructure:
├── Docker - Containerization
├── GitHub Actions - CI/CD
├── Vercel - Frontend deployment
├── Railway/AWS - Backend deployment
├── Swagger - API documentation
└── Jest - Testing framework
```

---

## 📊 Implementation Status

### ✅ **Completed Features (Phase 6)**

#### **Backend Infrastructure (100% Complete)**
- ✅ **Authentication System**: JWT-based auth with refresh tokens
- ✅ **Article Management**: Full CRUD operations with advanced filtering
- ✅ **User Management**: Registration, profiles, role-based access
- ✅ **Database Schema**: Comprehensive PostgreSQL schema with Prisma
- ✅ **API Endpoints**: RESTful APIs with Swagger documentation
- ✅ **Redis Caching**: Performance optimization with fallback mechanisms
- ✅ **Security**: Helmet, CORS, rate limiting, input validation

#### **Frontend Application (100% Complete)**
- ✅ **Authentication Flow**: Login, registration, profile management
- ✅ **Article Display**: Read Zone, Coach Zone with real API data
- ✅ **Admin Panel**: Professional CRUD interface with rich text editing
- ✅ **Search System**: Advanced search with suggestions and history
- ✅ **Media Management**: Drag & drop file upload system
- ✅ **Responsive Design**: Mobile-optimized interface
- ✅ **Loading States**: Professional UX with spinners and error boundaries

#### **Admin Features (100% Complete)**
- ✅ **Real-time Dashboard**: Live statistics and analytics
- ✅ **Content Management**: Create, edit, delete articles
- ✅ **User Administration**: User search and role management
- ✅ **Media Gallery**: Professional file management interface
- ✅ **Role-based Access**: Admin/Coach permissions

### 🔄 **In Development (Phase 7)**

#### **Advanced Features (Planned)**
- 🔄 **Article Series**: Multi-part content organization
- 🔄 **Course System**: Structured educational courses
- 🔄 **Enhanced Analytics**: Detailed user activity tracking
- 🔄 **Email Notifications**: User engagement system
- 🔄 **Performance Optimization**: Advanced caching strategies

#### **Premium Features (Planned)**
- 🔄 **Payment Integration**: Stripe subscription processing
- 🔄 **Content Scheduling**: Advanced publishing workflows
- 🔄 **Player/Parent Zones**: Specialized content areas
- 🔄 **Mobile App**: React Native companion app

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL 15+
- Redis 6+ (optional, fallback available)
- npm or yarn

### **Installation**

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd footballzone
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Setup environment
   cp .env.example .env
   # Configure DATABASE_URL, JWT_SECRET, etc.
   
   # Database setup
   npm run db:generate
   npm run db:push
   npm run db:seed
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Setup environment  
   cp .env.example .env.local
   # Configure NEXT_PUBLIC_API_URL
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - API Docs: http://localhost:5001/api-docs

### **Development Commands**

#### Frontend
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint
```

#### Backend  
```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run start        # Start production server
npm run test         # Run tests
npm run db:studio    # Open Prisma Studio
```

---

## 📚 Documentation

### **Available Documentation**
- **[Architecture Guide](./ARCHITECTURE.md)** - Detailed technical architecture
- **[API Reference](./API.md)** - Complete API documentation
- **[User Guide](./USER_GUIDE.md)** - Feature documentation and guides
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment instructions
- **[Database Schema](./DATABASE.md)** - Database design and relationships
- **[Development Guide](./DEVELOPMENT.md)** - Development workflow and contributing

---

## 🌟 Why FootballZone.bg?

### **For Football Professionals**
- **Comprehensive Content**: Expert-written articles on tactics, training, psychology
- **Professional Development**: Continuous learning opportunities
- **Community**: Connect with other football professionals

### **For Developers**
- **Modern Architecture**: Built with latest technologies and best practices
- **Scalable Design**: Multi-tenant, zone-based architecture
- **Open Source**: Extensible and customizable platform

### **For Organizations**
- **White-label Ready**: Customizable for different football organizations
- **Multi-language Support**: Extensible localization system
- **Analytics & Insights**: Comprehensive user engagement tracking

---

## 🤝 Contributing

We welcome contributions from the community! Please see our [Development Guide](./DEVELOPMENT.md) for detailed instructions.

### **Quick Start for Contributors**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Submit a pull request

---

## 📄 License

This project is proprietary software. All rights reserved.

Copyright (c) 2024 FootballZone.bg

No part of this software may be reproduced, distributed, or transmitted without the prior written permission of the copyright holder.

For licensing inquiries, please contact: admin@footballzone.bg

See the [LICENSE](LICENSE) file for full details.

---

## 📞 Contact & Support

- **Website**: [FootballZone.bg](https://footballzone.bg)
- **Email**: support@footballzone.bg
- **Documentation**: [Full Documentation](./ARCHITECTURE.md)

---

*Built with ❤️ for the Bulgarian football community*