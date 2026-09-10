# Tikka — Frontend Routes

Next.js App Router. Every route below must actually work — no placeholder
pages, no "coming soon." If a page can't be made real in time, cut it from
this list rather than ship it broken.

## `/` — Landing page

Hero: the widget itself, live, embedded directly in the hero section,
already predicting on a real testnet market. Not a screenshot, not a
video loop — the actual `@tikka/widget` component, wallet-connectable on
the spot. This is the "most characteristic thing in the subject's world"
per the design brief's hero guidance: the product demonstrating itself
before any copy explains it.

Below the hero:
- The one-line embed snippet (`<script src="...">`), shown in a copyable
  code block, so a developer can act in the first screen.
- A short "how it works" section: three steps (embed → user predicts →
  settles on-chain), not a generic feature grid.
- Social proof / ecosystem framing: "built for Somnia × DreamDEX Event
  Contracts," with real links to DreamDEX docs.
- Footer with links to `/docs`, `/playground`, GitHub repo.

## `/docs` — Documentation

- `/docs` — index: what Tikka is, install instructions
  (`npm install @tikka/widget`), quickstart for both script-tag and React
  usage.
- `/docs/script-tag` — full script-tag reference, mirrors
  `04-SDK-SPEC.md`'s script tag section, with copyable examples.
- `/docs/react` — full React component reference, props table, event
  callbacks, a live editable example if time allows (static copyable
  example otherwise).
- `/docs/events` — the `tikka:*` custom events reference table.
- `/docs/api` — `packages/core` surface, for developers who want to build
  their own UI on top of the raw client instead of using the widget.

Every code block on every docs page must be copy-button-enabled and must
be real, working code — copy it, paste it into a fresh Next.js or HTML
file, and it should run against Shannon testnet.

## `/playground` — Live demo host surfaces

Index page linking to three sub-routes. Each sub-route is a small,
convincing mock of a real product category, with the Tikka widget
embedded exactly as an external developer would embed it:

- `/playground/dex` — a mock token detail page (price chart placeholder,
  token stats) with the widget embedded next to the chart, predicting on
  that token's price.
- `/playground/nft` — a mock NFT collection page (grid of placeholder NFT
  cards, floor price stat) with the widget predicting on floor price
  direction.
- `/playground/stream` — a mock live-stream page (video placeholder,
  chat sidebar) with the widget predicting on a live in-stream event.

These are the pages the demo video walks through to prove "drop in
anywhere." They should look like plausible real products, not obviously
fake shells — enough visual effort that a judge believes the "any dApp"
claim.

## `/playground/dashboard` (optional, time-permitting)

A small "embedder analytics" view: predictions made, volume driven,
unique wallets, for a given `market`/`window` pair, pulled from
`packages/core`'s `getWalletPositions`/market data. This is the detail
that shows the team thought about Tikka as a real product with real
adoption metrics, not just a hackathon demo. Cut first if time is short —
it's explicitly a stretch page, not part of the core deliverable.

## Shared layout

- Fixed header (`.of-header` from the design system) present on every
  route: logo, nav links (`Docs`, `Playground`, `GitHub`), and a live
  "Connect Wallet" button in the header itself (not just inside the
  widget) so the whole site can reflect connection state consistently.
- 404 page follows the same "empty state is an invitation to act"
  guidance from the design system doc — not a generic Next.js 404.
