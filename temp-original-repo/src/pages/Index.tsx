import { Navigation } from "@/components/Navigation";
import { ServicesSection } from "@/components/ServicesSection";
import { ContactForm } from "@/components/ContactForm";
import { AboutSection } from "@/components/AboutSection";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navigation />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
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

      <section id="services">
        <ServicesSection />
      </section>

      <section id="about">
        <AboutSection />
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-background/95">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Blog</h2>
          <p className="text-center">Coming soon...</p>
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
