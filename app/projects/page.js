'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProjectCard from '@/components/ProjectCard';
import SectionHeading from '@/components/SectionHeading';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'interior_contracting', label: 'Interior & Contracting' },
    { value: 'renovation', label: 'Renovation' },
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [activeCategory, searchQuery, projects]);

  async function fetchProjects() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setProjects(data);
        setFilteredProjects(data);
      }
    } catch (e) {
      // Supabase may not be configured
    }
    setLoading(false);
  }

  function filterProjects() {
    let filtered = projects;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }

  return (
    <main className="min-h-screen pt-28 pb-20 bg-[#0B0B0B]" data-testid="projects-page">
      <div className="site-container">
        <SectionHeading
          subtitle="Our Work"
          title="Projects Portfolio"
        />

        {/* Search & Filter */}
        <div className="mb-14 space-y-5" data-testid="projects-filter">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-4 bg-[#111111] border border-[rgba(198,168,107,0.18)] text-[#F5F2EA] placeholder-[rgba(245,242,234,0.4)] focus:outline-none focus:border-[#C6A86B] transition-colors text-sm"
            data-testid="projects-search-input"
          />

          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                data-testid={`filter-btn-${cat.value}`}
                className={`px-5 py-2.5 text-xs uppercase tracking-[0.12em] font-bold transition-all duration-300 ${
                  activeCategory === cat.value
                    ? 'bg-[#C6A86B] text-black shadow-[0_2px_12px_rgba(198,168,107,0.25)]'
                    : 'bg-[#111111] text-[rgba(245,242,234,0.6)] border border-[rgba(198,168,107,0.18)] hover:text-[#F5F2EA] hover:border-[#C6A86B]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-20" data-testid="projects-loading">
            <div className="inline-block animate-spin w-10 h-10 border-3 border-[#C6A86B] border-t-transparent rounded-full" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20" data-testid="projects-empty">
            <p className="text-xl text-[rgba(245,242,234,0.4)]">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="projects-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
