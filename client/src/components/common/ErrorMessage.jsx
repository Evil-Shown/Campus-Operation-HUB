<<<<<<< feature/facilities
export default function ErrorMessage({ message }) {
  return (
    <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  )
}
=======
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 shadow-sm"
    >
      <AlertCircle className="shrink-0" size={20} />
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">System Exception</span>
        <p className="text-sm font-bold tracking-tight">{message}</p>
      </div>
    </motion.div>
  );
};

export default ErrorMessage;
>>>>>>> development
