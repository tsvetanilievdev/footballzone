#!/bin/bash
# API Health Check Script for FootballZone.bg
# Tests all critical API endpoints and Phase 7 implementations

BASE_URL="http://localhost:5001/api/v1"
ADMIN_EMAIL="admin@footballzone.bg"
ADMIN_PASSWORD="TestAdmin123!"
RESULTS_FILE="api_health_results_$(date +%Y%m%d_%H%M%S).log"

echo "🏥 FootballZone.bg API Health Check" | tee $RESULTS_FILE
echo "====================================" | tee -a $RESULTS_FILE
echo "Started at: $(date)" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

# Function to test endpoint
test_endpoint() {
  local method=$1
  local path=$2
  local data=$3
  local expected_status=$4
  local auth_required=$5
  
  local auth_header=""
  if [ "$auth_required" = "true" ]; then
    auth_header="-H \"Authorization: Bearer $JWT_TOKEN\""
  fi
  
  local curl_cmd="curl -s -w \"%{http_code}\" -X $method $BASE_URL$path -H \"Content-Type: application/json\""
  
  if [ -n "$data" ]; then
    curl_cmd="$curl_cmd -d '$data'"
  fi
  
  if [ -n "$auth_header" ]; then
    curl_cmd="$curl_cmd $auth_header"
  fi
  
  curl_cmd="$curl_cmd -o /dev/null"
  
  local response=$(eval $curl_cmd)
  
  if [ "$response" = "$expected_status" ]; then
    echo "✅ $method $path (Status: $response)" | tee -a $RESULTS_FILE
    return 0
  else
    echo "❌ $method $path (Expected: $expected_status, Got: $response)" | tee -a $RESULTS_FILE
    return 1
  fi
}

# Check if backend is running
echo "🔍 Checking if backend is running..." | tee -a $RESULTS_FILE
if ! curl -s http://localhost:5001/api/v1/health > /dev/null 2>&1; then
  echo "❌ Backend is not running on port 5001" | tee -a $RESULTS_FILE
  echo "Please start the backend server first: cd backend && npm run dev" | tee -a $RESULTS_FILE
  exit 1
fi
echo "✅ Backend is running" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

# Get JWT token for authenticated requests
echo "🔐 Getting JWT token..." | tee -a $RESULTS_FILE
JWT_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

JWT_TOKEN=$(echo $JWT_RESPONSE | jq -r '.data.accessToken // .accessToken // empty')

if [ -z "$JWT_TOKEN" ] || [ "$JWT_TOKEN" = "null" ]; then
  echo "❌ Authentication failed. Response:" | tee -a $RESULTS_FILE
  echo "$JWT_RESPONSE" | jq '.' 2>/dev/null || echo "$JWT_RESPONSE" | tee -a $RESULTS_FILE
  echo "Please check admin credentials or auth endpoint" | tee -a $RESULTS_FILE
  JWT_TOKEN=""
else
  echo "✅ Authentication successful" | tee -a $RESULTS_FILE
fi
echo "" | tee -a $RESULTS_FILE

# Initialize counters
TOTAL_TESTS=0
PASSED_TESTS=0

# Core Authentication Endpoints
echo "🔐 Testing Authentication Endpoints" | tee -a $RESULTS_FILE
echo "------------------------------------" | tee -a $RESULTS_FILE

endpoints_auth=(
  "POST /auth/register {\"email\":\"test@example.com\",\"password\":\"TestPass123!\",\"name\":\"Test User\"} 201 false"
  "POST /auth/login {\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"} 200 false"
)

for endpoint in "${endpoints_auth[@]}"; do
  read method path data expected_status auth_required <<< "$endpoint"
  test_endpoint "$method" "$path" "$data" "$expected_status" "$auth_required"
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  if [ $? -eq 0 ]; then PASSED_TESTS=$((PASSED_TESTS + 1)); fi
done

echo "" | tee -a $RESULTS_FILE

# Core Articles Endpoints
echo "📰 Testing Articles Endpoints" | tee -a $RESULTS_FILE
echo "------------------------------" | tee -a $RESULTS_FILE

endpoints_articles=(
  "GET /articles \"\" 200 false"
  "GET /articles/search?q=футбол \"\" 200 false"
)

for endpoint in "${endpoints_articles[@]}"; do
  read method path data expected_status auth_required <<< "$endpoint"
  test_endpoint "$method" "$path" "$data" "$expected_status" "$auth_required"
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  if [ $? -eq 0 ]; then PASSED_TESTS=$((PASSED_TESTS + 1)); fi
done

echo "" | tee -a $RESULTS_FILE

