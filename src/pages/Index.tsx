import { ServicesSection } from '@/components/ServicesSection';
import { ContactForm } from '@/components/ContactForm';
import { AboutSection } from '@/components/AboutSection';
import { Testimonials } from '@/components/Testimonials';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import styles from '@/components/Hero.module.css';
import { CSSProperties, useEffect, useRef } from 'react';

const Index = () => {
  const testimonialRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (testimonialRef.current) {
      observer.observe(testimonialRef.current);
    }

    return () => {
      if (testimonialRef.current) {
        observer.unobserve(testimonialRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative">
      <Navigation />
      {/* Hero Section */}
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1>Invisioned Marketing</h1>
            <p>Dreams don't come true, visions do</p>
          </div>
          <div className={styles.heroCta}>
            <button>Get Started</button>
          </div>
        </div>
      </div>

      <section id="services">
        <ServicesSection />
      </section>

      <section id="testimonials" className="py-20">
        <div ref={testimonialRef}>
          <Testimonials />
        </div>
      </section>

      <section id="about">
        <AboutSection />
      </section>

      {/* Blog Section */}
      <section id="blog" className="bg-background/95 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Blog</h2>
          <p className="text-center">Coming soon...</p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-background/95 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Get in Touch</h2>
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
