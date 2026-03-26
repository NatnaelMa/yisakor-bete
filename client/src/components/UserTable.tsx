import { useState } from 'react'
import { usersApi } from '../api/users'
import type { User } from '../../../shared/types'

interface UserTableProps {
  users: User[]
  currentUserId: string
  onRefresh: () => void
  onToast: (message: string, type: 'success' | 'error') => void
}

const ROLE_BADGE: Record<string, string> = {
  owner: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  admin: 'bg-primary-500/20 text-primary-300 border-primary-500/30',
  user: 'bg-white/10 text-white/50 border-white/20',
}

const ROLE_ICON: Record<string, string> = {
  owner: '👑',
  admin: '🛡️',
  user: '👤',
}

export function UserTable({ users, currentUserId, onRefresh, onToast }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-white/40">No users found.</div>
    )
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <UserRow
          key={user.id}
          user={user}
          isSelf={user.id === currentUserId}
          onRefresh={onRefresh}
          onToast={onToast}
        />
      ))}
    </div>
  )
}

function UserRow({ user, isSelf, onRefresh, onToast }: {
  user: User
  isSelf: boolean
  onRefresh: () => void
  onToast: (message: string, type: 'success' | 'error') => void
}) {
  const [loading, setLoading] = useState<string | null>(null)
  const [confirmTransfer, setConfirmTransfer] = useState(false)

  async function act(action: string, fn: () => Promise<void>, successMsg: string) {
    setLoading(action)
    try {
      await fn()
      onToast(successMsg, 'success')
      onRefresh()
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      onToast(axiosErr.response?.data?.error || 'Action failed', 'error')
    } finally {
      setLoading(null)
      setConfirmTransfer(false)
    }
  }

  return (
    <div className={`bg-white/5 border rounded-2xl p-5 transition-all ${isSelf ? 'border-primary-500/40' : 'border-white/10'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-lg">
          {user.username.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="text-white font-semibold">{user.username}</span>
            {isSelf && <span className="text-xs text-primary-400 font-medium">(you)</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{ROLE_ICON[user.role]}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border capitalize font-medium ${ROLE_BADGE[user.role]}`}>
              {user.role}
            </span>
            <span className="text-white/30 text-xs">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        {!isSelf && (
          <div className="flex flex-wrap gap-2">
            {user.role === 'user' && (
              <ActionButton
                label="Grant Admin"
                color="primary"
                loading={loading === 'grant'}
                onClick={() => act('grant', () => usersApi.grantAdmin(user.id), `${user.username} is now an admin`)}
              />
            )}
            {user.role === 'admin' && (
              <ActionButton
                label="Revoke Admin"
                color="warning"
                loading={loading === 'revoke'}
                onClick={() => act('revoke', () => usersApi.revokeAdmin(user.id), `Admin revoked from ${user.username}`)}
              />
            )}
            {user.role !== 'owner' && (
              confirmTransfer ? (
                <div className="flex gap-2 items-center">
                  <span className="text-white/60 text-xs">Transfer ownership?</span>
                  <ActionButton
                    label="Confirm"
                    color="danger"
                    loading={loading === 'transfer'}
                    onClick={() => act('transfer', () => usersApi.transferOwnership(user.id), `Ownership transferred to ${user.username}`)}
                  />
                  <button
                    onClick={() => setConfirmTransfer(false)}
                    className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 text-white/60 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <ActionButton
                  label="Transfer Ownership"
                  color="ghost"
                  loading={false}
                  onClick={() => setConfirmTransfer(true)}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ActionButton({ label, color, loading, onClick }: {
  label: string
  color: 'primary' | 'warning' | 'danger' | 'ghost'
  loading: boolean
  onClick: () => void
}) {
  const colors = {
    primary: 'bg-primary-500/20 hover:bg-primary-500/40 text-primary-300 border-primary-500/30',
    warning: 'bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border-amber-500/30',
    danger: 'bg-red-500/20 hover:bg-red-500/40 text-red-300 border-red-500/30',
    ghost: 'bg-white/5 hover:bg-white/15 text-white/50 hover:text-white/80 border-white/10',
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${colors[color]}`}
    >
      {loading ? (
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 border border-current/30 border-t-current rounded-full animate-spin" />
          {label}
        </span>
      ) : label}
    </button>
  )
}
