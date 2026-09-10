# Tikka — Overview

## What this is

Tikka is a drop-in prediction widget for DreamDEX Event Contracts. Any site —
a DEX, an NFT marketplace, a game, a streaming page — embeds one script tag
or one React component and gets a live Up/Down prediction card wired to a
real wallet, settling on-chain through DreamDEX.

Tikka is not another trading dashboard. It is a distribution layer: a way
for any builder on Somnia to add Event Contracts to their product without
building order execution, settlement polling, or wallet plumbing themselves.

## The one-line pitch

```html
<script src="https://cdn.tikka.dev/widget.js" data-market="SOMI-USD" data-window="1h"></script>
```

Drop it anywhere. Get a live prediction market.

## Why this shape of product

This is being built for the Somnia × DreamDEX Event Contracts Hackathon.
The judging rubric rewards exactly this shape of project:

| Criterion | Weight | How Tikka answers it |
|---|---|---|
| Innovation & Originality | 20% | Infrastructure/distribution play, not another standalone trading UI |
| Technical Implementation | 25% | Real SDK design: wallet auth, settlement listeners, shadow-DOM isolation, published package |
| User Experience & Design | 20% | The widget is the entire UI surface — every state (idle, live, settling, result) is deliberately designed |
| Business & Ecosystem Impact | 20% | Every site that embeds Tikka becomes a new Event Contracts distribution channel |
| Presentation & Demo | 15% | Demo shows the same widget live on 3 different host surfaces, proving "drop in anywhere" |

## What "done" looks like

1. A published SDK (`@tikka/widget`) that mounts a real, working Event
   Contract prediction card via script tag or React import.
2. A real wallet connection flow (not mocked) that creates and settles
   Event Contracts on DreamDEX's Shannon testnet.
3. A Next.js marketing + docs site (tikka.dev) with a real landing page,
   a docs section with copyable, working code, and a playground that shows
   the widget embedded in three different mock host apps.
4. A demo video showing all of the above live.

## Product identity

- **Name:** Tikka
- **One-line description:** The prediction layer that drops into any app.
- **Tone:** Confident, plain-spoken, builder-facing. No hype language, no
  unexplained jargon. Copy speaks to a developer deciding whether to embed
  this in the next 10 minutes.
- **Visual identity:** see `02-DESIGN-SYSTEM.md`. Logo assets are in
  `/branding`.

## Source material this project is built from

- DreamDEX Bot Kit (reference client patterns, not this repo's product):
  https://github.com/somnia-chain/dreamdex-bot-kit
- DreamDEX Bot Builder: https://dreambot-builder.vercel.app/
- DreamDEX Event Contracts docs: https://docs.dreamdex.io/developers/event-contracts
- Hackathon starter template: https://github.com/IronicDeGawd/ec-dreamdex-hackathon-template

Treat the starter template as the reference for actual contract addresses,
network config, and Event Contract call signatures — that repo is more
likely to be current than anything memorized. Confirm against it before
writing the SDK's contract-calling code.

## Non-goals (for the hackathon build)

- No custom smart contracts. Tikka calls DreamDEX's existing Event
  Contract functions; it does not deploy its own on-chain logic.
- No mobile app. Web only.
- No support for chains other than Somnia (mainnet 5031 / Shannon testnet
  50312).
- No production-grade key custody. Testnet wallet connect only, standard
  injected/WalletConnect flows — no session-key automation in the
  hackathon build (session keys are documented as a stretch idea only).
