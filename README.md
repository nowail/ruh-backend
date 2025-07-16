# Virtual Wellness Platform Integration

A comprehensive internal tool for wellness clinic administrators to manage clients and appointments through external API integration.

[![Ruby](https://img.shields.io/badge/Ruby-3.3+-red.svg)](https://ruby-lang.org)
[![Rails](https://img.shields.io/badge/Rails-7.0+-red.svg)](https://rubyonrails.org)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com)

## 📋 Table of Contents

- [Overview](#-overview)
- [Setup Instructions](#-setup-instructions)
- [Technology Stack](#-technology-stack)
- [Assumptions Made](#-assumptions-made)
- [Features](#-features)
- [API Documentation](#-api-documentation)
- [Architecture](#-architecture)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Incomplete Items & Future Approach](#-incomplete-items--future-approach)
- [Development Timeline](#-development-timeline)
- [Contributing](#-contributing)
- [Support](#-support)

## 🎯 Overview

This project implements a full-stack wellness platform that seamlessly integrates with external wellness clinic systems. It provides a modern, responsive interface for managing clients and appointments while maintaining real-time synchronization with external APIs.

### Key Benefits
- **Real-time Sync**: Automatic data synchronization every 15-30 minutes
- **Modern UI**: Responsive React interface with TypeScript
- **Robust Backend**: Rails 7 API with comprehensive error handling
- **Production Ready**: Docker containerization with proper security
- **Extensible**: Modular architecture for easy feature additions

## 🚀 Setup Instructions

### Prerequisites
- **Docker & Docker Compose** (for containerized setup)
- **Node.js 18+** (for local frontend development)
- **Ruby 3.3+** (for local backend development)
- **PostgreSQL 14+** (for local database)
- **Redis 7+** (for local caching)

### Quick Setup (Docker - Recommended)
```bash
# 1. Clone the repository
git clone <repository-url>
cd wellness-platform

# 2. Create environment file
cp .env.example .env

# 3. Edit environment variables (see Environment Configuration section)
nano .env

# 4. Start all services
docker-compose up --build -d

# 5. Wait for initialization (30-60 seconds)
# 6. Access the application at http://localhost:5173
```

### Manual Setup (Local Development)
```bash
# Backend Setup
cd backend
bundle install
rails db:create db:migrate db:seed
rails server

# Frontend Setup (in new terminal)
cd frontend
npm install
npm run dev
```

### Environment Configuration
Create `.env` file in root directory:
```bash
# Database
POSTGRES_DB=wellness_platform_development
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Rails
RAILS_ENV=development
RAILS_MASTER_KEY=your_master_key_here

# External API (use mock URL for development)
EXTERNAL_API_URL=https://mock.api
EXTERNAL_API_TIMEOUT=30
EXTERNAL_API_RETRIES=3

# Frontend
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## 🛠️ Technology Stack

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Ruby on Rails** | 7.0+ | API framework with API-only mode |
| **PostgreSQL** | 14+ | Primary database |
| **HTTParty** | Latest | External API client with error handling |
| **Sidekiq** | Latest | Background job processing |
| **Redis** | 7+ | Job queue and caching |
| **RSpec** | Latest | Testing framework |

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18+ | UI framework with hooks |
| **TypeScript** | 5.0+ | Type safety throughout |
| **Vite** | Latest | Build tool and development server |
| **Tailwind CSS** | Latest | Utility-first styling |
| **React Query** | Latest | Data fetching and state management |
| **React Hook Form** | Latest | Form handling with validation |
| **React Router** | Latest | Client-side routing |

### DevOps Stack
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-service orchestration |
| **Git** | Version control |

## 📋 Assumptions Made

### Technical Assumptions
1. **External API Structure**: Assumed RESTful API with standard CRUD endpoints
   - `GET /clients` - Returns list of clients
   - `GET /appointments` - Returns list of appointments
   - `POST /appointments` - Creates new appointment
   - `PUT /appointments/:id` - Updates existing appointment

2. **Data Models**: Assumed standard client and appointment data structures
   - Client: id, name, email, phone, created_at, updated_at
   - Appointment: id, client_id, appointment_type, scheduled_at, status, notes

3. **Authentication**: Assumed no authentication required for MVP (can be added later)

4. **Error Handling**: Assumed external API may be unreliable, implemented graceful fallbacks

### Business Assumptions
1. **Sync Frequency**: Assumed 15-30 minute sync intervals are acceptable for business needs
2. **Data Consistency**: Assumed eventual consistency is acceptable (not real-time)
3. **User Interface**: Assumed desktop-first design with mobile responsiveness
4. **Scalability**: Assumed moderate scale (hundreds of clients, thousands of appointments)

### Development Assumptions
1. **Development Environment**: Assumed Docker-based development for consistency
2. **Testing**: Assumed unit and integration testing sufficient for MVP
3. **Documentation**: Assumed comprehensive README and inline comments sufficient
4. **Deployment**: Assumed containerized deployment to cloud platform

## ✨ Features

### Core Features
- [x] **Client Management** - Complete CRUD operations with search and filtering
- [x] **Appointment Management** - Schedule, edit, and cancel appointments
- [x] **External API Integration** - Seamless integration with external wellness systems
- [x] **Real-time Synchronization** - Background jobs sync data automatically
- [x] **Responsive Design** - Works perfectly on desktop and mobile devices

### Advanced Features
- [x] **Advanced Search & Filtering** - Multi-criteria search across clients and appointments
- [x] **Form Validation** - Comprehensive client-side and server-side validation
- [x] **Error Handling** - Graceful error handling with user-friendly messages
- [x] **Loading States** - Skeleton loading and progress indicators
- [x] **Optimistic Updates** - Instant UI feedback for better user experience
- [x] **Pagination** - Efficient handling of large datasets

### Technical Features
- [x] **Type Safety** - Full TypeScript implementation
- [x] **API Versioning** - Future-proof API design
- [x] **Database Optimization** - Proper indexing and query optimization
- [x] **Caching** - Redis-based caching for improved performance
- [x] **Background Processing** - Sidekiq for heavy operations

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Ruby on Rails** | 7.0+ | API framework with API-only mode |
| **PostgreSQL** | 14+ | Primary database |
| **HTTParty** | Latest | External API client with error handling |
| **Sidekiq** | Latest | Background job processing |
| **Redis** | 7+ | Job queue and caching |
| **RSpec** | Latest | Testing framework |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18+ | UI framework with hooks |
| **TypeScript** | 5.0+ | Type safety throughout |
| **Vite** | Latest | Build tool and development server |
| **Tailwind CSS** | Latest | Utility-first styling |
| **React Query** | Latest | Data fetching and state management |
| **React Hook Form** | Latest | Form handling with validation |
| **React Router** | Latest | Client-side routing |

### DevOps
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-service orchestration |
| **Git** | Version control |

  

## 📚 API Documentation

### Backend API Endpoints

#### Client Management
```http
GET    /api/v1/clients              # List clients with search/filter
GET    /api/v1/clients/:id          # Get client details
```

#### Appointment Management
```http
GET    /api/v1/appointments         # List appointments with filters
GET    /api/v1/appointments/:id     # Get appointment details
POST   /api/v1/appointments         # Create new appointment
PUT    /api/v1/appointments/:id     # Update appointment
DELETE /api/v1/appointments/:id     # Cancel appointment
```

### External API Integration

#### Setup External API (Postman Mock)
1. **Download Collection**: [Postman Collection](https://drive.google.com/file/d/1ya4n3XlLuv9EZi2Wtp8Sxp6TEgbf77xy/view?usp=sharing)
2. **Import to Postman**: Import the collection into your Postman workspace
3. **Setup Mock Server**: Follow [Postman Mock Setup Guide](https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/)
4. **Update Configuration**: Set `EXTERNAL_API_URL` in your `.env` file

#### External API Endpoints
```http
GET    /clients                     # Fetch clients from external system
GET    /appointments               # Fetch appointments from external system
POST   /appointments               # Create appointment in external system
PUT    /appointments/:id           # Update appointment in external system
```

### Request/Response Examples

#### Create Appointment
```bash
curl -X POST http://localhost:3000/api/v1/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": 1,
    "appointment_type": "consultation",
    "scheduled_at": "2024-01-15T10:00:00Z",
    "notes": "Initial consultation"
  }'
```

#### Search Clients
```bash
curl "http://localhost:3000/api/v1/clients?search=john&email=john@example.com"
```

## 🔄 Data Synchronization

The system maintains data consistency through multiple synchronization mechanisms:

### Automatic Sync
- **Client Sync**: Every 30 minutes via `SyncClientsJob`
- **Appointment Sync**: Every 15 minutes via `SyncAppointmentsJob`
- **Real-time Sync**: Immediate sync on appointment changes

### Error Handling
- **Graceful Degradation**: System continues working when external API is down
- **Mock Fallback**: Returns mock data when external API is unreachable
- **Retry Logic**: Automatic retries with exponential backoff
- **Error Logging**: Comprehensive error tracking and reporting

### Sync Status Monitoring
```bash
# Check sync job status
docker-compose exec backend rails console
> Sidekiq::Queue.new.size
> Sidekiq::ScheduledSet.new.size
```

## 🏗️ Architecture

### Backend Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │   Services      │    │   Background    │
│                 │    │                 │    │     Jobs        │
│ • API Controllers│    │ • ExternalApi   │    │ • SyncClients   │
│ • Health Check  │    │ • Data Processing│    │ • SyncAppts     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Models        │
                    │                 │
                    │ • Client        │
                    │ • Appointment   │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Database      │
                    │                 │
                    │ • PostgreSQL    │
                    │ • Redis         │
                    └─────────────────┘
```

### Frontend Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Pages         │    │   Components    │    │   Services      │
│                 │    │                 │    │                 │
│ • Appointments  │    │ • Layout        │    │ • API Client    │
│ • Clients       │    │ • Forms         │    │ • Data Fetching │
│ • Dashboard     │    │ • Lists         │    │ • State Mgmt    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   State         │
                    │                 │
                    │ • React Query   │
                    │ • Local State   │
                    └─────────────────┘
```

### Key Design Patterns

- **Service Objects**: Encapsulate business logic
- **Repository Pattern**: Data access abstraction
- **Observer Pattern**: Real-time updates
- **Factory Pattern**: Object creation
- **Strategy Pattern**: Different sync strategies

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
cd backend
bundle exec rspec

# Run specific test file
bundle exec rspec spec/models/client_spec.rb

# Run with coverage
COVERAGE=true bundle exec rspec
```

### Frontend Testing
```bash
# Run all tests
cd frontend
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
```
backend/spec/
├── models/
│   ├── client_spec.rb
│   └── appointment_spec.rb
├── controllers/
│   └── api/v1/
├── services/
└── factories/

frontend/src/
├── __tests__/
├── components/
└── services/
```

## 🚀 Deployment

### Production Environment

#### Environment Variables
```bash
# Production .env
RAILS_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
EXTERNAL_API_URL=https://api.production.com
RAILS_MASTER_KEY=your_production_master_key
```

#### Deployment Commands
```bash
# Backend deployment
RAILS_ENV=production rails db:migrate
RAILS_ENV=production rails assets:precompile
RAILS_ENV=production rails server

# Frontend build
npm run build
```

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Configuration

#### Root .env (Docker)
```bash
# Database Configuration
POSTGRES_DB=wellness_platform_development
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# Rails Configuration
RAILS_ENV=development
RAILS_MASTER_KEY=your_master_key_here

# External API Configuration
EXTERNAL_API_URL=https://mock.api
EXTERNAL_API_TIMEOUT=30
EXTERNAL_API_RETRIES=3

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Logging
LOG_LEVEL=info
```

#### Backend .env (Local Development)
```bash
# Database Configuration
DATABASE_URL=postgresql://localhost/wellness_platform_development
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_secure_password_here
DATABASE_HOST=localhost
DATABASE_PORT=5432
POSTGRES_DB=wellness_platform_development

# External API Configuration
EXTERNAL_API_URL=https://mock.api
EXTERNAL_API_TIMEOUT=30
EXTERNAL_API_RETRIES=3

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# Rails Configuration
RAILS_ENV=development
RAILS_MASTER_KEY=your_master_key_here
RAILS_MAX_THREADS=5

# Logging
LOG_LEVEL=info
```

#### Frontend .env (Local Development)
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Development Configuration
VITE_APP_TITLE=Wellness Platform
VITE_APP_VERSION=1.0.0
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database status
docker-compose ps postgres

# Reset database
docker-compose down
docker volume rm wellness-platform_postgres_data
docker-compose up -d
```

#### Redis Connection Issues
```bash
# Check Redis status
docker-compose exec redis redis-cli ping

# Clear Redis cache
docker-compose exec redis redis-cli flushall
```

#### External API Issues
```bash
# Test external API connection
curl -X GET $EXTERNAL_API_URL/clients

# Check API logs
docker-compose logs -f backend | grep "ExternalApiService"
```

#### Frontend Build Issues
```bash
# Clear node modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npm run clean
```

### Logs and Debugging

#### View Application Logs
```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# Database logs
docker-compose logs -f postgres

# Redis logs
docker-compose logs -f redis
```

#### Debug Mode
```bash
# Enable debug logging
LOG_LEVEL=debug docker-compose up

# Rails console debugging
docker-compose exec backend rails console
```

### Performance Issues

#### Database Performance
```bash
# Check slow queries
docker-compose exec backend rails db:console
> EXPLAIN ANALYZE SELECT * FROM clients WHERE email LIKE '%test%';
```

#### Memory Issues
```bash
# Check container resource usage
docker stats

# Restart services
docker-compose restart backend frontend
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards
- **Ruby**: Follow [Ruby Style Guide](https://github.com/rubocop/ruby-style-guide)
- **JavaScript/TypeScript**: Follow [Airbnb Style Guide](https://github.com/airbnb/javascript)
- **Tests**: Maintain >90% test coverage
- **Documentation**: Update README and inline docs

### Pull Request Checklist
- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Feature branch is up to date

## 📊 Implementation Status

| Component | Status | Completion | Notes |
|-----------|--------|------------|-------|
| Backend API | ✅ Complete | 100% | Rails 7 API with PostgreSQL |
| External API Wrapper | ✅ Complete | 100% | HTTParty with error handling |
| Client Management | ✅ Complete | 100% | CRUD with search/filter |
| Appointment Management | ✅ Complete | 100% | CRUD with validation |
| Periodic Syncing | ✅ Complete | 100% | Sidekiq jobs every 15-30 min |
| React Frontend | ✅ Complete | 100% | TypeScript, modern UI |
| Client List Display | ✅ Complete | 100% | Name, email, phone shown |
| Upcoming Appointments | ✅ Complete | 100% | Filtered and sorted |
| New Appointment Form | ✅ Complete | 100% | Validation and error handling |
| Edit Appointments | ✅ Complete | 100% | Full edit functionality |
| Cancel Appointments | ✅ Complete | 100% | With confirmation |
| Search/Filter Clients | ✅ Complete | 100% | Multi-field search |
| Mobile Version | ❌ Not Implemented | 0% | Optional bonus feature |


### Technical Debt & Improvements

#### 1. **Authentication & Authorization**
- **Current**: No authentication implemented
- **Approach**: Implement JWT-based authentication
  - **Backend**: Devise + JWT tokens
  - **Frontend**: Protected routes, token management
  - **Features**: User roles, permissions, session management

#### 2. **Comprehensive Testing**
- **Current**: Basic test coverage
- **Approach**: Increase test coverage to >90%
  - **Backend**: Full RSpec test suite
  - **Frontend**: Jest + React Testing Library
  - **Integration**: End-to-end tests with Cypress

#### 3. **Performance Optimization**
- **Current**: Basic optimization
- **Approach**: Implement advanced caching and optimization
  - **Database**: Query optimization, indexing strategy
  - **Frontend**: Code splitting, lazy loading
  - **API**: Response caching, pagination optimization

#### 4. **Security Enhancements**
- **Current**: Basic security measures
- **Approach**: Implement comprehensive security
  - **Input Validation**: Enhanced sanitization
  - **Rate Limiting**: API rate limiting
  - **HTTPS**: SSL/TLS configuration
  - **Audit Logging**: Security event tracking

### Total Project Time
- **Completed**: 10 hours 

