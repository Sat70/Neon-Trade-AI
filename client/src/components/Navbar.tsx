import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'predictions', label: 'Predictions' },
  { id: 'backtesting', label: 'Backtesting' },
  { id: 'api', label: 'API' },
]

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate('/')
  }

  // NOTE: This navbar used to live in a centered max-w container, which made the whole layout feel boxed.
  // We now let it span the full viewport width so the experience feels immersive and dashboard-like.
  return (
    <header className="fixed inset-x-0 top-0 z-30 w-full">
      <nav className="flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/70 px-4 text-sm text-slate-200 backdrop-blur-lg md:h-20 md:px-12">
        <div className="text-lg font-semibold tracking-tight text-teal-200">NeonTrade AI</div>
        <div className="hidden items-center gap-6 md:flex md:gap-8">
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="transition hover:text-teal-200">
              {item.label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-1 text-xs text-slate-300">
            {['Minimal', 'Pro Mode'].map((mode) => (
              <button
                key={mode}
                className={`rounded-full px-3 py-1 transition ${
                  mode === 'Pro Mode' ? 'bg-teal-500/30 text-white' : 'text-slate-400'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          {!isAuthenticated ? (
            <>
              <Link
                to="/auth/login"
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:border-teal-300 hover:text-teal-200"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="rounded-full border border-lime-300/30 bg-gradient-to-r from-teal-400 to-lime-400 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-teal-500/40"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/30 text-sm text-white">
                  {(user?.name?.[0] ?? '?').toUpperCase()}
                </div>
                <span className="text-sm text-white/80">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:border-rose-400 hover:text-rose-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="inline-flex items-center justify-center rounded-full border border-white/20 p-2 text-white transition hover:border-teal-300 md:hidden"
        >
          <span className="sr-only">Open navigation menu</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <>
                <path d="M3 7h18" />
                <path d="M3 12h18" />
                <path d="M3 17h18" />
              </>
            )}
          </svg>
        </button>
      </nav>
      {isOpen && (
        <div className="mt-3 rounded-2xl border border-white/10 bg-slate-900/90 p-4 text-sm shadow-xl backdrop-blur md:hidden">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={closeMenu}
                className="py-1 text-slate-200 transition hover:text-teal-200"
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center gap-2 border-t border-white/5 pt-3">
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Minimal</span>
              <span className="rounded-full border border-teal-400/40 bg-teal-500/20 px-3 py-1 text-xs text-white">
                Pro Mode
              </span>
            </div>
            {!isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <Link
                  to="/auth/login"
                  onClick={closeMenu}
                  className="w-full rounded-full border border-white/20 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white/80 hover:border-teal-300 hover:text-teal-200"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  onClick={closeMenu}
                  className="w-full rounded-full border border-lime-300/30 bg-gradient-to-r from-teal-400 to-lime-400 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-teal-500/40"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/30 text-base">
                    {(user?.name?.[0] ?? '?').toUpperCase()}
                  </div>
                  <span>{user?.name}</span>
                </div>
                <button onClick={handleLogout} className="text-xs uppercase tracking-wide text-rose-300">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

