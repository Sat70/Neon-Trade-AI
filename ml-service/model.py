from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

from data_loader import fetch_ohlcv_data
from utils import HORIZON_CONFIG, validate_horizon, validate_ticker


def _compute_rsi(close_prices: pd.Series, period: int = 14) -> pd.Series:
    delta = close_prices.diff()
    gains = delta.clip(lower=0)
    losses = -delta.clip(upper=0)

    avg_gain = gains.rolling(window=period, min_periods=period).mean()
    avg_loss = losses.rolling(window=period, min_periods=period).mean()
    rs = avg_gain / avg_loss.replace(0, np.nan)
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50.0)


def _build_features(ohlcv: pd.DataFrame) -> pd.DataFrame:
    frame = ohlcv.copy()
    frame["returns"] = frame["Close"].pct_change()
    frame["ma10"] = frame["Close"].rolling(window=10, min_periods=1).mean()
    frame["ma20"] = frame["Close"].rolling(window=20, min_periods=1).mean()
    frame["rsi"] = _compute_rsi(frame["Close"])
    frame["ema12"] = frame["Close"].ewm(span=12, adjust=False).mean()
    frame["ema26"] = frame["Close"].ewm(span=26, adjust=False).mean()
    frame["macd"] = frame["ema12"] - frame["ema26"]
    frame["volatility"] = frame["returns"].rolling(window=10, min_periods=2).std()
    frame["volatility"] = frame["volatility"].fillna(frame["volatility"].median())
    return frame.dropna().copy()


def _select_feature_columns(frame: pd.DataFrame) -> list[str]:
    return [
        "Open",
        "High",
        "Low",
        "Close",
        "Volume",
        "returns",
        "ma10",
        "ma20",
        "rsi",
        "macd",
        "volatility",
    ]


def generate_predictions(ticker: str, horizon: str) -> dict:
    symbol = validate_ticker(ticker)
    horizon_key = validate_horizon(horizon)
    config = HORIZON_CONFIG[horizon_key]
    steps = config["steps"]
    label_prefix = config["label_prefix"]

    ohlcv = fetch_ohlcv_data(symbol, horizon_key)
    feature_frame = _build_features(ohlcv)
    if len(feature_frame) < 40:
        raise ValueError("Not enough data points to train model.")

    feature_columns = _select_feature_columns(feature_frame)
    scaler = StandardScaler()
    X = scaler.fit_transform(feature_frame[feature_columns])
    y = feature_frame["Close"].values

    model = RandomForestRegressor(n_estimators=240, random_state=42, n_jobs=-1)
    model.fit(X, y)

    recent = feature_frame.iloc[-1].copy()
    returns_std = max(feature_frame["returns"].std(), 1e-4)
    current_price = float(feature_frame["Close"].iloc[-1])

    points = []
    for step in range(1, steps + 1):
        feature_vector = scaler.transform(recent[feature_columns].to_frame().T)
        predicted = float(model.predict(feature_vector)[0])
        band = float(max(predicted * returns_std * 1.5, 0.01))

        points.append(
            {
                "label": f"{label_prefix}{step}",
                "current": round(current_price, 4),
                "predicted": round(predicted, 4),
                "upper": round(predicted + band, 4),
                "lower": round(max(predicted - band, 0), 4),
            }
        )

        synthetic_return = (predicted / recent["Close"]) - 1 if recent["Close"] else 0.0
        recent["Open"] = recent["Close"]
        recent["High"] = max(predicted, recent["Close"])
        recent["Low"] = min(predicted, recent["Close"])
        recent["Close"] = predicted
        recent["Volume"] = float(feature_frame["Volume"].iloc[-10:].mean())
        recent["returns"] = synthetic_return
        recent["ma10"] = ((recent["ma10"] * 9) + predicted) / 10
        recent["ma20"] = ((recent["ma20"] * 19) + predicted) / 20
        recent["ema12"] = (predicted * (2 / 13)) + (recent["ema12"] * (11 / 13))
        recent["ema26"] = (predicted * (2 / 27)) + (recent["ema26"] * (25 / 27))
        recent["macd"] = recent["ema12"] - recent["ema26"]
        recent_returns = pd.concat(
            [feature_frame["returns"].tail(9), pd.Series([synthetic_return])],
            ignore_index=True,
        )
        recent["volatility"] = float(max(recent_returns.std(), 1e-4))
        recent["rsi"] = float(np.clip(recent["rsi"] + (synthetic_return * 250), 5, 95))

    return {
        "ticker": symbol,
        "horizon": horizon_key,
        "current_price": round(current_price, 4),
        "predictions": points,
    }

