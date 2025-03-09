import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for client components
const Hero = dynamic(() => import('@/components/Hero'), { ssr: true });
const ServicesSection = dynamic(() => import('@/components/ServicesSection'), { ssr: true });
const AboutSection = dynamic(() => import('@/components/AboutSection'), { ssr: true });
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: true });
const ContactForm = dynamic(() => import('@/components/ContactForm'), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Suspense fallback={<div>Loading hero section...</div>}>
        <Hero />
      </Suspense>

      <Suspense fallback={<div>Loading services...</div>}>
        <ServicesSection />
      </Suspense>

      <Suspense fallback={<div>Loading about section...</div>}>
        <AboutSection />
      </Suspense>

      <Suspense fallback={<div>Loading testimonials...</div>}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<div>Loading contact form...</div>}>
        <ContactForm />
      </Suspense>
    </main>
  );
}
