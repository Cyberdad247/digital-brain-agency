import BarChart from '@/components/charts/BarChart';
import { Card } from '@/components/ui/card';
import { useAgencyData } from '@/hooks/useAgencyData';

interface AIChatbotDashboardProps {
  className?: string;
}

export const AIChatbotDashboard = ({ className }: AIChatbotDashboardProps) => {
  const { chatbotMetrics } = useAgencyData();

  return (
    <div className={`grid gap-4 ${className}`}>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Chatbot Performance</h2>
        <BarChart 
          data={chatbotMetrics.usageData}
          labels={chatbotMetrics.months}
          title="Monthly Interactions"
        />
      </Card>
    </div>
  );
};
