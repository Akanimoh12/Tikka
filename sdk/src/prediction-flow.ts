import type { Hex, WalletClient } from "viem";
import {
  createClient,
  createPrediction,
  DEFAULT_NETWORK_CONFIG,
  type CreatePredictionFailure,
  type CreatePredictionResult,
  type SettlementResult,
} from "@tikka/core";
import type { RetryAction } from "./types.js";

export type PredictionSubmitResult = CreatePredictionResult;

export async function submitPrediction(params: {
  marketId: Hex;
  direction: "up" | "down";
  stake: bigint;
  walletClient: WalletClient;
}): Promise<PredictionSubmitResult> {
  return createPrediction(
    {
      marketId: params.marketId,
      direction: params.direction,
      stake: params.stake,
      signer: params.walletClient,
    },
    DEFAULT_NETWORK_CONFIG
  );
}

const settlementClient = createClient(DEFAULT_NETWORK_CONFIG);

export function watchSettlement(marketId: Hex, onSettled: (result: SettlementResult) => void): () => void {
  return settlementClient.subscribeToSettlement(marketId, onSettled);
}

export function mapPredictionErrorToRetry(
  result: CreatePredictionFailure,
  attempted: { direction: "up" | "down"; stake: bigint }
): RetryAction {
  switch (result.error) {
    case "wrong-network":
      return { kind: "switch-network" };
    case "transaction-rejected":
      return { kind: "retry-transaction", direction: attempted.direction, stake: attempted.stake };
    case "rpc-error":
      return { kind: "retry-transaction", direction: attempted.direction, stake: attempted.stake };
    case "insufficient-balance":
      return { kind: "dismiss" };
    case "window-expired":
      return { kind: "dismiss" };
    case "market-not-trading":
      return { kind: "dismiss" };
    case "contract-reverted":
      return { kind: "dismiss" };
    case "unknown":
      return { kind: "dismiss" };
  }
}

export function predictionErrorMessage(result: CreatePredictionFailure): string {
  switch (result.error) {
    case "wrong-network":
      return "Your wallet is connected to the wrong network. Switch to the Somnia Shannon testnet to continue.";
    case "insufficient-balance":
      return "Your wallet doesn't have enough balance to place this prediction. Add funds and try again.";
    case "transaction-rejected":
      return "The transaction was declined in your wallet. You can try again when you're ready.";
    case "window-expired":
      return "This prediction window has closed. Choose a new window to predict again.";
    case "market-not-trading":
      return "This market isn't open for predictions right now.";
    case "contract-reverted":
      return result.reason
        ? `The transaction couldn't be completed: ${result.reason}.`
        : "The transaction couldn't be completed. Please try again.";
    case "rpc-error":
      return "Couldn't reach the network. Check your connection and try again.";
    case "unknown":
      return "Something interrupted this prediction. Please try again.";
  }
}
