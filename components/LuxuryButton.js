'use client';

export default function LuxuryButton({ children, onClick, href, variant = 'primary', className = '', ...props }) {
  const baseStyles = "px-8 py-4 rounded-none uppercase tracking-wider text-sm font-bold transition-all duration-300 relative overflow-hidden group";
  
  const variants = {
    primary: "bg-[#c6a86b] text-black hover:bg-[#d4b97a] hover:shadow-lg hover:shadow-[#c6a86b]/50",
    outline: "border-2 border-[#c6a86b] text-[#c6a86b] hover:bg-[#c6a86b] hover:text-black",
    white: "bg-white text-black hover:bg-[#e8e2d9]"
  };

  const Component = href ? 'a' : 'button';

  return (
    <Component
      href={href}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
    </Component>
  );
}
