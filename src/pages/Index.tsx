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
  Quote
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { ServiceCard } from "@/components/ServiceCard";
import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-background/40 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors duration-300">
              <CardContent className="p-6 relative">
                <Quote className="absolute top-4 right-4 text-pink-400 opacity-50" size={24} />
                <p className="text-gray-300 mb-6 italic">
                  "Invisioned Marketing transformed our digital presence. Their AI-driven strategies increased our engagement by 300% in just three months."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-pink-400" />
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-gray-400">CEO, TechStart Inc.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/40 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors duration-300">
              <CardContent className="p-6 relative">
                <Quote className="absolute top-4 right-4 text-pink-400 opacity-50" size={24} />
                <p className="text-gray-300 mb-6 italic">
                  "The personalized AI chatbot they developed for us has revolutionized our customer service. Response times are down 80%."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-pink-400" />
                  <div>
                    <h4 className="font-semibold">Michael Chen</h4>
                    <p className="text-sm text-gray-400">Marketing Director, GlobalTech</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/40 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors duration-300">
              <CardContent className="p-6 relative">
                <Quote className="absolute top-4 right-4 text-pink-400 opacity-50" size={24} />
                <p className="text-gray-300 mb-6 italic">
                  "Their data-driven approach to social media management helped us target the right audience. Our ROI has never been better."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-pink-400" />
                  <div>
                    <h4 className="font-semibold">Emma Rodriguez</h4>
                    <p className="text-sm text-gray-400">Founder, EcoStyle</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About Us</h2>
            <h3 className="text-2xl font-semibold mb-4 text-pink-400">
              Shaping the Future of Digital Marketing with AI
            </h3>
            <p className="text-gray-300 mb-6">
              At Invisioned Marketing, we revolutionize the digital landscape by merging
              cutting-edge artificial intelligence with human creativity. Our mission is
              clear: to deliver AI-powered marketing strategies that are smarter, faster,
              and designed to drive measurable results.
            </p>
            <p className="text-gray-300 mb-6">
              As a team of data experts, creative storytellers, and technology innovators,
              we empower businesses to thrive in an increasingly competitive digital world.
              From personalized customer experiences to dynamic advertising campaigns and
              real-time data-driven insights, we specialize in transforming how brands
              engage and grow their audiences.
            </p>
            <div className="space-y-4 mb-8">
              <p className="text-xl font-medium text-white">
                Ready to transform your marketing?
              </p>
              <p className="text-gray-300">
                Schedule a one-on-one consultation with a member of our team today and
                discover how Invisioned Marketing can unlock your business's full potential.
              </p>
            </div>
            <Button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
              Schedule Your Consultation
            </Button>
          </div>
        </div>
      </section>

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
