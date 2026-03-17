import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../lib/constants'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Name is required'
    const ageNum = parseInt(form.age, 10)
    if (!form.age.trim()) next.age = 'Age is required'
    else if (Number.isNaN(ageNum) || ageNum < 18) next.age = 'You must be 18 or older'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!EMAIL_REGEX.test(form.email.trim())) next.email = 'Enter a valid email'
    if (!form.password) next.password = 'Password is required'
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate() || loading) return
    setLoading(true)
    setErrors({})
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          age: parseInt(form.age, 10),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const message = typeof data?.message === 'string' ? data.message : 'Registration failed'
        setErrors({ form: message })
        return
      }
      if (!data?.user) {
        setErrors({ form: 'Invalid response from server' })
        return
      }
      signup(data.user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const isNetworkError = err instanceof TypeError && (err.message === 'Failed to fetch' || err.message.includes('NetworkError'))
      setErrors({
        form: isNetworkError
          ? `Cannot connect to server. Make sure the API is running at ${API_BASE_URL}`
          : 'Registration failed',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),transparent_60%)]" />
        <div className="absolute left-1/3 top-10 h-96 w-96 rounded-full bg-teal-500/20 blur-[180px]" />
        <div className="absolute right-6 bottom-0 h-80 w-80 rounded-full bg-purple-600/30 blur-[200px]" />
      </div>
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-20">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-teal-500/20 backdrop-blur-2xl">
          <p className="text-xs uppercase tracking-[0.4em] text-teal-200">NeonTrade AI</p>
          <h1 className="mt-3 text-3xl font-semibold">Create account</h1>
          <p className="mt-2 text-sm text-slate-300">Sign up to access predictions and dashboard.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm">
              <span className="text-slate-300">Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-teal-300"
                placeholder="Your name"
                required
              />
              {errors.name && <p className="mt-1 text-sm text-rose-400">{errors.name}</p>}
            </label>

            <label className="block text-sm">
              <span className="text-slate-300">Age (must be 18+)</span>
              <input
                type="number"
                min={18}
                max={120}
                value={form.age}
                onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-teal-300"
                placeholder="18"
                required
              />
              {errors.age && <p className="mt-1 text-sm text-rose-400">{errors.age}</p>}
            </label>

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
              {errors.email && <p className="mt-1 text-sm text-rose-400">{errors.email}</p>}
            </label>

            <label className="block text-sm">
              <span className="text-slate-300">Password (min 6 characters)</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-teal-300"
                placeholder="••••••••"
                required
              />
              {errors.password && <p className="mt-1 text-sm text-rose-400">{errors.password}</p>}
            </label>

            {errors.form && <p className="text-sm text-rose-400">{errors.form}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-400 to-lime-300 px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-teal-500/40 transition hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-200 underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
