# @tikka/core

The DreamDEX Event Contract client. Wraps `@somnia-chain/markets-sdk` with
a small, stable, typed surface — `listMarkets`, `getMarket`,
`subscribeToMarket`, `createPrediction`, `subscribeToSettlement`,
`getWalletPositions` — so `sdk` and `frontend` never touch raw REST,
WebSocket, or contract-ABI details directly. See
`/docs/03-DREAMDEX-INTEGRATION.md` for the full integration notes.

## Build

```bash
pnpm --filter @tikka/core build
```

## Integration tests

These run against the real Shannon testnet — nothing is mocked.

```bash
pnpm --filter @tikka/core test:integration
```

`listMarkets`, `getMarket`, and `subscribeToMarket` run unconditionally
and need no setup beyond network access.

`createPrediction` places a real (tiny, 0.001 tUSDC) transaction on
Shannon testnet and only runs if a funded test wallet is configured. To
enable it:

1. Copy `.env.example` to `.env` in this directory.
2. Set `PRIVATE_KEY` to a Shannon testnet private key funded with a small
   amount of tUSDC (collateral) and STT (gas).
3. Get testnet tokens from the SomniaHacks Telegram dev group's faucet
   topic: https://t.me/+XHq0F0JXMyhmMzM0

Without `PRIVATE_KEY` set, that one test is skipped and the rest still
run — a fresh clone can verify the read path with zero setup.
