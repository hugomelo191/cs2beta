#!/bin/bash

echo "🚀 CS2Hub Database Setup"
echo "========================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Docker is running"

# Navigate to server directory
cd server

# Stop any existing containers
print_status "Stopping existing containers..."
docker-compose down -v

# Start the database services
print_status "Starting database services..."
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
print_status "Waiting for PostgreSQL to be ready..."
sleep 10

# Check if PostgreSQL is ready
until docker-compose exec -T postgres pg_isready -U postgres; do
    print_warning "PostgreSQL is not ready yet. Waiting..."
    sleep 5
done

print_success "PostgreSQL is ready!"

# Run database migrations
print_status "Running database migrations..."
docker-compose exec -T postgres psql -U postgres -d cs2hub -f /docker-entrypoint-initdb.d/0001_initial.sql

if [ $? -eq 0 ]; then
    print_success "Migrations completed successfully!"
else
    print_error "Migration failed!"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Run database seed
print_status "Seeding database with initial data..."
npm run seed

if [ $? -eq 0 ]; then
    print_success "Database seeded successfully!"
else
    print_error "Database seeding failed!"
    exit 1
fi

# Start the API server
print_status "Starting API server..."
docker-compose up -d api

# Wait for API to be ready
print_status "Waiting for API to be ready..."
sleep 5

# Test API health
print_status "Testing API health..."
curl -f http://localhost:5000/health > /dev/null 2>&1

if [ $? -eq 0 ]; then
    print_success "API is running and healthy!"
else
    print_warning "API health check failed, but server might still be starting..."
fi

# Start Drizzle Studio
print_status "Starting Drizzle Studio..."
docker-compose up -d drizzle-studio

print_success "🎉 Database setup completed!"
echo ""
echo "📋 Access URLs:"
echo "   API: http://localhost:5000"
echo "   Health Check: http://localhost:5000/health"
echo "   Drizzle Studio: http://localhost:4983"
echo ""
echo "📋 Default credentials:"
echo "   Admin: admin@cs2hub.pt / admin123"
echo "   User 1: player1@cs2hub.pt / admin123"
echo "   User 2: player2@cs2hub.pt / admin123"
echo ""
echo "🔧 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart API: docker-compose restart api"
echo ""

# Navigate back to root
cd ..

print_status "Setup completed! You can now start the frontend with 'npm run dev'" 