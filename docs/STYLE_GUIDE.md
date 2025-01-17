# Style Guide

## Coding Standards

- Use TypeScript with strict type checking
- Follow React best practices (functional components, hooks)
- Use ESLint and Prettier for consistent formatting
- Maximum line length: 100 characters
- Use arrow functions for component definitions
- Prefer named exports over default exports

## Naming Conventions

- Components: PascalCase (e.g., Navigation.tsx)
- Variables and functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Interfaces: PascalCase with 'I' prefix (e.g., IUserData)
- Type aliases: PascalCase with 'T' prefix (e.g., TApiResponse)
- Test files: _.test.ts or _.spec.ts
- Utility files: \*.utils.ts

## File Structure

```
src/
  components/       # Reusable UI components
    ui/             # Shadcn/ui components
  pages/            # Page components
  hooks/            # Custom React hooks
  lib/              # Library/utility functions
  integrations/     # Third-party integrations
  types/            # Global type definitions
  styles/           # Global styles and themes
```

## Documentation Practices

- Add JSDoc comments for all public functions and components
- Include prop types documentation using TypeScript interfaces
- Document complex business logic with inline comments
- Maintain a CHANGELOG.md for version history
- Use README.md for project overview and setup instructions

## Component Organization

- Keep components small and focused
- Follow single responsibility principle
- Use prop-types or TypeScript interfaces for component props
- Separate presentational and container components
- Use context API for global state management
- Prefer composition over inheritance

## Best Practices

- Use functional components and hooks
- Implement proper error boundaries
- Use lazy loading for large components
- Optimize performance with React.memo and useMemo
- Follow accessibility guidelines (a11y)
- Write unit tests for critical components
- Use Storybook for component documentation
