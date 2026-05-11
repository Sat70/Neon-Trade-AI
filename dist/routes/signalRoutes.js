"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const ML_SERVICE_BASE_URL = process.env.ML_SERVICE_URL ?? 'http://127.0.0.1:8000';
const VALID_HORIZONS = new Set(['intraday', 'short-term', 'long-term']);
const VALID_TICKERS = new Set(['AAPL', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'AMD', 'META', 'SPY']);
const CACHE_TTL_MS = 2 * 60 * 1000;
const cache = new Map();
function deriveSignalFromPredictionPayload(ticker, horizon, payload) {
    const parsed = payload;
    const points = Array.isArray(parsed?.predictions) ? parsed.predictions : [];
    const first = points[0];
    const last = points[points.length - 1];
    const current = Number(first?.current ?? 0);
    const predicted = Number(last?.predicted ?? current);
    const expectedReturn = current > 0 ? ((predicted - current) / current) * 100 : 0;
    let signal = 'Neutral';
    if (expectedReturn > 1.5)
        signal = 'Bullish';
    else if (expectedReturn < -1.5)
        signal = 'Bearish';
    const confidence = Math.max(55, Math.min(95, Math.round(70 + Math.abs(expectedReturn) * 2)));
    const riskLevel = Math.abs(expectedReturn) < 4 ? 'Low' : Math.abs(expectedReturn) < 10 ? 'Medium' : 'High';
    return {
        ticker,
        horizon,
        current_price: Number(current.toFixed(4)),
        signal,
        confidence,
        expected_return: Number(expectedReturn.toFixed(2)),
        recommendation_score: Number((Math.min(1, Math.abs(expectedReturn) / 20) * 0.6 + (confidence / 100) * 0.4).toFixed(4)),
        risk_level: riskLevel,
        rating: confidence >= 90 ? 'A+' : confidence >= 84 ? 'A' : confidence >= 76 ? 'A-' : confidence >= 68 ? 'B+' : 'B',
    };
}
router.get('/', async (req, res) => {
    const tickerParam = String(req.query.ticker ?? 'AAPL').toUpperCase();
    const horizonParam = String(req.query.horizon ?? 'short-term');
    const cacheKey = `${tickerParam}:${horizonParam}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
        return res.json(cached.payload);
    }
    if (!VALID_TICKERS.has(tickerParam)) {
        return res.status(400).json({
            message: `Unsupported ticker '${tickerParam}'.`,
            supportedTickers: Array.from(VALID_TICKERS),
        });
    }
    if (!VALID_HORIZONS.has(horizonParam)) {
        return res.status(400).json({
            message: `Unsupported horizon '${horizonParam}'.`,
            supportedHorizons: Array.from(VALID_HORIZONS),
        });
    }
    try {
        console.log(`Calling ML service for signal: ${tickerParam} (${horizonParam})`);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const signalUrl = `${ML_SERVICE_BASE_URL}/signal?ticker=${encodeURIComponent(tickerParam)}&horizon=${encodeURIComponent(horizonParam)}`;
        const response = await fetch(signalUrl, { signal: controller.signal });
        clearTimeout(timeout);
        const payload = await response.json();
        console.log('Signal API response:', payload);
        if (!response.ok) {
            if (response.status === 404) {
                console.warn('ML /signal endpoint not found, falling back to /predict derived signal.');
                const predictResponse = await fetch(`${ML_SERVICE_BASE_URL}/predict?ticker=${encodeURIComponent(tickerParam)}&horizon=${encodeURIComponent(horizonParam)}`, { signal: controller.signal });
                const predictPayload = await predictResponse.json();
                if (!predictResponse.ok) {
                    return res.status(predictResponse.status).json({
                        message: 'ML service returned an error',
                        details: predictPayload,
                    });
                }
                const derived = deriveSignalFromPredictionPayload(tickerParam, horizonParam, predictPayload);
                cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, payload: derived });
                return res.json(derived);
            }
            return res.status(response.status).json({
                message: 'ML service returned an error',
                details: payload,
            });
        }
        cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, payload });
        return res.json(payload);
    }
    catch (error) {
        console.error('Signal API error:', error instanceof Error ? error.message : error);
        return res.status(502).json({
            message: 'Failed to reach ML signal service.',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=signalRoutes.js.map