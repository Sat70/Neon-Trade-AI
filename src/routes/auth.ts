import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User, type UserDocument } from '../models/User'
import { requireAuth, type AuthenticatedRequest } from '../middleware/requireAuth'
import rateLimit from 'express-rate-limit'

const authRouter = Router()
const SALT_ROUNDS = 12
const TOKEN_EXPIRY = '7d'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

// Rate limit: only in production to prevent brute-force; disabled in development
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many attempts. Try again later.' },
})

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email: unknown): email is string {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim())
}

function toSafeUser(user: UserDocument) {
  return {
    id: user._id.toString(),
    name: user.name,
    age: user.age,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  }
}

function signToken(payload: { id: string; email: string; name: string; age: number }): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not set')
  return jwt.sign(payload, secret, { expiresIn: TOKEN_EXPIRY })
}

// Apply rate limiter only in production (no "Too many attempts" during development)
if (process.env.NODE_ENV === 'production') {
  authRouter.use(authLimiter)
}

// POST /api/auth/signup - Register a new user
authRouter.post('/signup', async (req: Request, res: Response): Promise<void> => {
  const { name, age, email, password } = req.body ?? {}

  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ message: 'Name is required' })
    return
  }

  const ageNum = typeof age === 'string' ? parseInt(age, 10) : age
  if (typeof ageNum !== 'number' || Number.isNaN(ageNum) || ageNum < 18) {
    res.status(400).json({ message: 'Age must be 18 or older' })
    return
  }

  if (!validateEmail(email)) {
    res.status(400).json({ message: 'Valid email is required' })
    return
  }

  const trimmedEmail = (email as string).trim().toLowerCase()

  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters' })
    return
  }

  try {
    // Check if email already exists
    const existing = await User.findOne({ email: trimmedEmail })
    if (existing) {
      res.status(400).json({ message: 'Email already registered' })
      return
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await User.create({
      name: name.trim(),
      age: ageNum,
      email: trimmedEmail,
      password: hashedPassword,
    })

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      age: user.age,
    })

    res.cookie('token', token, COOKIE_OPTIONS)
    res.status(201).json({
      user: toSafeUser(user),
      token,
    })
  } catch (err) {
    console.error('Signup error', err)
    res.status(500).json({ message: 'Registration failed' })
  }
})

// POST /api/auth/login - Authenticate user
authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body ?? {}

  if (!validateEmail(email)) {
    res.status(400).json({ message: 'Valid email is required' })
    return
  }

  if (!password || typeof password !== 'string') {
    res.status(400).json({ message: 'Password is required' })
    return
  }

  const trimmedEmail = (email as string).trim().toLowerCase()

  try {
    const user = await User.findOne({ email: trimmedEmail })
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' })
      return
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      res.status(401).json({ message: 'Invalid email or password' })
      return
    }

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      age: user.age,
    })

    res.cookie('token', token, COOKIE_OPTIONS)
    res.json({
      user: toSafeUser(user),
      token,
    })
  } catch (err) {
    console.error('Login error', err)
    res.status(500).json({ message: 'Login failed' })
  }
})

// POST /api/auth/logout - Clear auth cookie
authRouter.post('/logout', (_req: Request, res: Response): void => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
  res.json({ message: 'Logged out' })
})

// GET /api/auth/me - Get current authenticated user
authRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      res.status(401).json({ message: 'User not found' })
      return
    }
    res.json({ user: toSafeUser(user) })
  } catch (err) {
    console.error('Me error', err)
    res.status(500).json({ message: 'Failed to fetch user' })
  }
})

export default authRouter
