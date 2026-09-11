import type { Address, Hex } from "viem";

export type Theme = "light" | "dark" | "auto";
export type Size = "compact" | "full";

export interface WidgetConfig {
  market: string;
  window: string;
  theme: Theme;
  size: Size;
}

export type WidgetState =
  | { name: "idle" }
  | { name: "connecting-wallet" }
  | { name: "wallet-connected"; address: Address }
  | { name: "wrong-network"; address: Address; actualChainId: number | null }
  | { name: "ready"; address: Address; market: ResolvedMarket }
  | { name: "submitting"; address: Address; market: ResolvedMarket; direction: "up" | "down"; stake: bigint }
  | { name: "live"; address: Address; market: ResolvedMarket; direction: "up" | "down"; stake: bigint; predictionId: Hex; txHash: Hex }
  | { name: "settling"; address: Address; market: ResolvedMarket; direction: "up" | "down"; stake: bigint; predictionId: Hex; txHash: Hex }
  | { name: "result"; address: Address; market: ResolvedMarket; direction: "up" | "down"; stake: bigint; outcome: "won" | "lost"; payout: bigint }
  | { name: "error"; code: string; message: string; retry: RetryAction | null };

export type RetryAction =
  | { kind: "reconnect" }
  | { kind: "switch-network" }
  | { kind: "retry-transaction"; direction: "up" | "down"; stake: bigint }
  | { kind: "dismiss" };

export interface ResolvedMarket {
  marketId: Hex;
  asset: string;
  intervalSec: number;
  expiry: number;
  question: string;
  collateral: Address;
  collateralDecimals: number;
}

export type ConfigValidation =
  | { ok: true; market: ResolvedMarket }
  | { ok: false; reason: "unknown-market"; market: string }
  | { ok: false; reason: "unknown-window"; market: string; window: string; availableWindows: string[] }
  | { ok: false; reason: "network-error"; message: string };

export interface ConnectedEventDetail {
  address: Address;
}

export interface SubmittedEventDetail {
  txHash: Hex;
  predictionId: Hex;
  direction: "up" | "down";
  stake: bigint;
}

export interface SettledEventDetail {
  predictionId: Hex;
  outcome: "won" | "lost";
  payout: bigint;
}

export interface ErrorEventDetail {
  code: string;
  message: string;
}

export type TikkaEventDetail =
  | { type: "tikka:connected"; detail: ConnectedEventDetail }
  | { type: "tikka:submitted"; detail: SubmittedEventDetail }
  | { type: "tikka:settled"; detail: SettledEventDetail }
  | { type: "tikka:error"; detail: ErrorEventDetail };

export interface WidgetCallbacks {
  onConnected?: (detail: ConnectedEventDetail) => void;
  onSubmitted?: (detail: SubmittedEventDetail) => void;
  onSettled?: (detail: SettledEventDetail) => void;
  onError?: (detail: ErrorEventDetail) => void;
}

export interface WidgetHandle {
  getState(): WidgetState;
  subscribe(listener: (state: WidgetState) => void): () => void;
  destroy(): void;
}
