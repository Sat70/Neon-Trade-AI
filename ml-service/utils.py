import json
from typing import Any

# --- Optional terminal colors (install: pip install colorama) ---
try:
    from colorama import Fore, Style, init as _colorama_init

    _colorama_init(autoreset=True)
    _COLORAMA = True
except ImportError:
    Fore = type("Fore", (), {"CYAN": "", "GREEN": "", "YELLOW": "", "MAGENTA": "", "BLUE": ""})()  # type: ignore[misc, assignment]
    Style = type("Style", (), {"RESET_ALL": ""})()  # type: ignore[misc, assignment]
    _COLORAMA = False

SEPARATOR_WIDTH = 62
SEPARATOR = "=" * SEPARATOR_WIDTH

# Screenshot-friendly labels
LABEL_PRICE = "[PRICE MODEL]"
LABEL_SIGNAL = "[SIGNAL MODEL]"
LABEL_RISK = "[RISK MODEL]"
LABEL_SCENARIO = "[SCENARIO MODEL]"
LABEL_TIMING = "[TIMING MODEL]"
LABEL_LLM = "[LLM]"


def print_section(title: str, data: Any) -> None:
    """
    Print a titled block with a separator, title in uppercase, and pretty-printed JSON.
    `data` must be JSON-serializable (use default=str for odd types).
    """
    print(SEPARATOR)
    head = title.upper() if title else ""
    if _COLORAMA:
        print(f"{Fore.CYAN}{head}{Style.RESET_ALL}")
    else:
        print(head)
    print(SEPARATOR)
    try:
        print(json.dumps(data, indent=2, default=str, ensure_ascii=False))
    except TypeError:
        print(json.dumps(str(data), indent=2, default=str, ensure_ascii=False))
    print()


def print_request_line(*, method: str, path: str, ticker: str, horizon: str) -> None:
    line = f"REQUEST → {method} {path} | ticker={ticker.upper()} | horizon={horizon}"
    if _COLORAMA:
        print(f"\n{Fore.GREEN}{line}{Style.RESET_ALL}")
    else:
        print(f"\n{line}")


def print_llm_request(*, method: str, path: str, insight_type: str) -> None:
    line = f"REQUEST → {method} {path} | type={insight_type}"
    if _COLORAMA:
        print(f"\n{Fore.GREEN}{line}{Style.RESET_ALL}")
    else:
        print(f"\n{line}")


SUPPORTED_TICKERS = {
    "AAPL",
    "NVDA",
    "MSFT",
    "GOOGL",
    "AMZN",
    "TSLA",
    "AMD",
    "META",
    "SPY",
}

HORIZON_CONFIG = {
    "intraday": {
        "interval": "5m",
        "period": "5d",
        "steps": 8,
        "label_prefix": "T",
    },
    "short-term": {
        "interval": "1d",
        "period": "6mo",
        "steps": 30,
        "label_prefix": "D",
    },
    "long-term": {
        "interval": "1wk",
        "period": "2y",
        "steps": 6,
        "label_prefix": "M",
    },
}


def validate_ticker(ticker: str) -> str:
    symbol = ticker.upper().strip()
    if symbol not in SUPPORTED_TICKERS:
        raise ValueError(f"Unsupported ticker '{ticker}'.")
    return symbol


def validate_horizon(horizon: str) -> str:
    value = horizon.strip().lower()
    if value not in HORIZON_CONFIG:
        raise ValueError(f"Unsupported horizon '{horizon}'.")
    return value

