export default function ApiDocsPage() {
  return (
    <div className="of-container of-section-padding">
      <p className="text-[0.8rem] font-bold uppercase tracking-wide text-[var(--of-violet)]">
        Reference
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.6rem,5vw,4.5rem)] font-black leading-[0.95] tracking-[-0.045em]">
        Core API
      </h1>
      <p className="of-lede-section mt-6 text-[var(--of-muted)]">
        Most embedders should just use the widget. This page is for
        developers building entirely custom UI on top of the raw client in{" "}
        <code className="font-mono">packages/core</code> — no shadow DOM, no
        default styling, just the data and actions.
      </p>

      <div className="mt-10 border-2 border-[var(--of-ink)] of-shadow-sm bg-[var(--of-warm)] p-6 max-w-[46rem]">
        <h2 className="font-[family-name:var(--font-display)] text-[1.4rem] font-extrabold">
          Coming once packages/core is built
        </h2>
        <p className="mt-3 text-[0.9rem] font-semibold leading-[1.5] text-[var(--of-muted)]">
          This reference will cover the client surface once it lands,
          including:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3">
            <span className="of-pill border-2 border-[var(--of-ink)] bg-[var(--of-blue)] shrink-0 w-6 h-6 flex items-center justify-center text-[0.75rem] font-extrabold">
              1
            </span>
            <span className="text-[0.9rem] font-semibold leading-[1.5]">
              Market data — listing markets, current odds, and available
              prediction windows.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="of-pill border-2 border-[var(--of-ink)] bg-[var(--of-mint)] shrink-0 w-6 h-6 flex items-center justify-center text-[0.75rem] font-extrabold">
              2
            </span>
            <span className="text-[0.9rem] font-semibold leading-[1.5]">
              WebSocket subscription — streaming price and settlement updates
              for a market/window pair.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="of-pill border-2 border-[var(--of-ink)] bg-[var(--of-yellow)] shrink-0 w-6 h-6 flex items-center justify-center text-[0.75rem] font-extrabold">
              3
            </span>
            <span className="text-[0.9rem] font-semibold leading-[1.5]">
              placeOrder wrapper — submitting a prediction transaction
              without hand-rolling the contract call.
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-10 border-2 border-dashed border-[var(--of-ink)]/40 p-6 max-w-[46rem]">
        <p className="text-[0.85rem] font-semibold text-[var(--of-muted)]">
          Until then, the widget docs for{" "}
          <code className="font-mono">script tag</code> and{" "}
          <code className="font-mono">react</code> cover everything most
          integrations need.
        </p>
      </div>
    </div>
  );
}
