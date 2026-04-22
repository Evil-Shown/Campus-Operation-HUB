export default function Sidebar() {
  const links = [
    { label: 'Dashboard', href: '/' },
    { label: 'Resources', href: '/' },
    { label: 'My Bookings', href: '/bookings/my' },
    { label: 'Report Issue (tickets)', href: '/tickets' },
    { label: 'Admin', href: '/admin' },
  ]

  return (
    <aside className="min-h-screen w-64 border-r border-slate-200 bg-slate-50 p-4">
      <h2 className="mb-6 text-xl font-semibold text-slate-900">Smart Campus</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}
