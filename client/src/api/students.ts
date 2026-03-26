import client from './client'
import type { EnrollStudentInput, Student } from '../../../shared/types'

export const studentsApi = {
  async list(query?: string): Promise<Student[]> {
    const params = query ? { q: query } : {}
    const res = await client.get('/students', { params })
    return res.data.data
  },
  async enroll(input: EnrollStudentInput): Promise<Student> {
    const res = await client.post('/students', input)
    return res.data.data
  },
}
