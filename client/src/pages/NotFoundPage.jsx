export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 text-center">
      <h1 className="text-7xl font-bold text-slate-900">404</h1>
      <p className="mt-2 text-lg text-slate-600">Page not found</p>
      <button type="button" className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
        Go home
      </button>
    </div>
  )
}
