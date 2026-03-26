import { Router, Request, Response } from 'express'
import { authenticate } from '../middleware/authenticate'
import { requireRole } from '../middleware/requireRole'
import * as userRepo from '../repositories/userRepository'

const router = Router()

// GET /api/users — Owner only
router.get('/', authenticate, requireRole('owner'), (_req: Request, res: Response) => {
  const users = userRepo.listAll()
  res.json({ data: users.map(mapUser) })
})

// POST /api/users/:id/grant-admin — Owner only
router.post('/:id/grant-admin', authenticate, requireRole('owner'), (req: Request, res: Response) => {
  const target = userRepo.findById(req.params.id)
  if (!target) {
    res.status(404).json({ error: 'User not found' })
    return
  }
  if (target.role === 'owner') {
    res.status(409).json({ error: 'Cannot change the owner\'s role directly' })
    return
  }
  userRepo.updateRole(target.id, 'admin')
  res.json({ data: { message: `${target.username} is now an admin` } })
})

// POST /api/users/:id/revoke-admin — Owner only
router.post('/:id/revoke-admin', authenticate, requireRole('owner'), (req: Request, res: Response) => {
  const target = userRepo.findById(req.params.id)
  if (!target) {
    res.status(404).json({ error: 'User not found' })
    return
  }
  if (target.role !== 'admin') {
    res.status(409).json({ error: 'User is not an admin' })
    return
  }
  userRepo.updateRole(target.id, 'user')
  res.json({ data: { message: `Admin privileges revoked from ${target.username}` } })
})

// POST /api/users/:id/transfer-ownership — Owner only
router.post('/:id/transfer-ownership', authenticate, requireRole('owner'), (req: Request, res: Response) => {
  const target = userRepo.findById(req.params.id)
  if (!target) {
    res.status(404).json({ error: 'User not found' })
    return
  }
  if (target.id === req.user!.sub) {
    res.status(409).json({ error: 'You are already the owner' })
    return
  }
  userRepo.transferOwnership(target.id, req.user!.sub)
  res.json({ data: { message: `Ownership transferred to ${target.username}` } })
})

// POST /api/users/register — create a new regular user (owner only)
router.post('/register', authenticate, requireRole('owner'), async (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(422).json({ error: 'Username and password are required' })
    return
  }
  const existing = userRepo.findByUsername(username)
  if (existing) {
    res.status(409).json({ error: 'Username already taken' })
    return
  }
  const { hashPassword } = await import('../auth/password')
  const hash = await hashPassword(password)
  const user = userRepo.create(username, hash, 'user')
  res.status(201).json({ data: mapUser(user) })
})

function mapUser(u: userRepo.UserRow) {
  return {
    id: u.id,
    username: u.username,
    role: u.role,
    createdAt: u.created_at,
  }
}

export default router
