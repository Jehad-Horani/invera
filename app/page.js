'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '@/lib/supabaseClient';
import LuxuryButton from '@/components/LuxuryButton';
import SectionHeading from '@/components/SectionHeading';
import ProjectCard from '@/components/ProjectCard';
import CounterAnimation from '@/components/CounterAnimation';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const heroRef = useRef(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(4);
        if (data) setFeaturedProjects(data);
      } catch (e) {
        // Supabase may not be configured
      }
    }
    fetchFeatured();

    if (heroRef.current) {
      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        y: 200,
        opacity: 0.3,
      });
    }
  }, []);

  return (
    <main data-testid="home-page">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        <div ref={heroRef} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0B0B0B] z-10" />
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
            alt="Luxury Architecture"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-20 text-center site-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="text-[#C6A86B] uppercase tracking-[0.3em] text-sm mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Architectural Excellence Since 2010
            </motion.p>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] text-[#F5F2EA]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              data-testid="hero-title"
            >
              INVERA
            </motion.h1>

            <motion.h2
              className="text-2xl md:text-4xl lg:text-5xl font-light mb-8 text-[rgba(245,242,234,0.85)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Designing Landmarks. Building Value.
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl text-[rgba(245,242,234,0.72)] mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              Premier real estate development, architecture, interior design, and renovation services that redefine luxury living.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <Link href="/projects">
                <LuxuryButton variant="primary" size="lg" data-testid="hero-cta-projects">View Projects</LuxuryButton>
              </Link>
              <Link href="/contact">
                <LuxuryButton variant="secondary" size="lg" data-testid="hero-cta-contact">Book Consultation</LuxuryButton>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          data-testid="scroll-indicator"
        >
          <div className="w-6 h-10 border-2 border-[#C6A86B] rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-[#C6A86B] rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ═══ DIVISION 1: REAL ESTATE DEVELOPMENT ═══ */}
      <section className="site-section bg-gradient-to-b from-[#0B0B0B] to-black relative overflow-hidden" data-testid="division-real-estate">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #C6A86B 0px, #C6A86B 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #C6A86B 0px, #C6A86B 1px, transparent 1px, transparent 60px)'
        }} />

        <div className="site-container relative z-10">
          <SectionHeading
            subtitle="Division 01"
            title="Real Estate Development"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[#F5F2EA]">
                Building Tomorrow&apos;s Landmarks Today
              </h3>
              <p className="text-[rgba(245,242,234,0.72)] text-lg leading-relaxed mb-8">
                We don&apos;t just develop properties &ndash; we create iconic landmarks that define skylines and set new standards for luxury living. Each project represents our commitment to architectural excellence, sustainable design, and unparalleled value creation.
              </p>
              <Link href="/projects?category=real_estate">
                <LuxuryButton variant="secondary" data-testid="cta-explore-developments">Explore Developments</LuxuryButton>
              </Link>
            </div>

            <div className="relative h-[400px] lg:h-[480px]">
              <Image
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
                alt="Real Estate Development"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 border border-[rgba(198,168,107,0.18)] -translate-x-3 -translate-y-3 pointer-events-none" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" data-testid="stats-grid">
            <div>
              <CounterAnimation end={150} suffix="+" />
              <p className="text-[rgba(245,242,234,0.6)] mt-3 text-base">Projects Delivered</p>
            </div>
            <div>
              <CounterAnimation end={2500000} suffix="+" />
              <p className="text-[rgba(245,242,234,0.6)] mt-3 text-base">SQM Developed</p>
            </div>
            <div>
              <CounterAnimation end={15} suffix="+" />
              <p className="text-[rgba(245,242,234,0.6)] mt-3 text-base">Years Experience</p>
            </div>
            <div>
              <CounterAnimation end={5000} suffix="+" />
              <p className="text-[rgba(245,242,234,0.6)] mt-3 text-base">Satisfied Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DIVISION 2: ARCHITECTURE ═══ */}
      <section className="site-section bg-black relative" data-testid="division-architecture">
        <div className="site-container">
          <SectionHeading
            subtitle="Division 02"
            title="Architecture"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative h-[400px] lg:h-[480px] order-2 lg:order-1">
              <div className="absolute inset-0 border border-[rgba(198,168,107,0.18)]" />
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                alt="Architecture"
                fill
                className="object-cover p-3"
              />
              {/* Blueprint overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#C6A86B" strokeWidth="1" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
                </line>
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#C6A86B" strokeWidth="1" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
                </line>
              </svg>
            </div>

            <div className="order-1 lg:order-2">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[#F5F2EA]">
                Where Vision Meets Precision
              </h3>
              <p className="text-[rgba(245,242,234,0.72)] text-lg leading-relaxed mb-8">
                Our architectural philosophy combines timeless elegance with cutting-edge innovation. Every line drawn, every space conceived, reflects a deep understanding of form, function, and the human experience.
              </p>
              <ul className="space-y-4 mb-8">
                {['Conceptual Design', 'Master Planning', 'Sustainable Architecture', '3D Visualization'].map((item) => (
                  <li key={item} className="flex items-center text-[rgba(245,242,234,0.72)]">
                    <span className="w-2 h-2 bg-[#C6A86B] mr-4 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/projects?category=architecture">
                <LuxuryButton variant="primary" data-testid="cta-architecture">See Architectural Work</LuxuryButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DIVISION 3: INTERIOR DESIGN & CONTRACTING ═══ */}
      <section className="site-section bg-gradient-to-b from-black to-[#0B0B0B] relative" data-testid="division-interior">
        <div className="site-container">
          <SectionHeading
            subtitle="Division 03"
            title="Interior Design & Contracting"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[#F5F2EA]">
                Luxury Refined. Precision Executed.
              </h3>
              <p className="text-[rgba(245,242,234,0.72)] text-lg leading-relaxed mb-8">
                From concept to completion, we transform interiors into bespoke sanctuaries. Our integrated approach combines world-class design with flawless execution, ensuring every detail exceeds expectations.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-[#C6A86B] text-xl font-bold mb-3">Design</h4>
                  <ul className="text-[rgba(245,242,234,0.6)] space-y-2 text-sm">
                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#C6A86B] rounded-full flex-shrink-0" />Concept Development</li>
                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#C6A86B] rounded-full flex-shrink-0" />Space Planning</li>
                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#C6A86B] rounded-full flex-shrink-0" />Custom Furniture</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[#C6A86B] text-xl font-bold mb-3">Contracting</h4>
                  <ul className="text-[rgba(245,242,234,0.6)] space-y-2 text-sm">
                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#C6A86B] rounded-full flex-shrink-0" />Premium Execution</li>
                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#C6A86B] rounded-full flex-shrink-0" />Quality Control</li>
                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#C6A86B] rounded-full flex-shrink-0" />Timely Delivery</li>
                  </ul>
                </div>
              </div>
              <Link href="/projects?category=interior_contracting">
                <LuxuryButton variant="secondary" data-testid="cta-interior">Interior & Execution</LuxuryButton>
              </Link>
            </div>

            <div className="relative h-[400px] lg:h-[480px]">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                alt="Interior Design"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DIVISION 4: RENOVATION & REDESIGN ═══ */}
      <section className="site-section bg-[#0B0B0B] relative" data-testid="division-renovation">
        <div className="site-container">
          <SectionHeading
            subtitle="Division 04"
            title="Renovation & Redesign"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative h-[400px] lg:h-[480px] order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80"
                alt="Renovation"
                fill
                className="object-cover"
              />
            </div>

            <div className="order-1 lg:order-2">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[#F5F2EA]">
                Transform Your Space
              </h3>
              <p className="text-[rgba(245,242,234,0.72)] text-lg leading-relaxed mb-8">
                Breathing new life into existing spaces is our specialty. Whether it&apos;s a heritage restoration or a modern update, we preserve what matters while elevating everything else.
              </p>
              <div className="bg-[#111111] border border-[rgba(198,168,107,0.18)] p-6 mb-8">
                <h4 className="text-lg font-bold text-[#C6A86B] mb-4">Our Process</h4>
                <div className="space-y-3 text-[rgba(245,242,234,0.72)]">
                  {[
                    { num: '01', label: 'Assessment & Planning' },
                    { num: '02', label: 'Design & Approval' },
                    { num: '03', label: 'Execution & Quality Control' },
                    { num: '04', label: 'Final Reveal' },
                  ].map((step) => (
                    <div key={step.num} className="flex items-center gap-4">
                      <span className="text-[#C6A86B] font-bold text-sm w-6">{step.num}</span>
                      <span className="text-sm">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/projects?category=renovation">
                <LuxuryButton variant="primary" data-testid="cta-renovation">Transform Your Space</LuxuryButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PROJECTS ═══ */}
      {featuredProjects.length > 0 && (
        <section className="site-section bg-black" data-testid="featured-projects-section">
          <div className="site-container">
            <SectionHeading
              subtitle="Portfolio"
              title="Featured Projects"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  featured={index === 0}
                />
              ))}
            </div>

            <div className="text-center mt-14">
              <Link href="/projects">
                <LuxuryButton variant="secondary" size="lg" data-testid="cta-view-all-projects">View All Projects</LuxuryButton>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ FINAL CTA ═══ */}
      <section className="site-section bg-gradient-to-b from-black to-[#0B0B0B] text-center" data-testid="final-cta-section">
        <div className="site-container max-w-3xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#F5F2EA]">
            Ready to Build Your Vision?
          </h2>
          <p className="text-xl text-[rgba(245,242,234,0.72)] mb-12 mx-auto max-w-xl">
            Let&apos;s create something extraordinary together.
          </p>
          <Link href="/contact">
            <LuxuryButton variant="primary" size="lg" data-testid="cta-start-project">Start Your Project</LuxuryButton>
          </Link>
        </div>
      </section>
    </main>
  );
}
