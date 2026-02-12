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
    <main className="min-h-screen pt-32 pb-20 bg-[#0f0f0f]">
      {/* Hero */}
      <section className="relative h-[50vh] mb-20">
        <Image
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&q=80"
          alt="About INVERA"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-[#0f0f0f]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white text-center">About INVERA</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          <div className="bg-black/50 border border-[#c6a86b]/20 p-12">
            <h2 className="text-3xl font-bold text-[#c6a86b] mb-6">Our Vision</h2>
            <p className="text-lg text-[#e8e2d9]/80 leading-relaxed">
              To be the leading force in shaping Jordan's architectural landscape, creating iconic landmarks that stand as testaments to innovation, sustainability, and timeless design excellence.
            </p>
          </div>

          <div className="bg-black/50 border border-[#c6a86b]/20 p-12">
            <h2 className="text-3xl font-bold text-[#c6a86b] mb-6">Our Mission</h2>
            <p className="text-lg text-[#e8e2d9]/80 leading-relaxed">
              To deliver unparalleled real estate developments, architectural masterpieces, and interior solutions that exceed client expectations while contributing to the economic and cultural growth of our community.
            </p>
          </div>
        </div>

        {/* Expertise */}
        <section className="mb-32">
          <SectionHeading 
            subtitle="What We Do"
            title="Our Expertise"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <div key={index} className="group">
                <div className="bg-gradient-to-b from-black to-[#0f0f0f] border border-[#c6a86b]/20 p-8 h-full hover:border-[#c6a86b] transition-all duration-300">
                  <div className="text-[#c6a86b] text-6xl font-bold mb-4 opacity-50">
                    0{index + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-[#e8e2d9]/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose INVERA */}
        <section className="mb-32">
          <SectionHeading 
            subtitle="Our Advantage"
            title="Why Choose INVERA"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#c6a86b] mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-[#e8e2d9]/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-32">
          <SectionHeading 
            subtitle="Our Journey"
            title="Company Timeline"
          />
          
          <div className="space-y-12">
            {[
              { year: '2010', event: 'INVERA founded with a vision to transform Jordan\'s real estate landscape' },
              { year: '2013', event: 'Completed first major residential development - 200+ units' },
              { year: '2016', event: 'Expanded into commercial architecture and interior design' },
              { year: '2019', event: 'Launched premium contracting and renovation division' },
              { year: '2022', event: 'Achieved 2M+ SQM of developed properties' },
              { year: '2024', event: 'Recognized as Jordan\'s leading integrated development company' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-8 group">
                <div className="text-[#c6a86b] text-4xl font-bold min-w-[120px]">
                  {item.year}
                </div>
                <div className="flex-1">
                  <div className="h-1 w-full bg-[#c6a86b]/20 mb-4 relative">
                    <div className="absolute left-0 top-0 h-full bg-[#c6a86b] w-0 group-hover:w-full transition-all duration-1000"></div>
                  </div>
                  <p className="text-lg text-[#e8e2d9]/80">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Founder Message */}
        <section className="mb-32">
          <div className="bg-gradient-to-br from-black via-[#0f0f0f] to-black border border-[#c6a86b]/30 p-12 md:p-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                A Word from Eng. Yanal Al-Farajeh
              </h2>
              <div className="w-24 h-1 bg-[#c6a86b] mx-auto mb-8"></div>
              <p className="text-xl text-[#e8e2d9]/80 leading-relaxed mb-6">
                "At INVERA, we believe that architecture is more than structures—it's about creating spaces that inspire, elevate, and endure. Every project we undertake is a commitment to excellence, a promise to our clients, and a contribution to Jordan's future."
              </p>
              <p className="text-xl text-[#e8e2d9]/80 leading-relaxed mb-8">
                "Our integrated approach allows us to control every aspect of the development process, ensuring that vision becomes reality without compromise. This is what sets INVERA apart."
              </p>
              <p className="text-[#c6a86b] text-lg font-bold">
                — Eng. Yanal Al-Farajeh, Founder & CEO
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-20 border-t border-[#c6a86b]/20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Let's Build Something Extraordinary
          </h2>
          <p className="text-xl text-[#e8e2d9]/80 mb-12">
            Your vision. Our expertise. Unmatched results.
          </p>
          <Link href="/contact">
            <LuxuryButton variant="primary">Start Your Project</LuxuryButton>
          </Link>
        </section>
      </div>
    </main>
  );
}
