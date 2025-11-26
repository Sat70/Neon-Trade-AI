import { Schema, Document } from 'mongoose';
export interface PredictionDocument extends Document {
    symbol: string;
    direction: 'bullish' | 'bearish' | 'neutral';
    timeframe: string;
    confidence: number;
    targetPrice: number;
    generatedAt: Date;
    createdBy?: Schema.Types.ObjectId;
}
export declare const Prediction: import("mongoose").Model<PredictionDocument, {}, {}, {}, Document<unknown, {}, PredictionDocument, {}, import("mongoose").DefaultSchemaOptions> & PredictionDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any, PredictionDocument>;
//# sourceMappingURL=Prediction.d.ts.map