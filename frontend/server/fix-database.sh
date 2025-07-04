#!/bin/bash

echo "🔧 Fixing database issues..."

# 1. Execute migrations
echo "📊 Running database migrations..."
npm run db:migrate

# 2. Seed the database with initial data
echo "🌱 Seeding database with initial data..."
npm run seed

echo "✅ Database fixed!"
echo "🎯 Now test the APIs:"
echo "curl http://localhost:5000/api/teams"
echo "curl http://localhost:5000/api/tournaments" 