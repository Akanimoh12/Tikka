import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

const scriptTagExample = `<script src="https://tikka-frontend-tau.vercel.app/widget.js"></script>
<div
  data-tikka
  data-market="BTC-USD"
  data-window="15m"
  data-theme="auto"
  data-size="compact"
></div>`;

const reactExample = `import { TikkaWidget } from "@tikka/widget/react";

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

export default function DocsIndexPage() {
  return (
    <div className="of-container of-section-padding">
      <p className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[var(--of-violet)]">
        Docs
      </p>
      <h1 className="of-h2-section mt-3 font-[family-name:var(--font-display)]">
        Tikka docs
      </h1>
      <p className="of-lede-section mt-6 text-[var(--of-muted)]">
        Tikka is a drop-in prediction widget for DreamDEX Event Contracts on
        Somnia. Embed one script tag or import one React component, and any
        page gets a live Up/Down prediction card wired to a real wallet,
        settling on-chain through DreamDEX.
      </p>

      <h2 className="mt-14 font-[family-name:var(--font-display)] text-[1.4rem] font-extrabold">
        Install
      </h2>
      <p className="mt-3 max-w-[46rem] text-[1rem] font-semibold leading-[1.5] text-[var(--of-muted)]">
        <code className="font-mono">@tikka/widget</code> is currently built
        and versioned inside this monorepo and is not yet published to the
        public npm registry. Once published, installing it will look like
        this:
      </p>
      <div className="mt-4 max-w-[46rem]">
        <CodeBlock code="npm install @tikka/widget" language="bash" />
      </div>
      <p className="mt-4 max-w-[46rem] text-[0.95rem] font-semibold leading-[1.5] text-[var(--of-muted)]">
        Until then, the built bundle is live and reachable today at{" "}
        <code className="font-mono">https://tikka-frontend-tau.vercel.app/widget.js</code>{" "}
        — use that URL directly in a script tag to try the real thing right
        now.
      </p>

      <h2 className="mt-14 font-[family-name:var(--font-display)] text-[1.4rem] font-extrabold">
        Quickstart
      </h2>
      <p className="mt-3 max-w-[46rem] text-[1rem] font-semibold leading-[1.5] text-[var(--of-muted)]">
        Both embed modes mount the identical widget. Pick whichever matches
        the host page.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-[1.1rem] font-extrabold">
            Script tag
          </h3>
          <p className="mt-2 text-[0.95rem] font-semibold text-[var(--of-muted)]">
            Framework-agnostic. Works on any HTML page.
          </p>
          <div className="mt-4">
            <CodeBlock code={scriptTagExample} language="html" />
          </div>
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-[1.1rem] font-extrabold">
            React
          </h3>
          <p className="mt-2 text-[0.95rem] font-semibold text-[var(--of-muted)]">
            A typed component for apps already running React.
          </p>
          <div className="mt-4">
            <CodeBlock code={reactExample} language="tsx" />
          </div>
        </div>
      </div>

      <h2 className="mt-14 font-[family-name:var(--font-display)] text-[1.4rem] font-extrabold">
        Full references
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Link
          href="/docs/script-tag"
          className="of-transition block border-2 border-[var(--of-ink)] of-shadow bg-[var(--of-warm)] p-6 hover:-translate-y-1 hover:of-shadow-md"
        >
          <span className="of-pill border-2 border-[var(--of-ink)] bg-[var(--of-blue)] px-3 py-1 text-[0.7rem] font-extrabold uppercase">
            Reference
          </span>
          <h3 className="mt-4 font-[family-name:var(--font-display)] text-[1.4rem] font-extrabold leading-tight">
            Script tag
          </h3>
          <p className="mt-2 text-[1rem] font-semibold leading-[1.5] text-[var(--of-muted)]">
            The [data-tikka] auto-scan attributes and the Tikka.mount
            programmatic API.
          </p>
        </Link>

        <Link
          href="/docs/react"
          className="of-transition block border-2 border-[var(--of-ink)] of-shadow bg-[var(--of-warm)] p-6 hover:-translate-y-1 hover:of-shadow-md"
        >
          <span className="of-pill border-2 border-[var(--of-ink)] bg-[var(--of-mint)] px-3 py-1 text-[0.7rem] font-extrabold uppercase">
            Reference
          </span>
          <h3 className="mt-4 font-[family-name:var(--font-display)] text-[1.4rem] font-extrabold leading-tight">
            React component
          </h3>
          <p className="mt-2 text-[1rem] font-semibold leading-[1.5] text-[var(--of-muted)]">
            Every prop on TikkaWidget, with a callback usage example.
          </p>
        </Link>

        <Link
          href="/docs/events"
          className="of-transition block border-2 border-[var(--of-ink)] of-shadow-sm p-5 hover:-translate-y-1 hover:of-shadow"
        >
          <h3 className="font-[family-name:var(--font-display)] text-[1.15rem] font-extrabold">
            Events reference
          </h3>
          <p className="mt-2 text-[0.95rem] font-semibold text-[var(--of-muted)]">
            The tikka:* DOM events every widget instance dispatches.
          </p>
        </Link>
        <Link
          href="/docs/api"
          className="of-transition block border-2 border-[var(--of-ink)] of-shadow-sm p-5 hover:-translate-y-1 hover:of-shadow"
        >
          <h3 className="font-[family-name:var(--font-display)] text-[1.15rem] font-extrabold">
            Core API reference
          </h3>
          <p className="mt-2 text-[0.95rem] font-semibold text-[var(--of-muted)]">
            For building custom UI directly on @tikka/core.
          </p>
        </Link>
      </div>
    </div>
  );
}
