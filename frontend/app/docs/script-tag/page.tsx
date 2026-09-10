export default function ScriptTagDocsPage() {
  return (
    <div className="of-container of-section-padding">
      <p className="text-[0.8rem] font-bold uppercase tracking-wide text-[var(--of-blue)]">
        Reference
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.6rem,5vw,4.5rem)] font-black leading-[0.95] tracking-[-0.045em]">
        Script tag
      </h1>
      <p className="of-lede-section mt-6 text-[var(--of-muted)]">
        Works on any page, framework or none. Load the script once, then add
        a widget div wherever you want a market embedded. The script scans
        the page for <code className="font-mono">[data-tikka]</code>{" "}
        elements on load and mounts an instance into each.
      </p>

      <div className="mt-10 border-2 border-[var(--of-ink)] of-shadow bg-[var(--of-ink)] text-[var(--of-paper)] max-w-[46rem]">
        <div className="flex items-center justify-between border-b-2 border-[var(--of-paper)]/20 px-4 py-2">
          <span className="text-[0.75rem] font-bold uppercase tracking-wide text-[var(--of-paper)]/70">
            index.html
          </span>
          <span className="of-pill border-2 border-[var(--of-paper)]/40 px-3 py-1 text-[0.7rem] font-bold">
            Copy
          </span>
        </div>
        <pre className="px-4 py-5 overflow-x-auto text-[0.85rem] leading-[1.7]">
          <code className="font-mono font-semibold">{`<script src="https://cdn.tikka.dev/widget.js"></script>
<div
  data-tikka
  data-market="SOMI-USD"
  data-window="1h"
  data-theme="auto"
  data-size="compact"
></div>`}</code>
        </pre>
      </div>

      <h2 className="mt-14 font-[family-name:var(--font-display)] text-[1.8rem] font-extrabold">
        Attributes
      </h2>
      <div className="mt-6 border-2 border-[var(--of-ink)] of-shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-left text-[0.85rem]">
          <thead>
            <tr className="bg-[var(--of-warm)]">
              <th className="border-b-2 border-[var(--of-ink)] px-4 py-3 font-extrabold">
                Attribute
              </th>
              <th className="border-b-2 border-[var(--of-ink)] px-4 py-3 font-extrabold">
                Required
              </th>
              <th className="border-b-2 border-[var(--of-ink)] px-4 py-3 font-extrabold">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="font-semibold">
            <tr>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono">
                data-market
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3">
                Yes
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 text-[var(--of-muted)]">
                A market symbol from GET /v0/markets.
              </td>
            </tr>
            <tr>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono">
                data-window
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3">
                Yes
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 text-[var(--of-muted)]">
                One of the market&apos;s available prediction windows, e.g.
                1h.
              </td>
            </tr>
            <tr>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono">
                data-theme
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3">
                No
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 text-[var(--of-muted)]">
                light, dark, or auto (default). Auto follows the host
                page&apos;s color scheme.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono">data-size</td>
              <td className="px-4 py-3">No</td>
              <td className="px-4 py-3 text-[var(--of-muted)]">
                compact (default) or full.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-14 font-[family-name:var(--font-display)] text-[1.8rem] font-extrabold">
        Mounting programmatically
      </h2>
      <p className="mt-4 text-[0.9rem] font-semibold leading-[1.5] text-[var(--of-muted)] max-w-[46rem]">
        If your page builds the element dynamically, call{" "}
        <code className="font-mono">Tikka.mount</code> directly instead of
        relying on the scan.
      </p>
      <div className="mt-6 border-2 border-[var(--of-ink)] of-shadow bg-[var(--of-ink)] text-[var(--of-paper)] max-w-[46rem]">
        <div className="flex items-center justify-between border-b-2 border-[var(--of-paper)]/20 px-4 py-2">
          <span className="text-[0.75rem] font-bold uppercase tracking-wide text-[var(--of-paper)]/70">
            index.html
          </span>
          <span className="of-pill border-2 border-[var(--of-paper)]/40 px-3 py-1 text-[0.7rem] font-bold">
            Copy
          </span>
        </div>
        <pre className="px-4 py-5 overflow-x-auto text-[0.85rem] leading-[1.7]">
          <code className="font-mono font-semibold">{`<script src="https://cdn.tikka.dev/widget.js"></script>
<div id="my-widget"></div>
<script>
  Tikka.mount(document.getElementById("my-widget"), {
    market: "SOMI-USD",
    window: "1h",
    theme: "dark",
  });
</script>`}</code>
        </pre>
      </div>
    </div>
  );
}
