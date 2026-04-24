import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  MoreVertical, 
  Building2, 
  Users, 
  MapPin, 
  Zap, 
  Database,
  ArrowUpRight
} from 'lucide-react';
import resourceApi from '../../api/resourceApi';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

export default function AdminResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await resourceApi.listResources();
      setResources(response.data || []);
    } catch (err) {
      setError('System: Failed to synchronize with the resource matrix.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('TERMINATE RESOURCE NODE? This will affect all current and future allocations.')) {
      try {
        await resourceApi.deleteResource(id);
        fetchResources();
      } catch (err) {
        alert('System: Termination protocol failed.');
      }
    }
  };

  const filteredResources = resources.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-10"><ErrorMessage message={error} /></div>;

  return (
    <div className="space-y-12 pb-24">
      <PageHeader 
        title="Asset Administration" 
        subtitle="Manage the institutional grid and allocate resource deployment nodes."
        action={
          <Button onClick={() => setIsModalOpen(true)} icon={Plus}>Deploy New Node</Button>
        }
      />

      <Card className="!p-4 flex flex-col md:flex-row items-center gap-4 bg-white/50 border-slate-100 shadow-lg">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-violet-600 transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search specific assets, sectors, or operational identifiers..."
            className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:border-violet-200 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all"
          />
        </div>
        <div className="flex gap-3">
          <button className="h-14 px-6 rounded-2xl bg-white border border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-violet-600 hover:border-violet-100 transition-all flex items-center gap-3">
            <Filter size={18} /> Logic Filters
          </button>
        </div>
      </Card>

      <Card className="!p-0 overflow-hidden shadow-2xl border-slate-100">
         <div className="bg-slate-900 p-8 flex items-center justify-between text-white border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Database size={80} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
               <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white ring-1 ring-white/10">
                  <Zap size={20} />
               </div>
               <h3 className="text-sm font-black uppercase tracking-[0.3em]">Grid Node Inventory</h3>
            </div>
            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest italic relative z-10">
               Node Sync: Optimal
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="min-w-full text-left">
               <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Resource Name</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Classification</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-center">Occupancy</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Location Sector</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Operational Status</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-right">Admin Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  <AnimatePresence>
                     {filteredResources.map((row, i) => (
                        <motion.tr 
                          key={row.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: i * 0.05 }}
                          className="group hover:bg-slate-50 transition-all duration-300"
                        >
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-5">
                                 <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-violet-600 shadow-inner group-hover:shadow-sm transition-all italic font-black text-[10px]">
                                    {row.id}
                                 </div>
                                 <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{row.name}</span>
                              </div>
                           </td>
                           <td className="px-10 py-6">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <Building2 size={12} className="text-violet-500" /> {row.type.replace(/_/g, ' ')}
                              </p>
                           </td>
                           <td className="px-10 py-6 text-center">
                              <span className="text-xs font-black text-slate-900 uppercase tracking-tight flex items-center justify-center gap-2">
                                 <Users size={12} className="text-violet-500" /> {row.capacity}
                              </span>
                           </td>
                           <td className="px-10 py-6">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                                 <MapPin size={12} className="text-violet-500" /> {row.location}
                              </span>
                           </td>
                           <td className="px-10 py-6">
                              <Badge color={row.status === 'ACTIVE' ? 'emerald' : 'rose'} animate={row.status === 'ACTIVE'}>
                                 {row.status}
                              </Badge>
                           </td>
                           <td className="px-10 py-6 text-right">
                              <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-violet-600 hover:shadow-md transition-all">
                                    <Edit3 size={16} />
                                 </button>
                                 <button 
                                   onClick={() => handleDelete(row.id)}
                                   className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:shadow-md transition-all"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </td>
                        </motion.tr>
                     ))}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>
      </Card>

      {/* Modal Placeholder for Adding Node */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Deploy Resource Node">
         <div className="space-y-8 animate-in fade-in duration-500">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Node deployment logic pending integration with grid-orchestrator.</p>
            <div className="flex justify-end pt-6">
               <Button onClick={() => setIsModalOpen(false)}>Abort Protocol</Button>
            </div>
         </div>
      </Modal>

      {!loading && filteredResources.length === 0 && (
        <EmptyState 
          title="Inventory Matrix Empty" 
          message="No resource nodes found matching the current search parameters."
          action={<Button onClick={() => setSearchTerm('')}>Reset Scan</Button>}
        />
      )}
    </div>
  );
}
