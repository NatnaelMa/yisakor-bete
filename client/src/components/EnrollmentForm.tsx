import { useState, FormEvent } from 'react'
import { studentsApi } from '../api/students'
import type { Student, Gender } from '../../../shared/types'

interface EnrollmentFormProps {
  onEnrolled: (student: Student) => void
  onToast: (message: string, type: 'success' | 'error') => void
}

const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/

interface FormErrors {
  fullName?: string
  department?: string
  graduationYear?: string
  gender?: string
  phoneNumber?: string
}

export function EnrollmentForm({ onEnrolled, onToast }: EnrollmentFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState({
    fullName: '',
    department: '',
    graduationYear: '',
    gender: '' as Gender | '',
    phoneNumber: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!fields.fullName.trim()) e.fullName = 'Full name is required'
    if (!fields.department.trim()) e.department = 'Department is required'
    const year = Number(fields.graduationYear)
    if (!fields.graduationYear || isNaN(year) || year < 1000 || year > 9999)
      e.graduationYear = 'Enter a valid 4-digit year'
    if (!fields.gender) e.gender = 'Please select a gender'
    if (!fields.phoneNumber || !PHONE_REGEX.test(fields.phoneNumber))
      e.phoneNumber = 'Enter a valid phone number'
    return e
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    try {
      const student = await studentsApi.enroll({
        fullName: fields.fullName.trim(),
        department: fields.department.trim(),
        graduationYear: Number(fields.graduationYear),
        gender: fields.gender as Gender,
        phoneNumber: fields.phoneNumber.trim(),
      })
      onEnrolled(student)
      onToast(`${student.fullName} enrolled successfully!`, 'success')
      setFields({ fullName: '', department: '', graduationYear: '', gender: '', phoneNumber: '' })
      setErrors({})
      setOpen(false)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string> } } }
      if (axiosErr.response?.data?.errors) {
        setErrors(axiosErr.response.data.errors as FormErrors)
      } else {
        onToast('Failed to enroll student. Please try again.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  function set(field: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFields((prev) => ({ ...prev, [field]: e.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-400/40"
      >
        <svg className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Enroll Student
      </button>

      {open && (
        <div className="mt-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 animate-slide-down">
          <h3 className="text-white font-semibold text-lg mb-5">New Student Enrollment</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name" error={errors.fullName}>
              <input
                type="text"
                value={fields.fullName}
                onChange={set('fullName')}
                placeholder="e.g. Abebe Kebede"
                className={inputClass(!!errors.fullName)}
              />
            </Field>

            <Field label="Department" error={errors.department}>
              <input
                type="text"
                value={fields.department}
                onChange={set('department')}
                placeholder="e.g. Computer Science"
                className={inputClass(!!errors.department)}
              />
            </Field>

            <Field label="Graduation Year" error={errors.graduationYear}>
              <input
                type="number"
                value={fields.graduationYear}
                onChange={set('graduationYear')}
                placeholder="e.g. 2026"
                min={1900}
                max={2100}
                className={inputClass(!!errors.graduationYear)}
              />
            </Field>

            <Field label="Gender" error={errors.gender}>
              <select
                value={fields.gender}
                onChange={set('gender')}
                className={inputClass(!!errors.gender)}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            <Field label="Phone Number" error={errors.phoneNumber} className="md:col-span-2">
              <input
                type="tel"
                value={fields.phoneNumber}
                onChange={set('phoneNumber')}
                placeholder="e.g. +251 91 234 5678"
                className={inputClass(!!errors.phoneNumber)}
              />
            </Field>

            <div className="md:col-span-2 flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-primary-500 hover:bg-primary-400 disabled:bg-primary-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enrolling...
                  </span>
                ) : 'Enroll Student'}
              </button>
              <button
                type="button"
                onClick={() => { setOpen(false); setErrors({}) }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function Field({ label, error, children, className = '' }: {
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-white/70 text-sm font-medium mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-red-400 text-xs">{error}</p>}
    </div>
  )
}

function inputClass(hasError: boolean) {
  return `w-full px-4 py-2.5 bg-white/10 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all ${hasError ? 'border-red-500/60' : 'border-white/20'}`
}
