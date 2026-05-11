from __future__ import annotations

import os
from typing import Literal

from prompt_templates import (
    SYSTEM_TONE,
    build_compare_prompt,
    build_overview_prompt,
    build_prediction_prompt,
)

InsightType = Literal["overview", "prediction", "compare"]


def _fallback_response(insight_type: InsightType, data: dict) -> str:
    if insight_type == "overview":
        top = data.get("top_signals", [])
        sentiment = data.get("market_sentiment", "mixed")
        return (
            f"Market tone is {sentiment}, with strongest confidence clustered in {', '.join(top[:2]) or 'core large-cap names'}. "
            "Risk-adjusted momentum remains constructive, but dispersion suggests selective positioning."
        )
    if insight_type == "prediction":
        ticker = data.get("ticker", "This asset")
        signal = data.get("signal", "Neutral")
        expected = data.get("expected_return", 0)
        risk = data.get("risk_level", "Medium")
        return (
            f"{ticker} shows a {signal.lower()} setup with expected return near {expected}%. "
            f"Indicator alignment supports the move, while {risk.lower()} risk and volatility justify disciplined entries."
        )
    best = data.get("best_ticker", "the highest-confidence asset")
    return (
        f"Among selected assets, {best} currently presents the strongest risk-reward balance. "
        "Confidence and drawdown profile are more favorable versus peers, supporting it as the primary allocation candidate."
    )


def _call_openai(prompt: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not configured")

    from openai import OpenAI

    client = OpenAI(api_key=api_key)
    response = client.responses.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
        input=[
            {"role": "system", "content": SYSTEM_TONE},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
        max_output_tokens=180,
    )
    text = (response.output_text or "").strip()
    if not text:
        raise RuntimeError("LLM returned empty response")
    return text


def generate_llm_insight(insight_type: InsightType, data: dict) -> dict:
    if insight_type == "overview":
        prompt = build_overview_prompt(data)
    elif insight_type == "prediction":
        prompt = build_prediction_prompt(data)
    elif insight_type == "compare":
        prompt = build_compare_prompt(data)
    else:
        raise ValueError(f"Unsupported insight type '{insight_type}'.")

    try:
        text = _call_openai(prompt)
    except Exception:
        text = _fallback_response(insight_type, data)

    if insight_type == "overview":
        return {"insight": text}
    if insight_type == "prediction":
        return {"reasoning": text}
    return {"verdict": text}

