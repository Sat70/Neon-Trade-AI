from __future__ import annotations

import numpy as np
import pandas as pd


def normalize_series(values: pd.Series) -> pd.Series:
    if values.empty:
        return values
    min_v = values.min()
    max_v = values.max()
    if max_v == min_v:
        return pd.Series([0.5] * len(values), index=values.index)
    return (values - min_v) / (max_v - min_v)


def compute_rsi(prices: pd.Series, period: int = 14) -> pd.Series:
    delta = prices.diff()
    gains = delta.clip(lower=0)
    losses = -delta.clip(upper=0)
    avg_gain = gains.rolling(window=period, min_periods=period).mean()
    avg_loss = losses.rolling(window=period, min_periods=period).mean()
    rs = avg_gain / avg_loss.replace(0, np.nan)
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50)


def compute_macd(prices: pd.Series) -> tuple[pd.Series, pd.Series]:
    ema12 = prices.ewm(span=12, adjust=False).mean()
    ema26 = prices.ewm(span=26, adjust=False).mean()
    macd = ema12 - ema26
    signal = macd.ewm(span=9, adjust=False).mean()
    return macd, signal


def slope(values: pd.Series) -> float:
    if len(values) < 2:
        return 0.0
    x = np.arange(len(values))
    return float(np.polyfit(x, values.values.astype(float), 1)[0])


def to_slot_label(index: int, horizon: str) -> str:
    if horizon == "intraday":
        hour = 9 + (index // 2)
        minute = "30" if index % 2 == 0 else "00"
        return f"{hour:02d}:{minute}"
    if horizon == "short-term":
        return f"D{index + 1}"
    return f"P{index + 1}"

