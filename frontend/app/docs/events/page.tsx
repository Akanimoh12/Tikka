const events = [
  {
    name: "tikka:connected",
    payload: "{ address }",
    fires: "Wallet connects",
  },
  {
    name: "tikka:submitted",
    payload: "{ txHash, predictionId, direction, stake }",
    fires: "Prediction transaction sent",
  },
  {
    name: "tikka:settled",
    payload: '{ predictionId, outcome: "won" | "lost", payout }',
    fires: "Settlement received",
  },
  {
    name: "tikka:error",
    payload: "{ code, message }",
    fires: "Any error state entered",
  },
];

export default function EventsDocsPage() {
  return (
    <div className="of-container of-section-padding">
      <p className="text-[0.8rem] font-bold uppercase tracking-wide text-[var(--of-orange)]">
        Reference
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.6rem,5vw,4.5rem)] font-black leading-[0.95] tracking-[-0.045em]">
        Events
      </h1>
      <p className="of-lede-section mt-6 text-[var(--of-muted)]">
        The widget dispatches standard DOM CustomEvents on its mount element,
        so non-React host pages can react without any framework. The React
        wrapper exposes the same moments as props (onConnected, onSubmitted,
        onSettled, onError) instead of requiring addEventListener.
      </p>

      <div className="mt-10 border-2 border-[var(--of-ink)] of-shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-left text-[0.85rem]">
          <thead>
            <tr className="bg-[var(--of-warm)]">
              <th className="border-b-2 border-[var(--of-ink)] px-4 py-3 font-extrabold">
                Event
              </th>
              <th className="border-b-2 border-[var(--of-ink)] px-4 py-3 font-extrabold">
                Detail payload
              </th>
              <th className="border-b-2 border-[var(--of-ink)] px-4 py-3 font-extrabold">
                Fires when
              </th>
            </tr>
          </thead>
          <tbody className="font-semibold">
            {events.map((event, i) => (
              <tr key={event.name}>
                <td
                  className={`px-4 py-3 font-mono text-[var(--of-blue)] ${
                    i < events.length - 1
                      ? "border-b border-[var(--of-ink)]/15"
                      : ""
                  }`}
                >
                  {event.name}
                </td>
                <td
                  className={`px-4 py-3 font-mono text-[0.8rem] ${
                    i < events.length - 1
                      ? "border-b border-[var(--of-ink)]/15"
                      : ""
                  }`}
                >
                  {event.payload}
                </td>
                <td
                  className={`px-4 py-3 text-[var(--of-muted)] ${
                    i < events.length - 1
                      ? "border-b border-[var(--of-ink)]/15"
                      : ""
                  }`}
                >
                  {event.fires}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 border-2 border-[var(--of-ink)] of-shadow bg-[var(--of-ink)] text-[var(--of-paper)] max-w-[46rem]">
        <div className="flex items-center justify-between border-b-2 border-[var(--of-paper)]/20 px-4 py-2">
          <span className="text-[0.75rem] font-bold uppercase tracking-wide text-[var(--of-paper)]/70">
            listen.js
          </span>
          <span className="of-pill border-2 border-[var(--of-paper)]/40 px-3 py-1 text-[0.7rem] font-bold">
            Copy
          </span>
        </div>
        <pre className="px-4 py-5 overflow-x-auto text-[0.85rem] leading-[1.7]">
          <code className="font-mono font-semibold">{`document
  .getElementById("my-widget")
  .addEventListener("tikka:settled", (event) => {
    console.log(event.detail);
  });`}</code>
        </pre>
      </div>
    </div>
  );
}
