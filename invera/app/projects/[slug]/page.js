import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';
import LuxuryButton from '@/components/LuxuryButton';

export async function generateMetadata({ params }) {
  const { data } = await supabase
    .from('projects')
    .select('name, summary')
    .eq('slug', params.slug)
    .single();

  return {
    title: data ? `${data.name} | INVERA` : 'Project | INVERA',
    description: data?.summary || 'INVERA project details',
  };
}

export default async function ProjectPage({ params }) {
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!project) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
          <Link href="/projects">
            <LuxuryButton variant="outline">Back to Projects</LuxuryButton>
          </Link>
        </div>
      </main>
    );
  }

  const gallery = Array.isArray(project.gallery) ? project.gallery : [];

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[#0f0f0f]">
      {/* Hero Cover */}
      <div className="relative h-[70vh] mb-20">
        <Image
          src={project.cover_image_url}
          alt={project.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-black/50 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-8 pb-12">
          <span className="text-[#c6a86b] text-sm uppercase tracking-wider mb-4 block">
            {project.category.replace('_', ' ')}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            {project.name}
          </h1>
          {project.location && (
            <p className="text-xl text-white/80">
              {project.location} • {project.year}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Meta Data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 pb-20 border-b border-[#c6a86b]/20">
          {project.area_sqm && (
            <div>
              <p className="text-[#c6a86b] text-sm uppercase tracking-wider mb-2">Area</p>
              <p className="text-2xl font-bold text-white">{project.area_sqm.toLocaleString()} SQM</p>
            </div>
          )}
          {project.year && (
            <div>
              <p className="text-[#c6a86b] text-sm uppercase tracking-wider mb-2">Year</p>
              <p className="text-2xl font-bold text-white">{project.year}</p>
            </div>
          )}
          {project.client_name && (
            <div>
              <p className="text-[#c6a86b] text-sm uppercase tracking-wider mb-2">Client</p>
              <p className="text-2xl font-bold text-white">{project.client_name}</p>
            </div>
          )}
          <div>
            <p className="text-[#c6a86b] text-sm uppercase tracking-wider mb-2">Category</p>
            <p className="text-2xl font-bold text-white capitalize">
              {project.category.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Summary */}
        {project.summary && (
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Overview</h2>
            <p className="text-xl text-[#e8e2d9]/80 leading-relaxed">
              {project.summary}
            </p>
          </div>
        )}

        {/* Story */}
        {project.story && (
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Story</h2>
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-lg text-[#e8e2d9]/80 leading-relaxed whitespace-pre-line">
                {project.story}
              </p>
            </div>
          </div>
        )}

        {/* Scope */}
        {project.scope && (
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Scope</h2>
            <p className="text-lg text-[#e8e2d9]/80 leading-relaxed whitespace-pre-line">
              {project.scope}
            </p>
          </div>
        )}

        {/* Materials */}
        {project.materials && (
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Materials & Details</h2>
            <p className="text-lg text-[#e8e2d9]/80 leading-relaxed whitespace-pre-line">
              {project.materials}
            </p>
          </div>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {gallery.map((imageUrl, index) => (
                <div key={index} className="relative h-[400px] overflow-hidden group">
                  <Image
                    src={imageUrl}
                    alt={`${project.name} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center py-20 border-t border-[#c6a86b]/20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Interested in a Similar Project?
          </h2>
          <p className="text-xl text-[#e8e2d9]/80 mb-8">
            Let's discuss how we can bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <LuxuryButton variant="primary">Contact Us</LuxuryButton>
            </Link>
            <Link href="/projects">
              <LuxuryButton variant="outline">View More Projects</LuxuryButton>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
