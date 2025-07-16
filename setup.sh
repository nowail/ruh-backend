#!/bin/bash

# Wellness Platform Setup Script
echo "🚀 Setting up Wellness Platform..."

# Function to setup with Docker
setup_with_docker() {
    echo "🐳 Setting up with Docker..."
    
    # Check if .env file exists, if not create from example
    if [ ! -f .env ]; then
        echo "📝 Creating .env file from .env.example..."
        cp .env.example .env
        echo "⚠️  Please update the .env file with your secure passwords and configuration"
        echo "   - Set POSTGRES_PASSWORD to a secure password"
        echo "   - Set RAILS_MASTER_KEY to your Rails master key"
        echo "   - Update EXTERNAL_API_URL if you have a mock server"
        echo ""
        read -p "Press Enter after updating .env file to continue..."
    fi
    
    # Stop any existing containers and remove volumes
    echo "📦 Cleaning up existing containers and volumes..."
    docker-compose down -v
    
    # Build and start all services
    echo "🔨 Building and starting services..."
    docker-compose up --build -d
    
    # Wait for services to be ready
    echo "⏳ Waiting for services to be ready..."
    sleep 15
    
    # Check if services are running
    echo "🔍 Checking service status..."
    docker-compose ps
    
    echo "✅ Virtual Wellness Platform is starting up!"
    echo ""
    echo "📱 Frontend: http://localhost:5173"
    echo "🔧 Backend API: http://localhost:3000"
    echo "🗄️  Database: localhost:${POSTGRES_PORT:-5432}"
    echo ""
    echo "📊 The system will automatically:"
    echo "   - Create fresh databases"
    echo "   - Run all migrations"
    echo "   - Seed with sample data"
    echo "   - Start background sync jobs"
    echo ""
    echo "⏱️  Please wait 30-60 seconds for full initialization..."
    echo ""
    echo "📋 To view logs:"
    echo "   Backend: docker-compose logs -f backend"
    echo "   Frontend: docker-compose logs -f frontend"
    echo "   Database: docker-compose logs -f postgres"
}

# Function to setup locally
setup_locally() {
    echo "💻 Setting up locally..."
    
    # Check if Ruby is installed
    if ! command -v ruby &> /dev/null; then
        echo "❌ Ruby is not installed. Please install Ruby 3.2+ first."
        exit 1
    fi

    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi

    # Check if PostgreSQL is installed
    if ! command -v psql &> /dev/null; then
        echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
        exit 1
    fi

    # Check if Redis is installed
    if ! command -v redis-server &> /dev/null; then
        echo "❌ Redis is not installed. Please install Redis first."
        exit 1
    fi

    echo "✅ Prerequisites check passed"

    # Backend Setup
    echo "📦 Setting up backend..."
    cd backend

    # Install Ruby dependencies
    echo "Installing Ruby gems..."
    bundle install

    # Create environment file
    if [ ! -f .env ]; then
        echo "Creating .env file..."
        cp .env.example .env
        echo "⚠️  Please update the .env file with your configuration"
        echo "   - Set DATABASE_PASSWORD to a secure password"
        echo "   - Set RAILS_MASTER_KEY to your Rails master key"
        echo "   - Update EXTERNAL_API_URL if you have a mock server"
        echo ""
        read -p "Press Enter after updating .env file to continue..."
    fi

    # Setup database
    echo "Setting up database..."
    rails db:create
    rails db:migrate
    rails db:seed

    echo "✅ Backend setup complete"

    # Frontend Setup
    echo "📦 Setting up frontend..."
    cd ../frontend

    # Install Node.js dependencies
    echo "Installing Node.js packages..."
    npm install

    # Create environment file
    if [ ! -f .env ]; then
        echo "Creating .env file..."
        cp .env.example .env
    fi

    echo "✅ Frontend setup complete"

    # Start services
    echo "🚀 Starting services..."
    echo ""
    echo "To start the application:"
    echo "1. Start Redis: redis-server"
    echo "2. Start backend: cd backend && rails server"
    echo "3. Start frontend: cd frontend && npm run dev"
    echo ""
    echo "The application will be available at:"
    echo "- Frontend: http://localhost:5173"
    echo "- Backend API: http://localhost:3000"
    echo ""
    echo "🎉 Setup complete! Happy coding!"
}

# Main script
echo "Choose your setup method:"
echo "1) Docker (Recommended - Automatic setup)"
echo "2) Local development"
echo ""
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        setup_with_docker
        ;;
    2)
        setup_locally
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac 