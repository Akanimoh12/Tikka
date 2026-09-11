import { createClient, DEFAULT_NETWORK_CONFIG, type Market, type NetworkConfig } from "@tikka/core";
import type { ConfigValidation, ResolvedMarket } from "./types.js";

const WINDOW_TO_SECONDS: Record<string, number> = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "1h": 3600,
  "4h": 14400,
  "24h": 86400,
};

const SECONDS_TO_WINDOW: Record<number, string> = Object.fromEntries(
  Object.entries(WINDOW_TO_SECONDS).map(([label, seconds]) => [seconds, label])
);

function assetFromMarketSymbol(market: string): string {
  const [asset] = market.split("-");
  return asset.toUpperCase();
}

function toResolvedMarket(market: Market): ResolvedMarket {
  return {
    marketId: market.marketId,
    asset: market.asset,
    intervalSec: market.intervalSec,
    expiry: market.expiry,
    question: market.question,
    collateral: market.collateral,
    collateralDecimals: market.collateralDecimals,
  };
}

export async function resolveMarketConfig(
  market: string,
  window: string,
  config: NetworkConfig = DEFAULT_NETWORK_CONFIG
): Promise<ConfigValidation> {
  const asset = assetFromMarketSymbol(market);
  const windowSeconds = WINDOW_TO_SECONDS[window];

  let markets: Market[];
  try {
    const client = createClient(config);
    markets = await client.listMarkets();
  } catch (error) {
    return {
      ok: false,
      reason: "network-error",
      message: error instanceof Error ? error.message : String(error),
    };
  }

  const forAsset = markets.filter((m) => m.asset.toUpperCase() === asset);
  if (forAsset.length === 0) {
    return { ok: false, reason: "unknown-market", market };
  }

  if (windowSeconds === undefined) {
    const availableWindows = Array.from(
      new Set(forAsset.map((m) => SECONDS_TO_WINDOW[m.intervalSec] ?? `${m.intervalSec}s`))
    );
    return { ok: false, reason: "unknown-window", market, window, availableWindows };
  }

  const forWindow = forAsset
    .filter((m) => m.intervalSec === windowSeconds && m.status === "trading")
    .sort((a, b) => a.expiry - b.expiry);

  if (forWindow.length === 0) {
    const availableWindows = Array.from(
      new Set(forAsset.map((m) => SECONDS_TO_WINDOW[m.intervalSec] ?? `${m.intervalSec}s`))
    );
    return { ok: false, reason: "unknown-window", market, window, availableWindows };
  }

  return { ok: true, market: toResolvedMarket(forWindow[0]) };
}
