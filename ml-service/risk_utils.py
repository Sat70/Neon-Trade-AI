from __future__ import annotations

import numpy as np
import pandas as pd


def normalize_0_1(value: float, min_value: float, max_value: float) -> float:
    if max_value <= min_value:
        return 0.0
    clipped = np.clip(value, min_value, max_value)
    return (clipped - min_value) / (max_value - min_value)


def compute_volatility(returns: pd.Series, window: int = 20) -> float:
    rolling_std = returns.rolling(window=window, min_periods=3).std().dropna()
    if rolling_std.empty:
        raw_volatility = float(returns.std() if not returns.empty else 0.0)
    else:
        raw_volatility = float(rolling_std.iloc[-1])
    return normalize_0_1(raw_volatility, 0.0, 0.08)


def compute_max_drawdown(close_prices: pd.Series) -> float:
    if close_prices.empty:
        return 0.0
    running_peak = close_prices.cummax()
    drawdowns = ((running_peak - close_prices) / running_peak.replace(0, np.nan)) * 100
    return float(drawdowns.max(skipna=True) or 0.0)


def compute_prediction_uncertainty(predictions: list[dict]) -> float:
    if not predictions:
        return 0.0
    spreads = [float(point["upper"]) - float(point["lower"]) for point in predictions]
    return float(np.mean(spreads))


def compute_price_stability(volatility_norm: float) -> float:
    return float(max(0.0, min(1.0, 1.0 - volatility_norm)))


def compute_beta_approximation(asset_returns: pd.Series, spy_returns: pd.Series) -> float:
    aligned = pd.concat([asset_returns, spy_returns], axis=1).dropna()
    if aligned.empty:
        return 1.0
    corr = aligned.iloc[:, 0].corr(aligned.iloc[:, 1])
    if pd.isna(corr):
        return 1.0
    return float(corr)

