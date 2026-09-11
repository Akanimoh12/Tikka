import { CodeBlock } from "@/components/code-block";

const listMarketsExample = `import { createClient } from "@tikka/core";

const client = createClient();

const markets = await client.listMarkets();
for (const market of markets) {
  console.log(market.asset, market.status, market.question);
}`;

const createPredictionExample = `import { createPrediction } from "@tikka/core";

const result = await createPrediction({
  marketId,
  direction: "up",
  stake: 10_000000n,
  signer: walletClient,
});

if (result.ok) {
  console.log("Submitted", result.txHash, result.predictionId);
} else {
  switch (result.error) {
    case "wrong-network":
      console.error(\`Wrong network, expected \${result.expectedChainId}\`);
      break;
    case "insufficient-balance":
      console.error(\`Need \${result.required}, have \${result.available}\`);
      break;
    case "transaction-rejected":
      console.error("User rejected the transaction");
      break;
    case "window-expired":
      console.error(\`Market \${result.marketId} window already closed\`);
      break;
    case "market-not-trading":
      console.error(\`Market is \${result.status}, not trading\`);
      break;
    case "contract-reverted":
      console.error(result.reason ?? result.message);
      break;
    case "rpc-error":
    case "unknown":
      console.error(result.message);
      break;
  }
}`;

export default function ApiDocsPage() {
  return (
    <div className="of-container of-section-padding">
      <p className="text-[0.8rem] font-bold uppercase tracking-wide text-[var(--of-violet)]">
        Reference
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.6rem,5vw,4.5rem)] font-black leading-[0.95] tracking-[-0.045em]">
        Core API
      </h1>
      <p className="of-lede-section mt-6 text-[var(--of-muted)]">
        Most embedders should just use the widget. This page is for
        developers building entirely custom UI on top of the raw client in{" "}
        <code className="font-mono">@tikka/core</code> — no shadow DOM, no
        default styling, just the data and actions the widget itself is
        built on.
      </p>

      <div className="mt-8 border-2 border-[var(--of-ink)] of-shadow-sm bg-[var(--of-warm)] p-6 max-w-[46rem]">
        <p className="text-[0.95rem] font-bold leading-[1.5]">
          @tikka/core is workspace-internal today, not published to the
          public npm registry.
        </p>
        <p className="mt-2 text-[0.95rem] font-semibold leading-[1.5] text-[var(--of-muted)]">
          It ships as a private package inside this monorepo alongside{" "}
          <code className="font-mono">@tikka/widget</code>. The examples on
          this page show the real, currently implemented API surface — the
          shape you&apos;d build against if you were working inside this
          repo or once the package is published — but{" "}
          <code className="font-mono">npm install @tikka/core</code> does
          not work from outside the workspace yet.
        </p>
      </div>

      <h2 className="mt-14 font-[family-name:var(--font-display)] text-[1.8rem] font-extrabold">
        createClient
      </h2>
      <p className="mt-4 text-[1rem] font-semibold leading-[1.5] text-[var(--of-muted)] max-w-[46rem]">
        <code className="font-mono">createClient(config?)</code> returns a{" "}
        <code className="font-mono">TikkaClient</code> scoped to a network
        (Shannon testnet by default). It exposes:
      </p>
      <div className="mt-6 border-2 border-[var(--of-ink)] of-shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-left text-[0.95rem]">
          <thead>
            <tr className="bg-[var(--of-warm)]">
              <th className="border-b-2 border-[var(--of-ink)] px-4 py-3 font-extrabold">
                Method
              </th>
              <th className="border-b-2 border-[var(--of-ink)] px-4 py-3 font-extrabold">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="font-semibold">
            <tr>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono text-[var(--of-blue)]">
                listMarkets()
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 text-[var(--of-muted)]">
                Returns all live Market records.
              </td>
            </tr>
            <tr>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono text-[var(--of-blue)]">
                getMarket(marketId)
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 text-[var(--of-muted)]">
                Returns one Market, or null if it isn&apos;t found.
              </td>
            </tr>
            <tr>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono text-[var(--of-blue)]">
                subscribeToMarket(marketId, onUpdate)
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 text-[var(--of-muted)]">
                Streams status/price updates for a market. Returns an
                unsubscribe function.
              </td>
            </tr>
            <tr>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 font-mono text-[var(--of-blue)]">
                subscribeToSettlement(marketId, onSettled)
              </td>
              <td className="border-b border-[var(--of-ink)]/15 px-4 py-3 text-[var(--of-muted)]">
                Fires once when a market resolves or is voided. Returns an
                unsubscribe function.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-[var(--of-blue)]">
                getWalletPositions(address)
              </td>
              <td className="px-4 py-3 text-[var(--of-muted)]">
                Returns the outcome-token positions held by a wallet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 max-w-[46rem]">
        <CodeBlock code={listMarketsExample} language="ts" />
      </div>

      <h2 className="mt-14 font-[family-name:var(--font-display)] text-[1.8rem] font-extrabold">
        createPrediction
      </h2>
      <p className="mt-4 text-[1rem] font-semibold leading-[1.5] text-[var(--of-muted)] max-w-[46rem]">
        <code className="font-mono">createPrediction(params, config?)</code>{" "}
        is a standalone function, not a client method. It takes a{" "}
        <code className="font-mono">marketId</code>, a{" "}
        <code className="font-mono">direction</code> (
        <code className="font-mono">&quot;up&quot;</code> or{" "}
        <code className="font-mono">&quot;down&quot;</code>), a{" "}
        <code className="font-mono">stake</code>, and a{" "}
        <code className="font-mono">signer</code> — a viem{" "}
        <code className="font-mono">Account</code> or{" "}
        <code className="font-mono">WalletClient</code>. It&apos;s wallet-library-agnostic:
        it doesn&apos;t assume wagmi or any particular connector, only viem
        types.
      </p>
      <p className="mt-4 text-[1rem] font-semibold leading-[1.5] text-[var(--of-muted)] max-w-[46rem]">
        Failures are typed, not thrown. The result is a discriminated union —
        check <code className="font-mono">result.ok</code> and branch on{" "}
        <code className="font-mono">result.error</code> for the failure case
        (<code className="font-mono">wrong-network</code>,{" "}
        <code className="font-mono">insufficient-balance</code>,{" "}
        <code className="font-mono">transaction-rejected</code>,{" "}
        <code className="font-mono">window-expired</code>,{" "}
        <code className="font-mono">market-not-trading</code>,{" "}
        <code className="font-mono">contract-reverted</code>,{" "}
        <code className="font-mono">rpc-error</code>, or{" "}
        <code className="font-mono">unknown</code>) instead of wrapping the
        call in try/catch for control flow.
      </p>
      <div className="mt-6 max-w-[46rem]">
        <CodeBlock code={createPredictionExample} language="ts" />
      </div>
    </div>
  );
}
