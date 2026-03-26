export type Role = 'owner' | 'admin' | 'user'
export type Gender = 'Male' | 'Female' | 'Other'

export interface User {
  id: string
  username: string
  role: Role
  createdAt: string
}

export interface Student {
  id: string
  fullName: string
  department: string
  graduationYear: number
  gender: Gender
  phoneNumber: string
  enrolledAt: string
  enrolledBy: string
}

export interface SessionPayload {
  sub: string
  role: Role
  iat: number
  exp: number
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  errors?: Record<string, string>
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface EnrollStudentInput {
  fullName: string
  department: string
  graduationYear: number
  gender: Gender
  phoneNumber: string
}
