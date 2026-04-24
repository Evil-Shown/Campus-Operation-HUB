import React from 'react';

const Card = ({ children, className = '', hover = true, padding = 'p-6' }) => {
  return (
    <div className={`
      bg-white/80 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl shadow-slate-200/40 
      ${hover ? 'transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] hover:border-violet-100/50' : ''}
      ${padding}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;
