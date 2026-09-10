# Tikka — DreamDEX / Somnia Integration Notes

This is a working summary to orient the build. It is assembled from public
DreamDEX Bot Kit material and general knowledge of the hackathon brief —
not a guaranteed-current API reference. Before writing `packages/core`,
verify every endpoint, contract address, and function signature against:

1. The official docs: https://docs.dreamdex.io/developers/event-contracts
2. The hackathon starter template (more likely to be current than
   anything else, since it targets this exact hackathon):
   https://github.com/IronicDeGawd/ec-dreamdex-hackathon-template
3. The Bot Kit repo, for general client patterns (auth, nonce handling,
   the "gotchas" doc): https://github.com/somnia-chain/dreamdex-bot-kit

If any of the specifics below conflict with those sources, the sources win
— update this file to match and keep it in sync as you build.

## Networks

| | Mainnet | Shannon testnet (use this for the hackathon) |
|---|---|---|
| Chain ID | 5031 | 50312 |
| RPC | `https://api.infra.mainnet.somnia.network` | `https://dream-rpc.somnia.network` |
| REST API | `https://api.dreamdex.io/v0` | `https://stg.api.dreamdex.io/v0` |
| WebSocket | `wss://api.dreamdex.io/v0/ws/public` | `wss://stg.api.dreamdex.io/v0/ws/public` |
| Testnet faucet | — | `https://testnet.somnia.network` |

Never hardcode contract addresses. Re-fetch them at runtime from
`GET /v0/markets`, per DreamDEX's own guidance — addresses can change
between deployments.

## Important: contract call shape has changed before

DreamDEX upgraded its spot contracts in June 2026. Older example code
(including some of what ships in the Bot Kit's `examples/` folder) calls
`placeTakerOrderWithoutVault`, which is removed. The current entry point
is a single `placeOrder` function:

```solidity
function placeOrder(
    bool isBid,
    uint64 userData,
    uint256 price,
    uint256 quantity,
    uint64 expireTimestampNs,
    uint8 orderType,
    uint8 selfMatchingOption,
    address builder,
    uint96 builderFeeBpsTimes1k
) external payable returns (bool success, uint128 orderId);
```

It is `payable` and auto-pulls funds from the caller's wallet — no
separate deposit step for the common case.

This is the general DreamDEX CLOB order entry point. Event Contracts are
DreamDEX's Up/Down prediction product built on top of this trading
infrastructure — confirm whether Event Contracts have their own dedicated
entry point/ABI distinct from the general `placeOrder` function before
assuming they share it. The Event Contracts docs page is the source of
truth here; the starter template's contract-calling code is the fastest
way to see the actual current shape in practice.

## What `packages/core` needs to expose

Regardless of the exact underlying call shape, the widget and frontend
need a stable, typed surface. Design `packages/core` around this contract
so the rest of the app never touches raw REST/WS/ABI details:

```ts
// Illustrative shape — finalize field names against the real API.

listMarkets(): Promise<Market[]>
getMarket(marketId: string): Promise<Market>

subscribeToMarket(marketId: string, onUpdate: (m: MarketUpdate) => void): Unsubscribe

createPrediction(params: {
  marketId: string
  direction: "up" | "down"
  stake: bigint
  windowSeconds: number
}): Promise<{ txHash: string; predictionId: string }>

subscribeToSettlement(predictionId: string, onSettled: (result: SettlementResult) => void): Unsubscribe

getWalletPositions(address: string): Promise<Position[]>
```

- `listMarkets` / `getMarket` / `subscribeToMarket`: REST for the initial
  snapshot, WebSocket for live price/time-remaining updates.
- `createPrediction`: builds and sends the transaction via viem, using the
  connected wallet's signer. Returns as soon as the transaction is
  submitted; does not block on settlement.
- `subscribeToSettlement`: WebSocket subscription for the settlement
  event, with a REST poll fallback (e.g. poll `GET` on the prediction
  every few seconds) in case the socket drops.
- `getWalletPositions`: used by the frontend's playground and any
  "my predictions" history view.

## Auth

Match the Bot Kit's pattern: wallet-based auth (sign a message or a
typed-data payload to authenticate the session), not username/password.
For the hackathon build, a standard wagmi-connected wallet signing a
`SIWE`-style message on first connect is sufficient — do not implement
the Bot Kit's session-key delegation (hot key that can't withdraw funds)
unless there's time left after the core flow works; note it as a stretch
item, not a dependency.

## Error and edge cases to design for explicitly

- Wallet not connected → widget shows a connect prompt, not a broken form.
- Wrong network (not Shannon testnet) → widget shows a "switch network"
  action using wagmi's `switchChain`, not a silent failure.
- Insufficient testnet balance → clear message plus a link to
  `https://testnet.somnia.network`.
- WebSocket disconnects mid-window → fall back to REST polling
  automatically; don't leave the countdown frozen.
- Transaction rejected in wallet → widget returns to the pre-submit state
  cleanly, no stuck loading spinner.
- Market window expires while the user is mid-decision → widget disables
  the stale window and shows the next available window rather than
  submitting into an expired one.

## Reference implementations to read before coding

- `packages/core` in the Bot Kit repo — shared client: auth, REST,
  WebSocket, order execution, nonce management, "gotcha guards." Mirror
  its defensive patterns even though Tikka's `packages/core` is a new,
  smaller, browser-first client (the Bot Kit's is Node/Python-oriented for
  always-on bots, not a browser SDK).
- `docs/gotchas.md` and `docs/architecture.md` in the Bot Kit repo — the
  funding model and known sharp edges.
- The hackathon starter template — this is the most direct reference for
  what a minimal working Event Contract integration looks like end to end.
