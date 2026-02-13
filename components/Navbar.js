'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-xl border-b border-[#c6a86b]/10 shadow-lg shadow-black/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="relative text-2xl font-bold tracking-[0.15em] text-white group transition-all duration-300 hover:text-[#c6a86b]"
          >
            INVERA
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[#c6a86b] to-[#d4b97a] group-hover:w-full transition-all duration-500 ease-out"></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="relative text-[13px] uppercase tracking-[0.15em] font-medium group"
              >
                <span className={`transition-colors duration-300 ${
                  pathname === link.href 
                    ? 'text-[#c6a86b]' 
                    : 'text-white/70 group-hover:text-white'
                }`}>
                  {link.label}
                </span>
                <span 
                  className={`absolute -bottom-1 left-0 h-[1.5px] bg-[#c6a86b] transition-all duration-300 ease-out ${
                    pathname === link.href ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                  }`}
                ></span>
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-white focus:outline-none group"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`w-full h-[2px] bg-[#c6a86b] transition-all duration-300 ease-out ${
                mobileOpen ? 'rotate-45 translate-y-[9px]' : ''
              }`}></span>
              <span className={`w-full h-[2px] bg-[#c6a86b] transition-all duration-300 ease-out ${
                mobileOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
              }`}></span>
              <span className={`w-full h-[2px] bg-[#c6a86b] transition-all duration-300 ease-out ${
                mobileOpen ? '-rotate-45 -translate-y-[9px]' : ''
              }`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-black/95 backdrop-blur-2xl border-t border-[#c6a86b]/10 transition-all duration-500 ease-in-out ${
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 py-6 space-y-1">
          {navLinks.map((link, index) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 px-4 text-sm uppercase tracking-[0.15em] font-medium rounded transition-all duration-300 ${
                pathname === link.href 
                  ? 'text-[#c6a86b] bg-[#c6a86b]/10' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
              style={{
                transitionDelay: mobileOpen ? `${index * 50}ms` : '0ms'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
