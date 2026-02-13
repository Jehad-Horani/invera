'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectCard({ project, featured = false }) {
  return (
    <Link href={`/projects/${project.slug}`} className="block">
      <div className={`group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] ${
        featured ? 'h-[600px]' : 'h-[400px]'
      }`}>
        <Image
          src={project.cover_image_url}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500"></div>
        
        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-out">
            <span className="inline-block text-[#c6a86b] text-xs uppercase tracking-[0.2em] font-semibold mb-3 px-3 py-1 bg-black/30 backdrop-blur-sm">
              {project.category.replace('_', ' ')}
            </span>
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-2 leading-tight">
              {project.name}
            </h3>
            {project.location && (
              <p className="text-white/70 text-sm font-medium">
                {project.location} {project.year && `• ${project.year}`}
              </p>
            )}
          </div>
          
          {/* Bottom accent line */}
          <div className="h-[2px] w-0 bg-gradient-to-r from-[#c6a86b] to-[#d4b97a] group-hover:w-full transition-all duration-700 ease-out mt-6"></div>
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[3px] border-r-[3px] border-[#c6a86b] group-hover:w-16 group-hover:h-16 transition-all duration-500 ease-out"></div>
      </div>
    </Link>
  );
}
