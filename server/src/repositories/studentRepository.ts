import db from '../db'
import { v4 as uuidv4 } from 'uuid'
import type { Gender } from '../../../shared/types'

export interface StudentRow {
  id: string
  full_name: string
  department: string
  graduation_year: number
  gender: Gender
  phone_number: string
  enrolled_at: string
  enrolled_by: string
}

export function create(
  fullName: string,
  department: string,
  graduationYear: number,
  gender: Gender,
  phoneNumber: string,
  enrolledBy: string
): StudentRow {
  const id = uuidv4()
  const now = new Date().toISOString()
  db.prepare(
    `INSERT INTO students (id, full_name, department, graduation_year, gender, phone_number, enrolled_at, enrolled_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, fullName, department, graduationYear, gender, phoneNumber, now, enrolledBy)
  return findById(id)!
}

export function findById(id: string): StudentRow | undefined {
  return db.prepare('SELECT * FROM students WHERE id = ?').get(id) as StudentRow | undefined
}

export function listAll(): StudentRow[] {
  return db
    .prepare('SELECT * FROM students ORDER BY graduation_year DESC, enrolled_at DESC')
    .all() as StudentRow[]
}

export function search(query: string): StudentRow[] {
  const q = `%${query.toLowerCase()}%`
  return db
    .prepare(
      `SELECT * FROM students
       WHERE LOWER(full_name) LIKE ?
          OR LOWER(department) LIKE ?
          OR CAST(graduation_year AS TEXT) LIKE ?
       ORDER BY graduation_year DESC, enrolled_at DESC`
    )
    .all(q, q, q) as StudentRow[]
}
