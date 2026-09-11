"use client";

import { TikkaWidget } from "@tikka/widget/react";

const gradients = [
  "linear-gradient(135deg, var(--of-blue), var(--of-mint))",
  "linear-gradient(135deg, var(--of-mint), var(--of-blue))",
  "linear-gradient(135deg, var(--of-yellow), var(--of-orange))",
  "linear-gradient(135deg, var(--of-pink), var(--of-orange))",
  "linear-gradient(135deg, var(--of-orange), var(--of-pink))",
  "linear-gradient(135deg, var(--of-blue), var(--of-yellow))",
  "linear-gradient(135deg, var(--of-mint), var(--of-yellow))",
  "linear-gradient(135deg, var(--of-pink), var(--of-blue))",
];

export default function NftPlaygroundPage() {
  return (
    <div className="of-container of-section-padding">
      <p className="text-[0.8rem] font-bold uppercase tracking-wide text-[var(--of-muted)]">
        Mock NFT host page
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.4rem,5vw,3.6rem)] font-black tracking-[-0.04em]">
        Overflow Owls
      </h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {gradients.map((gradient, i) => (
              <div
                key={i}
                className="border-2 border-[var(--of-ink)] of-shadow-sm"
              >
                <div
                  className="aspect-square"
                  style={{ background: gradient }}
                />
                <div className="border-t-2 border-[var(--of-ink)] px-3 py-2 bg-[var(--of-paper)]">
                  <p className="text-[0.8rem] font-extrabold">
                    Owl #{String(1000 + i)}
                  </p>
                  <p className="text-[0.7rem] font-semibold text-[var(--of-muted)]">
                    0.{4 + i} ETH
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border-2 border-[var(--of-ink)] of-shadow-sm bg-[var(--of-warm)] p-5">
            <p className="text-[0.7rem] font-bold uppercase tracking-wide text-[var(--of-muted)]">
              Floor price
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-[2rem] font-black">
              0.38 ETH
            </p>
            <p className="mt-1 text-[0.8rem] font-bold text-[var(--of-pink)]">
              -2.1% (24h)
            </p>
          </div>
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-wide text-[var(--of-muted)] mb-2">
              Predict floor price direction
            </p>
            <div className="border-2 border-[var(--of-ink)] of-shadow-sm bg-[var(--of-warm)] p-4">
              <TikkaWidget market="BTC-USD" window="15m" theme="auto" size="compact" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
