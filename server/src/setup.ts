import { countOwners, create } from './repositories/userRepository'
import { hashPassword } from './auth/password'

export async function ensureOwnerExists(): Promise<void> {
  const ownerCount = countOwners()
  if (ownerCount > 0) return

  const username = process.env.OWNER_USERNAME || 'owner'
  const password = process.env.OWNER_PASSWORD || 'changeme123'

  console.log(`[setup] No owner found. Creating owner account: "${username}"`)
  const hash = await hashPassword(password)
  create(username, hash, 'owner')
  console.log('[setup] Owner account created successfully.')
}
