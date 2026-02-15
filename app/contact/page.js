'use client';
import { useState } from 'react';
import SectionHeading from '@/components/SectionHeading';
import LuxuryButton from '@/components/LuxuryButton';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitted(true);
    setLoading(false);
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputBase = 'w-full px-5 py-4 bg-[#111111] border border-[rgba(198,168,107,0.18)] text-[#F5F2EA] placeholder-[rgba(245,242,234,0.3)] focus:outline-none focus:border-[#C6A86B] transition-colors duration-300 text-sm';

  return (
    <main className="min-h-screen pt-28 pb-20 bg-[#0B0B0B]" data-testid="contact-page">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        <SectionHeading
          subtitle="Get In Touch"
          title="Contact Us"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20" data-testid="contact-content">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-[#F5F2EA] mb-8" data-testid="form-heading">Send Us a Message</h2>

            {submitted && (
              <div className="mb-6 p-5 bg-[rgba(198,168,107,0.1)] border border-[#C6A86B] text-[#F5F2EA]" data-testid="form-success-message">
                <p className="font-bold mb-1 text-sm">Thank you for reaching out!</p>
                <p className="text-xs text-[rgba(245,242,234,0.72)]">We&apos;ll get back to you within 24 hours.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" data-testid="contact-form">
              <div>
                <label htmlFor="name" className="block text-[#C6A86B] text-xs uppercase tracking-[0.15em] font-bold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputBase}
                  placeholder="Enter your full name"
                  data-testid="input-name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="email" className="block text-[#C6A86B] text-xs uppercase tracking-[0.15em] font-bold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputBase}
                    placeholder="your.email@example.com"
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[#C6A86B] text-xs uppercase tracking-[0.15em] font-bold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputBase}
                    placeholder="+962 X XXX XXXX"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-[#C6A86B] text-xs uppercase tracking-[0.15em] font-bold mb-2">
                  Service Type *
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className={inputBase}
                  data-testid="input-service"
                >
                  <option value="">Select a service</option>
                  <option value="real_estate">Real Estate Development</option>
                  <option value="architecture">Architecture</option>
                  <option value="interior">Interior Design & Contracting</option>
                  <option value="renovation">Renovation & Redesign</option>
                  <option value="consultation">General Consultation</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-[#C6A86B] text-xs uppercase tracking-[0.15em] font-bold mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className={`${inputBase} resize-none`}
                  placeholder="Tell us about your project..."
                  data-testid="input-message"
                />
              </div>

              <LuxuryButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full"
                data-testid="contact-submit-button"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </LuxuryButton>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-[#F5F2EA] mb-8" data-testid="contact-info-heading">Get In Touch</h2>

            <div className="space-y-6 mb-10">
              {[
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  ),
                  icon2: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  ),
                  title: 'Office Location',
                  lines: ['Abdali Boulevard', 'Amman, Jordan'],
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  ),
                  title: 'Phone',
                  lines: ['+962 6 XXX XXXX', '+962 7X XXX XXXX'],
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  ),
                  title: 'Email',
                  lines: ['info@invera.jo', 'projects@invera.jo'],
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ),
                  title: 'Business Hours',
                  lines: ['Sunday \u2013 Thursday: 9:00 AM \u2013 6:00 PM', 'Saturday: 10:00 AM \u2013 2:00 PM'],
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4" data-testid={`contact-info-${idx}`}>
                  <div className="w-11 h-11 bg-[#C6A86B] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.icon}
                      {item.icon2}
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#F5F2EA] mb-1">{item.title}</h3>
                    {item.lines.map((line, i) => (
                      <p key={i} className="text-[rgba(245,242,234,0.6)] text-sm">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA — Brand palette consistent */}
            <div className="bg-[#111111] border border-[rgba(198,168,107,0.18)] p-6 lg:p-8" data-testid="whatsapp-cta">
              <h3 className="text-xl font-bold text-[#F5F2EA] mb-3">Need Quick Assistance?</h3>
              <p className="text-[rgba(245,242,234,0.6)] mb-5 text-sm leading-relaxed">
                Chat with us on WhatsApp for immediate support.
              </p>
              <a
                href="https://wa.me/962XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-[#C6A86B] text-black font-bold uppercase tracking-[0.1em] text-xs hover:bg-[#D7BC7A] transition-all duration-300"
                data-testid="whatsapp-button"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-[#111111] border border-[rgba(198,168,107,0.18)] h-[320px] flex items-center justify-center mb-8" data-testid="map-placeholder">
          <p className="text-[rgba(245,242,234,0.4)] text-sm tracking-wider uppercase">Map Location</p>
        </div>
      </div>
    </main>
  );
}
