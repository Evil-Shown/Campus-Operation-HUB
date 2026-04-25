import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  MapPin, 
  Search, 
  Filter, 
  ArrowUpRight,
  Zap,
  Package,
  Layers,
  Monitor,
  Video,
  Database
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useResources from '../../hooks/useResources';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const ResourceCard = ({ resource, idx }) => {
  const getGradient = (type) => {
    switch(type) {
      case 'LECTURE_HALL': return 'from-violet-600 to-indigo-600';
      case 'LAB': return 'from-emerald-600 to-teal-600';
      case 'MEETING_ROOM': return 'from-blue-600 to-cyan-600';
      default: return 'from-slate-700 to-slate-900';
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'LECTURE_HALL': return Video;
      case 'LAB': return Monitor;
      case 'MEETING_ROOM': return Layers;
      default: return Package;
    }
  };

  const Icon = getIcon(resource.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <div className="overflow-hidden h-full flex flex-col hover:border-violet-200 transition-all duration-500 shadow-2xl shadow-slate-200/40 rounded-3xl border border-slate-100 bg-white">
        <div className={`h-40 bg-gradient-to-br ${getGradient(resource.type)} relative overflow-hidden p-8`}>
          <div className="absolute top-0 right-0 p-6">
            <Badge 
              color={resource.status === 'ACTIVE' ? 'emerald' : 'rose'} 
              animate={resource.status === 'ACTIVE'}
              className="bg-white/20 text-white border-white/20 backdrop-blur-md"
            >
              {resource.status === 'ACTIVE' ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000 grayscale select-none">
            <Icon size={200} />
          </div>
          <div className="relative z-10 flex flex-col justify-end h-full">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-2">ASST-{resource.id.toString().padStart(4, '0')}</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{resource.name}</h3>
          </div>
        </div>

        <div className="p-8 flex-1 flex flex-col gap-8 bg-white">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Building2 size={12} className="text-violet-500" /> Infrastructure
              </p>
              <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">
                {resource.type.replace(/_/g, ' ')}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Users size={12} className="text-violet-500" /> Max Capacity
              </p>
              <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
                {resource.capacity} Elements
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={12} className="text-violet-500" /> Geospatial Node
            </p>
            <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
              {resource.location}
            </p>
          </div>

          <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="h-8 w-8 rounded-xl bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-300">
                    {i}
                 </div>
               ))}
               <div className="h-8 px-3 rounded-xl bg-violet-50 border-2 border-white flex items-center justify-center text-[9px] font-black text-violet-600">
                  +12
               </div>
            </div>
            
            <Link to={`/resources/${resource.id}`}>
              <button className="group-hover:translate-y-[-2px] h-10 px-5 rounded-xl bg-violet-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-violet-700 transition-all flex items-center gap-2">
                <ArrowUpRight size={16} />
                Enter Node
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ResourceListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { resources, loading, error } = useResources();

  const filteredResources = resources.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-10"><ErrorMessage message={error} /></div>;

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-xs font-black text-violet-600 uppercase tracking-[0.3em]">Asset Control</p>
          <h1 className="mt-2 text-4xl font-black text-slate-900 tracking-tight">Asset Directory</h1>
          <p className="mt-2 text-sm text-slate-500">Executing deep scan across institutional resource nodes.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 shadow-sm">
            <Database size={20} />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Assets</p>
            <p className="text-2xl font-black text-slate-900 leading-none">{resources.length}</p>
          </div>
        </div>
      </div>

      {/* Advanced Filter Matrix */}
      <div className="p-4 flex flex-col md:flex-row items-center gap-4 bg-white/50 border border-slate-100 shadow-lg rounded-3xl">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-violet-600 transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search specific assets, locations, or resource classifications..."
            className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:border-violet-200 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all"
          />
        </div>
        <div className="flex gap-3">
          <button className="h-14 px-6 rounded-2xl bg-white border border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-violet-600 hover:border-violet-100 transition-all flex items-center gap-3">
            <Filter size={18} /> Filters
          </button>
          <div className="h-14 w-[1px] bg-slate-100 mx-1 hidden md:block" />
          <Link to="/tickets/new">
            <button className="h-14 px-6 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
              Add Node
            </button>
          </Link>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredResources.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredResources.map((resource, i) => (
              <ResourceCard key={resource.id} resource={resource} idx={i} />
            ))}
          </motion.div>
        ) : (
          <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-lg">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Grid Scan Silent</h3>
            <p className="mt-3 text-sm text-slate-500">
              {`No resource profiles matched your query for "${searchTerm}". Verify operational parameters and try again.`}
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-6 h-11 px-6 rounded-xl bg-violet-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-violet-700 transition-all"
            >
              Reset Global Scan
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}