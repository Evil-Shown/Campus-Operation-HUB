import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  ShieldAlert, 
  ChevronLeft, 
  Plus, 
  Upload, 
  Activity, 
  Terminal,
  Server,
  Zap,
  Info
} from 'lucide-react';
import ticketApi from '../../api/ticketApi';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function TicketCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'IT_EQUIPMENT',
    description: '',
    priority: 'MEDIUM',
    location: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await ticketApi.createTicket(formData);
      navigate('/tickets');
    } catch (err) {
      setError(err.response?.data?.message || 'System: Failed to push incident report to sentinel terminal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 group text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-violet-600 transition-all"
      >
        <div className="h-8 w-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:border-violet-100 group-hover:bg-violet-50 transition-all">
          <ChevronLeft size={16} />
        </div>
        Abort Sentinel Protocol
      </button>

      <PageHeader 
        title="Incident Report" 
        subtitle="Initializing sentinel tracking for institutional system exceptions."
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
           <Card className="shadow-2xl !p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none grayscale">
                 <ShieldAlert size={300} />
              </div>

              <div className="relative z-10 space-y-10">
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                       <Terminal size={14} className="text-violet-500" /> Incident Identifier
                    </label>
                    <input 
                       type="text"
                       required
                       value={formData.title}
                       onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                       placeholder="Define the primary system exception (e.g., Network Node Offline)"
                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-black text-slate-900 focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all shadow-sm"
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                          <Activity size={14} className="text-violet-500" /> Logical Classification
                       </label>
                       <select 
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-black text-slate-900 focus:bg-white focus:border-violet-200 outline-none transition-all cursor-pointer"
                       >
                          <option value="IT_EQUIPMENT">IT INFRASTRUCTURE</option>
                          <option value="ELECTRICAL">POWER SYSTEMS</option>
                          <option value="PLUMBING">FLUID SYSTEMS</option>
                          <option value="FURNITURE">PHYSICAL ASSETS</option>
                          <option value="OTHER">UNSPECIFIED NODE</option>
                       </select>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                          <Zap size={14} className="text-rose-500" /> Priority Allocation
                       </label>
                       <select 
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          className={`w-full border rounded-2xl px-6 py-5 text-sm font-black uppercase tracking-widest focus:ring-4 transition-all cursor-pointer ${
                            formData.priority === 'CRITICAL' ? 'bg-rose-50 border-rose-200 text-rose-600 focus:ring-rose-500/5' : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-violet-200 focus:ring-violet-500/5'
                          }`}
                       >
                          <option value="LOW">LOW PRIORITY</option>
                          <option value="MEDIUM">MEDIUM PRIORITY</option>
                          <option value="HIGH">HIGH PRIORITY</option>
                          <option value="CRITICAL">CRITICAL LEVEL</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                       <Info size={14} className="text-violet-500" /> System Exception Logs
                    </label>
                    <textarea 
                       rows={6}
                       required
                       value={formData.description}
                       onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                       placeholder="Provide a detailed technical diagnostic of the incident for assigned sentinels..."
                       className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-sm font-bold text-slate-900 placeholder:text-slate-300 placeholder:italic focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all resize-none shadow-sm"
                    />
                 </div>

                 <div className="space-y-6">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                       <Upload size={14} className="text-violet-500" /> Visual Verification (Optional)
                    </label>
                    <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 hover:border-violet-200 hover:bg-violet-50/20 transition-all cursor-pointer group">
                       <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-violet-600 transition-colors">
                          <Plus size={32} />
                       </div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Drop incident captures here or browse matrix</p>
                    </div>
                 </div>
              </div>
           </Card>
        </div>

        <div className="lg:col-span-4 space-y-10">
           <Card className="bg-rose-600 !p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl h-full min-h-[500px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.1),transparent)]" />
              <div className="absolute bottom-0 right-0 p-10 opacity-10 pointer-events-none grayscale">
                 <Server size={180} />
              </div>

              <div className="relative z-10 space-y-10">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center ring-1 ring-white/10">
                       <AlertCircle size={24} />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-[0.3em] leading-tight">Sentinel <br /> Verification</h4>
                 </div>
                 
                 <div className="space-y-8">
                    <div className="p-6 rounded-3xl bg-black/10 border border-white/5 space-y-4">
                       <p className="text-[10px] font-black text-rose-200 uppercase tracking-[0.4em] italic mb-2">Operational Note</p>
                       <p className="text-xs font-bold text-white/50 leading-relaxed uppercase tracking-widest">
                          High-priority reports trigger immediate sentinel alerts across assigned maintenance nodes.
                       </p>
                    </div>
                    
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Security Link</span>
                          <Badge className="bg-emerald-500 text-white border-none shadow-lg">Stable</Badge>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Encryption</span>
                          <span className="text-xs font-black text-white uppercase tracking-widest italic">AES-256</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="relative z-10 pt-10">
                 {error && <div className="mb-6"><ErrorMessage message={error} /></div>}
                 <Button 
                    type="submit"
                    isLoading={loading}
                    className="w-full h-20 bg-white text-rose-600 hover:bg-white/90 text-[11px] font-black uppercase tracking-[0.5em] shadow-2xl rounded-[2rem]"
                    icon={Zap}
                 >
                    Push Sentinel Report
                 </Button>
              </div>
           </Card>
        </div>
      </form>
    </div>
  );
}
