import Link from "next/link";

const hosts = [
  {
    href: "/playground/dex",
    label: "DEX token page",
    color: "var(--of-blue)",
    description: "A token detail page with a price chart and stat tiles.",
  },
  {
    href: "/playground/nft",
    label: "NFT collection page",
    color: "var(--of-mint)",
    description: "A collection grid with a floor price panel.",
  },
  {
    href: "/playground/stream",
    label: "Live stream page",
    color: "var(--of-orange)",
    description: "A live video page with chat alongside the widget.",
  },
];

export default function PlaygroundIndexPage() {
  return (
    <div className="of-container of-section-padding">
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(3rem,6vw,5.5rem)] font-black leading-[0.94] tracking-[-0.055em]">
        Playground
      </h1>
      <p className="of-lede-section mt-6 text-[var(--of-muted)]">
        See Tikka embedded in three different kinds of apps. These are mock
        host pages — the surrounding product is fake, but they show where
        the widget actually sits once it&apos;s dropped in.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {hosts.map((host) => (
          <Link
            key={host.href}
            href={host.href}
            className="of-transition block border-2 border-[var(--of-ink)] of-shadow bg-[var(--of-warm)] p-6 hover:-translate-y-1 hover:of-shadow-md"
          >
            <div
              className="w-10 h-10 border-2 border-[var(--of-ink)]"
              style={{ background: host.color }}
            />
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-[1.4rem] font-extrabold leading-tight">
              {host.label}
            </h2>
            <p className="mt-2 text-[0.85rem] font-semibold leading-[1.5] text-[var(--of-muted)]">
              {host.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/playground/dashboard"
          className="of-transition inline-block border-2 border-[var(--of-ink)] of-shadow-sm px-5 py-3 text-[0.85rem] font-bold hover:-translate-y-0.5 hover:of-shadow"
        >
          Embedder analytics (stretch)
        </Link>
      </div>
    </div>
  );
}
