import { Schema, model, Document } from 'mongoose'

export interface PredictionDocument extends Document {
  symbol: string
  direction: 'bullish' | 'bearish' | 'neutral'
  timeframe: string
  confidence: number
  targetPrice: number
  generatedAt: Date
  createdBy?: Schema.Types.ObjectId
}

const predictionSchema = new Schema<PredictionDocument>(
  {
    symbol: { type: String, required: true, index: true },
    direction: {
      type: String,
      enum: ['bullish', 'bearish', 'neutral'],
      default: 'neutral',
    },
    timeframe: { type: String, default: '24h' },
    confidence: { type: Number, min: 0, max: 1, default: 0.5 },
    targetPrice: { type: Number, required: true },
    generatedAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export const Prediction = model<PredictionDocument>('Prediction', predictionSchema)

