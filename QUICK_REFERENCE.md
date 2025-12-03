# Quick Reference Card

One-page reference for common InvoicePro commands and configurations.

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repo-url> && cd Quotations--main
pnpm install
cp .env.example .env
pnpm dev
```

## 📝 Common Commands

### Development
```bash
pnpm dev              # Start dev server (http://localhost:5173)
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm type-check       # Check TypeScript
```

### Code Quality
```bash
pnpm lint             # Check code quality
pnpm lint:fix         # Fix linting issues
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
```

### Testing
```bash
pnpm test             # Run tests
pnpm test:ui          # Test with UI
pnpm test:coverage    # Coverage report
```

### Docker
```bash
# Build and run
docker build -t invoicepro .
docker run -p 80:80 invoicepro

# Docker Compose
docker-compose up -d         # Start all services
docker-compose down          # Stop all services
docker-compose logs -f       # View logs
docker-compose restart       # Restart services
```

## 🔧 Environment Variables

### Development (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_ENV=development
VITE_ENABLE_DEBUG=true
```

### Production (.env.production)
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_APP_ENV=production
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
```

## 📁 Key Files

```
src/
├── App.tsx                  # Main app component
├── config/env.ts           # Environment config
├── contexts/AuthContext.tsx # Auth management
├── services/               # API services
│   ├── api.ts             # API client
│   ├── auth.service.ts    # Authentication
│   ├── client.service.ts  # Client management
│   ├── invoice.service.ts # Invoice management
│   └── quotation.service.ts # Quotation management
├── components/
│   ├── ErrorBoundary.tsx  # Error handling
│   ├── ProtectedRoute.tsx # Route protection
│   └── ui/                # UI components
└── hooks/
    └── useApi.ts          # API hook
```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Current user
- `POST /api/auth/logout` - Logout

### Resources
- `GET /api/{resource}` - List
- `GET /api/{resource}/:id` - Get one
- `POST /api/{resource}` - Create
- `PATCH /api/{resource}/:id` - Update
- `DELETE /api/{resource}/:id` - Delete

Resources: clients, products, quotations, invoices

## 🐳 Docker Commands

```bash
# Build
docker build -t invoicepro .

# Run
docker run -d -p 80:80 --name invoicepro invoicepro

# Stop
docker stop invoicepro

# Remove
docker rm invoicepro

# Logs
docker logs -f invoicepro

# Shell access
docker exec -it invoicepro sh
```

## 📦 Deployment

### Quick Deploy
```bash
# Build
pnpm build

# Deploy dist/ folder to:
# - Nginx: /var/www/html/
# - Apache: /var/www/html/
# - Cloud: Use platform CLI
```

### Docker Deploy
```bash
docker-compose up -d
```

### Cloud Platforms
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

## 🔒 Security Headers (nginx.conf)

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "no-referrer-when-downgrade";
```

## 🧪 Testing Examples

```typescript
// Component test
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button', () => {
  render(<Button>Click</Button>);
  expect(screen.getByText('Click')).toBeInTheDocument();
});
```

## 🔍 Debugging

```typescript
// Enable debug mode
localStorage.setItem('debug', 'true');

// View API calls
// Check browser Network tab

// Check errors
// Check browser Console tab
```

## 📊 Performance

```bash
# Analyze bundle
pnpm build --analyze

# Check Lighthouse score
# Use Chrome DevTools > Lighthouse

# Check bundle size
du -sh dist/
```

## 🆘 Troubleshooting

### Port in use
```bash
lsof -ti:5173 | xargs kill -9
```

### Clear cache
```bash
rm -rf node_modules/.vite
rm -rf node_modules
pnpm install
```

### Docker issues
```bash
docker system prune -a
docker-compose down -v
docker-compose up -d --build
```

### API not connecting
1. Check VITE_API_URL in .env
2. Verify backend is running
3. Check CORS configuration
4. Review browser console

## 📚 Documentation Files

- `README.md` - Main documentation
- `SETUP.md` - Setup guide
- `DEPLOYMENT.md` - Deployment guide
- `CONTRIBUTING.md` - Contribution guide
- `PRODUCTION_CHECKLIST.md` - Pre-deploy checklist
- `CHANGELOG.md` - Version history

## 🔗 Useful Links

- [React Docs](https://react.dev)
- [TypeScript Docs](https://typescriptlang.org)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Docker Docs](https://docs.docker.com)

## 💡 Pro Tips

1. **Use pnpm** for faster installs
2. **Enable formatOnSave** in VS Code
3. **Run type-check** before commits
4. **Use Docker Compose** for full stack
5. **Check PRODUCTION_CHECKLIST.md** before deploy
6. **Never commit .env** files
7. **Test locally** before pushing
8. **Read error messages** carefully

## 🎯 One-Line Commands

```bash
# Full setup
git clone <repo> && cd Quotations--main && pnpm install && cp .env.example .env && pnpm dev

# Pre-commit check
pnpm lint && pnpm type-check && pnpm test && pnpm build

# Docker quick start
docker-compose up -d && docker-compose logs -f

# Production deploy
pnpm build && docker build -t invoicepro . && docker run -d -p 80:80 invoicepro
```

## 📞 Get Help

```bash
# Check package.json scripts
cat package.json | grep scripts -A 15

# View environment
cat .env

# Check Node/pnpm versions
node -v && pnpm -v

# List running containers
docker ps

# View all Docker images
docker images
```

---

**Print this page for quick reference!** 📄

For detailed information, see the full documentation files.

