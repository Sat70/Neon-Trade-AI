import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../lib/constants'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const message = typeof data?.message === 'string' ? data.message : 'Login failed'
        setError(message)
        return
      }
      if (!data?.user) {
        setError('Invalid response from server')
        return
      }
      login(data.user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const isNetworkError = err instanceof TypeError && (err.message === 'Failed to fetch' || err.message.includes('NetworkError'))
      setError(
        isNetworkError
          ? `Cannot connect to server. Make sure the API is running at ${API_BASE_URL}`
          : 'Login failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),transparent_60%)]" />
        <div className="absolute left-10 top-10 h-96 w-96 rounded-full bg-teal-500/20 blur-[160px]" />
        <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-purple-600/30 blur-[200px]" />
      </div>
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-20">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-teal-500/20 backdrop-blur-2xl">
          <p className="text-xs uppercase tracking-[0.4em] text-teal-200">NeonTrade AI</p>
          <h1 className="mt-3 text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-300">Log in to access predictions and dashboard.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm">
              <span className="text-slate-300">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-teal-300"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="block text-sm">
              <span className="text-slate-300">Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-teal-300"
                placeholder="••••••••"
                required
              />
            </label>

            {error && <p className="text-sm text-rose-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-400 to-lime-300 px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-teal-500/40 transition hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Log In'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            New here?{' '}
            <Link to="/signup" className="text-teal-200 underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
