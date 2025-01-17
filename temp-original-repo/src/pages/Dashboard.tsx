import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useTheme } from '../hooks/use-theme';
import CodeEditor from '../components/CodeEditor';

const services = [
  {
    category: 'AI Solutions',
    items: [
      {
        title: 'Custom AI Solutions',
        description: 'Tailored AI solutions for your marketing needs',
        icon: '🤖'
      },
      {
        title: 'AI Chatbots',
        description: 'Intelligent conversation automation',
        icon: '💬'
      },
      {
        title: 'AI Agent Creation',
        description: 'Build custom AI agents for specialized needs',
        icon: '🛠️'
      }
    ]
  },
  {
    category: 'Marketing & Analytics',
    items: [
      {
        title: 'Data Analytics',
        description: 'Advanced analytics for informed decisions',
        icon: '📊'
      },
      {
        title: 'Growth Marketing',
        description: 'AI-powered growth strategies',
        icon: '🚀'
      },
      {
        title: 'Website Analysis',
        description: 'SEO and performance analysis',
        icon: '🔍'
      }
    ]
  },
  {
    category: 'Content & Optimization',
    items: [
      {
        title: 'Content Creation',
        description: 'Boost online presence with engaging content',
        icon: '📝'
      },
      {
        title: 'SEO Optimization',
        description: 'Improve search rankings',
        icon: '🔗'
      },
      {
        title: 'Website Copywriting',
        description: 'Create compelling website content',
        icon: '✍️'
      }
    ]
  },
  {
    category: 'Automation & Management',
    items: [
      {
        title: 'Workflow Automation',
        description: 'Automate repetitive tasks',
        icon: '⚙️'
      },
      {
        title: 'Social Media Management',
        description: 'Setup and manage social accounts',
        icon: '📱'
      },
      {
        title: 'Email Marketing',
        description: 'Create targeted email campaigns',
        icon: '📧'
      }
    ]
  }
];

export const Dashboard = () => {
  const { theme } = useTheme();

  return (
    <div className={`h-screen p-8 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Services Panel */}
        <Card className={`p-6 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <h2 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-pink-500' : 'text-pink-600'}`}>
            AI Strategy Services
          </h2>
          
          {services.map((category, index) => (
            <div key={index} className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {category.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.items.map((service, i) => (
                  <Card 
                    key={i}
                    className={`p-4 hover:shadow-lg transition-shadow ${
                      theme === 'dark' 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{service.icon}</div>
                      <div>
                        <h4 className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {service.title}
                        </h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </Card>

        {/* Code Editor Panel */}
        <Card className={`p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <h2 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-pink-500' : 'text-pink-600'}`}>
            Code Editor
          </h2>
          <div className="h-[calc(100%-4rem)]">
            <CodeEditor theme={theme} />
          </div>
        </Card>
      </div>
    </div>
  );
};
