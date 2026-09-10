# Tikka — SDK Spec (`@tikka/widget`)

## Two embed modes, one core

The widget ships two entry points built from the same internal component:

1. **Script tag (IIFE bundle)** — for any host page, framework-agnostic.
2. **React component (ESM/CJS bundle)** — for React apps, typed props
   instead of data-attributes.

Both mount the identical underlying widget; the wrapper only changes how
config is passed in.

## Script tag usage

```html
<script src="https://cdn.tikka.dev/widget.js"></script>
<div
  data-tikka
  data-market="SOMI-USD"
  data-window="1h"
  data-theme="auto"
  data-size="compact"
></div>
```

- The script scans the page for `[data-tikka]` elements on load and
  mounts a widget instance into each.
- `data-market`: required. A market symbol as returned by
  `GET /v0/markets`.
- `data-window`: required. One of the Event Contract windows DreamDEX
  supports for that market (e.g. `1h`); validate against the market's
  actual available windows at runtime rather than hardcoding a list.
- `data-theme`: `light` | `dark` | `auto` (default `auto`, follows host
  page's `prefers-color-scheme`).
- `data-size`: `compact` | `full` (default `compact`).

A programmatic API is also exposed for host pages that build the element
dynamically:

```html
<script src="https://cdn.tikka.dev/widget.js"></script>
<div id="my-widget"></div>
<script>
  Tikka.mount(document.getElementById("my-widget"), {
    market: "SOMI-USD",
    window: "1h",
    theme: "dark",
  });
</script>
```

## React usage

```tsx
import { TikkaWidget } from "@tikka/widget/react";

export function TokenPage() {
  return (
    <TikkaWidget
      market="SOMI-USD"
      window="1h"
      theme="auto"
      size="compact"
      onSettled={(result) => console.log(result)}
    />
  );
}
```

## Isolation

The widget mounts inside a Shadow DOM (`mode: "open"` so host devtools can
still inspect it for debugging, but host-page CSS cannot leak in and the
widget's CSS cannot leak out). The full token set from
`02-DESIGN-SYSTEM.md` is injected as an inline `<style>` inside the shadow
root at mount time.

## State machine

```
idle
  → connecting-wallet   (user clicked "Connect")
  → wallet-connected
      → wrong-network     (connected, but not Shannon testnet)
      → ready             (connected, correct network, market open)
          → submitting      (transaction sent, awaiting confirmation)
              → live          (position open, countdown running)
                  → settling    (window closed, awaiting settlement)
                      → result    (won / lost, shown with amount)
                          → ready   (user can predict again)
error   (reachable from any state — shows what happened + a retry action)
```

Every state must render something specific and correct — no generic
spinner standing in for more than one state. `error` always explains what
happened and offers a concrete next action (reconnect, switch network,
retry transaction), never a bare "Something went wrong."

## Events

The widget dispatches standard DOM `CustomEvent`s on its mount element, so
non-React host pages can react without any framework:

| Event | Detail payload | Fires when |
|---|---|---|
| `tikka:connected` | `{ address }` | Wallet connects |
| `tikka:submitted` | `{ txHash, predictionId, direction, stake }` | Prediction transaction sent |
| `tikka:settled` | `{ predictionId, outcome: "won" \| "lost", payout }` | Settlement received |
| `tikka:error` | `{ code, message }` | Any error state entered |

The React wrapper exposes the same moments as props (`onConnected`,
`onSubmitted`, `onSettled`, `onError`) rather than requiring
`addEventListener`.

## Config validation

On mount, validate `market` against `listMarkets()` and `window` against
that market's available windows before rendering the interactive UI. If
either is invalid, render a clear inline error in the widget itself
(host developer sees it immediately in their own page, not just in the
console) — this is a developer-facing error state, distinct from the
end-user-facing `error` state above.

## Build output

- `dist/widget.js` — IIFE, self-mounting, no external dependencies bundled
  in a way that could double-load React etc. on a host page. Targets
  modern evergreen browsers only.
- `dist/index.mjs` / `dist/index.cjs` — the React wrapper, `peerDependency`
  on `react` so it uses the host app's existing React install.
- `dist/index.d.ts` — full TypeScript types for the React props and the
  event payloads, generated from the same source as the runtime code, not
  hand-duplicated.

## What NOT to build for the hackathon

- No theming beyond light/dark/auto — no arbitrary color override API.
- No multi-market "watchlist" mode inside a single widget instance — one
  widget instance is one market/window.
- No native mobile SDK.
