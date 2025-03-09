interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'Tech Innovators Inc.',
    text: 'Invisioned transformed our digital strategy. Their AI-powered solutions helped us increase engagement by 150% in just 3 months!',
    image: '/public/lovable-uploads/hero-bg.webp',
  },
  {
    name: 'Michael Chen',
    role: 'CEO',
    company: 'Green Future Solutions',
    text: 'The automation tools developed by Invisioned saved us hundreds of hours. Their team is truly innovative and professional.',
    image: '/public/lovable-uploads/eaecd866-2c98-451b-bc04-52404085afe5.png',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Product Manager',
    company: 'Creative Minds Co.',
    text: 'Their data analytics dashboard gave us insights we never had before. Highly recommend their services!',
    image: '/public/lovable-uploads/e37ad8e8-a3f4-4d85-a0bc-308b8addbb92.png',
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">What Our Clients Say</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold text-white">{testimonial.name}</h3>
                  <p className="text-gray-400">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 text-lg italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
