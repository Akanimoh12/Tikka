import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

const basicExample = `import { TikkaWidget } from "@tikka/widget/react";

export function TokenPage() {
  return (
    <TikkaWidget
      market="BTC-USD"
      window="15m"
      theme="auto"
      size="compact"
      onSettled={(result) => console.log(result)}
    />
  );
}`;

const callbacksExample = `import { useState } from "react";
import { TikkaWidget } from "@tikka/widget/react";

export function TokenPage() {
  const [lastResult, setLastResult] = useState<string | null>(null);

  return (
    <>
      <TikkaWidget
        market="BTC-USD"
        window="15m"
        onConnected={({ address }) => {
          console.log("Wallet connected:", address);
        }}
        onSubmitted={({ txHash, direction, stake }) => {
          console.log(\`Predicted \${direction} for \${stake}, tx \${txHash}\`);
        }}
        onSettled={({ outcome, payout }) => {
          setLastResult(
            outcome === "won" ? \`Won, payout \${payout}\` : "Lost"
          );
        }}
        onError={({ code, message }) => {
          console.error(\`Tikka error (\${code}): \${message}\`);
        }}
      />
      {lastResult && <p>{lastResult}</p>}
    </>
  );
}`;

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
        get props and callbacks instead of data-attributes and DOM events.{" "}
        <code className="font-mono">react</code> is a peer dependency, marked
        optional in the package, so it only applies when you import{" "}
        <code className="font-mono">@tikka/widget/react</code> — it uses your
        app&apos;s existing React install rather than bundling its own.
      </p>

      <div className="mt-10 max-w-[46rem]">
        <CodeBlock code={basicExample} language="tsx" />
      </div>

      <h2 className="mt-14 font-[family-name:var(--font-display)] text-[1.8rem] font-extrabold">
        Props
      </h2>
      <div className="mt-6 border-2 border-[var(--of-ink)] of-shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-left text-[0.95rem]">
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
                Required. A market symbol.
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
                Required. One of the market&apos;s available Event Contract
                windows, e.g. &quot;1h&quot;.
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
                Optional. Defaults to &quot;auto&quot;, which follows the
                host page&apos;s prefers-color-scheme.
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
                Optional. Defaults to &quot;compact&quot;.
              </td>
            </tr>
            <tr>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono">
                onConnected
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono text-[var(--of-blue)]">
                (detail: {"{ address }"}) {"=>"} void
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 text-[var(--of-muted)]">
                Optional. Called when the wallet connects.
              </td>
            </tr>
            <tr>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono">
                onSubmitted
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono text-[var(--of-blue)]">
                (detail: {"{ txHash, predictionId, direction, stake }"}) {"=>"}{" "}
                void
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 text-[var(--of-muted)]">
                Optional. Called when the prediction transaction is sent.
              </td>
            </tr>
            <tr>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono">
                onSettled
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono text-[var(--of-blue)]">
                (detail: {'{ predictionId, outcome: "won" | "lost", payout }'})
                {" => "}void
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 text-[var(--of-muted)]">
                Optional. Called when settlement is received.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono">onError</td>
              <td className="px-4 py-3 font-mono text-[var(--of-blue)]">
                (detail: {"{ code, message }"}) {"=>"} void
              </td>
              <td className="px-4 py-3 text-[var(--of-muted)]">
                Optional. Called whenever the widget enters an error state.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-14 font-[family-name:var(--font-display)] text-[1.8rem] font-extrabold">
        Wiring up callbacks
      </h2>
      <p className="mt-4 text-[1rem] font-semibold leading-[1.5] text-[var(--of-muted)] max-w-[46rem]">
        Each callback receives the same detail payload as the matching{" "}
        <Link
          className="underline decoration-2 underline-offset-2"
          href="/docs/events"
        >
          tikka:* DOM event
        </Link>
        . Use them to update your own UI without touching the widget&apos;s
        internals.
      </p>
      <div className="mt-6 max-w-[46rem]">
        <CodeBlock code={callbacksExample} language="tsx" />
      </div>
    </div>
  );
}
