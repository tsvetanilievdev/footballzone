#!/bin/bash
# Quick Status Check - Fast overview of system health
# Use this for quick verification before running full test suite

echo "⚡ Quick Status Check for FootballZone.bg"
echo "========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "CLAUDE.md" ]; then
  echo "❌ Please run from project root directory"
  exit 1
fi

echo "✅ Project directory confirmed"
echo ""

# Quick service checks
echo "🔍 Service Status:"
echo "------------------"

# Backend check
if curl -s --connect-timeout 3 http://localhost:5001/api/v1/health > /dev/null 2>&1; then
  echo "✅ Backend API (5001): UP"
else
  echo "❌ Backend API (5001): DOWN"
fi

# Frontend check  
if curl -s --connect-timeout 3 http://localhost:3000 > /dev/null 2>&1; then
  echo "✅ Frontend (3000): UP"
else
  echo "❌ Frontend (3000): DOWN" 
fi

# Database quick check
echo ""
echo "💾 Database Status:"
echo "-------------------"

if [ -f "backend/.env" ]; then
  echo "✅ Backend .env: Found"
  
  cd backend
  if [ -f "package.json" ] && [ -d "node_modules" ]; then
    if timeout 5s npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
      echo "✅ Database: Connected"
    else
      echo "❌ Database: Connection failed"
    fi
  else
    echo "⚠️  Database: Cannot test (missing dependencies)"
  fi
  cd ..
else
  echo "❌ Backend .env: Missing"
fi

# Redis check (if redis-cli available)
if command -v redis-cli &> /dev/null; then
  if redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis: Connected"
  else
    echo "❌ Redis: Connection failed"
  fi
else
  echo "⚠️  Redis: Cannot test (redis-cli not available)"
fi

echo ""
echo "📦 Dependencies:"
echo "----------------"

# Node.js
if command -v node &> /dev/null; then
  echo "✅ Node.js: $(node --version)"
else
  echo "❌ Node.js: Not found"
fi

# NPM
if command -v npm &> /dev/null; then
  echo "✅ npm: $(npm --version)"
else
  echo "❌ npm: Not found"
fi

# Backend dependencies
if [ -d "backend/node_modules" ]; then
  echo "✅ Backend dependencies: Installed"
else
  echo "❌ Backend dependencies: Missing (run: cd backend && npm install)"
fi

# Frontend dependencies  
if [ -d "frontend/node_modules" ]; then
  echo "✅ Frontend dependencies: Installed"
else
  echo "❌ Frontend dependencies: Missing (run: cd frontend && npm install)"
fi

echo ""
echo "⚡ Quick Status Summary:"
echo "========================"

# Count issues
issues=0

# Check critical services
if ! curl -s --connect-timeout 3 http://localhost:5001/api/v1/health > /dev/null 2>&1; then
  issues=$((issues + 1))
fi

if ! curl -s --connect-timeout 3 http://localhost:3000 > /dev/null 2>&1; then
  issues=$((issues + 1))
fi

# Check dependencies
if [ ! -d "backend/node_modules" ]; then
  issues=$((issues + 1))
fi

if [ ! -d "frontend/node_modules" ]; then
  issues=$((issues + 1))
fi

if [ $issues -eq 0 ]; then
  echo "🎉 Status: READY FOR TESTING"
  echo "   Run: ./scripts/run_full_test_suite.sh"
  exit 0
elif [ $issues -le 2 ]; then
  echo "⚠️  Status: NEEDS SETUP"
  echo "   Fix the issues above, then run full test suite"
  exit 1
else
  echo "❌ Status: NOT READY"
  echo "   Please complete environment setup before testing"
  exit 2
fi