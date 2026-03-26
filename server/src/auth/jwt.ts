import jwt from 'jsonwebtoken'
import type { SessionPayload } from '../../../shared/types'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const JWT_EXPIRES_IN = '7d'

export function signToken(payload: Omit<SessionPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): SessionPayload {
  return jwt.verify(token, JWT_SECRET) as SessionPayload
}
