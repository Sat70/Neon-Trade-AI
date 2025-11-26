import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    name: string
  }
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  const secret = process.env.JWT_SECRET

  if (!secret) {
    console.error('JWT_SECRET not configured.')
    return res.status(500).json({ message: 'Server misconfiguration.' })
  }

  try {
    const decoded = jwt.verify(token, secret) as AuthenticatedRequest['user']
    req.user = decoded
    return next()
  } catch (error) {
    console.error('JWT verification failed', error)
    return res.status(401).json({ message: 'Invalid token.' })
  }
}

