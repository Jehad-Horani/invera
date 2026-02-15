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
  const sizeMap = {
    sm: 'px-6 py-2.5 text-[11px]',
    md: 'px-8 py-3.5 text-xs',
    lg: 'px-10 py-4 text-xs',
  };

  const variantMap = {
    primary: 'bg-[#C6A86B] text-black font-bold hover:bg-[#D7BC7A] shadow-lg hover:shadow-xl',
    secondary: 'bg-transparent border-2 border-[#C6A86B] text-[#C6A86B] font-bold hover:bg-[#C6A86B] hover:text-black',
    ghost: 'bg-white/5 border border-white/15 text-[#F5F2EA] font-bold hover:bg-white/10',
    white: 'bg-white text-black font-bold hover:bg-[#F5F2EA] shadow-lg',
    outline: 'bg-transparent border border-[#C6A86B] text-[#C6A86B] font-bold hover:bg-[#C6A86B]/10',
  };

  const base = 'inline-flex items-center justify-center uppercase tracking-widest cursor-pointer transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizeClass = sizeMap[size] || sizeMap.md;
  const variantClass = variantMap[variant] || variantMap.primary;

  const Component = href ? 'a' : 'button';

  return (
    <Component
      href={href}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${base} ${sizeClass} ${variantClass} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2 font-bold">
        {children}
      </span>
    </Component>
  );
}
