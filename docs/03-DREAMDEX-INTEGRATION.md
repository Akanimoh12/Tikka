# Tikka — DreamDEX / Somnia Integration Notes

Verified 2026-09-10 against the official docs, the hackathon starter
template's source, and the published `@somnia-chain/markets-sdk` package
(0.30.0) — read directly, not summarized from memory. This supersedes the
first draft of this file, which assumed a plain REST/WebSocket API. That
assumption was wrong: **Event Contracts have no REST/WebSocket API of
their own.** The only supported integration paths are the
`@somnia-chain/markets-sdk` TypeScript package (built on viem) or raw
contract calls against the deployed ABI. `packages/core` uses the SDK.

Sources:
1. Official docs: https://docs.dreamdex.io/developers/event-contracts
2. Hackathon starter template (source read directly, not just its README):
   https://github.com/IronicDeGawd/ec-dreamdex-hackathon-template
3. `@somnia-chain/markets-sdk` package source (0.30.0), including its
   generated `.d.ts` files, which carry detailed doc comments.

If anything below conflicts with a newer SDK release or the starter
template, the sources win — re-verify and update this file.

## What an Event Contract actually is

A binary (Up/Down) prediction market is **not** a single "place a bet,
wait, get paid" call. It's an ERC-6909 outcome-token market built on top
of DreamDEX's order-book infrastructure:

1. **Mint** — 1 unit of collateral → 1 "Up" (YES) token + 1 "Down" (NO)
   token (`mintSet`). `burnSet` reverses this.
2. **Trade** — Up/Down tokens trade against each other on a binary order
   book (a limit order book, not a simple AMM). Price is a YES
   probability in 1e6 units (`900000n` = 0.90 = "90% chance").
3. **Settle** — after the market's expiry, an oracle resolves it to Up or
   Down (or voids it).
4. **Redeem** — winning tokens redeem 1:1 for collateral; losing tokens
   are worth zero. A void refunds both sides at 0.5.

For Tikka's "predict Up or Down with one stake" UX, the natural mapping is:
**mint a set, then immediately sell the side you don't want (or just buy
more of the side you want) via an IOC (taker) order** — this is exactly
what the starter template's `lifecycle.mjs` does. There is no dedicated
"bet" function; the widget composes the mint + trade primitives DreamDEX
actually exposes.

## Networks

| | Mainnet | Shannon testnet (use this for the hackathon) |
|---|---|---|
| Chain ID | 5031 | 50312 |
| Chain export | `somniaMainnet` from `@somnia-chain/markets-sdk/chains` | `somniaShannon` from `@somnia-chain/markets-sdk/chains` |
| RPC (HTTP) | `https://api.infra.mainnet.somnia.network` | `https://api.infra.testnet.somnia.network` (also `https://dream-rpc.somnia.network`) |
| RPC (WebSocket) | `wss://api.infra.mainnet.somnia.network/ws` | `wss://api.infra.testnet.somnia.network/ws` (also `wss://dream-rpc.somnia.network/ws`) |
| Indexer (GraphQL) | `https://prd.smk.somnia.host/v1/graphql` | `https://dev.smk.somnia.host/v1/graphql` |
| Native token | SOMI | STT |
| Collateral | USDso, 18 decimals, `0x00000022dA000002656c64D9eA6011ea952D008A` | tUSDC, 6 decimals, `0x70a86D8842FB63C4Ad2b7cdddF530eBf1BB25d8E` |
| Faucet | — | Telegram SomniaHacks dev group, faucet topic: `https://t.me/+XHq0F0JXMyhmMzM0` (the old `https://testnet.somnia.network` faucet is not what the current hackathon template points at — use the Telegram faucet) |

Use `somniaShannon` from `@somnia-chain/markets-sdk/chains`, not viem's own
`somniaTestnet` — the SDK's own chain definition carries a default
WebSocket RPC URL; viem's does not, and the SDK's live tail requires one.

## Contract addresses (CREATE3 — identical on both chains)

Never hand-write these into `packages/core` as string literals passed
around loosely — pull them from `SOMNIA_TESTNET_ADDRESSES` /
`SOMNIA_MAINNET_ADDRESSES`, exported by the SDK, and pass that object into
`SomniaMarkets`'s `addresses` config. Do not hardcode a per-market pool
address anywhere — pools are recycled across successive markets, so a
market's identity is its `marketId` (bytes32), never its pool address.

