import { WidgetPlaceholder } from "@/components/widget-placeholder";

const chatMessages = [
  { user: "somi_max", message: "let's gooo" },
  { user: "0xjade", message: "this window closing soon?" },
  { user: "reef_runner", message: "up only" },
  { user: "pika.eth", message: "just predicted, wish me luck" },
  { user: "somi_max", message: "gg" },
];

export default function StreamPlaygroundPage() {
  return (
    <div className="of-container of-section-padding">
      <p className="text-[0.8rem] font-bold uppercase tracking-wide text-[var(--of-muted)]">
        Mock live-stream host page
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.4rem,5vw,3.6rem)] font-black tracking-[-0.04em]">
        SOMI trading, live
      </h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div className="border-2 border-[var(--of-ink)] of-shadow bg-[var(--of-ink)] text-[var(--of-paper)] aspect-video relative flex items-center justify-center">
            <span className="absolute top-4 left-4 of-pill border-2 border-[var(--of-ink)] bg-[var(--of-orange)] px-3 py-1 text-[0.7rem] font-extrabold uppercase text-[var(--of-ink)]">
              Live
            </span>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 border-2 border-[var(--of-paper)] rounded-full flex items-center justify-center">
                <div
                  className="w-0 h-0 ml-1"
                  style={{
                    borderTop: "12px solid transparent",
                    borderBottom: "12px solid transparent",
                    borderLeft: "18px solid var(--of-paper)",
                  }}
                />
              </div>
              <p className="text-[0.85rem] font-bold text-[var(--of-paper)]/70">
                Stream placeholder
              </p>
            </div>
          </div>

          <WidgetPlaceholder />
        </div>

        <div className="border-2 border-[var(--of-ink)] of-shadow-sm bg-[var(--of-warm)] flex flex-col max-h-[520px]">
          <div className="border-b-2 border-[var(--of-ink)] px-4 py-3">
            <p className="text-[0.8rem] font-extrabold uppercase tracking-wide">
              Chat
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {chatMessages.map((chat, i) => (
              <div key={i} className="text-[0.82rem] leading-[1.4]">
                <span className="font-extrabold text-[var(--of-blue)]">
                  {chat.user}
                </span>{" "}
                <span className="font-semibold">{chat.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
