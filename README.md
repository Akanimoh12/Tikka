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

**Live demo:** _(add the Vercel URL here after deploying)_

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
├── vercel.json
└── README.md
```

This is a pnpm workspace monorepo. `frontend` and `sdk` both depend on
`packages/core` for DreamDEX contract-calling logic, so it's written once
and shared by the embeddable widget and any server-side code the
frontend needs.

## Local setup

Requires Node 20+ and pnpm.

```bash
pnpm install
```

`frontend` imports `@tikka/core` and `@tikka/widget` as workspace
packages, and it resolves their **built** `dist/` output, not their
TypeScript source. Build the dependency packages before running the
frontend — either build everything at once:

```bash
pnpm build
```

or build them in dependency order by hand:

```bash
pnpm --filter @tikka/core build
pnpm --filter @tikka/widget build
pnpm --filter frontend build
```

`pnpm -r build` (what `pnpm build` runs at the root) walks pnpm's
workspace dependency graph, so it already builds `packages/core` and
`sdk` before `frontend` — you don't need to think about order when using
the root script. Skipping this step and going straight to
`pnpm --filter frontend dev` fails: Next.js reports
`Module not found: Can't resolve '@tikka/core'` (and the same for
`@tikka/widget/react`), confirmed by running it against a clean, unbuilt
`packages/core`/`sdk`.

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
`<script>` tag embed (`dist/widget.js`, ~880 KB — it bundles wagmi/viem,
so that size is expected) alongside an ESM/CJS build for `import` in
React apps (`dist/index.mjs` / `dist/index.cjs`).

`frontend`'s own `build` script (`pnpm --filter frontend build`) also
copies the freshly built `sdk/dist/widget.js` into `frontend/public/widget.js`
first, so a full build of `frontend` always serves the current widget
bundle as a static file — see "Serving `widget.js`" below.

### Build everything

```bash
pnpm build
```

## Serving `widget.js` (the CDN story)

`04-SDK-SPEC.md` specifies the script-tag embed as
`https://cdn.tikka.dev/widget.js` — a stable, dedicated CDN URL.
`01-ARCHITECTURE.md` allows two ways to get there: Vercel static output,
or jsDelivr against the published npm package. Neither `cdn.tikka.dev`
nor a published `@tikka/widget` package exists yet, so here's exactly
what's real today and what's a documented next step.

### Today: served from the same Vercel deployment as `frontend` (implemented)

`frontend/package.json`'s `build` script runs a `copy-widget` step before
`next build`:

```json
"copy-widget": "node -e \"...copies ../sdk/dist/widget.js to public/widget.js...\"",
"build": "pnpm run copy-widget && next build"
```

Next.js serves anything in `frontend/public/` as a static file at the
site root, so once `frontend` is deployed, the bundle is reachable at:

```
https://<your-vercel-deployment>.vercel.app/widget.js
```

You can test this locally right now:

```bash
pnpm build          # builds packages/core, sdk, and copies widget.js into frontend/public
pnpm --filter frontend dev
```

then open `http://localhost:3000/widget.js` — it serves the real,
current IIFE bundle (verified: 200 OK, ~900 KB).

**Embed snippet — local dev, testable today:**

```html
<script src="http://localhost:3000/widget.js"></script>
<div data-tikka data-market="SOMI-USD" data-window="1h" data-theme="auto" data-size="compact"></div>
```

**Embed snippet — after deploying to Vercel (fill in your URL):**

```html
<script src="https://<your-vercel-deployment>.vercel.app/widget.js"></script>
<div data-tikka data-market="SOMI-USD" data-window="1h" data-theme="auto" data-size="compact"></div>
```

Once a custom domain (`cdn.tikka.dev` or similar, pointed at this same
Vercel project) is attached, the same file becomes reachable at the
`04-SDK-SPEC.md` URL with no further code changes.

### Deploying `frontend` to Vercel

You'll run the actual `vercel` deploy / project creation yourself. What's
prepared for you:

- A root-level [`vercel.json`](./vercel.json) that tells Vercel:
  - `framework: "nextjs"` (Vercel can't auto-detect this from the repo
    root, since the root `package.json` isn't the Next.js app — the app
    lives in `frontend/`)
  - `buildCommand: "pnpm install && pnpm -r build"` — this builds
    `packages/core` and `sdk` first (via pnpm's workspace graph) and then
    `frontend`, whose own `build` script copies `widget.js` into
    `frontend/public/` before running `next build`
  - `outputDirectory: "frontend/.next"`

**Vercel project settings to set once, in the dashboard:**
- **Root Directory:** leave at the repo root (do not set it to `frontend`)
  — `vercel.json` above already points at `frontend/.next` for output and
  runs the build from the root so the workspace packages build first.
- **Framework Preset:** Next.js (should be picked up from `vercel.json`;
  confirm it if the dashboard shows "Other").
- **Install Command / Build Command / Output Directory:** all handled by
  `vercel.json` — no manual overrides needed unless Vercel's UI doesn't
  pick up the file for some reason, in which case paste the three values
  above directly into Project Settings → Build & Development Settings.

This has been verified locally by running the equivalent of what Vercel
will run (`pnpm install && pnpm -r build` from the repo root, then
serving `frontend`'s output) — it produces a working `frontend/.next`
build and a working `frontend/public/widget.js`. The actual `vercel`
CLI/dashboard deploy has not been run from this environment.

### Future, once there's time before submission: jsDelivr via npm (not done)

Once `@tikka/widget` is published to npm (a real `npm publish`, a
one-way action — not done here, and something you should decide and run
yourself), jsDelivr automatically mirrors it for free with no
configuration:

```
https://cdn.jsdelivr.net/npm/@tikka/widget/dist/widget.js
```

That URL does not exist yet because the package has not been published.

## Environment variables

**None required.** All Somnia/DreamDEX network configuration — RPC URLs,
the indexer URL, chain IDs, and contract addresses for both mainnet and
the Shannon testnet — is compiled directly into `packages/core`
(`packages/core/src/config.ts`, `TESTNET_CONFIG` / `MAINNET_CONFIG`) and
shipped as part of the built package. There is no `process.env.NEXT_PUBLIC_*`
(or any other `process.env`) usage anywhere in `frontend/app`,
`frontend/components`, or `frontend/lib` — confirmed by grep. Nothing
needs to be set in Vercel's Environment Variables panel for this build.

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
