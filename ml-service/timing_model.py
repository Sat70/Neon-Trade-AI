from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

from timing_utils import compute_macd, compute_rsi, normalize_series, slope, to_slot_label


def _fit_timing_classifier() -> tuple[StandardScaler, RandomForestClassifier]:
    rng = np.random.default_rng(seed=21)
    n = 1200
    momentum = np.clip(rng.normal(0.5, 0.25, n), 0, 1)
    rsi = np.clip(rng.normal(50, 18, n), 0, 100)
    macd_diff = rng.normal(0, 0.8, n)
    volume_spike = np.clip(rng.normal(0.5, 0.25, n), 0, 1)
    trend = rng.normal(0, 0.5, n)

    X = np.column_stack([momentum, rsi, macd_diff, volume_spike, trend])
    labels = []
    for i in range(n):
        entry = rsi[i] < 35 and macd_diff[i] > 0 and momentum[i] > 0.5
        exit_ = rsi[i] > 65 and macd_diff[i] < 0 and momentum[i] < 0.5
        if entry:
            labels.append(2)
        elif exit_:
            labels.append(-2)
        elif momentum[i] > 0.55:
            labels.append(1)
        elif momentum[i] < 0.4:
            labels.append(-1)
        else:
            labels.append(0)

    scaler = StandardScaler()
    model = RandomForestClassifier(n_estimators=260, random_state=21, n_jobs=-1)
    model.fit(scaler.fit_transform(X), np.array(labels))
    return scaler, model


_SCALER, _MODEL = _fit_timing_classifier()
_CLASS_INDEX = {int(cls): idx for idx, cls in enumerate(_MODEL.classes_)}

_SIGNAL_LABELS = {
    2: "Strong Buy",
    1: "Buy",
    0: "Neutral",
    -1: "Sell",
    -2: "Strong Sell",
}


def generate_timing(payload: dict) -> dict:
    ticker = str(payload.get("ticker", "")).upper()
    horizon = str(payload.get("horizon", "intraday"))
    historical_prices = pd.Series(payload.get("historical_prices", []), dtype=float)
    predictions = payload.get("predictions", [])
    historical_volume = pd.Series(payload.get("historical_volume", []), dtype=float)

    if historical_prices.empty or not predictions:
        raise ValueError("Timing model requires historical prices and prediction outputs.")

    pred_series = pd.Series([float(p["predicted"]) for p in predictions], dtype=float)
    returns = historical_prices.pct_change().fillna(0)
    momentum_series = normalize_series(returns.rolling(window=5, min_periods=2).mean().fillna(0))
    rsi_series = compute_rsi(historical_prices)
    macd, macd_signal = compute_macd(historical_prices)
    macd_diff = (macd - macd_signal).fillna(0)

    if historical_volume.empty:
        historical_volume = pd.Series([1.0] * len(historical_prices))
    vol_roll = historical_volume.rolling(window=8, min_periods=2).mean().replace(0, np.nan)
    volume_spike = (historical_volume / vol_roll).fillna(1.0)
    volume_spike_norm = normalize_series(volume_spike.clip(lower=0))

    trend_strength = slope(pred_series)

    slots = []
    steps = len(pred_series)
    for idx in range(steps):
        back_index = max(0, len(momentum_series) - steps + idx)
        momentum = float(momentum_series.iloc[back_index] if back_index < len(momentum_series) else 0.5)
        rsi_val = float(rsi_series.iloc[back_index] if back_index < len(rsi_series) else 50.0)
        macd_val = float(macd_diff.iloc[back_index] if back_index < len(macd_diff) else 0.0)
        vol_spike_val = float(volume_spike_norm.iloc[back_index] if back_index < len(volume_spike_norm) else 0.5)

        entry_condition = rsi_val < 35 and macd_val > 0 and momentum > 0.5
        exit_condition = rsi_val > 65 and macd_val < 0 and momentum < 0.5

        feature = np.array([[momentum, rsi_val, macd_val, vol_spike_val, trend_strength]], dtype=float)
        probs = _MODEL.predict_proba(_SCALER.transform(feature))[0]
        pred_class = int(_MODEL.predict(_SCALER.transform(feature))[0])
        confidence = float(probs[_CLASS_INDEX[pred_class]] * 100)

        if entry_condition:
            pred_class = max(pred_class, 1)
        if exit_condition:
            pred_class = min(pred_class, -1)

        slots.append(
            {
                "time": to_slot_label(idx, horizon),
                "signal": _SIGNAL_LABELS.get(pred_class, "Neutral"),
                "momentum": round(momentum, 3),
                "confidence": round(confidence, 2),
                "volume_spike": round(vol_spike_val, 3),
            }
        )

    best_entry = max(
        [s for s in slots if s["signal"] in {"Strong Buy", "Buy"}],
        key=lambda x: x["confidence"],
        default=slots[0],
    )
    best_exit = max(
        [s for s in slots if s["signal"] in {"Strong Sell", "Sell"}],
        key=lambda x: x["confidence"],
        default=slots[-1],
    )
    timing_score = float(
        np.clip(
            (best_entry["confidence"] / 100) * 0.6
            + (1 - best_exit["momentum"]) * 0.2
            + (abs(trend_strength) / max(abs(trend_strength) + 1, 1)) * 0.2,
            0,
            1,
        )
    )

    return {
        "ticker": ticker,
        "horizon": horizon,
        "timing": slots,
        "best_entry": best_entry["time"],
        "best_exit": best_exit["time"],
        "timing_score": round(timing_score, 4),
    }

