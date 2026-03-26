import db from '../db'
import { v4 as uuidv4 } from 'uuid'
import type { Role } from '../../../shared/types'

export interface UserRow {
  id: string
  username: string
  password_hash: string
  role: Role
  created_at: string
}

export function findById(id: string): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined
}

export function findByUsername(username: string): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username) as UserRow | undefined
}

export function listAll(): UserRow[] {
  return db.prepare('SELECT * FROM users ORDER BY created_at ASC').all() as UserRow[]
}

export function create(username: string, passwordHash: string, role: Role): UserRow {
  const id = uuidv4()
  const now = new Date().toISOString()
  db.prepare(
    'INSERT INTO users (id, username, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(id, username, passwordHash, role, now)
  return findById(id)!
}

export function updateRole(id: string, role: Role): void {
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id)
}

export function countOwners(): number {
  const row = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'owner'").get() as { count: number }
  return row.count
}

export function transferOwnership(newOwnerId: string, oldOwnerId: string): void {
  const transfer = db.transaction(() => {
    db.prepare("UPDATE users SET role = 'owner' WHERE id = ?").run(newOwnerId)
    db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(oldOwnerId)
  })
  transfer()
}
