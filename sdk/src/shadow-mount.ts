import { renderWidgetHTML } from "./render.js";
import type { WidgetConfig, WidgetState } from "./types.js";

const WIDGET_STYLES = `
.tikka-widget-root {
  --of-ink: oklch(0.145 0.035 248);
  --of-paper: oklch(0.965 0.006 248);
  --of-warm: oklch(0.925 0.025 82);
  --of-grid: oklch(0.72 0.16 252 / 0.5);
  --of-muted: oklch(0.49 0.018 248);

  --of-blue: #5BA4FF;
  --of-yellow: #FFCC33;
  --of-mint: #53DCA2;
  --of-orange: #FF841F;
  --of-lavender: #D0A1FF;
  --of-violet: #9D72FF;
  --of-pink: #FF86B9;

  --of-line: 2px solid var(--of-ink);

  background: var(--of-paper);
  color: var(--of-ink);
  font-family: ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -0.025em;
  box-sizing: border-box;
}

.tikka-widget-root, .tikka-widget-root * { box-sizing: border-box; }

.tikka-widget-root button,
.tikka-widget-root a { color: inherit; font: inherit; }

.tikka-widget-root button:not(:disabled),
.tikka-widget-root a,
.tikka-widget-root [role="button"] { cursor: pointer; }

.tikka-widget-root button:disabled { cursor: not-allowed; opacity: 0.55; }

.tikka-widget-root :focus-visible {
  outline: 3px solid var(--of-orange);
  outline-offset: 3px;
}

.tikka-widget-root {
  width: 100%;
  max-width: 360px;
}

.tikka-widget-root[data-tikka-size="full"] {
  max-width: 480px;
}

.tk-card {
  border: var(--of-line);
  background: var(--of-paper);
  box-shadow: 6px 6px 0 var(--of-ink);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-weight: 600;
}

.tikka-widget-root[data-tikka-size="full"] .tk-card {
  padding: 28px;
  gap: 18px;
}

.tk-card-mint { box-shadow: 6px 6px 0 var(--of-mint); }
.tk-card-pink { box-shadow: 6px 6px 0 var(--of-pink); }
.tk-card-orange { box-shadow: 6px 6px 0 var(--of-orange); }

.tk-market-label {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--of-muted);
}

.tk-question {
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.3;
  margin: 0;
}

.tk-body {
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.5;
  margin: 0;
}

.tk-strong { font-weight: 800; }

.tk-caption {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--of-muted);
  margin: 0;
}

.tk-btn {
  border: var(--of-line);
  background: var(--of-paper);
  padding: 12px 18px;
  font-size: 0.9rem;
  font-weight: 800;
  box-shadow: 4px 4px 0 var(--of-ink);
  transition: transform 110ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 160ms, background 160ms;
}

.tk-btn:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--of-ink);
}

.tk-btn-primary { background: var(--of-yellow); }
.tk-btn-mint { background: var(--of-mint); }
.tk-btn-pink { background: var(--of-pink); }

.tk-idle-panel, .tk-wait-panel, .tk-transition-panel, .tk-error-panel,
.tk-submit-panel, .tk-live-panel, .tk-settling-panel, .tk-result-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tk-wait-panel {
  align-items: center;
  text-align: center;
  border: var(--of-line);
  padding: 24px 16px;
  background: var(--of-warm);
}

.tk-wait-panel-pulse { animation: tk-pulse-border 1400ms ease-in-out infinite; }

.tk-wait-ring {
  width: 40px;
  height: 40px;
  border: var(--of-line);
  border-radius: 999px;
  border-top-color: transparent;
  animation: tk-spin 900ms linear infinite;
}

@keyframes tk-spin {
  to { transform: rotate(360deg); }
}

@keyframes tk-pulse-border {
  0%, 100% { box-shadow: 4px 4px 0 var(--of-ink); }
  50% { box-shadow: 4px 4px 0 var(--of-yellow); }
}

.tk-transition-panel {
  align-items: flex-start;
}

.tk-check-mark {
  width: 32px;
  height: 32px;
  border: var(--of-line);
  border-radius: 999px;
  background: var(--of-mint);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.tk-error-panel { align-items: flex-start; }

.tk-predict-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tk-direction-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.tk-direction-btn[aria-pressed="true"] {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--of-ink);
}

.tk-stake-label {
  font-size: 0.82rem;
  font-weight: 700;
}

.tk-stake-input {
  border: var(--of-line);
  background: var(--of-paper);
  padding: 10px 12px;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: ui-monospace, SFMono-Regular, monospace;
}

.tk-predict-submit { margin-top: 4px; }

.tk-submit-panel { align-items: stretch; }

.tk-progress-track {
  width: 100%;
  height: 10px;
  border: var(--of-line);
  overflow: hidden;
  background: var(--of-warm);
}

.tk-progress-fill {
  height: 100%;
  width: 40%;
  background: var(--of-blue);
  animation: tk-progress-slide 1100ms ease-in-out infinite;
}

@keyframes tk-progress-slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(250%); }
}

.tk-live-panel { align-items: flex-start; }

.tk-live-badge {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--of-mint);
  border: var(--of-line);
  padding: 3px 10px;
  border-radius: 999px;
}

.tk-countdown {
  display: flex;
  align-items: baseline;
  gap: 10px;
  border: var(--of-line);
  background: var(--of-warm);
  padding: 10px 14px;
  width: 100%;
}

.tk-countdown-value {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 1.4rem;
  font-weight: 800;
}

.tk-countdown-caption {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--of-muted);
}

.tk-settling-panel { align-items: flex-start; }

.tk-settling-spinner {
  width: 28px;
  height: 28px;
  border: var(--of-line);
  border-radius: 999px;
  border-top-color: var(--of-orange);
  animation: tk-spin 700ms linear infinite;
}

.tk-result-panel { align-items: flex-start; }

.tk-result-reveal {
  animation: tk-result-in 420ms var(--tk-ease, cubic-bezier(0.16, 1, 0.3, 1));
}

@keyframes tk-result-in {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.tk-result-badge {
  font-size: 1.05rem;
  font-weight: 900;
  padding: 6px 14px;
  border: var(--of-line);
}

.tk-result-badge-mint { background: var(--of-mint); }
.tk-result-badge-pink { background: var(--of-pink); }

.tk-payout {
  font-size: 1rem;
  font-weight: 800;
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .tikka-widget-root * {
    animation: none !important;
    transition: none !important;
  }
}
`;

export interface ShadowWidget {
  shadowRoot: ShadowRoot;
  update(state: WidgetState): void;
  destroy(): void;
}

export function mountShadowWidget(host: Element, config: WidgetConfig): ShadowWidget {
  const shadowRoot = host.attachShadow({ mode: "open" });

  const styleEl = document.createElement("style");
  styleEl.textContent = WIDGET_STYLES;

  const rootEl = document.createElement("div");
  rootEl.className = "tikka-widget-root";
  rootEl.setAttribute("data-tikka-theme", config.theme);
  rootEl.setAttribute("data-tikka-size", config.size);

  const contentEl = document.createElement("div");
  contentEl.className = "tikka-widget-content";
  rootEl.appendChild(contentEl);

  shadowRoot.appendChild(styleEl);
  shadowRoot.appendChild(rootEl);

  return {
    shadowRoot,
    update(state: WidgetState) {
      contentEl.innerHTML = renderWidgetHTML(state, config);
    },
    destroy() {
      shadowRoot.removeChild(rootEl);
      shadowRoot.removeChild(styleEl);
    },
  };
}
