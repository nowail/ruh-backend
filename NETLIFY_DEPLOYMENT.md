# Netlify Deployment Guide

This guide will help you deploy the frontend of the Wellness Platform to Netlify.

## Prerequisites

1. A Netlify account (free tier available)
2. Your backend deployed and accessible via HTTPS
3. Git repository with the frontend code

## Deployment Steps

### 1. Prepare Your Repository

The frontend is already configured for Netlify deployment with:
- `netlify.toml` - Build configuration
- `public/_redirects` - SPA routing support
- Proper build scripts in `package.json`

### 2. Deploy to Netlify

#### Option A: Deploy via Netlify UI (Recommended)

1. **Connect to Git:**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "New site from Git"
   - Choose your Git provider (GitHub, GitLab, etc.)
   - Select your repository

2. **Configure Build Settings:**
   - **Base directory:** `frontend` (since frontend is in a subdirectory)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - Click "Deploy site"

3. **Set Environment Variables:**
   - Go to Site settings → Environment variables
   - Add the following variable:
     - **Key:** `VITE_API_BASE_URL`
     - **Value:** `https://your-backend-domain.com/api/v1`
     - Replace `your-backend-domain.com` with your actual backend URL

#### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   cd frontend
   netlify deploy --prod --dir=dist
   ```

### 3. Configure Environment Variables

After deployment, set the environment variable for your API:

1. Go to your Netlify dashboard
2. Navigate to Site settings → Environment variables
3. Add:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://your-backend-domain.com/api/v1`

### 4. Update API Configuration

The frontend is configured to use the `VITE_API_BASE_URL` environment variable. Make sure your backend is deployed and accessible via HTTPS.

## Important Notes

### CORS Configuration

Your backend needs to allow requests from your Netlify domain. Update your Rails backend CORS configuration:

```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://your-netlify-app.netlify.app', 'http://localhost:5173'
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false
  end
end
```

### Environment Variables

The frontend uses these environment variables:
- `VITE_API_BASE_URL` - Your backend API URL (required for production)

### Build Process

The build process:
1. Installs dependencies (`npm install`)
2. Builds the React app (`npm run build`)
3. Outputs to `dist/` directory
4. Netlify serves from `dist/`

### Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS settings as instructed by Netlify

## Troubleshooting

### Build Failures

- Check that Node.js version is compatible (configured for v18)
- Verify all dependencies are in `package.json`
- Check build logs in Netlify dashboard

### API Connection Issues

- Verify `VITE_API_BASE_URL` is set correctly
- Ensure backend CORS allows your Netlify domain
- Check that backend is accessible via HTTPS

### Routing Issues

- The `_redirects` file handles SPA routing
- All routes redirect to `index.html` for client-side routing

## Deployment URL

After successful deployment, your app will be available at:
`https://your-app-name.netlify.app`

You can customize this URL in the Netlify dashboard under Site settings → Domain management. 