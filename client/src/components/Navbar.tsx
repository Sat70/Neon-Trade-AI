import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { id: 'overview', label: 'Overview', path: '/overview' },
  { id: 'predictions', label: 'Predictions', path: '/predictions' },
  { id: 'compare', label: 'Compare', path: '/compare' },
  { id: 'Today^s Suggesion', label: "Today's Suggestion", path: undefined },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const closeMenu = () => setIsOpen(false)

  const handleLogout = async () => {
    await logout()
    closeMenu()
    navigate('/')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-30 w-full">
      <nav className="flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/70 px-4 text-sm text-slate-200 backdrop-blur-lg md:h-20 md:px-12">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-lg font-semibold tracking-tight text-teal-200 transition-opacity cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:ring-offset-2 focus:ring-offset-slate-950 rounded"
          aria-label="Go to home"
        >
          NeonTrade AI
        </button>
        <div className="hidden items-center gap-6 md:flex md:gap-8">
          {navItems.map((item) =>
            item.path ? (
              <Link key={item.id} to={item.path} className="transition hover:text-teal-200">
                {item.label}
              </Link>
            ) : (
              <a key={item.id} href={`#${item.id}`} className="transition hover:text-teal-200">
                {item.label}
              </a>
            )
          )}
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
                to="/login"
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:border-teal-300 hover:text-teal-200"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-full border border-lime-300/30 bg-gradient-to-r from-teal-400 to-lime-400 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-teal-500/40"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/30 text-sm text-white">
                  {(user?.name?.[0] ?? '?').toUpperCase()}
                </span>
                <span className="text-sm text-white/80">{user?.name}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:border-rose-400 hover:text-rose-300"
              >
                Log out
              </button>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="inline-flex items-center justify-center p-2 text-white transition border rounded-full border-white/20 hover:border-teal-300 md:hidden"
        >
          <span className="sr-only">Open navigation menu</span>
          <svg
            className="w-5 h-5"
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
        <div className="p-4 mt-3 text-sm border shadow-xl rounded-2xl border-white/10 bg-slate-900/90 backdrop-blur md:hidden">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) =>
              item.path ? (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={closeMenu}
                  className="py-1 transition text-slate-200 hover:text-teal-200"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={closeMenu}
                  className="py-1 transition text-slate-200 hover:text-teal-200"
                >
                  {item.label}
                </a>
              )
            )}
            <div className="flex items-center gap-2 pt-3 border-t border-white/5">
              <span className="px-3 py-1 text-xs border rounded-full border-white/10 text-slate-300">Minimal</span>
              <span className="px-3 py-1 text-xs text-white border rounded-full border-teal-400/40 bg-teal-500/20">
                Pro Mode
              </span>
            </div>
            {!isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full rounded-full border border-white/20 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white/80 hover:border-teal-300 hover:text-teal-200"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="w-full rounded-full border border-lime-300/30 bg-gradient-to-r from-teal-400 to-lime-400 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-teal-500/40"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/30 text-base">
                    {(user?.name?.[0] ?? '?').toUpperCase()}
                  </span>
                  <span>{user?.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs uppercase tracking-wide text-rose-300"
                >
                  Log out
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

