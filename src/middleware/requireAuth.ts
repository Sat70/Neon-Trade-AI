import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
  id: string
  email: string
  name: string
  age: number
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload
}

const JWT_SECRET = process.env.JWT_SECRET

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token =
    req.cookies?.token ??
    (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null)

  if (!token) {
    res.status(401).json({ message: 'Authentication required' })
    return
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET not set')
    res.status(500).json({ message: 'Server misconfiguration' })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
