import time

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from data_loader import fetch_ohlcv_data
from file_utils import save_json_output
from model import generate_predictions
from risk_model import generate_risk_assessment
from scenario_model import generate_scenarios
from signal_model import generate_signal
from timing_model import generate_timing
from llm_service import generate_llm_insight
from utils import (
    LABEL_LLM,
    LABEL_PRICE,
    LABEL_RISK,
    LABEL_SCENARIO,
    LABEL_SIGNAL,
    LABEL_TIMING,
    SUPPORTED_TICKERS,
    print_llm_request,
    print_request_line,
    print_section,
)

app = FastAPI(title="NeonTrade ML Service", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
CACHE_TTL_SECONDS = 600
_PREDICTION_CACHE: dict[tuple[str, str], tuple[float, dict]] = {}
_SIGNAL_CACHE: dict[tuple[str, str], tuple[float, dict]] = {}
_RISK_CACHE: dict[tuple[str, str], tuple[float, dict]] = {}
_SCENARIO_CACHE: dict[tuple[str, str], tuple[float, dict]] = {}
_TIMING_CACHE: dict[tuple[str, str], tuple[float, dict]] = {}
_LLM_CACHE: dict[str, tuple[float, dict]] = {}


class LLMInsightsRequest(BaseModel):
    type: str
    data: dict


def _get_cached(cache: dict[tuple[str, str], tuple[float, dict]], key: tuple[str, str]) -> dict | None:
    item = cache.get(key)
    if not item:
        return None
    created_at, payload = item
    if (time.time() - created_at) > CACHE_TTL_SECONDS:
        cache.pop(key, None)
        return None
    return payload


def _set_cached(cache: dict[tuple[str, str], tuple[float, dict]], key: tuple[str, str], payload: dict) -> None:
    cache[key] = (time.time(), payload)


def _get_cached_llm(key: str) -> dict | None:
    item = _LLM_CACHE.get(key)
    if not item:
        return None
    created_at, payload = item
    if (time.time() - created_at) > CACHE_TTL_SECONDS:
        _LLM_CACHE.pop(key, None)
        return None
    return payload


def _log_predict_output(payload: dict, *, from_cache: bool) -> None:
    preds = payload.get("predictions") or []
    print_section(
        f"{LABEL_PRICE} PRICE PREDICTION ({payload.get('ticker')} — {payload.get('horizon')})",
        {
            "source": "cache" if from_cache else "live",
            "ticker": payload.get("ticker"),
            "horizon": payload.get("horizon"),
            "current_price": payload.get("current_price"),
            "predictions_preview_first_3": preds[:3],
            "predictions_count": len(preds),
        },
    )


def _log_signal_output(payload: dict, *, from_cache: bool) -> None:
    print_section(
        f"{LABEL_SIGNAL} SIGNAL ({payload.get('ticker')} — {payload.get('horizon')})",
        {
            "source": "cache" if from_cache else "live",
            "signal": payload.get("signal"),
            "confidence": payload.get("confidence"),
            "expected_return": payload.get("expected_return"),
            "recommendation_score": payload.get("recommendation_score"),
            "risk_level": payload.get("risk_level"),
        },
    )


def _log_risk_output(payload: dict, *, from_cache: bool) -> None:
    print_section(
        f"{LABEL_RISK} RISK ({payload.get('ticker')} — {payload.get('horizon')})",
        {
            "source": "cache" if from_cache else "live",
            "risk_score": payload.get("risk_score"),
            "risk_level": payload.get("risk_level"),
            "volatility": payload.get("volatility"),
            "drawdown_risk": payload.get("drawdown_risk"),
        },
    )


def _log_scenarios_output(payload: dict, *, from_cache: bool) -> None:
    by_name = {s.get("name"): s for s in (payload.get("scenarios") or [])}
    bull = by_name.get("Bull Case", {})
    base = by_name.get("Base Case", {})
    bear = by_name.get("Bear Case", {})
    print_section(
        f"{LABEL_SCENARIO} SCENARIOS ({payload.get('ticker')} — {payload.get('horizon')})",
        {
            "source": "cache" if from_cache else "live",
            "simulations": payload.get("simulations"),
            "bull_case": {
                "expectedReturn": bull.get("expectedReturn"),
                "probability": bull.get("probability"),
            },
            "base_case": {
                "expectedReturn": base.get("expectedReturn"),
                "probability": base.get("probability"),
            },
            "bear_case": {
                "expectedReturn": bear.get("expectedReturn"),
                "probability": bear.get("probability"),
            },
        },
    )


def _log_timing_output(payload: dict, *, from_cache: bool) -> None:
    slots = payload.get("timing") or []
    print_section(
        f"{LABEL_TIMING} TIMING ({payload.get('ticker')} — {payload.get('horizon')})",
        {
            "source": "cache" if from_cache else "live",
            "best_entry": payload.get("best_entry"),
            "best_exit": payload.get("best_exit"),
            "timing_score": payload.get("timing_score"),
            "timing_slots_first_5": slots[:5],
        },
    )


def _log_llm_output(insight_type: str, payload: dict, *, from_cache: bool) -> None:
    text = payload.get("insight") or payload.get("reasoning") or payload.get("verdict") or ""
    truncated = text if len(text) <= 200 else f"{text[:200]}…"
    print_section(
        f"{LABEL_LLM} LLM INSIGHTS ({insight_type})",
        {
            "source": "cache" if from_cache else "live",
            "type": insight_type,
            "generated_text_preview_200_chars": truncated,
            "full_text_length": len(text),
        },
    )


def _build_risk_payload(ticker: str, horizon: str, price_payload: dict | None = None) -> dict:
    symbol = ticker.upper()
    horizon_key = horizon
    if price_payload is None:
        price_payload = generate_predictions(ticker=symbol, horizon=horizon_key)

    historical_df = fetch_ohlcv_data(symbol, horizon_key)
    spy_df = fetch_ohlcv_data("SPY", horizon_key)
    return generate_risk_assessment(
        {
            "ticker": symbol,
            "horizon": horizon_key,
            "historical_prices": historical_df["Close"].tolist(),
            "spy_historical_prices": spy_df["Close"].tolist(),
            "predictions": price_payload.get("predictions", []),
        }
    )


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/predict")
def predict(
    ticker: str = Query(..., description="Ticker symbol, e.g. AAPL"),
    horizon: str = Query(..., description="intraday | short-term | long-term"),
) -> dict:
    print_request_line(method="GET", path="/predict", ticker=ticker, horizon=horizon)
    cache_key = (ticker.upper(), horizon)
    cached = _get_cached(_PREDICTION_CACHE, cache_key)
    if cached:
        _log_predict_output(cached, from_cache=True)
        save_json_output("predict", ticker, horizon, cached)
        return cached

    try:
        payload = generate_predictions(ticker=ticker, horizon=horizon)
        _set_cached(_PREDICTION_CACHE, cache_key, payload)
        _log_predict_output(payload, from_cache=False)
        save_json_output("predict", ticker, horizon, payload)
        return payload
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err)) from err
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {err}") from err


