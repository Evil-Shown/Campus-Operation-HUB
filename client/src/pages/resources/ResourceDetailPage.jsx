import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  MapPin, 
  Activity, 
  Clock, 
  ChevronLeft,
  CalendarCheck,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Info,
  Server,
  Terminal,
  Layers,
  Cpu
} from 'lucide-react';
import resourceApi from '../../api/resourceApi';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function ResourceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const response = await resourceApi.getResource(id);
        setResource(response.data);
      } catch (err) {
        setError('Failed to retrieve resource metadata from the grid.');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error || !resource) return <div className="p-10"><ErrorMessage message={error || 'Resource not found.'} /></div>;

  const specs = [
    { label: 'Asset Classification', value: resource.type.replace(/_/g, ' '), icon: Building2 },
    { label: 'Personnel Capacity', value: `${resource.capacity} Authorized Users`, icon: Users },
    { label: 'Geospatial Sector', value: resource.location, icon: MapPin },
    { label: 'Operational Status', value: resource.status, icon: Activity },
    { label: 'Availability Window', value: resource.availability || 'Weekdays 08:00 - 17:00', icon: Clock },
  ];

  return (
    <div className="space-y-10 pb-24 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 group text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-violet-600 transition-all"
      >
        <div className="h-8 w-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:border-violet-100 group-hover:bg-violet-50 transition-all">
          <ChevronLeft size={16} />
        </div>
        Return to Matrix
      </button>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
        <div className="flex items-center gap-8">
          <div className="h-20 w-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/40 to-transparent" />
             <Server size={32} className="relative z-10 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <Badge color="violet" animate>Institutional Asset</Badge>
               <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Node ID: {resource.id}</span>
            </div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">{resource.name}</h1>
          </div>
        </div>

        <Link to={`/bookings/new/${resource.id}`}>
          <Button size="lg" icon={CalendarCheck} className="shadow-2xl">
            Register Protocol
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Node */}
        <div className="lg:col-span-8 space-y-10">
          <Card className="!p-0 overflow-hidden shadow-2xl">
             <div className="h-80 bg-gradient-to-br from-slate-900 to-slate-800 relative group">
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="relative">
                      <div className="absolute -inset-20 bg-violet-600/10 blur-3xl animate-pulse" />
                      <Layers size={140} className="text-white/5 relative z-10 group-hover:scale-105 transition-transform duration-1000" />
                   </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/60 to-transparent">
                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em] mb-2">Live Telemetry Link Active</p>
                   <h2 className="text-2xl font-black text-white uppercase tracking-widest">Asset Visual Overdrive</h2>
                </div>
             </div>
             <div className="p-12 space-y-10">
                <div className="flex items-start gap-8">
                   <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                      <Info size={24} />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Functional Profile</h3>
                      <p className="text-slate-500 text-lg leading-relaxed italic border-l-4 border-slate-100 pl-8">
                        {resource.description || `This academic facility is optimized for technical operations and collaborative research. 
                        Equipped with high-performance computing units and localized environmental controls. 
                        Usage during synchronization windows requires institutional authorization protocol.`}
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                   {[
                     { label: 'Fiber Link', icon: Zap },
                     { label: 'UHD Display', icon: Monitor },
                     { label: 'Biometrics', icon: ShieldCheck },
                     { label: 'HVAC Sys', icon: Activity }
                   ].map((feat, i) => (
                     <div key={i} className="p-6 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 flex flex-col items-center gap-4 group/item hover:bg-white hover:shadow-xl transition-all duration-500">
                        <feat.icon size={24} className="text-slate-300 group-hover/item:text-violet-600 group-hover/item:scale-110 transition-all" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{feat.label}</span>
                     </div>
                   ))}
                </div>
             </div>
          </Card>
        </div>

        {/* Technical Specification Matrix */}
        <div className="lg:col-span-4 space-y-10">
          <Card className="bg-slate-50/50 border-slate-100 shadow-xl overflow-hidden p-10 relative">
            <div className="absolute top-0 right-0 p-4">
               <Terminal size={100} className="text-slate-100 -mr-10 -mt-10 grayscale opacity-20" />
            </div>
            <h4 className="text-[11px] font-black text-violet-600 uppercase tracking-[0.4em] mb-10 border-b border-violet-100 pb-4">Tech Specs Matrix</h4>
            
            <div className="space-y-8">
              {specs.map((spec, i) => (
                <motion.div 
                  key={spec.label} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center gap-3 mb-2 opacity-40 group-hover:opacity-100 transition-opacity">
                    <spec.icon size={14} className="text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{spec.label}</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-widest pl-7">{spec.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 pt-10 border-t border-slate-100/50">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                     <Cpu size={16} className="text-violet-500" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Health</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">98.4% Nominal</span>
               </div>
               <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "98.4%" }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  />
               </div>
            </div>
          </Card>

          <Card className="bg-slate-900 p-10 text-white relative overflow-hidden group cursor-pointer hover:shadow-violet-500/20 transition-all duration-500">
             <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/20 blur-3xl -mr-16 -mt-16 group-hover:bg-violet-600/40 transition-all" />
             <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-white ring-1 ring-white/10 group-hover:scale-110 transition-transform">
                   <Activity size={24} />
                </div>
                <div>
                   <h4 className="text-sm font-black uppercase tracking-widest mb-2">Initialize Diagnostics</h4>
                   <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">Request system status report <br /> and availability audit.</p>
                </div>
                <ArrowUpRight size={20} className="text-white/20 group-hover:text-white group-hover:translate-x-2 group-hover:-translate-y-2 transition-all" />
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
