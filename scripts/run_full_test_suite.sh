#!/bin/bash
# Full Test Suite Runner for FootballZone.bg
# Orchestrates all testing scripts and generates comprehensive report

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SUITE_RESULTS_FILE="full_test_suite_results_$TIMESTAMP.md"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🧪 FootballZone.bg - Full Test Suite" | tee $SUITE_RESULTS_FILE
echo "====================================" | tee -a $SUITE_RESULTS_FILE
echo "" | tee -a $SUITE_RESULTS_FILE
echo "**Started at:** $(date)" | tee -a $SUITE_RESULTS_FILE
echo "**Test Suite ID:** $TIMESTAMP" | tee -a $SUITE_RESULTS_FILE
echo "" | tee -a $SUITE_RESULTS_FILE

# Check if we're in the project root
if [ ! -f "CLAUDE.md" ]; then
  echo "❌ Please run this script from the project root directory" | tee -a $SUITE_RESULTS_FILE
  exit 1
fi

echo "✅ Project root directory confirmed" | tee -a $SUITE_RESULTS_FILE
echo "" | tee -a $SUITE_RESULTS_FILE

# Initialize test results tracking
declare -A test_results
declare -A test_durations

# Function to run test and track results
run_test() {
  local test_name=$1
  local script_path=$2
  local description=$3
  
  echo "## 🔄 Running: $test_name" | tee -a $SUITE_RESULTS_FILE
  echo "" | tee -a $SUITE_RESULTS_FILE
  echo "**Description:** $description" | tee -a $SUITE_RESULTS_FILE
  echo "**Script:** $script_path" | tee -a $SUITE_RESULTS_FILE
  echo "" | tee -a $SUITE_RESULTS_FILE
  
  local start_time=$(date +%s)
  
  if [ -f "$script_path" ]; then
    echo "Executing $script_path..." | tee -a $SUITE_RESULTS_FILE
    
    # Make script executable
    chmod +x "$script_path"
    
    # Run the script and capture output
    if bash "$script_path" > "temp_${test_name}_output.log" 2>&1; then
      test_results[$test_name]="PASSED"
      echo "✅ **Result:** PASSED" | tee -a $SUITE_RESULTS_FILE
    else
      local exit_code=$?
      test_results[$test_name]="FAILED"
      echo "❌ **Result:** FAILED (Exit code: $exit_code)" | tee -a $SUITE_RESULTS_FILE
    fi
    
    # Include key output in report
    echo "" | tee -a $SUITE_RESULTS_FILE
    echo "**Key Output:**" | tee -a $SUITE_RESULTS_FILE
    echo "\`\`\`" | tee -a $SUITE_RESULTS_FILE
    tail -20 "temp_${test_name}_output.log" | tee -a $SUITE_RESULTS_FILE
    echo "\`\`\`" | tee -a $SUITE_RESULTS_FILE
    
    # Show full log file location
    echo "" | tee -a $SUITE_RESULTS_FILE
    echo "**Full output:** [temp_${test_name}_output.log](./temp_${test_name}_output.log)" | tee -a $SUITE_RESULTS_FILE
    
  else
    test_results[$test_name]="SKIPPED"
    echo "⚠️  **Result:** SKIPPED (Script not found)" | tee -a $SUITE_RESULTS_FILE
  fi
  
  local end_time=$(date +%s)
  local duration=$((end_time - start_time))
  test_durations[$test_name]=$duration
  
  echo "**Duration:** ${duration}s" | tee -a $SUITE_RESULTS_FILE
  echo "" | tee -a $SUITE_RESULTS_FILE
  echo "---" | tee -a $SUITE_RESULTS_FILE
  echo "" | tee -a $SUITE_RESULTS_FILE
}

# Pre-flight checks
echo "## 🔍 Pre-flight Checks" | tee -a $SUITE_RESULTS_FILE
echo "" | tee -a $SUITE_RESULTS_FILE

# Check if required tools are available
tools_check() {
  local tool=$1
  local required=$2
  
  if command -v $tool &> /dev/null; then
    local version=$($tool --version 2>/dev/null | head -1)
    echo "✅ $tool: $version" | tee -a $SUITE_RESULTS_FILE
  else
    if [ "$required" = "true" ]; then
      echo "❌ $tool: Not found (REQUIRED)" | tee -a $SUITE_RESULTS_FILE
      return 1
    else
      echo "⚠️  $tool: Not found (optional)" | tee -a $SUITE_RESULTS_FILE
    fi
  fi
  return 0
}

