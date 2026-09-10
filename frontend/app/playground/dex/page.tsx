import { WidgetPlaceholder } from "@/components/widget-placeholder";

const stats = [
  { label: "Price", value: "$0.84210", accent: "var(--of-ink)" },
  { label: "24h change", value: "+6.32%", accent: "var(--of-mint)" },
  { label: "24h volume", value: "$2.1M", accent: "var(--of-ink)" },
  { label: "Liquidity", value: "$8.6M", accent: "var(--of-ink)" },
];

export default function DexPlaygroundPage() {
  return (
    <div className="of-container of-section-padding">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-[var(--of-ink)] pb-6">
        <div>
          <p className="text-[0.8rem] font-bold uppercase tracking-wide text-[var(--of-muted)]">
            Mock DEX host page
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.4rem,5vw,3.6rem)] font-black tracking-[-0.04em]">
            SOMI / USD
          </h1>
        </div>
        <span className="of-pill border-2 border-[var(--of-ink)] bg-[var(--of-mint)] px-4 py-2 text-[0.85rem] font-extrabold">
          +6.32%
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="of-grid-paper border-2 border-[var(--of-ink)] of-shadow h-[360px] flex items-end p-6 relative overflow-hidden">
            <svg
              viewBox="0 0 400 140"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full"
            >
              <polyline
                points="0,110 40,95 80,100 120,70 160,80 200,50 240,60 280,30 320,45 360,20 400,35"
                fill="none"
                stroke="var(--of-blue)"
                strokeWidth="3"
              />
            </svg>
            <span className="relative text-[0.75rem] font-bold uppercase tracking-wide text-[var(--of-muted)]">
              Price chart placeholder
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-2 border-[var(--of-ink)] of-shadow-sm bg-[var(--of-warm)] p-4"
              >
                <p className="text-[0.7rem] font-bold uppercase tracking-wide text-[var(--of-muted)]">
                  {stat.label}
                </p>
                <p
                  className="mt-2 font-[family-name:var(--font-display)] text-[1.2rem] font-extrabold"
                  style={{ color: stat.accent }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <WidgetPlaceholder />
      </div>
    </div>
  );
}
