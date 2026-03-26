import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../auth/jwt'
import type { SessionPayload } from '../../../shared/types'

declare global {
  namespace Express {
    interface Request {
      user?: SessionPayload
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.token
  if (!token) {
    res.status(401).json({ error: 'Authentication required' })
    return
  }
  try {
    const payload = verifyToken(token)
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' })
  }
}
