from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
import re
from typing import Any

OUTPUTS_DIR = Path(__file__).resolve().parent / "outputs"
MAX_FILES_PER_KEY = 20


def _safe_token(value: str) -> str:
    token = (value or "general").strip()
    token = token.replace(" ", "-")
    token = re.sub(r"[^A-Za-z0-9_.-]", "-", token)
    token = re.sub(r"-{2,}", "-", token).strip("-")
    return token or "general"


def save_json_output(model_name: str, ticker: str, horizon: str, data: Any) -> str | None:
    """
    Save endpoint/model output to ml-service/outputs in a structured JSON file.
    Filename format: {model}_{ticker}_{horizon}_{timestamp}.json
    """
    try:
        OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)

        model = _safe_token(model_name.lower())
        symbol = _safe_token((ticker or "general").upper())
        horizon_key = _safe_token((horizon or "general").lower())
        timestamp = datetime.now().isoformat(timespec="seconds").replace(":", "-")
        filename = f"{model}_{symbol}_{horizon_key}_{timestamp}.json"
        path = OUTPUTS_DIR / filename

        with path.open("w", encoding="utf-8") as fp:
            json.dump(data, fp, indent=2, ensure_ascii=False, default=str)

        # Keep latest MAX_FILES_PER_KEY files per model+ticker+horizon key.
        pattern = f"{model}_{symbol}_{horizon_key}_*.json"
        matching = sorted(OUTPUTS_DIR.glob(pattern), key=lambda p: p.stat().st_mtime, reverse=True)
        for old_file in matching[MAX_FILES_PER_KEY:]:
            old_file.unlink(missing_ok=True)

        relative = f"outputs/{filename}"
        print(f"Saved output -> {relative}")
        return str(path)
    except Exception as err:
        print(f"Failed to save JSON output for {model_name}: {err}")
        return None
