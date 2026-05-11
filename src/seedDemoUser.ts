import bcrypt from 'bcryptjs'
import { User } from './models/User'

const DEMO_EMAIL = 'demo@neontrade.ai'
const DEMO_PASSWORD = 'Demo123!'
const SALT_ROUNDS = 12

export async function seedDemoUser(): Promise<void> {
  try {
    const existing = await User.findOne({ email: DEMO_EMAIL })
    if (existing) {
      console.log('Demo user already exists:', DEMO_EMAIL)
      return
    }

    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS)
    await User.create({
      name: 'Demo User',
      age: 25,
      email: DEMO_EMAIL,
      password: hashedPassword,
    })
    console.log('Demo user created successfully.')
    console.log('  Email:', DEMO_EMAIL)
    console.log('  Password:', DEMO_PASSWORD)
    console.log('  (Use these to test login)')
  } catch (err) {
    console.error('Failed to seed demo user:', (err as Error).message)
  }
}
