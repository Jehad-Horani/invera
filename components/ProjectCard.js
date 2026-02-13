'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectCard({ project, featured = false }) {
  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <div className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
        featured ? 'h-[500px]' : 'h-[400px]'
      }`}>
        <Image
          src={project.cover_image_url}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
        
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <span className="text-[#c6a86b] text-xs uppercase tracking-wider font-bold mb-2">
            {project.category.replace('_', ' ')}
          </span>
          <h3 className="text-white text-2xl font-bold mb-2 leading-tight">
            {project.name}
          </h3>
          {project.location && (
            <p className="text-white/70 text-sm">
              {project.location} {project.year && `• ${project.year}`}
            </p>
          )}
          
          <div className="h-1 w-0 bg-[#c6a86b] group-hover:w-full transition-all duration-500 mt-4"></div>
        </div>
      </div>
    </Link>
  );
}
