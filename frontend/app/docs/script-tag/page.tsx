import { CodeBlock } from "@/components/code-block";

const scanExample = `<script src="https://cdn.tikka.dev/widget.js"></script>
<div
  data-tikka
  data-market="SOMI-USD"
  data-window="1h"
  data-theme="auto"
  data-size="compact"
></div>`;

const mountExample = `<script src="https://cdn.tikka.dev/widget.js"></script>
<div id="my-widget"></div>
<script>
  Tikka.mount(document.getElementById("my-widget"), {
    market: "SOMI-USD",
    window: "1h",
    theme: "dark",
  });
</script>`;

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
        elements on load and mounts an instance into each. React is not
        required for this mode.
      </p>

      <div className="mt-10 max-w-[46rem]">
        <CodeBlock code={scanExample} language="html" />
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
                A market symbol. Check /docs/api or DreamDEX&apos;s markets
                for currently live symbols on Shannon testnet.
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
                One of the Event Contract windows DreamDEX supports for that
                market (e.g. 1h). Available windows vary by market, so
                validate against the market&apos;s actual windows rather than
                assuming one is always open.
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
                light, dark, or auto. Defaults to auto, which follows the
                host page&apos;s prefers-color-scheme.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono">data-size</td>
              <td className="px-4 py-3">No</td>
              <td className="px-4 py-3 text-[var(--of-muted)]">
                compact or full. Defaults to compact.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-14 font-[family-name:var(--font-display)] text-[1.8rem] font-extrabold">
        Mounting programmatically
      </h2>
      <p className="mt-4 text-[0.9rem] font-semibold leading-[1.5] text-[var(--of-muted)] max-w-[46rem]">
        If your page builds the element dynamically — after a route change,
        inside a component you render client-side, or in response to user
        action — call <code className="font-mono">Tikka.mount(element, config)</code>{" "}
        directly instead of relying on the page-load scan. The script exposes
        a global <code className="font-mono">Tikka</code> object with a{" "}
        <code className="font-mono">mount</code> function once it loads.
        Fields default the same way as the data attributes:{" "}
        <code className="font-mono">theme</code> defaults to{" "}
        <code className="font-mono">&quot;auto&quot;</code> and{" "}
        <code className="font-mono">size</code> defaults to{" "}
        <code className="font-mono">&quot;compact&quot;</code> when omitted.
      </p>
      <div className="mt-6 max-w-[46rem]">
        <CodeBlock code={mountExample} language="html" />
      </div>
    </div>
  );
}
