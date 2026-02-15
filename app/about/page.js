import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';
import LuxuryButton from '@/components/LuxuryButton';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | INVERA',
  description: 'Learn about INVERA - premier real estate development, architecture, and interior design company in Jordan.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0B]" data-testid="about-page">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px]" data-testid="about-hero">
        <Image
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&q=80"
          alt="About INVERA"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-[#0B0B0B]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-bold text-[#F5F2EA] text-center" data-testid="about-title">About INVERA</h1>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        {/* Vision & Mission */}
        <section className="site-section" data-testid="vision-mission">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-[#111111] border border-[rgba(198,168,107,0.18)] p-10 lg:p-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#C6A86B] mb-6">Our Vision</h2>
              <p className="text-base lg:text-lg text-[rgba(245,242,234,0.72)] leading-relaxed">
                To be the leading force in shaping Jordan&apos;s architectural landscape, creating iconic landmarks that stand as testaments to innovation, sustainability, and timeless design excellence.
              </p>
            </div>

            <div className="bg-[#111111] border border-[rgba(198,168,107,0.18)] p-10 lg:p-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#C6A86B] mb-6">Our Mission</h2>
              <p className="text-base lg:text-lg text-[rgba(245,242,234,0.72)] leading-relaxed">
                To deliver unparalleled real estate developments, architectural masterpieces, and interior solutions that exceed client expectations while contributing to the economic and cultural growth of our community.
              </p>
            </div>
          </div>
        </section>

        {/* Expertise */}
        <section className="site-section" data-testid="expertise-section">
          <SectionHeading
            subtitle="What We Do"
            title="Our Expertise"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Real Estate Development',
                desc: 'Large-scale residential and commercial developments that redefine urban living.',
              },
              {
                title: 'Architecture',
                desc: 'Innovative architectural design from concept to completion.',
              },
              {
                title: 'Interior Design',
                desc: 'Bespoke interior solutions that reflect your unique vision.',
              },
              {
                title: 'Contracting & Renovation',
                desc: 'Premium execution and transformative renovations.',
              },
            ].map((item, index) => (
              <div key={index} data-testid={`expertise-card-${index}`}>
                <div className="bg-[#111111] border border-[rgba(198,168,107,0.18)] p-8 h-full hover:border-[#C6A86B] transition-all duration-300">
                  <div className="text-[#C6A86B] text-5xl font-bold mb-4 opacity-40">
                    0{index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-[#F5F2EA] mb-3">{item.title}</h3>
                  <p className="text-[rgba(245,242,234,0.6)] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose INVERA */}
        <section className="site-section" data-testid="why-choose-section">
          <SectionHeading
            subtitle="Our Advantage"
            title="Why Choose INVERA"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: 'Proven Track Record',
                desc: 'Over 15 years of delivering exceptional projects across Jordan.',
              },
              {
                title: 'Integrated Approach',
                desc: 'Seamless coordination from design through construction to delivery.',
              },
              {
                title: 'Quality Commitment',
                desc: 'Uncompromising standards in materials, craftsmanship, and execution.',
              },
              {
                title: 'Innovation Focus',
                desc: 'Leveraging cutting-edge technology and sustainable practices.',
              },
              {
                title: 'Client-Centric',
                desc: 'Your vision drives every decision we make.',
              },
              {
                title: 'Value Creation',
                desc: 'Projects designed to appreciate and deliver lasting value.',
              },
            ].map((item, index) => (
              <div key={index} className="text-center" data-testid={`advantage-card-${index}`}>
                <div className="w-14 h-14 bg-[#C6A86B] mx-auto mb-5 flex items-center justify-center">
                  <span className="text-xl font-bold text-black">{index + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-[#F5F2EA] mb-3">{item.title}</h3>
                <p className="text-[rgba(245,242,234,0.6)] text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="site-section" data-testid="timeline-section">
          <SectionHeading
            subtitle="Our Journey"
            title="Company Timeline"
          />

          <div className="space-y-10 max-w-3xl mx-auto">
            {[
              { year: '2010', event: 'INVERA founded with a vision to transform Jordan\'s real estate landscape' },
              { year: '2013', event: 'Completed first major residential development \u2013 200+ units' },
              { year: '2016', event: 'Expanded into commercial architecture and interior design' },
              { year: '2019', event: 'Launched premium contracting and renovation division' },
              { year: '2022', event: 'Achieved 2M+ SQM of developed properties' },
              { year: '2024', event: 'Recognized as Jordan\'s leading integrated development company' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-6 lg:gap-8 group" data-testid={`timeline-item-${item.year}`}>
                <div className="text-[#C6A86B] text-3xl lg:text-4xl font-bold min-w-[100px]">
                  {item.year}
                </div>
                <div className="flex-1 pt-1">
                  <div className="h-[2px] w-full bg-[rgba(198,168,107,0.15)] mb-4 relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full bg-[#C6A86B] w-0 group-hover:w-full transition-all duration-700" />
                  </div>
                  <p className="text-base text-[rgba(245,242,234,0.72)] leading-relaxed">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Founder Message */}
        <section className="site-section" data-testid="founder-message">
          <div className="bg-[#111111] border border-[rgba(198,168,107,0.18)] p-10 md:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F5F2EA] mb-8">
                A Word from Eng. Yanal Al-Farajeh
              </h2>
              <div className="w-16 h-[2px] bg-[#C6A86B] mx-auto mb-8" />
              <p className="text-lg text-[rgba(245,242,234,0.72)] leading-relaxed mb-6">
                &ldquo;At INVERA, we believe that architecture is more than structures &mdash; it&apos;s about creating spaces that inspire, elevate, and endure. Every project we undertake is a commitment to excellence, a promise to our clients, and a contribution to Jordan&apos;s future.&rdquo;
              </p>
              <p className="text-lg text-[rgba(245,242,234,0.72)] leading-relaxed mb-8">
                &ldquo;Our integrated approach allows us to control every aspect of the development process, ensuring that vision becomes reality without compromise. This is what sets INVERA apart.&rdquo;
              </p>
              <p className="text-[#C6A86B] text-base font-bold tracking-wide">
                &mdash; Eng. Yanal Al-Farajeh, Founder & CEO
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center site-section border-t border-[rgba(198,168,107,0.12)]" data-testid="about-cta">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F5F2EA] mb-6">
            Let&apos;s Build Something Extraordinary
          </h2>
          <p className="text-lg text-[rgba(245,242,234,0.72)] mb-10 mx-auto max-w-lg">
            Your vision. Our expertise. Unmatched results.
          </p>
          <Link href="/contact">
            <LuxuryButton variant="primary" size="lg" data-testid="about-cta-button">Start Your Project</LuxuryButton>
          </Link>
        </section>
      </div>
    </main>
  );
}
