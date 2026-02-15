import { supabaseServer } from '@/lib/supabaseServer';
import Image from 'next/image';
import Link from 'next/link';
import LuxuryButton from '@/components/LuxuryButton';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const { data } = await supabaseServer
      .from('projects')
      .select('name, summary')
      .eq('slug', slug)
      .maybeSingle();

    return {
      title: data ? `${data.name} | INVERA` : 'Project | INVERA',
      description: data?.summary || 'INVERA project details',
    };
  } catch {
    return {
      title: 'Project | INVERA',
      description: 'INVERA project details',
    };
  }
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;

  let project = null;
  let fetchError = null;

  try {
    const { data, error } = await supabaseServer
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      fetchError = error.message;
    } else {
      project = data;
    }
  } catch (err) {
    fetchError = err?.message || 'Unknown error';
  }

  if (!project) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-[#0B0B0B] flex items-center justify-center" data-testid="project-not-found">
        <div className="text-center max-w-md mx-auto px-5">
          <h1 className="text-4xl font-bold text-[#F5F2EA] mb-4">Project Not Found</h1>
          <p className="text-[rgba(245,242,234,0.6)] mb-8 text-sm">
            The project &ldquo;{slug}&rdquo; could not be found. It may have been removed or the URL may be incorrect.
          </p>
          <Link href="/projects">
            <LuxuryButton variant="outline" data-testid="back-to-projects-btn">Back to Projects</LuxuryButton>
          </Link>
        </div>
      </main>
    );
  }

  const gallery = Array.isArray(project.gallery) ? project.gallery : [];

  return (
    <main className="min-h-screen bg-[#0B0B0B]" data-testid="project-detail-page">
      {/* Hero Cover */}
      <div className="relative h-[65vh] min-h-[400px]">
        <Image
          src={project.cover_image_url}
          alt={project.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 max-w-[1200px] mx-auto px-5 lg:px-8 pb-12">
          <span className="text-[#C6A86B] text-xs uppercase tracking-[0.2em] font-bold mb-3 block">
            {project.category?.replace('_', ' ')}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#F5F2EA] mb-3" data-testid="project-title">
            {project.name}
          </h1>
          {project.location && (
            <p className="text-lg text-[rgba(245,242,234,0.7)]">
              {project.location} {project.year && `\u2022 ${project.year}`}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        {/* Meta Data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 mb-12 border-b border-[rgba(198,168,107,0.15)]" data-testid="project-meta">
          {project.area_sqm && (
            <div>
              <p className="text-[#C6A86B] text-xs uppercase tracking-[0.15em] font-bold mb-2">Area</p>
              <p className="text-xl font-bold text-[#F5F2EA]">{project.area_sqm.toLocaleString()} SQM</p>
            </div>
          )}
          {project.year && (
            <div>
              <p className="text-[#C6A86B] text-xs uppercase tracking-[0.15em] font-bold mb-2">Year</p>
              <p className="text-xl font-bold text-[#F5F2EA]">{project.year}</p>
            </div>
          )}
          {project.client_name && (
            <div>
              <p className="text-[#C6A86B] text-xs uppercase tracking-[0.15em] font-bold mb-2">Client</p>
              <p className="text-xl font-bold text-[#F5F2EA]">{project.client_name}</p>
            </div>
          )}
          <div>
            <p className="text-[#C6A86B] text-xs uppercase tracking-[0.15em] font-bold mb-2">Category</p>
            <p className="text-xl font-bold text-[#F5F2EA] capitalize">
              {project.category?.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Summary */}
        {project.summary && (
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#F5F2EA] mb-5">Overview</h2>
            <p className="text-lg text-[rgba(245,242,234,0.72)] leading-relaxed max-w-3xl">
              {project.summary}
            </p>
          </div>
        )}

        {/* Story */}
        {project.story && (
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#F5F2EA] mb-5">The Story</h2>
            <p className="text-base text-[rgba(245,242,234,0.72)] leading-relaxed whitespace-pre-line max-w-3xl">
              {project.story}
            </p>
          </div>
        )}

        {/* Scope */}
        {project.scope && (
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#F5F2EA] mb-5">Scope</h2>
            <p className="text-base text-[rgba(245,242,234,0.72)] leading-relaxed whitespace-pre-line max-w-3xl">
              {project.scope}
            </p>
          </div>
        )}

        {/* Materials */}
        {project.materials && (
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#F5F2EA] mb-5">Materials & Details</h2>
            <p className="text-base text-[rgba(245,242,234,0.72)] leading-relaxed whitespace-pre-line max-w-3xl">
              {project.materials}
            </p>
          </div>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#F5F2EA] mb-10">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gallery.map((imageUrl, index) => (
                <div key={index} className="relative h-[350px] overflow-hidden group">
                  <Image
                    src={imageUrl}
                    alt={`${project.name} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center py-20 lg:py-28 border-t border-[rgba(198,168,107,0.15)]" data-testid="project-detail-cta">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5F2EA] mb-5">
            Interested in a Similar Project?
          </h2>
          <p className="text-lg text-[rgba(245,242,234,0.72)] mb-8 mx-auto max-w-lg">
            Let&apos;s discuss how we can bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <LuxuryButton variant="primary" data-testid="project-cta-contact">Contact Us</LuxuryButton>
            </Link>
            <Link href="/projects">
              <LuxuryButton variant="outline" data-testid="project-cta-more">View More Projects</LuxuryButton>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
