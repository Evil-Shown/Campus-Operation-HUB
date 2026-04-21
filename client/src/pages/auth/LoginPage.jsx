export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Smart Campus</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to continue</p>

        <a
          href="/oauth2/authorization/google"
          className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
        >
          Sign in with Google
        </a>

        <p className="mt-6 text-center text-xs text-slate-500">SLIIT Faculty of Computing — IT3030</p>
      </div>
    </div>
  )
}
