import type { Address, Hex } from "viem";
import { DEFAULT_NETWORK_CONFIG, type SettlementResult } from "@tikka/core";
import { createStateMachine } from "./state-machine.js";
import { mountShadowWidget } from "./shadow-mount.js";
import { attachWidgetListeners } from "./render.js";
import { resolveMarketConfig } from "./resolve-market.js";
import { createWagmiConfig, connectWallet, switchToTestnet, getConnectedWalletClient } from "./wallet.js";
import { submitPrediction, watchSettlement, mapPredictionErrorToRetry, predictionErrorMessage } from "./prediction-flow.js";
import type { ResolvedMarket, WidgetCallbacks, WidgetConfig, WidgetHandle, WidgetState } from "./types.js";

export interface MountedWidget {
  handle: WidgetHandle;
  destroy(): void;
}

function developerErrorHTML(heading: string, detail: string): string {
  const escape = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `
    <div class="tk-card tk-card-pink">
      <div class="tk-error-panel">
        <p class="tk-body tk-strong">${escape(heading)}</p>
        <p class="tk-caption">${escape(detail)}</p>
      </div>
    </div>
  `;
}

export function mountTikkaWidget(
  host: Element,
  config: WidgetConfig,
  callbacks?: WidgetCallbacks
): MountedWidget {
  const shadowWidget = mountShadowWidget(host, config);
  const contentEl = shadowWidget.shadowRoot.querySelector(".tikka-widget-content");
  const stateMachine = createStateMachine();
  const wagmiConfig = createWagmiConfig();

  let lastAddress: Address | null = null;
  let lastMarket: ResolvedMarket | null = null;
  let lastPredictionId: Hex | null = null;
  let unsubscribeSettlement: (() => void) | null = null;
  let destroyed = false;

  function stopSettlementWatch(): void {
    if (unsubscribeSettlement) {
      unsubscribeSettlement();
      unsubscribeSettlement = null;
    }
  }

  const unsubscribeStateMachine = stateMachine.subscribe((state) => {
    shadowWidget.update(state);

    if (state.name === "wallet-connected") {
      lastAddress = state.address;
      host.dispatchEvent(new CustomEvent("tikka:connected", { detail: { address: state.address } }));
      callbacks?.onConnected?.({ address: state.address });
    }

    if (state.name === "ready") {
      lastAddress = state.address;
      lastMarket = state.market;
    }

    if (state.name === "live") {
      lastPredictionId = state.predictionId;
      const detail = {
        txHash: state.txHash,
        predictionId: state.predictionId,
        direction: state.direction,
        stake: state.stake,
      };
      host.dispatchEvent(new CustomEvent("tikka:submitted", { detail }));
      callbacks?.onSubmitted?.(detail);
    }

    if (state.name === "result") {
      const predictionId = lastPredictionId ?? state.market.marketId;
      const detail = { predictionId, outcome: state.outcome, payout: state.payout };
      host.dispatchEvent(new CustomEvent("tikka:settled", { detail }));
      callbacks?.onSettled?.(detail);
    }

    if (state.name === "error") {
      const detail = { code: state.code, message: state.message };
      host.dispatchEvent(new CustomEvent("tikka:error", { detail }));
      callbacks?.onError?.(detail);
    }
  });

  async function resolveAndProceed(address: Address, afterNetworkFix: boolean): Promise<void> {
    const validation = await resolveMarketConfig(config.market, config.window);
    if (validation.ok) {
      if (afterNetworkFix) {
        stateMachine.dispatch({ type: "network-corrected", address, market: validation.market });
      } else {
        stateMachine.dispatch({ type: "market-ready", address, market: validation.market });
      }
      return;
    }
    stateMachine.dispatch({
      type: "error-occurred",
      code: validation.reason,
      message: configValidationMessage(validation),
      retry: null,
    });
  }

  async function runConnect(): Promise<void> {
    stateMachine.dispatch({ type: "connect-requested" });
    const result = await connectWallet(wagmiConfig);
    if ("error" in result) {
      stateMachine.dispatch({
        type: "error-occurred",
        code: result.error,
        message: result.message,
        retry: { kind: "reconnect" },
      });
      return;
    }
    stateMachine.dispatch({ type: "wallet-connected", address: result.address });
    if (result.chainId !== DEFAULT_NETWORK_CONFIG.chainId) {
      stateMachine.dispatch({
        type: "wrong-network-detected",
        address: result.address,
        actualChainId: result.chainId,
      });
      return;
    }
    await resolveAndProceed(result.address, false);
  }

  async function runSwitchNetwork(): Promise<void> {
    const result = await switchToTestnet(wagmiConfig);
    if (!result.ok) {
      stateMachine.dispatch({
        type: "error-occurred",
        code: "switch-network-failed",
        message: result.message,
        retry: { kind: "switch-network" },
      });
      return;
    }
    if (lastAddress === null) {
      return;
    }
    await resolveAndProceed(lastAddress, true);
  }

  async function runPredict(direction: "up" | "down", stake: bigint): Promise<void> {
    const current = stateMachine.getState();
    const market = current.name === "ready" ? current.market : lastMarket;
    if (market === null || market === undefined) {
      stateMachine.dispatch({
        type: "error-occurred",
        code: "no-market",
        message: "No market is ready to predict on yet.",
        retry: { kind: "dismiss" },
      });
      return;
    }

    stateMachine.dispatch({ type: "predict-submitted", direction, stake });

    let walletClient;
    try {
      walletClient = await getConnectedWalletClient(wagmiConfig);
    } catch (error) {
      stateMachine.dispatch({
        type: "error-occurred",
        code: "no-wallet-client",
        message: error instanceof Error ? error.message : String(error),
        retry: { kind: "retry-transaction", direction, stake },
      });
      return;
    }

    const result = await submitPrediction({ marketId: market.marketId, direction, stake, walletClient });

    if (!result.ok) {
      stateMachine.dispatch({
        type: "error-occurred",
        code: result.error,
        message: predictionErrorMessage(result),
        retry: mapPredictionErrorToRetry(result, { direction, stake }),
      });
      return;
    }

    stateMachine.dispatch({
      type: "transaction-confirmed",
      predictionId: result.predictionId,
      txHash: result.txHash,
    });

    stopSettlementWatch();
    unsubscribeSettlement = watchSettlement(market.marketId, (settlement: SettlementResult) => {
      const { outcome, payout } = mapSettlementToOutcome(settlement, direction, stake);
      stateMachine.dispatch({ type: "settled", outcome, payout });
      stopSettlementWatch();
    });
  }

  function runRetry(): void {
    const current = stateMachine.getState();
    if (current.name !== "error" || current.retry === null) {
      return;
    }
    switch (current.retry.kind) {
      case "reconnect":
        void runConnect();
        break;
      case "switch-network":
        void runSwitchNetwork();
        break;
      case "retry-transaction":
        void runPredict(current.retry.direction, current.retry.stake);
        break;
      case "dismiss":
        runDismiss();
        break;
    }
  }

  function runDismiss(): void {
    if (lastAddress !== null && lastMarket !== null) {
      stateMachine.dispatch({ type: "reset-to-ready", address: lastAddress, market: lastMarket });
      return;
    }
    if (lastAddress !== null) {
      void resolveAndProceed(lastAddress, false);
      return;
    }
    void runConnect();
  }

  attachWidgetListeners(shadowWidget.shadowRoot, {
    onConnectClick() {
      void runConnect();
    },
    onSwitchNetworkClick() {
      void runSwitchNetwork();
    },
    onPredictClick(direction, stake) {
      void runPredict(direction, stake);
    },
    onPredictAgainClick() {
      if (lastAddress !== null && lastMarket !== null) {
        stateMachine.dispatch({ type: "reset-to-ready", address: lastAddress, market: lastMarket });
      }
    },
    onRetryClick() {
      runRetry();
    },
    onDismissClick() {
      runDismiss();
    },
  });

  void resolveMarketConfig(config.market, config.window).then((validation) => {
    if (destroyed) {
      return;
    }
    if (!validation.ok) {
      if (contentEl) {
        contentEl.innerHTML = developerErrorHTML(
          "Tikka couldn't find this market",
          configValidationMessage(validation)
        );
      }
      return;
    }
    shadowWidget.update(stateMachine.getState());
  });

  const handle: WidgetHandle = {
    getState() {
      return stateMachine.getState();
    },
    subscribe(listener: (state: WidgetState) => void) {
      return stateMachine.subscribe(listener);
    },
    destroy() {
      destroyed = true;
      unsubscribeStateMachine();
      stopSettlementWatch();
      shadowWidget.destroy();
    },
  };

  return { handle, destroy: handle.destroy };
}

function configValidationMessage(
  validation: Extract<Awaited<ReturnType<typeof resolveMarketConfig>>, { ok: false }>
): string {
  switch (validation.reason) {
    case "unknown-market":
      return `"${validation.market}" is not a known market.`;
    case "unknown-window":
      return `"${validation.window}" is not an available window for "${validation.market}". Available windows: ${validation.availableWindows.join(", ")}.`;
    case "network-error":
      return `Couldn't validate this market: ${validation.message}`;
  }
}

function mapSettlementToOutcome(
  settlement: SettlementResult,
  direction: "up" | "down",
  stake: bigint
): { outcome: "won" | "lost"; payout: bigint } {
  if (settlement.outcome === "voided") {
    return { outcome: "won", payout: stake };
  }
  const won = settlement.outcome === direction;
  return { outcome: won ? "won" : "lost", payout: won ? stake : 0n };
}
