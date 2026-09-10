export default function ReactDocsPage() {
  return (
    <div className="of-container of-section-padding">
      <p className="text-[0.8rem] font-bold uppercase tracking-wide text-[var(--of-mint)]">
        Reference
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.6rem,5vw,4.5rem)] font-black leading-[0.95] tracking-[-0.045em]">
        React component
      </h1>
      <p className="of-lede-section mt-6 text-[var(--of-muted)]">
        A typed wrapper around the same widget the script tag mounts, so you
        get props and callbacks instead of data-attributes and DOM events.
        Peer-depends on your app&apos;s existing React install.
      </p>

      <div className="mt-10 border-2 border-[var(--of-ink)] of-shadow bg-[var(--of-ink)] text-[var(--of-paper)] max-w-[46rem]">
        <div className="flex items-center justify-between border-b-2 border-[var(--of-paper)]/20 px-4 py-2">
          <span className="text-[0.75rem] font-bold uppercase tracking-wide text-[var(--of-paper)]/70">
            TokenPage.tsx
          </span>
          <span className="of-pill border-2 border-[var(--of-paper)]/40 px-3 py-1 text-[0.7rem] font-bold">
            Copy
          </span>
        </div>
        <pre className="px-4 py-5 overflow-x-auto text-[0.85rem] leading-[1.7]">
          <code className="font-mono font-semibold">{`import { TikkaWidget } from "@tikka/widget/react";

export function TokenPage() {
  return (
    <TikkaWidget
      market="SOMI-USD"
      window="1h"
      theme="auto"
      size="compact"
      onSettled={(result) => console.log(result)}
    />
  );
}`}</code>
        </pre>
      </div>

      <h2 className="mt-14 font-[family-name:var(--font-display)] text-[1.8rem] font-extrabold">
        Props
      </h2>
      <p className="mt-4 text-[0.9rem] font-semibold leading-[1.5] text-[var(--of-muted)] max-w-[46rem]">
        This table is representative, not final — packages/core lands next
        and may add a couple more callbacks.
      </p>
      <div className="mt-6 border-2 border-[var(--of-ink)] of-shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-left text-[0.85rem]">
          <thead>
            <tr className="bg-[var(--of-warm)]">
              <th className="border-b-2 border-[var(--of-ink)] px-4 py-3 font-extrabold">
                Prop
              </th>
              <th className="border-b-2 border-[var(--of-ink)] px-4 py-3 font-extrabold">
                Type
              </th>
              <th className="border-b-2 border-[var(--of-ink)] px-4 py-3 font-extrabold">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="font-semibold">
            <tr>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono">
                market
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono text-[var(--of-blue)]">
                string
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 text-[var(--of-muted)]">
                Required. A market symbol from GET /v0/markets.
              </td>
            </tr>
            <tr>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono">
                window
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono text-[var(--of-blue)]">
                string
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 text-[var(--of-muted)]">
                Required. One of the market&apos;s available windows.
              </td>
            </tr>
            <tr>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono">
                theme
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono text-[var(--of-blue)]">
                &quot;light&quot; | &quot;dark&quot; | &quot;auto&quot;
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 text-[var(--of-muted)]">
                Defaults to auto.
              </td>
            </tr>
            <tr>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono">
                size
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono text-[var(--of-blue)]">
                &quot;compact&quot; | &quot;full&quot;
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 text-[var(--of-muted)]">
                Defaults to compact.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono">onSettled</td>
              <td className="px-4 py-3 font-mono text-[var(--of-blue)]">
                (result) =&gt; void
              </td>
              <td className="px-4 py-3 text-[var(--of-muted)]">
                Called when a prediction settles, won or lost.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
