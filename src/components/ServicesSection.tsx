import {
  Brain,
  BarChart,
  Rocket,
  MessageSquare,
  Search,
  Share2,
  Mail,
  FileText,
  TrendingUp,
  Layout,
  List,
  PenTool,
  RefreshCw,
  Megaphone,
  Zap,
  Bot,
} from 'lucide-react';
import { ServiceCard } from '@/components/ServiceCard';

const services = [
  {
    title: 'AI Strategy',
    description: 'Custom AI solutions tailored to your marketing needs',
    Icon: Brain,
    to: '/ai-strategy',
  },
  {
    title: 'Data Analytics',
    description: 'Advanced analytics to drive informed decisions',
    Icon: BarChart,
    to: '/data-analytics',
  },
  {
    title: 'Growth Marketing',
    description: 'AI-powered strategies for rapid, sustainable growth',
    Icon: Rocket,
    to: '/growth-marketing',
  },
  {
    title: 'AI Chatbots',
    description: 'Intelligent conversation automation for better engagement',
    Icon: MessageSquare,
    to: '/ai-chatbots',
  },
  {
    title: 'Website Analysis',
    description: 'Analyze performance and SEO using Google Analytics and Search Console',
    Icon: Search,
    to: '/web-analysis',
  },
  {
    title: 'Social Media Management',
    description: 'Setup and manage social accounts with tools like Hootsuite and Buffer',
    Icon: Share2,
    to: '/social-media',
  },
  {
    title: 'Email Marketing',
    description: 'Create targeted email campaigns to engage your audience',
    Icon: Mail,
    to: '/email-marketing',
  },
  {
    title: 'Content Creation',
    description: 'Boost online presence with articles, videos, and graphics',
    Icon: FileText,
    to: '/content-creation',
  },
  {
    title: 'SEO Optimization',
    description: 'Improve search rankings with keyword research and link building',
    Icon: TrendingUp,
    to: '/seo-optimization',
  },
  {
    title: 'Landing Pages',
    description: 'Create high-converting landing pages for your campaigns',
    Icon: Layout,
    to: '/landing-pages',
  },
  {
    title: 'Email List Building',
    description: 'Collect and utilize email addresses for targeted marketing',
    Icon: List,
    to: '/email-list-building',
  },
  {
    title: 'Website Copywriting',
    description: 'Create compelling and effective website content',
    Icon: PenTool,
    to: '/copywriting',
  },
  {
    title: 'Website Redesign',
    description: 'Improve user experience and engagement with redesigns',
    Icon: RefreshCw,
    to: '/website-redesign',
  },
  {
    title: 'Social Media Ads',
    description: 'Promote products/services to targeted social media audiences',
    Icon: Megaphone,
    to: '/social-media-ads',
  },
  {
    title: 'Workflow Automation',
    description: 'Automate repetitive tasks and streamline business processes',
    Icon: Zap,
    to: '/workflow-automation',
  },
  {
    title: 'AI Agent Creation',
    description: 'Build custom AI agents for specialized business needs',
    Icon: Bot,
    to: '/ai-agent-creation',
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="bg-background/95 py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">Our Services</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              Icon={service.Icon}
              to={service.to}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
