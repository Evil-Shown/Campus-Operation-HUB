import React from 'react';

const colors = {
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5',
  amber: 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-500/5',
  rose: 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-500/5',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-500/5',
  violet: 'bg-violet-50 text-violet-600 border-violet-100 shadow-violet-500/5',
  slate: 'bg-slate-100 text-slate-600 border-slate-200 shadow-slate-500/5',
  blue: 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-500/5',
};

const Badge = ({ children, color = 'slate', className = '', animate = false }) => {
  return (
    <span className={`
      inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest
      ${colors[color] || colors.slate}
      ${className}
    `}>
      <div className={`h-1.5 w-1.5 rounded-full bg-current ${animate ? 'animate-pulse' : 'opacity-60'}`} />
      {children}
    </span>
  );
};

export default Badge;
