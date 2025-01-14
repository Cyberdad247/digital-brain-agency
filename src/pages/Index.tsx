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
import { Navigation } from "@/components/Navigation";
import { ServiceCard } from "@/components/ServiceCard";
import { ContactForm } from "@/components/ContactForm";
import { AboutSection } from "@/components/AboutSection";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/lovable-uploads/eaecd866-2c98-451b-bc04-52404085afe5.png"
            alt="AI Background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 text-center pb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white animate-float">
            Invisioned Marketing
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto mb-8 hover:text-pink-400 transition-colors duration-300">
            Dreams don't come true, visions do
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-background/95">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              title="AI Strategy"
              description="Custom AI solutions tailored to your marketing needs"
              Icon={Brain}
            />
            <ServiceCard
              title="Data Analytics"
              description="Advanced analytics to drive informed decisions"
              Icon={BarChart}
            />
            <ServiceCard
              title="Growth Marketing"
              description="AI-powered strategies for rapid, sustainable growth"
              Icon={Rocket}
            />
            <ServiceCard
              title="AI Chatbots"
              description="Intelligent conversation automation for better engagement"
              Icon={MessageSquare}
            />
            <ServiceCard
              title="Website Analysis"
              description="Analyze performance and SEO using Google Analytics and Search Console"
              Icon={Search}
            />
            <ServiceCard
              title="Social Media Management"
              description="Setup and manage social accounts with tools like Hootsuite and Buffer"
              Icon={Share2}
            />
            <ServiceCard
              title="Email Marketing"
              description="Create targeted email campaigns to engage your audience"
              Icon={Mail}
            />
            <ServiceCard
              title="Content Creation"
              description="Boost online presence with articles, videos, and graphics"
              Icon={FileText}
            />
            <ServiceCard
              title="SEO Optimization"
              description="Improve search rankings with keyword research and link building"
              Icon={TrendingUp}
            />
            <ServiceCard
              title="Landing Pages"
              description="Create high-converting landing pages for your campaigns"
              Icon={Layout}
            />
            <ServiceCard
              title="Email List Building"
              description="Collect and utilize email addresses for targeted marketing"
              Icon={List}
            />
            <ServiceCard
              title="Website Copywriting"
              description="Create compelling and effective website content"
              Icon={PenTool}
            />
            <ServiceCard
              title="Website Redesign"
              description="Improve user experience and engagement with redesigns"
              Icon={RefreshCw}
            />
            <ServiceCard
              title="Social Media Ads"
              description="Promote products/services to targeted social media audiences"
              Icon={Megaphone}
            />
          </div>
        </div>
      </section>

      <AboutSection />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background/95">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400">
        <div className="container mx-auto px-4">
          <p>© 2024 Invisioned Marketing. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
