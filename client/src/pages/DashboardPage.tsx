import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-60">
        <div className="absolute left-1/4 top-10 h-96 w-96 rounded-full bg-teal-500/20 blur-[180px]" />
        <div className="absolute right-10 top-1/2 h-80 w-80 rounded-full bg-purple-600/30 blur-[220px]" />
      </div>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-28">
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="mt-2 text-slate-300">Welcome back, {user?.name}.</p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="text-lg font-medium text-teal-200">Your account</h2>
          <dl className="mt-4 space-y-2 text-sm text-slate-300">
            <div>
              <dt className="text-slate-400">Email</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Age</dt>
              <dd>{user?.age}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:border-rose-400 hover:text-rose-300"
          >
            Log out
          </button>
        </div>
        <section className="mt-10">
          <h2 className="text-xl font-medium text-white">Predictions</h2>
          <p className="mt-2 text-sm text-slate-400">AI predictions and analytics will appear here.</p>
        </section>
      </main>
    </div>
  )
}