echo "**Tool Availability:**" | tee -a $SUITE_RESULTS_FILE
tools_check "node" "true"
tools_check "npm" "true"
tools_check "curl" "true"
tools_check "jq" "false"
tools_check "psql" "false"
tools_check "redis-cli" "false"

echo "" | tee -a $SUITE_RESULTS_FILE

# Check if services are running
echo "**Service Availability:**" | tee -a $SUITE_RESULTS_FILE

# Backend check
if curl -s http://localhost:5001/api/v1/health > /dev/null 2>&1; then
  echo "✅ Backend API (port 5001): Running" | tee -a $SUITE_RESULTS_FILE
else
  echo "❌ Backend API (port 5001): Not responding" | tee -a $SUITE_RESULTS_FILE
  echo "   Please start: cd backend && npm run dev" | tee -a $SUITE_RESULTS_FILE
fi

# Frontend check
if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "✅ Frontend (port 3000): Running" | tee -a $SUITE_RESULTS_FILE
else
  echo "❌ Frontend (port 3000): Not responding" | tee -a $SUITE_RESULTS_FILE
  echo "   Please start: cd frontend && npm run dev" | tee -a $SUITE_RESULTS_FILE
fi

echo "" | tee -a $SUITE_RESULTS_FILE
echo "---" | tee -a $SUITE_RESULTS_FILE
echo "" | tee -a $SUITE_RESULTS_FILE

# Run all tests
echo "# 🧪 Test Execution" | tee -a $SUITE_RESULTS_FILE
echo "" | tee -a $SUITE_RESULTS_FILE

# Test 1: Database Integrity
run_test "database_integrity" "$SCRIPT_DIR/db_integrity_check.sh" \
  "Verifies database connections, schema integrity, and data consistency"

# Test 2: API Health Check  
run_test "api_health" "$SCRIPT_DIR/api_health_check.sh" \
  "Tests all critical API endpoints including Phase 7 implementations"

# Test 3: Frontend Build
run_test "frontend_build" "$SCRIPT_DIR/frontend_build_test.sh" \
  "Validates frontend build process, dependencies, and TypeScript compilation"

# Generate comprehensive summary
echo "# 📊 Test Suite Summary" | tee -a $SUITE_RESULTS_FILE
echo "" | tee -a $SUITE_RESULTS_FILE

TOTAL_TESTS=${#test_results[@]}
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0
TOTAL_DURATION=0

echo "| Test Name | Result | Duration | Status |" | tee -a $SUITE_RESULTS_FILE
echo "|-----------|--------|----------|--------|" | tee -a $SUITE_RESULTS_FILE

for test in "${!test_results[@]}"; do
  result="${test_results[$test]}"
  duration="${test_durations[$test]}"
  TOTAL_DURATION=$((TOTAL_DURATION + duration))
  
  case $result in
    "PASSED")
      PASSED_TESTS=$((PASSED_TESTS + 1))
      status_icon="✅"
      ;;
    "FAILED")
      FAILED_TESTS=$((FAILED_TESTS + 1))
      status_icon="❌"
      ;;
    "SKIPPED")
      SKIPPED_TESTS=$((SKIPPED_TESTS + 1))
      status_icon="⚠️"
      ;;
  esac
  
  echo "| $test | $result | ${duration}s | $status_icon |" | tee -a $SUITE_RESULTS_FILE
done

echo "" | tee -a $SUITE_RESULTS_FILE

# Calculate success rate
if [ $TOTAL_TESTS -gt 0 ]; then
  SUCCESS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
else
  SUCCESS_RATE=0
fi

echo "## 📈 Statistics" | tee -a $SUITE_RESULTS_FILE
echo "" | tee -a $SUITE_RESULTS_FILE
echo "- **Total Tests:** $TOTAL_TESTS" | tee -a $SUITE_RESULTS_FILE
echo "- **Passed:** $PASSED_TESTS" | tee -a $SUITE_RESULTS_FILE
echo "- **Failed:** $FAILED_TESTS" | tee -a $SUITE_RESULTS_FILE
echo "- **Skipped:** $SKIPPED_TESTS" | tee -a $SUITE_RESULTS_FILE
echo "- **Success Rate:** $SUCCESS_RATE%" | tee -a $SUITE_RESULTS_FILE
echo "- **Total Duration:** $TOTAL_DURATION seconds" | tee -a $SUITE_RESULTS_FILE
echo "" | tee -a $SUITE_RESULTS_FILE

