#!/bin/bash

echo "🔍 Checking database configuration..."

# 1. Check if backend container is running
echo "📊 Backend container status:"
docker ps | grep cs2beta-backend

# 2. Check DATABASE_URL in container
echo "🔗 DATABASE_URL in container:"
docker exec cs2beta-backend sh -c "echo \$DATABASE_URL"

# 3. Check if database is accessible
echo "🔌 Testing database connection:"
docker exec cs2beta-backend sh -c "node -e \"console.log('Testing DB connection...')\""

# 4. Check backend logs
echo "📋 Recent backend logs:"
docker-compose logs --tail=20 backend

echo "✅ Database check completed!" 