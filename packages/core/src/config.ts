import { SOMNIA_MAINNET_ADDRESSES, SOMNIA_TESTNET_ADDRESSES } from "@somnia-chain/markets-sdk";
import { somniaMainnet, somniaShannon } from "@somnia-chain/markets-sdk/chains";
import type { Chain } from "viem";
import type { NetworkName } from "./types.js";

export interface NetworkConfig {
  name: NetworkName;
  chain: Chain;
  chainId: number;
  indexerUrl: string;
  wsRpcUrl: string;
  addresses: typeof SOMNIA_TESTNET_ADDRESSES;
}

export const TESTNET_CONFIG: NetworkConfig = {
  name: "testnet",
  chain: somniaShannon,
  chainId: 50312,
  indexerUrl: "https://dev.smk.somnia.host/v1/graphql",
  wsRpcUrl: "wss://api.infra.testnet.somnia.network/ws",
  addresses: SOMNIA_TESTNET_ADDRESSES,
};

export const MAINNET_CONFIG: NetworkConfig = {
  name: "mainnet",
  chain: somniaMainnet,
  chainId: 5031,
  indexerUrl: "https://prd.smk.somnia.host/v1/graphql",
  wsRpcUrl: "wss://api.infra.mainnet.somnia.network/ws",
  addresses: SOMNIA_MAINNET_ADDRESSES,
};

export const DEFAULT_NETWORK_CONFIG = TESTNET_CONFIG;
