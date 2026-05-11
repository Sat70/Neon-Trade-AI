from __future__ import annotations

import numpy as np

from scenario_utils import (
    ensure_probability_sum,
    estimate_drift_from_predictions,
    monte_carlo_terminal_returns,
    rounded_probability,
    scenario_risk_from_volatility,
)


def generate_scenarios(payload: dict, num_paths: int = 800) -> dict:
    ticker = str(payload.get("ticker", "")).upper()
    horizon = payload.get("horizon")
    predictions = payload.get("predictions") or []
    if not predictions:
        raise ValueError("Scenario generation requires prediction outputs.")

    current_price = float(payload.get("current_price", predictions[0].get("current", 0)) or 0)
    if current_price <= 0:
        raise ValueError("Current price is required for scenario generation.")

    predicted_values = [float(point["predicted"]) for point in predictions]
    steps = len(predicted_values)
    risk_score = float(payload.get("risk_score", 0.5))
    volatility = float(payload.get("volatility", 0.3))
    drift = estimate_drift_from_predictions(predicted_values, current_price)
    adjusted_volatility = float(np.clip(volatility + (risk_score * 0.08), 0.01, 1.5))

    terminal_returns = monte_carlo_terminal_returns(
        current_price=current_price,
        steps=steps,
        num_paths=max(500, min(1200, num_paths)),
        drift_per_step=drift,
        volatility=adjusted_volatility,
        seed=42,
    )

    p20, p50, p80 = np.percentile(terminal_returns, [20, 50, 80])

    bull_prob = rounded_probability(float(np.mean(terminal_returns >= p80) * 100))
    bear_prob = rounded_probability(float(np.mean(terminal_returns <= p20) * 100))
    base_prob = rounded_probability(100 - bull_prob - bear_prob)
    bull_prob, base_prob, bear_prob = ensure_probability_sum([bull_prob, base_prob, bear_prob])

    base_risk = scenario_risk_from_volatility(volatility)
    bull_risk = "Medium" if base_risk == "Low" else base_risk
    bear_risk = "High" if base_risk != "High" else base_risk

    return {
        "ticker": ticker,
        "horizon": horizon,
        "simulations": int(max(500, min(1200, num_paths))),
        "scenarios": [
            {
                "name": "Bull Case",
                "expectedReturn": round(float(p80), 2),
                "probability": bull_prob,
                "risk": bull_risk,
            },
            {
                "name": "Base Case",
                "expectedReturn": round(float(p50), 2),
                "probability": base_prob,
                "risk": base_risk,
            },
            {
                "name": "Bear Case",
                "expectedReturn": round(float(p20), 2),
                "probability": bear_prob,
                "risk": bear_risk,
            },
        ],
    }

