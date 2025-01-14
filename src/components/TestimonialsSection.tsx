import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "Invisioned Marketing transformed our digital presence. Their AI-driven strategies increased our engagement by 300% in just three months.",
    author: "Sarah Johnson",
    role: "CEO, TechStart Inc.",
  },
  {
    quote: "The personalized AI chatbot they developed for us has revolutionized our customer service. Response times are down 80%.",
    author: "Michael Chen",
    role: "Marketing Director, GlobalTech",
  },
  {
    quote: "Their data-driven approach to social media management helped us target the right audience. Our ROI has never been better.",
    author: "Emma Rodriguez",
    role: "Founder, EcoStyle",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-background/40 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors duration-300">
              <CardContent className="p-6 relative">
                <Quote className="absolute top-4 right-4 text-pink-400 opacity-50" size={24} />
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-pink-400" />
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};