import { Request, Response, NextFunction } from 'express'
import type { Role } from '../../../shared/types'

const ROLE_HIERARCHY: Record<Role, number> = {
  user: 0,
  admin: 1,
  owner: 2,
}

export function requireRole(minRole: Role) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' })
      return
    }
    if (ROLE_HIERARCHY[req.user.role] < ROLE_HIERARCHY[minRole]) {
      res.status(403).json({ error: 'Insufficient permissions' })
      return
    }
    next()
  }
}
