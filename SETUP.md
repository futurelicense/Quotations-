# InvoicePro Setup Guide

This guide will help you set up InvoicePro for development or production.

## Quick Start (Development)

### 1. Prerequisites

Ensure you have the following installed:
- Node.js >= 18.0.0
- pnpm >= 8.0.0 (or npm)
- Git

Check versions:
```bash
node --version  # Should be >= 18.0.0
pnpm --version  # Should be >= 8.0.0
```

Install pnpm if needed:
```bash
npm install -g pnpm
```

### 2. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd Quotations--main

# Install dependencies
pnpm install
```

### 3. Environment Configuration

Create a `.env` file:
```bash
# Copy the example file
cp .env.example .env

# Edit with your configuration
nano .env
```

Minimum required configuration:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_ENV=development
```

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### 5. Backend Setup (Required)

InvoicePro requires a backend API. You need to:

1. Set up a backend server (Node.js/Express recommended)
2. Implement the required API endpoints (see README.md)
3. Configure database (PostgreSQL recommended)
4. Update `VITE_API_URL` in `.env`

For a quick start, you can use mock mode (see below).

## Development Tools

### Available Scripts

```bash
pnpm dev           # Start dev server (with HMR)
pnpm build         # Build for production
pnpm preview       # Preview production build
pnpm lint          # Check code quality
pnpm lint:fix      # Fix linting issues
pnpm type-check    # Check TypeScript types
pnpm format        # Format code with Prettier
pnpm test          # Run tests
```

### VS Code Extensions (Recommended)

Install these extensions for the best development experience:
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Path Intellisense
- GitLens

### VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Production Setup

### Option 1: Docker (Recommended)

```bash
# Build Docker image
docker build -t invoicepro .

# Run container
docker run -d -p 80:80 invoicepro

# Or use Docker Compose
docker-compose up -d
```

### Option 2: Manual Build

```bash
# Create production environment file
cp .env.production.example .env.production

# Edit with production settings
nano .env.production

# Build
pnpm build

# Deploy the dist/ folder to your server
```

### Option 3: Cloud Platforms

#### Vercel
```bash
npm i -g vercel
vercel --prod
```

#### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Configuration Details

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | Yes | - |
| `VITE_APP_ENV` | Environment | Yes | development |
| `VITE_AUTH_TOKEN_KEY` | Token storage key | No | invoicepro_token |
| `VITE_ENABLE_DEBUG` | Enable debug mode | No | false |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | No | false |

Payment gateway variables (optional):
- `VITE_PAYSTACK_PUBLIC_KEY`
- `VITE_FLUTTERWAVE_PUBLIC_KEY`
- `VITE_STRIPE_PUBLIC_KEY`

### API Integration

Your backend must implement these endpoints:

**Authentication:**
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `POST /api/auth/logout`

**Resources:**
- `GET /api/clients` - List clients
- `POST /api/clients` - Create client
- `GET /api/quotations` - List quotations
- `POST /api/quotations` - Create quotation
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice

See full API specification in [README.md](README.md#api-integration).

## Database Setup

### PostgreSQL (Recommended)

```bash
# Using Docker
docker run -d \
  --name invoicepro-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=invoicepro \
  -p 5432:5432 \
  postgres:15-alpine

# Or install locally
# macOS
brew install postgresql@15

# Ubuntu
sudo apt install postgresql-15
```

Create database:
```sql
CREATE DATABASE invoicepro;
CREATE USER invoicepro_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE invoicepro TO invoicepro_user;
```

### Redis (Optional - for caching)

```bash
# Using Docker
docker run -d \
  --name invoicepro-redis \
  -p 6379:6379 \
  redis:7-alpine

# Or install locally
# macOS
brew install redis

# Ubuntu
sudo apt install redis-server
```

## Troubleshooting

### Port 5173 already in use

```bash
# Find and kill process
lsof -ti:5173 | xargs kill -9

# Or use different port
pnpm dev -- --port 3000
```

### Module not found errors

```bash
# Clear cache and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Build errors

```bash
# Check for type errors
pnpm type-check

# Check for linting errors
pnpm lint

# Clear Vite cache
rm -rf node_modules/.vite
```

### API connection issues

1. Check `VITE_API_URL` in `.env`
2. Ensure backend is running
3. Check browser console for errors
4. Verify CORS is configured on backend
5. Check network tab in DevTools

### Docker issues

```bash
# View logs
docker logs invoicepro-frontend

# Restart container
docker restart invoicepro-frontend

# Rebuild image
docker build --no-cache -t invoicepro .
```

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Write code
- Follow coding standards
- Add tests
- Update documentation

### 3. Test Locally

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/).

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Testing

### Unit Tests

```bash
# Run once
pnpm test

# Watch mode
pnpm test --watch

# With coverage
pnpm test:coverage
```

### Integration Tests

Set up test environment:
```bash
cp .env.test.example .env.test
```

Run integration tests:
```bash
pnpm test:integration
```

### E2E Tests (Coming Soon)

```bash
pnpm test:e2e
```

## Performance Optimization

### Development

- Use React DevTools Profiler
- Check component re-renders
- Optimize large lists with virtualization
- Use React.memo() for expensive components

### Production

- Analyze bundle size: `pnpm build --analyze`
- Enable compression (gzip/brotli)
- Use CDN for static assets
- Implement lazy loading
- Optimize images

## Security Best Practices

1. **Never commit secrets**
   - Use `.env` files (already in .gitignore)
   - Use environment variables
   - Rotate keys regularly

2. **Keep dependencies updated**
   ```bash
   pnpm update
   pnpm audit
   ```

3. **Use HTTPS in production**
   - Get SSL certificate (Let's Encrypt)
   - Redirect HTTP to HTTPS

4. **Implement security headers**
   - Already configured in `nginx.conf`
   - Test with securityheaders.com

5. **Regular security audits**
   ```bash
   pnpm audit
   ```

## Getting Help

### Documentation
- [README.md](README.md) - Main documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guide
- [API Documentation](README.md#api-integration)

### Support Channels
- GitHub Issues - Bug reports and feature requests
- GitHub Discussions - Questions and discussions
- Stack Overflow - Tag with `invoicepro`

### Common Resources
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Next Steps

After setup:
1. Read through the codebase structure
2. Try creating a simple component
3. Review the API integration
4. Set up your backend
5. Start building features!

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

Happy coding! 🚀


