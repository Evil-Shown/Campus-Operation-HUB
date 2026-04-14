import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Clock, MessageCircle, XCircle } from 'lucide-react'

const notifications = [
  {
    id: 1,
    title: 'Booking Approved',
    message: 'Conference Room A booking confirmed',
    time: '2 min ago',
    icon: CheckCircle,
    color: 'text-green-500',
  },
  {
    id: 2,
    title: 'Ticket Update',
    message: 'Your IT support ticket #1243 has been resolved',
    time: '1 hour ago',
    icon: MessageCircle,
    color: 'text-blue-500',
  },
  {
    id: 3,
    title: 'Booking Rejected',
    message: 'Lab 3 request was declined',
    time: '3 hours ago',
    icon: XCircle,
    color: 'text-red-500',
  },
  {
    id: 4,
    title: 'New Comment',
    message: 'Admin replied to your ticket',
    time: '5 hours ago',
    icon: MessageCircle,
    color: 'text-purple-500',
  },
]

export default function NotificationDropdown({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg z-40"
          >
            <div className="border-b border-gray-100 p-3">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notif) => (
                <div key={notif.id} className="cursor-pointer border-b border-gray-50 p-3 transition-colors hover:bg-gray-50">
                  <div className="flex gap-3">
                    <div className={notif.color}>
                      <notif.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{notif.message}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{notif.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 p-2 text-center">
              <button className="text-xs text-indigo-600 hover:text-indigo-700" type="button">
                View all notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
