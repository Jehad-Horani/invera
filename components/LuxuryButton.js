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
  const baseStyles = `
    inline-flex items-center justify-center
    font-bold uppercase tracking-[0.12em]
    transition-all duration-300 ease-out
    cursor-pointer
    relative overflow-hidden
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    active:scale-[0.97]
  `;

  const sizes = {
    sm: 'px-6 py-2.5 text-[11px]',
    md: 'px-8 py-3.5 text-xs',
    lg: 'px-10 py-4 text-xs',
  };

  const variants = {
    primary: `
      bg-[#C6A86B] text-black
      shadow-[0_4px_20px_rgba(198,168,107,0.25)]
      hover:bg-[#D7BC7A]
      hover:shadow-[0_6px_28px_rgba(198,168,107,0.35)]
      hover:translate-y-[-1px]
    `,
    secondary: `
      bg-transparent
      border-2 border-[#C6A86B] text-[#C6A86B]
      hover:bg-[#C6A86B] hover:text-black
      hover:shadow-[0_4px_20px_rgba(198,168,107,0.2)]
      hover:translate-y-[-1px]
    `,
    ghost: `
      bg-[rgba(255,255,255,0.04)]
      border border-[rgba(245,242,234,0.15)]
      text-[#F5F2EA]
      hover:bg-[rgba(255,255,255,0.08)]
      hover:border-[rgba(245,242,234,0.25)]
      hover:translate-y-[-1px]
    `,
    white: `
      bg-white text-black
      shadow-[0_4px_16px_rgba(255,255,255,0.15)]
      hover:bg-[#F5F2EA]
      hover:translate-y-[-1px]
    `,
    outline: `
      bg-transparent
      border border-[#C6A86B] text-[#C6A86B]
      hover:bg-[rgba(198,168,107,0.08)]
      hover:translate-y-[-1px]
    `,
  };

  const Component = href ? 'a' : 'button';

  return (
    <Component
      href={href}
      onClick={onClick}
      disabled={disabled}
      type={type}
      data-testid={props['data-testid'] || undefined}
      className={`${baseStyles} ${sizes[size]} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2 font-bold">
        {children}
      </span>
    </Component>
  );
}
