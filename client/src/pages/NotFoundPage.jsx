import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-slate-800">404</h1>
        </div>
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-slate-700 mb-3">Page Not Found</h2>
          <p className="text-lg text-slate-500 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            type="button"
            className="rounded-lg bg-slate-800 px-6 py-3 text-sm font-medium text-white hover:bg-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
