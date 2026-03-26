import type { Student } from '../../../shared/types'

interface StudentListProps {
  students: Student[]
  isSearching: boolean
  loading: boolean
}

const GENDER_BADGE: Record<string, string> = {
  Male: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Female: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Other: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
}

export function StudentList({ students, isSearching, loading }: StudentListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-white/20 border-t-primary-400 rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading students...</p>
        </div>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="text-6xl mb-4">{isSearching ? '🔍' : '🎓'}</div>
        <h3 className="text-white/70 font-semibold text-lg mb-1">
          {isSearching ? 'No results found' : 'No students enrolled yet'}
        </h3>
        <p className="text-white/40 text-sm">
          {isSearching
            ? 'Try a different search term'
            : 'Use the "Enroll Student" button to add the first student'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-white/40 text-sm">{students.length} student{students.length !== 1 ? 's' : ''} found</p>
      {students.map((student, index) => (
        <StudentRow key={student.id} student={student} index={index} />
      ))}
    </div>
  )
}

function StudentRow({ student, index }: { student: Student; index: number }) {
  return (
    <div
      className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all duration-200 animate-slide-up"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {student.fullName.charAt(0).toUpperCase()}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-white font-semibold text-base truncate">{student.fullName}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${GENDER_BADGE[student.gender] || 'bg-white/10 text-white/60 border-white/20'}`}>
              {student.gender}
            </span>
          </div>
          <p className="text-white/60 text-sm truncate">{student.department}</p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 sm:gap-6 text-sm">
          <div className="flex flex-col items-start sm:items-center">
            <span className="text-white/40 text-xs uppercase tracking-wide">Grad Year</span>
            <span className="text-primary-300 font-bold text-base">{student.graduationYear}</span>
          </div>
          <div className="flex flex-col items-start sm:items-center">
            <span className="text-white/40 text-xs uppercase tracking-wide">Phone</span>
            <span className="text-white/80 font-medium">{student.phoneNumber}</span>
          </div>
          <div className="flex flex-col items-start sm:items-center">
            <span className="text-white/40 text-xs uppercase tracking-wide">Enrolled</span>
            <span className="text-white/60 text-xs">{new Date(student.enrolledAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
