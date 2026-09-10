import Link from "next/link";

export default function DocsIndexPage() {
  return (
    <div className="of-container of-section-padding">
      <h1 className="of-h1-hero font-[family-name:var(--font-display)] text-[clamp(3rem,6vw,5.5rem)]">
        Docs
      </h1>
      <p className="of-lede-section mt-6 text-[var(--of-muted)]">
        Tikka is a drop-in prediction widget. Embed it with a script tag on
        any page, or import the React component if you&apos;re already
        building in React. Either way you get the same widget, mounted in a
        shadow DOM so it never fights your CSS.
      </p>

      <div className="mt-10 border-2 border-[var(--of-ink)] of-shadow bg-[var(--of-ink)] text-[var(--of-paper)] max-w-[42rem]">
        <div className="flex items-center justify-between border-b-2 border-[var(--of-paper)]/20 px-4 py-2">
          <span className="text-[0.75rem] font-bold uppercase tracking-wide text-[var(--of-paper)]/70">
            Terminal
          </span>
          <span className="of-pill border-2 border-[var(--of-paper)]/40 px-3 py-1 text-[0.7rem] font-bold">
            Copy
          </span>
        </div>
        <pre className="px-4 py-5 overflow-x-auto">
          <code className="font-mono text-[0.95rem] font-semibold">
            npm install @tikka/widget
          </code>
        </pre>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        <Link
          href="/docs/script-tag"
          className="of-transition block border-2 border-[var(--of-ink)] of-shadow bg-[var(--of-warm)] p-6 hover:-translate-y-1 hover:of-shadow-md"
        >
          <span className="of-pill border-2 border-[var(--of-ink)] bg-[var(--of-blue)] px-3 py-1 text-[0.7rem] font-extrabold uppercase">
            Quickstart
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-[1.6rem] font-extrabold leading-tight">
            Script tag
          </h2>
          <p className="mt-2 text-[0.9rem] font-semibold leading-[1.5] text-[var(--of-muted)]">
            Framework-agnostic. Drop one script tag and a div on any page.
          </p>
        </Link>

        <Link
          href="/docs/react"
          className="of-transition block border-2 border-[var(--of-ink)] of-shadow bg-[var(--of-warm)] p-6 hover:-translate-y-1 hover:of-shadow-md"
        >
          <span className="of-pill border-2 border-[var(--of-ink)] bg-[var(--of-mint)] px-3 py-1 text-[0.7rem] font-extrabold uppercase">
            Quickstart
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-[1.6rem] font-extrabold leading-tight">
            React
          </h2>
          <p className="mt-2 text-[0.9rem] font-semibold leading-[1.5] text-[var(--of-muted)]">
            A typed component with props instead of data-attributes.
          </p>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Link
          href="/docs/events"
          className="of-transition block border-2 border-[var(--of-ink)] of-shadow-sm p-5 hover:-translate-y-1 hover:of-shadow"
        >
          <h3 className="font-[family-name:var(--font-display)] text-[1.15rem] font-extrabold">
            Events reference
          </h3>
          <p className="mt-2 text-[0.85rem] font-semibold text-[var(--of-muted)]">
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
          <p className="mt-2 text-[0.85rem] font-semibold text-[var(--of-muted)]">
            For building custom UI directly on packages/core.
          </p>
        </Link>
      </div>
    </div>
  );
}
