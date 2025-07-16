# Deployment Guide

This document provides comprehensive deployment instructions for the Wellness Platform.

## 🚀 Quick Start with Docker

The easiest way to deploy the entire application is using Docker Compose:

```bash
# Clone the repository
git clone <repository-url>
cd wellness-platform

# Start all services
docker-compose up -d

# The application will be available at:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:3000
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
```

## 🛠️ Manual Deployment

### Prerequisites

- Ruby 3.2+
- Node.js 18+
- PostgreSQL 13+
- Redis 6+

### Backend Deployment

1. **Install dependencies:**
```bash
cd backend
bundle install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Setup database:**
```bash
rails db:create
rails db:migrate
rails db:seed
```

4. **Start services:**
```bash
# Start Redis
redis-server

# Start Sidekiq (in a separate terminal)
bundle exec sidekiq

# Start Rails server
rails server
```

### Frontend Deployment

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your API URL
```

3. **Start development server:**
```bash
npm run dev
```

## 🌐 Production Deployment

### Heroku Deployment

1. **Create Heroku apps:**
```bash
# Backend
heroku create wellness-platform-api
heroku addons:create heroku-postgresql:mini
heroku addons:create heroku-redis:mini

# Frontend
heroku create wellness-platform-frontend
```

2. **Deploy backend:**
```bash
cd backend
git push heroku main
heroku run rails db:migrate
heroku run rails db:seed
```

3. **Deploy frontend:**
```bash
cd frontend
# Update VITE_API_BASE_URL in .env
git push heroku main
```

### AWS Deployment

#### Using Elastic Beanstalk

1. **Backend (Rails):**
```bash
cd backend
eb init
eb create wellness-platform-api
eb deploy
```

2. **Frontend (React):**
```bash
cd frontend
eb init
eb create wellness-platform-frontend
eb deploy
```

#### Using ECS/Fargate

1. **Build and push Docker images:**
```bash
# Backend
docker build -t wellness-platform-backend ./backend
docker tag wellness-platform-backend:latest your-registry/wellness-platform-backend:latest
docker push your-registry/wellness-platform-backend:latest

# Frontend
docker build -t wellness-platform-frontend ./frontend
docker tag wellness-platform-frontend:latest your-registry/wellness-platform-frontend:latest
docker push your-registry/wellness-platform-frontend:latest
```

2. **Deploy using ECS:**
- Create ECS cluster
- Create task definitions for backend and frontend
- Create services for each task definition
- Configure load balancers and auto-scaling

### Google Cloud Platform

#### Using Cloud Run

1. **Deploy backend:**
```bash
cd backend
gcloud builds submit --tag gcr.io/PROJECT_ID/wellness-platform-backend
gcloud run deploy wellness-platform-backend \
  --image gcr.io/PROJECT_ID/wellness-platform-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

2. **Deploy frontend:**
```bash
cd frontend
gcloud builds submit --tag gcr.io/PROJECT_ID/wellness-platform-frontend
gcloud run deploy wellness-platform-frontend \
  --image gcr.io/PROJECT_ID/wellness-platform-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🔧 Environment Configuration

### Backend Environment Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost

# External API
EXTERNAL_API_URL=https://your-mock-server.com
EXTERNAL_API_TIMEOUT=30
EXTERNAL_API_RETRIES=3

# Redis
REDIS_URL=redis://localhost:6379

# Rails
RAILS_ENV=production
RAILS_MASTER_KEY=your_master_key
SECRET_KEY_BASE=your_secret_key_base

# Sidekiq
SIDEKIQ_CONCURRENCY=5
```

### Frontend Environment Variables

```bash
# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com/api/v1

# App Configuration
VITE_APP_TITLE=Wellness Platform
VITE_APP_VERSION=1.0.0
```

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up authentication and authorization
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Configure proper logging
- [ ] Set up monitoring and alerting
- [ ] Regular security updates
- [ ] Database backups
- [ ] API key management

### SSL/TLS Configuration

```nginx
# Nginx configuration example
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 Monitoring and Logging

### Application Monitoring

1. **Health Checks:**
```bash
# Backend health
curl http://localhost:3000/health

# Frontend health
curl http://localhost:5173
```

2. **Log Monitoring:**
```bash
# Rails logs
tail -f backend/log/development.log

# Sidekiq logs
tail -f backend/log/sidekiq.log
```

3. **Database Monitoring:**
```bash
# PostgreSQL status
psql -h localhost -U postgres -c "SELECT version();"
```

### Performance Monitoring

- Set up New Relic, DataDog, or similar APM
- Configure database query monitoring
- Set up error tracking (Sentry)
- Monitor external API response times

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run backend tests
        run: |
          cd backend
          bundle install
          rails db:create
          rails db:migrate
          bundle exec rspec
      - name: Run frontend tests
        run: |
          cd frontend
          npm install
          npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Your deployment commands
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors:**
   - Check DATABASE_URL configuration
   - Ensure PostgreSQL is running
   - Verify network connectivity

2. **Redis Connection Errors:**
   - Check REDIS_URL configuration
   - Ensure Redis is running
   - Verify Redis authentication

3. **External API Errors:**
   - Check EXTERNAL_API_URL configuration
   - Verify API endpoint availability
   - Check network connectivity

4. **Frontend Build Errors:**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

### Debug Commands

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend

# Access database
docker-compose exec postgres psql -U postgres

# Access Redis
docker-compose exec redis redis-cli

# Rails console
docker-compose exec backend rails console
```

## 📞 Support

For deployment issues or questions:

1. Check the logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all services are running and healthy
4. Review the troubleshooting section above
5. Contact the development team with specific error details

---

**Note:** This deployment guide covers the most common scenarios. For specific cloud provider deployments, refer to their official documentation for best practices and specific requirements. 