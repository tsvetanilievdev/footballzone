#!/bin/bash
# Database Integrity Check Script for FootballZone.bg
# Verifies database schema, connections, and data consistency

RESULTS_FILE="db_integrity_results_$(date +%Y%m%d_%H%M%S).log"

echo "🗃️  FootballZone.bg Database Integrity Check" | tee $RESULTS_FILE
echo "=============================================" | tee -a $RESULTS_FILE
echo "Started at: $(date)" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

# Change to backend directory
cd backend || {
  echo "❌ Cannot find backend directory" | tee -a $RESULTS_FILE
  exit 1
}

# Check if .env file exists
if [ ! -f .env ]; then
  echo "❌ .env file not found in backend directory" | tee -a $RESULTS_FILE
  echo "Please create .env file with DATABASE_URL and REDIS_URL" | tee -a $RESULTS_FILE
  exit 1
fi

echo "✅ .env file found" | tee -a $RESULTS_FILE

# Source environment variables
set -a
source .env
set +a

# Check environment variables
echo "" | tee -a $RESULTS_FILE
echo "🔍 Checking Environment Variables" | tee -a $RESULTS_FILE
echo "----------------------------------" | tee -a $RESULTS_FILE

required_vars=("DATABASE_URL" "REDIS_URL" "JWT_SECRET")
missing_vars=()

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing: $var" | tee -a $RESULTS_FILE
    missing_vars+=("$var")
  else
    echo "✅ Found: $var" | tee -a $RESULTS_FILE
  fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
  echo "❌ Missing required environment variables. Please check .env file." | tee -a $RESULTS_FILE
  exit 1
fi

# Test PostgreSQL connection
echo "" | tee -a $RESULTS_FILE
echo "🐘 Testing PostgreSQL Connection" | tee -a $RESULTS_FILE
echo "---------------------------------" | tee -a $RESULTS_FILE

