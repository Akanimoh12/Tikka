export { createClient, type TikkaClient } from "./client.js";
export { createPrediction } from "./createPrediction.js";
export { TESTNET_CONFIG, MAINNET_CONFIG, DEFAULT_NETWORK_CONFIG, type NetworkConfig } from "./config.js";
export type {
  Direction,
  Market,
  MarketStatus,
  MarketUpdate,
  Unsubscribe,
  SettlementResult,
  Position,
  CreatePredictionParams,
  CreatePredictionSuccess,
  CreatePredictionFailure,
  CreatePredictionResult,
  NetworkName,
} from "./types.js";
