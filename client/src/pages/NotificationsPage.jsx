import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  MessageCircle, 
  XCircle, 
  Check, 
  Bell, 
  Filter, 
  Trash2, 
  RefreshCw,
  Zap,
  Activity,
  History,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import useNotifications from '../hooks/useNotifications';
import notificationApi from '../api/notificationApi';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const getIcon = (type) => {
  const icons = {
    BOOKING_APPROVED: CheckCircle,
    BOOKING_REJECTED: XCircle,
    TICKET_UPDATED: MessageCircle,
    TICKET_RESOLVED: CheckCircle,
    TICKET_ASSIGNED: Bell,
    COMMENT_ADDED: MessageCircle,
  };
  return icons[type] || Bell;
};

const getColor = (type) => {
  const colors = {
    BOOKING_APPROVED: 'emerald',
    BOOKING_REJECTED: 'rose',
    TICKET_UPDATED: 'blue',
    TICKET_RESOLVED: 'emerald',
    TICKET_ASSIGNED: 'indigo',
    COMMENT_ADDED: 'violet',
  };
  return colors[type] || 'slate';
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, error, refresh } = useNotifications();
  const [filter, setFilter] = useState('ALL');

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      refresh();
    } catch (err) {
      console.error('System: Sync failed');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      refresh();
    } catch (err) {
      console.error('System: Sync failed');
    }
  };

  const filtered = filter === 'ALL' 
    ? notifications 
    : filter === 'UNREAD' 
      ? notifications.filter(n => !n.isRead) 
      : notifications.filter(n => n.isRead);

  if (loading && notifications.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-12 pb-24">
      <PageHeader 
        title="Inbox Matrix" 
        subtitle="Stay updated with your institutional activities and system signals."
        action={
          <div className="flex gap-4">
             <div className="px-6 py-3 rounded-2xl bg-white border border-slate-100 flex flex-col items-end shadow-sm">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Unread Alerts</span>
                <span className="text-xl font-black text-indigo-600 leading-none">{unreadCount}</span>
             </div>
             <Button onClick={refresh} variant="secondary" icon={RefreshCw}>Pulse</Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-6">
         <div className="flex bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm">
            {['ALL', 'UNREAD', 'ARCHIVED'].map(f => (
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
         {unreadCount > 0 && (
           <Button variant="ghost" size="sm" icon={Check} onClick={handleMarkAllRead} className="text-indigo-600 hover:bg-indigo-50">
             Authorize All as Read
           </Button>
         )}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? filtered.map((notif, i) => {
            const Icon = getIcon(notif.type);
            const color = getColor(notif.type);
            
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group"
              >
                <Card className={`!p-6 border-slate-100 transition-all duration-300 ${!notif.isRead ? 'bg-indigo-50/20 border-indigo-100/50 shadow-indigo-500/5 shadow-xl' : 'hover:bg-slate-50'}`}>
                   <div className="flex items-start gap-8">
                      <div className={`h-14 w-14 rounded-2xl shrink-0 flex items-center justify-center text-${color}-600 bg-${color}-50 border border-${color}-100 group-hover:scale-105 transition-transform`}>
                         <Icon size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">{notif.title}</h4>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">{formatTime(notif.createdAt)}</span>
                         </div>
                         <p className="text-sm font-bold text-slate-500 leading-relaxed mb-4">{notif.message}</p>
                         <div className="flex items-center gap-4">
                            {!notif.isRead && (
                              <button 
                                onClick={() => handleMarkRead(notif.id)}
                                className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest flex items-center gap-2 group/btn"
                              >
                                <Check size={14} className="group-hover/btn:scale-125 transition-transform" /> Mark as Consumed
                              </button>
                            )}
                            <Badge color={color} className="text-[8px]">{notif.type}</Badge>
                         </div>
                      </div>
                   </div>
                </Card>
              </motion.div>
            );
          }) : (
            <EmptyState 
              icon={Bell} 
              title="Inbox Clear" 
              message="No system signals or operational updates detected in your terminal."
            />
          )}
        </AnimatePresence>
      </div>

      {/* Security Telemetry Footer */}
      <Card className="bg-slate-900 !p-10 text-white relative overflow-hidden flex items-center justify-between mt-20">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Terminal size={140} className="grayscale" />
         </div>
         <div className="relative z-10 flex items-center gap-8">
            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
               <ShieldCheck size={28} className="text-emerald-400" />
            </div>
            <div>
               <h4 className="text-sm font-black uppercase tracking-widest mb-1">Encrypted Signal Channel</h4>
               <p className="text-[10px] text-white/40 uppercase tracking-widest italic">Node: SLIIT-FC-01 • Secure Link Verified</p>
            </div>
         </div>
         <div className="flex items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
            <Activity size={16} className="animate-pulse" /> Pulse: Optimal
         </div>
      </Card>
    </div>
  );
}
