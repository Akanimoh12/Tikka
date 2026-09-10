import {
  IndexerError,
  RpcError,
  SomniaMarkets,
  type BinaryMarket,
  type MarketOnchain,
} from "@somnia-chain/markets-sdk";
import {
  createPublicClient,
  http,
  type Address,
  type Hex,
  type PublicClient,
} from "viem";
import { DEFAULT_NETWORK_CONFIG, type NetworkConfig } from "./config.js";
import type {
  Market,
  MarketStatus,
  MarketUpdate,
  Position,
  SettlementResult,
  Unsubscribe,
} from "./types.js";

type IntervalId = ReturnType<typeof setInterval>;

const LOG_WINDOW_BLOCKS = 1000n;
const LOG_WINDOW_COUNT = 40;
const POLL_INTERVAL_MS = 4500;
const SOCKET_DOWN_GRACE_MS = 8000;

const marketCreatorMarketCreatedEvent = {
  type: "event",
  name: "MarketCreated",
  inputs: [
    { name: "marketId", type: "bytes32", indexed: true },
    { name: "market", type: "address", indexed: true },
    { name: "pool", type: "address", indexed: true },
    { name: "yesId", type: "uint256", indexed: false },
    { name: "noId", type: "uint256", indexed: false },
    { name: "collateral", type: "address", indexed: false },
    { name: "asset", type: "string", indexed: false },
    { name: "strike", type: "uint256", indexed: false },
    { name: "tradingStart", type: "uint64", indexed: false },
    { name: "expiry", type: "uint64", indexed: false },
    { name: "oracleQuestionId", type: "uint256", indexed: false },
    { name: "question", type: "string", indexed: false },
    { name: "intervalSec", type: "uint64", indexed: false },
  ],
  anonymous: false,
} as const;

const ONCHAIN_STATUS_BY_INDEX: MarketStatus[] = [
  "listed",
  "trading",
  "locked",
  "settling",
  "resolved",
  "voided",
];

function onchainStatusToMarketStatus(status: number): MarketStatus {
  return ONCHAIN_STATUS_BY_INDEX[status] ?? "listed";
}

function indexerStatusToMarketStatus(status: BinaryMarket["status"]): MarketStatus {
  switch (status) {
    case "Listed":
      return "listed";
    case "Trading":
      return "trading";
    case "Locked":
      return "locked";
    case "Settling":
      return "settling";
    case "Resolved":
    case "Finalized":
      return "resolved";
    case "Voided":
      return "voided";
    default:
      return "listed";
  }
}

function collateralAddress(config: NetworkConfig): Address {
  const address = config.addresses.collateral ?? config.addresses.testUsdc;
  if (!address) {
    throw new Error("NetworkConfig.addresses is missing collateral/testUsdc");
  }
  return address;
}

function binaryMarketToMarket(m: BinaryMarket): Market {
  return {
    marketId: m.marketId,
    pool: m.poolAddress,
    asset: m.asset,
    question: m.question,
    intervalSec: m.intervalSec != null ? Number(m.intervalSec) : 0,
    expiry: Number(m.expiry),
    tradingStart: Number(m.tradingStart),
    status: indexerStatusToMarketStatus(m.status),
    collateral: m.collateral,
    collateralDecimals: m.quoteDecimals,
  };
}

function onchainToMarket(marketId: Hex, m: MarketOnchain): Market {
  return {
    marketId,
    pool: m.pool,
    asset: "",
    question: "",
    intervalSec: 0,
    expiry: Number(m.expiry),
    tradingStart: 0,
    status: onchainStatusToMarketStatus(m.status),
    collateral: m.collateral,
    collateralDecimals: m.decimals,
  };
}

function mergeOnchainStatus(indexed: Market, onchain: MarketOnchain): Market {
  return {
    ...indexed,
    status: onchainStatusToMarketStatus(onchain.status),
    expiry: Number(onchain.expiry),
  };
}

function settlementFromOnchain(marketId: Hex, m: MarketOnchain): SettlementResult | null {
  if (m.isVoided) {
    return { marketId, outcome: "voided", winningOutcome: null };
  }
  if (m.isResolved) {
    const winningOutcome: 0 | 1 = m.winningOutcome === 1 ? 1 : 0;
    return {
      marketId,
      outcome: winningOutcome === 0 ? "up" : "down",
      winningOutcome,
    };
  }
  return null;
}

