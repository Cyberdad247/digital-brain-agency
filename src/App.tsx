/**
 * Main application component that sets up the core providers and routing structure.
 *
 * @remarks
 * This component is responsible for:
 * - Initializing the React Query client for data fetching
 * - Setting up UI providers (Tooltip, Toaster, Sonner)
 * - Configuring React Router for navigation
 * - Rendering the global Chatbot component
 *
 * @example
 * ```tsx
 * // In main.tsx
 * ReactDOM.createRoot(document.getElementById('root')!).render(
 *   <App />
 * )
 * ```
 */
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { SidebarProvider } from './components/ui/sidebar-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Refine } from '@refinedev/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import authProvider from './authProvider';
import myDataProvider from './dataProviders/myDataProvider';
import AgentCreationPage from './components/AgentCreationPage';
import Index from './pages/Index';
import { Dashboard } from './pages/Dashboard';
import { Blog } from './pages/Blog';
import Playground from './pages/Playground';
import WebAnalysis from './pages/WebAnalysis';
import EmailMarketing from './pages/EmailMarketing';
import AutomationPage from './pages/AutomationPage';
import LandingPageBuilder from './pages/LandingPageBuilder';
import { Chatbot } from './components/Chatbot';
import { Navigation } from './components/Navigation';
import { PersonaProvider } from './components/PersonaProvider';
import { ChatProvider } from './components/ChatContext';

/**
 * React Query client instance for managing server state and caching
 */
const queryClient = new QueryClient();

/**
 * Main application component
 * @returns {JSX.Element} The application component tree
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Analytics />
      <PersonaProvider>
        <ChatProvider>
          <Refine
            dataProvider={myDataProvider}
            authProvider={authProvider}
          >
            <BrowserRouter>
              <Navigation />
              <div className="pt-20">
                <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/web-analysis" element={<WebAnalysis />} />
            <Route path="/email-marketing" element={<EmailMarketing />} />
            <Route path="/automation" element={<AutomationPage />} />
            <Route path="/create-agent" element={<AgentCreationPage />} />
            <Route path="/landing-page-builder" element={<LandingPageBuilder />} />
              </Routes>
            </div>
          </BrowserRouter>
          <Chatbot />
          </Refine>
        </ChatProvider>
      </PersonaProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
