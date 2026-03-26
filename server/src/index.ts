import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRouter from './routes/auth'
import studentsRouter from './routes/students'
import usersRouter from './routes/users'
import { ensureOwnerExists } from './setup'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/students', studentsRouter)
app.use('/api/users', usersRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'ይሳኮር ቤቴ' })
})

async function start() {
  await ensureOwnerExists()
  app.listen(PORT, () => {
    console.log(`[server] ይሳኮር ቤቴ running on http://localhost:${PORT}`)
  })
}

start().catch(console.error)

export default app
