import { Button } from "@/components/ui/button";

export const AboutSection = () => {
  return (
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
  );
};