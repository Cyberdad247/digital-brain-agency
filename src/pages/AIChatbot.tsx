import { AIChatbotDashboard } from '@/components/dashboards/AIChatbotDashboard';
import { AgencyLayout } from '@/components/AgencyLayout';

export const AIChatbotPage = () => {
  return (
    <AgencyLayout title="AI Chatbot Creation">
      <AIChatbotDashboard />
    </AgencyLayout>
  );
};

export default AIChatbotPage;
