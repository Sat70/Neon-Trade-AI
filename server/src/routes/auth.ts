import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prisma'

const authRouter = Router()
const TOKEN_EXPIRY = '7d'

const buildToken = (payload: { id: string; email: string; name: string }) => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }
  return jwt.sign(payload, secret, { expiresIn: TOKEN_EXPIRY })
}

authRouter.post('/register', async (req, res) => {
  const { name, email, password } = req.body ?? {}

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' })
  }

  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' })
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    const token = buildToken({ id: user.id, email: user.email, name: user.name })
    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    })
  } catch (error: unknown) {
    console.error('Register error', error)
    return res.status(500).json({ message: 'Failed to register user.' })
  }
})

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {}

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = buildToken({ id: user.id, email: user.email, name: user.name })
    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    })
  } catch (error) {
    console.error('Login error', error)
    return res.status(500).json({ message: 'Failed to login.' })
  }
})

export default authRouter

