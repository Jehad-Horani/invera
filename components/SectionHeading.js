export default function SectionHeading({ subtitle, title, align = 'center', className = '' }) {
  const alignClasses = {
    center: 'text-center mx-auto',
    left: 'text-left',
    right: 'text-right ml-auto',
  };

  return (
    <div className={`mb-16 max-w-3xl ${alignClasses[align]} ${className}`} data-testid="section-heading">
      {subtitle && (
        <p className="text-[#C6A86B] uppercase tracking-[0.25em] text-xs font-bold mb-4">
          {subtitle}
        </p>
      )}
      <h2 className="text-4xl md:text-5xl font-bold text-[#F5F2EA] leading-tight mb-6">
        {title}
      </h2>
      <div className={`h-[2px] w-16 bg-[#C6A86B] ${align === 'center' ? 'mx-auto' : ''}`} />
    </div>
  );
}