@app.get("/risk")
def risk(
    ticker: str = Query(..., description="Ticker symbol, e.g. AAPL"),
    horizon: str = Query(..., description="intraday | short-term | long-term"),
) -> dict:
    print_request_line(method="GET", path="/risk", ticker=ticker, horizon=horizon)
    cache_key = (ticker.upper(), horizon)
    cached = _get_cached(_RISK_CACHE, cache_key)
    if cached:
        _log_risk_output(cached, from_cache=True)
        save_json_output("risk", ticker, horizon, cached)
        return cached

    try:
        price_payload = generate_predictions(ticker=ticker, horizon=horizon)
        payload = _build_risk_payload(ticker=ticker, horizon=horizon, price_payload=price_payload)
        _set_cached(_RISK_CACHE, cache_key, payload)
        _log_risk_output(payload, from_cache=False)
        save_json_output("risk", ticker, horizon, payload)
        return payload
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err)) from err
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Risk generation failed: {err}") from err


@app.get("/signal")
def signal(
    ticker: str = Query(..., description="Ticker symbol, e.g. AAPL"),
    horizon: str = Query(..., description="intraday | short-term | long-term"),
) -> dict:
    print_request_line(method="GET", path="/signal", ticker=ticker, horizon=horizon)
    cache_key = (ticker.upper(), horizon)
    cached = _get_cached(_SIGNAL_CACHE, cache_key)
    if cached:
        _log_signal_output(cached, from_cache=True)
        save_json_output("signal", ticker, horizon, cached)
        return cached

    try:
        price_payload = generate_predictions(ticker=ticker, horizon=horizon)
        risk_payload = _get_cached(_RISK_CACHE, cache_key)
        if not risk_payload:
            try:
                risk_payload = _build_risk_payload(ticker=ticker, horizon=horizon, price_payload=price_payload)
                _set_cached(_RISK_CACHE, cache_key, risk_payload)
            except Exception as risk_error:
                print(f"Risk pipeline warning for {ticker.upper()} ({horizon}): {risk_error}")
                risk_payload = None
        payload = generate_signal(price_payload, risk_payload)
        _set_cached(_SIGNAL_CACHE, cache_key, payload)
        _log_signal_output(payload, from_cache=False)
        save_json_output("signal", ticker, horizon, payload)
        return payload
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err)) from err
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Signal generation failed: {err}") from err


