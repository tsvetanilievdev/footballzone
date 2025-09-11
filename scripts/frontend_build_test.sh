#!/bin/bash
# Frontend Build and Integration Test Script for FootballZone.bg
# Tests frontend build, dependencies, and integration components

RESULTS_FILE="frontend_build_results_$(date +%Y%m%d_%H%M%S).log"

echo "🏗️  FootballZone.bg Frontend Build Test" | tee $RESULTS_FILE
echo "=======================================" | tee -a $RESULTS_FILE
echo "Started at: $(date)" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

# Change to frontend directory
cd frontend || {
  echo "❌ Cannot find frontend directory" | tee -a $RESULTS_FILE
  exit 1
}

echo "✅ Frontend directory found" | tee -a $RESULTS_FILE

# Check if package.json exists
if [ ! -f package.json ]; then
  echo "❌ package.json not found in frontend directory" | tee -a $RESULTS_FILE
  exit 1
fi

echo "✅ package.json found" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

# Check Node.js and npm versions
echo "🔍 Checking Environment" | tee -a $RESULTS_FILE
echo "-----------------------" | tee -a $RESULTS_FILE

if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  echo "📦 Node.js Version: $NODE_VERSION" | tee -a $RESULTS_FILE
else
  echo "❌ Node.js not found" | tee -a $RESULTS_FILE
  exit 1
fi

if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm --version)
  echo "📦 npm Version: $NPM_VERSION" | tee -a $RESULTS_FILE
else
  echo "❌ npm not found" | tee -a $RESULTS_FILE
  exit 1
fi

# Check if .env.local exists
if [ -f .env.local ]; then
  echo "✅ .env.local found" | tee -a $RESULTS_FILE
  
  # Check for required environment variables
  if grep -q "NEXT_PUBLIC_API_URL" .env.local; then
    API_URL=$(grep "NEXT_PUBLIC_API_URL" .env.local | cut -d'=' -f2)
    echo "🔗 API URL configured: $API_URL" | tee -a $RESULTS_FILE
  else
    echo "⚠️  NEXT_PUBLIC_API_URL not found in .env.local" | tee -a $RESULTS_FILE
  fi
else
  echo "⚠️  .env.local not found - API integration may not work" | tee -a $RESULTS_FILE
fi

echo "" | tee -a $RESULTS_FILE

# Check dependencies
echo "📦 Checking Dependencies" | tee -a $RESULTS_FILE
echo "------------------------" | tee -a $RESULTS_FILE

if [ -d node_modules ]; then
  echo "✅ node_modules directory exists" | tee -a $RESULTS_FILE
  
  # Count installed packages
  PACKAGE_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
  echo "📊 Installed packages: $PACKAGE_COUNT" | tee -a $RESULTS_FILE
else
  echo "❌ node_modules not found. Run: npm install" | tee -a $RESULTS_FILE
  echo "Installing dependencies..." | tee -a $RESULTS_FILE
  
  if npm install > install.log 2>&1; then
    echo "✅ Dependencies installed successfully" | tee -a $RESULTS_FILE
  else
    echo "❌ Dependency installation failed" | tee -a $RESULTS_FILE
    tail -10 install.log | tee -a $RESULTS_FILE
    exit 1
  fi
fi

# Check for security vulnerabilities
echo "" | tee -a $RESULTS_FILE
echo "🛡️  Security Audit" | tee -a $RESULTS_FILE
echo "------------------" | tee -a $RESULTS_FILE

if npm audit --audit-level=high > audit.log 2>&1; then
  echo "✅ No high-severity security vulnerabilities found" | tee -a $RESULTS_FILE
else
  VULN_COUNT=$(grep -c "high severity" audit.log 2>/dev/null || echo "0")
  if [ "$VULN_COUNT" -gt 0 ]; then
    echo "⚠️  Found $VULN_COUNT high-severity vulnerabilities" | tee -a $RESULTS_FILE
    echo "Run: npm audit fix" | tee -a $RESULTS_FILE
  else
    echo "✅ Security audit passed" | tee -a $RESULTS_FILE
  fi
fi

# Check for outdated packages
echo "" | tee -a $RESULTS_FILE
echo "🔄 Checking for Outdated Packages" | tee -a $RESULTS_FILE
echo "----------------------------------" | tee -a $RESULTS_FILE

