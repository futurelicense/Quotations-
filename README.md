# InvoicePro - Professional Quotation & Invoicing Platform

<div align="center">

![InvoicePro Logo](https://img.shields.io/badge/InvoicePro-v1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)

A modern, full-featured quotation and invoicing platform built with React, TypeScript, and Tailwind CSS.

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Deployment](#deployment) • [Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Features
- 📊 **Dashboard** - Real-time business metrics and analytics
- 👥 **Client Management** - Comprehensive client database with full CRUD operations
- 📦 **Product/Service Catalog** - Manage products and services with pricing
- 📄 **Quotations** - Create, send, and track professional quotations
- 🧾 **Invoicing** - Generate invoices from quotations or create new ones
- 💰 **Payment Tracking** - Monitor payments with multiple payment methods
- 📈 **Analytics** - Revenue insights and business performance metrics
- 🤖 **Automation** - Recurring invoices and automated reminders
- 🎨 **Custom Templates** - Branded quotation and invoice templates

### Technical Features
- 🔐 **Authentication** - Secure JWT-based authentication
- 🛡️ **Error Boundaries** - Graceful error handling
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🎯 **Type Safety** - Full TypeScript implementation
- 🚀 **Performance** - Optimized builds with code splitting
- 🐳 **Docker Support** - Containerized deployment
- 🔄 **CI/CD** - Automated testing and deployment pipelines
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS
- ♿ **Accessibility** - WCAG compliant

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript 5.5** - Type safety
- **Vite 5.2** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Tailwind CSS 3.4** - Utility-first CSS
- **Lucide React** - Beautiful icons

### Backend & Database
- **Supabase** - Backend as a Service (BaaS)
- **PostgreSQL** - Database (via Supabase)
- **Row Level Security** - Data protection
- **Supabase Auth** - Authentication & authorization

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **Docker** - Containerization
- **GitHub Actions** - CI/CD

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommended) or npm
- **Docker** (optional, for containerized deployment)
- **Git**

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- A Supabase account (free tier available)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Quotations--main
```

### 2. Set Up Supabase (5 minutes)

**Option A: Quick Setup (Recommended)**
Follow [SUPABASE_QUICKSTART.md](SUPABASE_QUICKSTART.md) for a 5-minute setup guide.

**Option B: Detailed Setup**
Follow [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for comprehensive instructions.

**Quick Summary:**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run `supabase/schema.sql` in SQL Editor
4. Copy your project URL and anon key

### 3. Configure Environment

```bash
# Copy the example file
cp .env.example.local .env

# Edit with your Supabase credentials
nano .env
```

Required environment variables:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_ENV=development
```

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### 6. Create Your Account

1. Navigate to `http://localhost:5173/register`
2. Fill in your details and create an account
3. Start using InvoicePro!

### 7. Build for Production

```bash
pnpm build
```

## 📁 Project Structure

```
Quotations--main/
├── .github/
│   └── workflows/        # GitHub Actions CI/CD
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── layout/      # Layout components
│   │   └── ui/          # UI primitives
│   ├── config/          # Configuration files
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   ├── test/            # Test utilities
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Root component
│   ├── index.css        # Global styles
│   └── index.tsx        # Application entry point
├── public/              # Static assets
├── .env.example         # Example environment variables
├── .eslintrc.cjs       # ESLint configuration
├── .prettierrc         # Prettier configuration
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile          # Docker image definition
├── nginx.conf          # Nginx configuration
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
├── vitest.config.ts    # Vitest configuration
├── DEPLOYMENT.md       # Deployment guide
└── README.md           # This file
```

## 💻 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm type-check       # Run TypeScript compiler
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting

# Testing
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Generate coverage report

# Docker
pnpm docker:build     # Build Docker image
pnpm docker:run       # Run Docker container
pnpm compose:up       # Start with Docker Compose
pnpm compose:down     # Stop Docker Compose
pnpm compose:logs     # View Docker logs
```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, typed code
   - Follow the existing code style
   - Add tests for new features

3. **Run quality checks**
   ```bash
   pnpm lint
   pnpm type-check
   pnpm test
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

### Writing Tests

Tests are located alongside the components they test:

```typescript
// Example: Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## 🚢 Deployment

### Quick Deploy with Docker

```bash
# Build and run
docker build -t invoicepro .
docker run -p 80:80 invoicepro
```

### Deploy with Docker Compose

```bash
docker-compose up -d
```

### Deploy to Cloud Platforms

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for:
- Docker
- Vercel
- Netlify
- AWS S3 + CloudFront
- DigitalOcean
- Custom VPS

## 🔐 Environment Variables

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

### Complete List

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | Yes | - |
| `VITE_APP_ENV` | Environment (development/production) | Yes | development |
| `VITE_AUTH_TOKEN_KEY` | Local storage key for auth token | No | invoicepro_token |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | No | false |
| `VITE_PAYSTACK_PUBLIC_KEY` | Paystack public key | No | - |
| `VITE_FLUTTERWAVE_PUBLIC_KEY` | Flutterwave public key | No | - |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe public key | No | - |

## 🔌 API Integration

### Backend Requirements

The frontend expects a REST API with the following endpoints:

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

#### Clients
- `GET /api/clients` - List clients
- `GET /api/clients/:id` - Get client
- `POST /api/clients` - Create client
- `PATCH /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

#### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `POST /api/products` - Create product
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Quotations
- `GET /api/quotations` - List quotations
- `GET /api/quotations/:id` - Get quotation
- `POST /api/quotations` - Create quotation
- `PATCH /api/quotations/:id` - Update quotation
- `DELETE /api/quotations/:id` - Delete quotation
- `POST /api/quotations/:id/send` - Send quotation
- `POST /api/quotations/:id/convert-to-invoice` - Convert to invoice

#### Invoices
- `GET /api/invoices` - List invoices
- `GET /api/invoices/:id` - Get invoice
- `POST /api/invoices` - Create invoice
- `PATCH /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `POST /api/invoices/:id/send` - Send invoice
- `POST /api/invoices/:id/mark-paid` - Mark as paid

See the service files in `src/services/` for detailed API interfaces.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run quality checks
6. Submit a pull request

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Keep components small and focused

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Build process or tooling changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- UI design inspired by modern invoicing platforms
- Icons by [Lucide](https://lucide.dev/)
- Built with [Vite](https://vitejs.dev/)

## 📞 Support

For support, questions, or feature requests:

- Create an issue on GitHub
- Check existing documentation
- Review the [DEPLOYMENT.md](DEPLOYMENT.md) guide

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Advanced reporting
- [ ] Expense tracking
- [ ] Time tracking integration
- [ ] E-signature support
- [ ] Multi-currency support enhancement
- [ ] Tax calculation automation
- [ ] Client portal

---

<div align="center">

Made with ❤️ by the InvoicePro Team

[⬆ Back to Top](#invoicepro---professional-quotation--invoicing-platform)

</div>
