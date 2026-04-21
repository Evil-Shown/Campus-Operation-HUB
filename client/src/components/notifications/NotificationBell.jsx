export default function NotificationBell() {
  return (
    <div className="relative inline-flex items-center justify-center">
      <span style={{ fontSize: '16px' }}>🔔</span>
      <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
        3
      </span>
    </div>
  )
}