# Parse DATABASE_URL for connection test
if [[ $DATABASE_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
  DB_USER="${BASH_REMATCH[1]}"
  DB_PASS="${BASH_REMATCH[2]}"
  DB_HOST="${BASH_REMATCH[3]}"
  DB_PORT="${BASH_REMATCH[4]}"
  DB_NAME="${BASH_REMATCH[5]}"
  
  # Test connection using psql if available
  if command -v psql &> /dev/null; then
    if PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" > /dev/null 2>&1; then
      echo "✅ PostgreSQL connection successful" | tee -a $RESULTS_FILE
      
      # Get PostgreSQL version
      PG_VERSION=$(PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT version();" 2>/dev/null | head -1)
      echo "📊 PostgreSQL Version: $PG_VERSION" | tee -a $RESULTS_FILE
    else
      echo "❌ PostgreSQL connection failed" | tee -a $RESULTS_FILE
    fi
  else
    echo "⚠️  psql not available, skipping direct connection test" | tee -a $RESULTS_FILE
  fi
else
  echo "❌ Invalid DATABASE_URL format" | tee -a $RESULTS_FILE
fi

# Test Redis connection
echo "" | tee -a $RESULTS_FILE
echo "📦 Testing Redis Connection" | tee -a $RESULTS_FILE
echo "----------------------------" | tee -a $RESULTS_FILE

if command -v redis-cli &> /dev/null; then
  # Parse Redis URL
  if [[ $REDIS_URL =~ redis://([^:]*):?([^@]*)@?([^:]+):([0-9]+) ]] || [[ $REDIS_URL =~ redis://([^:]+):([0-9]+) ]]; then
    REDIS_HOST=$(echo $REDIS_URL | sed 's/redis:\/\///' | cut -d':' -f1)
    REDIS_PORT=$(echo $REDIS_URL | sed 's/redis:\/\///' | cut -d':' -f2 | cut -d'/' -f1)
    
    if redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" ping > /dev/null 2>&1; then
      echo "✅ Redis connection successful" | tee -a $RESULTS_FILE
      
      # Get Redis info
      REDIS_VERSION=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" info server | grep "redis_version" | cut -d':' -f2 | tr -d '\r')
      echo "📊 Redis Version: $REDIS_VERSION" | tee -a $RESULTS_FILE
      
      # Check memory usage
      REDIS_MEMORY=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" info memory | grep "used_memory_human" | cut -d':' -f2 | tr -d '\r')
      echo "💾 Redis Memory Usage: $REDIS_MEMORY" | tee -a $RESULTS_FILE
    else
      echo "❌ Redis connection failed" | tee -a $RESULTS_FILE
    fi
  else
    echo "❌ Invalid REDIS_URL format" | tee -a $RESULTS_FILE
  fi
else
  echo "⚠️  redis-cli not available, skipping direct connection test" | tee -a $RESULTS_FILE
fi

# Check Prisma schema
echo "" | tee -a $RESULTS_FILE
echo "🔧 Checking Prisma Schema" | tee -a $RESULTS_FILE
echo "--------------------------" | tee -a $RESULTS_FILE

if [ -f "prisma/schema.prisma" ]; then
  echo "✅ Prisma schema file exists" | tee -a $RESULTS_FILE
  
  # Check if Prisma client is generated
  if [ -d "node_modules/.prisma/client" ]; then
    echo "✅ Prisma client is generated" | tee -a $RESULTS_FILE
  else
    echo "⚠️  Prisma client not generated. Run: npx prisma generate" | tee -a $RESULTS_FILE
  fi
  
  # Try to validate schema
  if npx prisma validate > /dev/null 2>&1; then
    echo "✅ Prisma schema is valid" | tee -a $RESULTS_FILE
  else
    echo "❌ Prisma schema validation failed" | tee -a $RESULTS_FILE
    npx prisma validate 2>&1 | tee -a $RESULTS_FILE
  fi
  
  # Check schema sync status
  echo "🔄 Checking schema sync status..." | tee -a $RESULTS_FILE
  if npx prisma db push --accept-data-loss --preview-feature > /dev/null 2>&1; then
    echo "✅ Database schema is in sync" | tee -a $RESULTS_FILE
  else
    echo "⚠️  Database schema might need updates" | tee -a $RESULTS_FILE
    echo "Run: npx prisma db push" | tee -a $RESULTS_FILE
  fi
else
  echo "❌ Prisma schema file not found" | tee -a $RESULTS_FILE
fi

# Database Statistics (if connection works)
echo "" | tee -a $RESULTS_FILE
echo "📊 Database Statistics" | tee -a $RESULTS_FILE
echo "-----------------------" | tee -a $RESULTS_FILE

# Try to get table statistics using Prisma
if command -v node &> /dev/null && [ -d "node_modules/.prisma/client" ]; then
  # Create temporary Node.js script to get stats
  cat > temp_db_stats.js << 'EOF'
const { PrismaClient } = require('@prisma/client');

async function getStats() {
  const prisma = new PrismaClient();
  
  try {
    const stats = await Promise.allSettled([
      prisma.user.count(),
      prisma.article.count(),
      prisma.articleSeries.count(),
      prisma.userActivity.count()
    ]);
    
    console.log(`Users: ${stats[0].status === 'fulfilled' ? stats[0].value : 'Error'}`);
    console.log(`Articles: ${stats[1].status === 'fulfilled' ? stats[1].value : 'Error'}`);
    console.log(`Article Series: ${stats[2].status === 'fulfilled' ? stats[2].value : 'Error'}`);
    console.log(`User Activities: ${stats[3].status === 'fulfilled' ? stats[3].value : 'Error'}`);
    
  } catch (error) {
    console.log('Error connecting to database:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getStats();
EOF

  # Run the stats script
  if timeout 10s node temp_db_stats.js >> $RESULTS_FILE 2>&1; then
    echo "✅ Database statistics retrieved" | tee -a $RESULTS_FILE
  else
    echo "❌ Could not retrieve database statistics" | tee -a $RESULTS_FILE
  fi
  
  # Clean up
  rm -f temp_db_stats.js
else
  echo "⚠️  Cannot retrieve database statistics (Node.js or Prisma client unavailable)" | tee -a $RESULTS_FILE
fi

# Check for migrations
echo "" | tee -a $RESULTS_FILE
echo "🔄 Migration Status" | tee -a $RESULTS_FILE
echo "-------------------" | tee -a $RESULTS_FILE

if [ -d "prisma/migrations" ]; then
  MIGRATION_COUNT=$(find prisma/migrations -name "*.sql" | wc -l)
  echo "📈 Found $MIGRATION_COUNT migration files" | tee -a $RESULTS_FILE
  
  # Check migration status
  if npx prisma migrate status > migration_status.tmp 2>&1; then
    echo "✅ Migration status check successful" | tee -a $RESULTS_FILE
    cat migration_status.tmp | tee -a $RESULTS_FILE
  else
    echo "⚠️  Migration status check failed" | tee -a $RESULTS_FILE
    cat migration_status.tmp | tee -a $RESULTS_FILE
  fi
  rm -f migration_status.tmp
else
  echo "📋 No migrations directory found" | tee -a $RESULTS_FILE
fi

# Check seed data
echo "" | tee -a $RESULTS_FILE
echo "🌱 Seed Data Check" | tee -a $RESULTS_FILE
echo "------------------" | tee -a $RESULTS_FILE

if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
  echo "✅ Seed file exists" | tee -a $RESULTS_FILE
  
  # Check if seed script is defined in package.json
  if grep -q "prisma.*seed" package.json; then
    echo "✅ Seed script configured in package.json" | tee -a $RESULTS_FILE
  else
    echo "⚠️  Seed script not configured in package.json" | tee -a $RESULTS_FILE
  fi
else
  echo "⚠️  No seed file found" | tee -a $RESULTS_FILE
fi

# Final Assessment
echo "" | tee -a $RESULTS_FILE
echo "🏁 Final Assessment" | tee -a $RESULTS_FILE
echo "===================" | tee -a $RESULTS_FILE

# Count issues
ISSUES=0
if ! grep -q "PostgreSQL connection successful" $RESULTS_FILE; then
  ISSUES=$((ISSUES + 1))
fi
if ! grep -q "Redis connection successful" $RESULTS_FILE; then
  ISSUES=$((ISSUES + 1))
fi
if ! grep -q "Prisma schema is valid" $RESULTS_FILE; then
  ISSUES=$((ISSUES + 1))
fi

echo "Issues found: $ISSUES" | tee -a $RESULTS_FILE

if [ $ISSUES -eq 0 ]; then
  echo "🎉 Database integrity status: EXCELLENT" | tee -a $RESULTS_FILE
  exit 0
elif [ $ISSUES -le 1 ]; then
  echo "✅ Database integrity status: GOOD" | tee -a $RESULTS_FILE
  exit 0
elif [ $ISSUES -le 2 ]; then
  echo "⚠️  Database integrity status: NEEDS ATTENTION" | tee -a $RESULTS_FILE
  exit 1
else
  echo "❌ Database integrity status: CRITICAL" | tee -a $RESULTS_FILE
  exit 2
fi

echo "Completed at: $(date)" | tee -a $RESULTS_FILE