# Phase 7 Analytics Endpoints (if JWT token available)
if [ -n "$JWT_TOKEN" ]; then
  echo "📊 Testing Phase 7 Analytics Endpoints" | tee -a $RESULTS_FILE
  echo "---------------------------------------" | tee -a $RESULTS_FILE
  
  endpoints_analytics=(
    "GET /analytics/dashboard \"\" 200 true"
    "GET /analytics/performance \"\" 200 true"
    "GET /analytics/realtime \"\" 200 true"
    "POST /analytics/track {\"event\":\"test_event\",\"properties\":{\"test\":true}} 200 true"
  )
  
  for endpoint in "${endpoints_analytics[@]}"; do
    read method path data expected_status auth_required <<< "$endpoint"
    test_endpoint "$method" "$path" "$data" "$expected_status" "$auth_required"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ $? -eq 0 ]; then PASSED_TESTS=$((PASSED_TESTS + 1)); fi
  done
  
  echo "" | tee -a $RESULTS_FILE
  
  # Phase 7 Series Endpoints
  echo "📚 Testing Phase 7 Series Endpoints" | tee -a $RESULTS_FILE
  echo "------------------------------------" | tee -a $RESULTS_FILE
  
  endpoints_series=(
    "GET /series \"\" 200 true"
    "GET /series/popular \"\" 200 true"
    "GET /series/category/tactics \"\" 200 true"
  )
  
  for endpoint in "${endpoints_series[@]}"; do
    read method path data expected_status auth_required <<< "$endpoint"
    test_endpoint "$method" "$path" "$data" "$expected_status" "$auth_required"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ $? -eq 0 ]; then PASSED_TESTS=$((PASSED_TESTS + 1)); fi
  done
  
  echo "" | tee -a $RESULTS_FILE
  
  # Phase 7 Premium Endpoints
  echo "💎 Testing Phase 7 Premium Endpoints" | tee -a $RESULTS_FILE
  echo "-------------------------------------" | tee -a $RESULTS_FILE
  
  endpoints_premium=(
    "GET /premium/plans \"\" 200 false"
    "GET /premium/subscription \"\" 200 true"
    "GET /premium/scheduled \"\" 200 true"
  )
  
  for endpoint in "${endpoints_premium[@]}"; do
    read method path data expected_status auth_required <<< "$endpoint"
    test_endpoint "$method" "$path" "$data" "$expected_status" "$auth_required"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ $? -eq 0 ]; then PASSED_TESTS=$((PASSED_TESTS + 1)); fi
  done
  
  echo "" | tee -a $RESULTS_FILE
  
  # Phase 7 Email Endpoints
  echo "📧 Testing Phase 7 Email Endpoints" | tee -a $RESULTS_FILE
  echo "-----------------------------------" | tee -a $RESULTS_FILE
  
  endpoints_email=(
    "GET /emails/templates \"\" 200 true"
    "GET /emails/preferences \"\" 200 true"
    "GET /emails/analytics \"\" 200 true"
  )
  
  for endpoint in "${endpoints_email[@]}"; do
    read method path data expected_status auth_required <<< "$endpoint"
    test_endpoint "$method" "$path" "$data" "$expected_status" "$auth_required"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ $? -eq 0 ]; then PASSED_TESTS=$((PASSED_TESTS + 1)); fi
  done
  
  echo "" | tee -a $RESULTS_FILE
  
  # Admin Endpoints
  echo "🛠️  Testing Admin Endpoints" | tee -a $RESULTS_FILE
  echo "---------------------------" | tee -a $RESULTS_FILE
  
  endpoints_admin=(
    "GET /admin/dashboard \"\" 200 true"
    "GET /admin/analytics \"\" 200 true"
  )
  
  for endpoint in "${endpoints_admin[@]}"; do
    read method path data expected_status auth_required <<< "$endpoint"
    test_endpoint "$method" "$path" "$data" "$expected_status" "$auth_required"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ $? -eq 0 ]; then PASSED_TESTS=$((PASSED_TESTS + 1)); fi
  done
else
  echo "⚠️  Skipping authenticated endpoint tests (no JWT token)" | tee -a $RESULTS_FILE
fi

# Final Summary
echo "" | tee -a $RESULTS_FILE
echo "📊 Final Results" | tee -a $RESULTS_FILE
echo "=================" | tee -a $RESULTS_FILE
echo "Total Tests: $TOTAL_TESTS" | tee -a $RESULTS_FILE
echo "Passed: $PASSED_TESTS" | tee -a $RESULTS_FILE
echo "Failed: $((TOTAL_TESTS - PASSED_TESTS))" | tee -a $RESULTS_FILE

if [ $TOTAL_TESTS -gt 0 ]; then
  SUCCESS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
  echo "Success Rate: $SUCCESS_RATE%" | tee -a $RESULTS_FILE
else
  echo "Success Rate: 0%" | tee -a $RESULTS_FILE
  SUCCESS_RATE=0
fi

echo "Completed at: $(date)" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

if [ $SUCCESS_RATE -ge 80 ]; then
  echo "🎉 Overall health status: GOOD" | tee -a $RESULTS_FILE
  exit 0
elif [ $SUCCESS_RATE -ge 60 ]; then
  echo "⚠️  Overall health status: MODERATE" | tee -a $RESULTS_FILE
  exit 1
else
  echo "❌ Overall health status: POOR" | tee -a $RESULTS_FILE
  exit 2
fi