import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home, Terminal, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 overflow-hidden relative">
      {/* Background Anomalies */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-600/20 blur-[150px] rounded-full animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center space-y-12"
      >
        <div className="flex flex-col items-center gap-6">
           <div className="h-24 w-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-rose-500 shadow-2xl relative group">
              <div className="absolute inset-0 bg-rose-500/20 blur-2xl group-hover:bg-rose-500/40 transition-all" />
              <ShieldAlert size={48} className="relative z-10" />
           </div>
           <h1 className="text-[120px] font-black text-white leading-none tracking-tighter uppercase opacity-10">404</h1>
        </div>

        <div className="space-y-4">
           <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Node Desynchronization.</h2>
           <p className="text-xl font-bold text-white/40 uppercase tracking-[0.2em] italic max-w-lg mx-auto">
              The requested grid coordinate does not exist within the current institutional matrix.
           </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
           <Link to={-1}>
              <button className="h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-slate-900 transition-all flex items-center gap-4">
                 <ArrowLeft size={18} /> Terminal Backstep
              </button>
           </Link>
           <Link to="/dashboard">
              <button className="h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-slate-900 transition-all flex items-center gap-4">
                 <Home size={18} /> Return to Command
              </button>
           </Link>
        </div>

        <div className="pt-24 flex items-center justify-center gap-10 opacity-20">
           <div className="flex items-center gap-3 text-[10px] font-black text-white uppercase tracking-[0.4em]">
              <Terminal size={14} /> ERR_NODE_NOT_FOUND
           </div>
           <div className="flex items-center gap-3 text-[10px] font-black text-white uppercase tracking-[0.4em]">
              <Zap size={14} /> SIGNAL_LOST
           </div>
        </div>
      </motion.div>
    </div>
  );
}
