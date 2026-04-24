import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Search, 
  Filter, 
  ShieldAlert, 
  Zap, 
  ArrowUpRight,
  Plus,
  Activity,
  History,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useTickets from '../../hooks/useTickets';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import TicketCard from '../../components/tickets/TicketCard';

export default function TicketListPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { tickets, loading, error } = useTickets();

  const filteredTickets = statusFilter === 'ALL' 
    ? tickets 
    : tickets.filter(t => t.status === statusFilter);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-10"><ErrorMessage message={error} /></div>;

  const stats = {
    critical: tickets.filter(t => t.priority === 'CRITICAL' && t.status !== 'RESOLVED').length,
    open: tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length
  };

  return (
    <div className="space-y-12 pb-24">
      <PageHeader 
        title="Sentinel Terminal" 
        subtitle="Tracking institutional incidents and system exceptions across the grid."
        action={
          <div className="flex gap-4">
             <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl px-6 py-3 shadow-sm">
                <div className="text-right">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Alerts</p>
                   <p className="text-xl font-black text-rose-500 leading-none">{stats.critical}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                   <ShieldAlert size={20} className={stats.critical > 0 ? 'animate-pulse' : ''} />
                </div>
             </div>
             <Link to="/tickets/new">
                <Button icon={Plus}>Report Incident</Button>
             </Link>
          </div>
        }
      />

      <Card className="!p-4 flex flex-col md:flex-row items-center gap-4 bg-white/50 border-slate-100 shadow-lg">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-violet-600 transition-colors" />
          <input
            type="text"
            placeholder="Scan incident logs by description or node identifier..."
            className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:border-violet-200 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-14 bg-white border border-slate-100 rounded-2xl px-6 py-2 text-[11px] font-black uppercase tracking-widest text-slate-500 focus:border-violet-200 outline-none transition-all"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open Incidents</option>
            <option value="IN_PROGRESS">Resolving</option>
            <option value="RESOLVED">Archived</option>
          </select>
          <div className="h-14 w-[1px] bg-slate-100 mx-1 hidden md:block" />
          <Button variant="secondary" icon={History} className="h-14 rounded-2xl">
            Audit
          </Button>
        </div>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-4">
              <div className="h-5 w-1 bg-rose-500 rounded-full" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Institutional Incident Queue</h3>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Normal Ops</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Incident Peak</span>
              </div>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredTickets.length > 0 ? (
            <div className="space-y-4">
              {filteredTickets.map((ticket, i) => (
                <TicketCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  idx={i} 
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={AlertCircle}
              title="Terminal Clear" 
              message="No incident reports matched the current terminal filter. System integrity is at peak levels."
              action={<Button onClick={() => setStatusFilter('ALL')}>Reset Filters</Button>}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Analytics Sub-Surface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-slate-100">
         <Card className="bg-slate-900 !p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Activity size={100} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] font-black text-violet-400 uppercase tracking-[0.4em] mb-6 border-b border-white/5 pb-4">Real-time Resolution Velocity</p>
               <div className="flex items-end gap-3 mb-8">
                  <h4 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">2.4<span className="text-violet-400 text-2xl font-medium italic">hrs</span></h4>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest pb-1 font-bold">Average MTTR</p>
               </div>
               <div className="flex gap-1 h-2">
                  {[4,6,8,5,9,7,10,6,8].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h * 10}%` }}
                      className="flex-1 bg-violet-500/30 group-hover:bg-violet-500 transition-colors rounded-t-sm"
                    />
                  ))}
               </div>
            </div>
         </Card>

         <Card className="!p-10 border-slate-100 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
               <div className="space-y-1">
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">System Compliance</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Institutional Safety Protocol</p>
               </div>
               <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <ShieldAlert size={24} />
               </div>
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase leading-relaxed mb-8">
               98.2% of incidents reported in the last 30 operational cycles have been resolved within the target timeframe. 
               Integrity level: <span className="text-emerald-500">Peak Institutional</span>.
            </p>
            <div className="flex items-center gap-4">
               <Button size="sm" variant="secondary" icon={ArrowUpRight}>Safety Report</Button>
               <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Updated: 4m ago</span>
            </div>
         </Card>
      </div>
    </div>
  );
}
