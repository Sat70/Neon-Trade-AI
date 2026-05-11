from __future__ import annotations

from typing import Iterable

import numpy as np


def compute_trend_slope(predicted_prices: Iterable[float]) -> float:
    values = np.array(list(predicted_prices), dtype=float)
    if values.size < 2:
        return 0.0
    x_axis = np.arange(values.size, dtype=float)
    slope = np.polyfit(x_axis, values, 1)[0]
    return float(slope)


def compute_consistency(predicted_prices: Iterable[float]) -> float:
    values = np.array(list(predicted_prices), dtype=float)
    if values.size < 2:
        return 0.5
    deltas = np.diff(values)
    upward_moves = np.sum(deltas > 0)
    return float(upward_moves / deltas.size)


def build_signal_features(price_payload: dict) -> dict:
    predictions = price_payload.get("predictions", [])
    if not predictions:
        raise ValueError("Price payload must include non-empty predictions.")

    current_price = float(price_payload.get("current_price", 0) or 0)
    if current_price <= 0:
        current_price = float(predictions[0]["current"])

    predicted_prices = [float(point["predicted"]) for point in predictions]
    upper_values = [float(point["upper"]) for point in predictions]
    lower_values = [float(point["lower"]) for point in predictions]

    last_predicted = predicted_prices[-1]
    predicted_return = ((last_predicted - current_price) / current_price) * 100
    volatility_range = float(np.mean(np.array(upper_values) - np.array(lower_values)))
    trend_strength = compute_trend_slope(predicted_prices)
    consistency = compute_consistency(predicted_prices)

    return {
        "predicted_return": float(predicted_return),
        "volatility_range": volatility_range,
        "trend_strength": trend_strength,
        "consistency": consistency,
        "current_price": current_price,
        "last_predicted": last_predicted,
    }


def label_to_signal(label: int) -> str:
    if label == 1:
        return "Bullish"
    if label == -1:
        return "Bearish"
    return "Neutral"


def risk_level_from_volatility(volatility_range: float, current_price: float) -> str:
    normalized_volatility = volatility_range / max(current_price, 1e-6)
    if normalized_volatility < 0.03:
        return "Low"
    if normalized_volatility < 0.07:
        return "Medium"
    return "High"


def rating_from_score(score: float) -> str:
    if score >= 0.9:
        return "A+"
    if score >= 0.82:
        return "A"
    if score >= 0.74:
        return "A-"
    if score >= 0.66:
        return "B+"
    if score >= 0.58:
        return "B"
    if score >= 0.5:
        return "B-"
    return "C+"

