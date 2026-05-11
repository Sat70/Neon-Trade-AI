import pandas as pd
import yfinance as yf

from utils import HORIZON_CONFIG, validate_horizon, validate_ticker


def fetch_ohlcv_data(ticker: str, horizon: str) -> pd.DataFrame:
    symbol = validate_ticker(ticker)
    horizon_key = validate_horizon(horizon)
    config = HORIZON_CONFIG[horizon_key]

    data = yf.download(
        tickers=symbol,
        period=config["period"],
        interval=config["interval"],
        auto_adjust=True,
        progress=False,
    )

    if data.empty:
        raise ValueError(f"No data returned from Yahoo Finance for {symbol}.")

    if isinstance(data.columns, pd.MultiIndex):
        data.columns = data.columns.get_level_values(0)

    required_columns = ["Open", "High", "Low", "Close", "Volume"]
    missing = [col for col in required_columns if col not in data.columns]
    if missing:
        raise ValueError(f"Missing required columns: {', '.join(missing)}")

    return data[required_columns].dropna().copy()

