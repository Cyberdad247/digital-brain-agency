# Project Contribution Guide

## Environment Setup

1. Install Bun globally:

```bash
curl -fsSL https://bun.sh/install | bash
```

Files: backend/routes/buddybotRoutes.ts, backend/api/ai.ts, backend/server.ts  
Suggestions:

- Consolidate all backend-related files into the backend/ directory.
- Separate routes, controllers, and middleware into their respective subdirectories (e.g., backend/routes/, backend/controllers/, backend/middleware/).
- Use TypeScript consistently across the backend (e.g., rename former server.js to server.ts).

2. Configure Bun environment (now set in config/.bunfig.toml):

```toml
// ...see the relocated file in config/.bunfig.toml...
```

## Development Commands

| Previous npm Command | Bun Equivalent      |
| -------------------- | ------------------- |
| npm install          | bun install         |
| npm run dev          | bun run dev         |
| npm run dev:backend  | bun run dev:backend |
| npm run build        | bun run build       |
| npm test             | bun run test        |
| npm run lint         | bun run lint        |

## Additional Configuration Files

- Docker configuration is now maintained in config/Dockerfile.

## Workflow Tips

- Always use `bun` instead of npm/pnpm/yarn.
- Benefit from Bun's faster execution and built-in test runner.
- The config directory ensures a clean organization of environment and build configuration files.

## Testing

Provide instructions on how to run tests:

- Run unit and integration tests using Bun's built-in test runner.
- Example: `bun run test`.

## Deployment

Outline deployment steps:

- Build the project using `bun run build`.
- Deploy the contents of the build directory to your hosting platform.
