import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0B0B] border-t border-[rgba(198,168,107,0.12)]" data-testid="site-footer">
      <div className="site-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-[#F5F2EA] mb-4 tracking-[0.12em]" style={{ fontFamily: 'var(--font-serif)' }}>
              INVERA
            </h3>
            <p className="text-[rgba(245,242,234,0.6)] mb-6 leading-relaxed text-sm max-w-md">
              Designing landmarks. Building value. Creating architectural masterpieces that stand the test of time.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {['twitter', 'facebook', 'instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center text-[#C6A86B] border border-[rgba(198,168,107,0.25)] rounded hover:bg-[#C6A86B] hover:text-black transition-all duration-300"
                  aria-label={social}
                  data-testid={`footer-social-${social}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#F5F2EA] font-bold mb-5 text-xs uppercase tracking-[0.2em]">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/projects', label: 'Projects' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[rgba(245,242,234,0.6)] hover:text-[#C6A86B] transition-colors duration-300 text-sm"
                    data-testid={`footer-link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#F5F2EA] font-bold mb-5 text-xs uppercase tracking-[0.2em]">Contact</h4>
            <ul className="space-y-3 text-[rgba(245,242,234,0.6)] text-sm">
              <li>Amman, Jordan</li>
              <li>+962 6 XXX XXXX</li>
              <li>info@invera.jo</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[rgba(198,168,107,0.1)]">
          <p className="text-center text-[rgba(245,242,234,0.4)] text-xs tracking-wider">
            &copy; {currentYear} INVERA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
