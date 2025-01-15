# Project Architecture Documentation

## Folder Structure
```
digital-brain-agency/
├── public/                # Static assets
├── src/                   # Application source code
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # Third-party service integrations
│   ├── lib/               # Shared utilities and libraries
│   ├── pages/             # Page components
│   └── App.tsx            # Main application component
├── supabase/              # Supabase configuration
├── .env                   # Environment variables
├── package.json           # Project dependencies
└── vite.config.ts         # Build configuration
```

## Component Relationships
- **App.tsx**: Root component that renders all pages
- **pages/**: Contains page-level components that compose multiple UI components
- **components/**: Contains reusable UI components
  - **Chatbot.tsx**: Main chatbot interface component
  - **LLMProviderSelector.tsx**: Component for selecting language model providers
  - **ui/**: Shared UI components using shadcn/ui
- **integrations/**: Contains service-specific integration logic
  - **google-gemini/**: Google Gemini API integration
  - **local-llm/**: Local LLM integration

## Library Dependencies
- **React**: Core UI library
- **Vite**: Build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **Supabase**: Backend-as-a-Service
- **Google APIs**: Integration with Google services

## Naming Conventions
1. **Components**: PascalCase (e.g., Chatbot.tsx)
2. **Hooks**: useCamelCase (e.g., useMobile.tsx)
3. **Files**: kebab-case (e.g., client.ts)
4. **Variables**: camelCase (e.g., apiEndpoint)
5. **Constants**: UPPER_SNAKE_CASE (e.g., API_KEY)

## Future Considerations
- Implement a monorepo structure using tools like Nx or Turborepo
- Add TypeScript path aliases for better imports
- Create a shared UI component library
- Implement Storybook for component documentation
