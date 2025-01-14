export const HeroSection = () => {
  return (
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
  );
};