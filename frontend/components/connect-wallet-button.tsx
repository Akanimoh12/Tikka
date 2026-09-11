"use client";

import { useWallet } from "@/lib/use-wallet";

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function ConnectWalletButton() {
  const { address, connecting, connect, disconnect } = useWallet();

  if (address) {
    return (
      <button
        type="button"
        onClick={() => void disconnect()}
        className="border-2 border-[var(--of-ink)] bg-[var(--of-mint)] px-5 py-3 text-base font-extrabold sm:px-6 sm:py-3.5 sm:text-lg"
        style={{ boxShadow: "4px 4px 0 var(--of-ink)" }}
      >
        {truncateAddress(address)}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void connect()}
      disabled={connecting}
      className="border-2 border-[var(--of-ink)] bg-[var(--of-yellow)] px-5 py-3 text-base font-extrabold transition-transform duration-100 hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-60 sm:px-6 sm:py-3.5 sm:text-lg"
      style={{ boxShadow: "4px 4px 0 var(--of-ink)" }}
    >
      {connecting ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}
