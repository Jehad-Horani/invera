'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectCard({ project, featured = false }) {
  return (
    <Link href={`/projects/${project.slug}`} className="block group" data-testid={`project-card-${project.slug}`}>
      <div className={`relative overflow-hidden transition-all duration-500 hover:translate-y-[-4px] hover:shadow-[0_8px_40px_rgba(198,168,107,0.12)] ${
        featured ? 'h-[480px]' : 'h-[380px]'
      }`}>
        <Image
          src={project.cover_image_url}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
          <span className="text-[#C6A86B] text-[11px] uppercase tracking-[0.2em] font-bold mb-2">
            {project.category.replace('_', ' ')}
          </span>
          <h3 className="text-[#F5F2EA] text-xl md:text-2xl font-bold mb-2 leading-tight">
            {project.name}
          </h3>
          {project.location && (
            <p className="text-[rgba(245,242,234,0.6)] text-sm">
              {project.location} {project.year && `\u2022 ${project.year}`}
            </p>
          )}

          <div className="h-[2px] w-0 bg-[#C6A86B] group-hover:w-full transition-all duration-500 mt-4" />
        </div>
      </div>
    </Link>
  );
}
