import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  CalendarClock,
  AlertCircle,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  CheckCircle2,
  Activity,
  ShieldCheck,
  Search,
  FileText,
  Loader2,
  RefreshCw,
  Terminal,
  Cpu,
  Globe,
  Database,
  History,
  Info
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import adminApi from '../../api/adminApi';
import resourceApi from '../../api/resourceApi';
import bookingApi from '../../api/bookingApi';
import ticketApi from '../../api/ticketApi';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminStat = ({ icon: Icon, label, value, delta, trend, color, idx }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.1 }}
    className="group"
  >
    <Card className="relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 ${color}/5 blur-3xl -mr-16 -mt-16 group-hover:${color}/10 transition-all`} />
      <div className="flex items-start justify-between relative z-10 mb-8">
        <div className={`h-14 w-14 rounded-2xl ${color}/10 border border-${color.split('-')[1]}-100 flex items-center justify-center text-${color.split('-')[1]}-600 group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
          trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
           {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
           {delta}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1 italic">{label}</p>
        <h3 className="text-4xl font-black text-slate-900 leading-none tracking-tighter uppercase">{value}</h3>
      </div>
    </Card>
  </motion.div>
);

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ resources: [], bookings: [], tickets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [res, bkf, tkt] = await Promise.all([
        resourceApi.listResources(),
        bookingApi.listBookings(),
        ticketApi.listTickets()
      ]);
      setStats({
        resources: res.data || [],
        bookings: bkf.data || [],
        tickets: tkt.data || []
      });
    } catch (err) {
      setError('System: Administrative data bridge failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-10"><ErrorMessage message={error} /></div>;

  const pendingBookings = stats.bookings.filter(b => b.status === 'PENDING').length;
  const criticalTickets = stats.tickets.filter(t => t.priority === 'CRITICAL' && t.status !== 'RESOLVED').length;

  const metrics = [
    { label: 'Grid Assets', value: stats.resources.length, delta: '+2.4%', trend: 'up', icon: Package, color: 'bg-indigo-600' },
    { label: 'Waitlist', value: pendingBookings, delta: '+12.1%', trend: 'up', icon: CalendarClock, color: 'bg-amber-600' },
    { label: 'Active Incidents', value: stats.tickets.filter(t => t.status !== 'RESOLVED').length, delta: '-5.2%', trend: 'down', icon: AlertCircle, color: 'bg-rose-600' },
    { label: 'Managed Nodes', value: '1.4k', delta: '+8.0%', trend: 'up', icon: Globe, color: 'bg-violet-600' },
  ];

  return (
    <div className="space-y-12 pb-24">
      <PageHeader 
        title="Admin Terminal" 
        subtitle="Executing high-level institutional oversight and resource orchestration."
        action={
          <div className="flex gap-4">
             <Button variant="secondary" icon={FileText}>Audit Matrix</Button>
             <Button icon={Activity}>Live Deploy</Button>
          </div>
        }
      />

      {/* Primary Analytics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((m, i) => <AdminStat key={i} {...m} idx={i} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Reservation Queue Terminal */}
        <div className="lg:col-span-8 space-y-10">
          <Card className="!p-0 overflow-hidden shadow-2xl relative border-slate-100">
            <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-10 pointer-events-none grayscale">
               <History size={200} className="-mr-20 -mt-20" />
            </div>
            <div className="bg-slate-900 p-8 flex items-center justify-between text-white border-b border-white/5">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white ring-1 ring-white/10">
                     <CalendarClock size={20} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-[0.3em]">Institutional Reservation Queue</h3>
               </div>
               <Badge className="bg-violet-600 text-white border-none shadow-lg shadow-violet-500/30">Active Refresh</Badge>
            </div>
            
            <div className="overflow-x-auto overflow-y-auto max-h-[500px] scrollbar-refined">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Target Node</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Identity</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Schedule</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats.bookings.slice(0, 10).map((row, i) => (
                    <motion.tr 
                      key={i} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-slate-50 transition-all duration-300 cursor-pointer"
                    >
                      <td className="px-10 py-6">
                         <div className="flex items-center gap-4">
                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-violet-600 shadow-inner group-hover:shadow-sm transition-all italic font-black text-[10px]">
                               {i+1}
                            </div>
                            <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{row.resource?.name || 'Asset Node'}</span>
                         </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex flex-col gap-0.5">
                           <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{row.user?.name || 'Operator'}</span>
                           <span className="text-[9px] font-bold text-slate-400 italic">{row.user?.email}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                         <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-black text-slate-600">{new Date(row.startTime).toLocaleDateString()}</span>
                            <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest">{new Date(row.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         </div>
                      </td>
                      <td className="px-10 py-6">
                         <Badge color={row.status === 'APPROVED' ? 'emerald' : 'amber'}>{row.status}</Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Secondary Modules: Node Topology & Support Pulse */}
        <div className="lg:col-span-4 space-y-10">
           {/* Node Topology */}
           <Card className="!p-10 shadow-xl border-slate-100 flex flex-col justify-between h-[450px]">
              <div>
                 <div className="flex items-center justify-between mb-10">
                    <h4 className="text-[11px] font-black text-violet-600 uppercase tracking-[0.4em] border-b border-violet-100 pb-4">Asset Topology</h4>
                    <Database size={18} className="text-slate-200" />
                 </div>
                 <div className="space-y-8">
                    {[
                      { label: 'Core Infrastructure', value: 82, color: 'bg-indigo-600' },
                      { label: 'Technical Labs', value: 64, color: 'bg-emerald-600' },
                      { label: 'Meeting Hubs', value: 45, color: 'bg-blue-600' }
                    ].map((item, i) => (
                      <div key={i} className="group cursor-pointer">
                         <div className="flex items-center justify-between mb-3 px-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                            <span className="text-sm font-black text-slate-900">{item.value}%</span>
                         </div>
                         <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden p-[1px]">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${item.value}%` }}
                               transition={{ duration: 1.5, delay: i * 0.2 }}
                               className={`h-full ${item.color} rounded-full shadow-lg group-hover:brightness-110 transition-all`}
                            />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="p-6 rounded-3xl bg-slate-900 text-white flex items-center justify-between group hover:shadow-2xl transition-all duration-700 cursor-pointer">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                       <Zap size={20} className="text-violet-400" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Optimize Grid</p>
                       <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest italic">Run heuristic audit</p>
                    </div>
                 </div>
                 <ArrowUpRight size={18} className="text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
           </Card>

           {/* Support Sentinel Pulse */}
           <Card className="bg-rose-600 !p-10 text-white shadow-2xl relative overflow-hidden group h-[400px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-8 text-white opacity-10">
                 <Terminal size={140} className="grayscale" />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Support Alpha</h3>
                    <Badge className="bg-white/20 text-white border-white/20 backdrop-blur-md shadow-lg">{criticalTickets} Critical</Badge>
                 </div>
                 <div className="space-y-4">
                    {stats.tickets.slice(0, 3).map((t, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between group/ticket hover:bg-white/20 transition-all">
                         <div className="flex items-center gap-4">
                            <AlertCircle size={16} className={t.priority === 'CRITICAL' ? 'text-rose-200 animate-pulse' : 'text-white/40'} />
                            <span className="text-[11px] font-black truncate max-w-[150px] uppercase tracking-widest">{t.title}</span>
                         </div>
                         <ArrowRight size={14} className="opacity-0 group-hover/ticket:opacity-100 group-hover/ticket:translate-x-1 transition-all" />
                      </div>
                    ))}
                 </div>
              </div>
              <Link to="/tickets">
                 <button className="relative z-10 w-full h-16 rounded-2xl bg-white text-slate-900 text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl hover:translate-y-[-4px] transition-all duration-300">
                    Sentinel Matrix
                 </button>
              </Link>
           </Card>
        </div>
      </div>
    </div>
  );
}