| Contract | Address (both chains) |
|---|---|
| BinaryMarketsModule | `0x3ecC694Cef705358864a646142ac17A90E29e388` |
| MarketsCore | `0x2802504314685D89bF6C992CA5a8e7cC78bc0294` |
| BinarySettlement | `0xbF4a49e0Dfd092e5FBE8E5761064C49533e6Ed23` |
| OutcomeToken6909 | `0xB52c5934113Af5c0Bb20eb3C72290C8215f755b9` |
| OracleHub | `0xe40db387cC98601Dd11bd634fF2f3AD5686dE32b` |
| CollateralRouter | `0xbC0C9834B15ACE38bB50dDaa7d7f7C7CC4DC183C` |

In practice `packages/core` never touches these directly — it constructs
one `SomniaMarkets` instance with `addresses: SOMNIA_TESTNET_ADDRESSES`
and lets the SDK resolve everything else.

## The `@somnia-chain/markets-sdk` package

```
pnpm add @somnia-chain/markets-sdk viem
```

`viem` is a peer dependency (`^2.21.0`+ — matches what `packages/core`
already uses). Requires SDK `>= 0.28.1` (older versions can't be imported
under plain `node`/bundlers, only under `tsx`).

Two tiers, both reached through one `new SomniaMarkets(config)` instance —
never constructed separately:

- **Unified tier** (`exchange.createOrder`, `.fetchMarkets`,
  `.watchOrderBook`, …) — symbol-string based (`"BTC-95000-31DEC26/USDC#YES"`),
  covers spot + perp + binary uniformly. Convenient for a ccxt-style bot,
  but heavier surface than Tikka needs and blurs binary-specific
  semantics (mint/redeem) behind a generic order API.
- **Engine tier** (`exchange.client` for reads, `exchange.trader` for
  writes) — bigint-exact, address/marketId-keyed, binary-specific methods
  (`mintSet`, `placeOrder`, `redeem`, `getMarketOnchain`, …). This is what
  the starter template uses end to end, and what `packages/core` wraps.

```ts
import { SomniaMarkets, SOMNIA_TESTNET_ADDRESSES } from "@somnia-chain/markets-sdk";
import { somniaShannon } from "@somnia-chain/markets-sdk/chains";

const exchange = new SomniaMarkets({
  chain: somniaShannon,
  addresses: SOMNIA_TESTNET_ADDRESSES,
  indexerUrl: "https://dev.smk.somnia.host/v1/graphql",
  wsRpcUrl: "wss://api.infra.testnet.somnia.network/ws", // required if chain lacks a default websocket RPC
  walletClient, // or `account` or `privateKey` — only needed for writes
});
```

