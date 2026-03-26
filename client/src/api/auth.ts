import client from './client'

export const authApi = {
  async login(username: string, password: string) {
    const res = await client.post('/auth/login', { username, password })
    return res.data.data
  },
  async logout() {
    await client.post('/auth/logout')
  },
  async me() {
    const res = await client.get('/auth/me')
    return res.data.data
  },
}
