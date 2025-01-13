import { Brain, BarChart, Rocket, MessageSquare } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { ServiceCard } from "@/components/ServiceCard";
import { ContactForm } from "@/components/ContactForm";

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
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-float">
            Transform Your Digital Presence with{" "}
            <span className="text-accent">AI-Powered</span> Marketing
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Leverage cutting-edge artificial intelligence to revolutionize your
            marketing strategy and drive unprecedented growth.
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
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About Invisioned</h2>
            <p className="text-gray-300 mb-8">
              We combine human creativity with artificial intelligence to deliver
              marketing solutions that drive real results. Our team of experts
              leverages cutting-edge AI technology to help businesses grow and
              succeed in the digital age.
            </p>
            <img
              src="/lovable-uploads/e37ad8e8-a3f4-4d85-a0bc-308b8addbb92.png"
              alt="Invisioned Marketing Logo"
              className="max-w-[200px] mx-auto animate-glow"
            />
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