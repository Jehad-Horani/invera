export default function SectionHeading({ subtitle, title, align = 'center' }) {
  return (
    <div className={`mb-16 ${align === 'center' ? 'text-center' : ''}`}>
      {subtitle && (
        <p className="text-[#c6a86b] uppercase tracking-[0.2em] text-sm font-medium mb-4">
          {subtitle}
        </p>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
        {title}
      </h2>
      <div className={`h-1 w-24 bg-[#c6a86b] mt-6 ${align === 'center' ? 'mx-auto' : ''}`}></div>
    </div>
  );
}
