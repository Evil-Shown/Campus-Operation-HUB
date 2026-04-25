import React from 'react';
import { Box } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({ 
  icon: Icon = Box, 
  title = "No results found", 
  message = "Your search signal returned no active nodes in the grid.",
  action 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 px-6 border-4 border-dashed border-slate-100 rounded-[4rem] bg-slate-50/30 text-center"
    >
      <div className="h-24 w-24 rounded-3xl bg-white shadow-xl flex items-center justify-center text-slate-100 mb-8 border border-slate-50">
        <Icon size={48} />
      </div>
      <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">{title}</h3>
      <p className="text-sm font-bold text-slate-400 max-w-sm mb-10 leading-relaxed uppercase tracking-[0.1em]">{message}</p>
      {action && (
        <div className="animate-in fade-in zoom-in duration-500 delay-300">
          {action}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
