# FootballZone.bg Testing Framework

This directory contains automated testing scripts to verify the implementation status of all features marked as "✅ COMPLETED" in the CLAUDE.md documentation.

## Quick Start

```bash
# Quick system status check
./scripts/quick_status_check.sh

# Run full test suite
./scripts/run_full_test_suite.sh

# Run individual tests
./scripts/api_health_check.sh
./scripts/db_integrity_check.sh  
./scripts/frontend_build_test.sh
```

## Test Scripts Overview

### 🏥 `api_health_check.sh`
Tests all critical API endpoints including Phase 7 implementations:
- **Analytics API** - 8 endpoints (dashboard, performance, export, etc.)
- **Series API** - 15 endpoints (CRUD, recommendations, progress tracking)
- **Premium API** - 12 endpoints (access control, scheduling, subscriptions)
- **Email API** - 9 endpoints (templates, notifications, analytics)
- **Core APIs** - Authentication, articles, admin

**Prerequisites:**
- Backend running on port 5001
- Admin user credentials configured
- Database seeded with test data

### 💾 `db_integrity_check.sh`
Verifies database connections, schema integrity, and data consistency:
- PostgreSQL connection and version check
- Redis connection and memory usage
- Prisma schema validation and sync status
- Database statistics (user count, article count, etc.)
- Migration status verification

**Prerequisites:**
- PostgreSQL running with configured database
- Redis running
- Backend .env file with correct DATABASE_URL and REDIS_URL

### 🏗️ `frontend_build_test.sh`
Validates frontend build process, dependencies, and components:
- TypeScript compilation
- Next.js build process
- ESLint validation
- Security audit
- Phase 7 component verification (FormErrors, ErrorBoundary, etc.)
- Development server startup test

**Prerequisites:**
- Node.js 18+ and npm
- Frontend dependencies installed
- .env.local file configured

### ⚡ `quick_status_check.sh`
Fast overview of system health - use before running full test suite:
- Service availability (backend/frontend)
- Database connectivity
- Dependency installation status
- Basic environment validation

### 🧪 `run_full_test_suite.sh`
Orchestrates all tests and generates comprehensive markdown report:
- Runs all individual test scripts
- Tracks execution time and results
- Generates detailed markdown report
- Provides recommendations based on results
- Calculates overall health score

## Environment Setup

### Backend Requirements
```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npx prisma db push
npx prisma generate
npm run db:seed

# Start backend
npm run dev
```

### Frontend Requirements  
```bash
cd frontend

# Install dependencies
npm install

# Setup environment
echo "NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1" > .env.local

# Start frontend  
npm run dev
```

### Database Requirements
```bash
# PostgreSQL (example for Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createdb footballzone

# Redis
sudo apt-get install redis-server
redis-server
```

## Test Results Interpretation

### Exit Codes
- **0**: All tests passed (EXCELLENT/GOOD status)
- **1**: Some warnings or minor issues (NEEDS ATTENTION) 
- **2**: Critical failures (CRITICAL/POOR status)

### Success Rate Thresholds
- **90%+**: 🎉 EXCELLENT - Ready for production
- **75-89%**: ✅ GOOD - Minor issues to address
- **50-74%**: ⚠️ NEEDS ATTENTION - Several problems
- **<50%**: ❌ CRITICAL - Major implementation gaps

### Common Issues & Solutions

#### Backend API Issues
```bash
# Check if backend is running
curl http://localhost:5001/api/v1/health

# Check backend logs
cd backend && npm run dev

# Verify environment variables
cat backend/.env | grep -E "(DATABASE_URL|REDIS_URL|JWT_SECRET)"

# Reset database
cd backend && npx prisma migrate reset --force && npm run db:seed
```

#### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -h localhost -U your_user -d footballzone -c "SELECT version();"

# Test Redis connection  
redis-cli ping

# Check Prisma schema sync
cd backend && npx prisma db push
```

#### Frontend Build Issues
```bash
# Clear dependencies and reinstall
cd frontend && rm -rf node_modules package-lock.json && npm install

# Check TypeScript errors
npx tsc --noEmit

# Clear Next.js cache
rm -rf .next

# Check environment variables
cat .env.local
```

#### Authentication Issues
```bash
# Verify admin user exists
cd backend && npx prisma studio
# Check users table for admin@footballzone.bg

# Test login directly
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@footballzone.bg","password":"TestAdmin123!"}'
```

## Phase 7 Feature Verification

The testing framework specifically validates Phase 7 implementations:

### ✅ Analytics Service
- Real-time dashboard metrics
- Article-specific analytics  
- User activity tracking
- Performance monitoring
- Data export capabilities
- Event tracking system

### ✅ Series Management
- Complete CRUD operations
- Progress tracking
- AI-powered recommendations
- Drag-and-drop reordering
- Category-based organization

### ✅ Premium Content System  
- Time-based access control
- Subscription management
- Content scheduling
- Preview functionality
- Bulk operations

### ✅ Email Notifications
- Template management
- Automated notifications
- Bulk campaigns
- User preferences
- Analytics tracking

### ✅ Performance Optimization
- Advanced caching
- Request monitoring
- Memory tracking
- Query optimization

## Continuous Testing

### Automated Testing in CI/CD
```yaml
# Example GitHub Actions workflow
name: FootballZone Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install
      - name: Run test suite
        run: ./scripts/run_full_test_suite.sh
```

### Local Development Testing
```bash
# Add to your development workflow
alias fz-test="./scripts/quick_status_check.sh"
alias fz-full-test="./scripts/run_full_test_suite.sh"

# Run before commits
git add . && fz-test && git commit -m "Your commit message"
```

## Contributing to Tests

### Adding New Test Scenarios
1. Update relevant test script with new endpoints/features
2. Add test cases to validation logic
3. Update expected results and error messages
4. Test the test scripts themselves!

### Test Script Structure
```bash
#!/bin/bash
# Description of what this script tests

RESULTS_FILE="test_results_$(date +%Y%m%d_%H%M%S).log"

echo "🧪 Test Name" | tee $RESULTS_FILE
echo "=============" | tee -a $RESULTS_FILE

# Test implementation
test_something() {
  if condition; then
    echo "✅ Test passed" | tee -a $RESULTS_FILE
    return 0
  else
    echo "❌ Test failed" | tee -a $RESULTS_FILE  
    return 1
  fi
}

# Run tests and track results
# Generate summary
# Exit with appropriate code
```

## Support

For issues with the testing framework:
1. Check the generated log files for detailed error information
2. Verify all prerequisites are met
3. Ensure services are running and accessible
4. Check environment variable configuration
5. Review the CLAUDE.md file for latest implementation status

The testing framework is designed to provide clear, actionable feedback to help identify gaps between documentation and implementation.