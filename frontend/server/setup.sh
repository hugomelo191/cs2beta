#!/bin/bash

echo "🚀 CS2Hub Backend Setup"
echo "========================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/cs2hub

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Check if PostgreSQL is running
echo "🔍 Checking PostgreSQL connection..."
if command -v psql &> /dev/null; then
    if pg_isready -h localhost -p 5432 &> /dev/null; then
        echo "✅ PostgreSQL is running"
    else
        echo "⚠️  PostgreSQL is not running. You can:"
        echo "   1. Start PostgreSQL manually"
        echo "   2. Use Docker: docker-compose up postgres"
        echo "   3. Use the full stack: docker-compose up"
    fi
else
    echo "⚠️  PostgreSQL client not found. Make sure PostgreSQL is installed."
fi

# Check if Redis is running
echo "🔍 Checking Redis connection..."
if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        echo "✅ Redis is running"
    else
        echo "⚠️  Redis is not running. You can:"
        echo "   1. Start Redis manually"
        echo "   2. Use Docker: docker-compose up redis"
        echo "   3. Use the full stack: docker-compose up"
    fi
else
    echo "⚠️  Redis client not found. Redis is optional but recommended."
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Configure your .env file with your database credentials"
echo "2. Run database migrations: npm run db:generate && npm run db:migrate"
echo "3. Start the development server: npm run dev"
echo ""
echo "Or use Docker for everything:"
echo "docker-compose up"
echo ""
echo "Happy coding! 🚀" 