# Overall health assessment
echo "## 🏥 Overall Health Assessment" | tee -a $SUITE_RESULTS_FILE
echo "" | tee -a $SUITE_RESULTS_FILE

if [ $SUCCESS_RATE -ge 90 ]; then
  health_status="🎉 EXCELLENT"
  exit_code=0
elif [ $SUCCESS_RATE -ge 75 ]; then
  health_status="✅ GOOD"
  exit_code=0
elif [ $SUCCESS_RATE -ge 50 ]; then
  health_status="⚠️ NEEDS ATTENTION"
  exit_code=1
else
  health_status="❌ CRITICAL"
  exit_code=2
fi

echo "**Status:** $health_status" | tee -a $SUITE_RESULTS_FILE
echo "" | tee -a $SUITE_RESULTS_FILE

# Recommendations based on results
echo "## 🔧 Recommendations" | tee -a $SUITE_RESULTS_FILE
echo "" | tee -a $SUITE_RESULTS_FILE

if [ $FAILED_TESTS -gt 0 ]; then
  echo "### 🚨 Critical Issues to Address:" | tee -a $SUITE_RESULTS_FILE
  echo "" | tee -a $SUITE_RESULTS_FILE
  
  for test in "${!test_results[@]}"; do
    if [ "${test_results[$test]}" = "FAILED" ]; then
      case $test in
        "database_integrity")
          echo "- **Database Issues:** Check PostgreSQL/Redis connections and schema sync" | tee -a $SUITE_RESULTS_FILE
          echo "  - Verify .env file configuration" | tee -a $SUITE_RESULTS_FILE
          echo "  - Run: \`cd backend && npx prisma db push\`" | tee -a $SUITE_RESULTS_FILE
          ;;
        "api_health")
          echo "- **API Issues:** Backend endpoints not responding correctly" | tee -a $SUITE_RESULTS_FILE
          echo "  - Check backend server logs" | tee -a $SUITE_RESULTS_FILE
          echo "  - Verify authentication system" | tee -a $SUITE_RESULTS_FILE
          echo "  - Test Phase 7 service implementations" | tee -a $SUITE_RESULTS_FILE
          ;;
        "frontend_build")
          echo "- **Frontend Issues:** Build or compilation problems" | tee -a $SUITE_RESULTS_FILE
          echo "  - Check TypeScript errors" | tee -a $SUITE_RESULTS_FILE
          echo "  - Verify dependencies with \`npm install\`" | tee -a $SUITE_RESULTS_FILE
          echo "  - Check .env.local configuration" | tee -a $SUITE_RESULTS_FILE
          ;;
      esac
      echo "" | tee -a $SUITE_RESULTS_FILE
    fi
  done
fi

if [ $SUCCESS_RATE -ge 75 ]; then
  echo "### ✨ Next Steps:" | tee -a $SUITE_RESULTS_FILE
  echo "" | tee -a $SUITE_RESULTS_FILE
  echo "- Run end-to-end integration tests" | tee -a $SUITE_RESULTS_FILE
  echo "- Perform manual testing of critical user flows" | tee -a $SUITE_RESULTS_FILE
  echo "- Verify Phase 7 feature implementations" | tee -a $SUITE_RESULTS_FILE
  echo "- Test error handling and security measures" | tee -a $SUITE_RESULTS_FILE
fi

echo "" | tee -a $SUITE_RESULTS_FILE
echo "---" | tee -a $SUITE_RESULTS_FILE
echo "" | tee -a $SUITE_RESULTS_FILE
echo "**Completed at:** $(date)" | tee -a $SUITE_RESULTS_FILE
echo "**Report saved to:** $SUITE_RESULTS_FILE" | tee -a $SUITE_RESULTS_FILE

# Summary output to console
echo ""
echo "🏁 Test Suite Completed"
echo "======================="
echo "Results: $PASSED_TESTS passed, $FAILED_TESTS failed, $SKIPPED_TESTS skipped"
echo "Success Rate: $SUCCESS_RATE%"
echo "Overall Status: $health_status"
echo ""
echo "📄 Full report: $SUITE_RESULTS_FILE"

# Clean up temp files after a delay
(sleep 60 && rm -f temp_*_output.log) &

exit $exit_code