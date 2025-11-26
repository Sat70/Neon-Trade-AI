"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const samplePredictions = [
    {
        symbol: 'AAPL',
        direction: 'bullish',
        timeframe: '24h',
        confidence: 0.82,
        targetPrice: 212.4,
        generatedAt: new Date().toISOString(),
    },
    {
        symbol: 'NVDA',
        direction: 'bullish',
        timeframe: '48h',
        confidence: 0.76,
        targetPrice: 134.2,
        generatedAt: new Date().toISOString(),
    },
    {
        symbol: 'TSLA',
        direction: 'neutral',
        timeframe: '24h',
        confidence: 0.58,
        targetPrice: 222.1,
        generatedAt: new Date().toISOString(),
    },
];
router.get('/', (_req, res) => {
    res.json({ predictions: samplePredictions });
});
router.post('/', (_req, res) => {
    res.status(501).json({ message: 'Create prediction not implemented yet.' });
});
router.put('/:id', (_req, res) => {
    res.status(501).json({ message: 'Update prediction not implemented yet.' });
});
router.delete('/:id', (_req, res) => {
    res.status(501).json({ message: 'Delete prediction not implemented yet.' });
});
exports.default = router;
//# sourceMappingURL=predictionRoutes.js.map