@app.get("/scenarios")
def scenarios(
    ticker: str = Query(..., description="Ticker symbol, e.g. AAPL"),
    horizon: str = Query(..., description="intraday | short-term | long-term"),
) -> dict:
    print_request_line(method="GET", path="/scenarios", ticker=ticker, horizon=horizon)
    cache_key = (ticker.upper(), horizon)
    cached = _get_cached(_SCENARIO_CACHE, cache_key)
    if cached:
        _log_scenarios_output(cached, from_cache=True)
        save_json_output("scenarios", ticker, horizon, cached)
        return cached

    try:
        price_payload = _get_cached(_PREDICTION_CACHE, cache_key)
        if not price_payload:
            price_payload = generate_predictions(ticker=ticker, horizon=horizon)
            _set_cached(_PREDICTION_CACHE, cache_key, price_payload)

        risk_payload = _get_cached(_RISK_CACHE, cache_key)
        if not risk_payload:
            risk_payload = _build_risk_payload(ticker=ticker, horizon=horizon, price_payload=price_payload)
            _set_cached(_RISK_CACHE, cache_key, risk_payload)

        payload = generate_scenarios(
            {
                "ticker": price_payload.get("ticker"),
                "horizon": price_payload.get("horizon"),
                "current_price": price_payload.get("current_price"),
                "predictions": price_payload.get("predictions", []),
                "risk_score": risk_payload.get("risk_score", 0.5),
                "volatility": risk_payload.get("volatility", 0.3),
            }
        )
        _set_cached(_SCENARIO_CACHE, cache_key, payload)
        _log_scenarios_output(payload, from_cache=False)
        save_json_output("scenarios", ticker, horizon, payload)
        return payload
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err)) from err
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Scenario generation failed: {err}") from err


@app.get("/timing")
def timing(
    ticker: str = Query(..., description="Ticker symbol, e.g. AAPL"),
    horizon: str = Query(..., description="intraday | short-term | long-term"),
) -> dict:
    print_request_line(method="GET", path="/timing", ticker=ticker, horizon=horizon)
    cache_key = (ticker.upper(), horizon)
    cached = _get_cached(_TIMING_CACHE, cache_key)
    if cached:
        _log_timing_output(cached, from_cache=True)
        save_json_output("timing", ticker, horizon, cached)
        return cached

    try:
        price_payload = _get_cached(_PREDICTION_CACHE, cache_key)
        if not price_payload:
            price_payload = generate_predictions(ticker=ticker, horizon=horizon)
            _set_cached(_PREDICTION_CACHE, cache_key, price_payload)

        historical_df = fetch_ohlcv_data(ticker, horizon)
        payload = generate_timing(
            {
                "ticker": ticker.upper(),
                "horizon": horizon,
                "historical_prices": historical_df["Close"].tolist(),
                "historical_volume": historical_df["Volume"].tolist(),
                "predictions": price_payload.get("predictions", []),
            }
        )
        _set_cached(_TIMING_CACHE, cache_key, payload)
        _log_timing_output(payload, from_cache=False)
        save_json_output("timing", ticker, horizon, payload)
        return payload
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err)) from err
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Timing generation failed: {err}") from err


@app.post("/llm-insights")
def llm_insights(request: LLMInsightsRequest) -> dict:
    print_llm_request(method="POST", path="/llm-insights", insight_type=request.type)
    llm_ticker = str(request.data.get("ticker", "general"))
    llm_horizon = str(request.data.get("horizon", "general"))
    cache_key = f"{request.type}:{str(request.data)}"
    cached = _get_cached_llm(cache_key)
    if cached:
        _log_llm_output(request.type, cached, from_cache=True)
        save_json_output("llm", llm_ticker, llm_horizon, cached)
        return cached

    try:
        payload = generate_llm_insight(request.type, request.data)
        _LLM_CACHE[cache_key] = (time.time(), payload)
        _log_llm_output(request.type, payload, from_cache=False)
        save_json_output("llm", llm_ticker, llm_horizon, payload)
        return payload
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err)) from err
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"LLM insight generation failed: {err}") from err


@app.get("/meta/supported-tickers")
def supported_tickers() -> dict:
    return {"tickers": sorted(SUPPORTED_TICKERS)}

