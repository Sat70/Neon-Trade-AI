from __future__ import annotations

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

from signal_utils import (
    build_signal_features,
    label_to_signal,
    rating_from_score,
    risk_level_from_volatility,
)


def _simulate_training_dataset() -> tuple[np.ndarray, np.ndarray]:
    rng = np.random.default_rng(seed=42)
    sample_size = 900
    predicted_returns = rng.normal(loc=2.0, scale=6.0, size=sample_size)
    volatility_ranges = np.abs(rng.normal(loc=6.0, scale=2.5, size=sample_size))
    trend_strengths = rng.normal(loc=0.0, scale=1.8, size=sample_size)
    consistency = np.clip(rng.normal(loc=0.55, scale=0.2, size=sample_size), 0, 1)

    features = np.column_stack(
        [predicted_returns, volatility_ranges, trend_strengths, consistency]
    )

    labels = np.where(predicted_returns > 5, 1, np.where(predicted_returns < -2, -1, 0))
    return features, labels


def _fit_signal_classifier() -> tuple[StandardScaler, RandomForestClassifier]:
    X_train, y_train = _simulate_training_dataset()
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_train)
    model = RandomForestClassifier(
        n_estimators=240,
        random_state=42,
        class_weight="balanced_subsample",
        n_jobs=-1,
    )
    model.fit(X_scaled, y_train)
    return scaler, model


_SCALER, _MODEL = _fit_signal_classifier()
_CLASS_TO_INDEX = {int(label): idx for idx, label in enumerate(_MODEL.classes_)}


def generate_signal(price_payload: dict, risk_payload: dict | None = None) -> dict:
    features = build_signal_features(price_payload)
    vector = np.array(
        [
            [
                features["predicted_return"],
                features["volatility_range"],
                features["trend_strength"],
                features["consistency"],
            ]
        ],
        dtype=float,
    )
    scaled = _SCALER.transform(vector)
    predicted_label = int(_MODEL.predict(scaled)[0])
    probabilities = _MODEL.predict_proba(scaled)[0]
    confidence = float(probabilities[_CLASS_TO_INDEX[predicted_label]] * 100)

    recommendation_score = float(
        np.clip(
            (features["predicted_return"] / 20) * 0.45
            + features["consistency"] * 0.3
            + (1 / (1 + max(features["volatility_range"], 0.01))) * 0.25,
            0,
            1,
        )
    )

    risk_level = risk_level_from_volatility(
        features["volatility_range"], features["current_price"]
    )
    if risk_payload:
        risk_level = str(risk_payload.get("risk_level", risk_level))

    response = {
        "ticker": str(price_payload.get("ticker", "")).upper(),
        "horizon": price_payload.get("horizon"),
        "current_price": round(features["current_price"], 4),
        "signal": label_to_signal(predicted_label),
        "confidence": round(confidence, 2),
        "expected_return": round(features["predicted_return"], 2),
        "recommendation_score": round(recommendation_score, 4),
        "risk_level": risk_level,
        "rating": rating_from_score(recommendation_score),
        "features": {
            "volatility_range": round(features["volatility_range"], 4),
            "trend_strength": round(features["trend_strength"], 6),
            "consistency": round(features["consistency"], 4),
        },
    }
    if risk_payload:
        response["risk_score"] = risk_payload.get("risk_score")
        response["drawdown_risk"] = risk_payload.get("drawdown_risk")
        response["volatility"] = risk_payload.get("volatility")
    return response

