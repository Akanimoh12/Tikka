import Link from "next/link";

export default function NotFound() {
  return (
    <div className="of-container of-section-padding flex flex-col items-start">
      <span className="of-pill border-2 border-[var(--of-ink)] bg-[var(--of-pink)] px-3 py-1 text-[0.7rem] font-extrabold uppercase">
        404
      </span>
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-[clamp(3.5rem,8vw,7.5rem)] font-black leading-[0.92] tracking-[-0.05em]">
        Nothing settled here
      </h1>
      <p className="of-lede-section mt-6 text-[var(--of-muted)]">
        There&apos;s no page at this address. It might have moved, or the
        link was just wrong — either way, you&apos;re not stuck.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/"
          className="of-transition of-pill border-2 border-[var(--of-ink)] of-shadow bg-[var(--of-yellow)] px-6 py-3 font-extrabold hover:-translate-y-1 hover:of-shadow-md"
        >
          Back to homepage
        </Link>
        <Link
          href="/docs"
          className="of-transition of-pill border-2 border-[var(--of-ink)] of-shadow-sm bg-[var(--of-paper)] px-6 py-3 font-extrabold hover:-translate-y-1 hover:of-shadow"
        >
          Read the docs
        </Link>
      </div>
    </div>
  );
}
