export default function SectionHeading({ subtitle, title, align = 'center', className = '' }) {
  const alignmentClasses = {
    center: 'text-center items-center',
    left: 'text-left items-start',
    right: 'text-right items-end',
  };

  return (
    <div className={`mb-16 flex flex-col ${alignmentClasses[align]} ${className}`}>
      {subtitle && (
        <p className="text-[#c6a86b] uppercase tracking-[0.25em] text-xs font-semibold mb-4 transition-colors duration-300">
          {subtitle}
        </p>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 transition-all duration-300">
        {title}
      </h2>
      <div className="h-[2px] w-20 bg-gradient-to-r from-[#c6a86b] to-[#d4b97a] transition-all duration-500"></div>
    </div>
  );
}
