# Tikka — Architecture

## Repo layout

```
tikka/
├── frontend/          Next.js app — marketing site, docs pages, playground
├── sdk/                The publishable widget package (@tikka/widget)
├── packages/           Shared code used by both frontend and sdk
│   └── core/            DreamDEX Event Contract client (REST + WS + contract calls)
├── docs/                This folder — source-of-truth specs for the build
├── branding/            Logo assets
├── .gitignore
└── README.md
```

This is a pnpm workspace monorepo. `frontend` and `sdk` both depend on
`packages/core` as a workspace package — the contract-calling logic is
written once and used by both the embeddable widget and any server-side
code the frontend needs (e.g. a market-list API route).

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | Next.js 15, App Router | Real routing, server components for the docs/marketing pages, client components for anything wallet-connected |
| Language | TypeScript everywhere | sdk, packages/core, and frontend all share types for markets, positions, and settlement events |
| Styling | Tailwind CSS v4 + the design tokens in `02-DESIGN-SYSTEM.md` | No component library — the neo-brutalist look needs hard-coded borders/shadows, not a themed component kit |
| Wallet connect | wagmi + viem, with RainbowKit (or ConnectKit) for the connect modal | Real wallet connection, not a mocked "Connect Wallet" button. Must support MetaMask/injected at minimum |
| Package manager | pnpm, workspaces | Monorepo with `sdk` and `packages/core` as internal dependencies |
| SDK bundler | tsup | Produces both an IIFE bundle (for the `<script>` tag CDN use case) and an ESM/CJS build (for `import` in React apps) |
| Contract/RPC layer | viem, pointed at Somnia RPC | `https://dream-rpc.somnia.network` (Shannon testnet, chain 50312) for the hackathon build |
| Deployment | Vercel for `frontend`; the `sdk` IIFE bundle served from a CDN (Vercel static output or jsDelivr via the published npm package) | |

## Folder responsibilities

### `frontend/`
The Next.js app. Owns:
- `/` — landing page
- `/docs` — the developer documentation site (MDX or plain React pages),
  rendering the same content conceptually described in this `docs/` folder
  but written for external developers, with copyable code blocks
- `/playground` — three demo pages, each a mock "host app" with the Tikka
  widget embedded live (mock DEX token page, mock NFT collection page,
  mock live-stream page)
- Route map detail: see `05-FRONTEND-ROUTES.md`

The frontend imports `sdk` the same way an external developer would —
via the published package name, not a relative import — to prove the SDK
actually works standalone.

### `sdk/`
The actual product. Owns:
- The widget's rendering logic (Shadow DOM mount, so host-page CSS never
  leaks in or out)
- The public config surface: `data-*` attributes for script-tag embeds,
  a typed props object for the React wrapper
- State machine: `idle → wallet-required → live → settling → result`
- Emits DOM events (`tikka:settled`, `tikka:error`, etc.) so host pages
  can react without needing the React wrapper
- Full spec: `04-SDK-SPEC.md`

### `packages/core/`
Framework-agnostic. Owns:
- The DreamDEX Event Contract client: REST calls, WebSocket subscription
  for live settlement, and the on-chain `placeOrder`/Event Contract call
  wrapper
- Network config (mainnet vs. Shannon testnet), re-fetched from
  `GET /v0/markets` at runtime rather than hardcoded, matching DreamDEX's
  own guidance
- No UI code lives here. `sdk` and `frontend` both import from this
  package; neither duplicates contract-calling logic
- Full spec: `03-DREAMDEX-INTEGRATION.md`

### `docs/` (this folder)
Not shipped to users. This is the build spec — the context an AI coding
agent or a human contributor reads before writing code. Numbered so it
reads in order.

### `branding/`
Logo source (SVG) and exported PNGs at a few standard sizes. Used in the
frontend's header/favicon and in the README.

## Data flow (single prediction, end to end)

1. User loads a host page with the Tikka widget embedded.
2. Widget calls `packages/core` to fetch the current market state
   (price, active Event Contract window, time remaining) via REST, then
   opens a WebSocket subscription for live updates.
3. User connects wallet (wagmi). Widget shows Up/Down buttons once
   connected.
4. User picks a side and a stake. Widget calls `packages/core`'s
   `placeOrder`-style wrapper, which submits the transaction via viem.
5. Widget shows a live countdown for the Event Contract window.
6. On settlement (via WebSocket push, with REST poll as fallback),
   widget shows win/loss and emits `tikka:settled` with the result payload.

## What to confirm before coding

The exact REST endpoints, WebSocket message shapes, and Event Contract
function signature may differ from what's summarized in
`03-DREAMDEX-INTEGRATION.md` — that file is written from available docs
and the Bot Kit's general client patterns, not a guaranteed-current spec.
Before writing `packages/core`, read the actual DreamDEX Event Contracts
docs and the starter template repo, and update `03-DREAMDEX-INTEGRATION.md`
if anything has changed.
