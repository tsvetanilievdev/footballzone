@echo off
echo =====================================================
echo   FootballZone.bg Quick System Health Check
echo =====================================================
echo.

echo [1/5] Checking if services are running...
netstat -an | findstr ":3000" >nul
if %errorlevel%==0 (
    echo ✅ Frontend running on port 3000
) else (
    echo ❌ Frontend not running on port 3000
)

netstat -an | findstr ":5001" >nul
if %errorlevel%==0 (
    echo ✅ Backend running on port 5001
) else (
    echo ❌ Backend not running on port 5001
)

echo.
echo [2/5] Testing basic API connectivity...
curl -s http://localhost:5001/api/v1/articles?limit=1 >nul
if %errorlevel%==0 (
    echo ✅ Articles API responding
) else (
    echo ❌ Articles API not responding
)

echo.
echo [3/5] Checking environment files...
if exist "frontend\.env.local" (
    echo ✅ Frontend .env.local exists
) else (
    echo ❌ Frontend .env.local missing
)

if exist "backend\.env" (
    echo ✅ Backend .env exists
) else (
    echo ❌ Backend .env missing  
)

echo.
echo [4/5] Testing authentication endpoint...
curl -s -X POST http://localhost:5001/api/v1/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"invalid\"}" | findstr "error" >nul
if %errorlevel%==0 (
    echo ✅ Auth endpoint responding with validation
) else (
    echo ❌ Auth endpoint not working properly
)

echo.
echo [5/5] Testing database connectivity...
cd backend
npx prisma db push --preview-feature >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Database connected and schema in sync
) else (
    echo ❌ Database connection issues
)
cd ..

echo.
echo =====================================================
echo   Quick Health Check Complete
echo =====================================================
echo.
echo Next steps:
echo 1. Run full test suite: scripts\full_test.bat
echo 2. Check TESTING_PLAN.md for detailed verification
echo 3. Review any ❌ failed checks above
echo.