---
name: verify
description: Build, launch, and drive E-Optic (Vite + React SPA) to verify changes end-to-end in a real browser.
---

# Verifying E-Optic

Client-only Vite + React app (no backend). All state lives in localStorage
(`optic`, `selectedAnswers`, `correctAnswers`, `timerData`, `examHistory`,
`examSessionId`, `templates`) — seed it to reach any app state instantly.

## Launch

```bash
npx vite --port 5273 --strictPort   # NOT `npm run dev` — that passes --open and pops a window
curl -s -o /dev/null -w "%{http_code}" http://localhost:5273/   # expect 200
```

## Drive (headless browser)

No Playwright in the project. Install `playwright-core` in a scratch dir and
use the system Edge — no browser download needed:

```js
const { chromium } = require("playwright-core");
const browser = await chromium.launch({ channel: "msedge", headless: true });
```

Seed localStorage with `context.addInitScript` — but guard it so it only runs
on the first document load (`sessionStorage.getItem("__seeded")`), otherwise
reloads re-seed and mask state the app wrote (this bit a timer-expiry test).

## Flows worth driving

- **Optic** (`/`): question cells are `#question-<subject>-<q>` (multiSubject)
  or `#question-<q>` (singleSubject); options `.options button:has-text("A")`.
  Finish = `.finish-btn` → `.finish-dialog`.
- **Timer expiry**: seed `timerData: {secondsLeft: 2}`, click "Başlat", wait →
  auto-navigates to `/review`, optic buttons become `disabled`.
- **Review** (`/review`): key mode bulk input `.rv-bulk input` + `.rv-bulk-apply`;
  "Kaydet ve Değerlendir" writes an `examHistory` record (upserts by
  `examSessionId`). Net tiles: `.rv-tile-value` (4th = net).
- **History** (`/history`): seed `examHistory` (needs ≥2 records of the same
  `name` for the chart); chart = `.hs-chart`, points `.hs-dot`, tooltip on
  `mouse.move` over the chart. Theme toggle = `.theme-toggle`.
- **Edit** (`/edit`): saving fires `window.confirm` dialogs — attach
  `page.on("dialog", d => d.accept())` before clicking "Kaydet". Templates
  persist to localStorage key `templates`.

## Gotchas

- Turkish locale numbers in the UI: net 2.5 renders as `2,5`.
- `/favicon.ico` 404s in the console — pre-existing, ignore.
- `npm run lint` must stay at zero warnings (`--max-warnings 0`).
