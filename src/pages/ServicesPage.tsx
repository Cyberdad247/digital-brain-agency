import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LayoutDashboard } from 'lucide-react';

const services = [
  {
    id: 'seo',
    title: 'SEO Optimization',
    description: 'Improve search engine rankings and organic traffic',
    icon: '🔍',
    path: '/seo'
  },
  {
    id: 'email-marketing',
    title: 'Email Marketing',
    description: 'Create effective email campaigns and automation',
    icon: '✉️',
    path: '/email-marketing'
  },
  {
    id: 'web-analysis',
    title: 'Web Analytics',
    description: 'Track and analyze website performance',
    icon: '📊',
    path: '/web-analysis'
  },
  {
    id: 'automation',
    title: 'Marketing Automation',
    description: 'Streamline marketing workflows and processes',
    icon: '🤖',
    path: '/automation'
  },
  {
    id: 'ai-strategy',
    title: 'AI Strategy',
    description: 'Leverage AI for marketing insights and automation',
    icon: '🧠',
    path: '/ai-strategy'
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    description: 'Turn data into actionable insights',
    icon: '📈',
    path: '/data-analytics'
  },
  {
    id: 'growth-marketing',
    title: 'Growth Marketing',
    description: 'Strategies for sustainable business growth',
    icon: '🚀',
    path: '/growth-marketing'
  },
  {
    id: 'social-media',
    title: 'Social Media Management',
    description: 'Manage and optimize social media presence',
    icon: '📱',
    path: '/social-media'
  },
  {
    id: 'creative-content',
    title: 'Creative Content',
    description: 'Create engaging content for all platforms',
    icon: '🎨',
    path: '/creative-content'
  }
];

const ServicesPage = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    navigate(service.path);
  };

  return (
    <div className="services-page p-8">
      <h1 className="text-3xl font-bold mb-8">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <Card 
            key={service.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleServiceClick(service)}
          >
            <CardHeader>
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{service.icon}</span>
                <div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                View Dashboard
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
