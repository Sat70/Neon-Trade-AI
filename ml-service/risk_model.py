from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

from risk_utils import (
    compute_beta_approximation,
    compute_max_drawdown,
    compute_prediction_uncertainty,
    compute_price_stability,
    compute_volatility,
    normalize_0_1,
)


def _fit_risk_regressor() -> tuple[StandardScaler, RandomForestRegressor]:
    rng = np.random.default_rng(seed=7)
    n = 1200
    volatility = np.clip(rng.normal(0.45, 0.22, n), 0, 1)
    drawdown = np.clip(rng.normal(16, 9, n), 0, 60)
    uncertainty = np.clip(rng.normal(5, 2.5, n), 0, 20)
    stability = np.clip(1 - volatility + rng.normal(0, 0.04, n), 0, 1)
    beta = np.clip(rng.normal(0.9, 0.45, n), -1, 2)

    X = np.column_stack([volatility, drawdown, uncertainty, stability, beta])
    score = np.clip(
        0.35 * volatility
        + 0.3 * (drawdown / 35)
        + 0.2 * (uncertainty / 12)
        + 0.1 * normalize_0_1(beta, -1, 2)
        + 0.05 * (1 - stability),
        0,
        1,
    )

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    model = RandomForestRegressor(n_estimators=260, random_state=11, n_jobs=-1)
    model.fit(X_scaled, score)
    return scaler, model


_SCALER, _MODEL = _fit_risk_regressor()


def _risk_level(score: float) -> str:
    if score < 0.33:
        return "Low"
    if score < 0.66:
        return "Medium"
    return "High"


def generate_risk_assessment(payload: dict) -> dict:
    ticker = str(payload.get("ticker", "")).upper()
    horizon = payload.get("horizon")
    historical_prices = payload.get("historical_prices") or []
    predictions = payload.get("predictions") or []
    spy_historical_prices = payload.get("spy_historical_prices") or []

    close_series = pd.Series(historical_prices, dtype=float)
    returns = close_series.pct_change().dropna()
    spy_series = pd.Series(spy_historical_prices, dtype=float)
    spy_returns = spy_series.pct_change().dropna()

    volatility = compute_volatility(returns)
    drawdown_risk = compute_max_drawdown(close_series)
    prediction_uncertainty = compute_prediction_uncertainty(predictions)
    price_stability = compute_price_stability(volatility)
    beta_approx = compute_beta_approximation(returns, spy_returns)

    feature_row = np.array(
        [[volatility, drawdown_risk, prediction_uncertainty, price_stability, beta_approx]],
        dtype=float,
    )
    score = float(np.clip(_MODEL.predict(_SCALER.transform(feature_row))[0], 0, 1))

    return {
        "ticker": ticker,
        "horizon": horizon,
        "risk_score": round(score, 4),
        "risk_level": _risk_level(score),
        "volatility": round(volatility, 4),
        "drawdown_risk": round(drawdown_risk, 2),
        "beta": round(beta_approx, 4),
        "prediction_uncertainty": round(prediction_uncertainty, 4),
        "price_stability": round(price_stability, 4),
    }