export interface TikkaClient {
  listMarkets(): Promise<Market[]>;
  getMarket(marketId: Hex): Promise<Market | null>;
  subscribeToMarket(marketId: Hex, onUpdate: (m: MarketUpdate) => void): Unsubscribe;
  subscribeToSettlement(marketId: Hex, onSettled: (result: SettlementResult) => void): Unsubscribe;
  getWalletPositions(address: Address): Promise<Position[]>;
}

async function withSingleRpcRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof RpcError) {
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 250));
      return fn();
    }
    throw error;
  }
}

export function createClient(config: NetworkConfig = DEFAULT_NETWORK_CONFIG): TikkaClient {
  const exchange = new SomniaMarkets({
    chain: config.chain,
    addresses: config.addresses,
    indexerUrl: config.indexerUrl,
    wsRpcUrl: config.wsRpcUrl,
  });

  let publicClient: PublicClient | null = null;
  function getPublicClient(): PublicClient {
    if (!publicClient) {
      publicClient = createPublicClient({ chain: config.chain, transport: http() });
    }
    return publicClient;
  }

  async function scanMarketsFromChain(): Promise<Market[]> {
    const client = getPublicClient();
    const collateral = collateralAddress(config);
    const marketCreatedEvent = marketCreatorMarketCreatedEvent;
    const nowSec = Math.floor(Date.now() / 1000);
    const head = await client.getBlockNumber();
    const foundByMarketId = new Map<Hex, Market>();

    for (let i = 0; i < LOG_WINDOW_COUNT; i++) {
      const to = head - BigInt(i) * LOG_WINDOW_BLOCKS;
      if (to < 0n) break;
      const from = to - (LOG_WINDOW_BLOCKS - 1n) < 0n ? 0n : to - (LOG_WINDOW_BLOCKS - 1n);
      try {
        const logs = await client.getLogs({
          event: marketCreatedEvent,
          fromBlock: from,
          toBlock: to,
        });
        for (const log of logs) {
          const args = log.args as {
            marketId?: Hex;
            pool?: Address;
            collateral?: Address;
            asset?: string;
            tradingStart?: bigint;
            expiry?: bigint;
            question?: string;
            intervalSec?: bigint;
          };
          if (!args.marketId || !args.pool || !args.collateral) continue;
          if (args.collateral.toLowerCase() !== collateral.toLowerCase()) continue;
          const expiry = args.expiry != null ? Number(args.expiry) : 0;
          if (expiry <= nowSec) continue;
          foundByMarketId.set(args.marketId, {
            marketId: args.marketId,
            pool: args.pool,
            asset: args.asset ?? "",
            question: args.question ?? "",
            intervalSec: args.intervalSec != null ? Number(args.intervalSec) : 0,
            expiry,
            tradingStart: args.tradingStart != null ? Number(args.tradingStart) : 0,
            status: "trading",
            collateral: args.collateral,
            collateralDecimals: config.name === "testnet" ? 6 : 18,
          });
        }
      } catch {
        continue;
      }
    }

    return Array.from(foundByMarketId.values()).sort((a, b) => a.expiry - b.expiry);
  }

  async function listMarkets(): Promise<Market[]> {
    try {
      const markets = await withSingleRpcRetry(() => exchange.client.listLiveBinaryMarkets());
      return markets.map(binaryMarketToMarket);
    } catch (error) {
      if (error instanceof IndexerError) {
        return scanMarketsFromChain();
      }
      throw error;
    }
  }

  async function getMarket(marketId: Hex): Promise<Market | null> {
    let indexed: Market | null = null;
    try {
      const binaryMarket = await withSingleRpcRetry(() => exchange.client.getBinaryMarket(marketId));
      indexed = binaryMarket ? binaryMarketToMarket(binaryMarket) : null;
    } catch (error) {
      if (!(error instanceof IndexerError)) {
        throw error;
      }
      indexed = null;
    }

    let onchain: MarketOnchain | null = null;
    try {
      onchain = await withSingleRpcRetry(() => exchange.client.getMarketOnchain(marketId));
    } catch {
      onchain = null;
    }

    if (indexed && onchain) {
      return mergeOnchainStatus(indexed, onchain);
    }
    if (indexed) {
      return indexed;
    }
    if (onchain) {
      return onchainToMarket(marketId, onchain);
    }
    return null;
  }

  function subscribeToMarket(marketId: Hex, onUpdate: (m: MarketUpdate) => void): Unsubscribe {
    let stopped = false;
    let watchHandle: { stop(): void } | null = null;
    let unsubscribeLive: (() => void) | null = null;
    let pollTimer: IntervalId | null = null;
    let socketDownSince: number | null = null;

    function emitFromOnchain(m: MarketOnchain) {
      onUpdate({
        marketId,
        status: onchainStatusToMarketStatus(m.status),
        expiry: Number(m.expiry),
        lastPrice: null,
      });
    }

    function startPolling() {
      if (pollTimer || stopped) return;
      pollTimer = setInterval(() => {
        exchange.client
          .getMarketOnchain(marketId)
          .then((m) => {
            if (!stopped) emitFromOnchain(m);
          })
          .catch(() => undefined);
      }, POLL_INTERVAL_MS);
    }

    function stopPolling() {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    }

    function checkSocketHealth() {
      const status = exchange.client.getLiveStatus();
      const now = Date.now();
      if (!status.wsConnected) {
        if (socketDownSince === null) socketDownSince = now;
        if (now - socketDownSince > SOCKET_DOWN_GRACE_MS) {
          startPolling();
        }
      } else {
        socketDownSince = null;
        stopPolling();
      }
    }

    (async () => {
      try {
        const onchain = await exchange.client.getMarketOnchain(marketId);
        if (stopped) return;
        const pool = onchain.pool;
        watchHandle = await exchange.client.watchMarket(pool);
        if (stopped) {
          watchHandle.stop();
          return;
        }
        unsubscribeLive = exchange.client.subscribeLive(() => {
          checkSocketHealth();
          const live = exchange.client.getLiveMarketByPool(pool);
          if (live && "marketId" in live && live.marketType === "BINARY") {
            onUpdate({
              marketId,
              status: indexerStatusToMarketStatus(live.status),
              expiry: Number(live.expiry),
              lastPrice: live.lastPrice != null ? BigInt(live.lastPrice) : null,
            });
          }
        });
        checkSocketHealth();
      } catch {
        if (!stopped) startPolling();
      }
    })();

    const healthTimer = setInterval(checkSocketHealth, SOCKET_DOWN_GRACE_MS);

    return () => {
      if (stopped) return;
      stopped = true;
      clearInterval(healthTimer);
      stopPolling();
      if (unsubscribeLive) unsubscribeLive();
      if (watchHandle) watchHandle.stop();
    };
  }

  function subscribeToSettlement(
    marketId: Hex,
    onSettled: (result: SettlementResult) => void
  ): Unsubscribe {
    let stopped = false;
    let fired = false;
    let watchHandle: { stop(): void } | null = null;
    let unsubscribeLive: (() => void) | null = null;
    let pollTimer: IntervalId | null = null;

    function tryEmit(m: MarketOnchain) {
      if (fired || stopped) return;
      const result = settlementFromOnchain(marketId, m);
      if (result) {
        fired = true;
        onSettled(result);
        cleanup();
      }
    }

    function poll() {
      exchange.client
        .getMarketOnchain(marketId)
        .then((m) => tryEmit(m))
        .catch(() => undefined);
    }

    function cleanup() {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
      if (unsubscribeLive) {
        unsubscribeLive();
        unsubscribeLive = null;
      }
      if (watchHandle) {
        watchHandle.stop();
        watchHandle = null;
      }
    }

    pollTimer = setInterval(poll, POLL_INTERVAL_MS);
    poll();

    (async () => {
      try {
        const onchain = await exchange.client.getMarketOnchain(marketId);
        if (stopped || fired) return;
        tryEmit(onchain);
        if (fired || stopped) return;
        const pool = onchain.pool;
        watchHandle = await exchange.client.watchMarket(pool);
        if (stopped || fired) {
          watchHandle?.stop();
          return;
        }
        unsubscribeLive = exchange.client.subscribeLive(() => {
          exchange.client
            .getMarketOnchain(marketId)
            .then((m) => tryEmit(m))
            .catch(() => undefined);
        });
      } catch {
        void 0;
      }
    })();

    return () => {
      if (stopped) return;
      stopped = true;
      cleanup();
    };
  }

  async function getWalletPositions(address: Address): Promise<Position[]> {
    const portfolio = await withSingleRpcRetry(() => exchange.client.getPortfolio(address));
    return portfolio.positions.map((p) => ({
      marketId: p.market.id as Hex,
      outcome: p.outcomeIndex === 0 ? "up" : "down",
      tokenId: p.tokenId,
      balance: BigInt(p.balance),
    }));
  }

  return {
    listMarkets,
    getMarket,
    subscribeToMarket,
    subscribeToSettlement,
    getWalletPositions,
  };
}
