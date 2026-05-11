"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prediction = void 0;
const mongoose_1 = require("mongoose");
const predictionSchema = new mongoose_1.Schema({
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
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
exports.Prediction = (0, mongoose_1.model)('Prediction', predictionSchema);
//# sourceMappingURL=Prediction.js.map