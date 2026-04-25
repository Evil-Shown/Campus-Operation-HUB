import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, ChevronRight, MessageSquare, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';

const TicketCard = ({ ticket, idx }) => {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'CRITICAL': return 'rose';
      case 'HIGH': return 'amber';
      case 'MEDIUM': return 'blue';
      case 'LOW': return 'emerald';
      default: return 'slate';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'OPEN': return 'rose';
      case 'IN_PROGRESS': return 'blue';
      case 'RESOLVED': return 'emerald';
      default: return 'slate';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group"
    >
      <Link to={`/tickets/${ticket.id}`}>
        <Card className="hover:border-violet-100 transition-all duration-300 shadow-lg hover:shadow-2xl !p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                ticket.priority === 'CRITICAL' ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
              }`}>
                {ticket.priority === 'CRITICAL' ? <ShieldAlert size={28} className="animate-pulse" /> : <AlertCircle size={28} />}
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge color={getPriorityColor(ticket.priority)} animate={ticket.priority === 'CRITICAL'}>
                    {ticket.priority} Priority
                  </Badge>
                  <Badge color={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                  <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">/ Node-LOG-{ticket.id}</span>
                </div>
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-violet-600 transition-colors">
                  {ticket.title || 'Institutional System Incident'}
                </h4>
                <div className="flex items-center gap-6">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Clock size={14} className="text-violet-500" /> Detected: {new Date(ticket.createdAt).toLocaleDateString()}
                   </p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <MessageSquare size={14} className="text-violet-500" /> {ticket.commentCount || 0} Telemetry Logs
                   </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Sentinel Assigned</p>
                  <p className="text-xs font-black text-slate-900 uppercase">{ticket.assignedTo || 'Unassigned Auto-Router'}</p>
               </div>
               <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm">
                  <ChevronRight size={24} />
               </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default TicketCard;
