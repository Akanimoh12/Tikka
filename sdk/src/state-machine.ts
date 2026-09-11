import type { Address, Hex } from "viem";
import type { ResolvedMarket, RetryAction, WidgetState } from "./types.js";

export type StateMachineEvent =
  | { type: "connect-requested" }
  | { type: "wallet-connected"; address: Address }
  | { type: "wrong-network-detected"; address: Address; actualChainId: number | null }
  | { type: "network-corrected"; address: Address; market: ResolvedMarket }
  | { type: "market-ready"; address: Address; market: ResolvedMarket }
  | { type: "predict-submitted"; direction: "up" | "down"; stake: bigint }
  | { type: "transaction-confirmed"; predictionId: Hex; txHash: Hex }
  | { type: "window-closed" }
  | { type: "settled"; outcome: "won" | "lost"; payout: bigint }
  | { type: "reset-to-ready"; address: Address; market: ResolvedMarket }
  | { type: "error-occurred"; code: string; message: string; retry: RetryAction | null };

export interface StateMachine {
  getState(): WidgetState;
  subscribe(listener: (state: WidgetState) => void): () => void;
  dispatch(event: StateMachineEvent): void;
}

function reduce(state: WidgetState, event: StateMachineEvent): WidgetState | null {
  if (event.type === "error-occurred") {
    return { name: "error", code: event.code, message: event.message, retry: event.retry };
  }

  switch (state.name) {
    case "idle":
      if (event.type === "connect-requested") {
        return { name: "connecting-wallet" };
      }
      return null;

    case "connecting-wallet":
      if (event.type === "wallet-connected") {
        return { name: "wallet-connected", address: event.address };
      }
      return null;

    case "wallet-connected":
      if (event.type === "wrong-network-detected") {
        return { name: "wrong-network", address: event.address, actualChainId: event.actualChainId };
      }
      if (event.type === "market-ready") {
        return { name: "ready", address: event.address, market: event.market };
      }
      return null;

    case "wrong-network":
      if (event.type === "network-corrected") {
        return { name: "ready", address: event.address, market: event.market };
      }
      return null;

    case "ready":
      if (event.type === "predict-submitted") {
        return {
          name: "submitting",
          address: state.address,
          market: state.market,
          direction: event.direction,
          stake: event.stake,
        };
      }
      return null;

    case "submitting":
      if (event.type === "transaction-confirmed") {
        return {
          name: "live",
          address: state.address,
          market: state.market,
          direction: state.direction,
          stake: state.stake,
          predictionId: event.predictionId,
          txHash: event.txHash,
        };
      }
      return null;

    case "live":
      if (event.type === "window-closed") {
        return {
          name: "settling",
          address: state.address,
          market: state.market,
          direction: state.direction,
          stake: state.stake,
          predictionId: state.predictionId,
          txHash: state.txHash,
        };
      }
      return null;

    case "settling":
      if (event.type === "settled") {
        return {
          name: "result",
          address: state.address,
          market: state.market,
          direction: state.direction,
          stake: state.stake,
          outcome: event.outcome,
          payout: event.payout,
        };
      }
      return null;

    case "result":
      if (event.type === "reset-to-ready") {
        return { name: "ready", address: event.address, market: event.market };
      }
      return null;

    case "error":
      return null;

    default:
      return null;
  }
}

export function createStateMachine(initial: WidgetState = { name: "idle" }): StateMachine {
  let state = initial;
  const listeners = new Set<(state: WidgetState) => void>();

  return {
    getState() {
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    dispatch(event) {
      const next = reduce(state, event);
      if (next === null) {
        return;
      }
      state = next;
      for (const listener of listeners) {
        listener(state);
      }
    },
  };
}
