#!/usr/bin/env python3
"""
Hit every ML FastAPI route once (AAPL, short-term) so uvicorn shows structured logs.
Run with ML service up: uvicorn app:app --reload --app-dir .  (from ml-service/)
"""

from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request

BASE_URL = "http://127.0.0.1:8000"
TICKER = "AAPL"
HORIZON = "short-term"


def _get(path_with_query: str) -> tuple[bool, int, str]:
    url = f"{BASE_URL}{path_with_query}"
    req = urllib.request.Request(url, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            return True, resp.status, body
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        return False, e.code, body


def _post(path: str, body: dict) -> tuple[bool, int, str]:
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=data,
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            return True, resp.status, raw
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        return False, e.code, raw


def _print_result(name: str, ok: bool, status: int, body: str) -> None:
    mark = "OK " if ok else "ERR"
    print(f"[{mark}] {name} -> HTTP {status}")
    if not ok:
        print(body[:400], flush=True)


def main() -> None:
    print(
        f"\n{'=' * 62}\n"
        "test_all_models — watch the uvicorn terminal for [PRICE] / [SIGNAL] / …\n"
        f"ticker={TICKER}  horizon={HORIZON}  base={BASE_URL}\n"
        f"{'=' * 62}\n",
        flush=True,
    )

    checks: list[tuple[str, bool]] = []

    ok, status, body = _get("/health")
    _print_result("GET /health", ok, status, body)
    checks.append(("GET /health", ok))

    ok, status, body = _get(f"/predict?ticker={TICKER}&horizon={HORIZON}")
    _print_result("GET /predict", ok, status, body)
    checks.append(("GET /predict", ok))

    ok, status, body = _get(f"/signal?ticker={TICKER}&horizon={HORIZON}")
    _print_result("GET /signal", ok, status, body)
    checks.append(("GET /signal", ok))

    ok, status, body = _get(f"/risk?ticker={TICKER}&horizon={HORIZON}")
    _print_result("GET /risk", ok, status, body)
    checks.append(("GET /risk", ok))

    ok, status, body = _get(f"/scenarios?ticker={TICKER}&horizon={HORIZON}")
    _print_result("GET /scenarios", ok, status, body)
    checks.append(("GET /scenarios", ok))

    ok, status, body = _get(f"/timing?ticker={TICKER}&horizon={HORIZON}")
    _print_result("GET /timing", ok, status, body)
    checks.append(("GET /timing", ok))

    ok, status, body = _post(
        "/llm-insights",
        {
            "type": "overview",
            "data": {
                "market_sentiment": "bullish",
                "top_signals": [f"{TICKER} Bullish 85%"],
                "avg_confidence": 82,
                "sector_strength": [],
            },
        },
    )
    _print_result("POST /llm-insights", ok, status, body)
    checks.append(("POST /llm-insights", ok))

    total = len(checks)
    passed = sum(1 for _, is_ok in checks if is_ok)
    print(f"\nDone. Requests sent: {passed}/{total} successful.\n", flush=True)


if __name__ == "__main__":
    main()
