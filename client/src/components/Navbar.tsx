import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface NavbarProps {
  onLogout: () => void
}

export function Navbar({ onLogout }: NavbarProps) {
  const { user } = useAuth()
  const location = useLocation()

  const ROLE_BADGE: Record<string, string> = {
    owner: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    admin: 'bg-primary-500/20 text-primary-300 border-primary-500/30',
    user: 'bg-white/10 text-white/60 border-white/20',
  }

  return (
    <nav className="sticky top-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎓</span>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">ይሳኮር ቤቴ</h1>
            <p className="text-white/40 text-xs">Student Enrollment</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user?.role === 'owner' && (
            <div className="hidden sm:flex items-center gap-1">
              <NavLink to="/students" active={location.pathname === '/students'}>Students</NavLink>
              <NavLink to="/admin" active={location.pathname === '/admin'}>Admin Panel</NavLink>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-white/80 text-sm font-medium">{user?.username || 'User'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${ROLE_BADGE[user?.role || 'user']}`}>
                {user?.role}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-xl transition-all text-sm border border-white/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav for owner */}
      {user?.role === 'owner' && (
        <div className="sm:hidden flex border-t border-white/10">
          <MobileNavLink to="/students" active={location.pathname === '/students'}>Students</MobileNavLink>
          <MobileNavLink to="/admin" active={location.pathname === '/admin'}>Admin Panel</MobileNavLink>
        </div>
      )}
    </nav>
  )
}

function NavLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${active ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`flex-1 text-center py-2.5 text-sm font-medium transition-all ${active ? 'text-white border-b-2 border-primary-400' : 'text-white/50'}`}
    >
      {children}
    </Link>
  )
}
