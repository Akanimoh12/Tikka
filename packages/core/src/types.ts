import type { Account, Address, Hex, WalletClient } from "viem";

export type Direction = "up" | "down";

export interface Market {
  marketId: Hex;
  pool: Address;
  asset: string;
  question: string;
  intervalSec: number;
  expiry: number;
  tradingStart: number;
  status: MarketStatus;
  collateral: Address;
  collateralDecimals: number;
}

export type MarketStatus =
  | "listed"
  | "trading"
  | "locked"
  | "settling"
  | "resolved"
  | "voided";

export interface MarketUpdate {
  marketId: Hex;
  status: MarketStatus;
  expiry: number;
  lastPrice: bigint | null;
}

export type Unsubscribe = () => void;

export interface SettlementResult {
  marketId: Hex;
  outcome: "up" | "down" | "voided";
  winningOutcome: 0 | 1 | null;
}

export interface Position {
  marketId: Hex;
  outcome: Direction;
  tokenId: string;
  balance: bigint;
}

export interface CreatePredictionParams {
  marketId: Hex;
  direction: Direction;
  stake: bigint;
  signer: Account | WalletClient;
}

export interface CreatePredictionSuccess {
  ok: true;
  txHash: Hex;
  predictionId: Hex;
}

export type CreatePredictionFailure =
  | { ok: false; error: "wrong-network"; expectedChainId: number; actualChainId: number | null }
  | { ok: false; error: "insufficient-balance"; required: bigint; available: bigint }
  | { ok: false; error: "transaction-rejected"; message: string }
  | { ok: false; error: "window-expired"; marketId: Hex }
  | { ok: false; error: "market-not-trading"; marketId: Hex; status: MarketStatus }
  | { ok: false; error: "contract-reverted"; reason: string | undefined; message: string }
  | { ok: false; error: "rpc-error"; message: string }
  | { ok: false; error: "unknown"; message: string };

export type CreatePredictionResult = CreatePredictionSuccess | CreatePredictionFailure;

export type NetworkName = "mainnet" | "testnet";
