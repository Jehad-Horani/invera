import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f0f0f] border-t border-[#c6a86b]/10">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4 tracking-wider">INVERA</h3>
            <p className="text-[#e8e2d9]/70 mb-6 leading-relaxed text-sm max-w-md">
              Designing landmarks. Building value. Creating architectural masterpieces that stand the test of time.
            </p>
            
            {/* Social */}
            <div className="flex gap-3">
              {['twitter', 'facebook', 'instagram'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="w-10 h-10 flex items-center justify-center text-[#c6a86b] border border-[#c6a86b]/30 rounded hover:bg-[#c6a86b] hover:text-black transition-all duration-300"
                  aria-label={social}
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
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: '/projects', label: 'Projects' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-[#e8e2d9]/70 hover:text-[#c6a86b] transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-[#e8e2d9]/70 text-sm">
              <li>Amman, Jordan</li>
              <li>+962 6 XXX XXXX</li>
              <li>info@invera.jo</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#c6a86b]/10">
          <p className="text-center text-[#e8e2d9]/50 text-xs">
            © {currentYear} INVERA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
