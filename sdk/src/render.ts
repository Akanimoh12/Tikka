import type { WidgetConfig, WidgetState } from "./types.js";

export interface WidgetInteractionHandlers {
  onConnectClick(): void;
  onSwitchNetworkClick(): void;
  onPredictClick(direction: "up" | "down", stake: bigint): void;
  onPredictAgainClick(): void;
  onRetryClick(): void;
  onDismissClick(): void;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatWindowLabel(market: WidgetConfig["market"], windowLabel: string): string {
  return `${escapeHtml(market)}, ${escapeHtml(windowLabel)} window`;
}

function formatStake(stake: bigint, decimals: number): string {
  const negative = stake < 0n;
  const abs = negative ? -stake : stake;
  const base = 10n ** BigInt(decimals);
  const whole = abs / base;
  const frac = abs % base;
  if (decimals === 0) {
    return `${negative ? "-" : ""}${whole.toString()}`;
  }
  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${negative ? "-" : ""}${whole.toString()}${fracStr.length > 0 ? `.${fracStr}` : ""}`;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${minutes}:${pad(seconds)}`;
}

function retryButtonLabel(kind: string): string {
  switch (kind) {
    case "reconnect":
      return "Reconnect wallet";
    case "switch-network":
      return "Switch network";
    case "retry-transaction":
      return "Try again";
    case "dismiss":
      return "Dismiss";
    default:
      return "Dismiss";
  }
}

function retryActionAttr(kind: string): string {
  switch (kind) {
    case "reconnect":
      return "reconnect";
    case "switch-network":
      return "switch-network";
    case "retry-transaction":
      return "retry-transaction";
    default:
      return "dismiss";
  }
}

export function renderWidgetHTML(state: WidgetState, config: WidgetConfig): string {
  switch (state.name) {
    case "idle":
      return `
        <div class="tk-card">
          <div class="tk-market-label">${formatWindowLabel(config.market, config.window)}</div>
          <div class="tk-idle-panel">
            <p class="tk-body">Connect your wallet to predict Up or Down on this market.</p>
            <button class="tk-btn tk-btn-primary" data-tikka-action="connect" type="button">Connect wallet</button>
          </div>
        </div>
      `;

    case "connecting-wallet":
      return `
        <div class="tk-card">
          <div class="tk-market-label">${formatWindowLabel(config.market, config.window)}</div>
          <div class="tk-wait-panel tk-wait-panel-pulse">
            <div class="tk-wait-ring"></div>
            <p class="tk-body tk-strong">Waiting for your wallet</p>
            <p class="tk-caption">Approve the connection in your wallet extension.</p>
          </div>
        </div>
      `;

    case "wallet-connected":
      return `
        <div class="tk-card">
          <div class="tk-market-label">${formatWindowLabel(config.market, config.window)}</div>
          <div class="tk-transition-panel">
            <div class="tk-check-mark">✓</div>
            <p class="tk-body tk-strong">Wallet connected</p>
            <p class="tk-caption">${escapeHtml(state.address)}</p>
          </div>
        </div>
      `;

    case "wrong-network":
      return `
        <div class="tk-card tk-card-pink">
          <div class="tk-market-label">${formatWindowLabel(config.market, config.window)}</div>
          <div class="tk-error-panel">
            <p class="tk-body tk-strong">Switch to Somnia Shannon testnet to continue</p>
            <p class="tk-caption">Your wallet is connected to a different network${
              state.actualChainId !== null ? ` (chain ${state.actualChainId})` : ""
            }.</p>
            <button class="tk-btn tk-btn-pink" data-tikka-action="switch-network" type="button">Switch network</button>
          </div>
        </div>
      `;

    case "ready": {
      const market = state.market;
      return `
        <div class="tk-card">
          <div class="tk-market-label">${formatWindowLabel(config.market, config.window)}</div>
          <p class="tk-question">${escapeHtml(market.question)}</p>
          <form class="tk-predict-form" data-tikka-form="predict" data-tikka-decimals="${market.collateralDecimals}">
            <div class="tk-direction-row">
              <button class="tk-btn tk-btn-mint tk-direction-btn" data-tikka-direction="up" type="button" aria-pressed="false">Up</button>
              <button class="tk-btn tk-btn-pink tk-direction-btn" data-tikka-direction="down" type="button" aria-pressed="false">Down</button>
            </div>
            <label class="tk-stake-label" for="tk-stake-input">Stake</label>
            <input class="tk-stake-input" id="tk-stake-input" data-tikka-input="stake" type="number" min="0" step="any" inputmode="decimal" placeholder="0.0" />
            <button class="tk-btn tk-btn-primary tk-predict-submit" data-tikka-action="predict" type="submit" disabled>Place prediction</button>
          </form>
        </div>
      `;
    }

    case "submitting": {
      const stakeStr = formatStake(state.stake, state.market.collateralDecimals);
      return `
        <div class="tk-card">
          <div class="tk-market-label">${formatWindowLabel(config.market, config.window)}</div>
          <div class="tk-submit-panel">
            <div class="tk-progress-track"><div class="tk-progress-fill"></div></div>
            <p class="tk-body tk-strong">Sending your prediction</p>
            <p class="tk-caption">Predicting ${state.direction === "up" ? "Up" : "Down"} with a stake of ${escapeHtml(stakeStr)}. Waiting for the transaction to confirm on-chain.</p>
          </div>
        </div>
      `;
    }

    case "live": {
      const stakeStr = formatStake(state.stake, state.market.collateralDecimals);
      const remainingMs = Math.max(0, state.market.expiry * 1000 - Date.now());
      return `
        <div class="tk-card tk-card-mint">
          <div class="tk-market-label">${formatWindowLabel(config.market, config.window)}</div>
          <div class="tk-live-panel">
            <div class="tk-live-badge">Live</div>
            <p class="tk-body">You predicted <span class="tk-strong">${state.direction === "up" ? "Up" : "Down"}</span> with a stake of <span class="tk-strong">${escapeHtml(stakeStr)}</span>.</p>
            <div class="tk-countdown">
              <span class="tk-countdown-value">${formatDuration(remainingMs)}</span>
              <span class="tk-countdown-caption">until window closes</span>
            </div>
          </div>
        </div>
      `;
    }

    case "settling": {
      const stakeStr = formatStake(state.stake, state.market.collateralDecimals);
      return `
        <div class="tk-card tk-card-orange">
          <div class="tk-market-label">${formatWindowLabel(config.market, config.window)}</div>
          <div class="tk-settling-panel">
            <div class="tk-settling-spinner"></div>
            <p class="tk-body tk-strong">Window closed, settling now</p>
            <p class="tk-caption">You predicted ${state.direction === "up" ? "Up" : "Down"} with a stake of ${escapeHtml(stakeStr)}. Settlement is confirming on-chain.</p>
          </div>
        </div>
      `;
    }

    case "result": {
      const stakeStr = formatStake(state.stake, state.market.collateralDecimals);
      const payoutStr = formatStake(state.payout, state.market.collateralDecimals);
      const won = state.outcome === "won";
      return `
        <div class="tk-card ${won ? "tk-card-mint" : "tk-card-pink"} tk-result-card">
          <div class="tk-market-label">${formatWindowLabel(config.market, config.window)}</div>
          <div class="tk-result-panel tk-result-reveal">
            <div class="tk-result-badge ${won ? "tk-result-badge-mint" : "tk-result-badge-pink"}">${won ? "You won" : "You lost"}</div>
            <p class="tk-body">You predicted ${state.direction === "up" ? "Up" : "Down"} with a stake of ${escapeHtml(stakeStr)}.</p>
            <p class="tk-payout">${won ? `Payout: ${escapeHtml(payoutStr)}` : `No payout this time.`}</p>
            <button class="tk-btn tk-btn-primary" data-tikka-action="predict-again" type="button">Predict again</button>
          </div>
        </div>
      `;
    }

    case "error": {
      const retry = state.retry;
      return `
        <div class="tk-card tk-card-pink">
          <div class="tk-market-label">${formatWindowLabel(config.market, config.window)}</div>
          <div class="tk-error-panel">
            <p class="tk-body tk-strong">${escapeHtml(state.message)}</p>
            ${
              retry !== null
                ? `<button class="tk-btn tk-btn-pink" data-tikka-action="${retryActionAttr(retry.kind)}" type="button">${retryButtonLabel(retry.kind)}</button>`
                : ""
            }
          </div>
        </div>
      `;
    }

    default:
      return "";
  }
}

export function attachWidgetListeners(root: ShadowRoot | Element, handlers: WidgetInteractionHandlers): void {
  root.addEventListener("click", (rawEvent) => {
    const event = rawEvent as MouseEvent;
    const target = event.target as Element | null;
    if (!target) {
      return;
    }

    const directionButton = target.closest<HTMLElement>("[data-tikka-direction]");
    if (directionButton) {
      const form = directionButton.closest<HTMLElement>('[data-tikka-form="predict"]');
      if (form) {
        const siblings = form.querySelectorAll<HTMLElement>("[data-tikka-direction]");
        siblings.forEach((el) => {
          el.setAttribute("aria-pressed", el === directionButton ? "true" : "false");
        });
        form.setAttribute("data-tikka-selected-direction", directionButton.getAttribute("data-tikka-direction") ?? "");
        const submitButton = form.querySelector<HTMLButtonElement>('[data-tikka-action="predict"]');
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
      return;
    }

    const actionEl = target.closest<HTMLElement>("[data-tikka-action]");
    if (!actionEl) {
      return;
    }

    const action = actionEl.getAttribute("data-tikka-action");
    switch (action) {
      case "connect":
        handlers.onConnectClick();
        break;
      case "switch-network":
        handlers.onSwitchNetworkClick();
        break;
      case "predict-again":
        handlers.onPredictAgainClick();
        break;
      case "reconnect":
      case "retry-transaction":
        handlers.onRetryClick();
        break;
      case "dismiss":
        handlers.onDismissClick();
        break;
      default:
        break;
    }
  });

  root.addEventListener("submit", (rawEvent) => {
    const event = rawEvent as SubmitEvent;
    const target = event.target as Element | null;
    if (!target || !(target instanceof HTMLElement)) {
      return;
    }
    if (target.getAttribute("data-tikka-form") !== "predict") {
      return;
    }
    event.preventDefault();

    const direction = target.getAttribute("data-tikka-selected-direction");
    if (direction !== "up" && direction !== "down") {
      return;
    }

    const input = target.querySelector<HTMLInputElement>('[data-tikka-input="stake"]');
    const rawValue = input?.value ?? "";
    const parsed = Number.parseFloat(rawValue);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }

    const decimalsAttr = target.getAttribute("data-tikka-decimals");
    const decimals = decimalsAttr !== null ? Number.parseInt(decimalsAttr, 10) : 18;
    const scale = 10 ** decimals;
    const stake = BigInt(Math.round(parsed * scale));
    handlers.onPredictClick(direction, stake);
  });
}
