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
import { Toaster } from "./components/ui/toaster"
import { Toaster as Sonner } from "./components/ui/sonner"
import { TooltipProvider } from "./components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import { Dashboard } from "./pages/Dashboard"
import { Blog } from "./pages/Blog"
import Playground from "./pages/Playground"
import { Chatbot } from "./components/Chatbot"

/**
 * React Query client instance for managing server state and caching
 */
const queryClient = new QueryClient()

/**
 * Main application component
 * @returns {JSX.Element} The application component tree
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </BrowserRouter>
      <Chatbot />
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
