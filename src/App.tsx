/**
 * 🌐 CORE APPLICATION ORCHESTRATOR
 * @symb 🔄🗄️ - Neural Cache Core & State Management
 * @symb 🛠️🔧 - UI Utility Providers & Components
 * @symb 🎯🌍 - Navigation Matrix & Routing
 * @symb 🤖💬 - Conversational AI Ecosystem
 * @symb ⚠️ - Error Boundary System
 * @symb 🔐 - Authentication & Security Layer
 * @symb 📊 - Analytics & Telemetry
 * @symb 👤 - Identity & Persona Management
 */
import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorProvider } from './components/ErrorProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Refine } from '@refinedev/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { EnhancedVoiceChatBot } from './components/EnhancedVoiceChatBot';
import { VoiceChatBot } from './components/VoiceChatBot';

/** 
 * 🔄🗄️ React Query Client - Neural Cache Core
 * Configures the global query client with optimized caching strategies
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20 * 1000, // ⚡ Cache freshness threshold
    },
  },
});

/**
 * 🌐 ROOT COMPONENT - Quantum Provider Stack
 * @returns {JSX.Element} The application component tree
 */
const App = (): JSX.Element => (
  <ErrorProvider> {/* ⚠️ Error Boundary Layer */}
    <QueryClientProvider client={queryClient}> {/* 🔄🗄️ Neural Cache Core */}
      <TooltipProvider> {/* 🛠️🔦 Contextual Guidance */}
        <Toaster /> {/* 🛠️🔔 User Feedback System */}
        <Sonner /> {/* 🛠️📢 Async Notification Hub */}
        <Analytics /> {/* 📊 Quantum Telemetry */}
        <PersonaProvider> {/* 🌐👤 Identity Context */}
          <ChatProvider> {/* 🤖💬 Conversational Plane */}
            <Refine
              dataProvider={myDataProvider} /* 🗄️📦 Data Pipeline */
              authProvider={authProvider} /* 🔐👤 Auth Gateway */
            >
              <BrowserRouter> {/* 🎯🌍 Navigation Matrix */}
                <Navigation /> {/* 🗺️🧭 Wayfinding Interface */}
                <div className="pt-20"> {/* 🖥️📐 Visual Layout Layer */}
                  <Routes> {/* 🎯🚦 Routing Switchboard */}
                    <Route 
                      path="/" 
                      element={<ErrorBoundary><Index /></ErrorBoundary>} 
                    /> {/* 🎯🏠 Home Nexus */}
                    
                    <Route 
                      path="/dashboard" 
                      element={<ErrorBoundary><Dashboard /></ErrorBoundary>} 
                    /> {/* 🎯📊 Metrics Hub */}
                    
                    <Route 
                      path="/blog" 
                      element={<ErrorBoundary><Blog /></ErrorBoundary>} 
                    /> {/* 🎯📚 Content Plane */}
                    
                    <Route 
                      path="/playground" 
                      element={<ErrorBoundary><Playground /></ErrorBoundary>} 
                    /> {/* 🎯🧪 Dev Sandbox */}
                    
                    <Route 
                      path="/web-analysis" 
                      element={<ErrorBoundary><WebAnalysis /></ErrorBoundary>} 
                    /> {/* 🎯📈 Analytics Zone */}
                    
                    <Route 
                      path="/email-marketing" 
                      element={<ErrorBoundary><EmailMarketing /></ErrorBoundary>} 
                    /> {/* 🎯📧 Email Hub */}
                    
                    <Route 
                      path="/automation" 
                      element={<ErrorBoundary><AutomationPage /></ErrorBoundary>} 
                    /> {/* 🎯⚙️ Automation Core */}
                    
                    <Route 
                      path="/create-agent" 
                      element={<ErrorBoundary><AgentCreationPage /></ErrorBoundary>} 
                    /> {/* 🎯🤖 Agent Factory */}
                    
                    <Route 
                      path="/landing-page-builder" 
                      element={<ErrorBoundary><LandingPageBuilder /></ErrorBoundary>} 
                    /> {/* 🎯🎨 Page Studio */}

                    <Route 
                      path="*" 
                      element={<Navigate to="/" />} 
                    /> {/* 🎯🔄 Fallback Route */}
                  </Routes>
                </div>
              </BrowserRouter>
              <Chatbot /> {/* 🤖💬 Conversational Agent */}
            </Refine>
          </ChatProvider>
        </PersonaProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorProvider>
);

export default App;
