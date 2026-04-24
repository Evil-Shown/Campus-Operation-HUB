import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-indigo-100">
      {/* Sidebar - Institutional Fixed Node */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar - Command Floating Bar */}
        <Navbar />
        
        {/* Unified Command Surface */}
        <main className="flex-1 p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>

        {/* Global Footer Identifier */}
        <footer className="p-8 border-t border-slate-100 flex items-center justify-between opacity-40">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">© 2026 SmartCampus Network • Institutional Operations Grid</p>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">v2.0.4 r-sys-node</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
