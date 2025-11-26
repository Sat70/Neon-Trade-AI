import { Schema, model, Document } from 'mongoose'

export interface UserDocument extends Document {
  name: string
  email: string
  password: string
  createdAt: Date
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export const User = model<UserDocument>('User', userSchema)

