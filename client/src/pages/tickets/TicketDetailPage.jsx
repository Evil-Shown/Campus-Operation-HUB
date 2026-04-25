import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  Clock, 
  ChevronLeft, 
  MessageSquare, 
  ShieldAlert, 
  Send,
  User,
  Paperclip,
  Activity,
  History,
  Terminal,
  Settings
} from 'lucide-react';
import ticketApi from '../../api/ticketApi';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await ticketApi.getTicket(id);
      setTicket(response.data);
    } catch (err) {
      setError('Failed to retrieve incident logs from the sentinel node.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await ticketApi.addComment(id, comment);
      setComment('');
      fetchTicket();
    } catch (err) {
      alert('System: Log synchronization failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !ticket) return <div className="p-10"><ErrorMessage message={error || 'Incident report not found.'} /></div>;

  return (
    <div className="space-y-10 pb-24 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 group text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-violet-600 transition-all"
      >
        <div className="h-8 w-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:border-violet-100 group-hover:bg-violet-50 transition-all">
          <ChevronLeft size={16} />
        </div>
        Return to Terminal
      </button>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
        <div className="flex items-center gap-8">
          <div className={`h-20 w-20 rounded-[2rem] flex items-center justify-center shadow-2xl relative overflow-hidden group ${
            ticket.priority === 'CRITICAL' ? 'bg-rose-500 text-white' : 'bg-slate-900 text-white'
          }`}>
             <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
             {ticket.priority === 'CRITICAL' ? <ShieldAlert size={32} className="animate-pulse" /> : <Terminal size={32} />}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <Badge color={ticket.status === 'RESOLVED' ? 'emerald' : 'rose'} animate={ticket.status !== 'RESOLVED'}>
                 {ticket.status}
               </Badge>
               <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">LOG ID: {ticket.id}</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{ticket.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {ticket.status !== 'RESOLVED' && (
             <Button variant="secondary" icon={Settings} className="shadow-lg">Scale Priority</Button>
           )}
           <Badge color={ticket.priority === 'CRITICAL' ? 'rose' : ticket.priority === 'HIGH' ? 'amber' : 'blue'} className="px-6 py-3 text-xs italic">
              {ticket.priority} Priority Level
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Log Stream */}
        <div className="lg:col-span-8 space-y-10">
          <Card className="shadow-2xl !p-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 text-slate-50">
                <History size={150} className="-mr-16 -mt-16 grayscale opacity-20" />
             </div>
             <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                   <h3 className="text-[11px] font-black text-violet-600 uppercase tracking-[0.4em] border-b border-slate-50 pb-4">Incident Description</h3>
                   <p className="text-xl font-bold text-slate-600 leading-relaxed italic border-l-4 border-slate-100 pl-10 py-2">
                     {ticket.description}
                   </p>
                </div>

                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-[11px] font-black text-violet-600 uppercase tracking-[0.4em]">Visual Evidence Matrix</h3>
                    <div className="grid grid-cols-3 gap-6">
                       {ticket.attachments.map((url, i) => (
                         <div key={i} className="aspect-square rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden group/img relative">
                            <img src={url} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" alt="Attachment" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                               <ArrowUpRight size={24} className="text-white" />
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
             </div>
          </Card>

          <div className="space-y-8">
             <div className="flex items-center gap-4 px-2">
                <MessageSquare size={20} className="text-violet-600" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Collaborative Log Stream</h3>
             </div>

             <div className="space-y-8">
                {ticket.comments?.map((c, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-6 ${c.isAdmin ? 'flex-row-reverse' : ''}`}
                  >
                     <div className={`h-12 w-12 rounded-2xl shrink-0 flex items-center justify-center border-2 border-white shadow-xl ${
                       c.isAdmin ? 'bg-violet-600 text-white' : 'bg-slate-900 text-white'
                     }`}>
                        {c.isAdmin ? <ShieldAlert size={20} /> : <User size={20} />}
                     </div>
                     <Card className={`max-w-[80%] !p-8 shadow-xl ${
                       c.isAdmin ? 'bg-violet-50/50 border-violet-100' : 'bg-white border-slate-50'
                     }`}>
                        <div className={`flex items-center gap-3 mb-3 ${c.isAdmin ? 'flex-row-reverse' : ''}`}>
                           <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{c.authorName}</span>
                           <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{new Date(c.createdAt).toLocaleString()}</span>
                        </div>
                        <p className={`text-sm font-bold leading-relaxed ${c.isAdmin ? 'text-violet-900' : 'text-slate-600'}`}>
                           {c.text}
                        </p>
                     </Card>
                  </motion.div>
                ))}
             </div>

             {ticket.status !== 'RESOLVED' && (
               <Card className="shadow-2xl border-violet-100 bg-violet-50/10 !p-2">
                  <form onSubmit={handleAddComment} className="flex flex-col gap-2">
                     <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Append operational logs or status updates..."
                        className="w-full h-32 bg-transparent border-none focus:ring-0 p-8 text-sm font-bold text-slate-900 placeholder:text-slate-300 placeholder:italic resize-none"
                     />
                     <div className="flex items-center justify-between p-4 bg-white rounded-[2rem] shadow-inner inset-shadow border border-slate-100">
                        <div className="flex items-center gap-4 pl-4">
                           <button type="button" className="text-slate-300 hover:text-violet-600 transition-colors">
                              <Paperclip size={20} />
                           </button>
                        </div>
                        <Button 
                          isLoading={submitting} 
                          icon={Send} 
                          className="h-14 px-10 rounded-2xl"
                          type="submit"
                        >
                          Push Log Entry
                        </Button>
                     </div>
                  </form>
               </Card>
             )}
          </div>
        </div>

        {/* Technical Specification Matrix */}
        <div className="lg:col-span-4 space-y-10">
           <Card className="bg-slate-50/50 border-slate-100 shadow-xl p-10 space-y-12 h-fit">
              <div className="space-y-8">
                 <h4 className="text-[11px] font-black text-violet-600 uppercase tracking-[0.4em] border-b border-violet-100 pb-4">Incident Metadata</h4>
                 <div className="space-y-8">
                    {[
                      { label: 'Classification', value: ticket.category?.replace(/_/g, ' '), icon: Activity },
                      { label: 'Assigned Sentinel', value: ticket.assignedTo || 'Pending Router', icon: User },
                      { label: 'Reporting Node', value: ticket.reportedBy || 'Authorized Operator', icon: Terminal },
                      { label: 'Detection Timestamp', value: new Date(ticket.createdAt).toLocaleString(), icon: Clock }
                    ].map((item, i) => (
                      <div key={i} className="group">
                         <div className="flex items-center gap-3 mb-2 opacity-40 group-hover:opacity-100 transition-opacity">
                            <item.icon size={14} className="text-slate-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{item.label}</span>
                         </div>
                         <p className="text-sm font-black text-slate-900 uppercase tracking-widest pl-7">{item.value}</p>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="pt-10 border-t border-slate-100">
                 <h4 className="text-[11px] font-black text-rose-600 uppercase tracking-[0.4em] mb-6">System Health Impact</h4>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Degradation</span>
                       <span className="text-sm font-black text-rose-500 uppercase italic">12.4%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden p-[1px]">
                       <div className="h-full w-[12.4%] bg-rose-500 rounded-full" />
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="bg-emerald-600 p-10 text-white relative overflow-hidden group cursor-pointer hover:shadow-emerald-500/20 transition-all duration-500">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl -mr-16 -mt-16" />
             <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-white ring-1 ring-white/10 group-hover:scale-110 transition-transform">
                   <ShieldAlert size={24} />
                </div>
                <div>
                   <h4 className="text-sm font-black uppercase tracking-widest mb-2">Request Resolution</h4>
                   <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed italic">Initiate protocol closure <br /> once node stability is verified.</p>
                </div>
                <ArrowUpRight size={20} className="text-white/20 group-hover:text-white group-hover:translate-x-2 group-hover:-translate-y-2 transition-all" />
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