if npm outdated > outdated.log 2>&1; then
  echo "✅ All packages are up to date" | tee -a $RESULTS_FILE
else
  OUTDATED_COUNT=$(wc -l < outdated.log 2>/dev/null || echo "0")
  if [ "$OUTDATED_COUNT" -gt 1 ]; then  # Header line counts as 1
    echo "⚠️  Found $((OUTDATED_COUNT - 1)) outdated packages" | tee -a $RESULTS_FILE
    head -10 outdated.log | tee -a $RESULTS_FILE
  else
    echo "✅ All packages are up to date" | tee -a $RESULTS_FILE
  fi
fi

# Check TypeScript configuration
echo "" | tee -a $RESULTS_FILE
echo "📝 TypeScript Configuration" | tee -a $RESULTS_FILE
echo "---------------------------" | tee -a $RESULTS_FILE

if [ -f tsconfig.json ]; then
  echo "✅ tsconfig.json found" | tee -a $RESULTS_FILE
  
  # Check TypeScript compilation
  if npx tsc --noEmit > typescript.log 2>&1; then
    echo "✅ TypeScript compilation successful" | tee -a $RESULTS_FILE
  else
    ERROR_COUNT=$(wc -l < typescript.log 2>/dev/null || echo "0")
    echo "❌ TypeScript compilation failed with $ERROR_COUNT errors" | tee -a $RESULTS_FILE
    head -20 typescript.log | tee -a $RESULTS_FILE
  fi
else
  echo "⚠️  tsconfig.json not found" | tee -a $RESULTS_FILE
fi

# Check critical Phase 7 components
echo "" | tee -a $RESULTS_FILE
echo "🧩 Checking Phase 7 Components" | tee -a $RESULTS_FILE
echo "-------------------------------" | tee -a $RESULTS_FILE

critical_components=(
  "src/components/ui/FormErrors.tsx"
  "src/components/ui/PasswordRequirements.tsx"
  "src/components/ui/ErrorBoundary.tsx"
  "src/components/ui/LoadingSpinner.tsx"
  "src/components/ui/Pagination.tsx"
  "src/utils/errorUtils.ts"
  "src/contexts/AuthContext.tsx"
  "src/hooks/useAuth.ts"
  "src/services/api.ts"
)

for component in "${critical_components[@]}"; do
  if [ -f "$component" ]; then
    echo "✅ Found: $component" | tee -a $RESULTS_FILE
  else
    echo "❌ Missing: $component" | tee -a $RESULTS_FILE
  fi
done

# Test Next.js build
echo "" | tee -a $RESULTS_FILE
echo "🏗️  Testing Next.js Build" | tee -a $RESULTS_FILE
echo "-------------------------" | tee -a $RESULTS_FILE

echo "Starting Next.js build..." | tee -a $RESULTS_FILE

if timeout 300s npm run build > build.log 2>&1; then
  echo "✅ Next.js build completed successfully" | tee -a $RESULTS_FILE
  
  # Check for build warnings
  WARNING_COUNT=$(grep -ic "warning" build.log 2>/dev/null || echo "0")
  if [ "$WARNING_COUNT" -gt 0 ]; then
    echo "⚠️  Build completed with $WARNING_COUNT warnings" | tee -a $RESULTS_FILE
    echo "Recent warnings:" | tee -a $RESULTS_FILE
    grep -i "warning" build.log | tail -5 | tee -a $RESULTS_FILE
  fi
  
  # Check build output size
  if [ -d ".next" ]; then
    BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1)
    echo "📊 Build output size: $BUILD_SIZE" | tee -a $RESULTS_FILE
    
    # Check for static files
    STATIC_FILES=$(find .next/static -name "*.js" -o -name "*.css" 2>/dev/null | wc -l)
    echo "📁 Static files generated: $STATIC_FILES" | tee -a $RESULTS_FILE
  fi
  
else
  echo "❌ Next.js build failed or timed out" | tee -a $RESULTS_FILE
  echo "Build errors:" | tee -a $RESULTS_FILE
  tail -20 build.log | tee -a $RESULTS_FILE
fi

