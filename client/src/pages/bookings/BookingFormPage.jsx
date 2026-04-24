import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  Activity, 
  ShieldCheck, 
  Zap, 
  ChevronLeft,
  ArrowRight,
  Info,
  Server,
  Terminal,
  Layers
} from 'lucide-react';
import resourceApi from '../../api/resourceApi';
import bookingApi from '../../api/bookingApi';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function BookingFormPage() {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1
  });

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const response = await resourceApi.getResource(resourceId);
        setResource(response.data);
      } catch (err) {
        setError('Failed to synchronize with the selected resource node.');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [resourceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Combine date and time for backend
      const startTime = new Date(`${formData.date}T${formData.startTime}`);
      const endTime = new Date(`${formData.date}T${formData.endTime}`);
      
      await bookingApi.createBooking({
        resourceId,
        startTime,
        endTime,
        purpose: formData.purpose,
        attendees: parseInt(formData.attendees)
      });
      
      navigate('/bookings/my');
    } catch (err) {
      alert(err.response?.data?.message || 'System: Registration protocol failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !resource) return <div className="p-10"><ErrorMessage message={error || 'Resource not found.'} /></div>;

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 group text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-violet-600 transition-all"
      >
        <div className="h-8 w-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:border-violet-100 group-hover:bg-violet-50 transition-all">
          <ChevronLeft size={16} />
        </div>
        Abort Registration
      </button>

      <PageHeader 
        title="Registration Protocol" 
        subtitle={`Initiating institutional allocation for node: ${resource.name}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Registration Form Node */}
        <div className="lg:col-span-12">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-10">
               <Card className="shadow-2xl !p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none grayscale">
                     <Layers size={300} />
                  </div>
                  
                  <div className="relative z-10 space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-4">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                              <Calendar size={14} className="text-violet-500" /> Operational Date
                           </label>
                           <input 
                              type="date"
                              required
                              value={formData.date}
                              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-900 focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all"
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                              <Clock size={14} className="text-violet-500" /> Start Signal
                           </label>
                           <input 
                              type="time"
                              required
                              value={formData.startTime}
                              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-900 focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all"
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                              <Clock size={14} className="text-violet-500" /> End Signal
                           </label>
                           <input 
                              type="time"
                              required
                              value={formData.endTime}
                              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-900 focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all"
                           />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                           <Terminal size={14} className="text-violet-500" /> Operational Purpose
                        </label>
                        <textarea 
                           rows={5}
                           required
                           value={formData.purpose}
                           onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                           placeholder="Define the scope of resource utilization for institutional auditing..."
                           className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-sm font-bold text-slate-900 placeholder:text-slate-300 placeholder:italic focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all resize-none"
                        />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                              <Users size={14} className="text-violet-500" /> Authorized Personnel Count
                           </label>
                           <div className="relative group">
                              <input 
                                 type="number"
                                 min="1"
                                 max={resource.capacity}
                                 required
                                 value={formData.attendees}
                                 onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-900 focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all"
                              />
                              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                 / Max {resource.capacity}
                              </div>
                           </div>
                        </div>
                        <div className="flex items-end pt-8">
                           <div className="flex items-center gap-4 text-slate-400 italic text-[10px] uppercase font-black tracking-[0.3em] opacity-40">
                              <Info size={16} /> Data encrypted via SLIIT-AES protocol
                           </div>
                        </div>
                     </div>
                  </div>
               </Card>
            </div>

            <div className="lg:col-span-4 space-y-10">
               <Card className="bg-slate-900 !p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl h-full min-h-[400px]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-transparent pointer-events-none" />
                  <div className="absolute top-0 right-0 p-8 opacity-5 grayscale">
                     <Server size={140} />
                  </div>

                  <div className="relative z-10 space-y-8">
                     <h4 className="text-[11px] font-black text-violet-400 uppercase tracking-[0.4em] border-b border-white/5 pb-4">Protocol Summary</h4>
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-white/30 uppercase tracking-widest italic">Target Node</span>
                           <span className="text-xs font-black text-white uppercase tracking-widest">{resource.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-white/30 uppercase tracking-widest italic">Grid Sector</span>
                           <span className="text-xs font-black text-white uppercase tracking-widest">{resource.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-white/30 uppercase tracking-widest italic">Status Node</span>
                           <Badge color="emerald">ACTIVE</Badge>
                        </div>
                     </div>
                  </div>

                  <div className="relative z-10 space-y-6 pt-10 border-t border-white/5">
                     <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 italic">
                        <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
                        <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">
                           By submitting this protocol, you agree to institutional resource utilization guidelines and automated audit logging.
                        </p>
                     </div>
                     <Button 
                        type="submit"
                        isLoading={submitting}
                        className="w-full h-18 text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-violet-500/20"
                        icon={ArrowRight}
                     >
                        Execute Protocol
                     </Button>
                  </div>
               </Card>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
