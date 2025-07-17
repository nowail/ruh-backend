# Heroku Deployment Guide

This guide will help you deploy the Virtual Wellness Platform to Heroku as a single app.

## 🚀 Quick Deploy (One-Click)

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/nowail/Ruh)

Click the button above to deploy directly to Heroku with all the necessary add-ons and configuration.

## 📋 Manual Deployment Steps

### Prerequisites
- Heroku CLI installed
- Git repository cloned locally
- Heroku account

### Step 1: Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### Step 2: Login to Heroku
```bash
heroku login
```

### Step 3: Create Heroku App
```bash
# Create a new Heroku app
heroku create your-wellness-platform

# Or use the GitHub integration
heroku create your-wellness-platform --buildpack heroku/ruby
```

### Step 4: Add Buildpacks
```bash
# Add Ruby buildpack (should be first)
heroku buildpacks:add heroku/ruby

# Add Node.js buildpack (for React frontend)
heroku buildpacks:add heroku/nodejs
```

### Step 5: Add Add-ons
```bash
# Add PostgreSQL database
heroku addons:create heroku-postgresql:mini

# Add Redis for Sidekiq
heroku addons:create heroku-redis:mini
```

### Step 6: Set Environment Variables
```bash
# Set Rails environment
heroku config:set RAILS_ENV=production

# Set Rails master key (generate one if needed)
heroku config:set RAILS_MASTER_KEY=your_master_key_here

# Set external API configuration
heroku config:set EXTERNAL_API_URL=https://mock.api
heroku config:set EXTERNAL_API_TIMEOUT=30
heroku config:set EXTERNAL_API_RETRIES=3

# Set Sidekiq configuration
heroku config:set SIDEKIQ_CONCURRENCY=5
```

### Step 7: Deploy the Application
```bash
# Push to Heroku
git push heroku master

# Run database migrations
heroku run rails db:migrate

# Seed the database
heroku run rails db:seed
```

### Step 8: Scale the Application
```bash
# Scale web dynos
heroku ps:scale web=1

# Scale worker dynos for Sidekiq
heroku ps:scale worker=1
```

### Step 9: Open the Application
```bash
heroku open
```

## 🔧 Configuration Details

### Environment Variables
The following environment variables are automatically set by Heroku:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `PORT` - Port for the web server

### Manual Configuration
You may need to set these manually:
```bash
# Rails master key (generate with: rails credentials:edit)
heroku config:set RAILS_MASTER_KEY=your_generated_key

# External API settings
heroku config:set EXTERNAL_API_URL=https://your-api.com
heroku config:set EXTERNAL_API_TIMEOUT=30
heroku config:set EXTERNAL_API_RETRIES=3

# Sidekiq settings
heroku config:set SIDEKIQ_CONCURRENCY=5
```

## 📊 Monitoring and Logs

### View Logs
```bash
# View real-time logs
heroku logs --tail

# View recent logs
heroku logs

# View specific log types
heroku logs --source app
heroku logs --source heroku
```

### Monitor Performance
```bash
# Check dyno status
heroku ps

# Monitor add-ons
heroku addons

# Check database status
heroku pg:info
```

### Debug Issues
```bash
# Open Rails console
heroku run rails console

# Check database
heroku run rails db:version

# Run Sidekiq manually
heroku run bundle exec sidekiq
```

## 🔄 Updating the Application

### Deploy Updates
```bash
# Commit your changes
git add .
git commit -m "Update description"

# Push to Heroku
git push heroku master

# Run migrations if needed
heroku run rails db:migrate
```

### Rollback
```bash
# Rollback to previous release
heroku rollback

# Rollback to specific release
heroku rollback v42
```

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs
heroku builds:info

# Clear build cache
heroku builds:cache:purge
```

#### Database Issues
```bash
# Reset database
heroku pg:reset DATABASE_URL

# Restore from backup
heroku pg:backups:restore b001 DATABASE_URL
```

#### Sidekiq Issues
```bash
# Check Sidekiq status
heroku run bundle exec sidekiq -V

# Restart workers
heroku restart worker
```

#### Frontend Build Issues
```bash
# Check Node.js version
heroku run node --version

# Check npm version
heroku run npm --version

# Rebuild frontend
heroku run npm run build
```

### Performance Optimization

#### Database Optimization
```bash
# Analyze database performance
heroku pg:ps

# Check slow queries
heroku pg:outliers
```

#### Memory Issues
```bash
# Check memory usage
heroku logs --tail | grep "R14"

# Scale up dynos if needed
heroku ps:scale web=1:standard-1x
```

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale web dynos
heroku ps:scale web=2

# Scale worker dynos
heroku ps:scale worker=2
```

### Vertical Scaling
```bash
# Upgrade to larger dynos
heroku ps:type standard-1x
heroku ps:type standard-2x
```

## 🔒 Security

### SSL/HTTPS
HTTPS is automatically enabled on Heroku.

### Environment Variables
Never commit sensitive data:
```bash
# Set secrets via environment variables
heroku config:set SECRET_KEY_BASE=your_secret_key
heroku config:set EXTERNAL_API_KEY=your_api_key
```

## 📞 Support

### Heroku Support
- [Heroku Documentation](https://devcenter.heroku.com/)
- [Heroku Status](https://status.heroku.com/)
- [Heroku Support](https://help.heroku.com/)

### Application Support
- Check the main README.md for application-specific issues
- Review logs: `heroku logs --tail`
- Use Rails console: `heroku run rails console`

## 🎯 Next Steps

After successful deployment:

1. **Test the Application**: Visit your Heroku URL and test all features
2. **Set Up Monitoring**: Configure Heroku add-ons for monitoring
3. **Set Up CI/CD**: Connect GitHub for automatic deployments
4. **Configure Custom Domain**: Add your custom domain
5. **Set Up Backups**: Configure automatic database backups

## 📊 Cost Estimation

### Free Tier (Discontinued)
- No longer available

### Basic Dynos
- **Web Dyno**: $7/month per dyno
- **Worker Dyno**: $7/month per dyno
- **PostgreSQL Mini**: $5/month
- **Redis Mini**: $10/month

### Estimated Monthly Cost
- **Basic Setup**: ~$29/month
- **Scaled Setup**: $50-100/month depending on usage

---

**Note**: This deployment configuration creates a single Heroku app that serves both the Rails API and React frontend. The React app is built during deployment and served from the Rails public directory. 