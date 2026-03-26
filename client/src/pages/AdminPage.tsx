import { useState, useEffect, useCallback } from 'react'
import { usersApi } from '../api/users'
import { UserTable } from '../components/UserTable'
import { Toast, useToast } from '../components/Toast'
import { Navbar } from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import type { User } from '../../../shared/types'

export default function AdminPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { toasts, addToast, removeToast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showRegister, setShowRegister] = useState(false)
  const [regUsername, setRegUsername] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regLoading, setRegLoading] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await usersApi.list()
      setUsers(data)
    } catch {
      addToast('Failed to load users', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!regUsername.trim() || !regPassword.trim()) return
    setRegLoading(true)
    try {
      await usersApi.register(regUsername.trim(), regPassword)
      addToast(`User "${regUsername}" created`, 'success')
      setRegUsername('')
      setRegPassword('')
      setShowRegister(false)
      fetchUsers()
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      addToast(axiosErr.response?.data?.error || 'Failed to create user', 'error')
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900">
      <Navbar onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Admin Panel</h2>
            <p className="text-white/50 text-sm">Manage users and privileges</p>
          </div>
          <button
            onClick={() => setShowRegister(!showRegister)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/30"
          >
            <svg className={`w-5 h-5 transition-transform duration-200 ${showRegister ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </div>

        {/* Register form */}
        {showRegister && (
          <div className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 animate-slide-down">
            <h3 className="text-white font-semibold mb-4">Create New User</h3>
            <form onSubmit={handleRegister} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="Username"
                required
                className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Password"
                required
                className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={regLoading}
                className="px-6 py-2.5 bg-primary-500 hover:bg-primary-400 disabled:bg-primary-700 text-white font-semibold rounded-xl transition-all"
              >
                {regLoading ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white/70 rounded-xl transition-all border border-white/20"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Users', value: users.length, icon: '👥' },
            { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: '🛡️' },
            { label: 'Regular Users', value: users.filter(u => u.role === 'user').length, icon: '👤' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/40 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* User list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-white/20 border-t-primary-400 rounded-full animate-spin" />
          </div>
        ) : (
          <UserTable
            users={users}
            currentUserId={user?.id || ''}
            onRefresh={fetchUsers}
            onToast={addToast}
          />
        )}
      </main>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
