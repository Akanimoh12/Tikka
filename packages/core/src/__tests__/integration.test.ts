import { config as loadEnv } from "dotenv";
import { privateKeyToAccount } from "viem/accounts";
import { createClient } from "../client.js";
import { createPrediction } from "../createPrediction.js";
import { DEFAULT_NETWORK_CONFIG } from "../config.js";

loadEnv({ path: new URL("../../.env", import.meta.url) });

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
    passed += 1;
    console.log(`ok   ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`FAIL ${name}`);
    console.log(error instanceof Error ? error.stack ?? error.message : error);
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main(): Promise<void> {
  const client = createClient(DEFAULT_NETWORK_CONFIG);

  let liveMarkets: Awaited<ReturnType<typeof client.listMarkets>> = [];

  await test("listMarkets returns live Shannon testnet markets", async () => {
    liveMarkets = await client.listMarkets();
    assert(Array.isArray(liveMarkets), "listMarkets must return an array");
    assert(liveMarkets.length > 0, "expected at least one live binary market on Shannon testnet");
    const [first] = liveMarkets;
    assert(typeof first.marketId === "string" && first.marketId.startsWith("0x"), "marketId must be a hex string");
    assert(typeof first.pool === "string" && first.pool.startsWith("0x"), "pool must be a hex address");
    assert(first.expiry > Math.floor(Date.now() / 1000), "a market returned by listMarkets should not already be expired");
  });

  await test("getMarket returns the same market listMarkets found", async () => {
    assert(liveMarkets.length > 0, "requires listMarkets to have found a market first");
    const target = liveMarkets[0];
    const market = await client.getMarket(target.marketId);
    assert(market !== null, "getMarket should find a market that listMarkets just returned");
    assert(market.marketId === target.marketId, "returned marketId should match the one requested");
    assert(market.pool === target.pool, "returned pool should match the market's pool");
    assert(
      market.status === "trading" || market.status === "listed" || market.status === "locked",
      `expected a not-yet-settled status, got ${market.status}`
    );
  });

  await test("getMarket returns null for a marketId that does not exist", async () => {
    const fakeMarketId = `0x${"0".repeat(64)}` as const;
    const market = await client.getMarket(fakeMarketId);
    assert(market === null, "a zero marketId should not resolve to a real market");
  });

  await test("subscribeToMarket delivers at least one update and unsubscribes cleanly", async () => {
    assert(liveMarkets.length > 0, "requires listMarkets to have found a market first");
    const target = liveMarkets[0];
    const update = await new Promise<import("../types.js").MarketUpdate>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("timed out waiting for a market update")), 20_000);
      const unsubscribe = client.subscribeToMarket(target.marketId, (m) => {
        clearTimeout(timeout);
        unsubscribe();
        resolve(m);
      });
    });
    assert(update.marketId === target.marketId, "update should be for the subscribed market");
  });

  const privateKey = process.env.PRIVATE_KEY;
  const hasFundedWallet = Boolean(privateKey && privateKey !== "0x...");

  if (!hasFundedWallet) {
    console.log(
      "\nskipping createPrediction test: set PRIVATE_KEY in packages/core/.env " +
        "to a funded Shannon testnet key (see packages/core/README.md) to run it."
    );
  } else {
    await test("createPrediction places a real prediction on Shannon testnet", async () => {
      assert(liveMarkets.length > 0, "requires listMarkets to have found a market first");
      const account = privateKeyToAccount(privateKey as `0x${string}`);
      const target = liveMarkets.find((m) => m.status === "trading") ?? liveMarkets[0];
      const stake = 1_000n;
      const result = await createPrediction({
        marketId: target.marketId,
        direction: "up",
        stake,
        signer: account,
      });
      assert(result.ok, `expected createPrediction to succeed, got: ${JSON.stringify(result)}`);
      if (result.ok) {
        assert(typeof result.txHash === "string" && result.txHash.startsWith("0x"), "txHash must be a hex string");
        assert(result.predictionId === target.marketId, "predictionId is the marketId in this SDK version");
      }
    });
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exitCode = 1;
  process.exit(process.exitCode ?? 0);
}

main();
