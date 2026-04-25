import React from 'react';
import { Server } from 'lucide-react';

const LoadingSpinner = ({ fullPage = true }) => {
  const content = (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
        <Server className="h-12 w-12 text-indigo-600 animate-bounce relative z-10" />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 animate-pulse">Syncing Grid</p>
        <div className="h-0.5 w-24 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
          <div className="absolute h-full w-1/3 bg-indigo-600 rounded-full animate-[loading_1.5s_infinite_ease-in-out]" />
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading {
          0% { left: -30%; }
          100% { left: 100%; }
        }
      `}} />
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      {content}
    </div>
  );
};

export default LoadingSpinner;
