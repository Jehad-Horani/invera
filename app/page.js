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
    // Fetch featured projects
    async function fetchFeatured() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (data) setFeaturedProjects(data);
    }
    fetchFeatured();

    // GSAP Parallax for hero
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
    <main className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0f0f0f] z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
            alt="Luxury Architecture"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-20 text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p 
              className="text-[#c6a86b] uppercase tracking-[0.3em] text-sm md:text-base mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Architectural Excellence Since 2010
            </motion.p>
            
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              INVERA
            </motion.h1>
            
            <motion.h2 
              className="text-2xl md:text-4xl lg:text-5xl font-light mb-8 text-[#e8e2d9]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Designing Landmarks. Building Value.
            </motion.h2>
            
            <motion.p 
              className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              Premier real estate development, architecture, interior design, and renovation services that redefine luxury living.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <Link href="/projects">
                <LuxuryButton variant="primary" size="lg">View Projects</LuxuryButton>
              </Link>
              <Link href="/contact">
                <LuxuryButton variant="secondary" size="lg">Book Consultation</LuxuryButton>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-[#c6a86b] rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-[#c6a86b] rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* DIVISION 1: REAL ESTATE DEVELOPMENT */}
      <section className="py-32 bg-gradient-to-b from-[#0f0f0f] to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #c6a86b 0px, #c6a86b 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #c6a86b 0px, #c6a86b 1px, transparent 1px, transparent 60px)'
        }}></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <SectionHeading 
            subtitle="Division 01"
            title="Real Estate Development"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Building Tomorrow's Landmarks Today
              </h3>
              <p className="text-[#e8e2d9]/80 text-lg leading-relaxed mb-8">
                We don't just develop properties – we create iconic landmarks that define skylines and set new standards for luxury living. Each project represents our commitment to architectural excellence, sustainable design, and unparalleled value creation.
              </p>
              <Link href="/projects?category=real_estate">
                <LuxuryButton variant="secondary">Explore Developments</LuxuryButton>
              </Link>
            </div>
            
            <div className="relative h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
                alt="Real Estate Development"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 border-2 border-[#c6a86b] -translate-x-4 -translate-y-4"></div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <CounterAnimation end={150} suffix="+" />
              <p className="text-[#e8e2d9]/70 mt-4 text-lg">Projects Delivered</p>
            </div>
            <div>
              <CounterAnimation end={2500000} suffix="+" />
              <p className="text-[#e8e2d9]/70 mt-4 text-lg">SQM Developed</p>
            </div>
            <div>
              <CounterAnimation end={15} suffix="+" />
              <p className="text-[#e8e2d9]/70 mt-4 text-lg">Years Experience</p>
            </div>
            <div>
              <CounterAnimation end={5000} suffix="+" />
              <p className="text-[#e8e2d9]/70 mt-4 text-lg">Satisfied Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* DIVISION 2: ARCHITECTURE */}
      <section className="py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading 
            subtitle="Division 02"
            title="Architecture"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] order-2 lg:order-1">
              <div className="absolute inset-0 border border-[#c6a86b]/30"></div>
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                alt="Architecture"
                fill
                className="object-cover p-4"
              />
              {/* Blueprint overlay animation */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#c6a86b" strokeWidth="1" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
                </line>
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#c6a86b" strokeWidth="1" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
                </line>
              </svg>
            </div>
            
            <div className="order-1 lg:order-2">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Where Vision Meets Precision
              </h3>
              <p className="text-[#e8e2d9]/80 text-lg leading-relaxed mb-8">
                Our architectural philosophy combines timeless elegance with cutting-edge innovation. Every line drawn, every space conceived, reflects a deep understanding of form, function, and the human experience.
              </p>
              <ul className="space-y-4 mb-8">
                {['Conceptual Design', 'Master Planning', 'Sustainable Architecture', '3D Visualization'].map((item) => (
                  <li key={item} className="flex items-center text-[#e8e2d9]/80">
                    <span className="w-2 h-2 bg-[#c6a86b] mr-4"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/projects?category=architecture">
                <LuxuryButton variant="primary">See Architectural Work</LuxuryButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DIVISION 3: INTERIOR DESIGN & CONTRACTING */}
      <section className="py-32 bg-gradient-to-b from-black to-[#0f0f0f] relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading 
            subtitle="Division 03"
            title="Interior Design & Contracting"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Luxury Refined. Precision Executed.
              </h3>
              <p className="text-[#e8e2d9]/80 text-lg leading-relaxed mb-8">
                From concept to completion, we transform interiors into bespoke sanctuaries. Our integrated approach combines world-class design with flawless execution, ensuring every detail exceeds expectations.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-[#c6a86b] text-2xl font-bold mb-2">Design</h4>
                  <ul className="text-[#e8e2d9]/70 space-y-2">
                    <li>• Concept Development</li>
                    <li>• Space Planning</li>
                    <li>• Custom Furniture</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[#c6a86b] text-2xl font-bold mb-2">Contracting</h4>
                  <ul className="text-[#e8e2d9]/70 space-y-2">
                    <li>• Premium Execution</li>
                    <li>• Quality Control</li>
                    <li>• Timely Delivery</li>
                  </ul>
                </div>
              </div>
              <Link href="/projects?category=interior_contracting">
                <LuxuryButton variant="secondary">Interior & Execution</LuxuryButton>
              </Link>
            </div>
            
            <div className="relative h-[500px]">
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

      {/* DIVISION 4: RENOVATION & REDESIGN */}
      <section className="py-32 bg-[#0f0f0f] relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading 
            subtitle="Division 04"
            title="Renovation & Redesign"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="relative h-[500px] order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80"
                alt="Renovation"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Transform Your Space
              </h3>
              <p className="text-[#e8e2d9]/80 text-lg leading-relaxed mb-8">
                Breathing new life into existing spaces is our specialty. Whether it's a heritage restoration or a modern update, we preserve what matters while elevating everything else.
              </p>
              <div className="bg-black/50 border border-[#c6a86b]/20 p-6 mb-8">
                <h4 className="text-xl font-bold text-[#c6a86b] mb-4">Our Process</h4>
                <div className="space-y-3 text-[#e8e2d9]/80">
                  <div className="flex items-start">
                    <span className="text-[#c6a86b] mr-3">01</span>
                    <span>Assessment & Planning</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-[#c6a86b] mr-3">02</span>
                    <span>Design & Approval</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-[#c6a86b] mr-3">03</span>
                    <span>Execution & Quality Control</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-[#c6a86b] mr-3">04</span>
                    <span>Final Reveal</span>
                  </div>
                </div>
              </div>
              <Link href="/projects?category=renovation">
                <LuxuryButton variant="primary">Transform Your Space</LuxuryButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featuredProjects.length > 0 && (
        <section className="py-32 bg-black">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeading 
              subtitle="Portfolio"
              title="Featured Projects"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  featured={index === 0}
                />
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Link href="/projects">
                <LuxuryButton variant="secondary" size="lg">View All Projects</LuxuryButton>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="py-32 bg-gradient-to-b from-black to-[#0f0f0f] text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Build Your Vision?
          </h2>
          <p className="text-xl text-[#e8e2d9]/80 mb-12">
            Let's create something extraordinary together.
          </p>
          <Link href="/contact">
            <LuxuryButton variant="primary" size="lg">Start Your Project</LuxuryButton>
          </Link>
        </div>
      </section>
    </main>
  );
}
