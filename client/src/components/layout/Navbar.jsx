import NotificationBell from '../notifications/NotificationBell'

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="text-lg font-semibold text-slate-900">Smart Campus</div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600">Notifications</div>
        <NotificationBell />
        <div className="h-8 w-8 rounded-full bg-slate-300" />
      </div>
    </header>
  )
}
