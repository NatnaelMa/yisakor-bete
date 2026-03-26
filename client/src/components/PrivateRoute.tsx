import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../../../shared/types'
import { ReactNode } from 'react'

const ROLE_LEVEL: Record<Role, number> = { user: 0, admin: 1, owner: 2 }

interface PrivateRouteProps {
  children: ReactNode
  requiredRole?: Role
}

export function PrivateRoute({ children, requiredRole = 'admin' }: PrivateRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-accent-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-white/70 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (ROLE_LEVEL[user.role] < ROLE_LEVEL[requiredRole]) {
    return <Navigate to="/students" replace />
  }

  return <>{children}</>
}
