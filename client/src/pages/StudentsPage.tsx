import { useState, useEffect, useCallback } from 'react'
import { studentsApi } from '../api/students'
import { SearchBar } from '../components/SearchBar'
import { EnrollmentForm } from '../components/EnrollmentForm'
import { StudentList } from '../components/StudentList'
import { Toast, useToast } from '../components/Toast'
import { Navbar } from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import type { Student } from '../../../shared/types'

export default function StudentsPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { toasts, addToast, removeToast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchStudents = useCallback(async (q?: string) => {
    setLoading(true)
    try {
      const data = await studentsApi.list(q)
      setStudents(data)
    } catch {
      addToast('Failed to load students', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  function handleSearch(q: string) {
    setSearchQuery(q)
    fetchStudents(q || undefined)
  }

  function handleEnrolled(student: Student) {
    setStudents((prev) => [student, ...prev].sort((a, b) => b.graduationYear - a.graduationYear))
  }

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900">
      <Navbar onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Enrolled Students</h2>
          <p className="text-white/50 text-sm">Manage and view the student registry</p>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          <EnrollmentForm onEnrolled={handleEnrolled} onToast={addToast} />
        </div>

        {/* Student list */}
        <StudentList
          students={students}
          isSearching={!!searchQuery}
          loading={loading}
        />
      </main>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
