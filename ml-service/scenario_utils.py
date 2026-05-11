from __future__ import annotations

import numpy as np


def scenario_risk_from_volatility(volatility: float) -> str:
    if volatility < 0.3:
        return "Low"
    if volatility < 0.65:
        return "Medium"
    return "High"


def rounded_probability(probability: float) -> int:
    return int(round(max(0.0, min(100.0, probability))))


def ensure_probability_sum(probabilities: list[int], target: int = 100) -> list[int]:
    if not probabilities:
        return probabilities
    diff = target - sum(probabilities)
    adjusted = probabilities[:]
    adjusted[1] = adjusted[1] + diff
    return adjusted


def estimate_drift_from_predictions(predicted_values: list[float], current_price: float) -> float:
    if len(predicted_values) < 2 or current_price <= 0:
        return 0.0
    cumulative_return = (predicted_values[-1] - current_price) / current_price
    steps = max(len(predicted_values), 1)
    return float(cumulative_return / steps)


def monte_carlo_terminal_returns(
    current_price: float,
    steps: int,
    num_paths: int,
    drift_per_step: float,
    volatility: float,
    seed: int = 42,
) -> np.ndarray:
    rng = np.random.default_rng(seed=seed)
    shocks = rng.normal(
        loc=drift_per_step,
        scale=max(volatility * 0.35, 1e-4),
        size=(num_paths, steps),
    )
    log_returns = np.cumsum(shocks, axis=1)
    terminal_prices = current_price * np.exp(log_returns[:, -1])
    terminal_returns = ((terminal_prices - current_price) / current_price) * 100
    return terminal_returns

