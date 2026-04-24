<<<<<<< feature/facilities
import Badge from '../../components/common/Badge'

const rows = [
  {
    resource: 'Computer Lab 3',
    date: '2026-05-01',
    time: '09:00-11:00',
    purpose: 'Project work',
    status: 'PENDING',
    action: 'Cancel',
  },
  {
    resource: 'Lecture Hall A101',
    date: '2026-04-28',
    time: '14:00-16:00',
    purpose: 'Group study',
    status: 'APPROVED',
    action: '',
  },
]

const statusColors = {
  PENDING: 'yellow',
  APPROVED: 'green',
  REJECTED: 'red',
}

export default function MyBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
        <p className="text-sm text-slate-600">Track booking requests and their current approval status.</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.resource}-${row.date}`} className="border-t border-slate-100">
                <td className="px-4 py-3">{row.resource}</td>
                <td className="px-4 py-3">{row.date}</td>
                <td className="px-4 py-3">{row.time}</td>
                <td className="px-4 py-3">{row.purpose}</td>
                <td className="px-4 py-3">
                  <Badge text={row.status} color={statusColors[row.status]} />
                </td>
                <td className="px-4 py-3">
                  {row.action ? (
                    <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700">
                      {row.action}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
=======
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  BookOpen,
  Filter,
  Search,
  CheckCircle2,
  Clock3
} from 'lucide-react';
import useBookings from '../../hooks/useBookings';
import bookingApi from '../../api/bookingApi';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import BookingCard from '../../components/bookings/BookingCard';

export default function MyBookingsPage() {
  const { bookings, loading, error, refresh } = useBookings('mine');

  const handleCancel = async (id) => {
    if (window.confirm('TERMINATE ALLOCATION PROTOCOL? This action cannot be reversed.')) {
      try {
        await bookingApi.cancelBooking(id);
        refresh();
      } catch (err) {
        alert('System: Termination sequence failed.');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-10"><ErrorMessage message={error} /></div>;

  const stats = {
    pending: bookings.filter(b => b.status === 'PENDING').length,
    approved: bookings.filter(b => b.status === 'APPROVED' || b.status === 'CONFIRMED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED' || b.status === 'REJECTED').length
  };

  return (
    <div className="space-y-12 pb-24">
      <PageHeader 
        title="Personal Schedule" 
        subtitle="Tracking institutional resource allocations and approval sequences."
        action={
          <div className="flex gap-4">
             <div className="px-6 py-3 rounded-2xl bg-white border border-slate-100 flex flex-col items-end shadow-sm">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pending</span>
                <span className="text-xl font-black text-amber-500 leading-none">{stats.pending}</span>
             </div>
             <div className="px-6 py-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col items-end shadow-sm">
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Approved</span>
                <span className="text-xl font-black text-emerald-600 leading-none">{stats.approved}</span>
             </div>
          </div>
        }
      />

      <Card className="!p-4 flex flex-col md:flex-row items-center gap-4 bg-white/50 border-slate-100 shadow-lg">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-violet-600 transition-colors" />
          <input
            type="text"
            placeholder="Search allocation matrix by resource or purpose..."
            className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:border-violet-200 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all"
          />
        </div>
        <div className="flex gap-3">
          <div className="h-14 w-[1px] bg-slate-100 mx-1 hidden md:block" />
          <Button variant="secondary" icon={History} className="h-14 rounded-2xl">
            Audit Logs
          </Button>
        </div>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center gap-4 px-2">
           <div className="h-5 w-1 bg-violet-600 rounded-full" />
           <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Institutional Allocation Queue</h3>
        </div>

        <AnimatePresence mode="wait">
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking, i) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  idx={i} 
                  onCancel={handleCancel}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={Clock3}
              title="Schedule Grid Empty" 
              message="No active or historical reservations detected for your identity node."
              action={<Button icon={Zap}>Initiate First Booking</Button>}
            />
          )}
        </AnimatePresence>
      </div>

      {/* System Integrity Sub-Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-slate-100">
         {[
           { label: 'Security Level', value: 'Protocol Alpha', icon: ShieldCheck, color: 'text-violet-500' },
           { label: 'Approval Latency', value: 'Avg 2.4 hrs', icon: History, color: 'text-blue-500' },
           { label: 'Grid Integrity', value: 'Institutional-S2', icon: CheckCircle2, color: 'text-emerald-500' }
         ].map((item, i) => (
           <div key={i} className="flex items-center gap-5 p-6 rounded-3xl bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
              <div className={`h-12 w-12 rounded-xl bg-white flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                 <item.icon size={20} />
              </div>
              <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{item.label}</p>
                 <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.value}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
>>>>>>> development
}