`indexerUrl` is required at construction even for on-chain-only usage (the
SDK never calls it unless something you invoke needs the indexer).
`loadMarkets()` throws without `wsRpcUrl` set (directly, or via the
chain's own default).

### Read surface `packages/core` uses

- `exchange.client.listLiveBinaryMarkets(filter?)` — currently-live binary
  markets (`expiry > now`), soonest-to-expire first. Filter by
  `operatorId` / `venueId` / `asset` / `intervalSec` / `status`. This is
  the indexer path — see the fallback note below.
- `exchange.client.getBinaryMarket(marketId)` — one market by bytes32
  `marketId` (indexer read; richer fields — question text, asset,
  interval label, resolution/void state — but can be null if the indexer
  hasn't seen it yet).
- `exchange.client.getMarketOnchain(marketId)` — the same market's
  authoritative on-chain state (status, expiry, `finalized`,
  `winningOutcome`, `isResolved`, `isVoided`, the pool's outcome-token ids)
  straight from the chain. Works even if the indexer is behind or down.
  Use this, not the indexer read, to decide write eligibility or to check
  settlement.
- `exchange.client.watchMarket(pool)` — subscribes to one market's
  lifecycle/order-book events over the SDK's own WebSocket, ref-counted
  (watching the same pool twice shares one subscription). The SDK handles
  reconnect and backfill internally; once watched, `getLiveMarketByPool`
  and `subscribeLive(listener)` give zero-round-trip live reads. This
  **is** Tikka's live-update mechanism — there is no separate WebSocket
  client to hand-roll.
- `exchange.client.getOutcomeBalance({ outcomeToken, account, id })` — a
  wallet's Up or Down token balance (ERC-6909 `balanceOf`).
- `exchange.client.getPortfolio(account, opts?)` — a wallet's open
  positions, open orders, and recent trades in one indexer read. Backs
  `getWalletPositions`.

**Indexer-backed reads (`listBinaryMarkets`/`listLiveBinaryMarkets`,
`getPortfolio`) throw `IndexerError` if the indexer is down** — this is
DreamDEX's own documented failure mode, not a bug to work around
silently. `packages/core` must catch `IndexerError` on market discovery
and fall back to scanning `MarketCreated` logs directly from chain (see
`discover.mjs` in the starter template) — the indexer is never a single
point of failure for "can a user see a market to predict on."

### Write surface `packages/core` uses

All writes return `{ hash, receipt }` at minimum (`TxResult`) — the SDK
waits for the mined receipt before resolving, so a caller never has to
poll for confirmation separately.

- `exchange.trader.mintSet({ pool, amount, autoApprove? })` — 1 collateral
  → 1 Up + 1 Down. `autoApprove` (default `true`) handles the ERC-20
  approval automatically if allowance is short.
- `exchange.trader.placeOrder({ pool, side, price, quantity, orderType })`
  — places a binary order. `side`: `"BUY_YES" | "SELL_YES" | "BUY_NO" |
  "SELL_NO"` ("YES" = Up, "NO" = Down). `orderType`: `2` = IOC (taker,
  crosses immediately — this is what a "place my prediction now" action
  uses), `3` = PostOnly (maker, must rest — **reverts** with
  `PostOnlyWouldCross()` if it would cross, rather than silently resting
  at a worse price; not used for the widget's "predict now" flow).
  `price` is a probability in 1e6 units — use the SDK's
  `probabilityToPrice(0.99)` helper rather than hand-multiplying.
- `exchange.trader.redeem({ marketId, amount, outcomeIdx?, market? })` —
  claims a settled position. `outcomeIdx` (0 = Up, 1 = Down) can be
  omitted if `market` (the on-chain address) is passed and the market is
  resolved — the SDK looks up the winning leg itself. A voided market has
  no single winner, so `outcomeIdx` must be passed explicitly per leg.

### Discovery without the indexer

`MarketCreated` events carry no `venueId`, so discovery scopes by
collateral (`SOMNIA_TESTNET_ADDRESSES.testUsdc` on testnet) rather than by
venue — on testnet today every live market shares that collateral and is
on the DreamDEX venue, so this is sufficient. Somnia's `eth_getLogs` caps
at 1000 blocks per call, so a chain-log scan walks backward in 1000-block
windows (see `discover.mjs`).

## Auth / signing

`packages/core` is wallet-library-agnostic: it accepts a viem `Account`
(from `privateKeyToAccount`, for tests/CI) or a viem `WalletClient` (from
a browser wallet via wagmi, for the real widget) and passes it straight
through to the SDK's `SomniaMarketsConfig` (`account` or `walletClient`).
It does not manage wallet connection itself — that's `sdk`'s (and later
the frontend's) job via wagmi. No SIWE / signed-message auth step is
required by DreamDEX itself for trading — the wallet signature on each
transaction **is** the auth. (A SIWE-style session step, if added later,
would be a Tikka-level session convenience, not a DreamDEX requirement —
not needed for the hackathon build.)

## Error and edge cases — how the SDK surfaces each one

The SDK's own typed error hierarchy (`SomniaMarketsError` and subclasses,
all exported from the package root) covers most of what `packages/core`
needs to translate into Tikka's typed results:

- **`InvalidInputError`** — the call itself was malformed (bad argument,
  wrong market kind). Never retry; the input is wrong.
- **`NotConfiguredError`** — a required address/URL was never supplied to
  the client (e.g. `addresses.binaryModule` unset). A config bug, not a
  runtime condition — should not normally reach a widget user.
- **`SignerRequiredError`** — an authenticated method was called on a
  client built without a signer. Maps directly to "wallet not connected."
- **`IndexerError`** — an indexer (GraphQL) read didn't complete
  (endpoint down, timeout, schema drift). An empty/`null` result from the
  indexer is a successful read that found nothing — this error is only
  for the read not completing at all. Maps to "fall back to on-chain
  discovery/polling," never to "market not found."
- **`RpcError`** — a JSON-RPC/WebSocket request to the chain node itself
  didn't complete (maps to "dropped socket" / general RPC flake — retry
  with backoff, or fall back to REST-style one-shot chain reads).
- **`ContractRevertError`** — the chain rejected a well-formed call.
  Carries a decoded `errorName` (e.g. `InsufficientBalance`,
  `PostOnlyWouldCross`, `OrderExpiryBeyondMarket`) and `args` — this is
  the branch point for "insufficient balance," "transaction rejected by
  contract logic," and "window expired" (an order whose
  `expireTimestampNs` exceeds the pool's `marketExpiryNs()` reverts before
  ever reaching the mempool as a distinct revert reason).

Two cases the SDK does not wrap in its own error type, so `packages/core`
must detect them explicitly:

- **Wrong network** — check the connected `WalletClient`'s/`Account`'s
  chain against `somniaShannon.id` (50312) before constructing the
  `SomniaMarkets` instance or before a write; do not let a mismatched
  chain reach the SDK and surface as an opaque RPC failure.
  wagmi's `switchChain` is how the frontend/sdk prompts the user to fix
  this — `packages/core` only detects and reports the mismatch as a typed
  result.
- **User rejects the wallet's signature prompt** — this surfaces as a
  plain error from the `WalletClient` itself (viem's
  `UserRejectedRequestError` for injected wallets), not an SDK subclass.
  `packages/core` catches this alongside the SDK's own errors and maps it
  to the same "transaction rejected, return to pre-submit state" typed
  result.

Market-window expiry while the user is mid-decision is a **read-side**
concern, not primarily a write-side error: `getMarketOnchain(marketId)`'s
`status`/`expiry` fields are how the widget/frontend decides a window is
stale and should be swapped for the next one *before* attempting a write
at all, rather than relying on a late revert to catch it.

## What `packages/core` exposes

The illustrative shape from the previous draft of this doc is confirmed
workable and is what got built — see the package's own exported types for
the authoritative, current signatures (this doc is not re-duplicated
there per the no-comments-in-code rule, so treat the exported `.d.ts` as
the source of truth going forward, this file as the "why"):

- `listMarkets()` / `getMarket(marketId)` — wrap
  `listLiveBinaryMarkets`/`getBinaryMarket` with the on-chain
  fallback described above.
- `subscribeToMarket(marketId, onUpdate)` — wraps `watchMarket` +
  `subscribeLive`, itself falling back to REST-style polling
  (`getMarketOnchain` on an interval) if the SDK's live tail's
  `getLiveStatus().socketState` reports the socket down for longer than a
  short grace window.
- `createPrediction(params)` — composes `mintSet` then `placeOrder`
  (IOC, crossing) for the chosen side, returning as soon as the order's
  transaction is confirmed (not waiting on settlement).
- `subscribeToSettlement(marketId, onSettled)` — polls/watches
  `getMarketOnchain(marketId)` until `isResolved || isVoided`, backed by
  the same live-tail-plus-poll-fallback mechanism.
- `getWalletPositions(address)` — wraps `getPortfolio`.

## Stretch / explicitly out of scope for the hackathon build

- Session-key delegation (a hot key that can't withdraw funds, for a
  no-signature-per-action UX) — not in the Bot Kit's pattern that ships
  today in this SDK either; note as a stretch idea only, matching the
  original plan.
- The unified `createOrder`/symbol-string tier — available if a future
  version of Tikka wants spot or perp markets too, but out of scope while
  Tikka is binary-only.
- SomniaLend, bridge, perps, spot — all present in the SDK, all unused by
  Tikka.

## Reference implementations read while writing this

- The hackathon starter template's `typescript/src/*.mjs` — the most
  direct, currently-working example of the full lifecycle
  (`client.mjs`, `discover.mjs`, `lifecycle.mjs`, `redeem.mjs`) and its
  `SKILL.md` (gotchas: PostOnly-crossing reverts, indexer-down fallback,
  Somnia gas behavior, the SDK's own websocket keeping Node alive).
- `@somnia-chain/markets-sdk`'s generated `.d.ts` files (0.30.0) — read
  directly for exact method signatures, param shapes, and documented
  gotchas (each exported type carries detailed doc comments in the
  package itself).
