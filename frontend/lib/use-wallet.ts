"use client";

import { useCallback, useEffect, useState } from "react";
import { connect, disconnect, getAccount, injected, watchAccount } from "@wagmi/core";
import type { Address } from "viem";
import { wagmiConfig } from "./wallet-config";

interface WalletState {
  address: Address | null;
  connecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({ address: null, connecting: false, error: null });

  useEffect(() => {
    const account = getAccount(wagmiConfig);
    setState((prev) => ({ ...prev, address: account.address ?? null }));

    const unwatch = watchAccount(wagmiConfig, {
      onChange(account) {
        setState((prev) => ({ ...prev, address: account.address ?? null }));
      },
    });

    return unwatch;
  }, []);

  const connectWallet = useCallback(async () => {
    setState((prev) => ({ ...prev, connecting: true, error: null }));
    try {
      await connect(wagmiConfig, { connector: injected() });
      setState((prev) => ({ ...prev, connecting: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        connecting: false,
        error: error instanceof Error ? error.message : "Connection failed.",
      }));
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    await disconnect(wagmiConfig);
  }, []);

  return {
    address: state.address,
    connecting: state.connecting,
    error: state.error,
    connect: connectWallet,
    disconnect: disconnectWallet,
  };
}
