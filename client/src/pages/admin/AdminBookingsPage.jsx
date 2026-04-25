import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  Building2, 
  Zap, 
  History,
  MoreVertical
} from 'lucide-react';
import bookingApi from '../../api/bookingApi';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.listBookings();
      setBookings(response.data || []);
    } catch (err) {
      setError('System: Failed to synchronize with the allocation queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      let adminReviewNote = '';
      if (status === 'REJECTED') {
        const reason = window.prompt('Enter rejection reason (required):');
        if (!reason || !reason.trim()) return;
        adminReviewNote = reason.trim();
      } else if (status === 'APPROVED') {
        const note = window.prompt('Enter approval note (optional):');
        if (note !== null) {
          adminReviewNote = note.trim();
        }
      }

      await bookingApi.updateBookingStatus(id, status, adminReviewNote);
      fetchBookings();
    } catch (err) {
      alert(err?.response?.data?.message || `System: Status synchronization to ${status} failed.`);
    }
  };

  const filteredBookings = filter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-10"><ErrorMessage message={error} /></div>;

  return (
    <div className="space-y-12 pb-24">
      <PageHeader 
        title="Reservation Command" 
        subtitle="Review and process institutional allocation requests with zero-trust validation."
        action={
          <div className="flex bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm">
             {['ALL', 'PENDING', 'APPROVED'].map(f => (
               <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   filter === f ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
                 }`}
               >
                 {f}
               </button>
             ))}
          </div>
        }
      />

      <Card className="!p-0 overflow-hidden shadow-2xl border-slate-100">
         <div className="bg-slate-900 p-8 flex items-center justify-between text-white border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <History size={80} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
               <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white ring-1 ring-white/10">
                  <Calendar size={20} />
               </div>
               <h3 className="text-sm font-black uppercase tracking-[0.3em]">Allocation Queue Management</h3>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="min-w-full text-left">
               <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Requestor Node</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Target Asset</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Temporal Window</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Status</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-right">Command</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  <AnimatePresence>
                     {filteredBookings.map((row, i) => (
                        <motion.tr 
                          key={row.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: i * 0.05 }}
                          className="group hover:bg-slate-50 transition-all duration-300"
                        >
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-inner font-black text-xs">
                                    {(row.userName || 'U').charAt(0)}
                                 </div>
                                 <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{row.userName || 'Unknown User'}</span>
                                    <span className="text-[9px] font-bold text-slate-400 italic">ID: {row.userId ?? '-'}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-3">
                                 <Building2 size={12} className="text-violet-500" />
                                 <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{row.resourceName}</span>
                              </div>
                           </td>
                           <td className="px-10 py-6">
                              <div className="flex flex-col gap-1">
                                 <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                                    <Calendar size={12} className="text-slate-300" /> {row.bookingDate}
                                 </div>
                                 <div className="flex items-center gap-2 text-[10px] font-black text-violet-600 uppercase tracking-widest">
                                    <Clock size={12} className="text-violet-400" /> {row.startTime} - {row.endTime}
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-6">
                              <Badge color={row.status === 'APPROVED' ? 'emerald' : row.status === 'PENDING' ? 'amber' : 'rose'} animate={row.status === 'PENDING'}>
                                 {row.status}
                              </Badge>
                           </td>
                           <td className="px-10 py-6 text-right">
                              <div className="flex items-center justify-end gap-3">
                                 {row.status === 'PENDING' && (
                                   <>
                                      <button 
                                        onClick={() => handleStatusUpdate(row.id, 'APPROVED')}
                                        className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 hover:shadow-md transition-all"
                                      >
                                         <CheckCircle2 size={16} />
                                      </button>
                                      <button 
                                        onClick={() => handleStatusUpdate(row.id, 'REJECTED')}
                                        className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:shadow-md transition-all"
                                      >
                                         <XCircle size={16} />
                                      </button>
                                   </>
                                 )}
                                 <button className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:shadow-md transition-all">
                                    <MoreVertical size={16} />
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

      {!loading && filteredBookings.length === 0 && (
        <EmptyState 
          icon={Calendar}
          title="Queue Empty" 
          message={`No reservation requests found with status: ${filter}.`}
          action={<Button onClick={() => setFilter('ALL')}>Clear Filters</Button>}
        />
      )}
    </div>
  );
}
