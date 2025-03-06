import HeroSection from '@/src/components/HeroSection';
import ServicesSection from '@/src/components/ServicesSection';
import AboutSection from '@/src/components/AboutSection';
import TestimonialsSection from '@/src/components/TestimonialsSection';
import ContactForm from '@/src/components/ContactForm';
import Footer from '@/src/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactForm />
      <Footer />
    </div>
  );
}