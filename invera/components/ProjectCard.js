'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectCard({ project, featured = false }) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <div className={`group relative overflow-hidden cursor-pointer ${
        featured ? 'h-[600px]' : 'h-[400px]'
      }`}>
        <Image
          src={project.cover_image_url}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <span className="text-[#c6a86b] text-xs uppercase tracking-wider mb-2 block">
              {project.category.replace('_', ' ')}
            </span>
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">
              {project.name}
            </h3>
            {project.location && (
              <p className="text-white/70 text-sm">
                {project.location} • {project.year}
              </p>
            )}
          </div>
          
          <div className="h-1 w-0 bg-[#c6a86b] group-hover:w-full transition-all duration-500 mt-4"></div>
        </div>
      </div>
    </Link>
  );
}
