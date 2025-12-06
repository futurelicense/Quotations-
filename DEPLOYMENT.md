# Deployment Guide

This guide covers different deployment strategies for InvoicePro.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Manual Deployment](#manual-deployment)
- [Cloud Platforms](#cloud-platforms)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

- Node.js 18+ (for development)
- Docker and Docker Compose (for containerized deployment)
- A backend API server running
- PostgreSQL database
- Redis (optional, for caching)

## Environment Variables

Create a `.env` file based on `.env.production.example`:

```bash
cp .env.production.example .env
```

Required environment variables:
- `VITE_API_URL` - Your backend API URL
- `VITE_APP_ENV` - Set to `production`
- Payment gateway keys (if using payment integrations)

## Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t invoicepro-frontend .

# Run the container
docker run -d -p 80:80 --name invoicepro invoicepro-frontend
```

### Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop services
docker-compose down
```

## Manual Deployment

### Build for Production

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Build the application
pnpm build

# The built files will be in the `dist` directory
```

### Deploy to Nginx

```bash
# Copy built files to nginx directory
sudo cp -r dist/* /var/www/html/

# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/invoicepro
sudo ln -s /etc/nginx/sites-available/invoicepro /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## Cloud Platforms

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
netlify deploy --prod
```

### AWS S3 + CloudFront

```bash
# Build the application
pnpm build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### DigitalOcean App Platform

1. Connect your GitHub repository
2. Set build command: `pnpm build`
3. Set output directory: `dist`
4. Add environment variables
5. Deploy

## CI/CD with GitHub Actions

The project includes automated CI/CD pipelines:

1. **Continuous Integration** (`.github/workflows/ci-cd.yml`):
   - Runs on every push and pull request
   - Lints code
   - Runs tests
   - Builds the application
   - Creates Docker images (on main branch)

2. **Security Scanning** (`.github/workflows/security.yml`):
   - Scans dependencies for vulnerabilities
   - Scans Docker images with Trivy
   - Runs weekly

### Required GitHub Secrets

Add these secrets in your GitHub repository settings:

```
DOCKER_USERNAME       - Your Docker Hub username
DOCKER_PASSWORD       - Your Docker Hub password
DEPLOY_HOST          - Production server IP/hostname
DEPLOY_USER          - SSH user for deployment
DEPLOY_SSH_KEY       - SSH private key for deployment
VITE_API_URL         - Production API URL
```

## SSL/TLS Configuration

### Using Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

### Update nginx configuration

The SSL configuration will be automatically added by certbot.

## Monitoring and Maintenance

### Health Checks

The application includes a health check endpoint at `/health`.

### Logs

View Docker logs:
```bash
docker-compose logs -f frontend
```

View nginx logs:
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose build frontend
docker-compose up -d frontend

# Clean up old images
docker system prune -f
```

### Backup

Ensure you have backups of:
- Database (PostgreSQL)
- Environment variables
- Configuration files
- User uploads (if any)

### Performance Optimization

1. **Enable CDN**: Use CloudFlare or similar for static assets
2. **Image Optimization**: Compress and optimize all images
3. **Caching**: Configure proper cache headers in nginx
4. **Monitoring**: Set up monitoring with tools like:
   - Sentry for error tracking
   - Google Analytics for user analytics
   - Prometheus + Grafana for infrastructure monitoring

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find and kill process using port 80
sudo lsof -i :80
sudo kill -9 <PID>
```

**Permission denied:**
```bash
# Run with sudo or add user to docker group
sudo usermod -aG docker $USER
```

**API connection failed:**
- Check `VITE_API_URL` in environment variables
- Ensure backend is running and accessible
- Check nginx proxy configuration

## Support

For issues and questions:
- Create an issue on GitHub
- Check the main README for documentation
- Contact support team

## Security Checklist

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables properly configured
- [ ] Security headers configured in nginx
- [ ] Regular security updates applied
- [ ] Database credentials secured
- [ ] API keys rotated regularly
- [ ] CORS properly configured on backend
- [ ] Rate limiting enabled
- [ ] Regular backups scheduled
- [ ] Monitoring and alerting set up



