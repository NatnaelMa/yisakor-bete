import client from './client'
import type { User } from '../../../shared/types'

export const usersApi = {
  async list(): Promise<User[]> {
    const res = await client.get('/users')
    return res.data.data
  },
  async register(username: string, password: string): Promise<User> {
    const res = await client.post('/users/register', { username, password })
    return res.data.data
  },
  async grantAdmin(id: string): Promise<void> {
    await client.post(`/users/${id}/grant-admin`)
  },
  async revokeAdmin(id: string): Promise<void> {
    await client.post(`/users/${id}/revoke-admin`)
  },
  async transferOwnership(id: string): Promise<void> {
    await client.post(`/users/${id}/transfer-ownership`)
  },
}
