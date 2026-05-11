from __future__ import annotations

import json


SYSTEM_TONE = (
    "You are a professional quantitative market analyst. "
    "Write concise, analytical insights in 2-4 lines. "
    "Do not use hype. Do not invent facts not present in input."
)


def build_overview_prompt(data: dict) -> str:
    payload = json.dumps(data, ensure_ascii=True)
    return (
        "Task: Produce an overview insight summarizing market sentiment, "
        "top stock signals, and sector strength from structured model outputs.\n"
        "Output: Plain text only, 2-4 lines.\n"
        f"Data: {payload}"
    )


def build_prediction_prompt(data: dict) -> str:
    payload = json.dumps(data, ensure_ascii=True)
    return (
        "Task: Explain why this prediction is expected, citing trend, indicators, timing, and risk.\n"
        "Output: Plain text only, 2-4 lines.\n"
        f"Data: {payload}"
    )


def build_compare_prompt(data: dict) -> str:
    payload = json.dumps(data, ensure_ascii=True)
    return (
        "Task: Compare the provided stocks, pick a best candidate, and justify by risk-reward and confidence.\n"
        "Output: Plain text only, 2-4 lines.\n"
        f"Data: {payload}"
    )

