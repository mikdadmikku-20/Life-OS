import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#C5FF62] text-[#050605] font-semibold hover:bg-[#D5FF8D] active:scale-[0.985] shadow-[0_0_24px_rgba(0,255,120,0.18)] disabled:opacity-45 disabled:pointer-events-none',
  secondary:
    'bg-[#111411] text-[#F5F7F2] font-medium border border-[#30372F] hover:border-[rgba(0,255,120,0.48)] hover:bg-[#191D19] active:scale-[0.985] disabled:opacity-45 disabled:pointer-events-none',
  ghost:
    'bg-transparent text-[#F5F7F2]/85 font-medium hover:text-[#C5FF62] active:opacity-80 disabled:opacity-45 disabled:pointer-events-none',
};

const sizeClasses: Record<ButtonSize, string> = {
  md: 'min-h-[44px] px-5 py-2.5 text-sm',
  lg: 'min-h-[48px] px-7 py-3 text-[15px]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full whitespace-nowrap shrink-0 cursor-pointer transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
