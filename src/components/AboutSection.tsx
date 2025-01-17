import { Button } from '@/components/ui/button';

export const AboutSection = () => {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold">About Us</h2>
          <h3 className="mb-4 text-2xl font-semibold text-pink-400">
            Shaping the Future of Digital Marketing with AI
          </h3>
          <p className="mb-6 text-gray-300">
            At Invisioned Marketing, we revolutionize the digital landscape by merging cutting-edge
            artificial intelligence with human creativity. Our mission is clear: to deliver
            AI-powered marketing strategies that are smarter, faster, and designed to drive
            measurable results.
          </p>
          <p className="mb-6 text-gray-300">
            As a team of data experts, creative storytellers, and technology innovators, we empower
            businesses to thrive in an increasingly competitive digital world. From personalized
            customer experiences to dynamic advertising campaigns and real-time data-driven
            insights, we specialize in transforming how brands engage and grow their audiences.
          </p>
          <div className="mb-8 space-y-4">
            <p className="text-xl font-medium text-white">Ready to transform your marketing?</p>
            <p className="text-gray-300">
              Schedule a one-on-one consultation with a member of our team today and discover how
              Invisioned Marketing can unlock your business's full potential.
            </p>
          </div>
          <Button className="rounded-lg bg-pink-500 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-pink-600">
            Schedule Your Consultation
          </Button>
        </div>
      </div>
    </section>
  );
};
