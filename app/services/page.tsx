import { Suspense } from 'react';
import BaseDashboard from '@/components/dashboards/BaseDashboard';
import { ServiceCard } from '@/components/ServiceCard';

const services = [
  {
    title: 'AI Strategy',
    description: 'Custom AI solutions to transform your business operations',
    icon: '/icons/strategy.svg',
  },
  {
    title: 'Automation',
    description: 'Streamline workflows with intelligent automation',
    icon: '/icons/automation.svg',
  },
  {
    title: 'Data Analytics',
    description: 'Turn data into actionable insights',
    icon: '/icons/analytics.svg',
  },
  {
    title: 'Growth Marketing',
    description: 'Data-driven strategies for sustainable growth',
    icon: '/icons/marketing.svg',
  },
];

export default function ServicesPage() {
  return (
    <BaseDashboard
      title="Our Services"
      description="Explore our comprehensive range of digital solutions"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<div>Loading services...</div>}>
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              icon={service.icon}
            />
          ))}
        </Suspense>
      </div>
    </BaseDashboard>
  );
}