# Test linting
echo "" | tee -a $RESULTS_FILE
echo "🔍 Running ESLint" | tee -a $RESULTS_FILE
echo "-----------------" | tee -a $RESULTS_FILE

if npm run lint > lint.log 2>&1; then
  echo "✅ ESLint passed with no errors" | tee -a $RESULTS_FILE
else
  LINT_ERRORS=$(grep -c "error" lint.log 2>/dev/null || echo "0")
  LINT_WARNINGS=$(grep -c "warning" lint.log 2>/dev/null || echo "0")
  
  if [ "$LINT_ERRORS" -gt 0 ]; then
    echo "❌ ESLint found $LINT_ERRORS errors and $LINT_WARNINGS warnings" | tee -a $RESULTS_FILE
    echo "Recent errors:" | tee -a $RESULTS_FILE
    grep "error" lint.log | head -10 | tee -a $RESULTS_FILE
  else
    echo "⚠️  ESLint found $LINT_WARNINGS warnings" | tee -a $RESULTS_FILE
  fi
fi

# Check accessibility testing setup
echo "" | tee -a $RESULTS_FILE
echo "♿ Accessibility Testing Setup" | tee -a $RESULTS_FILE
echo "------------------------------" | tee -a $RESULTS_FILE

if grep -q "test:accessibility" package.json; then
  echo "✅ Accessibility tests configured" | tee -a $RESULTS_FILE
  
  # Try to run accessibility tests
  if npm run test:accessibility > accessibility.log 2>&1; then
    echo "✅ Accessibility tests passed" | tee -a $RESULTS_FILE
  else
    echo "⚠️  Accessibility tests failed or not set up completely" | tee -a $RESULTS_FILE
  fi
else
  echo "⚠️  Accessibility tests not configured" | tee -a $RESULTS_FILE
fi

# Test if frontend can start (quick test)
echo "" | tee -a $RESULTS_FILE
echo "🚀 Testing Development Server" | tee -a $RESULTS_FILE
echo "------------------------------" | tee -a $RESULTS_FILE

# Start dev server in background and test if it responds
npm run dev > dev.log 2>&1 &
DEV_PID=$!

sleep 10

if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "✅ Development server started successfully" | tee -a $RESULTS_FILE
else
  echo "❌ Development server failed to start or not responding" | tee -a $RESULTS_FILE
  echo "Dev server logs:" | tee -a $RESULTS_FILE
  tail -10 dev.log | tee -a $RESULTS_FILE
fi

# Kill the dev server
kill $DEV_PID 2>/dev/null
sleep 2

# Clean up log files
rm -f install.log audit.log outdated.log typescript.log build.log lint.log accessibility.log dev.log

# Final Assessment
echo "" | tee -a $RESULTS_FILE
echo "🏁 Final Assessment" | tee -a $RESULTS_FILE
echo "===================" | tee -a $RESULTS_FILE

# Count issues
CRITICAL_ISSUES=0
WARNINGS=0

if ! grep -q "Next.js build completed successfully" $RESULTS_FILE; then
  CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
fi

if ! grep -q "TypeScript compilation successful" $RESULTS_FILE; then
  CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
fi

if grep -q "ESLint found.*errors" $RESULTS_FILE; then
  WARNINGS=$((WARNINGS + 1))
fi

if grep -q "high-severity vulnerabilities" $RESULTS_FILE; then
  WARNINGS=$((WARNINGS + 1))
fi

echo "Critical issues: $CRITICAL_ISSUES" | tee -a $RESULTS_FILE
echo "Warnings: $WARNINGS" | tee -a $RESULTS_FILE

if [ $CRITICAL_ISSUES -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo "🎉 Frontend build status: EXCELLENT" | tee -a $RESULTS_FILE
  exit 0
elif [ $CRITICAL_ISSUES -eq 0 ]; then
  echo "✅ Frontend build status: GOOD (with warnings)" | tee -a $RESULTS_FILE
  exit 0
elif [ $CRITICAL_ISSUES -le 1 ]; then
  echo "⚠️  Frontend build status: NEEDS ATTENTION" | tee -a $RESULTS_FILE
  exit 1
else
  echo "❌ Frontend build status: CRITICAL" | tee -a $RESULTS_FILE
  exit 2
fi

echo "Completed at: $(date)" | tee -a $RESULTS_FILE