import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  disabled = false,
  icon: Icon,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:scale-100';
  
  const variants = {
    primary: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:from-violet-500 hover:to-indigo-500',
    secondary: 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300',
    outline: 'bg-transparent text-violet-600 border border-violet-200 hover:bg-violet-50 hover:border-violet-300',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    danger: 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 hover:bg-rose-600 hover:shadow-rose-500/40',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-lg gap-1.5',
    md: 'px-6 py-3 text-sm rounded-xl gap-2',
    lg: 'px-8 py-4 text-base rounded-2xl gap-2.5',
    icon: 'p-2.5 rounded-xl',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} />}
      <span>{children}</span>
    </button>
  );
};

export default Button;
