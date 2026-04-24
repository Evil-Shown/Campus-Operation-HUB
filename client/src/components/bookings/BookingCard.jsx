import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowRight, Monitor, Trash2, CheckCircle, Clock3 } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

const BookingCard = ({ booking, idx, onCancel }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'APPROVED':
      case 'CONFIRMED': return 'emerald';
      case 'PENDING': return 'amber';
      case 'REJECTED': 
      case 'CANCELLED': return 'rose';
      default: return 'slate';
    }
  };

  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group"
    >
      <Card className="hover:border-violet-100 transition-all duration-300 shadow-lg hover:shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500 shadow-inner overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
               <Monitor size={32} className="relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5 px-0.5">
                 <Badge color={getStatusColor(booking.status)} animate={booking.status === 'PENDING'}>
                    {booking.status}
                 </Badge>
                 <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">/ Matrix-BK-{booking.id}</span>
              </div>
              <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">
                {booking.resource?.name || 'Institutional Asset'}
              </h4>
              <p className="text-xs font-bold text-slate-400 flex items-center gap-2 italic">
                 <MapPin size={14} className="text-violet-500" /> {booking.resource?.location || 'Grid Node'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-10">
            <div className="text-left md:text-right space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-start md:justify-end gap-2">
                 <Calendar size={12} className="text-violet-500" /> Operational Date
               </p>
               <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                 {startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
               </p>
            </div>

            <div className="text-left md:text-right space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-start md:justify-end gap-2">
                 <Clock size={12} className="text-violet-500" /> Time Window
               </p>
               <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                 {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </p>
            </div>

            <div className="h-10 w-[1px] bg-slate-100 hidden xl:block" />

            <div className="flex items-center gap-3">
               {onCancel && booking.status !== 'CANCELLED' && booking.status !== 'REJECTED' && (
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   icon={Trash2} 
                   onClick={() => onCancel(booking.id)}
                   className="text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                 >
                   Cancel
                 </Button>
               )}
               <Button size="sm" variant="secondary" icon={ArrowRight}>
                 Monitor
               </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BookingCard;
