import {
  createConfig,
  http,
  injected,
  connect,
  disconnect,
  getAccount,
  watchAccount,
  switchChain,
  getWalletClient,
  type Config,
} from "@wagmi/core";
import type { Address, WalletClient } from "viem";
import { DEFAULT_NETWORK_CONFIG } from "@tikka/core";

export interface ConnectedAccount {
  address: Address;
  chainId: number;
}

export type ConnectWalletResult = ConnectedAccount | { error: "no-injected-wallet" | "rejected" | "unknown"; message: string };

export type SwitchNetworkResult = { ok: true } | { ok: false; message: string };

export function createWagmiConfig(): Config {
  const chain = DEFAULT_NETWORK_CONFIG.chain;
  return createConfig({
    chains: [chain],
    connectors: [injected()],
    transports: {
      [chain.id]: http(),
    },
  });
}

export async function connectWallet(config: Config): Promise<ConnectWalletResult> {
  try {
    const result = await connect(config, { connector: injected() });
    return { address: result.accounts[0], chainId: result.chainId };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "ConnectorNotFoundError") {
        return { error: "no-injected-wallet", message: "No wallet extension was found in this browser." };
      }
      if (error.name === "UserRejectedRequestError" || "code" in error && (error as { code?: unknown }).code === 4001) {
        return { error: "rejected", message: "Connection request was declined." };
      }
      return { error: "unknown", message: error.message };
    }
    return { error: "unknown", message: String(error) };
  }
}

export async function disconnectWallet(config: Config): Promise<void> {
  await disconnect(config);
}

export function getCurrentAccount(config: Config): ConnectedAccount | null {
  const account = getAccount(config);
  if (!account.isConnected || !account.address || account.chainId === undefined) {
    return null;
  }
  return { address: account.address, chainId: account.chainId };
}

export function watchWalletAccount(config: Config, onChange: (account: ConnectedAccount | null) => void): () => void {
  return watchAccount(config, {
    onChange: (account) => {
      if (account.isConnected && account.address && account.chainId !== undefined) {
        onChange({ address: account.address, chainId: account.chainId });
      } else {
        onChange(null);
      }
    },
  });
}

export async function switchToTestnet(config: Config): Promise<SwitchNetworkResult> {
  try {
    await switchChain(config, { chainId: DEFAULT_NETWORK_CONFIG.chainId });
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, message: error.message };
    }
    return { ok: false, message: String(error) };
  }
}

export async function getConnectedWalletClient(config: Config): Promise<WalletClient> {
  return getWalletClient(config);
}
