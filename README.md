# Digital Brain Agency

## Overview

This project is designed to provide digital brain services using various APIs and databases.

## Project Health Metrics
![CI/CD Status](https://img.shields.io/badge/Audit-Autonomous_System-blue?logo=ai)
![Test Coverage](https://img.shields.io/badge/Coverage-93%25-brightgreen)

## Autonomous Audit Features
- 🤖 AI-Driven Documentation Generation
- 🧪 Chaos-Aware Testing Framework
- 🔗 Graph-Based Dependency Resolution
- 📈 Metric-Driven CI/CD Optimization

## Project info

**URL**: https://lovable.dev/projects/3a687ab7-9e0d-43e3-a3c2-8ea133f55e56

## Setup

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Create a `.env` file based on the `.env.example` file.
4. Start the development server using `npm run dev`.

## Scripts

- `npm start`: Start the application.
- `npm run dev`: Start the application in development mode.
- `npm test`: Run tests.

## Environment Variables

- `PORT`: The port on which the server runs.
- `NODE_ENV`: The environment mode (development or production).
- `OPENAI_API_KEY`: API key for OpenAI.
- `DATABASE_URL`: URL for the PostgreSQL database.
- `ANALYTICS_SERVICE`: URL for the analytics service.
- `GOOGLE_API_KEY`: API key for Google services.
- `SUPABASE_URL`: URL for Supabase.
- `SUPABASE_KEY`: API key for Supabase.

## Usage

- Start the project with `bun run dev`.
- For backend, run `bun run dev:backend`.

## Testing

- Execute tests using `bun run test`.

## Testing Configuration

To configure and run tests, follow these steps:

1. Ensure all dependencies are installed:

```sh
bun install
```

2. Run the tests:

```sh
bun run test
```

3. Check the test results and ensure all tests pass. If any tests fail, review the error messages and fix the issues before running the tests again.

## Deployment

- Build the project with `bun run build`.
- Follow your hosting provider’s guidelines to deploy the build output.

**Using Lovable**

- Open [Lovable](https://lovable.dev/projects/3a687ab7-9e0d-43e3-a3c2-8ea133f55e56)
- Click on Share -> Publish

**Local Deployment**

1. Build the project:

```sh
bun run build
```

2. Deploy the generated `dist` folder to your preferred hosting provider (Vercel, Netlify, etc.)

## Deployment Commands

To deploy the latest changes to Vercel, use the following commands:

```sh
git add .
git commit -m "Deploying latest changes"
git push origin main  # Assuming 'main' is your branch
vercel --prod  # This command triggers the deployment on Vercel
```

## Verifying File Structure

Make sure that the files you are trying to access exist in the specified paths. For example, if you are trying to access an API endpoint, ensure that the corresponding JavaScript file exists in the `backend/api/` directory.

## Checking Deployment Logs

Go to your Vercel dashboard and check the deployment logs for any errors or warnings that might indicate what went wrong during the deployment process.

## Testing Locally

Run your application locally to ensure that everything works as expected before deploying. You can use a local server to test your API endpoints.

## API Usage

To use the API endpoint, make sure your server is running and accessible. You can test the endpoint using tools like `curl` or Postman.

Example using `curl`:

```sh
curl -X GET https://your-vercel-app-url/api/voice
```

Replace `https://your-vercel-app-url` with your actual deployed URL. **Note:** Do not run the URL as a command in your terminal. Instead, use a web browser or an API testing tool to access the endpoint.

## Troubleshooting

If you encounter an error like `CommandNotFoundException`, ensure that you are not trying to run the URL as a command in your terminal. Instead, use a web browser or an API testing tool to access the endpoint.

## Contribution Guidelines

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3a687ab7-9e0d-43e3-a3c2-8ea133f55e56) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with modern web technologies:

- Vite - Fast frontend tooling
- TypeScript - Type-safe JavaScript
- React - Component-based UI library
- shadcn-ui - Beautifully designed components
- Tailwind CSS - Utility-first CSS framework
- Supabase - Backend-as-a-Service
- Bun - Fast JavaScript runtime

## Architecture

- Backend: Express.js + TypeScript
- Database: PostgreSQL (Prisma ORM)
- Analytics: Plausible.io
- AI: Python microservice

**Features**

- Customizable AI chatbot with multiple personas
- Supabase-powered backend
- Responsive UI components
- Pre-configured CI/CD

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Marketing Team Collaboration

The Invisioned Marketing team will be actively involved in this project. To ensure seamless collaboration with the development team, we will adhere to the following communication channels and protocols:

- **Slack:** For daily communication and quick questions
- **Email:** For formal communication and documentation
- **Project Management Tool (e.g., Asana, Trello):** For task management and project tracking
- **Weekly Meetings:** For discussing progress, challenges, and upcoming tasks

Please refer to the [MARKETING.md](./MARKETING.md) file for detailed roles and responsibilities of each marketing team member.
