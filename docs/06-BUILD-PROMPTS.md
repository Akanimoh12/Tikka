# Tikka — Build Prompts

Five prompts, run in order, each handed to a coding agent as-is. Each one
assumes the agent can read every file in `/docs` and `/branding` in this
repo before starting — point it at this folder first.

Ground rules that apply to every prompt below (repeated inside each one
so no prompt depends on memory of an earlier one):

- Read `/docs/00-OVERVIEW.md` through `/docs/05-FRONTEND-ROUTES.md` before
  writing any code.
- No comments in any code file, in any language. Code should be clear
  enough from naming and structure that it doesn't need them.
- Commit as you go, in small logical commits, not one giant commit at the
  end. Write plain, human-style conventional commit messages
  (`feat: add wallet connect flow`, `fix: handle testnet chain switch`).
  Do not add any AI/assistant attribution anywhere: no "Co-Authored-By"
  trailers, no mention of Claude, Anthropic, AI, or any assistant name in
  commit messages, code comments, file headers, or the README. Commits
  should read exactly like they were written by a human contributor.
- Where sub-tasks are genuinely independent (don't share files, don't
  block on each other's output), spawn parallel subagents to work on them
  concurrently and merge the results, instead of doing them serially.
  Each prompt below marks where that split makes sense.
- Verify against the real DreamDEX docs and the starter template
  (`https://github.com/IronicDeGawd/ec-dreamdex-hackathon-template`)
  wherever this repo's docs say "confirm against source" — don't guess at
  API shapes that are one click away from being verified.

---

## Prompt 1 — Repo bootstrap and design system wiring

```
Read /docs/00-OVERVIEW.md, /docs/01-ARCHITECTURE.md, and
/docs/02-DESIGN-SYSTEM.md in full before doing anything else.

Set up a pnpm workspace monorepo named "tikka" with this exact top-level
structure: frontend/, sdk/, packages/core/, docs/ (already populated,
leave it alone), branding/ (already populated, leave it alone),
.gitignore, README.md, pnpm-workspace.yaml, package.json.

Initialize git if it isn't already initialized. Make small, real commits
as you complete each piece below, not one commit at the end. Use plain
human-style conventional commit messages. Do not add any AI/assistant
attribution anywhere in commit messages, code, comments, or the README —
no Co-Authored-By trailers, no mention of any AI tool or assistant name.
Do not write comments in any code file.

frontend/ is a Next.js 15 app, App Router, TypeScript, Tailwind CSS v4.
Wire up the full design system from /docs/02-DESIGN-SYSTEM.md exactly as
specified: the three Google fonts via next/font/google, the @theme inline
mapping in globals.css, the .overflow-theme wrapper class with every
--of-* token, the base resets, the button cursor fix, and the
.of-grid-paper utility. Build the shared layout described in
/docs/05-FRONTEND-ROUTES.md: fixed header with logo, nav links (Docs,
Playground, GitHub), and a Connect Wallet button placeholder (real wallet
logic comes in a later prompt — for now it can be a styled button with no
handler). Create route files for every path listed in
/docs/05-FRONTEND-ROUTES.md as empty-but-styled pages using the design
system, so the site's navigation and layout are real even before content
is filled in.

packages/core is an empty TypeScript package for now, just correctly
wired into the workspace with a build script (tsup), ready for the
DreamDEX client code that comes in the next prompt.

sdk is an empty TypeScript package for now, wired into the workspace with
a tsup config producing both an IIFE build and an ESM/CJS build target,
ready for the widget code that comes in a later prompt.

Write a real root README.md: what Tikka is (pull from
/docs/00-OVERVIEW.md), the repo structure, and setup instructions
(pnpm install, dev commands per package). Write a proper .gitignore for a
pnpm/Next.js/TypeScript monorepo (node_modules, .next, dist, .env*,
.turbo, etc).

Where possible, split independent work across subagents: one handling the
pnpm workspace/tooling/config setup, one handling the design system
implementation in globals.css and the layout shell, and one scaffolding
the empty route files per /docs/05-FRONTEND-ROUTES.md. Merge their work
into a single working `pnpm dev` in frontend/ before finishing.

When done, `pnpm install` and `pnpm --filter frontend dev` should produce
a real, navigable, correctly-styled site with no wallet or SDK
functionality yet.
```

---

## Prompt 2 — DreamDEX core client (`packages/core`)

```
Read /docs/01-ARCHITECTURE.md and /docs/03-DREAMDEX-INTEGRATION.md in
full. Before writing any client code, fetch and read the actual current
docs at https://docs.dreamdex.io/developers/event-contracts and the code
in https://github.com/IronicDeGawd/ec-dreamdex-hackathon-template, since
/docs/03-DREAMDEX-INTEGRATION.md is explicitly a best-effort summary, not
a guaranteed-current spec. Update /docs/03-DREAMDEX-INTEGRATION.md itself
if anything you find differs from what it currently says, so it stays
accurate for later prompts.

Do not write comments in any code file. Commit in small logical steps
with plain human-style conventional commit messages, no AI/assistant
attribution anywhere.

In packages/core, build the typed client described in
/docs/03-DREAMDEX-INTEGRATION.md's "what packages/core needs to expose"
section: listMarkets, getMarket, subscribeToMarket, createPrediction,
subscribeToSettlement, getWalletPositions. Use viem for all on-chain
calls and for building/sending the transaction in createPrediction, using
a connected signer passed in by the caller (this package is
wallet-library-agnostic — it receives a signer/account, it does not
manage wallet connection itself). Fetch contract addresses at runtime
from the markets endpoint rather than hardcoding them. Implement REST
calls for the snapshot data and a WebSocket client for live updates, with
automatic reconnect and a REST-polling fallback if the socket drops,
per the error/edge-case list in /docs/03-DREAMDEX-INTEGRATION.md. Default
to Shannon testnet (chain 50312) config, with mainnet config present but
unused for now.

Handle every edge case listed in /docs/03-DREAMDEX-INTEGRATION.md
explicitly: wrong network, insufficient balance, dropped socket, rejected
transaction, expired window. Each should produce a typed, specific error
result the caller can branch on — no generic thrown strings.

Write a small set of real integration tests (not mocked against a fake
server — actually call Shannon testnet) that exercise listMarkets and
getMarket at minimum, runnable with a single script command. If
createPrediction can be safely tested with trivial testnet stakes, test
it too; note clearly in the test file's surrounding README if any test
requires manual funding of a test wallet first.

Split across subagents where independent: one building the REST/WebSocket
client and reconnect/fallback logic, one building the viem
transaction-building and signing flow for createPrediction, and one
writing the integration tests once the other two expose their interfaces.
Merge into a single typed, documented (via TSDoc-free exported types, not
comments) package that builds cleanly with `pnpm --filter core build`.
```

---

## Prompt 3 — The widget SDK (`sdk`)

```
Read /docs/02-DESIGN-SYSTEM.md and /docs/04-SDK-SPEC.md in full.
packages/core already exists and exposes the client described in
/docs/03-DREAMDEX-INTEGRATION.md — import it as a workspace dependency,
do not duplicate its logic.

Do not write comments in any code file. Commit in small logical steps
with plain human-style conventional commit messages, no AI/assistant
attribution anywhere.

Build the widget exactly as specified in /docs/04-SDK-SPEC.md: a single
underlying component with two entry points. The script-tag entry point
(dist/widget.js, IIFE) scans for [data-tikka] elements on load and also
exposes a global Tikka.mount() function, per the spec's examples. The
React entry point (dist/index.mjs and dist/index.cjs) exports
TikkaWidget with the exact props shown in the spec's React usage example,
react as a peer dependency only.

Mount the widget into a Shadow DOM (mode: "open") and inject the full
design system token set from /docs/02-DESIGN-SYSTEM.md as an inline
style block inside the shadow root at mount time, following section 6 and
7 of that doc. Implement the full state machine from the SDK spec exactly
as diagrammed — idle, connecting-wallet, wallet-connected, wrong-network,
ready, submitting, live, settling, result, and error reachable from any
state — with a visually distinct, deliberately designed render for every
state, no shared generic spinner standing in for more than one. Dispatch
the tikka:connected, tikka:submitted, tikka:settled, and tikka:error
CustomEvents on the mount element exactly as specified, and expose the
matching onConnected/onSubmitted/onSettled/onError props on the React
wrapper. Validate the market and window config at mount time against
packages/core's listMarkets/getMarket and render a clear inline
developer-facing error if either is invalid, distinct from the
end-user-facing error state.

Use wagmi and viem for the actual wallet connection inside the widget
(injected connector at minimum; add WalletConnect if time allows), backed
by packages/core's client for all market data and transaction submission.
This must be a real, working connect-and-predict flow against Shannon
testnet, not a mocked UI.

Follow the copy and content discipline in section 8 of
/docs/02-DESIGN-SYSTEM.md for every piece of microcopy in every widget
state.

Split across subagents where independent: one building the shared state
machine and rendering logic plus the Shadow DOM mounting and style
injection, one building the wagmi/viem wallet-connect and transaction
flow wired to packages/core, and one building the script-tag/IIFE and
React wrapper entry points plus the tsup build config once the core
component's interface is stable. Merge into a single sdk package where
`pnpm --filter sdk build` produces both working output targets.
```

---

## Prompt 4 — Frontend content: landing, docs, playground

```
Read /docs/00-OVERVIEW.md, /docs/02-DESIGN-SYSTEM.md, and
/docs/05-FRONTEND-ROUTES.md in full. The sdk package now exports a real,
working TikkaWidget — import it into frontend the same way an external
developer would (via the workspace package name, not a deep relative
import), to prove it actually works standalone.

Do not write comments in any code file. Commit in small logical steps
with plain human-style conventional commit messages, no AI/assistant
attribution anywhere.

Build the "/" landing page exactly as specified in
/docs/05-FRONTEND-ROUTES.md: the hero contains the real, live
TikkaWidget, wallet-connectable on the spot, predicting on a real Shannon
testnet market — not a screenshot or a recording. Below it, a copyable
one-line embed snippet, a three-step "how it works" section, ecosystem
framing referencing DreamDEX and Somnia, and a footer linking to /docs,
/playground, and the GitHub repo. Write real copy following section 8 of
/docs/02-DESIGN-SYSTEM.md — plain, specific, no filler, no generic AI-page
chrome (no single-word-accented headlines, no uppercase eyebrows unless
genuinely structural, no arrow-suffixed links).

Build every /docs page listed in /docs/05-FRONTEND-ROUTES.md. Every code
block must be real, working, copy-button-enabled, and accurate to the
actual sdk package's current API — pull the examples from
/docs/04-SDK-SPEC.md's usage sections and verify them against the sdk
package's actual exported interface rather than retyping them from memory.

Build all three /playground sub-routes described in
/docs/05-FRONTEND-ROUTES.md, each a convincing mock host surface (dex,
nft, stream) with the real TikkaWidget embedded in context, predicting on
a real testnet market appropriate to that mock page's theme. Build the
/playground index page linking to all three. If time allows after
everything above is solid, build the optional /playground/dashboard
page described in that doc; skip it without hesitation if time is short.

Build a real 404 page following the "empty state is an invitation to act"
guidance in the design system doc.

Split across subagents where independent: one building the landing page,
one building the /docs section content and code-block copy components,
and one building the three /playground mock host pages. Each subagent
should use the same already-built TikkaWidget import and the same shared
layout from Prompt 1 rather than reimplementing header/footer chrome.
Merge so that `pnpm --filter frontend dev` serves a fully navigable,
fully real site end to end.
```

---

## Prompt 5 — Integration QA, polish, and deploy

```
Read every file in /docs before starting. This is the final pass before
the demo: the goal is a live, deployed, end-to-end-working product, not
new features.

Do not write comments in any code file. Commit in small logical steps
with plain human-style conventional commit messages, no AI/assistant
attribution anywhere. This includes the final commits — keep the same
discipline all the way through.

Walk the entire real flow on Shannon testnet, starting from a fresh
wallet with test funds from https://testnet.somnia.network: connect
wallet on the landing page widget, place a prediction, watch the live
countdown, confirm settlement fires tikka:settled and renders the result
state correctly. Do the same on all three /playground pages. Fix
anything broken in that flow before touching anything else — this is the
core deliverable and everything else is secondary to it working live.

Verify every edge case from /docs/03-DREAMDEX-INTEGRATION.md actually
behaves as designed in the real UI, not just in packages/core's tests:
wrong network shows a working switch-network action, insufficient
balance shows a clear message with a working link to the faucet, a
rejected transaction returns the widget to a clean pre-submit state, a
dropped socket falls back to polling without freezing the countdown.

Do a responsive and accessibility pass across every route: mobile down to
common small-phone widths per the breakpoints in
/docs/02-DESIGN-SYSTEM.md, visible keyboard focus everywhere (the
--of-orange focus ring should be visible on every interactive element,
not just some), reduced-motion respected, and no color-only signal for
win/loss (add an icon or label alongside the mint/pink color coding).

Configure and execute deployment: frontend to Vercel with correct
environment variables for the testnet RPC/API endpoints, and confirm the
sdk package's IIFE build is reachable at a stable CDN URL matching the
pattern shown in /docs/04-SDK-SPEC.md's script-tag example. Update the
root README.md with the live URL, the real embed snippet using the live
CDN URL, and clear local setup instructions for judges who want to run it
themselves.

Prepare a demo script as a plain markdown file at
/docs/07-DEMO-SCRIPT.md: a shot list for a 2-3 minute video that shows,
in order, the landing page hero widget working live, one full
predict-to-settle cycle, and the same widget working unmodified across
all three /playground host pages, to make the "drop in anywhere" claim
visually undeniable. Keep the demo script itself free of any AI/assistant
attribution or mention, same as the rest of the repo.

Split across subagents where independent: one running the full manual QA
pass across every route and edge case and filing/fixing issues as found,
one handling accessibility and responsive polish, and one handling the
Vercel/CDN deployment configuration and README update. Reconverge for a
final end-to-end walkthrough together before considering this done.
```
