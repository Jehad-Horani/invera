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
      data-testid="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0B0B0B]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(198,168,107,0.12)]'
          : 'bg-transparent'
      }`}
    >
      <div className="site-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            data-testid="navbar-logo"
            className="text-2xl font-bold tracking-[0.15em] text-[#F5F2EA] hover:text-[#C6A86B] transition-colors duration-300"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            INVERA
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                  className={`relative text-xs uppercase tracking-[0.2em] font-semibold py-2 transition-all duration-300 ${
                    isActive
                      ? 'text-[#C6A86B]'
                      : 'text-[rgba(245,242,234,0.72)] hover:text-[#F5F2EA]'
                  }`}
                >
                  {link.label}
                  {/* Active indicator — strong gold underline */}
                  <span
                    className={`absolute left-0 -bottom-0.5 h-[2px] bg-[#C6A86B] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                  {/* Hover indicator */}
                  {!isActive && (
                    <span className="absolute left-0 -bottom-0.5 h-[2px] bg-[#C6A86B]/50 w-0 hover:w-full transition-all duration-300" />
                  )}
                </Link>
              );
            })}

            {/* CTA in navbar */}
            <Link href="/contact" data-testid="nav-cta-button">
              <span className="inline-flex items-center justify-center px-5 py-2 text-xs uppercase tracking-[0.15em] font-bold border border-[#C6A86B] text-[#C6A86B] rounded hover:bg-[#C6A86B] hover:text-black transition-all duration-300">
                Get Started
              </span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center"
            aria-label="Toggle menu"
            data-testid="mobile-menu-toggle"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-[#C6A86B] transition-all duration-300 origin-left ${
                mobileOpen ? 'rotate-45 translate-y-0' : ''
              }`} />
              <span className={`w-full h-0.5 bg-[#C6A86B] transition-all duration-300 ${
                mobileOpen ? 'opacity-0 translate-x-4' : 'opacity-100'
              }`} />
              <span className={`w-full h-0.5 bg-[#C6A86B] transition-all duration-300 origin-left ${
                mobileOpen ? '-rotate-45 translate-y-0' : ''
              }`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        data-testid="mobile-menu"
        className={`md:hidden bg-[#0B0B0B]/98 backdrop-blur-xl border-t border-[rgba(198,168,107,0.12)] transition-all duration-400 overflow-hidden ${
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="site-container py-6 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                className={`block py-3 px-4 text-sm uppercase tracking-[0.15em] font-semibold rounded transition-all duration-300 ${
                  isActive
                    ? 'text-[#C6A86B] bg-[rgba(198,168,107,0.08)] border-l-2 border-[#C6A86B]'
                    : 'text-[rgba(245,242,234,0.72)] hover:text-[#F5F2EA] hover:bg-[rgba(255,255,255,0.03)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4">
            <Link href="/contact" data-testid="mobile-nav-cta">
              <span className="block text-center py-3 px-4 text-sm uppercase tracking-[0.15em] font-bold bg-[#C6A86B] text-black rounded hover:bg-[#D7BC7A] transition-all duration-300">
                Get Started
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
