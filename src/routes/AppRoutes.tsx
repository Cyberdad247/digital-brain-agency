import { Routes, Route } from 'react-router-dom';
import { RouteWrapper } from '../components/RouteWrapper';
import { AgentCreationPage } from '../pages/AgentCreationPage';
import { LandingPageBuilder } from '../pages/LandingPageBuilder';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Playground } from '../pages/Playground';
import { WebAnalysis } from '../pages/WebAnalysis';
import { EmailMarketing } from '../pages/EmailMarketing';
import { AIStrategy } from '../pages/AIStrategy';
import { DataAnalytics } from '../pages/DataAnalytics';

export const AppRoutes = () => {
  return (
    <RouteWrapper>
      <ErrorBoundary>
        <Routes>
          <Route 
            path="/create-agent" 
            element={<AgentCreationPage />}
          />
          <Route
            path="/landing-page-builder"
            element={<LandingPageBuilder />}
          />
          <Route
            path="/playground"
            element={<Playground />}
          />
          <Route
            path="/web-analysis"
            element={<WebAnalysis />}
          />
          <Route
            path="/email-marketing"
            element={<EmailMarketing />}
          />
          <Route
            path="/ai-strategy"
            element={<AIStrategy />}
          />
          <Route
            path="/data-analytics"
            element={<DataAnalytics />}
          />
        </Routes>
      </ErrorBoundary>
    </RouteWrapper>
  );
};