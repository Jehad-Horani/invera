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
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setProjects(data);
      setFilteredProjects(data);
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
    <main className="min-h-screen pt-32 pb-20 bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading 
          subtitle="Our Work"
          title="Projects Portfolio"
        />

        {/* Search & Filter */}
        <div className="mb-16 space-y-6">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 bg-black/50 border border-[#c6a86b]/20 text-white placeholder-white/50 focus:outline-none focus:border-[#c6a86b] transition-colors"
          />

          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-6 py-3 text-sm uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat.value
                    ? 'bg-[#c6a86b] text-black font-bold'
                    : 'bg-black/50 text-white/70 hover:text-white border border-[#c6a86b]/20 hover:border-[#c6a86b]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin w-12 h-12 border-4 border-[#c6a86b] border-t-transparent rounded-full"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-white/50">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
