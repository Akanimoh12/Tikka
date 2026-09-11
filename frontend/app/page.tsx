import Link from "next/link";
import { HeroWidget } from "@/components/hero-widget";
import { CodeBlock } from "@/components/code-block";
import Footer from "@/components/footer";

const EMBED_SNIPPET = `<script src="https://cdn.tikka.dev/widget.js" data-market="SOMI-USD" data-window="1h"></script>`;

const STEPS = [
  {
    number: "01",
    title: "Embed it",
    body: "Drop in a script tag or import <TikkaWidget /> from @tikka/widget/react. No build step required for the script-tag path.",
  },
  {
    number: "02",
    title: "User predicts",
    body: "A visitor connects their wallet and picks Up or Down on the market you configured. The widget handles the wallet flow itself.",
  },
  {
    number: "03",
    title: "Settles on-chain",
    body: "The DreamDEX Event Contract settles at expiry. The widget listens for the result and shows it — win, loss, and payout — right there.",
  },
];

export default function Home() {
  return (
    <>
      <section className="of-section-padding of-grid-paper">
        <div className="of-container grid grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(320px,1fr)_minmax(400px,0.9fr)] lg:gap-20">
          <div className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-left">
            <h1 className="text-[clamp(3rem,6vw,5.5rem)] font-black leading-[0.96] tracking-[-0.04em] font-[family-name:var(--font-space-grotesk)] max-w-[13ch]">
              Ships in one tag
            </h1>
            <p className="max-w-[42ch] text-[1.1rem] font-semibold leading-[1.55] text-[var(--of-muted)]">
              Tikka is a drop-in widget for DreamDEX Event Contracts. One
              script tag or one React component gets you a live Up/Down
              market, wired to a real wallet, settling on-chain on Somnia.
              The card beside this is live right now.
            </p>
            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href="/docs"
                className="of-shadow of-transition border-2 border-[var(--of-ink)] bg-[var(--of-yellow)] px-6 py-3.5 text-base font-extrabold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                Read the docs
              </Link>
              <Link
                href="/playground"
                className="of-shadow of-transition border-2 border-[var(--of-ink)] bg-[var(--of-paper)] px-6 py-3.5 text-base font-extrabold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                See it on three sites
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <HeroWidget />
          </div>
        </div>
      </section>

      <section className="of-section-padding">
        <div className="of-container flex flex-col gap-6">
          <h2 className="of-h2-hero">One line to embed</h2>
          <p className="of-lede-hero">
            This is the actual script tag. Paste it into any page and it
            renders a working prediction card — no configuration beyond the
            market and window you want.
          </p>
          <div className="max-w-2xl w-full">
            <CodeBlock code={EMBED_SNIPPET} language="html" />
          </div>
        </div>
      </section>

      <section className="of-section-padding of-grid-paper">
        <div className="of-container flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <h2 className="of-h2-section">How it works</h2>
            <p className="of-lede-section">
              Three steps, start to finish. No order execution, settlement
              polling, or wallet plumbing to build yourself.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="of-shadow border-2 border-[var(--of-ink)] bg-[var(--of-paper)] p-6 flex flex-col gap-3"
              >
                <span className="font-[family-name:var(--font-mono)] text-[0.78rem] font-bold tracking-[0.1em] text-[var(--of-muted)]">
                  {step.number}
                </span>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-extrabold">
                  {step.title}
                </h3>
                <p className="text-[0.95rem] font-semibold leading-[1.6] text-[var(--of-muted)]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="of-section-padding">
        <div className="of-container flex flex-col gap-6">
          <h2 className="of-h2-section">Built for Somnia and DreamDEX</h2>
          <p className="of-lede-section">
            Tikka doesn&apos;t run its own markets or settlement logic. It
            calls DreamDEX&apos;s existing Event Contracts on Somnia, so
            every prediction placed through the widget is a real position on
            a real contract. Every site that embeds Tikka becomes another
            place people can reach those contracts — a DEX, an NFT
            marketplace, a stream page, without any of them building the
            wallet or settlement flow from scratch.
          </p>
          <p className="of-lede-section">
            Read the{" "}
            <a
              href="https://docs.dreamdex.io/developers/event-contracts"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-2 underline-offset-4"
            >
              DreamDEX Event Contracts documentation
            </a>{" "}
            for how settlement and collateral work under the hood.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
