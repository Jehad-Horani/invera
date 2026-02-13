'use client';

export default function LuxuryButton({ 
  children, 
  onClick, 
  href, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-[0.15em] transition-all duration-300 ease-out relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const sizes = {
    sm: "px-6 py-2.5 text-xs",
    md: "px-8 py-4 text-[13px]",
    lg: "px-10 py-5 text-sm",
  };

  const variants = {
    primary: `
      bg-gradient-to-r from-[#c6a86b] to-[#d4b97a] text-white font-bold
      hover:shadow-lg hover:shadow-[#c6a86b]/30 hover:scale-[1.02]
      active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#c6a86b] focus-visible:ring-offset-2 focus-visible:ring-offset-black
      disabled:hover:scale-100 disabled:hover:shadow-none
    `,
    secondary: `
      bg-transparent border-2 border-[#c6a86b] text-[#c6a86b]
      hover:bg-[#c6a86b] hover:text-black hover:shadow-md hover:shadow-[#c6a86b]/20 hover:scale-[1.02]
      active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#c6a86b] focus-visible:ring-offset-2 focus-visible:ring-offset-black
      disabled:hover:bg-transparent disabled:hover:text-[#c6a86b] disabled:hover:scale-100
    `,
    ghost: `
      bg-transparent text-white/80 border border-white/20
      hover:text-white hover:border-white/40 hover:bg-white/5
      active:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black
      disabled:hover:text-white/80 disabled:hover:border-white/20 disabled:hover:bg-transparent
    `,
    white: `
      bg-white text-black font-bold
      hover:bg-[#e8e2d9] hover:shadow-md hover:scale-[1.02]
      active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black
      disabled:hover:bg-white disabled:hover:scale-100
    `,
  };

  const Component = href ? 'a' : 'button';

  return (
    <Component
      href={href}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      
      {/* Shine effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></span>
    </Component>
  );
}
