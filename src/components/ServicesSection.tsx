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
  Megaphone
} from "lucide-react";
import { ServiceCard } from "@/components/ServiceCard";

const services = [
  {
    title: "AI Strategy",
    description: "Custom AI solutions tailored to your marketing needs",
    Icon: Brain,
  },
  {
    title: "Data Analytics",
    description: "Advanced analytics to drive informed decisions",
    Icon: BarChart,
  },
  {
    title: "Growth Marketing",
    description: "AI-powered strategies for rapid, sustainable growth",
    Icon: Rocket,
  },
  {
    title: "AI Chatbots",
    description: "Intelligent conversation automation for better engagement",
    Icon: MessageSquare,
  },
  {
    title: "Website Analysis",
    description: "Analyze performance and SEO using Google Analytics and Search Console",
    Icon: Search,
  },
  {
    title: "Social Media Management",
    description: "Setup and manage social accounts with tools like Hootsuite and Buffer",
    Icon: Share2,
  },
  {
    title: "Email Marketing",
    description: "Create targeted email campaigns to engage your audience",
    Icon: Mail,
  },
  {
    title: "Content Creation",
    description: "Boost online presence with articles, videos, and graphics",
    Icon: FileText,
  },
  {
    title: "SEO Optimization",
    description: "Improve search rankings with keyword research and link building",
    Icon: TrendingUp,
  },
  {
    title: "Landing Pages",
    description: "Create high-converting landing pages for your campaigns",
    Icon: Layout,
  },
  {
    title: "Email List Building",
    description: "Collect and utilize email addresses for targeted marketing",
    Icon: List,
  },
  {
    title: "Website Copywriting",
    description: "Create compelling and effective website content",
    Icon: PenTool,
  },
  {
    title: "Website Redesign",
    description: "Improve user experience and engagement with redesigns",
    Icon: RefreshCw,
  },
  {
    title: "Social Media Ads",
    description: "Promote products/services to targeted social media audiences",
    Icon: Megaphone,
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-background/95">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              Icon={service.Icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};