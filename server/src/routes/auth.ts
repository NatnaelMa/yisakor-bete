import { Router, Request, Response } from 'express'
import { findByUsername } from '../repositories/userRepository'
import { verifyPassword } from '../auth/password'
import { signToken } from '../auth/jwt'
import { authenticate } from '../middleware/authenticate'

const router = Router()

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }
  const user = findByUsername(username)
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }
  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }
  const token = signToken({ sub: user.id, role: user.role })
  res.cookie('token', token, COOKIE_OPTIONS)
  res.json({
    data: {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.created_at,
    },
  })
})

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token')
  res.json({ data: { message: 'Logged out successfully' } })
})

// GET /api/auth/me
router.get('/me', authenticate, (req: Request, res: Response) => {
  const user = req.user!
  res.json({
    data: {
      id: user.sub,
      role: user.role,
    },
  })
})

export default router
