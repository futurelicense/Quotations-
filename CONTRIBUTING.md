# Contributing to InvoicePro

Thank you for your interest in contributing to InvoicePro! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Add upstream remote: `git remote add upstream <original-repo-url>`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

### Setup Steps

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm dev
```

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues. When creating a bug report, include:

- Clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)

### Suggesting Features

Feature suggestions are welcome! Please include:

- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Mockups or examples (if applicable)

### Code Contributions

1. **Find an issue** - Look for issues tagged with `good first issue` or `help wanted`
2. **Discuss** - Comment on the issue to discuss your approach
3. **Implement** - Write your code following our standards
4. **Test** - Add tests for your changes
5. **Submit** - Create a pull request

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper typing
- Use interfaces for object shapes
- Export types that may be reused

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

// Bad
const user: any = { ... };
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use meaningful prop names
- Add PropTypes or TypeScript interfaces

```typescript
// Good
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

### File Organization

- One component per file
- Group related files in directories
- Use index files for clean imports
- Place types in the same file or in `types/`

### Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `UserProfile.tsx`)
- **Utilities**: camelCase (`formatDate.ts`, `validateEmail.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)
- **Hooks**: camelCase with `use` prefix (`useAuth`, `useApi`)

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Run linter
pnpm lint

# Fix linting errors
pnpm lint:fix

# Format code
pnpm format
```

### Best Practices

1. **DRY Principle** - Don't Repeat Yourself
2. **Single Responsibility** - One function, one purpose
3. **Error Handling** - Always handle errors gracefully
4. **Accessibility** - Follow WCAG guidelines
5. **Performance** - Optimize re-renders and bundle size

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style (formatting, semicolons, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Build process, dependencies, etc.
- `ci:` - CI/CD changes

### Examples

```bash
# Feature
feat(auth): add JWT token refresh mechanism

# Bug fix
fix(invoice): correct tax calculation for discounted items

# Documentation
docs(readme): update deployment instructions

# Refactoring
refactor(api): simplify error handling logic
```

## Pull Request Process

### Before Submitting

1. **Update from upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests**
   ```bash
   pnpm test
   pnpm lint
   pnpm type-check
   ```

3. **Update documentation** - If you changed APIs or added features

4. **Add tests** - For new features or bug fixes

### PR Template

When creating a PR, include:

- **Description**: What does this PR do?
- **Motivation**: Why is this change needed?
- **Changes**: List of changes made
- **Testing**: How was this tested?
- **Screenshots**: If UI changes
- **Breaking Changes**: Any breaking changes?
- **Related Issues**: Link to related issues

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added and passing
- [ ] Works on mobile and desktop

### Review Process

1. At least one maintainer approval required
2. All CI checks must pass
3. No merge conflicts
4. Code review feedback addressed

## Testing

### Writing Tests

```typescript
// Component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Coverage

- Aim for >80% code coverage
- Test happy paths and edge cases
- Test error conditions
- Mock external dependencies

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage report
pnpm test:coverage

# UI mode
pnpm test:ui
```

## Documentation

### Code Documentation

```typescript
/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 * @example
 * formatCurrency(1234.56, 'USD') // '$1,234.56'
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  // Implementation
}
```

### README Updates

When adding features, update:
- Feature list
- API documentation
- Environment variables
- Examples

## Questions?

- Check existing documentation
- Search closed issues
- Ask in issue comments
- Create a discussion thread

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to InvoicePro! 🎉



