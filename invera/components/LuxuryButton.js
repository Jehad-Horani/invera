'use client';

export default function LuxuryButton({ 
  children, 
  onClick, 
  href, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ...props 
}) {
  // Base styles that make it LOOK like a button
  const baseStyles = `
    inline-flex items-center justify-center
    font-bold uppercase tracking-wider
    transition-all duration-300 ease-out
    cursor-pointer
    relative overflow-hidden
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    shadow-md hover:shadow-xl
    active:scale-95
    border-0
  `;
  
  const sizes = {
    sm: "px-6 py-2.5 text-xs rounded-md",
    md: "px-8 py-3.5 text-sm rounded-lg",
    lg: "px-10 py-4 text-sm rounded-lg",
  };

  const variants = {
    primary: `
      bg-gradient-to-r from-[#c6a86b] to-[#d4b97a] 
      text-black
      shadow-[#c6a86b]/30
      hover:shadow-[#c6a86b]/50 
      hover:scale-105
      hover:from-[#d4b97a] hover:to-[#c6a86b]
    `,
    secondary: `
      bg-transparent 
      border-2 border-[#c6a86b] 
      text-[#c6a86b]
      hover:bg-[#c6a86b] 
      hover:text-black
      hover:scale-105
      hover:shadow-[#c6a86b]/40
    `,
    ghost: `
      bg-white/5 
      border border-white/20
      text-white
      hover:bg-white/10 
      hover:border-white/30
      hover:scale-105
    `,
    white: `
      bg-white 
      text-black
      shadow-white/20
      hover:bg-[#e8e2d9]
      hover:scale-105
    `,
  };

  const Component = href ? 'a' : 'button';

  return (
    <Component
      href={href}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2 font-semibold">
        {children}
      </span>
      
      {/* Shine effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
    </Component>
  );
}
