import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const renderNavItem = (item: { name: string; href: string }, isMobile = false) => {
    if (item.href.startsWith('#')) {
      return (
        <a
          key={item.name}
          href={item.href}
          className={`${isMobile ? 'text-gray-300' : 'text-white'} transition-colors hover:text-amber-400`}
          onClick={isMobile ? () => setIsOpen(false) : undefined}
        >
          {item.name}
        </a>
      );
    }
    return (
      <Link
        key={item.name}
        to={item.href}
        className={`${isMobile ? 'text-gray-300' : 'text-white'} transition-colors hover:text-amber-400`}
        onClick={isMobile ? () => setIsOpen(false) : undefined}
      >
        {item.name}
      </Link>
    );
  };

  const navItems: { name: string; href: string }[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Blog', href: '#blog' },
    { name: 'Testimonials', href: '#testimonials' }
  ];

  const serviceItems = [
    { name: 'Playground', href: '/playground' },
    { name: 'Web Analysis', href: '/web-analysis' },
    { name: 'Email Marketing', href: '/email-marketing' },
    { name: 'SEO', href: '/seo' },
    { name: 'AI Strategy', href: '/ai-strategy' },
    { name: 'Data Analytics', href: '/data-analytics' },
  ];

  return (
    <>
      <nav className="fixed z-50 w-full bg-background/80 py-4 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link to="/" className="text-2xl font-bold text-white">
            Invisioned
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => renderNavItem(item))}
            <div className="relative group">
              <button className="text-white hover:text-amber-400 transition-colors">
                Services
              </button>
              <div className="absolute hidden group-hover:block bg-background/95 backdrop-blur-md rounded-lg shadow-lg p-2 min-w-[200px]">
                {serviceItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700/50 rounded-md transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <button className="text-white md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {isOpen && (
            <div className="absolute left-0 right-0 top-full bg-background/95 backdrop-blur-md md:hidden">
              <div className="container mx-auto flex flex-col gap-4 px-4 py-4">
                {navItems.map((item) => renderNavItem(item, true))}
                <div className="flex flex-col gap-2">
                  <p className="text-gray-400 text-sm">Services</p>
                  {serviceItems.map((item) => renderNavItem(item, true))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
