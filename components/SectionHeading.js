export default function SectionHeading({ subtitle, title, align = 'center', className = '' }) {
  const alignClasses = {
    center: 'text-center mx-auto',
    left: 'text-left',
    right: 'text-right ml-auto',
  };

  return (
    <div className={`mb-16 max-w-3xl ${alignClasses[align]} ${className}`}>
      {subtitle && (
        <p className="text-[#c6a86b] uppercase tracking-widest text-xs font-bold mb-4">
          {subtitle}
        </p>
      )}
      <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
        {title}
      </h2>
      <div className={`h-1 w-20 bg-[#c6a86b] ${align === 'center' ? 'mx-auto' : ''}`}></div>
    </div>
  );
}
