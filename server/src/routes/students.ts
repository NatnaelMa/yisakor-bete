import { Router, Request, Response } from 'express'
import { authenticate } from '../middleware/authenticate'
import { requireRole } from '../middleware/requireRole'
import * as studentRepo from '../repositories/studentRepository'
import type { Gender } from '../../../shared/types'

const router = Router()

const VALID_GENDERS: Gender[] = ['Male', 'Female', 'Other']
const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/

function validateStudent(body: Record<string, unknown>): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!body.fullName || typeof body.fullName !== 'string' || !body.fullName.trim()) {
    errors.fullName = 'Full name is required'
  }
  if (!body.department || typeof body.department !== 'string' || !body.department.trim()) {
    errors.department = 'Department is required'
  }
  const year = Number(body.graduationYear)
  if (!body.graduationYear || isNaN(year) || year < 1000 || year > 9999) {
    errors.graduationYear = 'Graduation year must be a valid 4-digit year'
  }
  if (!body.gender || !VALID_GENDERS.includes(body.gender as Gender)) {
    errors.gender = 'Gender must be Male, Female, or Other'
  }
  if (!body.phoneNumber || typeof body.phoneNumber !== 'string' || !PHONE_REGEX.test(body.phoneNumber)) {
    errors.phoneNumber = 'A valid phone number is required'
  }
  return errors
}

// GET /api/students
router.get('/', authenticate, requireRole('admin'), (req: Request, res: Response) => {
  const q = req.query.q as string | undefined
  const students = q && q.trim() ? studentRepo.search(q.trim()) : studentRepo.listAll()
  res.json({ data: students.map(mapStudent) })
})

// POST /api/students
router.post('/', authenticate, requireRole('admin'), (req: Request, res: Response) => {
  const errors = validateStudent(req.body)
  if (Object.keys(errors).length > 0) {
    res.status(422).json({ error: 'Validation failed', errors })
    return
  }
  const student = studentRepo.create(
    req.body.fullName.trim(),
    req.body.department.trim(),
    Number(req.body.graduationYear),
    req.body.gender as Gender,
    req.body.phoneNumber.trim(),
    req.user!.sub
  )
  res.status(201).json({ data: mapStudent(student) })
})

function mapStudent(s: studentRepo.StudentRow) {
  return {
    id: s.id,
    fullName: s.full_name,
    department: s.department,
    graduationYear: s.graduation_year,
    gender: s.gender,
    phoneNumber: s.phone_number,
    enrolledAt: s.enrolled_at,
    enrolledBy: s.enrolled_by,
  }
}

export default router
