# Tikka

The prediction layer that drops into any app.

Tikka is a drop-in widget for DreamDEX Event Contracts. Any site — a DEX,
an NFT marketplace, a game, a streaming page — embeds one script tag or
one React component and gets a live Up/Down prediction card, wired to a
real wallet and settling on-chain through DreamDEX on Somnia.

```html
<script src="https://cdn.tikka.dev/widget.js" data-market="SOMI-USD" data-window="1h"></script>
```

Drop it anywhere. Get a live prediction market.

Tikka isn't another trading dashboard — it's a distribution layer. It
lets any builder on Somnia add Event Contracts to their product without
building order execution, settlement polling, or wallet plumbing
themselves. Built for the Somnia × DreamDEX Event Contracts Hackathon.

## Repo structure

```
tikka/
├── frontend/          Next.js app — marketing site, docs, playground
├── sdk/                The publishable widget package (@tikka/widget)
├── packages/core/      DreamDEX Event Contract client (REST + WS + contract calls)
├── docs/                Build specification for this repo
├── branding/            Logo assets
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

This is a pnpm workspace monorepo. `frontend` and `sdk` both depend on
`packages/core` for DreamDEX contract-calling logic, so it's written once
and shared by the embeddable widget and any server-side code the
frontend needs.

## Setup

Requires Node 20+ and pnpm.

```bash
pnpm install
```

### Run the frontend

```bash
pnpm --filter frontend dev
```

Starts the marketing site, docs, and playground at `localhost:3000`.

### Build a package

```bash
pnpm --filter @tikka/core build
pnpm --filter @tikka/widget build
```

Both use `tsup`. `@tikka/widget` produces an IIFE bundle for the
`<script>` tag embed (`dist/widget.js`) alongside an ESM/CJS build for
`import` in React apps (`dist/index.mjs` / `dist/index.cjs`).

### Build everything

```bash
pnpm build
```

## Docs

The `/docs` folder documents this repo's own build spec — architecture,
design tokens, the DreamDEX integration, and the SDK's public API — in
numeric order starting at `docs/00-OVERVIEW.md`.

## Developer resources

- DreamDEX Event Contracts docs: https://docs.dreamdex.io/developers/event-contracts
- DreamDEX Bot Kit: https://github.com/somnia-chain/dreamdex-bot-kit
- DreamDEX Bot Builder: https://dreambot-builder.vercel.app/

## License

MIT.
