const stats = [
  { label: "Predictions made", value: "12,408" },
  { label: "Volume driven", value: "$184,200" },
  { label: "Unique wallets", value: "3,912" },
];

export default function DashboardPlaygroundPage() {
  return (
    <div className="of-container of-section-padding">
      <span className="of-pill border-2 border-[var(--of-ink)] bg-[var(--of-yellow)] px-3 py-1 text-[0.7rem] font-extrabold uppercase">
        Stretch feature
      </span>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2.6rem,5vw,4.5rem)] font-black leading-[0.95] tracking-[-0.045em]">
        Embedder analytics
      </h1>
      <p className="of-lede-section mt-6 text-[var(--of-muted)]">
        If there&apos;s time, embedders get a dashboard showing how their
        Tikka widget is performing: predictions made, volume driven, and
        wallets reached through their page specifically.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-2 border-[var(--of-ink)] of-shadow bg-[var(--of-warm)] p-6"
          >
            <p className="text-[0.75rem] font-bold uppercase tracking-wide text-[var(--of-muted)]">
              {stat.label}
            </p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-[2.2rem] font-black">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 border-2 border-dashed border-[var(--of-ink)]/40 p-6 max-w-[46rem]">
        <p className="text-[0.85rem] font-semibold text-[var(--of-muted)]">
          Real numbers, per-market breakdowns, and a date range picker land
          here once the core SDK is tracking embed-level events.
        </p>
      </div>
    </div>
  );
}
